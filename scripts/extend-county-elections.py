#!/usr/bin/env python3
"""Import verified county/county–district returns without assigning larger totals to counties.
Offline by default. --download refreshes immutable public Dataverse/Census snapshots.
"""
import argparse
import collections
import csv
import hashlib
import io
import json
import re
import subprocess
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / 'scripts/source-data/county-supplements'
OUT = ROOT / 'public/data/county-elections'
SNAPSHOT = '2026-11-06'
SOURCES = {
    'county-pettigrew-2018': dict(file='pettigrew-2018.zip', url='https://dataverse.harvard.edu/api/access/datafile/3543104', sourceUrl='https://doi.org/10.7910/DVN/UYSHST', title='Stephen Pettigrew: November 2018 general election results (county-level)', version='Dataverse V4; national-files.zip file 3543104, published 2019-08-22', license='CC0-1.0'),
    'county-pettigrew-2018-codebook': dict(file='pettigrew-2018-codebook.txt', url='https://dataverse.harvard.edu/api/access/datafile/3337964', sourceUrl='https://doi.org/10.7910/DVN/UYSHST', title='Pettigrew 2018 codebook', version='Dataverse file 3337964', license='CC0-1.0'),
    'county-pettigrew-2018-notes': dict(file='pettigrew-2018-notes.txt', url='https://dataverse.harvard.edu/api/access/datafile/3543105', sourceUrl='https://doi.org/10.7910/DVN/UYSHST', title='Pettigrew 2018 corrections and limitations', version='Dataverse V4 file 3543105', license='CC0-1.0'),
    'county-census-2018-geography': dict(file='census-2018-counties.zip', url='https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2018_Gazetteer/2018_Gaz_counties_national.zip', sourceUrl='https://www.census.gov/geographies/reference-files/time-series/geo/gazetteer-files.2018.html', title='U.S. Census Bureau 2018 national county Gazetteer', version='2018_Gaz_counties_national.zip', license='U.S. federal government public data'),
}
PINNED_SHA256 = {
    'pettigrew-2018.zip': '3134a85e3710188c11423f6f72d9e16d7c92d82390f0d3b360a8b6c62d121fe8',
    'pettigrew-2018-codebook.txt': '106c45261a6a282833abc42b979cd46d22f385ab080f0c916b0936a2d9dcf27c',
    'pettigrew-2018-notes.txt': '8adab7af4334bfaf7b02bccbd3d92a8f4830605e60e3839fd928fa51e5155557',
    'census-2018-counties.zip': '744b5c900ad3aff0fc563078831084a12e46b390905045e91a0cbac07c76b6e4',
}
OFFICE_FILES = {'senate': 'us-senate', 'house': 'us-house', 'governor': 'governor'}
LIMITATIONS = [
    'Supplemental county coverage is 2018 only. Absence in another year means unavailable, not zero votes or no election. No 2025/2026 returns are loaded.',
    'Pettigrew is a research compilation of state returns, not a certification authority. Arizona 2018 Governor is absent from the national archive.',
    'County identifiers are checked against the Census Bureau 2018 county Gazetteer. New England towns/townships are summed only through their explicit source county FIPS; current Connecticut planning-region boundaries differ.',
    'Alaska electoral districts are not counties and are excluded, including the source Alaska-wide House residual. No electoral-district-to-county estimate is made.',
    'Rows lacking valid county FIPS are excluded and retained in exclusions.json. These include Kansas City, Missouri, four New Hampshire units, and the unallocated Maine STATE UOCAVA pool. Missouri, New Hampshire and Maine results carry review flags for the affected offices.',
    'Invalid House district records are excluded: Nebraska district is statewide and West Virginia districts are 11/21/31. Florida districts 10/14/21/24 are absent from the archive. No omitted district votes are inferred.',
    'Illinois Cook records with primary fipscode 00000 are joined only using the explicit ten-digit fipscode2 county prefix 17031, verified against Census; the recovery is flagged.',
    'Six historically at-large 2018 House states (DE, MT, ND, SD, VT, WY) use canonical district 0 after the independently sourced baseline 2018 district inventory confirms that 0 is the only district. Source district 1 is retained in sourceDistrict and normalization provenance.',
    'House geography is county–congressional-district intersection. Multiple House contests in one county remain separate. These are neither whole-county House totals nor inferred district geometry.',
    'Maine House district 2 contains initial ranked-choice preferences, not the final count; stage initial count and sourceNeedsReview suppress a verified winner. Mississippi special Senate is the November first round, not the runoff.',
    'The source notes an unresolved 29-vote discrepancy for Mississippi regular Senate candidate Danny Bedwell; those records are flagged. West Virginia source returns are unofficial.',
    'totalVotes is the source sum of listed candidate/reporting rows, not independently verified official turnout. Fusion ballot lines with an identical candidate name are combined; party labels and exact vote sums are retained.',
    'Blank/overvote/exhausted/scattering and unspecified Other(s) labels are reporting categories, not named candidates. Generic write-in totals remain aggregate write-in entries as supplied.',
    'MEDSL Senate county-level 2022 DOI 10.7910/DVN/YB60EJ V3 was located, but file 7412054 required a guestbook response (HTTP 400). No unsupported mirror, credential, form submission, or inferred county data was used; 2022 county coverage is not loaded.',
]


def dump(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, separators=(',', ':')) + '\n')


def number(value):
    if value in ('', 'NA', None):
        return None
    assert re.fullmatch(r'\d+', value), f'Invalid count {value!r}'
    return int(value)


def party(value):
    label = value.upper()
    if label in ('DEMOCRAT', 'DEMOCRATIC', 'DEM', 'DFL'): return 'Democrat'
    if label in ('REPUBLICAN', 'REP', 'GOP'): return 'Republican'
    return 'Other'


def reporting_category(name):
    label = re.sub(r'\s+', ' ', name.strip().upper())
    if label in ('SCATTER', 'SCATTERING'): return 'unattributedWriteIns'
    if label in ('OTHER', 'OTHERS'): return 'unspecifiedOtherVotes'
    if re.fullmatch(r'EXHAUSTED BALLOTS?', label): return 'exhaustedBallots'
    if re.fullmatch(r'(OVER|UNDER) ?VOTES?', label): return 'overvotes' if label.startswith('OVER') else 'undervotes'
    if re.fullmatch(r'BLANKS?( VOTES?)?', label): return 'blankBallots'
    if re.fullmatch(r'VOID( VOTES?)?', label): return 'voidBallots'
    return None


def review(result, reason):
    result['sourceNeedsReview'] = True
    reasons = result.setdefault('reviewReasons', [])
    if reason not in reasons: reasons.append(reason)


def load_sources(download):
    provenance = {}
    for source_id, source in SOURCES.items():
        path = RAW / source['file']
        if download or not path.exists():
            subprocess.run(['curl', '-fsSL', '--retry', '2', source['url'], '-o', str(path)], check=True)
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        assert digest == PINNED_SHA256[source['file']], f'Snapshot hash differs: {path}'
        provenance[source_id] = {**source, 'sha256': digest, 'snapshotDate': SNAPSHOT}
    return provenance


def main(download=False):
    RAW.mkdir(parents=True, exist_ok=True)
    OUT.mkdir(parents=True, exist_ok=True)
    provenance = load_sources(download)
    with zipfile.ZipFile(RAW / 'census-2018-counties.zip') as archive:
        counties = {r['GEOID']: r for r in csv.DictReader(io.StringIO(archive.read('2018_Gaz_counties_national.txt').decode()), delimiter='\t')}
    # State names are labels only; FIPS validation comes from the independent Census registry.
    state_records = json.loads((ROOT / 'public/data/elections/president-2016.json').read_text())['results']
    state_names = {r['stateFips']: r['state'] for r in state_records}
    district_reference_path = ROOT / 'public/data/elections/house-2018.json'
    district_reference_bytes = district_reference_path.read_bytes()
    district_reference = json.loads(district_reference_bytes)
    house_inventory = collections.defaultdict(set)
    for result in district_reference['results']:
        house_inventory[result['stateAbbr']].add(result['district'])
    normalize_at_large = {'DE', 'MT', 'ND', 'SD', 'VT', 'WY'}
    assert all(house_inventory[state] == {'0'} for state in normalize_at_large), 'At-large baseline inventory changed'
    normalization_reference = dict(referenceUrl='/data/elections/house-2018.json', sha256=hashlib.sha256(district_reference_bytes).hexdigest(), sha256Basis='local baseline browser JSON', sourceUrl=district_reference['sources']['house']['sourceUrl'], version=district_reference['sources']['house']['version'], purpose='2018 House district identity validation only; no vote counts copied', normalizedAtLargeStates=sorted(normalize_at_large), rule='Source district 1 becomes canonical district 0 only in the six states whose baseline 2018 inventory is exactly district 0')
    exclusions = []
    coverage = []
    reports = []
    with zipfile.ZipFile(RAW / 'pettigrew-2018.zip') as archive:
        for office, filename in OFFICE_FILES.items():
            member = f'national-files/{filename}-long.csv'
            content = archive.read(member)
            try:
                source_text = content.decode('utf-8'); encoding = 'utf-8'
            except UnicodeDecodeError:
                source_text = content.decode('cp1252'); encoding = 'cp1252'
            rows = list(csv.DictReader(io.StringIO(source_text)))
            groups = {}
            raw_expected = collections.Counter()
            raw_candidate_labels = collections.defaultdict(set)
            accepted_rows = 0
            for index, row in enumerate(rows, 2):
                fips = row['fipscode']
                reason = None
                recovered_fips = False
                if fips not in counties and re.fullmatch(r'\d{10}', row['fipscode2']) and row['fipscode2'][:5] in counties:
                    fips = row['fipscode2'][:5]
                    recovered_fips = True
                if office == 'house' and row['state'] in ('NE', 'WV'):
                    reason = 'Invalid or unspecified source congressional district'
                elif row['state'] == 'AK': reason = 'Alaska electoral district or unallocated residual; not a county'
                elif fips not in counties: reason = 'No verified 2018 county FIPS'
                elif counties[fips]['USPS'] != row['state']: reason = 'County FIPS/state conflict'
                if reason:
                    exclusions.append(dict(office=office, year=2018, sourceMember=member, sourceLine=index, reason=reason, row=row))
                    continue
                accepted_rows += 1
                special = 'Special' in row['office']
                source_district = row['district'] if office == 'house' else None
                district = '0' if office == 'house' and row['state'] in normalize_at_large and source_district == '1' else source_district
                if office == 'house':
                    assert district in house_inventory[row['state']], f'House district absent from baseline 2018 inventory: {row["state"]} {district}'
                stage = 'first round' if office == 'senate' and special and row['state'] == 'MS' else 'initial count' if office == 'house' and row['state'] == 'ME' and district == '2' else 'general'
                contest_id = f'{office}-2018-{fips[:2]}-{district or "state"}-{stage}-{special}'
                key = fips, contest_id
                group = groups.setdefault(key, dict(geoLevel='county', countyFips=fips, county=counties[fips]['NAME'].strip(), stateFips=fips[:2], state=state_names.get(fips[:2], row['state']), stateAbbr=row['state'], contestId=contest_id, stage=stage, special=special, candidates=[], totalVotes=None, sourceId='county-pettigrew-2018', sourceMember=member, sourceRowCount=0, _candidates={}, _units={}))
                if recovered_fips:
                    group['countyFipsRecoveredFromExplicitFipscode2'] = True
                if district is not None:
                    assert district.isdigit() and 0 <= int(district) <= 53, f'Invalid House district {district}'
                    group.update(district=district, sourceDistrict=source_district, geographicScope='county-district intersection')
                    if district != source_district:
                        group['districtNormalization'] = 'Source district 1 normalized to at-large district 0 after baseline 2018 inventory confirms sole district 0'
                        assert row['state'] in normalize_at_large and house_inventory[row['state']] == {'0'}
                # fipscode2 identifies towns in New England. Include source unit name too:
                # Maine township residuals can legitimately end in 00000.
                unit_key = row['fipscode2'], row['county']
                total = number(row['total.votes'])
                assert total is not None
                if unit_key in group['_units']:
                    assert group['_units'][unit_key] == total, f'Conflicting unit totals: {unit_key}'
                group['_units'][unit_key] = total
                group['sourceRowCount'] += 1
                name = row['candidate'].strip()
                name_key = name.casefold()
                votes = number(row['votes'])
                candidate = group['_candidates'].setdefault(name_key, dict(name=name, party='Other', partyOriginal='', votes=0, _parties=[]))
                if row['party'] and row['party'] not in candidate['_parties']: candidate['_parties'].append(row['party'])
                normalized_party = party(row['party'])
                if normalized_party in ('Democrat', 'Republican'):
                    assert candidate['party'] in ('Other', normalized_party), f'Major-party identity conflict {name}'
                    candidate['party'] = normalized_party
                if votes is None:
                    candidate['votes'] = None; candidate['missingVoteCount'] = True; group['incomplete'] = True
                elif candidate['votes'] is not None: candidate['votes'] += votes
                raw_expected[key, name_key] += votes or 0
                raw_candidate_labels[key].add(name_key)
            results = []
            output_actual = collections.Counter()
            for key, group in sorted(groups.items()):
                units = group.pop('_units')
                group['reportingUnitCount'] = len(units)
                group['countyAggregation'] = 'sum of source town/township returns using explicit verified county FIPS' if group['stateAbbr'] in ('CT', 'MA', 'ME', 'NH', 'RI', 'VT') else 'source county returns'
                group['totalVotes'] = sum(units.values())
                group['totalVotesBasis'] = 'sum of source total.votes once per reporting unit and contest; source totals are sums of listed vote rows'
                candidates = []
                categories = []
                for name_key, candidate in group.pop('_candidates').items():
                    candidate['partyOriginal'] = ' / '.join(candidate.pop('_parties'))
                    output_actual[key, name_key] = candidate['votes'] or 0
                    category = reporting_category(candidate['name'])
                    if category: categories.append(dict(name=candidate['name'], votes=candidate['votes'], category=category))
                    else: candidates.append(candidate)
                group['candidates'] = sorted(candidates, key=lambda c: -(c['votes'] if c['votes'] is not None else -1))
                if categories:
                    group['reportingCategories'] = categories
                    group['reportingCategoryVotes'] = sum(c['votes'] or 0 for c in categories)
                group['candidateVoteSum'] = sum(c['votes'] or 0 for c in candidates)
                known = group['candidateVoteSum'] + group.get('reportingCategoryVotes', 0)
                assert known == group['totalVotes'], f'Source sum mismatch {key}'
                group['percentageDenominatorBasis'] = 'sum of reported candidate and reporting-category votes; not ballots cast or turnout'
                state = group['stateAbbr']
                if state == 'ME': review(group, 'Maine STATE UOCAVA votes have no county allocation in this source and are excluded. County completeness requires review.')
                if state == 'NH': review(group, 'Four New Hampshire reporting units lack verified county FIPS and are excluded. County completeness requires review.')
                if state == 'MO': review(group, 'Kansas City votes lack a verified county allocation and are excluded. County completeness requires review.')
                if office == 'house' and state == 'ME' and group['district'] == '2':
                    review(group, 'Source notes identify these as initial ranked-choice preferences, not final-round results. A final winner must not be inferred.')
                    group['rankedChoiceRound'] = 'initial count'
                if office == 'senate' and state == 'MS' and not group['special']:
                    review(group, 'Source notes report an unresolved 29-vote statewide discrepancy for Danny Bedwell. County allocation of the discrepancy is unknown.')
                if state == 'WV':
                    group['unofficial'] = True
                results.append(group)
            # Exact candidate identities and sums survive county aggregation/fusion.
            assert raw_expected == output_actual, 'Normalized counts differ from source candidate rows'
            assert sum(r['sourceRowCount'] for r in results) == accepted_rows
            for result in results:
                key = result['countyFips'], result['contestId']
                labels = {c['name'].casefold() for c in result['candidates'] + result.get('reportingCategories', [])}
                assert labels == raw_candidate_labels[key]
                assert result['countyFips'] in counties
                assert all(c['votes'] is None or isinstance(c['votes'], int) and c['votes'] >= 0 for c in result['candidates'] + result.get('reportingCategories', []))
            filename_out = f'{office}-2018.json'
            payload = dict(schemaVersion=1, office=office, year=2018, snapshotDate=SNAPSHOT, sources=provenance, results=results)
            if office == 'house':
                payload['districtNormalizationReference'] = normalization_reference
                assert all(r['district'] in house_inventory[r['stateAbbr']] for r in results)
            dump(OUT / filename_out, payload)
            item = dict(office=office, year=2018, url=f'/data/county-elections/{filename_out}', geoLevels=['county'], rows=len(results), contests=len({r['contestId'] for r in results}), stateCount=len({r['stateFips'] for r in results}), candidateCount=sum(len(r['candidates']) for r in results), sourceNeedsReviewCount=sum(bool(r.get('sourceNeedsReview')) for r in results), countyDistrictIntersections=office == 'house')
            coverage.append(item)
            district_checks = dict(allHouseDistrictsMatchBaselineInventory=True, normalizedAtLargeResults=sum(r.get('districtNormalization') is not None for r in results), districtNormalizationReference=normalization_reference) if office == 'house' else {}
            reports.append(dict(**item, **district_checks, sourceRows=len(rows), acceptedSourceRows=accepted_rows, excludedSourceRows=len(rows)-accepted_rows, sourceEncoding=encoding, exactCandidateIdentityAndSums=True, exactReportedUnitTotals=True, nonnegativeCounts=True))
    dump(RAW / 'exclusions.json', exclusions)
    dump(RAW / 'provenance.json', provenance)
    dump(OUT / 'manifest.json', dict(schemaVersion=1, snapshotDate=SNAPSHOT, sources=provenance, coverage=coverage, districtNormalizationReference=normalization_reference, limitations=LIMITATIONS))
    report = dict(status='passed', coverage=reports, excludedSourceRows=len(exclusions), excludedReasons=dict(collections.Counter(r['reason'] for r in exclusions)), geographyValidation='Every accepted county FIPS and state checked against Census 2018 national county Gazetteer', sourceHashesVerified=True, sourceCount=len(provenance), limitations=LIMITATIONS)
    dump(OUT / 'validation.json', report)
    print(json.dumps({k: v for k, v in report.items() if k != 'limitations'}, indent=2))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--download', action='store_true')
    main(parser.parse_args().download)
