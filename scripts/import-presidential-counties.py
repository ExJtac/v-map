#!/usr/bin/env python3
"""Offline, source-pinned presidential county repairs. Never modify baseline JSON.

Requires Poppler pdftotext. Counts are parsed from official Hawaii CSV/PDFs;
the only arithmetic geographic transformation is exact subtraction of a uniquely
identified whole-county precinct from an administrative Maui+Kalawao total.
"""
import collections
import copy
import csv
import hashlib
import io
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / 'scripts/source-data/presidential-counties'
OUT = ROOT / 'public/data/presidential-counties'
YEARS = (2008, 2012, 2016, 2020, 2024)
SNAPSHOT = '2026-11-06'
LIMITATIONS = [
    'Only actual presidential general-election years 2008, 2012, 2016, 2020 and 2024 occur within 2006–2026. No 2026 presidential election or fabricated returns.',
    'Alaska official returns use election districts, not county equivalents. All 29 Alaska geometries in the bundled 2017 atlas remain unavailable; no borough allocation or population estimate is made.',
    'Hawaii administrative Maui summaries include Kalawao. Both Maui and Kalawao must replace the baseline together to avoid double-counting. Exact official Kalawao precinct counts are subtracted candidate by candidate from the official administrative Maui summary.',
    'Kalawao is precinct 13-12 plus its explicitly isolated AB-30 absentee group in 2008; precinct 13-09 in 2012–2024, including both regular and VSC splits in 2024. Never treat the zero election-day 2008 precinct as the county total.',
    'Hawaii totalVotes here is the sum of reported candidate votes, excluding blank and overvotes. No turnout or blank/overvote split is inferred from the 2012–2024 candidate CSV.',
    'Shannon 46113 to Oglala Lakota 46102 in 2008/2012 is an official name/code-only crosswalk, not a boundary allocation. Historical original FIPS and source counts are retained.',
    'Bedford independent city 51515 is absent from the current atlas. Historical 2008/2012 city returns remain in the immutable baseline; they are not assigned to the current Bedford County polygon, whose boundaries changed in 2013.',
    'The reused Heideman v1.0.0 archive has no additional presidential counties beyond the baseline. Its 2024 Oglala Lakota code 46113 is obsolete and is not imported.',
]


def dump(path, data):
    path.write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')) + '\n')


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def number(value):
    assert re.fullmatch(r'\d+', value), repr(value)
    return int(value)


def key(name):
    name = re.sub(r'^\([A-Z]+\)\s*', '', name)
    name = name.split('/')[0].splitlines()[0].strip()
    return re.sub(r'\W', '', name).casefold()


def source_party(label):
    return 'Democrat' if label == 'D' else 'Republican' if label == 'R' else 'Other'


def base_record(year, fips, county, source_id):
    return dict(geoLevel='county', countyFips=fips, county=county,
                stateFips='15', state='Hawaii', stateAbbr='HI',
                contestId=f'president-{year}-15-state-general-False',
                stage='general', special=False, sourceId=source_id,
                geographicScope='whole county', candidates=[])


def finish(record):
    record['candidates'].sort(key=lambda c: -c['votes'])
    record['candidateVoteSum'] = sum(c['votes'] for c in record['candidates'])
    record['totalVotes'] = record['candidateVoteSum'] + sum(c['votes'] for c in record.get('reportingCategories', []))
    record['totalVotesBasis'] = 'sum of reported candidate and separately identified reporting-category votes; not ballots cast'
    assert all(type(c['votes']) is int and c['votes'] >= 0 for c in record['candidates'] + record.get('reportingCategories', []))


def hawaii(year, baseline):
    media = RAW / f'hi-{year}-media.txt'
    content = media.read_bytes()
    text = content.decode('utf-16') if content[:2] == b'\xff\xfe' else content.decode('utf-8-sig')
    if year == 2024:
        assert text.startswith('Format#1\r\n#')
        text = text.split('\n', 1)[1].lstrip('#')
    rows = list(csv.DictReader(io.StringIO(text)))
    pk, ck, nk = ('Precinct Name', 'Contest Title', 'Candidate Name') if year == 2008 else ('Precinct_Name', 'Contest_title', 'Candidate_name')
    fields = ['Total Votes'] if year == 2008 else ['Mail votes', 'In-Person votes'] if year == 2024 else ['Absentee_votes', 'Early_votes', 'Election_Votes']
    units = {'13-12', 'AB-30'} if year == 2008 else {'13-09'}
    selected = [(i, row) for i, row in enumerate(rows, 2) if row.get(ck) == 'President and Vice President' and row[pk] in units]
    assert len(selected) == {2008: 12, 2012: 4, 2016: 5, 2020: 6, 2024: 12}[year]
    kal = base_record(year, '15005', 'Kalawao', f'president-hi-{year}-media')
    kal.update(sourceRecordNumbers=[i for i, _ in selected], sourceRecordNumberBasis='1-based CSV logical record including header, after removal of 2024 Format#1 preamble',
               sourcePrecincts=sorted(units), reportingUnitCount=2 if year in (2008, 2024) else 1,
               countyAggregation='exact official county precinct; includes all separately reported voting modes/splits',
               geographicEvidenceSourceIds=['president-hi-2008-election-report', 'president-hi-2008-sov'] if year == 2008 else ['president-hi-2012-molokai-map', 'president-hi-2016-precinct-descriptions'] if year < 2024 else ['president-hi-2024-hd13'])
    candidates = {}
    for _, row in selected:
        ticket = row[nk]
        label = re.match(r'^\(([A-Z]+)\)', ticket).group(1)
        candidate = candidates.setdefault(key(ticket), dict(name=re.sub(r'^\([A-Z]+\)\s*', '', ticket).split('/')[0].splitlines()[0].strip(),
            party=source_party(label), partyOriginal=label, votes=0, ticketOriginal=ticket))
        candidate['votes'] += sum(number(row[field]) for field in fields)
    kal['candidates'] = list(candidates.values())
    finish(kal)
    assert kal['totalVotes'] == {2008:31, 2012:27, 2016:20, 2020:24, 2024:18}[year]
    # Parse the first-column President section, stopping before the next federal office.
    summary_path = RAW / f'hi-{year}-maui-summary.pdf'
    summary = subprocess.check_output(['pdftotext', '-f', '1', '-l', '1', '-x', '0', '-y', '0', '-W', '260', '-H', '790', '-layout', str(summary_path), '-']).decode()
    section = re.split(r'\n(?:U\.?S\.? Senator|U\.?S\.? Representative)', summary)[0]
    matches = re.findall(r'^\(([A-Z]+)\) (.+?)\s+([\d,]+)\s+[\d.]+%', section, re.M)
    assert len(matches) == len(candidates), (year, matches)
    maui = base_record(year, '15009', 'Maui', f'president-hi-{year}-maui-summary')
    maui.update(sourcePage=1, normalization='official administrative Maui total minus independently reported whole Kalawao precinct, candidate by candidate',
                subtractedSourceId=kal['sourceId'], subtractedCountyFips='15005',
                geographicEvidenceSourceIds=kal['geographicEvidenceSourceIds'],
                replacesBaselineCountyFips='15009', sourceAdministrativeCandidates=[])
    base_maui = next(r for r in baseline['results'] if r.get('countyFips') == '15009')
    for label, name, count in matches:
        k = key(name)
        assert k in candidates, (year, name, candidates)
        count = int(count.replace(',', ''))
        c = copy.deepcopy(candidates[k]); c['votes'] = count - c['votes']
        assert source_party(label) == c['party']
        maui['candidates'].append(c)
        maui['sourceAdministrativeCandidates'].append(dict(name=name, partyOriginal=label, votes=count))
        if label in ('D', 'R'):
            assert count == sum(c['votes'] for c in base_maui['candidates'] if c['party'] == source_party(label))
    assert sum(c['votes'] for c in maui['sourceAdministrativeCandidates']) == base_maui['totalVotes']
    finish(maui)
    assert maui['totalVotes'] + kal['totalVotes'] == base_maui['totalVotes']
    return [maui, kal]


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    sources = json.loads((RAW / 'provenance.json').read_text())
    baseline_pins = json.loads((RAW / 'baseline-sha256.json').read_text())
    for source in sources.values():
        assert sha(RAW / source['file']) == source['sha256'], source['file']
    geometry_path = ROOT / 'node_modules/us-atlas/counties-albers-10m.json'
    geometries = json.loads(geometry_path.read_text())['objects']['counties']['geometries']
    geo = {str(g['id']).zfill(5): g['properties']['name'] for g in geometries}
    assert len(geo) == 3142
    manifests, inventories = [], []
    for year in YEARS:
        path = ROOT / f'public/data/elections/president-{year}.json'
        before = sha(path)
        assert before == baseline_pins[str(year)], f'Immutable baseline changed: {path}'
        baseline = json.loads(path.read_text())
        results = hawaii(year, baseline)
        if year in (2008, 2012):
            row = copy.deepcopy(next(r for r in baseline['results'] if r.get('countyFips') == '46113'))
            sid = f'president-medsl-baseline-{year}'
            sources[sid] = dict(file=f'public/data/elections/president-{year}.json', url=f'/data/elections/president-{year}.json',
                sourceUrl=baseline['sources']['county-president']['sourceUrl'], title='Immutable MEDSL baseline used only for official name/code crosswalk',
                sha256=before, sha256Basis='local immutable browser JSON', upstreamSource=baseline['sources']['county-president'], snapshotDate=SNAPSHOT)
            row.update(countyFips='46102', county='Oglala Lakota', sourceCountyFips='46113', sourceCounty='Shannon', sourceId=sid,
                geographicEvidenceSourceIds=['president-nws-oglala-rename'], normalization='name/code-only Census crosswalk effective 2015-05-01; no boundary allocation')
            other = [c for c in row['candidates'] if c['name'].upper() == 'OTHER']
            row['candidates'] = [c for c in row['candidates'] if c not in other]
            row['reportingCategories'] = [dict(name=c['name'], votes=c['votes'], category='unspecifiedOtherVotes') for c in other]
            finish(row); results.append(row)
        assert all(r['countyFips'] in geo and r['countyFips'][:2] == r['stateFips'] for r in results)
        base_fips = {r['countyFips'] for r in baseline['results'] if r['geoLevel'] == 'county'}
        merged_fips = base_fips | {r['countyFips'] for r in results}
        inventories.append(dict(year=year, atlasCountyCount=len(geo), baselineCountyRecords=len(base_fips),
            missingBefore=sorted(set(geo)-base_fips), missingAfter=sorted(set(geo)-merged_fips),
            unmappedBaseline=sorted(base_fips-set(geo)), matchedAtlasCount=len(set(geo)&merged_fips),
            unresolvedReason='All remaining atlas gaps are Alaska election-district versus county-equivalent geography mismatch; no allocation attempted',
            baselineSha256=before, baselineUnchanged=sha(path)==before))
        assert all(f.startswith('02') for f in inventories[-1]['missingAfter'])
        assert inventories[-1]['baselineUnchanged']
        payload = dict(schemaVersion=1, office='president', year=year, snapshotDate=SNAPSHOT, sources=sources, results=results)
        dump(OUT / f'president-{year}.json', payload)
        manifests.append(dict(office='president', year=year, url=f'/data/presidential-counties/president-{year}.json', geoLevels=['county'], rows=len(results),
            contests=len({r['contestId'] for r in results}), stateCount=len({r['stateFips'] for r in results}), candidateCount=sum(len(r['candidates']) for r in results),
            sourceNeedsReviewCount=0, countyDistrictIntersections=False))
    # Keep every annual file's source registry consistent after adding both baseline references.
    for year in YEARS:
        p = OUT / f'president-{year}.json'; d=json.loads(p.read_text()); d['sources']=sources; dump(p,d)
    report = dict(status='passed', sourceHashesVerified=True, exactCandidateSubtraction=True, immutableBaseline=True,
        geometrySha256=sha(geometry_path), inventory=inventories, coverage=manifests, limitations=LIMITATIONS)
    dump(RAW / 'validation.json', report)
    dump(OUT / 'manifest.json', dict(schemaVersion=1, snapshotDate=SNAPSHOT, sources=sources, coverage=manifests, limitations=LIMITATIONS,
        inventory=inventories))
    print(json.dumps(dict(status='passed', coverage=manifests, inventory=inventories), indent=2))


if __name__ == '__main__':
    main()
