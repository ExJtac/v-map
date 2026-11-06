#!/usr/bin/env python3
"""Validate stored election geography, counts, special contests and known official totals."""
import hashlib,json,runpy
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]; DATA=ROOT/'public/data/elections'
reporting_category=runpy.run_path(str(ROOT/'scripts/import-elections.py'))['reporting_category']
m=json.loads((DATA/'manifest.json').read_text()); races=0;candidates=0;nulls=0;categories=0;review=0
for source in m['sources'].values():
 assert hashlib.sha256((ROOT/'scripts/source-data'/source['file']).read_bytes()).hexdigest()==source['sha256']
for entry in m['coverage']:
 d=json.loads((DATA/Path(entry['url']).name).read_text()); assert d['office']==entry['office'] and d['year']==entry['year']
 seen=set()
 for r in d['results']:
  races+=1; key=(r['geoLevel'],r['stateFips'],r.get('countyFips'),r.get('district'),r['contestId']);assert key not in seen;seen.add(key)
  assert len(r['stateFips'])==2 and r['stateFips'].isdigit(); assert isinstance(r['special'],bool)
  assert isinstance(r['totalVotes'],int) and r['totalVotes']>=0
  if r['geoLevel']=='county':assert len(r['countyFips'])==5 and r['countyFips'].startswith(r['stateFips']) and d['office']=='president' and r['stateFips']!='02'
  if d['office']=='house':assert r['geoLevel']=='district'
  for c in r['candidates']:
   assert reporting_category(c['name']) is None, f"Reporting category left as candidate: {c['name']}"
   candidates+=1;assert c['party'] in ('Democrat','Republican','Other')
   if c['votes'] is None: nulls+=1;assert r.get('incomplete') and c.get('missingVoteCount')
   else:assert isinstance(c['votes'],int) and c['votes']>=0
  for category in r.get('reportingCategories',[]):
   categories+=1;assert reporting_category(category['name'])==category['category']
   assert isinstance(category['votes'],int) and category['votes']>=0
  if r.get('sourceNeedsReview'): review+=1;assert r.get('reviewReasons')
  known=sum(c['votes'] or 0 for c in r['candidates']+r.get('reportingCategories',[]));assert (known!=r['totalVotes'])==bool(r.get('voteTotalMismatch'))
 assert len(d['results'])==entry['rows']
def load(office,year):return json.loads((DATA/f'{office}-{year}.json').read_text())['results']
# FEC official presidential report: California, 2024, p.3 (Harris) and p.5 (Trump).
ca=next(r for r in load('president',2024) if r['geoLevel']=='state' and r['stateFips']=='06')
assert next(c['votes'] for c in ca['candidates'] if c['party']=='Democrat')==9276179
assert next(c['votes'] for c in ca['candidates'] if c['party']=='Republican')==6081697
# Two concurrent CA Senate elections must remain distinct (full vs partial term).
caSenate=[r for r in load('senate',2024) if r['stateFips']=='06'];assert len(caSenate)==2 and {r['special'] for r in caSenate}=={True,False}
# Regression: preserve the source's suspicious RCV categories and counts, never a pseudo-candidate.
for year,label,votes,total in [(2022,'EXHAUSTED BALLOT',322778,656104),(2024,'EXHAUSTED BALLOTS',11340,402936)]:
 maine=next(r for r in load('house',year) if r['stateFips']=='23' and r['district']=='2')
 assert maine['sourceNeedsReview'] and maine['totalVotes']==total
 assert next(c['votes'] for c in maine['reportingCategories'] if c['name']==label)==votes
 assert all('EXHAUSTED' not in c['name'] for c in maine['candidates'])
 assert sum(c['votes'] or 0 for c in maine['candidates']+maine['reportingCategories'])==total
assert reporting_category('BLANKENSHIP, DON') is None and reporting_category('ERIC BLANKENBURG') is None
# No entries are discarded by category separation: 70,622 entries before separation.
assert candidates+categories==70622 and categories==766 and review==3
# Independently evidenced stage corrections; never invent missing rounds.
ga2008=[r for r in load('senate',2008) if r['stateFips']=='13']
assert {r['stage'] for r in ga2008}=={'first round','runoff'}
for year,state,total in [(2008,'13',2137956),(2018,'28',907588)]:
 runoff=next(r for r in load('senate',year) if r['stateFips']==state and r.get('sourceStageOverride'))
 assert runoff['stage']=='runoff' and runoff['sourceStage'].lower()=='gen' and runoff['totalVotes']==total
 assert runoff['sourceStageOverride']['sourceUrl'].startswith('https://')
assert sum(r['special'] for r in load('senate',2018) if r['stateFips']=='28')==1
for year in (2008,2012,2016,2020,2024):assert sum(r['geoLevel']=='state' for r in load('president',year))==51
print(json.dumps(dict(status='passed',files=len(m['coverage']),geographicResults=races,candidateEntries=candidates,reportingCategoryEntries=categories,sourceNeedsReviewCount=review,explicitMissingCandidateCounts=nulls,officialSpotCheck='FEC California 2024 major-party presidential votes',specialContestCheck='California 2024 Senate full and partial terms distinct'),indent=2))
