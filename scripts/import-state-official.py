#!/usr/bin/env python3
"""Reproduce Hawaii county returns from official historical county PDF reports.
Certification status is attributed to the official index; source discrepancies are retained.
No estimated precinct allocation. Original PDFs and hashes are retained.
"""
import argparse, collections, hashlib, json, re, subprocess, xml.etree.ElementTree as ET
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
RAW=ROOT/'scripts/source-data/state-official'
OUT=ROOT/'public/data/state-official'
COUNTIES={'coh.pdf':('15001','Hawaii'),'com.pdf':('15009','Maui'),'cok.pdf':('15007','Kauai'),'cch.pdf':('15003','Honolulu')}
PARTIES={'D':'Democrat','R':'Republican'}

def report_lines(pdf):
 bbox=pdf.with_suffix('.bbox.xml')
 subprocess.run(['pdftotext','-bbox',str(pdf),str(bbox)],check=True)
 lines=[]
 for page in ET.parse(bbox).findall('.//{*}page'):
  groups=[]
  for w in sorted([w for w in page.findall('{*}word') if float(w.attrib['xMin'])<214],key=lambda w:(float(w.attrib['yMin']),float(w.attrib['xMin']))):
   y=float(w.attrib['yMin'])
   if not groups or abs(y-groups[-1][0])>1.15:groups.append((y,[w]))
   else:groups[-1][1].append(w)
  lines.extend(' '.join((w.text or '') for w in sorted(ws,key=lambda w:float(w.attrib['xMin']))) for _,ws in groups)
 return lines

def state_candidates(lines):
 """Only the first-column federal contests, preserving vacancy/special identity."""
 records={};key=None;pending=None
 for text in lines:
  header=text.replace('U.S.','US')
  if header.startswith('US Senator') or header.startswith('US Representative'):
   office='senate' if header.startswith('US Senator') else 'house';district=None
   if office=='house':
    m=re.search(r'Dist\s+([IVX]+|\d+)',text);assert m,text;district={'I':'1','II':'2'}.get(m[1],m[1])
   key=(office,district,any(term in text.lower() for term in ('special','unexpired','vacancy')));records[key]=[];pending=None;continue
  if re.match(r'^(State |Governor|Mayor|Council)',text):key=None;pending=None
  if key is None:continue
  c=re.match(r'^\(([^)]+)\)\s*(.*)',text)
  if c:
   assert pending is None,(pending,text)
   rest=c[2];v=re.search(r'\s+(\d[\d,]*)\s+([\d.]+)%\s*$',rest)
   pending=dict(name=rest[:v.start()].strip() if v else rest.strip(),partyOriginal=c[1])
   if v:pending['votes']=int(v[1].replace(',',''));records[key].append(pending);pending=None
  elif pending:
   v=re.match(r'^(\d[\d,]*)\s+([\d.]+)%$',text)
   if v:pending['votes']=int(v[1].replace(',',''));records[key].append(pending);pending=None
 return records

def normalized_name(name):return re.sub(r'[^A-Z0-9]','',name.upper())

def dump(path,obj): path.write_text(json.dumps(obj,ensure_ascii=False,separators=(',',':'))+'\n')
def main(download=False):
 RAW.mkdir(parents=True,exist_ok=True); OUT.mkdir(parents=True,exist_ok=True)
 links=json.loads((RAW/'hawaii-links.json').read_text())
 old=json.loads((RAW/'provenance.json').read_text()) if (RAW/'provenance.json').exists() else {}
 sources={}; byfile=collections.defaultdict(list); checks=[]
 for link in links:
  year=link['year']; filename=link['url'].rsplit('/',1)[-1]; fips,county=COUNTIES[filename]
  stem=f'hawaii-{year}-{filename}'; pdf=RAW/stem
  if download or not pdf.exists():
   temp=pdf.with_suffix('.download')
   subprocess.run(['curl','-fsSL','--retry','2',link['url'],'-o',str(temp)],check=True)
   expected=old.get(stem,{}).get('sha256')
   if expected and hashlib.sha256(temp.read_bytes()).hexdigest()!=expected:raise ValueError(f'Official source changed; retain and review new snapshot: {temp}')
   temp.replace(pdf)
  sha=hashlib.sha256(pdf.read_bytes()).hexdigest()
  if stem in old:assert sha==old[stem]['sha256'],stem
  source_id=f'state-official-hi-{year}-{fips}'
  sources[source_id]=dict(title=f'Hawaii Office of Elections {year}: {link["label"]}',sourceUrl=link['url'],url=link['url'],indexUrl='https://elections.hawaii.gov/election-results/',version='Official historical county summary; certification attributed to state index, not independently established from a certificate',sha256=sha,file=stem,snapshotDate='2026-11-06',license='Official public election results')
  lines=report_lines(pdf)
  printDates=[line for line in lines if line.startswith('Printed on:')]
  sources[source_id]['reportPrintedAt']=printDates[0] if printDates else None
  current=None; pending=None; records=[]
  for line in lines:
   text=line.strip()
   header=text.replace('U.S.','US')
   if header.startswith('US Senator') or header.startswith('US Representative') or text.startswith('Governor and Lieutenant'):
    if current:records.append(current)
    office='senate' if header.startswith('US Senator') else 'house' if header.startswith('US Representative') else 'governor'
    district=None
    if office=='house':
     m=re.search(r'Dist\s+([IVX]+|\d+)',text);assert m,(stem,text)
     district={'I':'1','II':'2'}.get(m[1],m[1])
    special=any(term in text.lower() for term in ('special','unexpired','vacancy'))
    current=dict(geoLevel='county',stateFips='15',state='Hawaii',stateAbbr='HI',countyFips=fips,county=county,contestId=f'{office}-{year}-15-{district or "state"}-general-{special}',stage='general',special=special,candidates=[],reportingCategories=[],sourceId=source_id,totalVotes=0,totalVotesBasis='sum of candidate votes and separately reported blank/over votes in the official county summary',electionStatus='certified',certificationBasis='Hawaii historical index lists this PDF under Certified Reports; no independent certification instrument examined',sourceLinks=[link['url']],sourceContestTitle=text)
    if district:current['district']=district
    pending=None
    continue
   if current and re.match(r'^(State (Senator|Representative)|Mayor|Council|OHA |At[- ]Large|Hawaii Resident|Kauai Resident|Molokai Resident|Lanai Resident|CON\.? AMEND|County Charter)',text,re.I):
    records.append(current);current=None;pending=None
   if not current:continue
   c=re.match(r'^\(([^)]+)\)\s*(.*)',text)
   if c:
    assert pending is None,(stem,'Unresolved candidate',pending,text)
    rest=c[2];v=re.search(r'\s+(\d[\d,]*)\s+([\d.]+)%\s*$',rest)
    pending=dict(name=rest[:v.start()].strip() if v else rest.strip(),party=PARTIES.get(c[1],'Other'),partyOriginal=c[1],votes=None)
    if v:
     pending['votes']=int(v[1].replace(',',''));pending['sourcePercent']=float(v[2]);current['candidates'].append(pending);pending=None
    continue
   if pending:
    v=re.match(r'^(\d[\d,]*)\s+([\d.]+)%$',text)
    if v:
     pending['votes']=int(v[1].replace(',',''));pending['sourcePercent']=float(v[2]);current['candidates'].append(pending);pending=None
    elif text and not text.startswith('For '):pending.setdefault('ticketDetails',[]).append(text)
    continue
   cat=re.match(r'^(Blank|Over) Votes:\s*(\d[\d,]*)\s+([\d.]+)%$',text)
   if cat:
    current['reportingCategories'].append(dict(name=f'{cat[1]} Votes',category='blankBallots' if cat[1]=='Blank' else 'overvotes',votes=int(cat[2].replace(',','')),sourcePercent=float(cat[3])))
    if len(current['reportingCategories'])==2:records.append(current);current=None
  assert pending is None,(stem,pending)
  if current:records.append(current)
  for row in records:
   assert row['candidates'],(stem,row)
   assert len(row['reportingCategories'])==2,(stem,'Missing ballot categories',row['sourceContestTitle'],row['reportingCategories'])
   row['totalVotes']=sum(v['votes'] for v in row['candidates']+row['reportingCategories'])
   assert row['totalVotes']>0
   for v in row['candidates']+row['reportingCategories']:
    assert isinstance(v['votes'],int) and v['votes']>=0
    assert abs(v['votes']/row['totalVotes']*100-v['sourcePercent'])<.16,(stem,v,row['totalVotes'])
   if fips=='15009':
    row['geographicCoverageNote']='County of Maui election-jurisdiction summary, mapped to Maui FIPS15009. It is not an independently isolated Census-county return: Kalawao is a separate Census county (15005) and has no separately reported total in these files. Inclusion/exclusion of Kalawao voting-jurisdiction returns is not inferred; no Kalawao count is allocated or duplicated.'
   office=row['contestId'].split('-')[0]
   byfile[office,year].append(row)
  checks.append(dict(file=stem,records=len(records),candidates=sum(len(r['candidates']) for r in records),sha256=sha))
 provenance={f'hawaii-{l["year"]}-{l["url"].rsplit("/",1)[-1]}':sources[f'state-official-hi-{l["year"]}-{COUNTIES[l["url"].rsplit("/",1)[-1]][0]}'] for l in links}
 reconciliation=[]; stateSources={}
 oldState=json.loads((RAW/'statewide-provenance.json').read_text()) if (RAW/'statewide-provenance.json').exists() else {}
 for year in (2006,2008,2010,2012,2014):
  countyLink=next(l for l in links if l['year']==year)
  url=countyLink['url'].rsplit('/',1)[0]+'/histatewide.pdf';pdf=RAW/f'hawaii-{year}-statewide.pdf'
  if not pdf.exists():subprocess.run(['curl','-fsSL',url,'-o',str(pdf)],check=True)
  sha=hashlib.sha256(pdf.read_bytes()).hexdigest()
  if str(year) in oldState:assert sha==oldState[str(year)]['sha256'],pdf.name
  stateSources[str(year)]=dict(sourceUrl=url,file=pdf.name,sha256=sha,purpose='Official final statewide federal candidate totals used for county-sum reconciliation; not allocated to counties')
  totals=state_candidates(report_lines(pdf))
  for (office,district,special),candidates in totals.items():
   rows=[r for r in byfile.get((office,year),[]) if r.get('district')==district and r['special']==special]
   if not rows:continue
   summed=collections.Counter()
   for r in rows:
    for c in r['candidates']:summed[normalized_name(c['name'])]+=c['votes']
   comparisons=[dict(name=c['name'],statewideVotes=c['votes'],countySum=summed[normalized_name(c['name'])],unallocatedDifference=c['votes']-summed[normalized_name(c['name'])]) for c in candidates]
   mismatch=any(c['unallocatedDifference'] for c in comparisons)
   record=dict(office=office,year=year,district=district,special=special,sourceUrl=url,countyRecords=len(rows),candidateComparisons=comparisons,status='unallocated difference; county records held' if mismatch else 'candidate totals agree')
   reconciliation.append(record)
   if mismatch:
    for r in rows:
     r['sourceNeedsReview']=True;r['reviewReasons']=['Official final statewide candidate totals differ from the sum of these four county-jurisdiction reports. Difference is unallocated; no cause or county allocation is inferred.']
     r['statewideReconciliation']=record
 # Exact record inventory: retain district intersections and concurrent vacancy election.
 for year in range(2006,2025,2):assert len(byfile['house',year])==(6 if year==2016 else 5),(year,len(byfile['house',year]))
 h2016=[r for r in byfile['house',2016] if r['countyFips']=='15003' and r.get('district')=='1']
 assert len(h2016)==2 and {r['special'] for r in h2016}=={False,True}
 assert len(reconciliation)==14 and sum(r['status'].startswith('unallocated') for r in reconciliation)==14
 assert sum(bool(r.get('sourceNeedsReview')) for rows in byfile.values() for r in rows)==41
 dump(RAW/'statewide-provenance.json',stateSources)
 dump(OUT/'reconciliation.json',dict(statewideSources=stateSources,comparisons=reconciliation,allocationPolicy='No statewide residual allocated to counties; original county counts unchanged'))
 manifest=dict(schemaVersion=1,snapshotDate='2026-11-06',sources=sources,statewideReconciliationSources=stateSources,coverage=[],limitations=['Hawaii official county election-jurisdiction summaries do not separately report Kalawao. No unreported Kalawao total or Alaska county allocation is invented.','The official state index labels these historical reports Certified Reports; no independent certificate has been examined. All41federalcountyrecords2006–14 are held for unallocated differences from final statewide reports. No2026Hawaii totals are included.'])
 for (office,year),results in sorted(byfile.items()):
  assert len({(r['countyFips'],r['contestId']) for r in results})==len(results),[(r['countyFips'],r['contestId'],r['sourceContestTitle']) for r in results]
  ids=sorted({r['sourceId'] for r in results});name=f'{office}-{year}.json'
  dump(OUT/name,dict(schemaVersion=1,office=office,year=year,snapshotDate='2026-11-06',sources={s:sources[s] for s in ids},results=results))
  manifest['coverage'].append(dict(office=office,year=year,url=f'/data/state-official/{name}',geoLevels=['county'],rows=len(results),stateCount=1,contests=len({r['contestId'] for r in results}),sourceNeedsReviewCount=sum(bool(r.get('sourceNeedsReview')) for r in results),countyDistrictIntersections=office=='house'))
 dump(RAW/'provenance.json',provenance);dump(OUT/'manifest.json',manifest);dump(OUT/'validation.json',dict(status='passed',sourceReports=checks,files=len(byfile),results=sum(len(v) for v in byfile.values()),sourceNeedsReviewCount=41,statewideReconciliationComparisons=14,statewideReconciliationSources=stateSources,checks=['source SHA256 unchanged','all candidates have integral nonnegative counts','published candidate and ballot-category percentages match normalized denominator within rounding','both blank/over categories retained','unique county and contest records','all10Houseyears expected5portions except2016six includingdistinctvacancy','all14olderfederalcontests reconciled to official statewide PDFs;41countyrecords held','county raw counts preserved; no statewide difference allocated']))
 print(json.dumps(dict(files=len(byfile),results=sum(len(v) for v in byfile.values()),sourceReports=len(links),offices=sorted({o for o,y in byfile}))))
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--download',action='store_true');main(p.parse_args().download)
