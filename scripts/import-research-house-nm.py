#!/usr/bin/env python3
"""Publish a current-only NM House supplement from retained official snapshots.

This does not overwrite Arizona or existing numeric 2022 baselines. The source's
asterisk remains unknown, never a zero or an allocated district residual.
"""
import argparse
import collections
import csv
import datetime
import hashlib
import json
import re
from pathlib import Path
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / 'scripts/source-data/research-house'
SOURCE_ID = 'research-house-nm-2026-official-county-api'
INVENTORY_SHA = '0e563803ae500ea7c1f91a21e658e4a7352ff6b207d3ff10d5482efa7d6d66cf'


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def write(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, separators=(',', ':')) + '\n')


def normalize(value):
    return re.sub(r'\s+', ' ', value.strip()).upper()


def main(output):
    output.mkdir(parents=True, exist_ok=True)
    receipts = [r for r in json.loads((RAW / 'nm-sources.json').read_text())
                if r['file'].startswith('nm2026-')]
    assert len(receipts) == 5
    for receipt in receipts:
        assert digest(RAW / receipt['file']) == receipt['sha256'], receipt['file']
    html = (RAW / 'nm2026-federal.html').read_text()
    assert 'Unofficial Results' in html
    stamp = re.search(r'Results last updated:</span><span>([^<]+)', html)[1]
    assert stamp.endswith(' MT')
    updated = datetime.datetime.strptime(stamp[:-3], '%m/%d/%Y %I:%M %p')
    updated = updated.replace(tzinfo=ZoneInfo('America/Denver')).isoformat()
    source = dict(next(r for r in receipts if r['file'] == 'nm2026-federal.csv'),
                  sourceUrl='https://electionresults.sos.nm.gov/resultsSW.aspx?type=FED&map=CTY',
                  title='New Mexico Secretary of State 2026 unofficial House county API and district CSV',
                  publisher='New Mexico Secretary of State', sourceIsOfficial=True,
                  license='State public election returns; no added upstream redistribution license stated',
                  asOf=updated, sourceUpdatedAt=updated, sourceUpdatedAtOriginal=stamp,
                  timestampBasis='Explicit source-page Mountain time; retrieval separately retained',
                  snapshotDate='2026-11-06', rawSnapshots=receipts)
    geo = {normalize(r['county']): r['countyFips']
           for r in json.loads((ROOT / 'public/data/elections/president-2020.json').read_text())['results']
           if r['geoLevel'] == 'county' and r['stateAbbr'] == 'NM'}
    assert len(geo) == 33
    csv_rows = [r for r in csv.DictReader((RAW / 'nm2026-federal.csv').open())
                if r['RaceName'] == 'United States Representative']
    districts = {r['RaceID']: r['AreaNum'].removeprefix('DISTRICT ') for r in csv_rows}
    assert set(districts.values()) == {'1', '2', '3'}
    groups = {}
    originals = []

    def base(district, county=None):
        record = dict(office='house', year=2026,
                      geoLevel='county' if county else 'district',
                      state='New Mexico', stateAbbr='NM', stateFips='35', district=district,
                      contestId=f'house-2026-35-{district}-general-False',
                      stage='general', special=False, sourceId=SOURCE_ID, sourceIsOfficial=True,
                      candidates=[], reportingCategories=[], totalVotes=0,
                      totalVotesBasis='sum of actual official candidate returns; not ballots cast',
                      sourceLinks=[source['sourceUrl']], resultStatus='unofficial', unofficial=True,
                      provisional=True, certified=False, countComplete=False,
                      asOf=updated, sourceUpdatedAt=updated, retrievedAt=source['retrievedAt'],
                      geographicScope='county-district intersection' if county else 'district summary',
                      countyScopeInventorySha256=INVENTORY_SHA)
        if county:
            record.update(county=county + ' County', countyFips=geo[normalize(county)])
        return record

    def candidate(name, party_code, party_name, raw_votes, candidate_id):
        assert (party_code, normalize(party_name)) in [('DEM', 'DEMOCRAT'), ('REP', 'REPUBLICAN')]
        votes = None if raw_votes == '*' else int(raw_votes)
        assert votes is None or votes >= 0
        result = dict(name=name.strip(), party='Democrat' if party_code == 'DEM' else 'Republican',
                      partyOriginal=party_name, sourcePartyCode=party_code,
                      votes=votes, sourceCandidateId=str(candidate_id), isWriteIn=False)
        if votes is None:
            result.update(missingVoteCount=True, sourceValueOriginal='*')
        return result

    for race, district in districts.items():
        rows = json.loads((RAW / f'nm2026-house-{race}.json').read_text())
        for row in rows:
            assert str(row['RaceID']) == race and row['AreaNum'] == f'DISTRICT {district}'
            assert row['RaceName'] == 'United States Representative'
            assert row['VoteFor'] == 1 and row['OfficeSeqNo'] == '190'
            fips = geo[normalize(row['CountyName'])]
            key = (fips, district)
            record = groups.setdefault(key, base(district, row['CountyName']))
            record['sourceReportingStatus'] = dict(precinctsReporting=row['PrecinctsReporting'],
                totalPrecincts=row['TotalPrecincts'],
                basis='Source county reporting status; not proof of completed contest count')
            value = candidate(row['calcCandidate'], row['PartyCode'], row['PartyName'],
                              row['calcCandidateVotes'], row['CandidateID'])
            assert not any(c['sourceCandidateId'] == value['sourceCandidateId'] for c in record['candidates'])
            record['candidates'].append(value)
            if value['votes'] is None:
                record.update(totalVotes=None, incomplete=True, sourceNeedsReview=True,
                              totalVotesBasis='Source suppresses a candidate count as *; total withheld without residual allocation',
                              reviewReasons=['Official source small-count suppression; unknown is not zero.'])
            elif record['totalVotes'] is not None:
                record['totalVotes'] += value['votes']
            originals.append(row)

    checks = []
    summaries = {}
    for row in csv_rows:
        district = districts[row['RaceID']]
        matching = [r for r in originals if str(r['RaceID']) == row['RaceID']
                    and str(r['CandidateID']) == row['CandidateID']]
        unknown = sum(r['calcCandidateVotes'] == '*' for r in matching)
        known = sum(int(r['calcCandidateVotes']) for r in matching if r['calcCandidateVotes'] != '*')
        published = int(row['CandidateVotes'])
        assert known <= published if unknown else known == published
        checks.append(dict(district=district, sourceCandidateId=row['CandidateID'],
                           candidate=row['CandidateName'], countyKnownSum=known,
                           sourceDistrictTotal=published, suppressedCountyCells=unknown,
                           status='withheld-source-suppression' if unknown else 'passed',
                           controlKind='Official district CSV versus actual county API candidate ID sums'))
        summary = summaries.setdefault(district, base(district))
        value = candidate(row['CandidateName'], row['PartyCode'],
                          'Democrat' if row['PartyCode'] == 'DEM' else 'Republican',
                          row['CandidateVotes'], row['CandidateID'])
        summary['candidates'].append(value)
        summary['totalVotes'] += value['votes']

    inventory = sorted([list(key) for key in groups])
    assert len(inventory) == 43 and len({key[0] for key in groups}) == 33
    assert hashlib.sha256(json.dumps(inventory, separators=(',', ':')).encode()).hexdigest() == INVENTORY_SHA
    held = [r for r in groups.values() if r.get('sourceNeedsReview')]
    assert len(held) == 1 and held[0]['countyFips'] == '35005' and held[0]['district'] == '2'
    suppressed = [c for r in held for c in r['candidates'] if c['votes'] is None]
    assert len(suppressed) == 1 and suppressed[0]['party'] == 'Democrat'
    assert suppressed[0]['name'] == 'GABRIEL VASQUEZ'
    assert len(checks) == 6 and sum(c['status'] == 'passed' for c in checks) == 5
    results = sorted([*groups.values(), *summaries.values()],
                     key=lambda r: (r.get('countyFips', r['stateFips']), int(r['district'])))
    for record in results:
        record['candidates'].sort(key=lambda c: -(c['votes'] if c['votes'] is not None else -1))
        if record['totalVotes'] is not None:
            assert sum(c['votes'] for c in record['candidates']) == record['totalVotes']
    write(output / 'house-2026.json', dict(schemaVersion=1, office='house', year=2026,
          snapshotDate='2026-11-06', sources={SOURCE_ID: source}, results=results))
    limits = ['All 2026 records are unofficial/provisional; 100% precincts does not establish completed counting.',
              'Chaves County CD2 Democratic count is suppressed as * and remains null, held and unallocated.',
              'No 2022 rows are published by this supplement; valid existing numeric baselines remain unchanged.',
              'New Mexico whole-county anomaly comparisons remain unqualified until a separate scope contract is reviewed.']
    proof = dict(stateAbbr='NM', year=2026, office='house', stage='general', special=False,
                 countyCount=33, districtCount=3, countyDistrictIntersections=43,
                 inventory=inventory, inventorySha256=INVENTORY_SHA, scopeComplete=True,
                 countComplete=False, knownCountyDistrictRecords=42, incompleteCountyDistrictRecords=1)
    validation = dict(status='passed-with-explicit-source-hold', rawSnapshotHashesVerified=5,
                      passedCandidateControls=5, withheldCandidateControls=1, controls=checks,
                      normalizedFileHashes={'/data/research-house-nm/house-2026.json': digest(output / 'house-2026.json')})
    write(output / 'validation.json', validation)
    write(output / 'manifest.json', dict(schemaVersion=1, snapshotDate='2026-11-06',
          sources={SOURCE_ID: source}, coverage=[dict(office='house', year=2026,
          url='/data/research-house-nm/house-2026.json', geoLevels=['county', 'district'],
          rows=46, stateCount=1, countyCount=33, countyDistrictIntersections=True,
          candidateCount=sum(len(r['candidates']) for r in results), reportingCategoryCount=0,
          sourceNeedsReviewCount=1, incompleteCount=1, resultStatus='unofficial', provisional=True)],
          scopeProofs={'2026': proof}, validation=validation, limitations=limits))
    print(json.dumps(dict(counties=33, countyDistrictPortions=43, districtSummaries=3,
                         numericPortions=42, heldPortions=1, passedCandidateControls=5,
                         withheldCandidateControls=1, hashes={p.name: digest(p) for p in sorted(output.glob('*.json'))}), indent=2))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--output-dir', type=Path, default=ROOT / 'public/data/research-house-nm')
    main(parser.parse_args().output_dir.resolve())
