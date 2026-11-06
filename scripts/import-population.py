#!/usr/bin/env python3
"""Build dated county population series from retained Census sources, without allocation."""
import csv, hashlib, io, json, zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / 'scripts/source-data/population'
OUT = ROOT / 'public/data/population'

def dump(path, data):
    path.write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')) + '\n')

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    receipts = json.loads((RAW / 'receipts.json').read_text())
    for name, receipt in receipts.items():
        assert hashlib.sha256((RAW / name).read_bytes()).hexdigest() == receipt['sha256'], name
    atlas = json.loads((ROOT / 'node_modules/us-atlas/counties-albers-10m.json').read_text())
    fips = {r['id'] for r in atlas['objects']['counties']['geometries']}
    assert len(fips) == 3142
    sources, series, controls = {}, {f: {} for f in sorted(fips)}, []
    state_series = {f: {} for f in sorted({f[:2] for f in fips})}

    def put_state(f, year, value, sid, basis='Census state population estimate'):
        if f in state_series and 2005 <= year <= 2025:
            state_series[f][year] = dict(year=year, value=value, sourceId=sid,
                referenceDate=f'{year}-07-01', basis=basis)

    def source(name, sid, title, vintage):
        sources[sid] = dict(title=title, vintage=vintage, **receipts[name])

    def put(f, year, value, sid, **extra):
        if f not in series or not 2005 <= year <= 2025:
            return
        # County gained the former independent city in 2013; do not attach an older
        # county-only figure to the larger map geometry.
        if f == '51019' and year < 2013:
            return
        assert isinstance(value, int) and value >= 0
        series[f][year] = dict(year=year, value=value, sourceId=sid,
                               referenceDate=f'{year}-07-01', **extra)

    def load_csv(name, sid, title, vintage, years, only=None):
        source(name, sid, title, vintage)
        rows = list(csv.DictReader((RAW / name).open(encoding='latin-1')))
        for year in years:
            column = f'POPESTIMATE{year}'
            states = {r['STATE'].zfill(2): int(r[column]) for r in rows if int(r['SUMLEV']) == 40}
            for state, value in states.items():
                put_state(state, year, value, sid)
            sums = {}
            for row in rows:
                if int(row['SUMLEV']) != 50:
                    continue
                state = row['STATE'].zfill(2)
                f = state + row['COUNTY'].zfill(3)
                value = int(row[column])
                sums[state] = sums.get(state, 0) + value
                # These are documented name/code changes, not spatial allocations.
                f = {'46113': '46102', '02270': '02158'}.get(f, f)
                if only is None or f in only:
                    put(f, year, value, sid)
            assert sums == states, (name, year, 'county/state population controls')
            controls.append(dict(sourceId=sid, year=year, stateCountySumsMatch=True))

    load_csv('co-est00int-tot.csv', 'census2000int',
             'Census 2000–2010 intercensal county population estimates', '2000–2010 intercensal', range(2005, 2010))
    # Old-boundary fallback is limited to Valdez-Cordova, absent in 2020 geography.
    load_csv('co-est2019-alldata.csv', 'census2019',
             'Census Vintage 2019 county population estimates', 2019, range(2010, 2020), {'02261'})

    name = 'co-est2020int-pop.xlsx'
    sid = 'census2010int'
    source(name, sid, 'Census 2010–2020 intercensal county population estimates', '2010–2020 intercensal')
    registry = {}
    for row in csv.DictReader((RAW / 'co-est2020-alldata.csv').open(encoding='latin-1')):
        if int(row['SUMLEV']) == 50:
            key = f"{row['CTYNAME']}, {row['STNAME']}"
            assert key not in registry
            registry[key] = row['STATE'].zfill(2) + row['COUNTY'].zfill(3)
    ns = {'s': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
    sums = {y: 0 for y in range(2010, 2020)}
    state_sums = {y: {} for y in range(2010, 2020)}
    national, seen = {}, set()
    with zipfile.ZipFile(RAW / name) as z:
        strings = [''.join(n.itertext()) for n in ET.fromstring(z.read('xl/sharedStrings.xml')).findall('s:si', ns)]
        for row in ET.fromstring(z.read('xl/worksheets/sheet1.xml')).findall('s:sheetData/s:row', ns):
            cells = {}
            for c in row:
                value = c.findtext('s:v', None, ns)
                cells[''.join(filter(str.isalpha, c.attrib['r']))] = strings[int(value)] if c.attrib.get('t') == 's' and value is not None else value
            label = cells.get('A', '') or ''
            if label != 'United States' and not label.startswith('.'):
                continue
            if label.startswith('.'):
                key = label[1:]
                assert key in registry, key
                f = registry[key]
                assert f not in seen
                seen.add(f)
            for year in range(2010, 2020):
                value = int(cells[chr(ord('C') + year - 2010)])
                if label == 'United States':
                    national[year] = value
                else:
                    sums[year] += value
                    state_sums[year][f[:2]] = state_sums[year].get(f[:2], 0) + value
                    put(f, year, value, sid)
    assert sums == national
    assert len(seen) == 3143
    for year, states in state_sums.items():
        assert len(states) == 51 and sum(states.values()) == national[year]
        for state, value in states.items():
            put_state(state, year, value, sid, 'Sum of all Census intercensal source counties in the state; no map-geography filtering')
    controls.append(dict(sourceId=sid, countyRows=len(seen), countyNationalSumsMatch=True))
    # CT's historical eight counties last appear in this compatible vintage.
    ct = {f for f in fips if f.startswith('09')}
    load_csv('co-est2021-alldata.csv', 'census2021',
             'Census Vintage 2021 population estimates for historical Connecticut counties', 2021, [2020, 2021], ct)
    load_csv('co-est2025-alldata.csv', 'census2025',
             'Census Vintage 2025 county population estimates', 2025, range(2020, 2026))
    for f in ct:
        for record in series[f].values():
            if record['year'] >= 2020:
                record['note'] = 'Historical county geography; newer Census estimates use Connecticut planning regions.'
    for record in series['02261'].values():
        record['note'] = 'Historical Valdez-Cordova geography; later estimates use two successor census areas.'
    counties = {f: sorted(rows.values(), key=lambda r: r['year']) for f, rows in series.items()}
    states = {f: sorted(rows.values(), key=lambda r: r['year']) for f, rows in state_series.items()}
    assert len(states) == 51 and all(len(rows) == 21 for rows in states.values())
    assert all(counties.values()), [f for f, rows in counties.items() if not rows]
    limits = [
        'Total resident population, not eligible voters, registered voters, or election turnout.',
        'Latest released county estimate is July 1, 2025; no 2026 population is invented.',
        'Latest reference year no later than the selected election is shown; historical estimates may be revised in later vintages.',
        '2010–2019 uses the preferred intercensal series; 2005–2009 uses the 2000–2010 intercensal series.',
        'Connecticut historical counties retain Vintage 2021 figures; planning regions are not assigned to old counties.',
        'Valdez-Cordova retains Vintage 2019 figures; successor areas are not allocated to the old geometry.',
        'Pre-2013 Bedford County figures are withheld due to the independent-city merger.',
        'Same-FIPS estimates use source-vintage boundaries; 2017 map outlines are a geographic reference.',
        'Displayed population participation uses the selected election cycle ballots and a dated resident estimate; it is not population growth versus a prior year.'
    ]
    dump(OUT / 'counties.json', dict(schemaVersion=1, sources=sources, counties=counties, states=states))
    manifest = dict(schemaVersion=1, url='/data/population/counties.json', sources=sources,
                    firstYear=2005, latestYear=2025, countyCount=len(counties),
                    records=sum(map(len, counties.values())), stateCount=len(states),
                    stateRecords=sum(map(len, states.values())), limits=limits)
    dump(OUT / 'manifest.json', manifest)
    dump(OUT / 'validation.json', dict(status='passed', controls=controls,
         countyCount=len(counties), records=manifest['records'], stateCount=len(states),
         stateRecords=manifest['stateRecords'], exactFipsOrDocumentedRename=True))
    print(json.dumps({k: manifest[k] for k in ['countyCount', 'records', 'firstYear', 'latestYear']}, indent=2))

if __name__ == '__main__':
    main()
