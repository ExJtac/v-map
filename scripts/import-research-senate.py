#!/usr/bin/env python3
"""Offline, pinned official Senate county imports. Never alter existing bundles."""
import collections, csv, datetime as dt, hashlib, io, json, re, subprocess, zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / 'scripts/source-data/research-senate'
OUT = ROOT / 'public/data/research-senate'
NS = {'s': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
CLASS_URL = 'https://www.senate.gov/senators/Class_II.htm'
AL_URL = 'https://www2.alabamavotes.gov/electionNight/statewideResultsByContest.aspx?ecode=1001305'
NE_URL = 'https://electionresults.nebraska.gov/resultsSW.aspx?type=SW&map=CTY'
PDF_URL = 'https://www.sos.alabama.gov/sites/default/files/election-2020/Final%20Canvass%20of%20Results-Merged.pdf'

def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def dump(p, d): p.write_text(json.dumps(d, ensure_ascii=False, separators=(',', ':'))+'\n')
def norm(v): return re.sub('[^A-Z0-9]', '', v.upper())
def number(v):
    if str(v).strip() in ('‐', '–', '-', ''): return None
    n = float(str(v).replace(',', ''))
    assert n >= 0 and n.is_integer(), v
    return int(n)

def workbook(filename, sheet):
    with zipfile.ZipFile(RAW/filename) as z:
        strings = [''.join(n.itertext()) for n in ET.fromstring(z.read('xl/sharedStrings.xml'))] if 'xl/sharedStrings.xml' in z.namelist() else []
        result = []
        for row in ET.fromstring(z.read(f'xl/worksheets/sheet{sheet}.xml')).findall('.//s:row', NS):
            values = {}
            for c in row.findall('s:c', NS):
                v = c.find('s:v', NS)
                value = v.text if v is not None else ''.join(c.itertext())
                values[re.sub(r'\d+', '', c.get('r'))] = strings[int(value)] if c.get('t') == 's' else value
            result.append(values)
        return result

def main():
    receipts = json.loads((RAW/'receipts.json').read_text())
    for filename, meta in receipts.items(): assert sha(RAW/filename) == meta['sha256'], filename
    with zipfile.ZipFile(RAW/'census-2018-counties.zip') as z:
        registry = list(csv.DictReader(io.StringIO(z.read(z.namelist()[0]).decode()), delimiter='\t'))
    names = {(r['USPS'], norm(r['NAME'].removesuffix(' County'))): r['GEOID'] for r in registry}
    assert len(names) == len(registry)
    sources, results, checks = {}, collections.defaultdict(list), []
    def source(sid, filename, url, title, **extra):
        sources[sid] = dict(receipts[filename], file=filename, sourceUrl=url, url=url, title=title,
            publisher='Alabama Secretary of State' if '-al-' in sid else 'Nebraska Secretary of State',
            license='Public state election record; no separate reuse license asserted', version='pinned source snapshot', **extra)
        return sid
    def record(year, st, sf, county, sid, candidates, categories=(), **extra):
        fips = names[st, norm(county)] if county else None
        assert not county or fips[:2] == sf
        all_votes = [c['votes'] for c in candidates] + [c['votes'] for c in categories]
        known = sum(v for v in all_votes if v is not None)
        r = dict(office='senate', year=year, geoLevel='county' if county else 'state', stateFips=sf,
            state='Alabama' if st == 'AL' else 'Nebraska', stateAbbr=st,
            contestId=f'senate-{year}-{sf}-state-general-False', stage='general', special=False,
            electionDate=f'{year}-11-03', sourceSeatId=f'{sf}-senate-class-2', seatClass=2, seatIdentitySource=CLASS_URL,
            candidates=candidates, reportingCategories=list(categories), totalVotes=known if None not in all_votes else None,
            knownVoteSum=known, totalVotesBasis='sum of published Senate candidate and write-in entries; never ballots cast',
            sourceId=sid, sourceIds=[sid], sourceLinks=[sources[sid]['sourceUrl']], sourcePublisher=sources[sid]['publisher'],
            retrievedAt=sources[sid]['retrievedAt'], sourceNeedsReview=False, **extra)
        if county: r.update(county=county+' County', sourceCountyName=county, countyFips=fips,
            countyFipsBasis='Unique official county name within state matched to Census 2018 county Gazetteer; source local county codes are not FIPS')
        if None in all_votes:
            r.update(incomplete=True, sourceNeedsReview=True, reviewReasons=['Printed write-in cell is a dash; retained as null without assuming zero.'])
        results[year].append(r)
        return r
    def candidate(name, label, votes):
        return dict(name=re.sub(r'\s+', ' ', name.strip()), party={'D':'Democrat','R':'Republican','DEM':'Democrat','REP':'Republican','Republican':'Republican'}.get(label, 'Other'), partyOriginal=label, votes=votes)
    def writein(v):
        return dict(name='Write-In', category='unattributedWriteIns', votes=v, **({'sourceValue':'‐'} if v is None else {}))

    # Alabama: public Export Data postback supplies actual county candidate rows.
    sid = source('research-senate-official-al-2026', 'al2026-export.xlsx', AL_URL,
        'Alabama official publisher: 2026 unofficial county Senate export', downloadAction='Public hlnkExportData postback', resultStatus='unofficial')
    tab = workbook('al2026-export.xlsx', 1); header = list(tab[0].values())
    rows = [dict(zip(header, [r.get(c, '') for c in tab[0]])) for r in tab[1:]]
    senate = [r for r in rows if r['Contest Title'] == 'UNITED STATES SENATOR']
    assert len(senate) == 201 and {r['Election Code'] for r in senate} == {'1001305'}
    status_tab = workbook('al2026-export.xlsx', 2); status_header = list(status_tab[0].values())
    statuses = {r['C']: dict(zip(status_header, [r.get(c, '') for c in status_tab[0]])) for r in status_tab[1:] if r.get('C')}
    grouped = collections.defaultdict(list)
    for r in senate: grouped[r['County Name']].append(r)
    assert len(grouped) == 67
    sums = collections.Counter()
    for county, rows in sorted(grouped.items()):
        assert len(rows) == 3 and len({r['Candidate Number'] for r in rows}) == 3
        status = statuses[rows[0]['County Code']]
        serial = status['Last Updated']; stamp = (dt.datetime(1899,12,30)+dt.timedelta(seconds=round(float(serial)*86400))).isoformat()
        cs, cats = [], []
        for r in rows:
            votes = number(r['Votes']); assert votes is not None
            sums[r['Candidate Name']] += votes
            (cats if r['Candidate Name'] == 'Write-In' else cs).append(writein(votes) if r['Candidate Name'] == 'Write-In' else candidate(r['Candidate Name'], r['Party Code'], votes))
        record(2026, 'AL', '01', county, sid, cs, cats, sourceCountyCode=rows[0]['County Code'],
            unofficial=True, provisional=True, certified=False, resultStatus='unofficial', certificationStatus='not certified',
            sourceUpdatedAt=stamp, sourceTimestampOriginal=serial, sourceTimestampBasis='Excel date serial rounded to nearest second; source timezone not specified; no timezone inferred',
            asOf=stamp, asOfBasis='source county timestamp, timezone unspecified',
            precinctsReporting=number(status['Precincts Reported']), precinctsTotal=number(status['Total Precincts']),
            reportingNote='Precinct reporting does not establish complete ballot counting or certification.')
    state_html = (RAW/'al2026-state.html').read_text()
    state_senate = state_html[state_html.index('UNITED STATES SENATOR'):state_html.index('UNITED STATES REPRESENTATIVE')]
    assert sums == {'Everett Wess':758465, 'Barry Moore':917860, 'Write-In':2047}
    for name,v in sums.items(): assert name in state_senate and f'{v:,}' in state_senate
    record(2026, 'AL', '01', None, sid, [candidate('Everett Wess','DEM',sums['Everett Wess']),candidate('Barry Moore','REP',sums['Barry Moore'])], [writein(sums['Write-In'])], unofficial=True, provisional=True, certified=False, resultStatus='unofficial', sourceUpdatedAt='2026-11-04T11:16:06', sourceTimestampBasis='Official statewide page display; timezone unspecified', asOf='2026-11-04T11:16:06', asOfBasis='source statewide page timestamp, timezone unspecified')
    checks.append(dict(state='AL',year=2026,counties=67,countyCandidateSums=dict(sums),independentStatePageMatches=True))

    # Nebraska: explicit county-level export, not a statewide allocation.
    sid = source('research-senate-official-ne-2026', 'ne2026-senate-counties.xlsx', NE_URL,
        'Nebraska official publisher: 2026 unofficial county Senate export', downloadAction='Public ctl00$MainContent$rptRace$ctl00$ctl01 county export postback', resultStatus='unofficial')
    tab = workbook('ne2026-senate-counties.xlsx',1)
    assert tab[0]['A'] == '2026 Unofficial General Election Results'
    h = next(r for r in tab if r.get('B') == 'County'); assert '6  Year Term' in h['A']
    cols = [c for c in h if c not in ('A','B')]
    labels = {'Pete Ricketts':'Republican','Mike Marvin':'Legal Marijuana Now','Dan Osborn':'By Petition','Chuck Conboy':'America First','Robin Richards':'Nebraska Working People'}
    names_by_col = {c: re.sub(r'\s+',' ',h[c].strip()) for c in cols}
    assert set(names_by_col.values()) == set(labels)
    html = (RAW/'ne2026-sw.html').read_text()
    for name,label in labels.items():
        match = re.search(re.escape(name.split()[0])+r'\s+'+re.escape(name.split()[1]),html)
        assert match and label in html[match.end():match.end()+500], name
    county_rows = [r for r in tab if r.get('B') and r['B'] not in ('County','TOTALS')]
    totals = next(r for r in tab if r.get('B') == 'TOTALS'); assert len(county_rows) == 93
    for col in cols: assert sum(number(r[col]) for r in county_rows) == number(totals[col])
    stamp = re.search(r'Results last updated:</span><span>([^<]+)',html)[1]
    assert stamp == '11/4/2026 1:33 PM CT'
    extra = dict(unofficial=True, provisional=True, certified=False, resultStatus='unofficial',
        sourceUpdatedAt='2026-11-04T13:33:00-06:00', sourceTimestampOriginal=stamp,
        sourceTimestampBasis='Official page explicitly Central Time; Nov4 standard-time UTC-06', asOf='2026-11-04T13:33:00-06:00', asOfBasis='official source page last updated',
        reportingNote='Source reports all precincts; count completion/certification is not established.')
    for row in county_rows+[totals]:
        cs = [candidate(names_by_col[c], labels[names_by_col[c]], number(row[c])) for c in cols]
        record(2026,'NE','31',row['B'] if row['B'] != 'TOTALS' else None,sid,cs,**extra)
    checks.append(dict(state='NE',year=2026,counties=93,countyCandidateSums={names_by_col[c]:number(totals[c]) for c in cols},independentExportTotalsMatch=True,noDemocraticNominee=True))

    # Alabama certified2020 PDF physical pages3–4, printed pages1–2.
    sid = source('research-senate-official-al-2020','al2020-certified.pdf',PDF_URL,
        'Alabama State Canvassing Board: certified2020 county Senate results', sourceLocation='Physical PDF pages3–4; printed pages1–2', certificationDate='2020-11-23')
    text = subprocess.check_output(['pdftotext','-layout','-f','3','-l','4',str(RAW/'al2020-certified.pdf'),'-'],text=True)
    assert 'November 23, 2020' in text and 'Certified by the State Canvassing Board' in text
    county_data = []
    for line in text.splitlines():
        m = re.fullmatch(r'\s*(.+?)\s+((?:[\d,]+|‐)(?:\s+(?:[\d,]+|‐)){6})\s*',line)
        if m:
            vals=[number(v) for v in m[2].split()]
            county_data.append((m[1].strip(),vals[-3:]))
    total=next(v for name,v in county_data if name=='Total'); county_data=[(n,v) for n,v in county_data if n!='Total']
    assert len(county_data)==67 and total==[920478,1392076,3891]
    for i in range(3): assert sum(v[i] or 0 for n,v in county_data)==total[i]
    assert [(n,i)for n,v in county_data for i,x in enumerate(v)if x is None]==[('Perry',2)]
    for county,v in county_data+[('Total',total)]:
        record(2020,'AL','01',county if county!='Total' else None,sid,
            [candidate('Doug Jones','D',v[0]),candidate('Tommy Tuberville','R',v[1])],[writein(v[2])],
            certified=True,final=True,unofficial=False,provisional=False,resultStatus='certified',certificationDate='2020-11-23',sourceUpdatedAt=None)
    checks.append(dict(state='AL',year=2020,counties=67,countyKnownSums=total,printedStateControlsMatch=True,nullWriteInCells=[dict(county='Perry',sourceValue='‐',policy='null, never assumed zero')]))

    coverage=[]
    for year,rs in sorted(results.items()):
        assert len({(r.get('countyFips',r['stateFips']),r['contestId'])for r in rs})==len(rs)
        for r in rs:
            assert all(c['votes']is None or isinstance(c['votes'],int)and c['votes']>=0 for c in r['candidates']+r['reportingCategories'])
        ids={r['sourceId']for r in rs};name=f'senate-{year}.json'
        dump(OUT/name,dict(schemaVersion=1,office='senate',year=year,sources={i:sources[i]for i in sorted(ids)},results=sorted(rs,key=lambda r:r.get('countyFips',r['stateFips']))))
        coverage.append(dict(office='senate',year=year,url=f'/data/research-senate/{name}',geoLevels=['county','state'],rows=len(rs),countyRows=sum(r['geoLevel']=='county'for r in rs),stateCount=len({r['stateFips']for r in rs}),sourceNeedsReviewCount=sum(r['sourceNeedsReview']for r in rs)))
    limits=['2026 snapshots are unofficial; reporting precincts is not completed counting or certification.','Nebraska2026 has no Democratic candidate; Other parties are never reassigned.','Alabama2020 Perry write-in dash remains null and that county is review-held; named major-party counts remain exact.','Existing baseline/source data stays unchanged; priority is supplied by the integration layer.']
    dump(OUT/'manifest.json',dict(schemaVersion=1,snapshotDate='2026-11-06',sources=sources,coverage=coverage,limitations=limits))
    report=dict(status='passed',coverage=coverage,checks=checks,sourceHashesVerified=len(receipts),countyFipsVerified=True,negativeFractionalCounts=False)
    dump(OUT/'validation.json',report);print(json.dumps(report,indent=2))

if __name__=='__main__': main()
