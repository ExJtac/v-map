#!/usr/bin/env python3
"""Offline, bounded official Vermont2026 governor import; no geographic inference."""
import collections,csv,hashlib,io,json,re,zipfile
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo
ROOT=Path(__file__).resolve().parents[1]
RAW=ROOT/'scripts/source-data/current-governors'
OUT=ROOT/'public/data/current-governors'
SID='current-governor-vt2026'

def dump(p,j):p.write_text(json.dumps(j,ensure_ascii=False,separators=(',',':'))+'\n')
def load(f):return json.loads((RAW/f).read_text())
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def main():
 provenance=load('provenance.json')
 for s in provenance.values():assert sha(RAW/s['file'])==s['sha256'],s['file']
 general=load('vt2026-general.json');assert general['electionDetails']['electionId']==7100 and general['electionDetails']['isOfficial'] is False
 updated=datetime.strptime(general['lastUpdatedDate'],'%m/%d/%Y %I:%M %p').replace(tzinfo=ZoneInfo('America/New_York')).isoformat()
 assert provenance[SID]['sourceUpdatedAt']==updated
 with zipfile.ZipFile(RAW/'census-2018-counties.zip') as z:
  counties={r['NAME'].removesuffix(' County').upper():r['GEOID'] for r in csv.DictReader(io.StringIO(z.read('2018_Gaz_counties_national.txt').decode()),delimiter='\t') if r['USPS']=='VT'}
 assert len(counties)==14
 townCounty=collections.defaultdict(set)
 for r in general['townDistricts']:townCounty[r['townId']].add(r['countyName'])
 offices=[o for d in load('vt2026-stateWide.json')['d'] for o in d['o'] if o['on']=='GOVERNOR'];assert len(offices)==1
 office=offices[0];assert office['oid']==5 and office['vf']==1
 portions=[r for r in office['cs'] if r['tid']!=0];stateRows=[r for r in office['cs'] if r['tid']==0];assert len(stateRows)==1
 summ=stateRows[0];assert len(portions)==len({(r['tid'],r['repd'],r['send']) for r in portions})
 groups={};controls=[]
 def group(county=None):
  g=dict(office='governor',year=2026,geoLevel='county' if county else 'state',stateFips='50',state='Vermont',stateAbbr='VT',contestId='governor-2026-50-state-general-False',stage='general',special=False,sourceId=SID,sourceIds=[SID],sourceLinks=[provenance[SID]['url']],sourceIsOfficial=True,resultStatus='unofficial',certified=False,unofficial=True,provisional=True,sourceNeedsReview=False,qualityFlags=['currentUnofficialResults','sourceReportingFieldsRetainedVerbatim'],asOf=updated,sourceUpdatedAt=updated,retrievedAt=provenance[SID]['retrievedAt'],candidates=[],reportingCategories=[],totalVotes=0,totalVotesBasis='sum of source rc/wc vote entries plus raw sv/bv fields; equals source sc; not asserted turnout',percentageDenominatorBasis='all listed candidate and reporting-category entries',sourceReportingPortions=[])
  if county:g.update(county=county.title()+' County',countyFips=counties[county])
  return g
 def add(g,c,category=None):
  v=c['vc'];assert type(v) is int and v>=0
  target=g['reportingCategories'] if category else g['candidates'];entry=next((x for x in target if x['sourceCandidateId']==c['cid']),None)
  if entry:
   assert entry['name']==c['cn'].strip();entry['votes']+=v
  else:
   entry=dict(name=c['cn'].strip(),votes=v,sourceCandidateId=c['cid'])
   if category:entry.update(category=category,sourceIsWriteIn=c.get('isWriteIn'))
   else:
    p=c['pn'] or '';entry.update(party={'DEM/PROG':'Democrat','REPUBLICAN':'Republican'}.get(p,'Other'),partyOriginal=p)
   target.append(entry)
  g['totalVotes']+=v
 def ingest(g,r):
  assert all(type(r[k]) is int and r[k]>=0 for k in ['sc','sv','bv'])
  assert sum(c['vc'] for c in r['rc']+r['wc'])+r['sv']+r['bv']==r['sc']
  for c in r['rc']:add(g,c)
  for c in r['wc']:add(g,c,'sourceWriteInEntries')
  for k in ['sv','bv']:add(g,dict(cid=k,cn='Source reporting field '+k,vc=r[k]),'sourceReportingCategory')
 for r in portions:
  assert len(townCounty[r['tid']])==1,(r['tid'],r['tn'])
  county=next(iter(townCounty[r['tid']]));assert county in counties
  g=groups.setdefault(county,group(county));ingest(g,r)
  g['sourceReportingPortions'].append(dict(townId=r['tid'],town=r['tn'],repDistrict=r['repd'],senateDistrict=r['send'],districtsReported=r['distReported']))
 assert set(groups)==set(counties)
 state=group();ingest(state,summ)
 for category in ['candidates','reportingCategories']:
  actual=collections.Counter()
  for g in groups.values():
   for c in g[category]:actual[c['sourceCandidateId']]+=c['votes']
  expected={c['sourceCandidateId']:c['votes'] for c in state[category]};assert dict(actual)==expected,(category,actual,expected)
  controls.extend(dict(kind=category,sourceCandidateId=k,countySum=v,sourceStateVotes=expected[k]) for k,v in actual.items())
 assert sum(g['totalVotes'] for g in groups.values())==state['totalVotes']==summ['sc']
 results=sorted(groups.values(),key=lambda g:g['countyFips'])+[state]
 for g in results:
  g['candidateVoteSum']=sum(c['votes'] for c in g['candidates']);g['reportingCategoryVoteSum']=sum(c['votes'] for c in g['reportingCategories'])
  assert g['totalVotes']==g['candidateVoteSum']+g['reportingCategoryVoteSum']
 validation=dict(status='passed',stateAbbr='VT',countyRows=14,stateRows=1,townCount=len({r['tid'] for r in portions}),sourceReportingPortions=len(portions),sourceStateTotal=summ['sc'],candidateSum=state['candidateVoteSum'],reportingCategorySum=state['reportingCategoryVoteSum'],sourceEntryChecks=len(controls),checks=controls)
 sources=provenance
 dump(OUT/'governor-2026.json',dict(schemaVersion=1,office='governor',year=2026,snapshotDate='2026-11-06',sources=sources,results=results))
 coverage=[dict(office='governor',year=2026,stateAbbr='VT',url='/data/current-governors/governor-2026.json',geoLevels=['county','state'],rows=15,countyRows=14,expectedCountyRows=14,missingCountyFips=[],resultStatus='unofficial',asOf=updated)]
 limitations=['Bounded Vermont2026 import only; South Dakota2026 Governor is supplied by the modern-counties importer. Other governor gaps remain outside this package.','Official authority feed is explicitly unofficial/provisional, not certified. Snapshot does not auto-refresh.','Exact official townId-to-county mapping; disjoint reporting portions summed once; no fuzzy name or spatial joins.','Source wc entries stay reporting categories, preserving source IDs and spelling without asserting candidate eligibility. Source sv/bv fields stay named verbatim without guessing semantics.']
 dump(OUT/'manifest.json',dict(schemaVersion=1,snapshotDate='2026-11-06',coverage=coverage,sources=sources,limitations=limitations,validation={k:v for k,v in validation.items() if k!='checks'}))
 dump(RAW/'validation.json',validation)
 print(json.dumps({k:v for k,v in validation.items() if k!='checks'},indent=2))
if __name__=='__main__':main()
