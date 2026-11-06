#!/usr/bin/env python3
"""Offline, isolated House research imports. Actual official county-district returns only."""
import argparse,collections,csv,datetime,hashlib,json,re
from zoneinfo import ZoneInfo
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];RAW=ROOT/'scripts/source-data/research-house';OUT=ROOT/'public/data/research-house'
URL22='https://apps.azsos.gov/election/2022/General/canvass/2022dec05_general_election_canvass_web.pdf'
def dump(p,x):p.write_text(json.dumps(x,ensure_ascii=False,separators=(',',':'))+'\n')
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def norm(s):return re.sub(r'\s+',' ',s.strip()).upper()
def main(include_nm=False,out=None):
 global OUT
 if out:OUT=Path(out).resolve()
 sources={};groups={};checks=[];scope={};OUT.mkdir(parents=True,exist_ok=True)
 geo={norm(r['county'].removesuffix(' County')+' County'):r['countyFips'] for r in json.loads((ROOT/'public/data/elections/president-2020.json').read_text())['results'] if r['geoLevel']=='county' and r['stateAbbr']=='AZ'}
 assert len(geo)==15
 def group(y,d,county,sid):
  fips=geo[norm(county)] if county else '04';k=(y,fips,d);g=groups.setdefault(k,dict(office='house',year=y,geoLevel='county' if county else 'district',state='Arizona',stateAbbr='AZ',stateFips='04',district=d,contestId=f'house-{y}-04-{d}-general-False',stage='general',special=False,sourceId=sid,candidates=[],reportingCategories=[],totalVotes=0,totalVotesBasis='sum of actual source candidate returns and unattributed write-ins; not ballots cast',sourceLinks=[sources[sid]['sourceUrl']],resultStatus='unofficial' if y==2026 else 'official',unofficial=y==2026,provisional=y==2026,certified=y==2022,asOf=sources[sid]['asOf'],sourceUpdatedAt=sources[sid]['sourceUpdatedAt'],retrievedAt=sources[sid]['retrievedAt'],geographicScope='county-district intersection' if county else 'district summary',countComplete=False if y==2026 else True))
  if county:g.update(countyFips=fips,county=county)
  return g
 def add(g,name,party,v,cid=None,writein=False):
  assert v is None or (isinstance(v,int) and v>=0)
  cat='unattributedWriteIns' if norm(name) in ('UNASSIGNED WRITE-IN','UNOFFICIAL WRITE-IN') else None
  target=g['reportingCategories'] if cat else g['candidates'];assert not any(norm(c['name'])==norm(name) for c in target),(g['contestId'],name)
  c=dict(name=name.strip(),votes=v)
  if cid is not None:c['sourceCandidateId']=cid
  if cat:c['category']=cat
  else:c.update(party={'DEMOCRATIC':'Democrat','DEM':'Democrat','REPUBLICAN':'Republican','REP':'Republican'}.get(norm(party),'Other'),partyOriginal=party,isWriteIn=writein)
  target.append(c)
  if v is None:
   c.update(missingVoteCount=True,sourceValueOriginal='*');g.update(totalVotes=None,incomplete=True,sourceNeedsReview=True,countComplete=False,totalVotesBasis='Source suppresses at least one candidate count as*; total unavailable; known candidate values retained without residual allocation');g.setdefault('reviewReasons',[]).append('Official source privacy/small-count suppression; unknown is not zero.')
  elif g['totalVotes'] is not None:g['totalVotes']+=v
 #2026 export contains both separate statewide district controls and all15county publications.
 metadata=json.loads((RAW/'az-sources.json').read_text())['az2026-export.json'];x=json.loads((RAW/metadata['file']).read_text());assert x['electionDate']=='2026-11-03';sid='research-house-az-2026-official-export'
 sources[sid]=dict(metadata,sha256=sha(RAW/metadata['file']),sourceUrl=metadata['url'],title='Arizona Secretary of State official2026general unofficial county-district export',publisher='Arizona Secretary of State via Enhanced Voting',license='State public election returns; no added upstream redistribution license stated',sourceIsOfficial=True,asOf=x['createdAt'],sourceUpdatedAt=x['createdAt'],timestampBasis='Official export createdAt; retrieval separately retained',snapshotDate='2026-11-06')
 house=lambda r:[b for b in r['ballotItems'] if re.fullmatch(r'U\.S\. Representative in Congress - District No\. [1-9]',b['name'])]
 districts=house(x['results']);assert len(districts)==9
 assert len(x['localResults'])==15 and {norm(r['name']) for r in x['localResults']}==set(geo)
 rawCounty=collections.defaultdict(list)
 for county in x['localResults']:
  for b in house(county):
   d=b['id'].removeprefix('AZ-');assert d in {str(i) for i in range(1,10)};g=group(2026,d,county['name'],sid);g['sourceContestId']=b['id'];g['sourceReportingStatus']=dict(precinctsParticipating=b['precinctsParticipating'],precinctsReporting=b['precinctsReporting']);g['qualityFlags']=['preliminaryCurrentReturns','completePublishedContestScopeDoesNotImplyCompleteCount']
   for c in b['ballotOptions']:
    add(g,c['name'],c['politicalParty'] or '',c['voteCount'],c['id']);rawCounty[d,c['id']].append(c['voteCount'])
 for b in districts:
  d=b['id'].removeprefix('AZ-');g=group(2026,d,None,sid)
  for c in b['ballotOptions']:
   v=sum(rawCounty[d,c['id']]);assert v==c['voteCount'],(d,c['name'],v,c['voteCount']);add(g,c['name'],c['politicalParty'] or '',c['voteCount'],c['id']);checks.append(dict(year=2026,district=d,sourceCandidateId=c['id'],candidate=c['name'],countySum=v,sourceDistrictTotal=c['voteCount'],controlKind='separately published official district summary in same export'))
 #2022 authority PDF could be read by web extraction service; direct requests returned403.
 text=json.loads((RAW/'az2022-official-web-extract.json').read_text());sid='research-house-az-2022-official-canvass-web-extract';receipt=json.loads((RAW/'az2022-extraction-metadata.json').read_text())
 sources[sid]=dict(receipt,file='az2022-official-web-extract.json',sha256=sha(RAW/'az2022-official-web-extract.json'),sourceUrl=URL22,title='Arizona certified2022general canvass, first two pages, saved official-PDF web text extraction',publisher='Arizona Secretary of State',license='State public election returns; no added upstream redistribution license stated',sourceIsOfficial=True,asOf=receipt['retrievedAt'],sourceUpdatedAt=None,sourceReportDateTimeOriginal='12/5/2022 10:00:00 AM; timezone not stated',sourceCertifiedDate='2022-12-05',timestampBasis='Historical certification date and original report time retained; asOf is retrieval',snapshotDate='2026-11-06',rawFormat='JSON string containing verbatim web.run official PDF extraction, not downloaded PDF bytes',directPdfDownloadStatus='HTTP403, including ordinary browserUserAgent')
 countyOrder=['Apache County','Cochise County','Coconino County','Gila County','Graham County','Greenlee County','La Paz County','Maricopa County','Mohave County','Navajo County','Pima County','Pinal County','Santa Cruz County','Yavapai County','Yuma County'];assert set(map(norm,countyOrder))==set(geo)
 lines=[re.sub(r'^L\d+@P\d+(?:-\d+)?:\s*','',line).strip() for line in text.splitlines()];district=None;pending='';parsed=[]
 for line in lines:
  m=re.fullmatch(r'U\.S\. Representative in Congress - District No\. ([1-9])',line)
  if m:district=m[1];pending='';continue
  if line=='Governor' and district=='9':break
  if not district:continue
  if line.startswith('('):pending=line
  elif pending and re.match(r'^(?:---|[0-9])',line):pending+=' '+line
  else:continue
  m=re.fullmatch(r'\(([^)]+)\)\s+(.+?)\s+((?:---|[0-9,]+)(?:\s+(?:---|[0-9,]+)){15})',pending)
  if not m:continue
  party,name,numbers=m.groups();name=name.replace('*','').replace('\x02','-').strip();writein='Write' in name;name=re.sub(r'\s*\(Write[ -]*In\)\s*','',name);tokens=numbers.split();assert len(tokens)==16;values=[None if t=='---' else int(t.replace(',','')) for t in tokens];assert sum(v or 0 for v in values[:15])==values[-1]
  for county,v in zip(countyOrder,values[:15]):
   if v is not None:add(group(2022,district,county,sid),name,party,v,writein=writein)
  add(group(2022,district,None,sid),name,party,values[-1],writein=writein);parsed.append(dict(district=district,name=name,party=party,writeIn=writein,countyValues=values[:15],districtVotes=values[-1]));checks.append(dict(year=2022,district=district,candidate=name,countySum=sum(v or 0 for v in values[:15]),sourceDistrictTotal=values[-1],controlKind='primary certified canvass row county columns versus published TOTAL column'));pending=''
 assert {r['district'] for r in parsed}=={str(i) for i in range(1,10)} and len(parsed)==26,(len(parsed),parsed)
 # Primary non-dash county cells establish intersection inventory. Dashes stay absent, never zero.
 for year in (2022,2026):
  rr=[g for g in groups.values() if g['year']==year and g['geoLevel']=='county'];inventory=sorted((g['countyFips'],g['district']) for g in rr);assert len(inventory)==30 and len({g['countyFips'] for g in rr})==15
  scope[year]=dict(stateAbbr='AZ',year=year,office='house',stage='general',special=False,countyCount=15,districtCount=9,countyDistrictIntersections=30,inventory=inventory,inventorySha256=hashlib.sha256(json.dumps(inventory,separators=(',',':')).encode()).hexdigest(),scopeComplete=True,countComplete=year==2022,basis='All9official published House contests; complete15county source inventory; actual non-dash county-district cells, not allocated district totals',sourceFileSha256=sources['research-house-az-2026-official-export' if year==2026 else sid]['sha256'])
 assert scope[2022]['inventory']==scope[2026]['inventory']
 nmScope={}
 if include_nm:
  nmMeta=json.loads((RAW/'nm-sources.json').read_text());nmGeo={norm(r['county']):r['countyFips'] for r in json.loads((ROOT/'public/data/elections/president-2020.json').read_text())['results'] if r['geoLevel']=='county' and r['stateAbbr']=='NM'};assert len(nmGeo)==33
  for meta in nmMeta:assert sha(RAW/meta['file'])==meta['sha256']
  for year in (2022,2026):
   sid=f'research-house-nm-{year}-official-county-api';meta=next(m for m in nmMeta if m['file']==f'nm{year}-federal.csv');html=(RAW/f'nm{year}-federal.html').read_text();stamp=re.search(r'Results last updated:</span><span>([^<]+)',html)[1];assert stamp.endswith(' MT');updated=datetime.datetime.strptime(stamp[:-3],'%m/%d/%Y %I:%M %p').replace(tzinfo=ZoneInfo('America/Denver')).isoformat();assert ('Unofficial Results' if year==2026 else 'Official Results') in html
   sources[sid]=dict(meta,sourceUrl='https://electionresults.sos.nm.gov/resultsSW.aspx?type=FED&map=CTY'+('&eid=2838' if year==2022 else ''),title=f'New Mexico Secretary of State{year}official county-district API and district CSV',publisher='New Mexico Secretary of State',license='State public election returns; no added upstream redistribution license stated',sourceIsOfficial=True,asOf=updated,sourceUpdatedAt=updated,sourceUpdatedAtOriginal=stamp,timestampBasis='Explicit sourcepageMT time; retrieval separately retained',snapshotDate='2026-11-06',rawSnapshots=[m for m in nmMeta if m['file'].startswith(f'nm{year}')])
   districtCSV=[r for r in csv.DictReader((RAW/f'nm{year}-federal.csv').open()) if r['RaceName']=='United States Representative'];districts={r['RaceID']:r['AreaNum'].removeprefix('DISTRICT ') for r in districtCSV};assert set(districts.values())=={'1','2','3'};nmRows=[]
   for race,d in districts.items():
    rows=json.loads((RAW/f'nm{year}-house-{race}.json').read_text());assert isinstance(rows,list)
    for r in rows:
     assert str(r['RaceID'])==race and r['RaceName']=='United States Representative' and r['AreaNum']==f'DISTRICT {d}'
     fips=nmGeo[norm(r['CountyName'])];k=(year,fips,d)
     if k not in groups:groups[k]=dict(office='house',year=year,geoLevel='county',state='New Mexico',stateAbbr='NM',stateFips='35',countyFips=fips,county=r['CountyName']+' County',district=d,contestId=f'house-{year}-35-{d}-general-False',stage='general',special=False,sourceId=sid,sourceIsOfficial=True,candidates=[],reportingCategories=[],totalVotes=0,totalVotesBasis='sum of actual official county-district candidate returns; not ballots cast',sourceLinks=[sources[sid]['sourceUrl']],resultStatus='unofficial' if year==2026 else 'official',unofficial=year==2026,provisional=year==2026,certified=year==2022,asOf=updated,sourceUpdatedAt=updated,retrievedAt=sources[sid]['retrievedAt'],geographicScope='county-district intersection',countComplete=year==2022,sourceReportingStatus=dict(precinctsReporting=r['PrecinctsReporting'],totalPrecincts=r['TotalPrecincts'],basis='Source county reporting status; not proof of complete contest count'))
     g=groups[k];add(g,r['calcCandidate'],r['PartyName'],None if r['calcCandidateVotes']=='*' else int(r['calcCandidateVotes']),str(r['CandidateID']),writein='(write in)' in r['calcCandidate'].lower());nmRows.append(r)
   for r in districtCSV:
    d=districts[r['RaceID']];rows=[x for x in nmRows if str(x['RaceID'])==r['RaceID'] and str(x['CandidateID'])==r['CandidateID']];unknown=sum(x['calcCandidateVotes']=='*' for x in rows);v=sum(int(x['calcCandidateVotes']) for x in rows if x['calcCandidateVotes']!='*')
    if not unknown:assert v==int(r['CandidateVotes']),(year,d,r['CandidateName'],v,r['CandidateVotes'])
    else:assert v<=int(r['CandidateVotes'])
    checks.append(dict(year=year,stateAbbr='NM',district=d,sourceCandidateId=r['CandidateID'],candidate=r['CandidateName'],countyKnownSum=v,sourceDistrictTotal=int(r['CandidateVotes']),suppressedCountyCells=unknown,status='withheld-source-suppression' if unknown else 'passed',controlKind='Separate official statewide district CSV versus county API; suppressedcells never allocated'))
    k=(year,'35',d)
    if k not in groups:groups[k]=dict(groups[next(k for k in groups if k[0]==year and k[1].startswith('35') and k[2]==d)],geoLevel='district',candidates=[],reportingCategories=[],totalVotes=0,geographicScope='district summary');groups[k].pop('countyFips',None);groups[k].pop('county',None);groups[k].pop('sourceReportingStatus',None)
    for heldField in ['incomplete','sourceNeedsReview','reviewReasons']:groups[k].pop(heldField,None)
    groups[k]['countComplete']=year==2022;groups[k]['totalVotesBasis']='sum of actual official district candidate returns; not ballots cast'
    add(groups[k],r['CandidateName'],r['PartyCode'],int(r['CandidateVotes']),r['CandidateID'],writein='(write in)' in r['CandidateName'].lower())
   rr=[g for g in groups.values() if g['year']==year and g['stateAbbr']=='NM' and g['geoLevel']=='county'];inventory=sorted((g['countyFips'],g['district']) for g in rr);assert len(inventory)==43 and len({g['countyFips'] for g in rr})==33
   nmScope[year]=dict(stateAbbr='NM',year=year,office='house',stage='general',special=False,countyCount=33,districtCount=3,countyDistrictIntersections=43,inventory=inventory,inventorySha256=hashlib.sha256(json.dumps(inventory,separators=(',',':')).encode()).hexdigest(),scopeComplete=True,countComplete=year==2022 and not any(g.get('incomplete') for g in rr),incompleteCountyDistrictRecords=sum(bool(g.get('incomplete')) for g in rr),knownCountyDistrictRecords=sum(not g.get('incomplete') for g in rr),basis='All3official congressionalcontests; all33counties; explicitcounty-district API returns; unsuppressed candidate IDs reconciled to separately published district CSV; suppressed controls withheld',sourceHashes={m['file']:m['sha256'] for m in sources[sid]['rawSnapshots']})
  assert nmScope[2022]['inventory']==nmScope[2026]['inventory']
 coverage=[]
 for year in (2022,2026):
  rr=sorted([g for g in groups.values() if g['year']==year],key=lambda r:(r.get('countyFips',r['stateFips']),int(r['district'])));ids={g['sourceId'] for g in rr}
  for g in rr:
   if g['totalVotes'] is None:assert g.get('incomplete') and any(c['votes'] is None for c in g['candidates'])
   else:assert sum(c['votes'] for c in g['candidates']+g['reportingCategories'])==g['totalVotes']
   g['candidates'].sort(key=lambda c:-(c['votes'] if c['votes'] is not None else -1));g['countyScopeInventorySha256']=(nmScope if g['stateAbbr']=='NM' else scope)[year]['inventorySha256']
  name=f'house-{year}.json';dump(OUT/name,dict(schemaVersion=1,office='house',year=year,snapshotDate='2026-11-06',sources={i:sources[i] for i in ids},results=rr));coverage.append(dict(office='house',year=year,url='/data/research-house/'+name,geoLevels=['county','district'],rows=len(rr),stateCount=len({g['stateAbbr'] for g in rr}),countyCount=len({g['countyFips'] for g in rr if g['geoLevel']=='county'}),countyDistrictIntersections=True,candidateCount=sum(len(g['candidates']) for g in rr),reportingCategoryCount=sum(len(g['reportingCategories']) for g in rr),sourceNeedsReviewCount=sum(bool(g.get('sourceNeedsReview')) for g in rr),incompleteCount=sum(bool(g.get('incomplete')) for g in rr),resultStatus='unofficial' if year==2026 else 'official',provisional=year==2026))
 validation=dict(status='passed',sourceCandidateControls=len(checks),candidateControlsByYear=dict(collections.Counter(r['year'] for r in checks)),scopeProofs=scope,additionalScopeProofs={'NM':nmScope} if nmScope else {},normalizedFileHashes={c['url']:sha(OUT/Path(c['url']).name) for c in coverage},limits=['2026counts provisional; scope completeness does not imply completed counting.','2022source is exact saved primary-PDF web extraction; raw PDF could not be downloaded.','Unknown/unassigned write-ins remain reporting categories. Named qualified2022source write-ins remain candidates with source parties.','Primary2022table columns use exact fixed header order; source dashes never become zero or synthetic intersections.','NMsource suppression* retained asnull/incomplete/sourcehold; complete inventory is not complete numeric counts; no residual allocation.'])
 # Keep the approved AZ default byte-reproducible. Staging-only metadata belongs only
 # to builds that actually include NM; empty objects/zero counters change the frozen manifest.
 if not include_nm:
  for entry in coverage:
   entry.pop('sourceNeedsReviewCount',None);entry.pop('incompleteCount',None)
  validation.pop('additionalScopeProofs',None)
  validation['limits']=[limit for limit in validation['limits'] if not limit.startswith('NMsource ')]
 manifest=dict(schemaVersion=1,snapshotDate='2026-11-06',sources=sources,coverage=coverage,scopeProofs=scope,validation=validation,limitations=validation['limits'])
 if nmScope:manifest['additionalScopeProofs']={'NM':nmScope}
 dump(RAW/'az2022-parsed-rows.json',parsed)
 dump(RAW/('validation-with-nm.json' if include_nm and out else 'validation.json'),dict(validation,controls=checks))
 dump(OUT/'manifest.json',manifest)
 print(json.dumps(dict(coverage=coverage,validation=validation),indent=2))
if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--include-nm',action='store_true');parser.add_argument('--output-dir');args=parser.parse_args();main(args.include_nm,args.output_dir)
