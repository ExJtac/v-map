#!/usr/bin/env python3
"""Verify packaged county facts, preserved evidence, and exceptional-geography limits."""
import hashlib, json, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
def read(p): return json.loads((ROOT / p).read_text())

for directory in ([] if '--packaged' in sys.argv else ['population', 'turnout']):
    raw = ROOT / 'scripts/source-data' / directory
    for name, receipt in read(f'scripts/source-data/{directory}/receipts.json').items():
        assert hashlib.sha256((raw / name).read_bytes()).hexdigest() == receipt['sha256'], name

data = read('public/data/population/counties.json')
atlas = read('node_modules/us-atlas/counties-albers-10m.json')
assert set(data['counties']) == {r['id'] for r in atlas['objects']['counties']['geometries']}
assert sum(map(len, data['counties'].values())) == 65936
for f, rows in data['counties'].items():
    assert len(rows) == len({r['year'] for r in rows})
    for r in rows:
        assert isinstance(r['value'], int) and r['value'] >= 0
        assert r['sourceId'] in data['sources']
        assert 2005 <= r['year'] <= 2025
assert max(r['year'] for r in data['counties']['09001']) == 2021
assert max(r['year'] for r in data['counties']['02261']) == 2019
assert min(r['year'] for r in data['counties']['51019']) == 2013
assert next(r['value'] for r in data['counties']['08031'] if r['year'] == 2024) == 741591
assert next(r['sourceId'] for r in data['counties']['06037'] if r['year'] == 2016) == 'census2010int'

turnout = read('public/data/turnout/counties.json')
assert len(turnout['counties']) == 58
assert all(f.startswith('06') and len(rows) == 1 for f, rows in turnout['counties'].items())
assert sum(rows[0]['ballotsCast'] for rows in turnout['counties'].values()) == 9027710
assert turnout['counties']['06037'][0]['ballotsCast'] == 2617572
for rows in turnout['counties'].values():
    r = rows[0]
    assert r['electionDate'] == '2026-11-03' and r['provisional'] and r['unofficial']
    assert r['ballotsCast'] <= r['registeredVoters'] and r['sourceId'] in turnout['sources']
print(json.dumps(dict(status='passed', populationCounties=3142, datedEstimates=65936,
                      turnoutCounties=58, preservedSourceHashes='--packaged' not in sys.argv)))
