#!/usr/bin/env python3
"""Import true ballots cast separately from candidate votes using CA's A-message layout."""
import csv, hashlib, io, json, zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / 'scripts/source-data/turnout'
OUT = ROOT / 'public/data/turnout'

def dump(path, obj):
    path.write_text(json.dumps(obj, ensure_ascii=False, separators=(',', ':')) + '\n')

def messages(name, kind):
    rows = [line.strip()[1:-1].split('|') for line in (RAW / name).read_text().splitlines()]
    return [r for r in rows if r[0] == kind]

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    receipts = json.loads((RAW / 'receipts.json').read_text())
    for name, receipt in receipts.items():
        assert hashlib.sha256((RAW / name).read_bytes()).hexdigest() == receipt['sha256'], name
    assert messages('V26GG.txt', 'B')[0][3].startswith('202611')
    with zipfile.ZipFile(ROOT / 'scripts/source-data/county-supplements/census-2018-counties.zip') as z:
        registry = {r['NAME'].removesuffix(' County'): r['GEOID'] for r in csv.DictReader(io.StringIO(z.read('2018_Gaz_counties_national.txt').decode()), delimiter='\t') if r['USPS'] == 'CA'}
    codes = {int(r[3]): registry[r[4]] for r in messages('S26GG.txt', 'S') if int(r[3]) <= 58}
    assert len(codes) == len(registry) == 58
    sid = 'ca-sos-2026-status'
    source = dict(title='California Secretary of State: 2026 county reporting status / ballots cast',
                  layoutUrl=receipts['ca-ascii-file-format-v9.pdf']['url'],
                  layoutPages='5–8 (A county status message)', **receipts['V26GG.txt'])
    counties = {}
    state = None
    for r in messages('V26GG.txt', 'A'):
        assert len(r) == 15 and r[1] == 'CAS', r
        code = int(r[3])
        assert r[4] in ['R', 'F', 'U', ' '], r
        # Official layout: blanks mean no reported value, not zero.
        number = lambda v: int(v) if v.strip() else None
        ballots, registered = number(r[10]), number(r[11])
        if ballots is not None and registered:
            assert abs(ballots / registered * 100 - float(r[12])) <= .11
        last = r[14].strip()
        assert not last or (len(last) == 12 and last.startswith('202611'))
        row = dict(year=2026, electionDate='2026-11-03', stage='general', special=False,
                   ballotsCast=ballots, registeredVoters=registered, sourceId=sid,
                   sourceUpdatedAt=f'{last[:4]}-{last[4:6]}-{last[6:8]} {last[8:10]}:{last[10:12]} (source local time)' if last else None,
                   sourceReportType=r[4], precinctsReporting=number(r[7]), precinctsTotal=number(r[8]),
                   unofficial=True, provisional=True,
                   basis='Countywide reported ballots cast, from A-message Voter Turnout field; not final turnout.')
        if code == 59:
            assert state is None
            state = row
        else:
            assert code in codes and codes[code] not in counties
            counties[codes[code]] = [row]
    assert len(counties) == 58 and state
    for key in ['ballotsCast', 'registeredVoters', 'precinctsReporting', 'precinctsTotal']:
        assert sum(rows[0][key] for rows in counties.values()) == state[key], key
    dump(OUT / 'counties.json', dict(schemaVersion=1, sources={sid:source}, counties=counties))
    dump(OUT / 'manifest.json', dict(schemaVersion=1, url='/data/turnout/counties.json', countyCount=58,
         electionYears=[2026], sources={sid:source}, limits=[
             'Countywide election participation, separate from office/district vote totals.',
             'Unofficial reported snapshot; remaining ballots and certification are not inferred.',
             'Precinct reporting does not establish all ballots have been counted.',
             'Countywide ballots must never be added across district portions or offices.',
             'No estimate of missing county participation is made.'
         ]))
    dump(OUT / 'validation.json', dict(status='passed', countyRows=58, countyStateSumsMatch=True,
         ballotsCast=state['ballotsCast'], layoutFieldsVerified=True, sources=receipts))
    print(json.dumps(dict(counties=58, reportedBallotsCast=state['ballotsCast'], countyStateSumsMatch=True), indent=2))

if __name__ == '__main__':
    main()
