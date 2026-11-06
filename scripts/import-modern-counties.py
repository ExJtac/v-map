#!/usr/bin/env python3
"""Build recent county election supplements from pinned public research/source files.
Never modify the original elections or county-elections directories. Offline by default.
"""
import argparse, collections, csv, hashlib, io, json, re, subprocess, zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / 'scripts/source-data/modern-counties'
OUT = ROOT / 'public/data/modern-counties'
DATE = '2026-11-06'
EXCLUSIONS = []
AUDIT = collections.Counter()
SOURCES = {}
GROUPS = {}
EXPECTED = collections.Counter()
LABELS = collections.defaultdict(set)


def dump(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, separators=(',', ':'))+'\n')


def numeric(value):
    if str(value).strip() in ('', '*', 'NA', 'NaN', 'nan', 'None'): return None
    n = float(value)
    assert n >= 0 and n.is_integer(), f'Not a nonnegative integer vote count: {value!r}'
    return int(n)


def party_affiliations(value):
    v=value.upper()
    majors=set()
    if re.search(r'DEMOCRAT|(?:^|[/ +])(?:D|DEM|DFL)(?:$|[/ +])',v):majors.add('Democrat')
    if re.search(r'REPUBLICAN|(?:^|[/ +])(?:R|REP|GOP)(?:$|[/ +])',v):majors.add('Republican')
    return majors


def party(value):
    majors=party_affiliations(value)
    return next(iter(majors)) if len(majors)==1 else 'Other'


def category(name):
    label = re.sub(r'\s+', ' ', name.strip().upper())
    if re.fullmatch(r'(OVER|UNDER) ?VOTES?( \(\d+\))?', label): return 'overvotes' if label.startswith('OVER') else 'undervotes'
    if re.fullmatch(r'(BLANKS?( VOTES?)?|TIMES BLANK VOTED)( \(\d+\))?', label): return 'blankBallots'
    if label in ('WRITE-IN TOTALS','WRITE-IN TOTAL','WRITE IN TOTALS','WRITE IN TOTAL'):return 'unattributedWriteIns'
    if label in ('SCATTERING','SCATTER','BLANK WRITE INS'): return 'unattributedWriteIns'
    if label in ('OTHER','OTHERS','OTHER CANDIDATES','ALL OTHER CANDIDATES (NOT ITEMIZED IN THE SOURCE)','OTHER / WRITE-IN CANDIDATES'): return 'unitemizedOtherCandidates'
    if label in ('SPOILED','VOID','VOIDS','INVALID','INVALID VOTES','NOT QUALIFIED'): return 'invalidBallots'
    if label in ('TOTAL VOTES CAST','TOTAL BALLOTS CAST','BALLOTS CAST','CONTEST TOTAL','TOTAL','CAST VOTES'): return 'reportedBallotTotal'
    if re.fullmatch(r'EXHAUSTED BALLOTS?', label): return 'exhaustedBallots'
    return None


def flag(g, text):
    g['sourceNeedsReview'] = True
    if text not in g.setdefault('reviewReasons', []): g['reviewReasons'].append(text)


def source(source_id, filename, **extra):
    spec = SNAPSHOTS[filename]
    SOURCES[source_id] = {**spec, **extra, 'snapshotDate': DATE}
    return source_id


def add(office, year, fips, state_abbr, name, original_party, votes, sid, stage='general', special=False, district=None, source_stage=None, total=None, extra=None, geo_level='county', contest_token=None):
    contest = f'{office}-{year}-{fips[:2]}-{district if district is not None else "state"}-{stage}-{special}'
    if contest_token:contest+='-'+contest_token
    key = office, year, fips, contest
    g = GROUPS.setdefault(key, dict(geoLevel=geo_level,stateFips=fips[:2],state=STATE_NAMES.get(fips[:2],state_abbr),stateAbbr=state_abbr,contestId=contest,stage=stage,special=special,sourceId=sid,candidates=[],totalVotes=None,_candidates={},sourceRowCount=0))
    if geo_level=='county':g.update(countyFips=fips,county=COUNTIES[fips]['NAME'].strip())
    assert g['sourceId'] == sid, f'Overlapping sources need explicit priority: {key}'
    if district is not None: g.update(district=district,geographicScope='county-district intersection')
    if source_stage is not None: g['sourceStage']=source_stage
    if extra: g.update(extra)
    if total is not None:
        if g['totalVotes'] is not None and total != g['totalVotes']: g['sourceTotalConflict']=True
        g['totalVotes']=max(g['totalVotes'] or 0,total)
    g['sourceRowCount'] += 1
    nk=name.strip().casefold()
    c=g['_candidates'].setdefault(nk,dict(name=name.strip(),party='Other',partyOriginal='',votes=0,_parties=[],_knownVotes=0))
    np=party(original_party)
    if len(party_affiliations(original_party))>1:flag(g,'Source party label combines both major parties; party classification held for review.')
    if np in ('Democrat','Republican'):
        if c['party'] not in ('Other',np): flag(g,'Source ballot lines assign the same candidate to both major parties; party classification requires review.')
        else: c['party']=np
    if original_party and original_party not in c['_parties']: c['_parties'].append(original_party)
    if votes is None:
        c['votes']=None;c['missingVoteCount']=True;g['incomplete']=True
    else:
        c['_knownVotes']+=votes
        if c['votes'] is not None: c['votes']+=votes
    EXPECTED[key,nk]+=votes or 0
    LABELS[key].add(nk)
    return g


def existing(office, year):
    path=ROOT/f'public/data/{"county-elections" if year==2018 else "elections"}/{office}-{year}.json'
    if not path.exists(): return set()
    return {(r['countyFips'],r.get('district'),r.get('special',False)) for r in json.loads(path.read_text())['results'] if r['geoLevel']=='county'}


def fips_code(value):
    if not re.fullmatch(r'\d+(\.0)?', str(value)): return None
    result=str(int(float(value))).zfill(5)
    # Census renamed Shannon County to Oglala Lakota in 2015; the researcher release
    # retains historical46113 alongside the new county name. Preserve that source code.
    return '46102' if result=='46113' else result


def import_heideman():
    sid_base='modern-heideman-v1'
    with zipfile.ZipFile(RAW/'heideman-v1.0.0.zip') as archive:
        for line in archive.read('SHA256SUMS.txt').decode().splitlines():
            digest, name=line.split(None,1);name=name.strip().lstrip('*')
            if name in archive.namelist(): assert hashlib.sha256(archive.read(name)).hexdigest()==digest
        provenance=list(csv.DictReader(io.StringIO(archive.read('SOURCES.csv').decode())))
        corrections=list(csv.DictReader(io.StringIO(archive.read('data_corrections_log.csv').decode())))
        gaps=list(csv.DictReader(io.StringIO(archive.read('us_county_results_gaps.csv').decode())))
        dump(RAW/'heideman-modern-gaps.json',[r for r in gaps if 2016<=int(r['year'])<=2024])
        no_ballot=list(csv.DictReader(io.StringIO(archive.read('us_county_results_no_ballot.csv').decode())))
        dump(RAW/'heideman-modern-no-ballot.json',[r for r in no_ballot if 2016<=int(r['year'])<=2024])
        for n in ('DATA_DICTIONARY.md','SOURCES.csv','data_corrections_log.csv','CHANGELOG.md'):
            (RAW/f'heideman-{n}').write_bytes(archive.read(n))
        baseline={(of,y):existing(of,y) for of in ('house','senate','president') for y in (2016,2018,2020,2022,2024)}
        inventories={}
        for y in (2016,2018,2020,2022,2024):
            inv=collections.defaultdict(set)
            for r in json.loads((ROOT/f'public/data/elections/house-{y}.json').read_text())['results']:inv[r['stateAbbr']].add(r['district'])
            inventories[y]=inv
        with archive.open('us_county_results_long.csv') as handle:
            for i,r in enumerate(csv.DictReader(io.TextIOWrapper(handle,encoding='utf-8')),2):
                year=int(r['year']);office=r['office']
                if not 2016<=year<=2024: continue
                if office=='senate' and year==2024: continue # direct MEDSL county source includes both concurrent seats
                fips=fips_code(r['county_fips']);district=str(int(r['district'])) if r['district'].isdigit() else None
                reason=None
                if fips not in COUNTIES or COUNTIES.get(fips,{}).get('USPS')!=r['state_po']:reason='No verified county FIPS/state'
                elif office=='house' and (district is None or district not in inventories[year][r['state_po']]):reason='House district unresolved or absent from election-year baseline inventory'
                elif office=='house' and year==2022 and r['state_po']=='NJ':reason='Known source defect: district-wide totals repeated under county labels; not valid county returns'
                elif (fips,district if office=='house' else None,False) in baseline[office,year]:
                    AUDIT['sourceRowsSkippedExistingCoverage']+=1;continue
                if reason:
                    EXCLUSIONS.append(dict(source='heideman-v1.0.0.zip',member='us_county_results_long.csv',line=i,reason=reason,row=r));continue
                try:votes=numeric(r['votes'])
                except AssertionError:
                    EXCLUSIONS.append(dict(source='heideman-v1.0.0.zip',line=i,reason='Fractional/negative source vote count; contest held',row=r));continue
                sid=f'{sid_base}-{office}-{r["source"]}'
                originals=[p for p in provenance if p['source']==r['source'] and p['office']==office]
                source(sid,'heideman-v1.0.0.zip',sourceToken=r['source'],originalSources=originals,sourceMember='us_county_results_long.csv',licenseNote='Release CC-BY-4.0 does not override underlying publishers rights')
                stage=r['stage'];extra={}
                if office=='senate' and r['state_po']=='GA' and year in (2016,2020,2022):
                    if year==2020:stage='first round'
                    if year==2022:stage='runoff'
                if office=='senate' and r['state_po']=='LA':stage='first round'
                if office=='house' and r['state_po']=='ME' and year==2024 and district=='2':stage='initial count'
                g=add(office,year,fips,r['state_po'],r['candidate'],r['party'],votes,sid,stage=stage,district=district if office=='house' else None,source_stage=r['stage'])
                if office=='senate' and r['state_po']=='GA' and year==2022:g.update(stageNormalization='Source runoff stage retained after QA confirms Dec6 2022 Warnock/Walker statewide sums1820633/1721244',stageNormalizationSource='https://results.sos.ga.gov/results/public/Georgia/elections/2022DecGenRun')
                c=g['_candidates'][r['candidate'].strip().casefold()]
                groups=c.setdefault('sourcePartyGroups',[])
                if r['party_group'] not in groups:groups.append(r['party_group'])
                c['sourcePartyGroup']=groups[0] if len(groups)==1 else ' / '.join(groups)
                if office=='house':g['sourceDistrict']=r['district']
                if r['county_fips']!=fips:g.update(sourceCountyFips=r['county_fips'],countyFipsNormalization='Census Shannon County46113 renamed Oglala Lakota46102 effective2015')
                if r['quality_flag']:
                    g.setdefault('sourceQualityFlags',[])
                    for q in r['quality_flag'].split(';'):
                        if q not in g['sourceQualityFlags']:g['sourceQualityFlags'].append(q)
                    if any(q in r['quality_flag'] for q in ('placeholder_name','surname_only','initials_only','totals_possibly_inflated')):flag(g,'Source flags incomplete candidate names or potentially inflated counts: '+r['quality_flag'])
                for p in originals:
                    for ix in p['corrections_log_entries'].split(';'):
                        if ix and corrections[int(ix)-1]['status'] in ('flagged','not_fixed'):
                            entry=corrections[int(ix)-1]
                            # Retain actual source issue, including scope uncertainty, without claiming a fix.
                            flag(g,'Unresolved source correction-log issue: '+entry['issue'])
                if stage=='initial count':flag(g,'Maine2024 House district2 source precinct returns contain first-choice totals, not final ranked-choice redistribution.')
                AUDIT['heidemanImportedSourceRows']+=1


def import_algara():
    sid=source('modern-algara-governor','algara-governor.Rdata',decodedFile='algara-governor-decoded.csv',decodedSha256=SNAPSHOTS['algara-governor-decoded.csv']['sha256'])
    present={y:existing('governor',y) for y in range(2016,2021)}
    for i,r in enumerate(csv.DictReader((RAW/'algara-governor-decoded.csv').open()),2):
        year=int(float(r['election_year']))
        if not 2016<=year<=2020:continue
        fips=fips_code(r['fips'])
        if r['state']=='HI':continue # separately imported by owner from direct state reports
        if fips not in COUNTIES or COUNTIES.get(fips,{}).get('USPS')!=r['state']:
            EXCLUSIONS.append(dict(source='algara-governor-decoded.csv',line=i,reason='No verified county FIPS/state',row=r));continue
        if (fips,None,False) in present[year]:AUDIT['algaraRowsSkippedExistingCoverage']+=1;continue
        d=numeric(r['democratic_raw_votes']);rep=numeric(r['republican_raw_votes']);total=numeric(r['raw_county_vote_totals'])
        if None in (d,rep,total) or total<d+rep:
            EXCLUSIONS.append(dict(source='algara-governor-decoded.csv',line=i,reason='Missing or inconsistent source vote counts; county held',row=r));continue
        stage='runoff' if r['state']=='LA' and year==2019 else 'general'
        g=add('governor',year,fips,r['state'],r['dem_nominee'],'Democrat',d,sid,stage=stage,total=total)
        add('governor',year,fips,r['state'],r['rep_nominee'],'Republican',rep,sid,stage=stage,total=total)
        if total>d+rep:add('governor',year,fips,r['state'],'All other candidates (not itemized in the source)','Other',total-d-rep,sid,stage=stage,total=total)
        g.update(sourceElectionId=r['election_id'],sourceElectionType=r['election_type'],otherCandidatesAggregated=True,totalVotesBasis='source raw_county_vote_totals; minor-party residual is unitemized')
        AUDIT['algaraImportedCountyRows']+=1


def import_senate_2024():
    sid=source('modern-medsl-senate-2024','medsl-2024-senate-county.csv')
    for i,r in enumerate(csv.DictReader((RAW/'medsl-2024-senate-county.csv').open()),2):
        if r['state_po']=='HI':continue
        fips=fips_code(r['county_fips'])
        if fips not in COUNTIES or COUNTIES.get(fips,{}).get('USPS')!=r['state_po']:
            EXCLUSIONS.append(dict(source='medsl-2024-senate-county.csv',line=i,reason='No verified county FIPS/state',row=r));continue
        assert r['mode']=='TOTAL'
        g=add('senate',2024,fips,r['state_po'],r['candidate'],r['party_detailed'],numeric(r['votes']),sid,stage='general',special=r['special']=='TRUE',total=numeric(r['totalvotes']),source_stage=r['stage'])
        if r['unofficial']=='TRUE':g['unofficial']=True
        if r['county_fips']!=fips:g['sourceCountyFips']=r['county_fips']
        if r['state_po']=='ME':flag(g,'MEDSL2024 Maine precinct totals are first preferences; verify any ranked-choice redistribution before treating them as final.')
        if r['state_po']=='IN':flag(g,'MEDSL2024 Indiana source notes warn that straight-party inclusion may overreport Senate/Governor counts.')
        AUDIT['directSenate2024SourceRows']+=1


def import_precinct_governors():
    allowed_offices={'GOVERNOR','GOVERNOR AND LIEUTENANT GOVERNOR','GOVERNOR & LIEUTENANT GOVERNOR'}
    for filename,spec in SNAPSHOTS.items():
        if not re.fullmatch(r'medsl-(2022|2024)-[a-z]{2}\.zip',filename):continue
        year=spec['year'];st=spec['stateAbbr']
        if st in ('AK','HI'): # AK has no verified county allocation; HI direct-state reports owned separately
            AUDIT[f'governor{year}NoncountyOrSeparatelyOwnedStatesSkipped']+=1;continue
        sid=source(f'modern-medsl-governor-{year}-{st.lower()}',filename,codebookFile=f'medsl-{year}-codebook.md',readmeFile=f'medsl-{year}-README.md')
        # Candidate/party/reporting-unit keys preserve the source geography and separate dates,
        # stages and special contests. TOTAL takes precedence over its disaggregated modes.
        units=collections.defaultdict(list)
        with zipfile.ZipFile(RAW/filename) as archive:
            member=next(n for n in archive.namelist() if n.endswith('.csv') and not n.startswith('__MACOSX'))
            with archive.open(member) as handle:
                for i,r in enumerate(csv.DictReader(io.TextIOWrapper(handle,encoding='utf-8-sig')),2):
                    if r['office'] not in allowed_offices:continue
                    fips=fips_code(r['county_fips'])
                    if fips not in COUNTIES or COUNTIES.get(fips,{}).get('USPS')!=st:
                        EXCLUSIONS.append(dict(source=filename,member=member,line=i,reason='No verified county FIPS/state',row=r));continue
                    key=(fips,r['jurisdiction_fips'],r['jurisdiction_name'],r['precinct'],r['office'],r['candidate'],r['party_detailed'],r['stage'],r['special'],r.get('date',''))
                    units[key].append(r)
        if not units:
            EXCLUSIONS.append(dict(source=filename,reason='Source contains no Governor contest rows',stateAbbr=st,year=year));continue
        for key,rows in units.items():
            totals=[r for r in rows if r['mode']=='TOTAL']
            selected=totals or rows
            modes=collections.Counter(r['mode'] for r in selected)
            # Keep repeated source rows but hold the contest; do not silently deduplicate votes.
            duplicate_mode=any(n>1 for n in modes.values())
            AUDIT['precinctDisaggregatedRowsSuppressedByTotal']+=len(rows)-len(selected)
            for r in selected:
                stage={'GEN':'general','RUNOFF':'runoff','GEN RECOUNT':'general recount'}.get(r['stage'],r['stage'].lower())
                votes=numeric(r['votes'])
                g=add('governor',year,key[0],st,r['candidate'],r['party_detailed'],votes,sid,stage=stage,special=r['special']=='TRUE',source_stage=r['stage'])
                g['countyAggregation']='sum of source precinct/reporting-unit returns using explicit county FIPS; TOTAL mode preferred within exact reporting-unit candidate key'
                if votes is None:flag(g,'Source suppresses a small-jurisdiction count for privacy; missing values remain null, not zero.')
                if duplicate_mode:flag(g,'Source repeats a reporting-unit/candidate/mode key; duplicate rows retained for review, not silently removed.')
                if st=='IN' and year==2024:flag(g,'MEDSL2024 Indiana notes warn Governor counts may be overreported by straight-party vote inclusion.')
                if st=='MO' and year==2024:flag(g,'MEDSL2024 Kansas City uses a synthetic cross-county FIPS and is excluded; affected real counties may be undercounted.')
                if year==2022 and st=='AR':flag(g,'MEDSL2022 Arkansas omits Phillips County precinct data; other county source totals have not been independently certified here.')
                AUDIT['governorPrecinctSelectedRows']+=1


def import_tennessee_governor():
    sid=source('modern-openelections-tn-governor-2022','openelections-tn-2022-county.csv')
    lookup=collections.defaultdict(set)
    for fips,r in COUNTIES.items():
        if r['USPS']=='TN':lookup[r['NAME'].removesuffix(' County').strip().upper()].add(fips)
    for i,r in enumerate(csv.DictReader((RAW/'openelections-tn-2022-county.csv').open()),2):
        if r['office']!='Governor':continue
        matches=lookup[r['county'].strip().upper()]
        assert len(matches)==1, f'UnverifiedTennessee county name {r["county"]}'
        fips=next(iter(matches))
        add('governor',2022,fips,'TN',r['candidate'],r['party'],numeric(r['votes']),sid,extra=dict(countyFipsBasis='Unique exact county name within Tennessee checked against Census county Gazetteer'))
        AUDIT['tennesseeGovernorCountySourceRows']+=1


def import_florida_current():
    filename='official-fl-2026-results.txt'
    spec=SNAPSHOTS[filename]
    sid=source('modern-official-fl-2026',filename,resultStatus='unofficial',countingStatus='counting',asOf=spec['retrievedAt'],asOfBasis=spec['asOfBasis'])
    lookup=collections.defaultdict(set)
    for fips,r in COUNTIES.items():
        if r['USPS']=='FL':lookup[re.sub(r'[^A-Z0-9]','',r['NAME'].removesuffix(' County').upper())].add(fips)
    records=[]
    for i,r in enumerate(csv.DictReader((RAW/filename).open(),delimiter='\t'),2):
        office={'USS':'senate','USR':'house','GOV':'governor'}.get(r['RaceCode'])
        if not office:continue
        assert r['ElectionDate']=='11/03/2026'
        matches=lookup[re.sub(r'[^A-Z0-9]','',r['CountyName'].upper())]
        assert len(matches)==1,f'UnverifiedFlorida county {r["CountyName"]}'
        fips=next(iter(matches));district=str(int(r['Juris1num'])) if office=='house' else None
        name=' '.join(x.strip() for x in (r['CanNameFirst'],r['CanNameMiddle'],r['CanNameLast']) if x.strip())
        votes=numeric(r['CanVotes']);assert votes is not None
        records.append((office,fips,district,name,r['PartyName'],votes,r))
    for office in ('governor','senate'):
        assert len({fips for of,fips,*_ in records if of==office})==67,f'IncompleteFlorida statewide coverage {office}'
    available_districts={d for of,f,d,*_ in records if of=='house'}
    assert available_districts <= {str(i) for i in range(1,29)}
    dump(RAW/'official-fl-2026-gaps.json',dict(missingHouseDistricts=sorted({str(i) for i in range(1,29)}-available_districts,key=int),note='Absent from official download; no zero vote count or unopposed status inferred'))
    for office,fips,district,name,original,votes,r in records:
        special=office=='senate'
        base=dict(unofficial=True,provisional=True,finalWinnerNotDeclared=True,resultStatus='unofficial',countingStatus='counting',electionStatus='Unofficial Florida returns; certification is not asserted',asOf=spec['retrievedAt'],asOfBasis=spec['asOfBasis'],sourceUpdatedAt=None,fetchedAt=spec['retrievedAt'],retrievedAt=spec['retrievedAt'],sourceContest=r['RaceName'],sourceLinks=[spec['sourceUrl']],sourcePublisher='Florida Division of Elections',snapshotAsOf=spec['retrievedAt'])
        g=add(office,2026,fips,'FL',name,original,votes,sid,special=special,district=district,extra=base)
        g['countyFipsBasis']='Unique exact officialcounty name verified against Census county Gazetteer'
        g['precinctsReporting']=numeric(r['PrecinctsReporting'].strip())
        g['precinctsTotal']=numeric(r['Precincts'].strip())
        summary=add(office,2026,'12','FL',name,original,votes,sid,special=special,district=district,geo_level='district' if office=='house' else 'state',extra=base)
        summary['geographicAggregation']='sum of all67 officialcounty returns in thissnapshot' if office!='house' else 'sum of officialcounty-district returns for thisdistrict in thissnapshot'
        summary['independentStatewideSourceTotal']=False
        AUDIT['florida2026DirectSourceRows']+=1


def import_alabama_2017_certified():
    filename='official-al-2017-canvass.pdf'
    sid=source('modern-official-al-senate-2017',filename,textExtractionFile='official-al-2017-canvass.txt',textExtractionSha256=SNAPSHOTS['official-al-2017-canvass.txt']['sha256'],certificationDate='2017-12-28',certifyingAuthority='Alabama State Canvassing Board')
    pages=(RAW/'official-al-2017-canvass.txt').read_text().split('\f')
    records=[];state_total=None
    for page in pages[1:3]:
        for line in page.splitlines():
            match=re.match(r'^([A-Za-z ]+?)\s{2,}([0-9,]+)\s+([0-9,]+)\s+([0-9,]+)(?:\s|$)',line)
            if not match:continue
            name=match[1].strip();values=tuple(int(match[i].replace(',','')) for i in (2,3,4))
            if name=='Total':state_total=values
            else:records.append((name,values))
    assert len(records)==67 and state_total==(673896,651972,22852)
    assert tuple(sum(values[i] for _,values in records) for i in range(3))==state_total
    def canonical(name):return re.sub(r'[^A-Z0-9]','',name.upper())
    lookup=collections.defaultdict(set)
    for fips,c in COUNTIES.items():
        if c['USPS']=='AL':lookup[canonical(c['NAME'].removesuffix(' County'))].add(fips)
    seen=set()
    for name,values in records:
        matches=lookup[canonical(name)]
        assert len(matches)==1,f'Unverified officialAlabama county {name}'
        fips=next(iter(matches));assert fips not in seen;seen.add(fips)
    assert len(seen)==67 and seen=={f for f,c in COUNTIES.items() if c['USPS']=='AL'}
    entries=[('county',next(iter(lookup[canonical(name)])),values) for name,values in records]+[('state','01',state_total)]
    for geo,fips,values in entries:
        for name,original,votes in [('Doug Jones','D',values[0]),('Roy Moore','R',values[1]),('Write-In total','',values[2])]:
            g=add('senate',2017,fips,'AL',name,original,votes,sid,special=True,total=sum(values),geo_level=geo)
            g.update(certified=True,certificationDate='2017-12-28',electionDate='2017-12-12',resultStatus='certified',electionStatus='Official results certified by Alabama State Canvassing Board December28 2017',sourceLinks=[SOURCES[sid]['sourceUrl']],totalVotesBasis='sum of certified DougJones/RoyMoore/aggregateWriteIn table columns; not ballots cast')
            if geo=='county':g['countyFipsBasis']='Unique normalized officialcanvass county name checked against Census county Gazetteer'
            AUDIT['alabama2017CertifiedSourceEntries']+=1


def import_additional_senate_precincts():
    def canonical(name):return re.sub(r'[^A-Z0-9]','',name.upper())
    for filename,year,state,expected_count,missing in [
        ('senate-ga-2021.csv',2021,'GA',159,['Camden','Chattooga','Grady','Greene']),
        ('senate-az-2020-precinct.csv',2020,'AZ',15,['Pinal','Yuma']),
    ]:
        lookup=collections.defaultdict(set)
        for fips,c in COUNTIES.items():
            if c['USPS']==state:lookup[canonical(c['NAME'].removesuffix(' County'))].add(fips)
        sid=source(f'modern-openelections-senate-{state.lower()}-{year}',filename,coverageIncomplete=True,sourceMissingCounties=missing,expectedCountyCount=expected_count,countyCompletenessIndependentlyVerified=False)
        used=set();keys=set()
        for i,r in enumerate(csv.DictReader((RAW/filename).open()),2):
            if r['office'] not in ('U.S. Senate','U.S. Senate (Special)'):continue
            matches=lookup[canonical(r['county'])]
            assert len(matches)==1,f'Unverified Senate county {state} {r["county"]}'
            fips=next(iter(matches));used.add(fips)
            key=(fips,r['precinct'],r['office'],r['candidate'].strip().casefold(),r['party'])
            assert key not in keys,f'Duplicate Senate precinct key {key}'
            keys.add(key)
            if state=='GA':
                components=[numeric(r[k]) for k in ('election_day_votes','advanced_votes','absentee_by_mail_votes','provisional_votes')]
                assert None not in components
                votes=sum(components);special=r['office'].endswith('(Special)');stage='runoff'
            else:
                votes=numeric(r['votes']);special=True;stage='general'
            g=add('senate',year,fips,state,r['candidate'],r['party'],votes,sid,stage=stage,special=special,extra=dict(sourceCoverageIncomplete=True,countyCompletenessIndependentlyVerified=False,sourceMissingCounties=missing,countyAggregation='sum of supplied source precinct candidate rows; county completeness unverified',totalVotesBasis='sum of supplied precinct rows and additive reporting categories; unverified partial county count'))
            flag(g,'OpenElections reports '+str(expected_count-len(missing))+' of '+str(expected_count)+' state counties. Available county precinct completeness is unverified; these are review-held reported counts, not accepted complete county totals. Missing counties: '+', '.join(missing)+'.')
            AUDIT['additionalSenateReportedPrecinctRows']+=1
        assert len(used)==expected_count-len(missing)
        assert not any(canonical(COUNTIES[f]['NAME'].removesuffix(' County')) in {canonical(n) for n in missing} for f in used)


def import_virginia_senate_current():
    filename='official-va-2026-senate.json'
    spec=SNAPSHOTS[filename]
    data=json.loads((RAW/filename).read_text())
    election=data['election'];ballot=data['ballotItemWithBreakdown']
    assert election['electionDate']=='2026-11-03' and election['isOfficialResults'] is False
    def english(values):return next((v['text'] for v in (values or []) if v['languageId']=='en'),'')
    assert english(ballot['name'])=='Member, United States Senate'
    sid=source('modern-official-va-senate-2026',filename,isOfficialResults=election['isOfficialResults'])
    direct=collections.Counter();state=collections.Counter();seen=set()
    entries=[('state','51',ballot['summaryResults']['ballotOptions'],ballot['voteTotal'])]
    for b in ballot['breakdownResults']:
        suffix=b['locality']['mapFeatureId']
        assert re.fullmatch(r'\d{3}',suffix)
        fips='51'+suffix
        assert fips in COUNTIES and COUNTIES[fips]['USPS']=='VA' and fips not in seen
        seen.add(fips)
        assert sum(numeric(c['voteCount']) for c in b['ballotOptions'])==numeric(b['voteTotal'])
        entries.append(('county',fips,b['ballotOptions'],b['voteTotal']))
        for c in b['ballotOptions']:direct[english(c['name'])]+=numeric(c['voteCount'])
    assert len(seen)==133 and seen=={f for f,c in COUNTIES.items() if c['USPS']=='VA'}
    for c in ballot['summaryResults']['ballotOptions']:state[english(c['name'])]+=numeric(c['voteCount'])
    assert direct==state and sum(state.values())==numeric(ballot['voteTotal'])
    for geo,fips,options,total in entries:
        for c in options:
            original=english(c['party']['name']) if c.get('party') else ''
            g=add('senate',2026,fips,'VA',english(c['name']),original,numeric(c['voteCount']),sid,total=numeric(total),geo_level=geo)
            g.update(unofficial=True,provisional=True,finalWinnerNotDeclared=True,resultStatus='unofficial',countingStatus='counting',electionStatus='Virginia official publisher reports unofficial results; not certified',asOf=election['asOf'],asOfBasis='official source asOf timestamp',sourceUpdatedAt=election['lastUpdated'],fetchedAt=spec['retrievedAt'],retrievedAt=spec['retrievedAt'],sourceContest=english(ballot['name']),sourceLinks=[spec['sourceUrl']],sourcePublisher='Virginia Department of Elections',snapshotAsOf=election['asOf'],totalVotesBasis='direct official Senate voteTotal, candidate total matched exactly')
            if geo=='county':g['countyFipsBasis']='Official locality mapFeatureId three-digit county suffix combined with Virginia51 and checked against Census'
            AUDIT['virginia2026DirectSenateCandidateRows']+=1


def import_montana_senate_current():
    import xml.etree.ElementTree as ET
    filename='official-mt-2026-statewide-export.xlsx';spec=SNAPSHOTS[filename]
    sid=source('modern-official-mt-senate-2026',filename,statusSourceFile='official-mt-2026-landing.html',sourceOmittedWriteIns=True)
    ns={'m':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
    with zipfile.ZipFile(RAW/filename) as z:
        strings=[''.join(n.itertext()) for n in ET.fromstring(z.read('xl/sharedStrings.xml'))]
        sheet=ET.fromstring(z.read('xl/worksheets/sheet1.xml'))
        rows=[]
        for row in sheet.findall('.//m:sheetData/m:row',ns):
            values={}
            for c in row.findall('m:c',ns):
                n=c.find('m:v',ns);value=n.text if n is not None else ''
                if c.attrib.get('t')=='s' and value:value=strings[int(value)]
                values[re.sub(r'\d+','',c.attrib['r'])]=value
            rows.append(values)
    header=next(r for r in rows if r.get('A')=='UNITED STATES SENATOR')
    assert rows[0]['A']=='2026 Unofficial General Election Results'
    candidates={col:tuple(value.rsplit('\n',1)) for col,value in header.items() if col not in ('A','B')}
    assert len(candidates)==4 and all(len(value)==2 for value in candidates.values())
    totals=next(r for r in rows if r.get('B')=='TOTALS')
    county_rows=[r for r in rows if r.get('B') not in (None,'','County','TOTALS')]
    assert len(county_rows)==56
    for col in candidates:assert sum(numeric(r[col]) for r in county_rows)==numeric(totals[col])
    def canonical(value):return re.sub(r'[^A-Z0-9]','',value.upper().replace('&','AND'))
    lookup=collections.defaultdict(set)
    for fips,c in COUNTIES.items():
        if c['USPS']=='MT':lookup[canonical(c['NAME'].removesuffix(' County'))].add(fips)
    entries=[];seen=set()
    for r in county_rows:
        matches=lookup[canonical(r['B'])];assert len(matches)==1,f'Unverified Montana county {r["B"]}'
        fips=next(iter(matches));assert fips not in seen;seen.add(fips);entries.append(('county',fips,r))
    assert seen=={f for f,c in COUNTIES.items() if c['USPS']=='MT'}
    entries.append(('state','30',totals))
    for geo,fips,row in entries:
        total=sum(numeric(row[col]) for col in candidates)
        for col,(name,original) in candidates.items():
            g=add('senate',2026,fips,'MT',name,original,numeric(row[col]),sid,total=total,geo_level=geo)
            g.update(unofficial=True,provisional=True,finalWinnerNotDeclared=True,resultStatus='unofficial',countingStatus='counting',electionStatus='Montana official publisher reports unofficial results; write-ins not included',asOf=spec['asOf'],asOfBasis='official source last-updated timestamp explicitly MountainTime',sourceUpdatedAt=spec['asOf'],sourceUpdatedAtRaw=spec['sourceUpdatedAtRaw'],fetchedAt=spec['retrievedAt'],retrievedAt=spec['retrievedAt'],sourceContest='UNITED STATES SENATOR',sourceLinks=[spec['sourceUrl']],sourcePublisher='Montana Secretary of State',snapshotAsOf=spec['asOf'],sourceOmittedWriteIns=True,sourceLimitations=['Official publisher does not report write-in results on this site.'],totalVotesBasis='sum of four published candidate counts; write-ins omitted by publisher',percentageDenominatorBasis='reported candidate counts only; write-ins not supplied',sourceMember='xl/worksheets/sheet1.xml')
            if geo=='county':g['countyFipsBasis']='Unique normalized official workbook county name checked against Census Montana county Gazetteer'
            else:g.update(precinctsReporting=728,precinctsTotal=728)
            AUDIT['montana2026DirectSenateCandidateRows']+=1


def import_south_dakota_current():
    state_filename='official-sd2026-statewide.csv'
    statewide=list(csv.DictReader((RAW/state_filename).open(encoding='utf-8-sig')))
    def canonical(value):return re.sub(r'[^A-Z0-9]','',value.upper())
    lookup=collections.defaultdict(set)
    for fips,c in COUNTIES.items():
        if c['USPS']=='SD':lookup[canonical(c['NAME'].removesuffix(' County'))].add(fips)
    for office,race in [('senate','14412'),('governor','14896')]:
        filename=f'official-sd-2026-{office}-counties.json';spec=SNAPSHOTS[filename]
        sid=source(f'modern-official-sd-{office}-2026',filename,statusSourceFile='official-sd2026-house.html')
        state_sid=source(f'modern-official-sd-{office}-state-2026',state_filename,countySourceFile=filename,countySourceSha256=spec['sha256'])
        county=json.loads((RAW/filename).read_text())['d']
        state_rows={r['CandidateID']:r for r in statewide if r['RaceID']==race}
        assert len(state_rows)==2 and len(county)==132
        counter=collections.Counter();units={};seen=set()
        for r in county:
            assert str(r['RaceID'])==race and r['CandidateID'] in state_rows
            matches=lookup[canonical(r['CountyName'])];assert len(matches)==1,f'Unverified SouthDakota county {r["CountyName"]}'
            fips=next(iter(matches));key=fips,r['CandidateID'];assert key not in seen;seen.add(key)
            assert re.sub(r'\s+',' ',r['calcCandidate'].strip())==re.sub(r'\s+',' ',state_rows[r['CandidateID']]['CandidateName'].strip())
            counter[r['CandidateID']]+=numeric(r['calcCandidateVotes'])
            unit=(numeric(r['PrecinctsReporting']),numeric(r['TotalPrecincts']))
            if fips in units:assert units[fips]==unit
            units[fips]=unit
        assert set(units)=={f for f,c in COUNTIES.items() if c['USPS']=='SD'} and len(units)==66
        for candidate,row in state_rows.items():assert counter[candidate]==numeric(row['CandidateVotes'])
        assert sum(p for p,t in units.values())==671 and sum(t for p,t in units.values())==671
        state_total=sum(numeric(r['CandidateVotes']) for r in state_rows.values())
        entries=[('county',next(iter(lookup[canonical(r['CountyName'])])),r['calcCandidate'],r['PartyName'],r['CandidateID'],numeric(r['calcCandidateVotes']),r) for r in county]
        entries += [('state','46',r['CandidateName'],r['PartyCode'],r['CandidateID'],numeric(r['CandidateVotes']),r) for r in state_rows.values()]
        for geo,fips,name,original,candidate,votes,r in entries:
            total=state_total if geo=='state' else sum(numeric(n['calcCandidateVotes']) for n in county if canonical(n['CountyName'])==canonical(r['CountyName']))
            g=add(office,2026,fips,'SD',name,original,votes,state_sid if geo=='state' else sid,total=total,geo_level=geo)
            g['_candidates'][name.strip().casefold()]['sourceCandidateId']=candidate
            g.update(unofficial=True,provisional=True,finalWinnerNotDeclared=True,resultStatus='unofficial',countingStatus='counting',electionStatus='SouthDakota official publisher reports unofficial results; not certified',asOf=spec['asOf'],asOfBasis='official page last-updated timestamp explicitly CentralTime',sourceUpdatedAt=spec['asOf'],sourceUpdatedAtRaw=spec['sourceUpdatedAtRaw'],sourceExportTimestampRaw=SNAPSHOTS[state_filename]['sourceTimestampRaw'],sourceExportTimestampTimeZone='not specified in CSV; retained verbatim',fetchedAt=spec['retrievedAt'],retrievedAt=spec['retrievedAt'],sourceContest=state_rows[candidate]['RaceName'],sourceLinks=[spec['sourceUrl']],sourcePublisher='South Dakota Secretary of State',snapshotAsOf=spec['asOf'],sourceRaceId=race,totalVotesBasis='sum of official candidate counts; every county candidate sum reconciles to independent statewide export')
            if geo=='county':g.update(countyFipsBasis='Unique normalized official county name checked against Census SouthDakota county Gazetteer; sourceCountyId is not treated as FIPS',sourceCountyId=r['CountyID'],precinctsReporting=numeric(r['PrecinctsReporting']),precinctsTotal=numeric(r['TotalPrecincts']))
            else:g.update(precinctsReporting=671,precinctsTotal=671)
            AUDIT['southDakota2026Direct'+office.title()+'CandidateRows']+=1


def current_office(raw_contest):
    label=re.sub(r'\s+',' ',raw_contest.upper()).replace('U. S.','US').replace('U.S.','US')
    if re.match(r'^GOVERNOR(?:$|\s+(?:AND|/|&))',label) and 'UNIVERSITY' not in label:return 'governor'
    if 'SENAT' in label and re.search(r'\bUS\b|UNITED STATES|SENATOR IN CONGRESS',label):return 'senate'
    if re.search(r'\bNC HOUSE|\bSTATE HOUSE|\bSTATE REPRESENTATIVE',label):return None
    federal=re.search(r'REPRESENTATIVE (?:IN|TO) CONGRESS|UNITED STATES (?:REPRESENTATIVE|HOUSE)|\bUS (?:HOUSE|REPRESENTATIVE|CONGRESS)|MEMBER, HOUSE OF REPRESENTATIVES|HOUSE OF REPRESENTATIVES.*CONGRESSIONAL DISTRICT|REPRESENTATIVE TO THE \d+(?:TH|ST|ND|RD) UNITED STATES CONGRESS',label)
    return 'house' if federal else None


def import_current_2026():
    """Pinned official-source snapshot, not an election call or a live subscription."""
    def clean(value):
        return re.sub(r'[^A-Z0-9]', '', value.upper())
    aliases=collections.defaultdict(set)
    for fips,r in COUNTIES.items():
        full=r['NAME'].strip()
        names={full,re.sub(r'\s+(County|Parish|Borough|Census Area|Municipality|city|City and Borough)$','',full,flags=re.I)}
        for name in names:aliases[r['USPS'],clean(name)].add(fips)
    house_inventory=collections.defaultdict(set)
    for r in json.loads((ROOT/'public/data/elections/house-2024.json').read_text())['results']:house_inventory[r['stateAbbr']].add(r['district'])
    current_inventory=collections.Counter()
    for filename,spec in SNAPSHOTS.items():
        if not re.fullmatch(r'results-2026-[a-z]{2}\.csv',filename):continue
        state=filename[-6:-4].upper()
        if state=='FL':continue # import direct official state download separately
        sid=f'modern-current-2026-{state.lower()}'
        source(sid,filename,readmeFile='results-2026-README.md',resultStatus='unofficial',countingStatus='counting',asOf=spec['asOf'],license='CC0-1.0 research snapshot; original official-source URLs retained per contest')
        for i,r in enumerate(csv.DictReader((RAW/filename).open()),2):
            raw_contest=r['contest'];label=re.sub(r'\s+',' ',raw_contest.upper()).replace('U. S.','US').replace('U.S.','US')
            office=current_office(raw_contest)
            if office is None:continue
            if state=='SD' and office in ('senate','governor'):continue # direct official county+state snapshots supersede older mirrored state totals
            reason=None
            if 'WIKIPEDIA' in (r['source']+' '+r['sourceUrl']).upper() or 'CANDIDATE LIST' in r['source'].upper():reason='Candidate-list placeholder; no official vote returns'
            elif not r['sourceUrl'].startswith('https://'):reason='Missing official source URL'
            elif state=='VA' and 'utah.gov' in r['sourceUrl']:reason='Virginia source URL points to Utah host; held pending primary-source verification'
            elif state in ('CT','RI') and r['level']=='county':reason='Connecticut/RhodeIsland feed reports towns/cities, not counties; no unsupported town-to-county conversion'
            elif state=='AK' and r['level']=='county':reason='Alaska election district reporting units are not verified borough/county returns'
            if reason:
                EXCLUSIONS.append(dict(source=filename,line=i,reason=reason,row=r));continue
            district=None;source_district=None
            if office=='house':
                match=re.search(r'\bDISTRICT\s*(\d+)',label) or re.search(r'\b(\d+)(?:ST|ND|RD|TH)?\s+(?:CONGRESSIONAL\s+)?DISTRICT',label) or re.search(r'\bCONGRESS\s+(\d+)\b',label) or re.search(r'\bUS REPRESENTATIVE\s+(\d+)(?:ST|ND|RD|TH)\b',label)
                if match:district=str(int(match[1]));source_district=district
                elif house_inventory[state]=={'0'}:district='0'
                if district=='1' and house_inventory[state]=={'0'}:district='0'
                if district is None or district not in house_inventory[state]:
                    EXCLUSIONS.append(dict(source=filename,line=i,reason='Current House district identity missing or invalid; no candidate-based inference',row=r));continue
            level=r['level']
            if level=='county':
                matches=aliases[state,clean(r['county'])]
                if len(matches)!=1:
                    EXCLUSIONS.append(dict(source=filename,line=i,reason='County name is unresolved/ambiguous or reporting unit is not a county',row=r));continue
                fips=next(iter(matches));geo='county'
            elif level=='state':
                fips=next((sf for sf,name in STATE_ABBR.items() if name==state),None)
                if fips is None:continue
                geo='district' if office=='house' else 'state'
            else:
                EXCLUSIONS.append(dict(source=filename,line=i,reason='Unsupported current-results reporting level',row=r));continue
            try:votes=numeric(r['votes'])
            except AssertionError:
                EXCLUSIONS.append(dict(source=filename,line=i,reason='Invalid current vote count',row=r));continue
            if votes is None:
                EXCLUSIONS.append(dict(source=filename,line=i,reason='Candidate list has no actual published vote count',row=r));continue
            special=bool(re.search(r'SPECIAL|UNEXPIRED|SHORT TERM|PARTIAL TERM',label)) or (office=='senate' and state in ('FL','OH'))
            stage='runoff' if 'RUNOFF' in label else 'general'
            token=hashlib.sha256(raw_contest.strip().upper().encode()).hexdigest()[:10]
            total=numeric(r.get('contestTotalVotes',''))
            g=add(office,2026,fips,state,r['candidate'],r['party'],votes,sid,stage=stage,special=special,district=district,source_stage=raw_contest,total=total,geo_level=geo,contest_token=token)
            g.update(unofficial=True,resultStatus='unofficial',countingStatus='counting',electionStatus='Unofficial returns; counting continues; not certified',asOf=r['sourceUpdatedAt'] or r['fetchedAt'],asOfBasis='source timestamp' if r['sourceUpdatedAt'] else 'fetch time; source timestamp unavailable',sourceUpdatedAt=r['sourceUpdatedAt'] or None,fetchedAt=r['fetchedAt'],retrievedAt=r['fetchedAt'],sourceContest=raw_contest,sourceLinks=[r['sourceUrl']],sourcePublisher=r['source'],snapshotAsOf=spec['asOf'],totalVotesBasis='official-source contestTotalVotes where supplied; otherwise sum of published candidate rows')
            if special and office=='senate' and state in ('FL','OH'):g['specialElectionBasis']='2026 vacancy election fills remainder of Senate term ending January2029; next regular election2028 (Florida/Ohio)'
            if geo=='county':g['countyFipsBasis']='Unique normalized Census2018/2024 county name within state; ambiguous county/city names excluded'
            if source_district is not None:g['sourceDistrict']=source_district
            for field in ('precinctsReporting','precinctsTotal'):
                value=numeric(r.get(field,''))
                if value is not None:g[field]=value
            # No projection or certification/winner is inferred from a numeric lead.
            g['provisional']=True
            g['finalWinnerNotDeclared']=True
            current_inventory[office,geo,state]+=1
            AUDIT['current2026AcceptedSourceRows']+=1
    dump(RAW/'current-2026-coverage-inventory.json',[dict(office=k[0],geoLevel=k[1],state=k[2],sourceRows=v) for k,v in sorted(current_inventory.items())])


def main(download=False, current_only=False):
    global SNAPSHOTS, COUNTIES, STATE_NAMES, STATE_ABBR
    RAW.mkdir(parents=True,exist_ok=True);OUT.mkdir(parents=True,exist_ok=True)
    SNAPSHOTS=json.loads((RAW/'snapshots.json').read_text())
    for name,spec in SNAPSHOTS.items():
        path=RAW/name
        if download and spec.get('url'):subprocess.run(['curl','-fsSL','--retry','2',spec['url'],'-o',str(path)],check=True)
        assert path.exists(),f'Missing snapshot {name}'
        assert hashlib.sha256(path.read_bytes()).hexdigest()==spec['sha256'],f'Source hash mismatch {name}'
    COUNTIES={}
    for y in (2018,2024):
        with zipfile.ZipFile(RAW/f'census-{y}-counties.zip') as z:
            name=next(n for n in z.namelist() if n.endswith('.txt'))
            COUNTIES.update({r['GEOID']:r for r in csv.DictReader(io.StringIO(z.read(name).decode()),delimiter='\t')})
    STATE_NAMES={r['stateFips']:r['state'] for r in json.loads((ROOT/'public/data/elections/president-2016.json').read_text())['results']}
    STATE_ABBR={r['stateFips']:r['stateAbbr'] for r in json.loads((ROOT/'public/data/elections/president-2016.json').read_text())['results']}
    if not current_only:
        import_heideman();import_algara();import_senate_2024();import_precinct_governors();import_tennessee_governor();import_additional_senate_precincts();import_alabama_2017_certified()
    import_current_2026();import_florida_current();import_virginia_senate_current();import_montana_senate_current();import_south_dakota_current()
    inventory=collections.Counter((k[0],g['geoLevel'],g['stateAbbr']) for k,g in GROUPS.items() if k[1]==2026)
    dump(RAW/'current-2026-coverage-inventory.json',[dict(office=k[0],geoLevel=k[1],state=k[2],geographicResults=v) for k,v in sorted(inventory.items())])
    byfile=collections.defaultdict(list);actual=collections.Counter()
    for key,g in sorted(GROUPS.items()):
        categories=[];actual_candidates=[]
        for nk,c in g.pop('_candidates').items():
            c['partyOriginal']=' / '.join(c.pop('_parties'))
            known_votes=c.pop('_knownVotes')
            if c['votes'] is None:c['knownVoteSum']=known_votes
            actual[key,nk]=known_votes
            cat=category(c['name'])
            if cat:categories.append(dict(name=c['name'],votes=c['votes'],category=cat,**({'knownVoteSum':known_votes} if c['votes'] is None else {})))
            else:actual_candidates.append(c)
        assert {c['name'].casefold() for c in actual_candidates+categories}==LABELS[key]
        g['candidates']=sorted(actual_candidates,key=lambda c:-(c['votes'] if c['votes'] is not None else -1))
        # Reporting-total pseudo rows are redundant accounting observations, not additive votes.
        additive_categories=[c for c in categories if c['category']!='reportedBallotTotal']
        if categories:g['reportingCategories']=categories
        if additive_categories and max((c.get('knownVoteSum',c['votes'] or 0) for c in additive_categories if c['category']=='unitemizedOtherCandidates'),default=-1)>=max((c['votes'] or 0 for c in actual_candidates),default=0):flag(g,'Unitemized other-candidate total can exceed the leading named candidate; source cannot identify a winner.')
        g['candidateVoteSum']=sum(c.get('knownVoteSum',c['votes'] or 0) for c in actual_candidates)
        g['reportingCategoryVotes']=sum(c.get('knownVoteSum',c['votes'] or 0) for c in additive_categories)
        known=g['candidateVoteSum']+g['reportingCategoryVotes']
        if g['totalVotes'] is None:
            g['totalVotes']=known;g.setdefault('totalVotesBasis','sum of source candidate and additive reporting-category entries; redundant ballot-total rows excluded')
        elif g['totalVotes']!=known:
            g['voteTotalMismatch']=True;g['reportedEntryVoteSum']=known
        if g.get('incomplete'):flag(g,'One or more source counts are missing/suppressed. The known sum is incomplete.')
        assert all(c['votes'] is None or isinstance(c['votes'],int) and c['votes']>=0 for c in actual_candidates+categories)
        byfile[key[:2]].append(g)
    for (of,y),rs in byfile.items():
        if y==2026 and of=='house':
            assert not any(re.search(r'\bNC HOUSE|\bSTATE HOUSE|\bSTATE REPRESENTATIVE',r.get('sourceContest','').upper()) for r in rs), 'Nonfederal House contest leaked into current returns'
    assert actual==EXPECTED,'Candidate names/vote sums changed during normalization'
    if not current_only:
        ga=[r for r in byfile['senate',2022] if r['stateAbbr']=='GA']
        ga_sums=collections.Counter()
        for r in ga:
            assert r['stage']=='runoff' and r['sourceStage']=='runoff'
            for c in r['candidates']:ga_sums[c['name']]+=c['votes']
        assert len(ga)==159 and sorted(ga_sums.values())==[1721244,1820633], 'Georgia2022runoff semantic check failed'
        vt=[c for r in byfile['governor',2022] if r['stateAbbr']=='VT' for c in r['candidates'] if c['name']=='BRENDA SIEGEL']
        assert vt and all(c['party']=='Democrat' for c in vt), 'DEM/PROG party classification failed'
    coverage=[]
    for (office,year),rows in sorted(byfile.items()):
        ids=sorted({r['sourceId'] for r in rows});name=f'{office}-{year}.json'
        dump(OUT/name,dict(schemaVersion=1,office=office,year=year,snapshotDate=DATE,sources={s:SOURCES[s] for s in ids},results=rows))
        current_metadata=dict(resultStatus='unofficial',provisional=True,asOf=max(r['retrievedAt'] for r in rows),oldestRetrievedAt=min(r['retrievedAt'] for r in rows),latestRetrievedAt=max(r['retrievedAt'] for r in rows),asOfBasis='retrieval range; individual results retain source-specific count timestamps') if year==2026 else {}
        coverage.append(dict(**current_metadata,office=office,year=year,url=f'/data/modern-counties/{name}',geoLevels=sorted({r['geoLevel'] for r in rows}),rows=len(rows),contests=len({r['contestId'] for r in rows}),stateCount=len({r['stateFips'] for r in rows}),candidateCount=sum(len(r['candidates']) for r in rows),sourceNeedsReviewCount=sum(bool(r.get('sourceNeedsReview')) for r in rows),incompleteCount=sum(bool(r.get('incomplete')) for r in rows)))
    limitations=[
        'Historical2016–2024 county supplements. Existing baseline county records, including2018 supplements, are preserved; only absent county/district coverage is added.',
        'Research sources are not certification authorities. Source corrections, incomplete names, missing/suppressed values and suspicious rows remain visible review flags.',
        'Alabama2017Senate special election has67certifiedcounty records plusindependentstate total, certifiedDecember28. Majorparty673896/651972 andaggregatewriteins22852 matchtheofficialPDFexactly; writeinappendixnotdoublecounted.',
        'Additional reported-precinct Senate counts fill13Arizona2020special counties and155Georgia2021counties forbothrunoffs, all heldforreview because countycompletenessisunverified. MissingAZPinal/Yuma andGACamden/Chattooga/Grady/Greene remainmissing; no allocation.',
        'Heideman v1 excludes special elections, Alaska,Hawaii,DC.2024Senate instead uses directMEDSLcounty data retaining separate concurrent full/partial-term contests. Hawaii is imported separately from official state reports.',
        'House values are county–district intersections. Unresolved districts and NewJersey2022district totals repeated ascounty values are excluded, never inferred.',
        'Unopposed/no-ballot seats are documented in raw gap/no-ballot inventories; they do not create zero-vote county records.',
        'Georgia2020Senate first round, Georgia2022Senate Dec6runoff andLouisianaSenate first rounds are distinguished; absent later rounds remain absent. Maine2024House2 first preferences require review.',
        'AlgaraGovernor itemizes major-party nominees only. Residualminor-party counts are separate unitemized reporting categories, not invented candidates.',
        'Precinct Governor aggregation prefers TOTAL over component modes only within an exact source reporting-unit/candidate key. Missing counts remain null; duplicate keys carry review flags.',
        '2022GovernorTennessee is absent from theMEDSLstatefile and added from OpenElections county returns; ArkansasPhillipsCounty is absent; Alaska has no verified county allocation.2024Indiana source warnsstraight-party overcounts; MissouriKansasCitysyntheticFIPSisexcluded.',
        'Census2018+2024countyregistries verifyFIPSandstate. HistoricalShannon46113 isexplicitlynormalizedtoOglalaLakota46102; originalsourceFIPSretained.',
        'DirectFlorida2026officialcountyreturns supersede the mirroredFlorida snapshot. Governor/Senate summaries sum all67officialcountyrows. HouseDistrict10 is absent from the feed and not inferredzero. Othercurrentcounts remain source-specific snapshots.',
        'Montana2026Senate adds56counties+state fromofficialworkbook; write-ins explicitlyomittedby publisher. SouthDakota2026Senate/Governor eachadd66counties+independentstateexport; sumsreconcilebyCandidateID. SourcepageMT/CTtimestampsretainedexplicitly; noexporttimestampzoneguessed.',
        '2026unofficialreturns are a separately pinned Nov6 10:02AMET snapshot from official-source feeds collectedbyPushbuild; eachcontestretains officialURL/sourceTimestamp/fetchedAt. Counting/certification remains unresolved, no projection is claimed. Candidate-list placeholders, unverifiedcountyunits and Virginiawrong-hostURLs excluded. No2026presidentialelection occurs.',
    ]
    if current_only:
        print(json.dumps(dict(currentSnapshotCheck='passed',coverage=coverage,exactSourceCandidateNamesAndVoteSums=True,excludedRows=len(EXCLUSIONS)),indent=2))
        return
    dump(OUT/'manifest.json',dict(schemaVersion=1,snapshotDate=DATE,sources=SOURCES,coverage=coverage,limitations=limitations))
    dump(RAW/'exclusions.json',EXCLUSIONS)
    report=dict(status='passed',files=len(coverage),geographicResults=len(GROUPS),candidateEntries=sum(x['candidateCount'] for x in coverage),coverage=coverage,exactSourceCandidateNamesAndVoteSums=True,sourceHashesVerified=len(SNAPSHOTS),allAcceptedCountyFipsVerified=True,excludedRows=len(EXCLUSIONS),excludedReasons=dict(collections.Counter(r['reason'] for r in EXCLUSIONS)),audit=dict(AUDIT),limitations=limitations)
    dump(OUT/'validation.json',report)
    print(json.dumps({k:v for k,v in report.items() if k not in ('limitations','coverage')},indent=2))


if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--download',action='store_true');p.add_argument('--current-only',action='store_true',help=argparse.SUPPRESS);args=p.parse_args();main(args.download,args.current_only)
