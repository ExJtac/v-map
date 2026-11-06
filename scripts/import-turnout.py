#!/usr/bin/env python3
"""Import countywide/statewide ballots cast from pinned official CA participation sources.
Candidate votes are never used as ballots cast. Rebuilds are offline by default.
"""
import argparse, csv, hashlib, io, json, re, zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / 'scripts/source-data/turnout'
OUT = ROOT / 'public/data/turnout'
DATES = {2018:'2018-11-06',2020:'2020-11-03',2022:'2022-11-08',2024:'2024-11-05'}
CONTROLS = {2018:(12712542,19696371),2020:(17785151,22047448),2022:(11146620,21940274),2024:(16140044,22595659)}
PATTERN = re.compile(r'^(?P<name>[A-Za-z][A-Za-z ]*?)(?P<vca>\*)?\s+(?P<precincts>[\d,]+)\s+(?P<eligible>[\d,]+)\s+(?P<registered>[\d,]+)\s+(?P<precinct>[\d,]+\**)\s+(?P<mail>[\d,]+)\s+(?P<total>[\d,]+)(?P<rest>.*)$')


def dump(path, obj):
    path.write_text(json.dumps(obj, ensure_ascii=False, separators=(',', ':')) + '\n')


def verify_file(name, digest):
    assert hashlib.sha256((RAW/name).read_bytes()).hexdigest()==digest,name


def messages(name, kind):
    rows = [line.strip()[1:-1].split('|') for line in (RAW / name).read_text().splitlines()]
    return [r for r in rows if r[0] == kind]


def load_2026(registry):
    receipts = json.loads((RAW / 'receipts.json').read_text())
    for name, receipt in receipts.items(): verify_file(name, receipt['sha256'])
    assert messages('V26GG.txt', 'B')[0][3].startswith('202611')
    codes = {int(r[3]): registry[r[4]] for r in messages('S26GG.txt', 'S') if int(r[3]) <= 58}
    assert len(codes) == len(registry) == 58
    sid = 'ca-sos-2026-status'
    source = dict(title='California Secretary of State: 2026 county reporting status / ballots cast',
                  layoutUrl=receipts['ca-ascii-file-format-v9.pdf']['url'],
                  layoutPages='5–8 (A county status message)', **receipts['V26GG.txt'])
    counties = {}; state = None
    for r in messages('V26GG.txt', 'A'):
        assert len(r) == 15 and r[1] == 'CAS', r
        code = int(r[3]); assert r[4] in ['R', 'F', 'U', ' '], r
        number = lambda v: int(v) if v.strip() else None
        ballots, registered = number(r[10]), number(r[11])
        if ballots is not None and registered: assert abs(ballots / registered * 100 - float(r[12])) <= .11
        last = r[14].strip(); assert not last or (len(last) == 12 and last.startswith('202611'))
        row = dict(year=2026, electionDate='2026-11-03', stage='general', special=False,
                   ballotsCast=ballots, registeredVoters=registered, sourceId=sid,
                   sourceUpdatedAt=f'{last[:4]}-{last[4:6]}-{last[6:8]} {last[8:10]}:{last[10:12]} (source local time)' if last else None,
                   sourceReportType=r[4], precinctsReporting=number(r[7]), precinctsTotal=number(r[8]),
                   unofficial=True, provisional=True,
                   basis='Countywide reported ballots cast, from A-message Voter Turnout field; not final turnout.')
        if code == 59:
            assert state is None; state = row
        else:
            assert code in codes and codes[code] not in counties; counties[codes[code]] = [row]
    assert len(counties) == 58 and state
    for key in ['ballotsCast', 'registeredVoters', 'precinctsReporting', 'precinctsTotal']:
        assert sum(rows[0][key] for rows in counties.values()) == state[key], key
    assert state['ballotsCast']==9027710
    baseline_path=RAW/'baseline-2026-counties.json'
    if baseline_path.exists():
        baseline=json.loads(baseline_path.read_text())
        assert baseline['counties']==counties and baseline['sources']=={sid:source},'Existing2026 records/provenance changed'
    state={**state,'basis':'Statewide reported ballots cast from A-message statewide control59; not final turnout.'}
    return counties,state,{sid:source},receipts


def historical(year, registry, receipts):
    receipt=receipts[str(year)]
    for file_key,hash_key in [('file','sha256'),('textFile','textSha256'),('certificationEvidenceFile','certificationEvidenceSha256')]:verify_file(receipt[file_key],receipt[hash_key])
    sid=f'ca-sos-{year}-participation'
    source=dict(title=f'California Secretary of State: {year} General Election final voter participation statistics by county',
                **receipt, sourceColumn='Total Voters', stage='general', electionDate=DATES[year],
                status='certified Statement of Vote', registrationNote='Registered Voters is the published report denominator, not an election-day population count.')
    if year==2022:source['sourceDiscrepancies']=['The official certification press release reports11146610 ballots and9755188 mail ballots; the final participation table prints11146620 and9755198. County sums match the participation table exactly. The10-ballot discrepancy is retained, not allocated or silently corrected.']
    records={}; state=None; controls={}
    for line in (RAW/receipt['textFile']).read_text().splitlines():
        match=PATTERN.match(line)
        if not match:continue
        values=match.groupdict(); name=values['name'].strip()
        fields={k:int(values[k].rstrip('*').replace(',','')) for k in ('precincts','eligible','registered','precinct','mail','total')}
        assert fields['precinct']+fields['mail']==fields['total']
        registration_basis=('15-day Report of Registration; source excludes voters registered after the15-day close, although same-day registration remains available' if year in (2022,2024) else 'Registered Voters column as published in the final participation table; cutoff is not inferred')
        row=dict(year=year,electionDate=DATES[year],stage='general',special=False,
                 ballotsCast=fields['total'],registeredVoters=fields['registered'],sourceId=sid,
                 sourceUpdatedAt=None,unofficial=False,provisional=False,certified=True,final=True,
                 certificationDate=receipt['certificationDate'],status='certified',
                 basis='Countywide election participation: official Statement of Vote Total Voters column; not candidate votes.',
                 sourceParticipationColumn='Total Voters',registeredVotersBasis=registration_basis,
                 precinctVoters=fields['precinct'],voteByMailVoters=fields['mail'])
        if name=='State Total':
            assert state is None;state={**row,'basis':'Independent published statewide State Total participation row; not candidate votes or district sums.'};controls=fields
        else:
            assert name in registry and registry[name] not in records,(year,name)
            percentages=[float(v) for v in re.findall(r'([\d.]+)%',values['rest'])]
            assert len(percentages)==3
            assert abs(fields['total']/fields['registered']*100-percentages[1])<=.011,(year,name)
            assert abs(fields['mail']/fields['total']*100-percentages[0])<=.011,(year,name)
            records[registry[name]]=row
    assert len(records)==58 and set(records)==set(registry.values()) and state
    assert (state['ballotsCast'],state['registeredVoters'])==CONTROLS[year]
    for key in ('ballotsCast','registeredVoters','precinctVoters','voteByMailVoters'):
        assert sum(r[key] for r in records.values())==state[key],(year,key)
    return records,state,{sid:source},dict(year=year,countyRows=58,printedStateBallotsCast=state['ballotsCast'],printedStateRegisteredVoters=state['registeredVoters'],printedStatePrecinctVoters=state['precinctVoters'],printedStateVoteByMailVoters=state['voteByMailVoters'],countyStateSumsMatch=True,countyModeSumsMatch=True,printedPercentageChecks=True,countyFipsVerified=True,certificationDate=receipt['certificationDate'])


def main(years):
    OUT.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(ROOT / 'scripts/source-data/county-supplements/census-2018-counties.zip') as z:
        registry = {r['NAME'].removesuffix(' County'): r['GEOID'] for r in csv.DictReader(io.StringIO(z.read('2018_Gaz_counties_national.txt').decode()), delimiter='\t') if r['USPS'] == 'CA'}
    counties,state,sources,receipts=load_2026(registry)
    states={'06':[state]}; state_controls={'2026':state}; checks=[]
    historical_receipts=json.loads((RAW/'historical-receipts.json').read_text())
    for year in sorted(years):
        records,control,provenance,check=historical(year,registry,historical_receipts)
        for fips,row in records.items():counties[fips].append(row)
        states['06'].append(control);state_controls[str(year)]=control;sources.update(provenance);checks.append(check)
    for rows in counties.values():rows.sort(key=lambda r:r['year'])
    states['06'].sort(key=lambda r:r['year'])
    keys={(fips,r['year'],r['electionDate'],r['stage'],r['special']) for fips,rows in counties.items() for r in rows}
    row_count=sum(len(rows) for rows in counties.values());assert len(keys)==row_count==58*(len(years)+1)
    for year in [*years,2026]:
        year_rows=[r for rows in counties.values() for r in rows if r['year']==year]
        assert len(year_rows)==58
        for key in ('ballotsCast','registeredVoters'):assert sum(r[key] for r in year_rows)==state_controls[str(year)][key]
    limits=[
        'Countywide/statewide ballots cast are election participation, separate from office and district candidate-vote totals.',
        '2018/2020/2022/2024 records are final official Statement of Vote participation tables with explicit certification evidence; registration denominators use source report cutoffs.',
        '2026 is an unchanged unofficial reported snapshot. Comparing it with a final prior election measures reported ballots so far, not final turnout change.',
        'Precinct reporting does not establish all ballots have been counted. No estimate of remaining ballots is made.',
        'Countywide ballots must never be added across district portions or offices; state totals are independent published controls.',
        'The2022 certification release differs from the participation table by10ballots; the table and its exact county sums are retained and the discrepancy documented.',
        'Ballots cast divided by total population is not registered-voter turnout or eligible-voter turnout; use population reference dates and label the denominator explicitly.',
    ]
    dump(OUT/'counties.json',dict(schemaVersion=1,sources=sources,counties=counties,states=states))
    dump(OUT/'manifest.json',dict(schemaVersion=1,url='/data/turnout/counties.json',countyCount=58,stateCount=1,countyRows=row_count,stateRows=len(states['06']),electionYears=sorted([*years,2026]),sources=sources,limits=limits))
    report=dict(status='passed',countyCount=58,countyRows=row_count,stateRows=len(states['06']),electionYears=sorted([*years,2026]),countyStateSumsMatch=True,ballotsCast=state['ballotsCast'],current2026BallotsCast=state['ballotsCast'],current2026RecordsAndSourcesUnchanged=True,layoutFieldsVerified=True,uniqueCountyElectionRecords=True,stateControls=state_controls,historicalChecks=checks,sources=receipts,historicalSources={str(y):historical_receipts[str(y)] for y in years})
    dump(OUT/'validation.json',report)
    print(json.dumps({k:v for k,v in report.items() if k not in ('sources','historicalSources','stateControls','historicalChecks')},indent=2))


if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--historical-years',nargs='+',type=int,choices=sorted(DATES),default=sorted(DATES));args=parser.parse_args();main(args.historical_years)
