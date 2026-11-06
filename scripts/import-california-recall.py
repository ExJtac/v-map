#!/usr/bin/env python3
"""Import official California2021 recall and conditional replacement returns separately.
Standard library only. Preserves SOV originals and SSOV amendments, printed controls,
and original sources; no replacement candidate is an elected governor.
"""
import argparse,collections,csv,hashlib,io,json,re,subprocess,zipfile,xml.etree.ElementTree as ET
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];RAW=ROOT/'scripts/source-data/california-recall';OUT=ROOT/'public/data/california-recall'
BASE='https://elections.cdn.sos.ca.gov/sov/2021-recall/'
SOURCES={
 'ca-recall-question':dict(file='question.xlsx',url=BASE+'ssov/recall-summary-by-county.xlsx',title='California SOS2021recall, Supplement: Recall Question Statewide Summary by County'),
 'ca-recall-replacement':dict(file='replacement.xlsx',url=BASE+'ssov/recall-candidate-summary-by-county.xlsx',title='California SOS2021recall, Supplement: Replacement Candidates Statewide Summary by County'),
 'ca-recall-certificate':dict(file='supplement-certificate.pdf',url=BASE+'ssov/certificate.pdf',title='California SOS Supplement certificate, February17,2022'),
 'ca-recall-amendment':dict(file='supplement-notes.pdf',url=BASE+'ssov/explanatory-notes.pdf',title='California SOS Supplement explanatory notes: Plumas amended December15,2021'),
 'ca-recall-outcome':dict(file='official-outcome.pdf',url=BASE+'sov/01-about-the-sov.pdf',title='California SOS About the2021 Statement of Vote: recall defeated'),
 'ca-recall-original-question':dict(file='original-question.csv',url=BASE+'sov/csv-recall-question.csv',title='California SOS original2021 Recall Question CSV, before Plumas amendment'),
 'ca-recall-original-candidates':dict(file='original-candidates.csv',url=BASE+'sov/csv-candidates.csv',title='California SOS original2021 Replacement Candidates CSV, before Plumas amendment'),
 'ca-recall-census':dict(file='census-2010-counties.zip',url='https://www2.census.gov/geo/docs/maps-data/data/gazetteer/Gaz_counties_national.zip',title='Census2010 county Gazetteer: California county identities'),
}
NS={'m':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
def dump(path,x):path.write_text(json.dumps(x,ensure_ascii=False,separators=(',',':'))+'\n')
def sha(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def text(x):return re.sub(r'\s+',' ',str(x).replace('\\n',' ')).strip()
def key(x):return re.sub('[^A-Z0-9]','',text(x).upper())
def number(x):assert isinstance(x,(int,float)) and x>=0 and int(x)==x,x;return int(x)
def xlsx_rows(path):
 """Read cached numeric and shared-string cells from the unmodified official workbook."""
 z=zipfile.ZipFile(path);strings=[]
 if 'xl/sharedStrings.xml' in z.namelist():strings=[''.join(s.itertext()) for s in ET.fromstring(z.read('xl/sharedStrings.xml')).findall('m:si',NS)]
 rows=[]
 for row in ET.fromstring(z.read('xl/worksheets/sheet1.xml')).findall('.//m:sheetData/m:row',NS):
  vals={}
  for cell in row.findall('m:c',NS):
   col=re.match('[A-Z]+',cell.attrib['r'])[0];i=0
   for letter in col:i=i*26+ord(letter)-64
   v=cell.find('m:v',NS);kind=cell.attrib.get('t')
   if kind=='s':value=strings[int(v.text)]
   elif kind=='inlineStr':value=''.join(cell.find('m:is',NS).itertext())
   elif v is not None:value=float(v.text);value=int(value) if value.is_integer() else value
   else:value=None
   vals[i-1]=value
  rows.append([vals.get(i) for i in range(max(vals,default=-1)+1)])
 return rows

def main(download=False):
 RAW.mkdir(parents=True,exist_ok=True);OUT.mkdir(parents=True,exist_ok=True)
 old=json.loads((RAW/'provenance.json').read_text()) if (RAW/'provenance.json').exists() else {}
 sources={}
 for sid,source in SOURCES.items():
  path=RAW/source['file']
  if download or not path.exists():
   temp=path.with_suffix('.download');subprocess.run(['curl','-fsSL','--retry','2',source['url'],'-o',str(temp)],check=True)
   if sid in old:assert sha(temp)==old[sid]['sha256'],f'Source changed: retain/review {temp}'
   temp.replace(path)
  digest=sha(path)
  if sid in old:assert digest==old[sid]['sha256'],path
  sources[sid]=dict(source,sourceUrl=source['url'],sha256=digest,snapshotDate='2026-11-06',publisher='California Secretary of State' if sid!='ca-recall-census' else 'US Census Bureau',license='Official public election results' if sid!='ca-recall-census' else 'US federal public data',version='Supplement certified2022-02-17; Plumas amendment2021-12-15' if sid in ('ca-recall-question','ca-recall-replacement') else 'Preserved original official publication')
 census=zipfile.ZipFile(RAW/'census-2010-counties.zip');counties={key(r['NAME'].removesuffix(' County')):r['GEOID'] for r in csv.DictReader(io.TextIOWrapper(census.open(census.namelist()[0]),encoding='latin1'),delimiter='\t') if r['USPS']=='CA'};assert len(counties)==58
 originals={r['County Name']:r for r in csv.DictReader((RAW/'original-question.csv').open())}
 candOriginal=[r for r in csv.DictReader((RAW/'original-candidates.csv').open()) if r['Contest ID']=='20000000000' and r['Contest Name']=='Governor'];registry={key(r['Candidate Name']):r for r in candOriginal if r['County Name']=='Alameda'};assert len(registry)==53
 records=[];reconciliation=[];amendments=[]
 for contestType,filename,sourceId in [('recall-question','question.xlsx','ca-recall-question'),('replacement-election','replacement.xlsx','ca-recall-replacement')]:
  rows=xlsx_rows(RAW/filename)
  if contestType=='recall-question':names=['Yes','No'];parties=['Other','Other'];columns=[1,2];first=3
  else:
   names=[text(x) for x in rows[0][1:]];parties=[text(x) for x in rows[1][1:]];columns=list(range(1,len(names)+1));first=2
   assert len(names)==53 and all(key(n) in registry for n in names)
  countyRows=[];stateRow=None
  for row in rows[first:]:
   if not row or not row[0] or text(row[0]).lower()=='percent':continue
   label=text(row[0]);isState=label=='State Totals';county='Plumas' if label=='Plumas1' else label
   if not isState:assert key(county) in counties,county
   values=[number(row[i]) for i in columns]
   r=dict(office='governor',year=2021,geoLevel='state' if isState else 'county',stateFips='06',state='California',stateAbbr='CA',contestId='governor-2021-06-recall-'+contestType,contestType=contestType,stage='recall',special=True,electionDate='2021-09-14',electionStatus='certified',certificationDate='2022-02-17',certificationBasis='California Secretary of State Supplement certificate dated February17,2022; see preserved certificate',candidates=[],reportingCategories=[],totalVotes=sum(values),totalVotesBasis='sum of valid votes reported for this question/contest; not all ballots cast',sourceId=sourceId,sourceLinks=[sources[sourceId]['url'],sources['ca-recall-certificate']['url']],winnerEligible=False,suppressElectionWinner=True,sourceElectionOutcome='Recall defeated; conditional replacement contest did not elect a governor',outcomeSourceUrl=sources['ca-recall-outcome']['url'],outcomeType='ballotmeasure' if contestType=='recall-question' else 'conditional-replacement')
   if not isState:r.update(county=county,countyFips=counties[key(county)],sourceCountyLabel=label)
   for name,party,votes in zip(names,parties,values):
    if contestType=='recall-question':candidate=dict(name=name,party='Other',partyOriginal='Ballot choice; no candidate party',votes=votes,choiceType='ballot-measure-response')
    else:
     original=registry[key(name)];actualParty=original['Party Name'];normalized='Democrat' if actualParty=='Democratic' else 'Republican' if actualParty=='Republican' else 'Other'
     candidate=dict(name=original['Candidate Name'],party=normalized,partyOriginal=actualParty,votes=votes,candidateId=original['Candidate ID'],writein=original['Write-in Flag']=='Y')
    r['candidates'].append(candidate)
   if isState:assert stateRow is None;stateRow=r
   else:
    countyRows.append(r)
    for i,c in enumerate(r['candidates']):
     if contestType=='recall-question':oldvote=int(originals[county]['Yes Votes' if i==0 else 'No Votes'])
     else:
      source=next(x for x in candOriginal if x['County Name']==county and key(x['Candidate Name'])==key(c['name']));oldvote=int(source['Vote Total'].replace(',',''))
     if oldvote!=c['votes']:
      amendment=dict(county=county,countyFips=r['countyFips'],contestType=contestType,name=c['name'],originalSovVotes=oldvote,supplementVotes=c['votes'],difference=c['votes']-oldvote,amendmentDate='2021-12-15',sourceUrl=sources['ca-recall-amendment']['url']);amendments.append(amendment);r.setdefault('sourceAmendments',[]).append(amendment)
  assert len(countyRows)==58 and len({r['countyFips'] for r in countyRows})==58 and stateRow is not None
  sums=[sum(r['candidates'][i]['votes'] for r in countyRows) for i in range(len(names))]
  diffs=[dict(name=c['name'],publishedStateVotes=c['votes'],sumCountyVotes=sums[i],countyMinusState=sums[i]-c['votes']) for i,c in enumerate(stateRow['candidates']) if sums[i]!=c['votes']]
  assert len(diffs)==1 and diffs[0]['countyMinusState']==1,(contestType,diffs)
  stateRow['sourceNeedsReview']=True;stateRow['reviewReasons']=['Supplement amended Plumas county by one vote but printed statewide control remains unchanged. Original printed state count retained; county sum exceeds it by one. No silent correction.'];stateRow['statewideReconciliation']=dict(differences=diffs,explanationSourceUrl=sources['ca-recall-amendment']['url'])
  reconciliation.append(dict(contestType=contestType,differences=diffs,policy='Actual amended county values and independently printed state totals retained separately. No residual allocated or silent adjustment.'))
  records.extend(countyRows+[stateRow])
 assert len(records)==118 and len(amendments)==2 and all(a['county']=='Plumas' and a['difference']==1 for a in amendments)
 stateQuestion=next(r for r in records if r['geoLevel']=='state' and r['contestType']=='recall-question');assert {c['name']:c['votes'] for c in stateQuestion['candidates']}=={'Yes':4894473,'No':7944092};assert stateQuestion['candidates'][1]['votes']>stateQuestion['totalVotes']/2
 assert len({(r['geoLevel'],r.get('countyFips'),r['contestType']) for r in records})==118
 for r in records:assert sum(c['votes'] for c in r['candidates'])==r['totalVotes'] and r['winnerEligible'] is False
 output=dict(schemaVersion=1,office='governor',year=2021,snapshotDate='2026-11-06',sources=sources,results=records)
 dump(OUT/'governor-2021.json',output)
 manifest=dict(schemaVersion=1,snapshotDate='2026-11-06',sources=sources,coverage=[dict(office='governor',year=2021,url='/data/california-recall/governor-2021.json',geoLevels=['county','state'],rows=118,stateCount=1,countyCount=58,contests=2,contestTypes=['recall-question','replacement-election'],sourceNeedsReviewCount=2)],limitations=['Recall question is a ballot measure, not an elected-governor contest. Replacement candidates are conditional and no replacement was elected because recall failed.','Each question has its own valid-vote denominator; voter may answer either or both. Totals do not imply ballots cast, zero undervotes or complete turnout.','Supplement includes Plumas amended canvass; its printed statewide controls remain one vote below county sums for Yes and Larry Elder. Both published views are preserved with explicit state review flags.','No county allocations or estimated votes. Census county-name joins verified for all58counties.'])
 dump(OUT/'manifest.json',manifest);dump(OUT/'reconciliation.json',dict(amendments=amendments,statewideControls=reconciliation))
 dump(RAW/'provenance.json',sources)
 validation=dict(status='passed',files=1,results=118,countyResults=116,stateResults=2,counties=58,contestTypes=['recall-question','replacement-election'],replacementCandidates=53,sourceNeedsReviewCount=2,checks=['Original source SHA256 preserved','58Census-verified county identities for each question','Nonnegative integer counts and exact withinrecord sums','53replacement names/party/writein identifiers match official original CSV registry','Only documented Plumas amendments differ from originalCSV:Yes+1/Elder+1','Explicit published statewide controls one below amended county sums','Independent state rows never substituted with derived county sums','Recallquestion No majority verified; allrecords suppress elected-governor winner','Distinct contestType preserves both questions'])
 dump(OUT/'validation.json',validation);print(json.dumps(validation,indent=2))
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--download',action='store_true');main(p.parse_args().download)
