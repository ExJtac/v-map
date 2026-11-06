#!/usr/bin/env python3
"""Import dated 2026 CA Secretary of State snapshots; never infer certification or race calls."""
import argparse,collections,csv,datetime as dt,hashlib,io,json,re,subprocess,zipfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];RAW=ROOT/'scripts/source-data/current-california';OUT=ROOT/'public/data/current-california'
URLS={'governor':'https://media.sos.ca.gov/media/governor.json','house':'https://media.sos.ca.gov/media/us-rep.json'}
def dump(p,v):p.write_text(json.dumps(v,ensure_ascii=False,separators=(',',':'))+'\n')
def main(download=False):
 RAW.mkdir(parents=True,exist_ok=True);OUT.mkdir(parents=True,exist_ok=True)
 catalog=RAW/'json-endpoints.csv'
 if download:
  incoming=catalog.with_suffix('.download');subprocess.run(['curl','-fsSL','https://media.sos.ca.gov/media/json-endpoints.csv','-o',str(incoming)],check=True)
  assert 'November 3, 2026' in incoming.read_text(),'The current endpoint catalog is no longer the 2026 general election'
  incoming.replace(catalog)
 assert 'November 3, 2026' in catalog.read_text(),'Missing verified election-year catalog'
 with zipfile.ZipFile(ROOT/'scripts/source-data/county-supplements/census-2018-counties.zip') as z:
  registry={r['NAME'].removesuffix(' County'):r['GEOID'] for r in csv.DictReader(io.StringIO(z.read('2018_Gaz_counties_national.txt').decode()),delimiter='\t') if r['USPS']=='CA'}
 assert len(registry)==58
 saved=json.loads((RAW/'provenance.json').read_text()) if (RAW/'provenance.json').exists() else {}
 provenance={};coverage=[];checks=[]
 for office,url in URLS.items():
  path=RAW/('governor.json' if office=='governor' else 'us-rep.json')
  if download or not path.exists():
   temp=path.with_suffix('.download');subprocess.run(['curl','-fsSL','--retry','2',url,'-o',str(temp)],check=True)
   if path.exists():
    oldsha=hashlib.sha256(path.read_bytes()).hexdigest();archive=RAW/'archive';archive.mkdir(exist_ok=True);(archive/f'{path.stem}-{oldsha}.json').write_bytes(path.read_bytes())
   temp.replace(path)
   fetched_at=dt.datetime.now(dt.timezone.utc).isoformat()
  sha=hashlib.sha256(path.read_bytes()).hexdigest();sid=f'current-ca-sos-{office}-2026'
  if download:retrieved=fetched_at
  else:
   assert sid in saved and saved[sid]['sha256']==sha,'Missing or changed source receipt; use --download for an actual new retrieval'
   retrieved=saved[sid]['retrievedAt']
  source=dict(title=f'California Secretary of State: 2026 {"Governor" if office=="governor" else "U.S. House"} reported results',sourceUrl=url,url=url,indexUrl='https://media.sos.ca.gov/',version=f'{retrieved[:10]} content snapshot {sha[:12]}',sha256=sha,license='Official public election returns',retrievedAt=retrieved,file=path.name,sourcePublisher='California Secretary of State')
  provenance[sid]=source;results=[]
  for raw in json.loads(path.read_text()):
   title=raw['raceTitle'];district=None
   if office=='house':
    m=re.fullmatch(r'United States Representative District (\d+) - (.+) Results',title);assert m,title
    district=str(int(m[1]));area=m[2]
   else:
    m=re.fullmatch(r'Governor - (.+) Results',title);assert m,title;area=m[1]
   county=None
   if area.endswith(' County'):
    name=area.removesuffix(' County');assert name in registry,title;county=registry[name];level='county'
   else:
    assert area==('Statewide' if office=='governor' else 'Districtwide'),title;level='state' if office=='governor' else 'district'
   cs=[]
   for c in raw['candidates']:
    assert re.fullmatch(r'[\d,]+',c['Votes']),c
    cs.append(dict(name=c['Name'],party={'Dem':'Democrat','Rep':'Republican'}.get(c['Party'],'Other'),partyOriginal=c['Party'],votes=int(c['Votes'].replace(',','')),sourcePercent=float(c['Percent'])))
   total=sum(c['votes'] for c in cs);assert total>0
   for c in cs:assert abs(c['votes']/total*100-c['sourcePercent'])<=.11,(title,c,total)
   reporting=re.fullmatch(r'([\d.]+)% \(([\d,]+) of ([\d,]+)\) precincts reporting',raw['Reporting']);assert reporting,raw['Reporting']
   r=dict(office=office,year=2026,geoLevel=level,stateFips='06',state='California',stateAbbr='CA',contestId=f'{office}-2026-06-{district or "state"}-general-False',stage='general',special=False,candidates=cs,reportingCategories=[],totalVotes=total,totalVotesBasis='sum of currently reported candidate votes; not ballots cast or final turnout',sourceId=sid,sourceLinks=[url],sourceContest=title,sourcePublisher='California Secretary of State',sourceUpdatedAt=raw['ReportingTime'],asOf=raw['ReportingTime'],retrievedAt=retrieved,sourceTimestampBasis='ReportingTime is reproduced in the source display format; no timezone is inferred',unofficial=True,provisional=True,resultStatus='unofficial',electionStatus='unofficial',countingStatus='reported',certificationStatus='not certified',finalWinnerNotDeclared=True,sourceNeedsReview=False,precinctsReporting=int(reporting[2].replace(',','')),precinctsTotal=int(reporting[3].replace(',','')),precinctReportingPercent=float(reporting[1]),reportingNote='Precinct reporting does not establish that all ballots are counted or that the canvass is certified.')
   if district:r['district']=district
   if county:r.update(countyFips=county,county=name)
   results.append(r)
  assert len({(r['geoLevel'],r.get('countyFips'),r.get('district')) for r in results})==len(results)
  parent=[r for r in results if r['geoLevel']!='county'];children=[r for r in results if r['geoLevel']=='county']
  for state in parent:
   parts=[r for r in children if r.get('district')==state.get('district')]
   for c in state['candidates']:
    observed=sum(next(x['votes'] for x in p['candidates'] if x['name']==c['name']) for p in parts)
    assert observed==c['votes'],(state['sourceContest'],c['name'],observed,c['votes'])
  assert len({r['countyFips'] for r in children})==58
  if office=='house':assert len(parent)==52
  filename=f'{office}-2026.json';dump(OUT/filename,dict(schemaVersion=1,office=office,year=2026,snapshotDate='2026-11-06',sources={sid:source},results=results))
  coverage.append(dict(office=office,year=2026,url=f'/data/current-california/{filename}',rows=len(results),countyRows=len(children),geoLevels=sorted({r['geoLevel'] for r in results}),stateCount=1,countyCount=58,contests=len(parent),provisional=True,sourceUpdatedAt=parent[0]['asOf'],retrievedAt=retrieved))
  checks.append(dict(office=office,rows=len(results),countyRows=len(children),candidates=sum(len(r['candidates']) for r in results),countyStateCandidateSumsMatch=True,all58Counties=True,sha256=sha))
 manifest=dict(schemaVersion=1,snapshotDate='2026-11-06',sources=provenance,coverage=coverage,limitations=['Unofficial 2026 snapshots; no election calls or certification inferred.','100% precinct reporting is not proof all ballots have been counted.','House county records are district portions, not inferred historical district geometry.','No 2026 Presidential contest or California Senate contest is manufactured.'])
 dump(OUT/'manifest.json',manifest);dump(OUT/'validation.json',dict(status='passed',checks=checks));dump(RAW/'provenance.json',provenance);print(json.dumps(checks,indent=2))
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--download',action='store_true');main(p.parse_args().download)
