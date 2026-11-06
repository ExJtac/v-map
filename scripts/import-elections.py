#!/usr/bin/env python3
"""Rebuild local browser data from pinned, public election-return snapshots.
No paid API or key. Downloads use curl because some hosts reject urllib's UA.
"""
import argparse, collections, csv, hashlib, json, subprocess, re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / 'scripts/source-data'
OUT = ROOT / 'public/data/elections'
SOURCES = {
 'county-president': dict(file='county-president.csv', url='https://api.electiondata.dev/v1/county-president@2026-10-26.a942e8daa5/download/county-president.csv', title='MEDSL County Presidential Election Returns 2000–2024 (via Election Data mirror)', sourceUrl='https://doi.org/10.7910/DVN/VOQCHQ', mirrorUrl='https://electiondata.dev/datasets/county-president/', version='Dataverse V20; mirror 2026-10-26.a942e8daa5', license='CC0-1.0', geoLevel='county'),
 'state-president': dict(file='state-president.csv', url='https://dataverse.harvard.edu/api/access/datafile/13887042', title='MEDSL U.S. President 1976–2024', sourceUrl='https://doi.org/10.7910/DVN/42MVDX', version='Dataverse V10, file 13887042', license='CC0-1.0', geoLevel='state'),
 'senate': dict(file='senate.tsv', url='https://dataverse.harvard.edu/api/access/datafile/13887039', title='MEDSL U.S. Senate statewide 1976–2024', sourceUrl='https://doi.org/10.7910/DVN/PEJ5QU', version='file 13887039', license='CC0-1.0', geoLevel='state'),
 'house': dict(file='house.csv', url='https://api.electiondata.dev/v1/house-results@2026-10-26.cc2e247a45/download/house-results.csv', title='MEDSL U.S. House 1976–2024 (via Election Data mirror)', sourceUrl='https://doi.org/10.7910/DVN/IG0UN2', mirrorUrl='https://electiondata.dev/datasets/house-results/', version='Dataverse V15; mirror 2026-10-26.cc2e247a45', license='CC0-1.0', geoLevel='district'),
 'governor': dict(file='governor.csv', url='https://raw.githubusercontent.com/fivethirtyeight/election-results/d7a7cff101da28f4ff77114450a964874800ca54/election_results_gubernatorial.csv', title='FiveThirtyEight election-results archive: Governor', sourceUrl='https://github.com/fivethirtyeight/election-results', version='Git commit d7a7cff101da28f4ff77114450a964874800ca54', license='No standalone data license stated; source attribution retained', geoLevel='state'),
}

def dump(path, value):
 path.write_text(json.dumps(value, ensure_ascii=False, separators=(',', ':')) + '\n')

def number(value):
 if value in ('', 'NA', 'NaN', None): return None
 n = float(value)
 assert n >= 0 and n.is_integer(), f'Invalid vote count {value!r}'
 return int(n)

def boolean(value): return str(value).lower() == 'true'
def party(value):
 return 'Democrat' if value.upper() in ('DEMOCRAT','DEMOCRATIC','DEM','DFL') else 'Republican' if value.upper() in ('REPUBLICAN','REP','GOP') else 'Other'
def fips(value, width=2): return str(int(float(value))).zfill(width) if value else None


def reporting_category(name):
 """Match whole reporting labels, never names such as Don Blankenship."""
 label = re.sub(r'\s+', ' ', name.strip().upper())
 if re.fullmatch(r'EXHAUSTED BALLOTS?', label): return 'exhaustedBallots'
 if re.fullmatch(r'(OVER|UNDER) ?VOTES?', label): return 'overvotes' if label.startswith('OVER') else 'undervotes'
 if re.fullmatch(r'BLANKS?( VOTES?)?', label): return 'blankBallots'
 if re.fullmatch(r'VOID( VOTES?)?', label): return 'voidBallots'
 if label == 'SPOILED': return 'spoiledBallots'
 if label in ('SCATTER', 'SCATTERING'): return 'unattributedWriteIns'
 if label in ('BLANK VOTE/SCATTERING', 'BLANK VOTE/VOID VOTE/SCATTERING', 'BLANK/VOID/SCATTERING', 'BLANK/VOID'): return 'mixedReportingCategory'
 return None


def main(download=False):
 RAW.mkdir(parents=True, exist_ok=True); OUT.mkdir(parents=True, exist_ok=True)
 data = {}
 provenance = {}
 for key, source in SOURCES.items():
  path = RAW / source['file']
  if download or not path.exists(): subprocess.run(['curl','-fL','--retry','2',source['url'],'-o',str(path)],check=True)
  provenance[key] = {**source, 'sha256':hashlib.sha256(path.read_bytes()).hexdigest(), 'snapshotDate':'2026-11-06'}
  data[key] = list(csv.DictReader(path.open(), delimiter='\t' if path.suffix=='.tsv' else ','))
 states = {r['state_po']: fips(r['state_fips']) for r in data['state-president']}
 stateNames = {r['state_po']: r['state'].title() for r in data['state-president']}
 groups = {}
 skipped = collections.Counter()
 for sourceId, rows in data.items():
  office = 'president' if 'president' in sourceId else sourceId
  for r in rows:
   year = int(r.get('year', r.get('cycle',0)))
   if not 2006 <= year <= 2024: continue
   geo = SOURCES[sourceId]['geoLevel']; state = r.get('state_po',r.get('state_abbrev'))
   stateFips = fips(r.get('state_fips')) or states.get(state)
   if not stateFips: skipped['non-state returns']+=1; continue
   countyFips = fips(r.get('county_fips'),5)
   # Alaska election districts are not counties. Retain source in raw CSV, never map as county.
   if geo == 'county' and not countyFips: skipped['non-county reporting unit'] += 1; continue
   sourceStage = r.get('stage','general')
   stage = sourceStage.lower()
   stage = {'gen':'general','gen runoff':'runoff','pre':'first round'}.get(stage,stage)
   if boolean(r.get('runoff')): stage = 'runoff'
   special = boolean(r.get('special'))
   stageOverride=None
   if office=='senate' and stage=='general':
    if year==2008 and stateFips=='13' and not special:
     stageOverride=dict(fromStage=sourceStage,toStage='runoff',date='2008-12-02',reason='House Clerk official statistics identify these Chambliss/Martin totals as the December 2 runoff.',sourceUrl='https://clerk.house.gov/member_info/electionInfo/2008/2008Stat.htm')
    elif year==2018 and stateFips=='28' and special:
     stageOverride=dict(fromStage=sourceStage,toStage='runoff',date='2018-11-27',reason='Mississippi certified general-runoff report identifies Hyde-Smith 486769 / Espy 420819.',sourceUrl='https://sos.ms.gov/elections/electionresults/2018GeneralRunoff/Certified%20Results/United%20States%20Senate%20Special.pdf')
   if stageOverride: stage='runoff'

   district = r.get('district') if geo == 'district' else None
   # source's race id distinguishes separate election rounds/specials for Governor.
   raceId = r.get('race_id') or f'{stateFips}-{district or "state"}-{stage}-{special}'
   contestId = f'{office}-{year}-{raceId}'
   key = (office,year,geo,stateFips,countyFips,district,contestId)
   if key not in groups:
    groups[key] = dict(geoLevel=geo,stateFips=stateFips,state=stateNames.get(state,state),stateAbbr=state,contestId=contestId,stage=stage,special=special,candidates=[],totalVotes=None,sourceId=sourceId)
    if countyFips: groups[key].update(countyFips=countyFips,county=r['county_name'].title())
    if district is not None: groups[key]['district'] = district
   g=groups[key]
   g['sourceStage']=sourceStage
   if stageOverride: g['sourceStageOverride']=stageOverride
   votes=number(r.get('votes') if office=='governor' else r.get('candidatevotes'))
   total=number(r.get('totalvotes'))
   if total is not None:
    if g['totalVotes'] is not None and g['totalVotes']!=total: g['sourceTotalConflict']=True
    g['totalVotes']=max(g['totalVotes'] or 0,total)
   name=(r.get('candidate_name') or r.get('candidate') or r.get('alt_result_text') or 'Unspecified').strip()
   original=r.get('ballot_party') if office=='governor' else r.get('party_simplified',r.get('party',''))
   original=original or r.get('party_detailed') or ''
   detailed=r.get('party_detailed') or r.get('party') or original
   candidate=next((c for c in g['candidates'] if c['name'].upper()==name.upper()),None)
   if candidate is None:
    candidate=dict(name=name,party=party(original),partyOriginal=detailed,votes=votes)
    g['candidates'].append(candidate)
   else:
    candidate['votes']=candidate['votes']+votes if candidate['votes'] is not None and votes is not None else None
    if party(original) in ('Democrat','Republican'): candidate['party']=party(original)
    if detailed and detailed not in candidate['partyOriginal'].split(' / '): candidate['partyOriginal']+=' / '+detailed
   if votes is None: candidate['missingVoteCount']=True;g['incomplete']=True
   if boolean(r.get('unofficial')):g['unofficial']=True
   if office=='governor':
    g.setdefault('sourceLinks',[])
    if r['source'] and r['source'] not in g['sourceLinks']: g['sourceLinks'].append(r['source'])
    if r.get('ranked_choice_round'): g['rankedChoiceRound']=r['ranked_choice_round']
    if boolean(r.get('winner')): candidate['sourceWinner']=True
 byfile=collections.defaultdict(list)
 for (office,year,*_),g in groups.items():
  categories=[]; actual=[]
  for c in g['candidates']:
   category=reporting_category(c['name'])
   if category: categories.append(dict(name=c['name'],votes=c['votes'],category=category))
   else: actual.append(c)
  g['candidates']=sorted(actual,key=lambda c: -(c['votes'] if c['votes'] is not None else -1))
  if categories:
   g['reportingCategories']=categories
   g['reportingCategoryVotes']=sum(c['votes'] or 0 for c in categories)
   g['candidateVoteSum']=sum(c['votes'] or 0 for c in actual)
   g['percentageDenominatorBasis']='source total, including any reported ballot categories; not necessarily valid candidate votes'
  if any(c['category']=='exhaustedBallots' for c in categories):
   g['sourceNeedsReview']=True
   g['reviewReasons']=['Ranked-choice source contains an exhausted-ballot category; candidate round and source denominator require independent verification. Winner, share and margin are suppressed.']
  if office=='senate' and year==2014 and g['stateFips']=='22':
   g['sourceNeedsReview']=True
   g['reviewReasons']=['Source labels one general contest with 3,523,183 votes and apparently combined election-round counts. Individual rounds require independent verification. Winner, share and margin are suppressed; no missing round is synthesized.']
  known=sum(c['votes'] or 0 for c in actual+categories)
  if g['totalVotes'] is None: g['totalVotes']=known;g['totalVotesBasis']='sum of reported candidate and reporting-category rows'
  if known!=g['totalVotes']:
   g['candidateVoteSum']=sum(c['votes'] or 0 for c in actual)
   g['reportedEntryVoteSum']=known
   g['voteTotalMismatch']=True
  byfile[office,year].append(g)
 manifest=dict(schemaVersion=1,snapshotDate='2026-11-06',firstYear=2006,lastYear=2024,sources=provenance,coverage=[],limitations=[
  'Historical snapshot, not a live feed. No 2025 or 2026 returns are loaded; do not interpret missing data as no election.',
  'County results are available only for President. Senate and Governor are statewide; House is congressional district only.',
  'Alaska election-district presidential returns are excluded from county maps; statewide presidential totals remain available.',
  'Connecticut results use historical county FIPS, which do not match the current planning-region county equivalents.',
  'MEDSL source unofficial flags and missing candidate counts are retained. Research compilations are not a certification authority.',
  'Separate stages and special elections are distinct contests. A statewide party-color summary must choose a contest, not sum different Senate seats or election rounds.',
  'Noncandidate ballot categories are retained separately. Exhausted-ballot records require review; winner/share/margin are suppressed until verified.',
  'House returns use election-year districts; no district-to-county inference or historical district geometry is supplied.',
  'Governor archive is statewide, includes Louisiana jungle-primary/runoff and Wisconsin recall stages, and has no county data. No assumption of complete coverage for special or recall elections.',
 ])
 for (office,year),results in sorted(byfile.items()):
  sourceIds=sorted(set(r['sourceId'] for r in results))
  filename=f'{office}-{year}.json'
  payload=dict(schemaVersion=1,office=office,year=year,snapshotDate='2026-11-06',sources={s:provenance[s] for s in sourceIds},results=results)
  dump(OUT/filename,payload)
  manifest['coverage'].append(dict(office=office,year=year,url=f'/data/elections/{filename}',geoLevels=sorted(set(r['geoLevel'] for r in results)),contests=len(set(r['contestId'] for r in results)),rows=len(results),stateCount=len(set(r['stateFips'] for r in results)),candidateCount=sum(len(r['candidates']) for r in results),unofficialCount=sum(bool(r.get('unofficial')) for r in results),incompleteCount=sum(bool(r.get('incomplete')) for r in results)))
 dump(OUT/'manifest.json',manifest)
 dump(RAW/'provenance.json',provenance)
 report=dict(files=len(byfile),geographicResults=len(groups),candidateEntries=sum(len(g['candidates']) for g in groups.values()),reportingCategoryEntries=sum(len(g.get('reportingCategories',[])) for g in groups.values()),sourceNeedsReviewCount=sum(bool(g.get('sourceNeedsReview')) for g in groups.values()),sourceStageOverrideCount=sum(bool(g.get('sourceStageOverride')) for g in groups.values()),skipped=dict(skipped),coverage=manifest['coverage'])
 dump(OUT/'validation.json',report)
 print(json.dumps({k:v for k,v in report.items() if k!='coverage'},indent=2))

if __name__ == '__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--download',action='store_true');main(parser.parse_args().download)
