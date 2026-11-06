# V-Map

A United States election-history explorer. Click a state to zoom in and reveal its counties, then click a county to zoom farther and read its available returns. Breadcrumbs return to the state or national map. Search supports state names/codes and the selected state's county names/FIPS. Keyboard selection, labels, pan, zoom, and region filters are included.

[Live map](https://cas-tx.com/vmap/) · [Contribute](CONTRIBUTING.md) · [Report a missing or incorrect result](https://github.com/ExJtac/v-map/issues)

The map opens on Governor 2026. The main year slider includes a 2026 results shortcut; Senate, House, and Governor expose imported 2026 returns. President ends at 2024 because there is no 2026 presidential general election. The year slider uses only available election years for the selected office. The imported window spans 2006–2026, including historical county returns, selected special/recall elections, 2025 Governor results, and dated unofficial 2026 returns. President has no 2026 general-election layer. County House results stay separated by congressional district portion.

Click a state or county (or activate it with Enter/Space) to open population, reported contest votes, Republican and Democratic votes, and available percentage changes. Hovering and focus alone do not open a window. Clicking a county also keeps these facts in the side panel for touch use and source links. “% of population that voted” is the selected cycle's reported ballots divided by its dated resident population estimate, not population growth compared with a previous year. Separate vote changes compare the expected previous election for that office and show the comparison year. Provisional 2026 comparisons are explicitly labeled as reported counts while counting continues. Missing cycles, uncertain Senate seats, review-held sources, and House boundary comparisons remain unavailable.

Click-open map pop-ups use a wide county window with every evidence section open and no internal scrollbar. Move into the window to keep it open while reading or following source links; close it with × or Escape. If its full contents exceed the screen, the page scrolls normally without replacing the selected county. The window stays anchored to its place while reading.

The 2026 sidebar lists all flagged counties nationwide for the selected office, with state abbreviations and review directions. Select a county to load its state, zoom directly to its boundaries, and view its details. The list stays available when a state is selected, supports keyboard activation, and hides on historical years. Offices without flags show an explicit empty state; missing comparisons are not treated as normal results.

[Population sources](POPULATION-SOURCES.md) cover 2005–2025 with 65,936 county estimates and 1,071 state/D.C. estimates. No 2026 estimate is invented; older compatible estimates remain labeled for changed geography. [Reported ballots cast](TURNOUT-SOURCES.md) cover California's 58 counties and statewide totals for November 2018, 2020, 2022, 2024 and 2026. County and state cards show ballots as a share of total residents and the change from the same election type four years earlier (2026 vs 2022). Resident population includes children; this is not eligible-voter turnout. Elsewhere, contest votes do not claim to count individual voters, and missing participation figures remain unavailable.

Where ballots are unavailable, a single qualified countywide or statewide President, Senate or Governor contest can show **reported race votes as a percentage of population**. The numerator includes known candidates and explicitly additive write-ins, excluding skipped-race, invalid, overvote and unclassified fields. This is a race-vote measure; it does not count all ballots and does not feed the ballot-participation screen. Concurrent Senate seats, held records, ambiguous boundaries and unverified House district portions remain unavailable. For example, 1,372 reported race votes divided by 4,555 residents is 30.1%.

Mail-ballot and polling-place/vote-center shares are shown for the California 2018–2024 cycles with published method totals. These source categories do not measure postal return versus physical attendance: mail ballots may be returned by hand, and some 2020 counties issued vote-by-mail ballots at voting locations. The current 2026 feed does not provide the split; it remains unavailable rather than borrowing a previous cycle's percentages.

The generated [coverage report](COVERAGE-REPORT.md) lists actual imported coverage and review holds. Presidential cycles each match 3,113 of the 3,142 reference county geometries; the remaining 29 are Alaska county equivalents without compatible official county totals. Historical boundaries, missing sources, unitemized candidates, and current-result coverage gaps remain explicit. This is a local snapshot, not an automatically refreshing election feed.

The 2026 map uses light party colors when counting is not confirmed complete, and dark colors only for explicit source-final or certified counts. Precincts reporting 100% does not establish completion. Held, missing, tied and ambiguous contests retain neutral colors. The current imported 2026 sources establish no completed county counts.

Dark purple county outlines identify Democratic review patterns relative to state peers; dark green identifies Republican patterns. The legend and clickable list distinguish share swings from a separate positive party-count-growth screen. County cards explain both screens, show peer baselines and why an assessed county did or did not flag. See the symmetric [county review criteria](PATTERN-REVIEW.md). Participation uses actual ballots, never the race-vote/population ratio. The audit gives all 3,142 map counties explicit statuses: 58 participation assessments, 1,047 Governor pairs, 576 qualified Senate pairs, and 43 Montana House countywide pairs. Governor has 16 counties flagged by either party screen (six share-shift and 13 growth flags, overlapping); Senate has one county flagged by both; House has none. Senate comparisons use verified regular Class II seat identity, and Montana House comparisons require hash-frozen complete county-district scope. Other unsupported scopes remain not assessed. All flags are provisional exploratory review, not findings of wrongdoing or error. Builds reproduce the audit and its input hashes from pinned local snapshots.

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

## Supporting V-Map

A compact support QR appears beside the page heading, with a link to enlarge it and the same expiry handling as the full support section.

The [support section](https://cas-tx.com/vmap/#support) displays the supplied Rumble Wallet Bitcoin Lightning request. Its QR and decoded invoice are kept together in `public/support/rumble-lightning-qr.jpeg` and `src/support-wallet.json`. The current request has no fixed amount and expires December 6, 2026, at 12:51 PM Mountain time. It is a time-limited invoice, not a reusable donation address; the page displays that limitation and hides payment controls after expiry. Wallet settlement status is not tracked. Replace the QR, invoice, and expiry together when updating the destination. Prefer a verified reusable payment link or Lightning address for ongoing support. No payment is sent by the site itself.

Map source: [US Atlas](https://github.com/topojson/us-atlas), ISC licensed, derived from the U.S. Census Bureau's 2017 cartographic boundaries. Alaska/Hawaii inset sizes are not comparable to the mainland. Region filters use the four Census regions, with D.C. omitted. Dependencies retain their respective licenses in `node_modules`.

Party vote-count changes with absolute magnitude greater than 15% are bold and highlighted in amber, including decreases. This review marker is independent of statistical border rules and does not establish why a change occurred. Exactly ±15% and unavailable comparisons are not highlighted.
