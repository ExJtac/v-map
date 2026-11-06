# V-Map

A United States election-history explorer. Click a state to zoom in and reveal its counties, then click a county to zoom farther and read its available returns. Breadcrumbs return to the state or national map. Search supports state names/codes and the selected state's county names/FIPS. Keyboard selection, labels, pan, zoom, and region filters are included.

[Live map](https://cas-tx.com/vmap/) · [Contribute](CONTRIBUTING.md) · [Report a missing or incorrect result](https://github.com/ExJtac/v-map/issues)

The year slider uses only available election years for the selected office. The imported window spans 2006–2026, including historical county returns, selected special/recall elections, 2025 Governor results, and dated unofficial 2026 returns. President has no 2026 general-election layer. County House results stay separated by congressional district portion.

Hover over or focus a county for population, reported contest votes, Republican and Democratic votes, and available percentage changes. Clicking a county also keeps these facts in the side panel for touch use and source links. Population includes a reference year and annual change within one Census series; vote changes compare the expected previous election for that office and show the comparison year. Partial returns, missing cycles, uncertain Senate seats, and House boundary comparisons remain explicitly unavailable.

[Population sources](POPULATION-SOURCES.md) cover 2005–2025 with 65,936 estimates for all map counties. No 2026 estimate is invented; older compatible estimates remain labeled for changed geography. [Reported ballots cast](TURNOUT-SOURCES.md) are separately available for California's 58 counties in November 2026. Elsewhere, contest vote totals do not claim to count individual voters.

The generated [coverage report](COVERAGE-REPORT.md) lists actual imported coverage and review holds. Presidential cycles each match 3,113 of the 3,142 reference county geometries; the remaining 29 are Alaska county equivalents without compatible official county totals. Historical boundaries, missing sources, unitemized candidates, and current-result coverage gaps remain explicit. This is a local snapshot, not an automatically refreshing election feed.

Source records, missing counts, quality flags, hashes, and import limitations are documented in [DATA-SOURCES.md](DATA-SOURCES.md). Alaska and Hawaii appear as insets. The map covers the 50 states; D.C. is present in the presidential data but has no selectable polygon in this version.

## Run locally

```sh
npm install
npm run dev
```

Open http://127.0.0.1:5173. The dev server binds only to this computer and updates as files change.

```sh
npm run build
npm run verify:packaged
```

Produces a static site in `dist/`. Map geometry and JavaScript are bundled locally; the running page does not need an external map service or API key.

Use `npm run build:hosted` for deployment at `/vmap/`. It rewrites asset paths and makes all internal data fetches relative to that app mount point. See [DEPLOYMENT.md](DEPLOYMENT.md).

## Historical data

```sh
python3 scripts/import-elections.py
python3 scripts/extend-county-elections.py
python3 scripts/verify-elections.py
node scripts/verify-election-summary.mjs
```

Imports use the retained source snapshots by default. See the script's `--help` and source documentation for refreshing downloads. Copy `DATA-SOURCES.md` to `public/DATA-SOURCES.md` if changing the source notes displayed by the site. Only `public/` data are served; raw CSV/TSV snapshots live under `scripts/source-data/` for reproducibility.

The Git repository includes normalized data and provenance manifests, but excludes large original downloads in `scripts/source-data/`. `npm run verify:packaged` runs without those downloads. Full source replay with `npm run verify:data` requires the retained raw snapshots described by the import guides.

Original software is MIT licensed. Third-party data and dependencies retain their own terms; see [DATA-LICENSES.md](DATA-LICENSES.md).

Map source: [US Atlas](https://github.com/topojson/us-atlas), ISC licensed, derived from the U.S. Census Bureau's 2017 cartographic boundaries. Alaska/Hawaii inset sizes are not comparable to the mainland. Region filters use the four Census regions, with D.C. omitted. Dependencies retain their respective licenses in `node_modules`.
