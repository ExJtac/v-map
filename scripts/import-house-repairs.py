#!/usr/bin/env python3
"""Recover source district identity without geographic vote allocation; offline rebuild."""
import collections,csv,hashlib,io,json,re,zipfile,subprocess,datetime,xml.etree.ElementTree as ET
from zoneinfo import ZoneInfo
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];RAW=ROOT/'scripts/source-data/house-repairs';OUT=ROOT/'public/data/house-repairs'
def dump(p,x):p.write_text(json.dumps(x,ensure_ascii=False,separators=(',',':'))+'\n')
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def norm(s):return re.sub(r'\s+',' ',s.strip()).upper()
def identity(s):
 if ',' in s:a,b=s.split(',',1);s=b+' '+a
 return re.sub('[^A-Z0-9]','',s.upper())
def main():
 archive=ROOT/'scripts/source-data/early-counties/heideman-v1.0.0.zip';z=zipfile.ZipFile(archive)
 allrows=list(csv.DictReader(io.TextIOWrapper(z.open('us_county_results_long.csv'))))
 targets=[r for r in allrows if r['office']=='house' and 2006<=int(r['year'])<=2014 and not r['district']]
 metadata=json.loads((RAW/'openelections-sources.json').read_text());sources={};lookup=collections.defaultdict(set);directCounts=collections.Counter();rawState=collections.defaultdict(int)
 for key,meta in metadata.items():
  filename=key+'.csv';sourceId='house-repair-'+key
  sources[sourceId]=dict(meta,file=filename,sha256=sha(RAW/filename),title='OpenElections county return with explicit source district label',publisher='OpenElections, compiled from state election records',snapshotDate='2026-11-06',license='Underlying state public election records; repository-specific terms remain applicable')
  if key.startswith('ia2012-'):continue
  for r in csv.DictReader((RAW/filename).open()):
   if key=='co2014':
    if 'United States Congress' not in r['office'] or not r['candidate'].strip():continue
    y,st,county,name,votes=2014,'CO',r['county'],r['candidate'],r['votes'];d=re.fullmatch('District ([1-7])',r['district']);assert d,r;district=d[1]
   elif key=='wa2006':
    d=re.fullmatch(r'U\. S\. Representative District #(\d+)',r['officename'])
    if not d:continue
    y,st,county,name,votes=2006,'WA',r['jurisdiction'],r['ballotname'],r['votes'];district=d[1]
    if r['reporting_level']=='state':rawState[district,norm(name)]+=int(votes);continue
    if r['reporting_level']!='county':continue
   else:
    if 'REPRESENTATIVE IN CONGRESS' not in r['office'].upper():continue
    d=re.search(r'DISTRICT\s+(\d+)',r['office'].upper());assert d,r
    y=int(key[2:6]);st='NV';county=key.split('-',1)[1].replace('_',' ');name=r['candidate'];votes=r['votes'];district=d[1]
   if not name.strip():continue
   n=int(votes.replace(',',''));lookup[y,st,norm(county),norm(name),n].add((district,sourceId));directCounts[y,st]+=1
 # IA2012 contains source district labels for the exact same candidate identities in other counties.
 sourceId='house-repair-ia2012-source-identity'
 sources[sourceId]=dict(file='../early-counties/heideman-v1.0.0.zip',sha256=sha(archive),sourceUrl='https://doi.org/10.5281/zenodo.22976553',title='Heideman v1.0.0 exact candidate identity district recovery, Iowa2012',publisher='Paul Heideman; underlying OpenElections Iowa',snapshotDate='2026-11-06',license='CC BY4.0; underlying source terms retained')
 iaIndex=collections.defaultdict(set);iaEvidence=[]
 for r in allrows:
  if r['office']=='house' and r['year']=='2012' and r['state_po']=='IA' and r['district']:
   iaIndex[norm(r['candidate'])].add(str(int(r['district'])));iaEvidence.append(r)
 baseline=json.loads((ROOT/'public/data/elections/house-2012.json').read_text())['results'];agreement={}
 for district in ('1','2','3','4'):
  b=[r for r in baseline if r['stateAbbr']=='IA' and r['district']==district and not r['special'] and r['stage']=='general'];assert len(b)==1
  official={identity(c['name']) for c in b[0]['candidates']}
  matches=sorted(n for n,ds in iaIndex.items() if ds=={district} and identity(n) in official)
  assert len(matches)>=2,(district,matches);agreement[district]=matches
 recovered=[];held=[];evidence=[]
 for r in targets:
  year=int(r['year']);st=r['state_po'];votes=int(r['votes']);key=(year,st,norm(r['county_name']),norm(r['candidate']),votes);matches=lookup[key];method='Explicit original source county-office district label, matched on exact county/candidate/votes'
  if st=='IA' and year==2012:
   matches=set();method='Exact full candidate identity uniquely district-labeled in same source/year/state; at least two candidates in race agree with baseline district identity'
  if len(matches)!=1:
   reason='Archive row superseded by direct precinct rebuild excluding county subtotals' if st=='IA' and year==2012 else 'No unique direct source district label or independently race-checked exact identity'
   held.append(dict(r,holdReason=reason));continue
  district,sid=next(iter(matches));assert int(district)>0
  recovered.append(dict(r,district=district,repairSourceId=sid,repairMethod=method))
  evidence.append(dict(year=year,stateAbbr=st,countyFips=r['county_fips'],candidate=r['candidate'],votes=votes,district=district,sourceId=sid,method=method))
 priorLabeled=[]
 groups={}
 for r in recovered+priorLabeled:
  y=int(r['year']);d=r['district'];county=r['county_fips'];sid=r['repairSourceId'];key=(y,county,d)
  if key not in groups:groups[key]=dict(office='house',year=y,geoLevel='county',stateFips=r['state_fips'],state=r['state'],stateAbbr=r['state_po'],countyFips=county,county=r['county_name'],district=d,contestId=f'house-{y}-{r["state_fips"]}-{d}-general-False',stage='general',special=False,sourceId=sid,sourceIds=[],candidates=[],reportingCategories=[],totalVotes=0,totalVotesBasis='sum of source candidate returns; no geographic estimation',sourceLinks=[],qualityFlags=['districtRecoveredFromSourceIdentity'],districtRecoveryMethod=r['repairMethod'])
  g=groups[key];assert county.startswith(g['stateFips']);v=int(r['votes']);c=dict(name=r['candidate'],votes=v,party={'DEM':'Democrat','REP':'Republican'}.get(r['party_group'],'Other'),partyOriginal=r['party'],sourcePartyGroup=r['party_group']);
  previous=next((x for x in g['candidates'] if norm(x['name'])==norm(c['name'])),None)
  if previous:previous['votes']+=v
  else:g['candidates'].append(c)
  g['totalVotes']+=v
  if sid not in g['sourceIds']:g['sourceIds'].append(sid)
  link=sources[sid].get('url',sources[sid].get('sourceUrl'));g['sourceLinks']=sorted(set(g['sourceLinks']+[link]))
  if r['quality_flag']:g['qualityFlags']+=r['quality_flag'].split(';')
  g.setdefault('upstreamSourceIds',[])
  if r['source'] not in g['upstreamSourceIds']:g['upstreamSourceIds'].append(r['source'])
 # Rebuild ALL Iowa2012 from source precincts, excluding county subtotal rows.
 iaAudit=[];iaFips={norm(r['county_name']):r['county_fips'] for r in allrows if r['state_po']=='IA'}
 for key,meta in metadata.items():
  if not key.startswith('ia2012-'):continue
  sid='house-repair-'+key;county=meta['county'];fips=iaFips[norm(county)]
  rr=[r for r in csv.DictReader((RAW/(key+'.csv')).open()) if r['office']=='U.S. House of Representatives']
  nullRows=[r for r in rr if not r['votes'].strip()];rr=[r for r in rr if r['votes'].strip()]
  sums=collections.Counter();subtotals=collections.Counter();byPrecinct=collections.defaultdict(list)
  for r in rr:
   n=float(r['votes']);assert n>=0 and n.is_integer(),r
   if not r['precinct'].strip():subtotals[norm(r['candidate'])]+=int(n);continue
   byPrecinct[r['precinct']].append(r);sums[norm(r['candidate'])]+=int(n)
  subtotalChecks=[]
  for name,v in subtotals.items():
   assert sums[name]==v,(county,name,'source subtotal differs',sums[name],v)
   subtotalChecks.append(dict(candidate=name,sourceSubtotal=v,precinctSum=sums[name]))
  for precinct,rows in byPrecinct.items():
   ds=set()
   for r in rows:
    if r['district'].strip():ds.add(str(int(r['district'])))
    if norm(r['candidate']) in iaIndex:ds.update(iaIndex[norm(r['candidate'])])
   assert len(ds)==1,(county,precinct,ds)
   d=next(iter(ds));k=(2012,fips,d)
   if k not in groups:groups[k]=dict(office='house',year=2012,geoLevel='county',stateFips='19',state='Iowa',stateAbbr='IA',countyFips=fips,county=county,district=d,contestId=f'house-2012-19-{d}-general-False',stage='general',special=False,sourceId=sid,sourceIds=[sid],candidates=[],reportingCategories=[],totalVotes=0,totalVotesBasis='sum of actual precinct rows; county subtotal rows excluded after candidate sum checks',sourceLinks=[sources[sid]['url']],qualityFlags=['directPrecinctRebuild','sourceSubtotalDuplicationRemoved'],districtRecoveryMethod='Explicit district labels or exact full candidate identity; reporting categories use unique precinct contest identity')
   g=groups[k]
   for r in rows:
    name=r['candidate'];v=int(float(r['votes']));n=norm(name);category={'WRITE-IN':'unattributedWriteIns','WRITE-INS':'unattributedWriteIns','UNDER VOTES':'undervotes','OVER VOTES':'overvotes','UNDERVOTES':'undervotes','OVERVOTES':'overvotes'}.get(n)
    target=g['reportingCategories'] if category else g['candidates'];c=next((c for c in target if norm(c['name'])==n),None)
    if c:c['votes']+=v
    else:
     c=dict(name=name,votes=v)
     if category:c['category']=category
     else:c.update(party={'Democratic':'Democrat','Republican':'Republican'}.get(r['party'],'Other'),partyOriginal=r['party'])
     target.append(c)
    g['totalVotes']+=v
  iaAudit.append(dict(county=county,countyFips=fips,precinctCount=len(byPrecinct),nullRowsHeld=nullRows,excludedSubtotalRows=sum(not r['precinct'].strip() for r in rr),subtotalChecks=subtotalChecks))
 assert len(iaAudit)==99
 iaStateChecks=[]
 for b in baseline:
  if b['stateAbbr']!='IA' or b['special'] or b['stage']!='general':continue
  d=b['district'];rr=[g for g in groups.values() if g['year']==2012 and g['stateAbbr']=='IA' and g['district']==d]
  for c in b['candidates']:
   aliases={'BRUCELBRALEY':'BRUCEBRALEY','DAVIDLOEBSACK':'DAVELOEBSACK','LEONARDLBOSWELL':'LEONARDBOSWELL'}
   wanted=aliases.get(identity(c['name']),identity(c['name']))
   matches=[x for g in rr for x in g['candidates'] if identity(x['name'])==wanted]
   if identity(c['name'])=='WRITEIN':matches=[x for g in rr for x in g['reportingCategories'] if x['category']=='unattributedWriteIns']
   assert matches,(d,c['name'],'unmatched baseline candidate')
   total=sum(x['votes'] for x in matches);assert total==c['votes'],(d,c['name'],total,c['votes'])
   iaStateChecks.append(dict(district=d,candidate=c['name'],countySum=total,baselineDistrictVotes=c['votes']))
 assert len(iaStateChecks)==18
 dump(RAW/'iowa2012-precinct-audit.json',dict(counties=iaAudit,districtCandidateChecks=iaStateChecks))
 # WA original file carries independently tabulated statewide candidate rows.
 wa=[]
 for key,v in rawState.items():
  district,name=key;count=sum(c['votes'] for g in groups.values() if g['year']==2006 and g['stateAbbr']=='WA' and g['district']==district for c in g['candidates'] if norm(c['name'])==name)
  assert count==v,(key,count,v);wa.append(dict(district=district,candidate=name,countySum=count,sourceStateTotal=v))
 assert sum(g['totalVotes'] for g in groups.values() if g['stateAbbr']!='IA')==sum(int(r['votes']) for r in recovered+priorLabeled)
 assert len(recovered)+len(held)==878
 # Official Virginia current feed: actual county-district portions plus district summaries.
 vaChecks=[]
 def english(items):return next(x['text'] for x in items if x['languageId']=='en')
 for meta in json.loads((RAW/'va2026-sources.json').read_text()):
  x=json.loads((RAW/meta['file']).read_text());b=x['ballotItemWithBreakdown'];d=re.search(r'\((\d+)(?:st|nd|rd|th) District\)',english(b['name']))[1];sid='house-repair-va2026-'+d
  sources[sid]=dict(meta,sha256=sha(RAW/meta['file']),sourceUrl='https://enr.elections.virginia.gov/results/public/virginia/elections/2026-November-General',title='Virginia Department of Elections2026general official results feed, House district'+d,publisher='Virginia Department of Elections',snapshotDate='2026-11-06',license='State public election records',sourceIsOfficial=True)
  def make(options,total,geo,county=None):
   g=dict(office='house',year=2026,geoLevel=geo,stateFips='51',state='Virginia',stateAbbr='VA',district=d,contestId=f'house-2026-51-{d}-general-False',stage='general',special=False,sourceId=sid,sourceIds=[sid],candidates=[],reportingCategories=[],totalVotes=total,totalVotesBasis='official feed voteTotal; candidate and write-in sum checked',sourceLinks=[sources[sid]['sourceUrl']],sourceIsOfficial=True,resultStatus='unofficial',certified=False,unofficial=True,provisional=True,qualityFlags=['currentUnofficialResults'],sourceAsOf=b['reportingStatus']['asOf'],asOf=b['reportingStatus']['asOf'],sourceUpdatedAt=b['reportingStatus']['asOf'])
   if county:g.update(countyFips='51'+county['mapFeatureId'].zfill(3),county=english(county['name']))
   for c in options:
    v=c['voteCount'];assert isinstance(v,int) and v>=0
    item=dict(name=english(c['name']),votes=v)
    if c['isWriteIn'] and not c['isQualifiedWriteIn']:item['category']='unattributedWriteIns';g['reportingCategories'].append(item)
    else:
     pp=c.get('party') or {};label=english(pp['name']) if pp.get('name') else '';item.update(party={'D':'Democrat','R':'Republican'}.get(pp.get('abbreviation'),'Other'),partyOriginal=label);g['candidates'].append(item)
   assert sum(c['votes'] for c in g['candidates']+g['reportingCategories'])==total
   return g
  for br in b['breakdownResults']:
   g=make(br['ballotOptions'],br['voteTotal'],'county',br['locality']);g['sourceReportingStatus']=br['precinctReportingStatus'];groups[2026,g['countyFips'],d]=g
  summary=make(b['summaryResults']['ballotOptions'],b['voteTotal'],'district');summary['sourceReportingStatus']=b['reportingStatus'];groups[2026,'51',d]=summary
  for c in b['summaryResults']['ballotOptions']:
   v=sum(next(z['voteCount'] for z in br['ballotOptions'] if z['id']==c['id']) for br in b['breakdownResults']);assert v==c['voteCount'],(d,english(c['name']),v,c['voteCount'])
  vaChecks.append(dict(district=d,countyDistrictRecords=len(b['breakdownResults']),candidateChecks=len(b['summaryResults']['ballotOptions']),districtTotal=b['voteTotal'],sourceAsOf=b['reportingStatus']['asOf'],asOf=b['reportingStatus']['asOf'],sourceUpdatedAt=b['reportingStatus']['asOf']))
 assert len(vaChecks)==11
 dump(RAW/'va2026-validation.json',vaChecks)
 # New Jersey2022 direct official district PDFs, county subtotal rows only.
 njHeaders=json.loads((RAW/'nj2022-headers.json').read_text());njChecks=[]
 njBaseline=[r for r in json.loads((ROOT/'public/data/elections/house-2022.json').read_text())['results'] if r['stateAbbr']=='NJ' and r['stage']=='general' and not r['special']]
 countyRef={norm(r['county'].removesuffix(' County')):r['countyFips'] for r in json.loads((ROOT/'public/data/elections/president-2020.json').read_text())['results'] if r['stateAbbr']=='NJ' and r['geoLevel']=='county'}
 for meta in json.loads((RAW/'nj2022-sources.json').read_text()):
  d=meta['district'];sid='house-repair-nj2022-'+d;path=RAW/meta['file'];textpath=path.with_suffix('.txt')
  subprocess.run(['pdftotext','-layout',str(path),str(textpath)],check=True)
  sources[sid]=dict(meta,sha256=sha(path),textSha256=sha(textpath),title='New Jersey Division of Elections2022official General Election House district'+d,publisher='New Jersey Division of Elections',snapshotDate='2026-11-06',sourceIsOfficial=True,license='State public election records',sourceUrl=meta['url'],headerTranscription='nj2022-headers.json, left-to-right original PDF names/ballot labels',headerSha256=sha(RAW/'nj2022-headers.json'))
  headers=njHeaders[d];countyRows=[];districtVotes=None
  for line in textpath.read_text().splitlines():
   if 'Totals' not in line:continue
   m=re.fullmatch(r'\s*(.+?)\s+Totals\s+([0-9, ]+)\s*',line);assert m,(d,line)
   label=m[1].strip();votes=[int(n.replace(',','')) for n in m[2].split()];assert len(votes)==len(headers),(d,label,votes)
   if label.startswith('District'):
    assert districtVotes is None;districtVotes=votes;continue
   assert norm(label) in countyRef,(d,label);countyRows.append((label,countyRef[norm(label)],votes))
  assert districtVotes is not None and countyRows
  for i,v in enumerate(districtVotes):assert sum(row[2][i] for row in countyRows)==v,(d,headers[i])
  b=next(r for r in njBaseline if r['district']==d);assert len(b['candidates'])==len(headers)
  candidateChecks=[]
  for (name,label),v in zip(headers,districtVotes):
   counterpart=[c for c in b['candidates'] if c['votes']==v];assert len(counterpart)==1,(d,name,v)
   candidateChecks.append(dict(sourceCandidate=name,sourceBallotLabel=label,officialDistrictVotes=v,countySum=v,baselineCandidate=counterpart[0]['name'],baselineDistrictVotes=counterpart[0]['votes']))
  def njRecord(votes,geo,county=None,fips=None):
   g=dict(office='house',year=2022,geoLevel=geo,stateFips='34',state='New Jersey',stateAbbr='NJ',district=d,contestId=f'house-2022-34-{d}-general-False',stage='general',special=False,sourceId=sid,sourceIds=[sid],candidates=[dict(name=name,votes=v,party={'Democratic':'Democrat','Republican':'Republican'}.get(label,'Other'),partyOriginal=label) for (name,label),v in zip(headers,votes)],reportingCategories=[],totalVotes=sum(votes),totalVotesBasis='sum of official PDF named candidate county-district totals; source does not itemize blank/invalid ballots',sourceLinks=[meta['url']],sourceIsOfficial=True,resultStatus='official',qualityFlags=['directOfficialCountyDistrictTable'])
   if county:g.update(county=county+' County',countyFips=fips)
   return g
  for county,fips,votes in countyRows:groups[2022,fips,d]=njRecord(votes,'county',county,fips)
  groups[2022,'34',d]=njRecord(districtVotes,'district')
  njChecks.append(dict(district=d,countyDistrictRecords=len(countyRows),candidateChecks=candidateChecks))
 assert len(njChecks)==12 and len({g['countyFips'] for g in groups.values() if g['year']==2022 and g['geoLevel']=='county'})==21
 dump(RAW/'nj2022-validation.json',njChecks)
 # Additional bounded official2026 sources: South Dakota, Montana, Vermont.
 extraMeta=json.loads((RAW/'additional2026-sources.json').read_text());extraChecks=[]
 for filename,metadataRow in extraMeta.items():assert sha(RAW/filename)==metadataRow['sha256']
 countyRef2026={(r['stateAbbr'],norm(r['county'].removesuffix(' County'))):r['countyFips'] for r in json.loads((ROOT/'public/data/elections/president-2020.json').read_text())['results'] if r['geoLevel']=='county'}
 def extraSource(sid,state,filename,updated=None):
  m=extraMeta[filename];assert sha(RAW/filename)==m['sha256'];sources[sid]=dict(m,title=state+'2026official unofficial House returns',publisher=state+'Secretary of State',snapshotDate='2026-11-06',sourceUrl=m['url'],sourceIsOfficial=True,resultStatus='unofficial',provisional=True,asOf=updated or m['retrievedAt'],asOfBasis='source count update timestamp' if updated else 'retrieval timestamp; source count update unavailable',sourceUpdatedAt=updated,license='State public election records')
 def extraGroup(state,abbr,sf,d,sid,geo,county=None):
  g=dict(office='house',year=2026,geoLevel=geo,stateFips=sf,state=state,stateAbbr=abbr,district=d,contestId=f'house-2026-{sf}-{d}-general-False',stage='general',special=False,sourceId=sid,sourceIds=[sid],candidates=[],reportingCategories=[],totalVotes=0,totalVotesBasis='sum of actual official-source candidate and reporting-category rows',sourceLinks=[sources[sid]['url']],sourceIsOfficial=True,resultStatus='unofficial',certified=False,unofficial=True,provisional=True,qualityFlags=['currentUnofficialResults'],asOf=sources[sid]['asOf'],sourceUpdatedAt=sources[sid]['sourceUpdatedAt'],retrievedAt=sources[sid]['retrievedAt'])
  if county:
   joinName={('MT','LEWIS & CLARK'):'LEWIS AND CLARK'}.get((abbr,norm(county)),norm(county))
   g.update(county=county+' County',countyFips=countyRef2026[abbr,joinName])
   if joinName!=norm(county):g['sourceCountyNameJoin']=dict(fromName=county,toReferenceName=joinName,reason='Explicit ampersand/and spelling variant; same state/county identity')
  return g
 def extraAdd(g,name,label,v,category=None):
  assert isinstance(v,int) and v>=0
  target=g['reportingCategories'] if category else g['candidates'];c=next((c for c in target if norm(c['name'])==norm(name)),None)
  if c:c['votes']+=v
  else:
   c=dict(name=name.strip(),votes=v)
   if category:c['category']=category
   else:c.update(party={'DEMOCRATIC':'Democrat','DEMOCRAT':'Democrat','REPUBLICAN':'Republican','DEM':'Democrat','REP':'Republican'}.get(norm(label),'Other'),partyOriginal=label)
   target.append(c)
  g['totalVotes']+=v
 # SDcounty IDs are internal; use exact published county names against existing FIPS reference.
 sdPage=(RAW/'sd2026-house.html').read_text();stamp=re.search(r'Results last updated:</span><span>([^<]+)',sdPage)[1];assert stamp.endswith(' CT');sdUpdated=datetime.datetime.strptime(stamp[:-3],'%m/%d/%Y %I:%M %p').replace(tzinfo=ZoneInfo('America/Chicago')).isoformat()
 sid='house-repair-sd2026';extraSource(sid,'South Dakota','sd2026-house-counties.json',sdUpdated);sources[sid]['sourceUpdatedAtOriginal']=stamp
 sdRows=json.loads((RAW/'sd2026-house-counties.json').read_text())['d'];sdGroups={}
 for r in sdRows:
  assert r['RaceName']=='United States Representative' and r['RaceID']==14869
  county=r['CountyName'];g=sdGroups.setdefault(county,extraGroup('South Dakota','SD','46','0',sid,'county',county));extraAdd(g,r['calcCandidate'],r['PartyName'],r['calcCandidateVotes']);g['sourceReportingStatus']=dict(precinctsReporting=r['PrecinctsReporting'],totalPrecincts=r['TotalPrecincts'],precinctsPartial=r['PrecinctsPartial'])
 sdBase=[r for r in csv.DictReader((RAW/'sd2026-statewide.csv').open()) if r['RaceID']=='14869'];assert len(sdBase)==2 and len(sdGroups)==66
 for r in sdBase:
  v=sum(x['calcCandidateVotes'] for x in sdRows if x['CandidateID']==r['CandidateID']);assert v==int(r['CandidateVotes']);extraChecks.append(dict(stateAbbr='SD',district='0',candidateId=r['CandidateID'],countySum=v,sourceDistrictVotes=int(r['CandidateVotes'])))
 for g in sdGroups.values():groups[2026,g['countyFips'],'0']=g
 sdSummary=extraGroup('South Dakota','SD','46','0',sid,'district')
 for r in sdBase:extraAdd(sdSummary,r['CandidateName'],r['PartyCode'],int(r['CandidateVotes']))
 groups[2026,'46','0']=sdSummary
 # MTstatewide export worksheet2/3 carry actual district-specific county rows.
 sid='house-repair-mt2026';extraSource(sid,'Montana','mt2026-statewide-export.xlsx');sources[sid]['downloadAction']='Public ResultsExport.aspx postback ctl00$MainContent$Statewide; original pinned by scout_county_returns';sources[sid]['sourceDownloadedAt']='2026-11-06T12:19:41-07:00'
 zz=zipfile.ZipFile(RAW/'mt2026-statewide-export.xlsx');ns={'s':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'};ss=[''.join(r.itertext()) for r in ET.fromstring(zz.read('xl/sharedStrings.xml')).findall('s:si',ns)] if 'xl/sharedStrings.xml' in zz.namelist() else []
 mtCount=0;mtFips=set()
 for sheet,d in [(2,'1'),(3,'2')]:
  rows=[]
  for row in ET.fromstring(zz.read(f'xl/worksheets/sheet{sheet}.xml')).findall('.//s:row',ns):
   values={}
   for cell in row.findall('s:c',ns):
    v=cell.find('s:v',ns);v=v.text if v is not None else ''.join(cell.find('s:is',ns).itertext()) if cell.find('s:is',ns) is not None else '';values[re.sub('[0-9]','',cell.get('r'))]=ss[int(v)] if cell.get('t')=='s' else v
   rows.append(values)
  header=next(r for r in rows if r.get('B')=='County');cols=[c for c in header if c not in ('A','B')];names={c:header[c].split('\n') for c in cols};summ=next(r for r in rows if r.get('B')=='TOTALS');rr=[r for r in rows if r.get('B') and r['B'] not in ('County','TOTALS')]
  for r in rr:
   g=extraGroup('Montana','MT','30',d,sid,'county',r['B']);mtCount+=1;mtFips.add(g['countyFips'])
   for c in cols:extraAdd(g,*names[c],int(r[c]))
   groups[2026,g['countyFips'],d]=g
  g=extraGroup('Montana','MT','30',d,sid,'district')
  for c in cols:
   v=sum(int(r[c]) for r in rr);assert v==int(summ[c]);extraAdd(g,*names[c],v);extraChecks.append(dict(stateAbbr='MT',district=d,candidate=names[c][0],countySum=v,sourceDistrictVotes=int(summ[c])))
  groups[2026,'30',d]=g
 assert mtCount==57 and len(mtFips)==56
 # VTexact official townId->county map; multiple reporting portions remain disjoint.
 vtGeneral=json.loads((RAW/'vt2026-general.json').read_text());vtStamp=vtGeneral['lastUpdatedDate'];vtUpdated=datetime.datetime.strptime(vtStamp,'%m/%d/%Y %I:%M %p').replace(tzinfo=ZoneInfo('America/New_York')).isoformat();sid='house-repair-vt2026';extraSource(sid,'Vermont','vt2026-federal.json',vtUpdated);sources[sid]['sourceUpdatedAtOriginal']=vtStamp;sources[sid]['officialGeographyMetadata']=extraMeta['vt2026-general.json']
 townCounty=collections.defaultdict(set)
 for r in vtGeneral['townDistricts']:townCounty[r['townId']].add(r['countyName'])
 vtOffice=json.loads((RAW/'vt2026-federal.json').read_text())['d'][0]['o'][0];assert vtOffice['on']=='REPRESENTATIVE TO CONGRESS';rows=[r for r in vtOffice['cs'] if r['tid']!=0];summ=next(r for r in vtOffice['cs'] if r['tid']==0);assert len(rows)==len({(r['tid'],r['repd'],r['send']) for r in rows})
 vtGroups={}
 for r in rows:
  assert len(townCounty[r['tid']])==1,(r['tid'],r['tn']);county=next(iter(townCounty[r['tid']]));g=vtGroups.setdefault(county,extraGroup('Vermont','VT','50','0',sid,'county',county));g.setdefault('sourceReportingPortions',[]).append(dict(townId=r['tid'],town=r['tn'],repDistrict=r['repd'],senateDistrict=r['send'],districtsReported=r['distReported']))
  assert sum(c['vc'] for c in r['rc']+r['wc'])+r['sv']+r['bv']==r['sc']
  for c in r['rc']:extraAdd(g,c['cn'],c['pn'] or '',c['vc'])
  for c in r['wc']:extraAdd(g,c['cn'],'',c['vc'],'sourceWriteInEntries')
  for field in ['sv','bv']:extraAdd(g,'Source reporting field '+field,'',r[field],'sourceReportingCategory')
 for c in summ['rc']+summ['wc']:
  v=sum(x['vc'] for r in rows for x in r['rc']+r['wc'] if x['cid']==c['cid']);assert v==c['vc'],(c['cn'],v,c['vc']);extraChecks.append(dict(stateAbbr='VT',district='0',candidateId=c['cid'],sourceName=c['cn'],countySum=v,sourceDistrictVotes=c['vc']))
 assert len(vtGroups)==14 and sum(g['totalVotes'] for g in vtGroups.values())==summ['sc']
 for g in vtGroups.values():groups[2026,g['countyFips'],'0']=g
 g=extraGroup('Vermont','VT','50','0',sid,'district')
 for c in summ['rc']:extraAdd(g,c['cn'],c['pn'] or '',c['vc'])
 for c in summ['wc']:extraAdd(g,c['cn'],'',c['vc'],'sourceWriteInEntries')
 for field in ['sv','bv']:extraAdd(g,'Source reporting field '+field,'',summ[field],'sourceReportingCategory')
 assert g['totalVotes']==summ['sc'];groups[2026,'50','0']=g
 dump(RAW/'additional2026-validation.json',dict(checks=extraChecks,sdCountyRecords=len(sdGroups),mtCountyDistrictRecords=mtCount,mtCountyCount=len(mtFips),vtCountyRecords=len(vtGroups),vtActualReportingPortions=len(rows),vtTownCount=len({r['tid'] for r in rows}),limitations=['DEprimary resultspage403notimported.','VTsv/bvsource fields retained verbatim as reportingcategories; namedwritein entries remain reportingcategories to avoid asserting their identities/eligibility.','Montana source has retrieval/download time but no separately published count update time.']))
 coverage=[]
 for year in sorted({g['year'] for g in groups.values()}):
  results=sorted([g for g in groups.values() if g['year']==year],key=lambda r:(r.get('countyFips',r['stateFips']),int(r['district'])));ids={s for g in results for s in g['sourceIds']}
  for g in results:
   g['candidates'].sort(key=lambda c:-c['votes']);assert sum(c['votes'] for c in g['candidates']+g['reportingCategories'])==g['totalVotes'];assert len({norm(c['name']) for c in g['candidates']})==len(g['candidates'])
  filename=f'house-{year}.json';dump(OUT/filename,dict(schemaVersion=1,office='house',year=year,snapshotDate='2026-11-06',sources={s:sources[s] for s in sorted(ids)},results=results))
  coverage.append(dict(office='house',year=year,url='/data/house-repairs/'+filename,geoLevels=sorted({g['geoLevel'] for g in results}),rows=len(results),stateCount=len({g['stateFips'] for g in results}),countyCount=len({g['countyFips'] for g in results if g['geoLevel']=='county'}),candidateCount=sum(len(g['candidates']) for g in results),countyDistrictIntersections=True))
 dump(RAW/'identity-evidence.json',dict(archiveSha256=sha(archive),iowa2012RaceAgreement=agreement,iowa2012LabeledReferenceRows=iaEvidence,recoveredRows=evidence,heldRows=held,washingtonStateSumChecks=wa))
 manifest=dict(schemaVersion=1,snapshotDate='2026-11-06',sources=sources,coverage=coverage,limitations=['Missing-district House2006–2014 source rows recovered; all99Iowa2012counties rebuilt to remove source subtotal duplication.','Original archive and prior app datasets remain unchanged.','Candidate identity assigns a contest, never geographically allocates votes.','IA2010 and WA2012 remain unresolved;212IA2012 held archive rows are superseded by99direct precinct rebuilds.','Virginia,SouthDakota,Montana,Vermont2026direct official sources added; other current2026and historical gaps remain. Preliminary feed values are not certified.'],validation=dict(status='passed',missingDistrictSourceRows=len(targets),recoveredCandidateRows=len(recovered),heldCandidateRows=len(held),supersededIowaArchiveRows=212,unresolvedMissingDistrictRows=66,countyDistrictRecords=sum(g['geoLevel']=='county' for g in groups.values()),newJersey2022DistrictCount=len(njChecks),newJersey2022CandidateChecks=sum(len(x['candidateChecks']) for x in njChecks),additional2026States=['SD','MT','VT'],additional2026CountyDistrictRecords=len(sdGroups)+mtCount+len(vtGroups),additional2026CandidateChecks=len(extraChecks),virginia2026DistrictCount=len(vaChecks),virginia2026CandidateChecks=sum(x['candidateChecks'] for x in vaChecks),recoveredVotesConserved=sum(int(r['votes']) for r in recovered),iowa2012RawCountyReplacements=len(iaAudit),iowaDistrictCandidateChecks=len(iaStateChecks),countyRowVotesConserved=sum(g['totalVotes'] for g in groups.values() if g['geoLevel']=='county'),districtSummaryVotes=sum(g['totalVotes'] for g in groups.values() if g['geoLevel']=='district'),washingtonIndependentSourceStateChecks=len(wa),iowaRaceAgreement=agreement))
 dump(OUT/'manifest.json',manifest);dump(RAW/'provenance.json',sources);print(json.dumps(dict(coverage=coverage,validation=manifest['validation'],heldSummary=dict(collections.Counter(r['year']+'-'+r['state_po'] for r in held))),indent=2))
if __name__=='__main__':main()
