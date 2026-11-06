#!/usr/bin/env python3
"""Rebuild official off-cycle governor snapshots, offline; no inferred county votes."""
import collections, csv, hashlib, io, json, re, subprocess, zipfile
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
RAW=ROOT/'scripts/source-data/offcycle-governors'
OUT=ROOT/'public/data/offcycle-governors'
DATE='2026-11-06'
STATES={'21':('Kentucky','KY',120),'22':('Louisiana','LA',64),'28':('Mississippi','MS',82),'34':('New Jersey','NJ',21),'51':('Virginia','VA',133)}
BASE='https://voterportal.sos.la.gov/ElectionResults/ElectionResults/Data?blob='
VA='https://enr.elections.virginia.gov/results/public/api/elections/virginia/2025-November-General'
URLS={
'nj-2021.pdf':'https://www.nj.gov/state/elections/assets/pdf/election-results/2021/2021-official-general-results-governor.pdf',
'nj-2025.pdf':'https://www.nj.gov/state/elections/assets/pdf/election-results/2025/2025-official-general-results-governor.pdf',
'ky-2023.pdf':'https://elect.ky.gov/results/2020-2029/Documents/Certification%20of%20Election%20Results%20for%202023%20General%20Election%20Final.pdf',
'ms-2023.pdf':'https://www.sos.ms.gov/elections/electionresults/2023General/State%20Certified%20Results/2023%20Statewide%20Recapitulation%20Sheet.pdf',
'va-2021-historical-table.csv':'https://va2.elstats.civera.com/api/download_contest/147466_table.csv?split_party=false',
'va-2021.csv':'https://apps.elections.virginia.gov/SBE_CSV/ELECTIONS/ELECTIONRESULTS/2021/2021%20November%20General%20.csv',
'va-2025.json':VA,
'va-2025-ballot-items.json':VA+'/ballot-items',
'va-2025-governor.json':VA+'/ballot-items/01000000-1238-16ac-ab58-08ddfb9ff9ea',
'la-2023-races.json':BASE+'20231014/RacesCandidates_Multiparish.htm',
'la-2023-parishes.json':BASE+'20231014/VotesRaceByParish/Votes_63500.htm',
'la-2023-totals.json':BASE+'20231014/Votes_Multiparish.htm',
'la-election-dates.json':BASE+'ElectionDates.htm',
'la-parish-identities.js':'https://voterportal.sos.la.gov/bundles/staticresults?v=AmoBrbwPS5am6MfFwT0bgJ1AzLTkr6AiLoJGAdehvI41',
'va-2021-certification-agenda.pdf':'https://townhall.virginia.gov/l/GetFile.cfm?File=Meeting%5C151%5C31942%5CAgenda_ELECT_31942_v1.pdf',
}

def dump(p,j):p.write_text(json.dumps(j,ensure_ascii=False,separators=(',',':'))+'\n')
def load(f):return json.loads((RAW/f).read_text())
def text(f,*args):return subprocess.check_output(['pdftotext',*args,str(RAW/f),'-'],stderr=subprocess.PIPE).decode()
def canon(s):return re.sub(r'[^A-Z0-9]','',s.upper())
def party(s):return 'Democrat' if s in ('DEM','Democratic','Democrat','Democratic Party') else 'Republican' if s in ('REP','Republican','Republican Party') else 'Other'
def candidate(n,p,v):return dict(name=n,party=party(p),partyOriginal=p,votes=int(v))
def eng(x):return next(v['text'] for v in x if v['languageId']=='en')
with zipfile.ZipFile(RAW/'census-2018-counties.zip') as z:
 COUNTY={r['GEOID']:r for r in csv.DictReader(io.StringIO(z.read('2018_Gaz_counties_national.txt').decode()),delimiter='\t')}

def identity(sf,label):
 # Exact normalized Census name, with only explicit county/parish suffix omitted.
 label = {'28': {'Jeff Davis': 'Jefferson Davis'}, '51': {'KING & QUEEN COUNTY': 'King and Queen County'}}.get(sf, {}).get(label, label)
 opts=[(f,r) for f,r in COUNTY.items() if f.startswith(sf) and canon(label) in (canon(r['NAME']),canon(re.sub(r' (County|Parish)$','',r['NAME'])))]
 assert len(opts)==1,(sf,label,opts)
 return opts[0][0]

def row(sf,year,cs,source,fips=None,stage='general',**extra):
 r=dict(geoLevel='county' if fips else 'state',stateFips=sf,state=STATES[sf][0],stateAbbr=STATES[sf][1],contestId=f'governor-{year}-{sf}-state-{stage}-False',stage=stage,special=False,candidates=cs,totalVotes=sum(c['votes'] for c in cs),sourceId=source,sourceNeedsReview=False,qualityFlags=[],reportingCategories=[],totalVotesBasis='sum of listed source candidate entries; not turnout',percentageDenominatorBasis='sum of listed source candidate votes',**extra)
 r['candidateVoteSum']=r['totalVotes']
 if sf=='34':r['qualityFlags'].append('sourceListsNamedBallotCandidatesOnly')
 if fips:r.update(countyFips=fips,county=COUNTY[fips]['NAME'],reportingUnitCount=1,countyAggregation='source county returns')
 return r

def nj(year):
 out=[]; totals=[]; src=f'offcycle-nj-{year}'; pages=text(f'nj-{year}.pdf','-layout').split('\f')
 for page in pages:
  if 'Candidate Totals for Party' in page or not re.search(r'\nName\s+Address',page):continue
  ls=page.splitlines(); i=next(i for i,l in enumerate(ls) if l.startswith('Name ')); header=ls[i+1]; name=re.split(r'\s{2,}',header)[0].replace(' (w)','').replace(' *','').strip()
  p=next((p for p in ['Democratic','Republican','Green Party','Libertarian Party','SOCIALIST WORKERS PARTY'] if p in header),None)
  assert p,header
  values=[]
  for line in ls[i+2:]:
   m=re.fullmatch(r'\s+([A-Z ]+?)\s+([\d,]+)\s*',line)
   if not m:continue
   label=m[1]; count=int(m[2].replace(',',''))
   for suffix in ['DEMOCRATIC','REPUBLICAN','GREEN PARTY','LIBERTARIAN PARTY','SOCIALIST WORKERS PARTY']:
    label=re.sub(r'\s*'+suffix+r'$','',label).strip()
   f=identity('34',label);values.append((f,count))
  assert len(values)==21,(year,name,len(values))
  total=int(re.search(r'Total\s+([\d,]+)',page)[1].replace(',',''));assert sum(v for f,v in values)==total
  totals.append(candidate(name,p,total))
  out.extend((f,candidate(name,p,v)) for f,v in values)
 grouped=collections.defaultdict(list)
 for f,c in out:grouped[f].append(c)
 return [row('34',year,cs,src,f) for f,cs in sorted(grouped.items())]+[row('34',year,totals,src)]

def ky():
 t=text('ky-2023.pdf','-f','2','-l','7','-layout'); rows=[]
 names=['Andy BESHEAR / Jacqueline COLEMAN','Daniel CAMERON / Robert M. "Robby" MILLS','Brian FISHBACK / William FISHBACK']
 parties=['Democratic Party','Republican Party','Write-In']
 for m in re.finditer(r'^\s+([A-Za-z ]+?)\s+(\d[\d,]*)\s+(\d[\d,]*)\s+(\d[\d,]*)\s*$',t,re.M):
  label=m[1].strip(); vals=[int(m[i].replace(',','')) for i in (2,3,4)];cs=[candidate(n,p,v) for n,p,v in zip(names,parties,vals)]
  rows.append(row('21',2023,cs,'offcycle-ky-2023',None if label=='Total Votes' else identity('21',label)))
 assert len(rows)==121
 return rows

def ms():
 xml=subprocess.check_output(['pdftotext','-f','2','-l','9','-bbox',str(RAW/'ms-2023.pdf'),'-'])
 root=ET.fromstring(xml);ns={'h':'http://www.w3.org/1999/xhtml'};out=[];names=['Brandon Presley','Tate Reeves','Gwendolyn Gray'];parties=['Democrat','Republican','Independent']
 for page in root.findall('.//h:page',ns):
  ws=[dict(w.attrib,text=w.text or '') for w in page.findall('h:word',ns)]
  # Rotated header words share xMin; order by y descending reconstructs multiword county names.
  headers=collections.defaultdict(list)
  for w in ws:
   if float(w['xMin'])>250 and abs(float(w['yMax'])-179)<.01 or (float(w['xMin'])>250 and 115<float(w['yMin'])<179 and float(w['xMax'])-float(w['xMin'])<12):headers[round(float(w['xMin']),1)].append(w)
  labels=[' '.join(w['text'] for w in sorted(v,key=lambda w:-float(w['yMin']))) for k,v in sorted(headers.items())]
  values=[]
  for y in [206.50005,228.10005,249.70005]:
   vs=[w for w in ws if float(w['xMin'])>250 and abs(float(w['yMin'])-y)<.02 and re.fullmatch(r'\d+',w['text'])]
   values.append([int(w['text']) for w in sorted(vs,key=lambda w:float(w['xMin']))])
  assert all(len(v)==len(labels) for v in values),(labels,values)
  for i,label in enumerate(labels):
   cs=[candidate(n,p,values[k][i]) for k,(n,p) in enumerate(zip(names,parties))]
   out.append(row('28',2023,cs,'offcycle-ms-2023',None if label=='TOTAL' else identity('28',label)))
 assert len(out)==83,len(out)
 return out

def la():
 races=load('la-2023-races.json')['Races']['Race'];race=next(x for x in races if x['ID']=='63500'); names={}
 for c in race['Choice']:
  m=re.fullmatch(r'(.*) \(([^()]+)\)',c['Desc']);assert m;names[c['ID']]=(m[1],m[2])
 js=(RAW/'la-parish-identities.js').read_text();s=js[js.index('parishList:['):];s=s[:s.index(']')+1]
 labels=dict(re.findall(r'id:"(\d+)",name:"([^"]+)"',s));assert len(labels)==64
 dates=load('la-election-dates.json')['Dates']['Date'];assert next(d for d in dates if d['ElectionDate']=='10/14/2023')['ResultsOfficial']=='1'
 out=[]
 def cs(choices):return [candidate(*names[c['ID']],int(c['VoteTotal'])) for c in choices]
 for p in load('la-2023-parishes.json')['Parishes']['Parish']:
  f=identity('22',labels[p['ParishValue']]);out.append(row('22',2023,cs(p['Choice']),'offcycle-la-2023',f,'first round',sourceLocalityId=p['ParishValue'],sourceRaceId='63500'))
 total=next(r for r in load('la-2023-totals.json')['Races']['Race'] if r['ID']=='63500')
 out.append(row('22',2023,cs(total['Choice']),'offcycle-la-2023',stage='first round',sourceRaceId='63500'))
 return out

def va25():
 meta=load('va-2025.json');assert meta['isOfficialResults'];j=load('va-2025-governor.json');out=[]
 def cs(options):return [candidate(eng(c['name']),eng(c['party']['name']) if c['party'] else 'Write-In',c['voteCount']) for c in options]
 for r in j['breakdownResults']:
  f='51'+r['locality']['mapFeatureId'];assert f in COUNTY;assert identity('51',eng(r['locality']['name']))==f
  z=row('51',2025,cs(r['ballotOptions']),'offcycle-va-2025',f,sourceLocalityId=r['locality']['id'],sourceAsOf=r['precinctReportingStatus']['asOf']);assert z['totalVotes']==r['voteTotal'];out.append(z)
 out.append(row('51',2025,cs(j['summaryResults']['ballotOptions']),'offcycle-va-2025',sourceAsOf=meta['asOf']));assert out[-1]['totalVotes']==j['voteTotal']
 return out

def va21():
 rows=list(csv.reader((RAW/'va-2021-historical-table.csv').open()))
 names=rows[0][2:6];parties=[x or 'Write-In' for x in rows[1][2:6]];out=[]
 for r in rows[2:]:
  if r[0] not in ('State','Locality'):continue
  cs=[candidate(n,p,int(v)) for n,p,v in zip(names,parties,r[2:6])]
  z=row('51',2021,cs,'offcycle-va-2021',identity('51',r[1]) if r[0]=='Locality' else None)
  assert z['totalVotes']==int(r[6])
  z.update(sourceNeedsReview=True,qualityFlags=['officialArchiveDiffersFromCertificationAbstract'],reviewReasons=['Official historical county/state table differs from certification agenda abstract; no differences allocated to counties.'])
  out.append(z)
 return out


def main():
 provenance=load('provenance.json')
 for sid,s in provenance.items():
  if 'file' in s:assert hashlib.sha256((RAW/s['file']).read_bytes()).hexdigest()==s['sha256'],s['file']
 results=nj(2021)+nj(2025)+ky()+ms()+la()+va25()+va21()
 for r in results:
  assert r['sourceId'] in provenance,r['sourceId']
  assert all(type(c['votes']) is int and c['votes']>=0 for c in r['candidates'])
  assert r['totalVotes']==sum(c['votes'] for c in r['candidates'])
 coverage=[]
 for year in [2021,2023,2025]:
  rows=[r for r in results if int(r['contestId'].split('-')[1])==year]
  for sf in sorted({r['stateFips'] for r in rows}):
   rs=[r for r in rows if r['stateFips']==sf];cr=[r for r in rs if r['geoLevel']=='county'];sr=[r for r in rs if r['geoLevel']=='state'];assert len(cr)==STATES[sf][2]
   assert len({r['countyFips'] for r in cr})==len(cr)
   assert {r['countyFips'] for r in cr}=={f for f in COUNTY if f.startswith(sf)},(sf,year,'county inventory mismatch')
   if sr:
    a=collections.Counter();b=collections.Counter()
    for r in cr:
     for c in r['candidates']:a[c['name']]+=c['votes']
    for c in sr[0]['candidates']:b[c['name']]+=c['votes']
    assert a==b,(sf,year,a,b)
   coverage.append(dict(office='governor',year=year,stateAbbr=STATES[sf][1],url=f'/data/offcycle-governors/governor-{year}.json',geoLevels=sorted({r['geoLevel'] for r in rs}),rows=len(rs),countyRows=len(cr),expectedCountyRows=STATES[sf][2],missingCountyFips=[],sourceNeedsReview=any(r['sourceNeedsReview'] for r in rs)))
  ids={r['sourceId'] for r in rows}; sources={k:v for k,v in provenance.items() if k in ids or k.startswith('offcycle-evidence-')}
  dump(OUT/f'governor-{year}.json',dict(schemaVersion=1,office='governor',year=year,snapshotDate=DATE,sources=sources,results=rows))
 manifest=dict(schemaVersion=1,snapshotDate=DATE,coverage=coverage,sources=provenance,limitations=['Historical off-cycle governor snapshots only; current 2026 election status is maintained separately.','New Jersey PDFs list named ballot candidates only; unlisted write-ins are not imputed.','Virginia 2021 official historical county/state table does not reconcile to the certification agenda abstract; all rows are flagged for review. The source statewide row remains separate and no differences are allocated.','Louisiana October 2023 is the first round, not a November general/runoff.','totalVotes sums source candidate vote entries, not ballots cast or voter turnout.'])
 dump(OUT/'manifest.json',manifest)
 print(json.dumps(coverage,indent=2))
if __name__=='__main__':main()
