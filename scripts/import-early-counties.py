#!/usr/bin/env python3
"""Import bounded 2006–2015 county evidence; immutable earlier app files are read-only.
Run normally from saved snapshots. --download refreshes pinned raw files;
--decode uses uv+rdata to decode the original CC0 RData Governor source.
"""
import argparse,collections,csv,hashlib,io,json,re,subprocess,zipfile,html
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]; RAW=ROOT/'scripts/source-data/early-counties';OUT=ROOT/'public/data/early-counties'
WI_COMMIT='f344a0ee7effcea4cf835750a3584a7fbb754b6d'
SOURCES={
 'early-utah-2010-governor':dict(file='utah-2010-general.xls',url='https://vote.utah.gov/wp-content/uploads/2023/09/2010Gen.xls',sourceUrl='https://vote.utah.gov/historical-election-results/',title='Utah official2010 General Election workbook, Governor county table',version='2010Gen.xls, Governor sheet, official historical index',license='Official public election results'),
 'early-heideman':dict(file='heideman-v1.0.0.zip',url='https://github.com/pmheideman/us-county-election-results/releases/download/v1.0.0/us_county_election_results_v1.0.0.zip',sourceUrl='https://doi.org/10.5281/zenodo.22976553',title='Paul Heideman (2026), U.S. county-level election results, v1.0.0',version='v1.0.0',license='CC BY 4.0; upstream terms preserved in source register'),
 'early-algara-governor':dict(file='algara-governor.Rdata',url='https://dataverse.harvard.edu/api/access/datafile/5028535',sourceUrl='https://doi.org/10.7910/DVN/DGUMFI',title='Carlos Algara and Sharif Amlani (2021), county-level gubernatorial returns 1865–2020',version='Dataverse file 5028535',license='CC0-1.0'),
 'early-wi-recall':dict(file='wi-2012-recall-ward.csv',url=f'https://raw.githubusercontent.com/openelections/openelections-data-wi/{WI_COMMIT}/2012/20120605__wi__general-recall__ward.csv',sourceUrl='https://github.com/openelections/openelections-data-wi',title='OpenElections Wisconsin June 5, 2012 recall ward returns',version=WI_COMMIT,license='OpenElections public election data; underlying state public records'),
 'early-census-geography':dict(file='census-2010-counties.zip',url='https://www2.census.gov/geo/docs/maps-data/data/gazetteer/Gaz_counties_national.zip',sourceUrl='https://www.census.gov/geographies/reference-files/time-series/geo/gazetteer-files.2010.html',title='Census Bureau 2010 county Gazetteer',version='2010 Gazetteer',license='US federal public data'),
}
SOURCES['early-wv-2011-governor']=dict(file='wv-2011-statewide.html',url='https://apps.sos.wv.gov/elections/results/results.aspx?county=Statewide&eid=10&type=OFFICIAL&year=2011',sourceUrl='https://apps.sos.wv.gov/elections/results/results.aspx?county=Statewide&eid=10&type=OFFICIAL&year=2011',title='WestVirginia SOS official2011 special Governor statewide results',version='Election10,2011,OFFICIAL',license='Official public election results')
for candidateId in ('1828','1825','1826','1834','1832','1835','1827','1833'):
 SOURCES['early-wv-2011-'+candidateId]=dict(file='wv-2011-candidate-'+candidateId+'.html',url='https://apps.sos.wv.gov/elections/results/candidate.aspx?year=2011&eid=10&candidate='+candidateId+'&type=OFFICIAL',sourceUrl='https://apps.sos.wv.gov/elections/results/candidate.aspx?year=2011&eid=10&candidate='+candidateId+'&type=OFFICIAL',title='WestVirginia SOS2011 special Governor candidate county table '+candidateId,version='Election10,2011,OFFICIAL',license='Official public election results')

def decode_wv():
 def cells(row):return [html.unescape(re.sub('<[^>]*>','',x)).strip() for x in re.findall(r'<td\b[^>]*>(.*?)</td>',row,flags=re.S|re.I)]
 registry={}
 for row in re.findall(r'<tr\b[^>]*>(.*?)</tr>',(RAW/'wv-2011-statewide.html').read_text(),flags=re.S|re.I):
  if 'candidate.aspx?' not in row:continue
  cc=cells(row)
  if len(cc)!=5:continue
  cid=re.search(r'candidate=(\d+)',row)[1];registry[cid]=dict(candidateId=cid,name=cc[0],party=cc[1],stateVotes=int(cc[2].replace(',','')))
 decoded=[]
 for cid,c in registry.items():
  cr={}
  for row in re.findall(r'<tr\b[^>]*>(.*?)</tr>',(RAW/f'wv-2011-candidate-{cid}.html').read_text(),flags=re.S|re.I):
   if 'results.aspx?' not in row or 'county=' not in row:continue
   cc=cells(row)
   if len(cc)!=5:continue
   county=cc[0];votes=int(cc[1].replace(',',''))
   if county in cr:assert cr[county]==votes
   cr[county]=votes
  assert len(cr)==55 and sum(cr.values())==c['stateVotes'],cid
  decoded.append(dict(c,counties=cr))
 assert len(decoded)==8 and sum(c['stateVotes'] for c in decoded)==301084
 return dict(electionDate='2011-10-04',status='Official Results heading',candidates=decoded)

def dump(p,x):p.write_text(json.dumps(x,ensure_ascii=False,separators=(',',':'))+'\n')
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def num(x):
 if x in ('',None,'NA'):return None
 n=float(x);assert n>=0 and n.is_integer(),x;return int(n)
def party(x):return {'DEM':'Democrat','REP':'Republican'}.get(x,'Other')
def ziprows(z,name,encoding='utf-8',delimiter=','):return csv.DictReader(io.TextIOWrapper(z.open(name),encoding=encoding),delimiter=delimiter)
def reporting(name):
 n=re.sub(r'\s+',' ',name.upper().strip())
 if re.fullmatch(r'EXHAUSTED BALLOTS?',n):return 'exhaustedBallots'
 if re.fullmatch(r'(OVER|UNDER) ?VOTES?',n):return 'overvotes' if n.startswith('OVER') else 'undervotes'
 if re.fullmatch(r'BLANKS?( VOTES?)?',n):return 'blankBallots'
 if n in ('BLANK VOTE/SCATTERING','BLANK VOTE/VOID VOTE/SCATTERING','BLANK/VOID/SCATTERING','BLANK/VOID'):return 'mixedReportingCategory'
 if re.fullmatch(r'(VOID|SPOILED)( VOTES?)?',n):return 'invalidBallots'
 if n in ('SCATTER','SCATTERING','WRITE-IN','WRITE-INS','WRITE IN','WRITE INS','TOTAL WRITE-INS'):return 'unattributedWriteIns'
 if n in ('OTHER CANDIDATES','ALL OTHER CANDIDATES (NOT ITEMIZED IN THE SOURCE)'):return 'unitemizedCandidates'
 return None

def main(download=False,decode=False):
 RAW.mkdir(parents=True,exist_ok=True);OUT.mkdir(parents=True,exist_ok=True)
 prior=json.loads((RAW/'provenance.json').read_text()) if (RAW/'provenance.json').exists() else {}
 for sid,source in SOURCES.items():
  path=RAW/source['file']
  if download or not path.exists():
   temporary=path.with_suffix('.download');subprocess.run(['curl','-fL','--retry','2',source['url'],'-o',str(temporary)],check=True)
   if sid in prior:assert digest(temporary)==prior[sid]['sha256'],f'Source changed; retain and review {temporary}'
   temporary.replace(path)
  if sid in prior:assert digest(path)==prior[sid]['sha256'],path
 provenance={key:dict(source,sha256=digest(RAW/source['file']),snapshotDate='2026-11-06') for key,source in SOURCES.items()}
 decoded=RAW/'algara-governor-decoded.csv'
 if decode or not decoded.exists():
  code="import rdata; from pathlib import Path; p=Path("+repr(str(RAW))+"); rdata.read_rda(p/'algara-governor.Rdata')['gov_elections_release'].to_csv(p/'algara-governor-decoded.csv',index=False)"
  subprocess.run(['uv','run','--with','rdata==1.1.0','python','-c',code],check=True)
 wv=decode_wv();dump(RAW/'wv-2011-governor-decoded.json',wv)
 provenance['early-wv-2011-governor']['decodedJsonSha256']=digest(RAW/'wv-2011-governor-decoded.json')
 provenance['early-wv-2011-governor']['candidateSources']={sid:meta for sid,meta in provenance.items() if sid.startswith('early-wv-2011-') and sid!='early-wv-2011-governor'}
 provenance['early-utah-2010-governor']['decodedJsonSha256']=digest(RAW/'utah-2010-governor-decoded.json')
 provenance['early-utah-2010-governor']['decoder']='xlrd2.0.2 Governor sheet cell values retained verbatim; 25blank write-in cells remain null'
 provenance['early-algara-governor']['decodedCsvSha256']=digest(decoded)
 provenance['early-algara-governor']['decoder']='rdata1.1.0 read_rda gov_elections_release; pandas.to_csv(index=False); values retained, no geographic estimation'
 census=zipfile.ZipFile(RAW/'census-2010-counties.zip')
 geo={r['GEOID']:r for r in ziprows(census,census.namelist()[0],encoding='latin1',delimiter='\t')}
 stateInfo={r['stateAbbr']:(r['stateFips'],r['state']) for r in json.loads((ROOT/'public/data/elections/president-2008.json').read_text())['results'] if r['geoLevel']=='state'}
 z=zipfile.ZipFile(RAW/'heideman-v1.0.0.zip')
 # Verify every publisher-declared SHA256 present in the release before parsing.
 publisherChecks=[]
 for line in z.read('SHA256SUMS.txt').decode().splitlines():
  if not line.strip():continue
  sha,name=line.split(maxsplit=1);name=name.strip().lstrip('*')
  if name in z.namelist():assert hashlib.sha256(z.read(name)).hexdigest()==sha,name;publisherChecks.append(name)
 register={r['source']:r for r in ziprows(z,'SOURCES.csv')}
 sourceGaps=[r for r in ziprows(z,'us_county_results_gaps.csv') if 2006<=int(r['year'])<=2014 and r['office'] in ('house','senate')]
 noBallot=[r for r in ziprows(z,'us_county_results_no_ballot.csv') if 2006<=int(r['year'])<=2014]
 # Stored as gap evidence only: no-ballot geometry is not converted to invented zero votes.
 dump(OUT/'no-ballot-evidence.json',noBallot)
 groups={};excluded=[]; usedSources={}; inputCounts=collections.Counter();inputVotes=collections.Counter()
 def group(office,year,state,county,district,stage,special,sourceId):
  sf,stateName=stateInfo[state];assert county in geo and county.startswith(sf),(state,county)
  contest=f'{office}-{year}-{sf}-{district if district is not None else "state"}-{stage}-{special}'
  key=(office,year,county,district,stage,special)
  if key not in groups:
   groups[key]=dict(office=office,year=year,geoLevel='county',stateFips=sf,state=stateName,stateAbbr=state,countyFips=county,county=geo[county]['NAME'],contestId=contest,stage=stage,special=special,sourceId=sourceId,candidates=[],reportingCategories=[],totalVotes=0,totalVotesBasis='sum of reported candidate and reporting-category votes')
   if district is not None:groups[key]['district']=district
  return groups[key]
 def add(g,name,label,votes,sourceToken=None,flags=()):
  category=reporting(name)
  target=g['reportingCategories'] if category else g['candidates']
  c=next((c for c in target if c['name'].upper()==name.upper()),None)
  if c is None:
   c=dict(name=name,votes=votes)
   if category:c['category']=category
   else:c.update(party=party(label),partyOriginal=label)
   target.append(c)
  else:
   c['votes']+=votes
   if not category and party(label)!='Other':c['party']=party(label)
  g['totalVotes']+=votes
  if sourceToken:
   g.setdefault('upstreamSourceIds',[])
   if sourceToken not in g['upstreamSourceIds']:g['upstreamSourceIds'].append(sourceToken)
  if flags:
   g['qualityFlags']=sorted(set(g.get('qualityFlags',[]))|set(flags))
   if 'totals_possibly_inflated' in flags:g['sourceNeedsReview']=True;g['reviewReasons']=['Source flags possibly inflated totals.']
  if category=='unitemizedCandidates':g['candidateDetailIncomplete']=True
 # Regular House and Senate county results, exact candidate/party-line counts.
 heldContests={(r['office'],r['year'],r['county_fips'],r['district']) for r in ziprows(z,'us_county_results_long.csv') if 2006<=int(r['year'])<=2014 and r['office'] in ('house','senate') and (not float(r['votes']).is_integer() or float(r['votes'])<0)}
 for r in ziprows(z,'us_county_results_long.csv'):
  office=r['office'];year=int(r['year'])
  if not 2006<=year<=2014 or office not in ('house','senate'):continue
  if (office,r['year'],r['county_fips'],r['district']) in heldContests:
   excluded.append(dict(office=office,year=year,stateAbbr=r['state_po'],countyFips=r['county_fips'],district=r['district'],candidate=r['candidate'],sourceValue=r['votes'],reason='entire contest held: source contains fractional or negative vote count',source=r['source']));continue
  if office=='house' and not r['district']:
   excluded.append(dict(office=office,year=year,stateAbbr=r['state_po'],countyFips=r['county_fips'],candidate=r['candidate'],votes=num(r['votes']),reason='source district missing; cannot assert county-district intersection',source=r['source']));continue
  county=r['county_fips']
  if county not in geo:excluded.append(dict(office=office,year=year,countyFips=county,reason='county FIPS not in 2010 Census reference'));continue
  district=str(int(r['district'])) if office=='house' else None
  stage=r['stage'];override=None
  if office=='senate' and (r['state_po'],year) in [('GA',2008),('LA',2014)]:
   stage='runoff';override=dict(fromStage=r['stage'],toStage='runoff',sourceUrl='https://clerk.house.gov/member_info/electionInfo/2008/2008Stat.htm' if year==2008 else 'https://www.fec.gov/documents/1698/2014senate.pdf',reason='County candidate sums match the published decisive runoff totals; no first round synthesized.')
  g=group(office,year,r['state_po'],county,district,stage,False,'early-heideman');g['sourceStage']=r['stage']
  if override:g['sourceStageOverride']=override
  sourceToken=r['source'];usedSources[sourceToken]=register[sourceToken]
  g['roundCoverage']='source supplies one final reported round; earlier rounds and specials are not included'
  add(g,r['candidate'],r['party_group'],num(r['votes']),sourceToken,[x for x in r['quality_flag'].split(';') if x])
  # Preserve original ballot-line labels separately from major-party grouping.
  if not reporting(r['candidate']):
   c=next(c for c in g['candidates'] if c['name'].upper()==r['candidate'].upper());c.setdefault('ballotParties',[])
   if r['party'] not in c['ballotParties']:c['ballotParties'].append(r['party'])
  inputCounts[office,year]+=1;inputVotes[office,year]+=num(r['votes'])
 # Gubernatorial source directly itemizes the major nominees and a county total.
 for r in csv.DictReader(decoded.open()):
  year=int(float(r['election_year']))
  if not 2006<=year<=2015:continue
  vals=[num(r[k]) for k in ('democratic_raw_votes','republican_raw_votes','raw_county_vote_totals')]
  if any(v is None for v in vals):excluded.append(dict(office='governor',year=year,stateAbbr=r['state'],countyFips=r['fips'],reason='source missing candidate/total counts; not converted to zero'));continue
  if r['fips'] not in geo:excluded.append(dict(office='governor',year=year,countyFips=r['fips'],reason='county FIPS not in 2010 reference'));continue
  dem,rep,total=vals;assert total>=dem+rep
  stage='runoff' if r['state']=='LA' and year==2015 else 'general'
  special=(r['state'],year) in [('UT',2010),('WV',2011)]
  g=group('governor',year,r['state'],r['fips'],None,stage,special,'early-algara-governor');g['sourceStage']=r['election_type'];g['sourceElectionId']=r['election_id']
  if special:g['sourceSpecialOverride']=dict(fromSpecial=False,toSpecial=True,reason='Special election explicitly identified in archived FiveThirtyEight race metadata; source G encodes general-election type.',sourceUrl='https://github.com/fivethirtyeight/election-results')
  if stage=='runoff':g['sourceStageOverride']=dict(fromStage=r['election_type'],toStage='runoff',date='2015-11-21',reason='Final Edwards/Vitter election; source G encodes general election type, not distinct ballot rounds.',sourceUrl='https://www.cbsnews.com/news/louisiana-picks-democrat-john-bel-edwards-as-next-governor/')
  add(g,r['dem_nominee'],'DEM',dem);add(g,r['rep_nominee'],'REP',rep)
  residual=total-dem-rep
  if residual:add(g,'All other candidates (not itemized in the source)','OTHER',residual)
  g['totalVotesBasis']='source raw_county_vote_totals; other-candidate aggregate equals source total minus source major-party counts'
  g['roundCoverage']='one source final general-election record; no earlier rounds or specials synthesized'
  inputCounts['governor',year]+=2+bool(residual);inputVotes['governor',year]+=total
 # Actual Utah2010 special Governor returns are absent from Algara; official workbook supplies29counties.
 utah=json.loads((RAW/'utah-2010-governor-decoded.json').read_text());assert utah['sheet']=='Governor'
 utahRows=utah['rows'];assert utahRows[1][4:]==['Anderson & Maxfield "U"','Corroon & Allen "D"','Herbert & Bell "R"','McCullough & Cramer "L"','Michael William Heath (Write-In)']
 utahCounties={r['NAME'].removesuffix(' County').upper():f for f,r in geo.items() if r['USPS']=='UT'}
 actualUtah=[r for r in utahRows if str(r[0]).upper() in utahCounties];assert len(actualUtah)==29
 utahControl=next(r for r in utahRows if r[0]=='Total')
 for i,expected in [(4,13038),(5,205246),(6,412151),(7,12871)]:assert sum(num(r[i]) for r in actualUtah)==num(utahControl[i])==expected
 for row in actualUtah:
  county=utahCounties[row[0].upper()];g=group('governor',2010,'UT',county,None,'general',True,'early-utah-2010-governor')
  g['electionDate']='2010-11-02';g['sourceContestTitle']='Governor & Lieutenant Governor'
  for i,label in [(4,'OTHER'),(5,'DEM'),(6,'REP'),(7,'OTHER')]:add(g,utahRows[1][i],label,num(row[i]))
  writein=num(row[8]);g['candidates'].append(dict(name='Michael William Heath (Write-In)',party='Other',partyOriginal='Write-In',writein=True,votes=writein))
  if writein is None:
   g['candidates'][-1]['missingVoteCount']=True;g['incomplete']=True
   g['qualityFlags']=['source_blank_writein_count'];g['sourceMissingnessNote']='Official workbook leaves this qualified-write-in cell blank; retained null, not assumed zero. Four main-ticket counts are explicitly numeric.'
  else:g['totalVotes']+=writein
  g['totalVotesBasis']='sum of explicitly numeric Governor ticket/write-in counts; source blank write-in cells remain null, not zero; not all election ballots cast'
  g['ballotsCastAllContests']=num(row[2]);g['registeredVoters']=num(row[1])
  g['specialElectionBasis']='Utah Archives states Herbert was elected to serve out remainder of Huntsman term in special gubernatorial election2010'
  g['specialElectionSourceUrl']='https://archives.utah.gov/research/entities/5027/'
  g['sourceReconciliation']=dict(statewideFourTicketControls={'Anderson & Maxfield':13038,'Corroon & Allen':205246,'Herbert & Bell':412151,'McCullough & Cramer':12871},qualifiedWriteinStateControl=None,qualifiedWriteinKnownCountySum=1,policy='All four numeric ticket columns exactly reconcile. State write-in control is blank; no zero or corrected state control inferred.')
  inputCounts['governor',2010]+=5;inputVotes['governor',2010]+=g['totalVotes']
 assert sum(r[8]=='' for r in actualUtah)==25 and sum(r[8]==0 for r in actualUtah)==3 and sum(num(r[8]) or 0 for r in actualUtah)==1
 # Actual WV2011 special is also absent from Algara; official candidate county pages give8x55counts.
 wvCounties={r['NAME'].removesuffix(' County').upper():f for f,r in geo.items() if r['USPS']=='WV'};assert len(wvCounties)==55
 for c in wv['candidates']:
  label={'Democrat':'DEM','Republican':'REP'}.get(c['party'],'OTHER')
  for county,votes in c['counties'].items():
   assert county.upper() in wvCounties,county
   g=group('governor',2011,'WV',wvCounties[county.upper()],None,'general',True,'early-wv-2011-governor')
   g['electionDate']='2011-10-04';g['sourcePublishedStatus']='Official Results';g['sourceContestTitle']='Special Gubernatorial General Election - October4,2011'
   add(g,c['name'],label,num(votes));candidate=next(x for x in g['candidates'] if x['name']==c['name']);candidate['partyOriginal']=c['party'];candidate['sourceCandidateId']=c['candidateId'];candidate['sourceUrl']=SOURCES['early-wv-2011-'+c['candidateId']]['url']
   if c['party']=='Write-In':candidate['writein']=True
   g['totalVotesBasis']='sum of eight explicitly itemized candidate counts; not ballots cast; candidate-page TotalVotes fields are not used as vote counts'
   g['certificationBasis']='SOS page heading explicitly says Official Results; generic site disclaimer retained in raw HTML, no independent certificate examined'
   inputCounts['governor',2011]+=1;inputVotes['governor',2011]+=votes
 wvResults=[g for (office,year,*_),g in groups.items() if office=='governor' and year==2011 and g['stateAbbr']=='WV']
 assert len(wvResults)==55 and sum(r['totalVotes'] for r in wvResults)==301084
 # Explicit county names in WI wards, exact summation; no coordinate allocation.
 wisconsin={r['NAME'].removesuffix(' County').upper():fips for fips,r in geo.items() if r['USPS']=='WI'}
 wardKeys=set();wardTotals={};wardVotes=collections.Counter()
 for r in csv.DictReader((RAW/'wi-2012-recall-ward.csv').open()):
  if r['office']!='Governor':continue
  county=wisconsin[r['county'].upper()];key=(county,r['ward'],r['candidate'],r['party']);assert key not in wardKeys,key;wardKeys.add(key)
  ward=(county,r['ward']);total=num(r['totalvotes'])
  if ward in wardTotals:assert wardTotals[ward]==total
  wardTotals[ward]=total;votes=num(r['votes']);wardVotes[ward]+=votes
  g=group('governor',2012,'WI',county,None,'recall',True,'early-wi-recall');g['electionDate']='2012-06-05'
  add(g,r['candidate'],r['party'],votes);inputCounts['governor',2012]+=1;inputVotes['governor',2012]+=votes
  g['aggregation']='sum of source ward rows through explicit county name, matched to Census Wisconsin counties'
 for ward,total in wardTotals.items():assert wardVotes[ward]==total,(ward,total,wardVotes[ward])
 byfile=collections.defaultdict(list)
 for (office,year,*_),g in groups.items():
  # Exact known absent nominee slots; do not blanket-match actual write-ins named NONE.
  absent=[];actual=[]
  for c in g['candidates']:
   if office=='senate' and (g['stateAbbr'],year) in [('KS',2014),('IN',2006),('AR',2008),('AL',2014),('SD',2010)] and c['name']=='None' and c['votes']==0:
    absent.append(dict(name=c['name'],votes=0,category='absentNomineeSlot',sourceSlotParty=c['party'],sourceMeaning='Historical analysis has no nominee in this party slot; not an actual candidate.'))
   else:actual.append(c)
  g['candidates']=actual;g['reportingCategories'].extend(absent)
  # Historical analysis groups independents with the Democratic nominee slot.
  for c in g['candidates']:
   if office=='senate' and ((g['stateAbbr']=='VT' and year in (2006,2012) and 'SANDERS' in c['name'].upper()) or (g['stateAbbr']=='ME' and year==2012 and 'ANGUS KING' in c['name'].upper())):
    c['sourcePartyGroup']=c['party'];c['party']='Other';c['partyOriginal']='Independent'
    c['partyOverrideSource']='https://history.house.gov/People/Listing/S/SANDERS%2C-Bernard-%28S000033%29/' if g['stateAbbr']=='VT' else 'https://www.king.senate.gov/about'
  if any(c['category']=='unitemizedCandidates' and c['votes']>=max((x['votes'] for x in g['candidates']),default=0) for c in g['reportingCategories']):
   g['sourceNeedsReview']=True;g.setdefault('reviewReasons',[]).append('Unitemized other-candidate votes could exceed the leading named candidate; winner/share/margin require candidate-level evidence.')
  if office=='governor' and year==2010 and g['stateAbbr']=='ME':
   g['sourceNeedsReview']=True;g.setdefault('reviewReasons',[]).append('Historical county sums for the major nominees differ from Maine official statewide totals (LePage217862 vs218065; Mitchell109087 vs109387). County source discrepancy requires review; no scaling applied.')
  if g['stateAbbr']=='MO' and g['countyFips'] in ('29047','29095','29165') and ((office=='governor' and year in (2008,2012)) or (office=='senate' and year in (2006,2010,2012))):
   g['sourceNeedsReview']=True;g['incomplete']=True;g.setdefault('reviewReasons',[]).append('Source statewide sum omits the separate Kansas City reporting bucket. Affected Jackson/Clay/Platte county portions are held for review; no city votes are geographically allocated.')
  g['candidates'].sort(key=lambda c:-(c['votes'] if c['votes'] is not None else -1))
  g['sourceLinks']=sorted({usedSources[s]['locator'] for s in g.get('upstreamSourceIds',[]) if usedSources[s]['locator'].startswith('http')})
  if not g['sourceLinks']:g['sourceLinks']=[SOURCES[g['sourceId']]['sourceUrl']]
  byfile[office,year].append(g)
 manifest=dict(schemaVersion=1,snapshotDate='2026-11-06',sources=provenance,upstreamSources=usedSources,coverage=[],limitations=[
  'Bounded early supplement: House/Senate2006–2014 regular final-round returns; Governor2006–2015, plus officialUT2010special andWI2012recall. No 2016–2026 data in this directory.',
  'Research compilations preserve actual counts; they are not certification authorities. No county allocations or estimated votes.',
  'Heideman excludes AK,HI,DC and specials. House district missing rows are excluded and cataloged, not assigned by candidate inference.',
  'Governor archive excludes Alaska; three KalawaoHI county rows have null counts. No zero replacements.',
  'Some minor-candidate counts are actual unitemized source aggregates, retained separately from named candidates. If aggregate could exceed named leader, winner metrics are suppressed.',
  'Historical nominee-slot party labels corrected for Independent SandersVT2006/12 and KingME2012 using primary candidate biographies; original source grouping retained.',
  'House county-district portions remain separate. No-ballot source inventory is evidence of missing vote counts, never invented zero returns.',
  '2010 Census county identities are used for historical joins; current Connecticut planning regions and later county changes may not match maps.',
  'Source rounds are retained with bounded documented GA2008Senate/LA2014Senate/LA2015Governor runoff labels. Missing earlier rounds are not invented.',
 ])
 manifest['sourceHolds']=[
  dict(office='senate',year=2010,stateFips='49',contestId='senate-2010-49-state-general-False',reason='Legacy state record has Lee360403/Granato191732; official general totals Lee390179/Granato207685. No silent source correction.',sourceURLs=['https://www.fec.gov/documents/1674/federalelections2010.pdf'],officialVerification=dict(publisher='Federal Election Commission, Federal Elections2010, Utah Senate general',candidateVotes={'Mike Lee':390179,'Sam F. Granato':207685},totalVotes=633829)),
  dict(office='senate',year=2006,stateFips='54',contestId='senate-2006-54-state-general-False',reason='Legacy general record contains primary votes Byrd159154/Raese47408. Official general totals Byrd296276/Raese155043.',sourceURLs=['https://www.fec.gov/documents/1639/2006senate.pdf'],officialVerification=dict(publisher='Federal Election Commission,2006Senate results,WestVirginia general',candidateVotes={'Robert C. Byrd':296276,'John R. Raese':155043},totalVotes=459884)),
  dict(office='senate',year=2014,stateFips='22',contestId='senate-2014-22-state-general-False',reason='Legacy record Cassidy1712379/Landrieu1561210 and total3523183 does not match an official election round. Official runoff Cassidy712379/Landrieu561210.',sourceURLs=['https://www.fec.gov/documents/1698/2014senate.pdf'],officialVerification=dict(publisher='Federal Election Commission,2014Senate results,Louisiana December6runoff',candidateVotes={'Bill Cassidy':712379,'Mary Landrieu':561210},totalVotes=1273589)),
  dict(office='governor',year=2010,stateFips='23',contestId='governor-2010-1292',reason='Legacy statewide record totals43037 with LePage18007/Mitchell6838, a partial result. Maine official statewide totals LePage218065/Mitchell109387.',sourceURLs=['https://www.maine.gov/sos/sites/maine.gov.sos/files/inline-files/2010%20Gov%20General.pdf','https://www2.census.gov/library/publications/2011/compendia/statab/131ed/tables/12s0417.pdf'],officialVerification=dict(publisher='Maine Secretary of State,November2Governor general tabulations',candidateVotes={'Paul LePage':218065,'Elizabeth Mitchell':109387,'Eliot Cutler':208270},totalVotes=580538,totalVotesBasis='Official table includes blank votes; valid-candidate total572766 is different')),
 ]
 for (office,year),results in sorted(byfile.items()):
  votes=sum(r['totalVotes'] for r in results);assert votes==inputVotes[office,year]
  records=len(results);assert len({(r['countyFips'],r.get('district'),r['stage'],r['special']) for r in results})==records
  for r in results:
   assert sum(c['votes'] or 0 for c in r['candidates']+r['reportingCategories'])==r['totalVotes']
   assert all(reporting(c['name']) is None for c in r['candidates'])
  ids=sorted({r['sourceId'] for r in results});filename=f'{office}-{year}.json'
  dump(OUT/filename,dict(schemaVersion=1,office=office,year=year,sources={s:provenance[s] for s in ids},upstreamSources={s:usedSources[s] for r in results for s in r.get('upstreamSourceIds',[])},results=results))
  manifest['coverage'].append(dict(office=office,year=year,url='/data/early-counties/'+filename,geoLevels=['county'],rows=records,contests=len({r['contestId'] for r in results}),stateCount=len({r['stateFips'] for r in results}),countyCount=len({r['countyFips'] for r in results}),candidateCount=sum(len(r['candidates']) for r in results),reportingCategoryCount=sum(len(r['reportingCategories']) for r in results),countyDistrictIntersections=office=='house',sourceNeedsReviewCount=sum(bool(r.get('sourceNeedsReview')) for r in results)))
 # Regression against primary published decisive-round Senate totals.
 for year,state,partyCode,expected in [(2008,'GA','Republican',1228033),(2008,'GA','Democrat',909923),(2014,'LA','Republican',712379),(2014,'LA','Democrat',561210)]:
  rr=[r for r in byfile['senate',year] if r['stateAbbr']==state];assert all(r['stage']=='runoff' for r in rr);assert sum(c['votes'] for r in rr for c in r['candidates'] if c['party']==partyCode)==expected
 wi=[r for r in byfile['governor',2012] if r['stateAbbr']=='WI'];assert len(wi)==72 and all(r['special'] and r['stage']=='recall' for r in wi)
 missingDistrict=collections.Counter((r['office'],r['year'],r.get('stateAbbr')) for r in excluded)
 gaps=dict(sourceStateYearGaps=sourceGaps,excludedRows=excluded,excludedSummary=[dict(office=o,year=y,stateAbbr=s,rows=n) for (o,y,s),n in missingDistrict.items()],uncoveredScope=['Early House/Senate specials remain excluded. UT2010Governor special is separately sourced from official workbook; WV2011special55counties separately sourced from officialSOS8candidate pages. WI2012recall separately sourced.','AK/HI/DC early federal county returns are outside Heideman. Governor Alaska absent.','President county history already available in immutable base files; this supplement does not duplicate it.','Unknown-district House rows remain unavailable as county-district intersections.'])
 missing=[]
 for (office,year),results in sorted(byfile.items()):
  baseline=json.loads((ROOT/f'public/data/elections/{office}-{year}.json').read_text())['results']
  expectedStates={r['stateFips'] for r in baseline}
  present={r['countyFips'] for r in results}
  for fips,county in geo.items():
   if fips[:2] in expectedStates and fips not in present:
    missing.append(dict(office=office,year=year,stateAbbr=county['USPS'],countyFips=fips,county=county['NAME'],reason='No imported county result for a state with a baseline office contest. Consult source gaps/special/no-ballot inventory; not zero votes.'))
 gaps['missingCountyPresence']=missing
 gaps['houseMissingCoverageCaution']='County-presence list cannot enumerate missing county-district portions where district boundaries are not sourced; source missing-district/no-ballot inventories are retained separately.'
 # Regression: analytical party slots never override actual independent candidacies.
 for year,state,word in [(2006,'VT','SANDERS'),(2012,'VT','SANDERS'),(2012,'ME','ANGUS KING')]:
  assert all(c['party']=='Other' and c['partyOriginal']=='Independent' for r in byfile['senate',year] if r['stateAbbr']==state for c in r['candidates'] if word in c['name'].upper())
 assert sum(c['category']=='absentNomineeSlot' for r in groups.values() for c in r['reportingCategories'])==405
 assert all(not(c['name']=='None' and c['votes']==0) for r in groups.values() for c in r['candidates'])
 assert not any(r['countyFips']=='01101' and r.get('district')=='2' for r in byfile['house',2010])
 dump(OUT/'gaps.json',gaps);dump(OUT/'manifest.json',manifest);dump(RAW/'provenance.json',provenance)
 validation=dict(status='passed',files=len(byfile),geographicResults=len(groups),candidateEntries=sum(len(r['candidates']) for r in groups.values()),reportingCategoryEntries=sum(len(r['reportingCategories']) for r in groups.values()),sourceRowsAccepted=sum(inputCounts.values()),excludedRows=len(excluded),publisherHashChecks=publisherChecks,checks=['All reported counts nonnegative integers;25UTwritein blanks explicitlynull','County FIPS in Census2010 Gazetteer with matching state prefix','Candidate/category sums conserve source counts','House portions retain district; missing district held','Source publisher ZIP SHA256 inventory verified','Ward recall sums equal perward source total;72counties','GA2008Senate and LA2014Senate totals match primary runoff reports','Special recall remains separate from regular elections','Analytical DEM slot does not misclassify Independent Sanders/King','Fractional Alabama2010MontgomeryCD2 entirecontest held without rounding','Other-candidate aggregate cannot produce an asserted individual winner','405knownzero absent nominee slots retained as reportingcategories, not people','UT2010official29county special:fourstatecontrol columns match;25blankwriteins remainnull/3explicitzeros/1explicitvote','WV2011official55county special:all8candidate county sums equal published statewide controls301084'])
 dump(OUT/'validation.json',validation);print(json.dumps(validation,indent=2))

if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--download',action='store_true');parser.add_argument('--decode',action='store_true');args=parser.parse_args();main(args.download,args.decode)
