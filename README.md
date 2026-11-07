# V-Map

A United States election-history explorer. Click a state to zoom in and reveal its counties, then click a county to zoom farther and read its available returns. Breadcrumbs return to the state or national map. Search supports state names/codes and the selected state's county names/FIPS. Keyboard selection, labels, pan, zoom, and region filters are included.

[Live map](https://voteranomaly.com/) · [Contribute](CONTRIBUTING.md) · [Report a missing or incorrect result](https://github.com/ExJtac/v-map/issues)

The full comparison audit is generated during builds from versioned normalized sources; its expected SHA remains in `public/data/research-progress-2026.json`. It is available at the public `/data/anomalies-2026.json` URL and is excluded from new Git revisions because of its size. `npm run dev` and the npm verification commands reconstruct it when missing without paid calls or raw research downloads. Existing artifacts are verified rather than silently replaced; see [deployment and reproducibility](DEPLOYMENT.md).

The [election directory](https://voteranomaly.com/winners/) separates Governor, House and Senate lists, with office shortcuts, state/party/search filters, sourced portraits and dedicated profile links. All 337 imported 2026 reported leaders have static election-record profile pages; 215 have sourced photos and 122 explicitly lack a verified photo. Only the exact 12-person pilot carries reviewed accountability evidence. Historical links retain their exact year/contest/name and do not silently acquire 2026 biographies. Full news/speech, bill-component and financial/trade datasets remain future review lanes, not completed research or misconduct ratings.

A first six-case county source review is available from the map's “County report reviews” index and the selected county details: Webb/Zapata Governor, Martin/Archuleta Senate, Mohave House and Osceola Governor. Eight source items retain reporting-stage, count-timing, baseline and source-access limits. No county-office wrongdoing, error or exoneration finding was qualified in this bounded batch, and news counts do not automatically replace imported returns. The comparison-input hash and source approval are retained in `public/data/county-reviews/2026.json`.

[Candidate statements and official actions](https://voteranomaly.com/accountability/) is a source-linked, static-first 12-candidate pilot. The same evidence standards apply to six Republican and six Democratic subjects. It includes 17 short published excerpts, 10 selected official records, 63 account-link observations and 12 reviewed archive replay bodies plus metadata-only checks. Full-source links, attribution, unknown dates, conditions, office authority and coverage limits stay visible. Four subjects have selected after-election statements; campaign text, native account posts, edited interviews and prepared remarks remain distinct. This is not a complete social or voting history, a winner declaration, or a kept/broken-promise score. No author deletion was authenticated. Curated data live in `public/data/candidates/pilot-2026.json`; private receipts remain ignored. See [the collection protocol](CANDIDATE-RESEARCH-PLAN.md) and [pilot status](CANDIDATE-PILOT-STATUS.md).

The map opens on Governor 2026. The main year slider includes a 2026 results shortcut; Senate, House, and Governor expose imported 2026 returns. President ends at 2024 because there is no 2026 presidential general election. The year slider uses only available election years for the selected office. The imported window spans 2006–2026, including historical county returns, selected special/recall elections, 2025 Governor results, and dated unofficial 2026 returns. President has no 2026 general-election layer. County House results stay separated by congressional district portion.

Click a state or county (or activate it with Enter/Space) to open population, reported contest votes, Republican and Democratic votes, and available percentage changes. County selection brings the results into view once, with current vote totals first. Later graph/data loading does not trigger another scroll. Hovering and focus alone do not open a window. The selected place appears in a full-width details box below the map, followed by charts for the available 2006–2026 election cycles. “% of population that voted” is the selected cycle's reported ballots divided by its dated resident population estimate, not population growth compared with a previous year. Separate vote changes compare the expected previous election for that office and show the comparison year. Provisional 2026 comparisons are explicitly labeled as reported counts while counting continues. Missing cycles, uncertain Senate seats, review-held sources, and House boundary comparisons remain unavailable.

Ordinary wheel scrolling moves the page at every map zoom level. Hold Ctrl/⌘ while scrolling, or use +/−, to zoom. Touch gestures are off by default so a one-finger swipe scrolls the page; an explicit map-gesture control enables pan/pinch and provides a return-to-page action.

The map has no hover pop-up. Click or keyboard activation selects a place; all evidence stays in the box under the map with no internal scrollbar. The page scrolls normally. Historical graphs show total, Republican and Democratic race votes and race votes per 100 residents, with an accessible values table and source links. Missing or incompatible comparisons are gaps rather than zeroes.

The 2026 sidebar lists all flagged counties nationwide for the selected office, with state abbreviations and review directions. Select a county to load its state, zoom directly to its boundaries, and view its details. The list stays available when a state is selected, supports keyboard activation and a county/state text filter, and hides on historical years. Offices without flags show an explicit empty state; missing comparisons are not treated as normal results.

[Population sources](POPULATION-SOURCES.md) cover 2005–2025 with 65,936 county estimates and 1,071 state/D.C. estimates. No 2026 estimate is invented; older compatible estimates remain labeled for changed geography. [Reported ballots cast](TURNOUT-SOURCES.md) cover California's 58 counties and statewide totals for November 2018, 2020, 2022, 2024 and 2026. County and state cards show ballots as a share of total residents and the change from the same election type four years earlier (2026 vs 2022). Resident population includes children; this is not eligible-voter turnout. Elsewhere, contest votes do not claim to count individual voters, and missing participation figures remain unavailable.

Where ballots are unavailable, a single qualified countywide or statewide President, Senate or Governor contest can show **reported race votes as a percentage of population**. The numerator includes known candidates and explicitly additive write-ins, excluding skipped-race, invalid, overvote and unclassified fields. This is a race-vote measure; it does not count all ballots and does not feed the ballot-participation screen. Concurrent Senate seats, held records, ambiguous boundaries and unverified House district portions remain unavailable. For example, 1,372 reported race votes divided by 4,555 residents is 30.1%.

Mail-ballot and polling-place/vote-center shares are shown for the California 2018–2024 cycles with published method totals. These source categories do not measure postal return versus physical attendance: mail ballots may be returned by hand, and some 2020 counties issued vote-by-mail ballots at voting locations. The current 2026 feed does not provide the split; it remains unavailable rather than borrowing a previous cycle's percentages.

The generated [coverage report](COVERAGE-REPORT.md) lists actual imported coverage and review holds. Presidential cycles each match 3,113 of the 3,142 reference county geometries; the remaining 29 are Alaska county equivalents without compatible official county totals. Historical boundaries, missing sources, unitemized candidates, and current-result coverage gaps remain explicit. Each data release is a dated snapshot. The saved five-minute Codex schedule is PAUSED at James’s request. Manual research updates are published only after validation. The live status banner shows the last successful check and changes to delayed when it is more than six minutes old. Scheduled local work depends on Codex being available.

The 2026 map uses light party colors when counting is not confirmed complete, and dark colors only for explicit source-final or certified counts. Precincts reporting 100% does not establish completion. Held, missing, tied and ambiguous contests retain neutral colors. The current imported 2026 sources establish no completed county counts.

Dark purple county outlines identify review signals toward Democrats; dark green identifies signals toward Republicans; slate marks total-vote or population-ratio changes. Opposing directions use both party colors. The symmetric [review criteria](PATTERN-REVIEW.md) flag a party-count change of at least 40% while the opposing party stays within ±15%, a race-total change of at least 40%, a population-ratio change of at least 10 percentage points, or a two-party share swing of at least 10 points, subject to source qualification and minimum counts. State peers provide context and cannot veto an own-history flag. Actual ballots and candidate-vote/population measures stay separately labeled.

The schema-3 audit covers all 3,142 map counties with explicit assessed or unavailable statuses. It assesses 58 actual-ballot participation comparisons, 1,080 Governor race-total comparisons, 1,405 Senate county comparisons and 645 qualified House countywide comparisons (at least one own-history screen). Verified research adds Arizona House county/district portions and Alabama/Nebraska Senate returns; gaps and review holds remain across other states. Senate comparisons require verified regular seat identity; House comparisons require complete, hash-frozen county/district scope. All flags are provisional review prompts, not findings of wrongdoing or error. Reporting progress, election timing and candidate changes can explain large differences. Builds reproduce the audit and its input hashes from pinned snapshots.

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

The [support section](https://cas-tx.com/vmap/#support) displays the supplied Bitcoin BIP21 request and original QR image, with on-chain Bitcoin and an optional Lightning invoice. `public/support/bitcoin-support-qr.jpeg` and `src/support-wallet.json` preserve the same decoded request. Bitcoin and Lightning checksums were verified; no payment was sent. The Lightning option expires November 9, 2026, at 2:56 PM Mountain time. The on-chain Bitcoin address remains available after that expiry; wallet links and copied requests then use the Bitcoin address alone. Settlement status is not tracked. Replace the QR and decoded request together.

Map source: [US Atlas](https://github.com/topojson/us-atlas), ISC licensed, derived from the U.S. Census Bureau's 2017 cartographic boundaries. Alaska/Hawaii inset sizes are not comparable to the mainland. Region filters use the four Census regions, with D.C. omitted. Dependencies retain their respective licenses in `node_modules`.

Party vote-count changes with absolute magnitude greater than 15% are bold and highlighted in amber, including decreases. This review marker is independent of statistical border rules and does not establish why a change occurred. Exactly ±15% and unavailable comparisons are not highlighted.


## Statistical comparisons and sharing

The selected-county statistical panel shows a source-qualified same-state distribution for the chosen election year, with empirical percentile rank, observed peer tail counts and median/MAD deviation. These are descriptive frequencies, not p-values, future-event probabilities or odds of fraud. At least ten other qualified counties are required; missing data, provisional reporting, source/seat/district holds and zero-MAD limits remain explicit. [STATISTICAL-METHODS.md](STATISTICAL-METHODS.md) documents assumptions and a prospective model-validation plan. Historical graphs retain identified party counts when only the whole-race total is unitemized; withheld totals remain gaps.

Visible 2026 Governor, Senate and House review shortcuts show assessed and flagged office coverage. The sidebar may also include independent ballot-participation flags. Review absence is not a clean bill of health: many comparisons remain unassessed.

Share map creates a primary-domain link containing the selected office, year and county/state. Explicit logo PNG social metadata and Apple icons replace automatic QR thumbnail selection; previously cached message previews can take time to refresh. [ORGANIC-PROMOTION-PLAN.md](ORGANIC-PROMOTION-PLAN.md) and the public [promotion kit](public/PROMOTION-KIT.md) provide reviewed human-led launch material; no outreach or posts are automatically sent.

Future production updates use `node scripts/deploy-release.mjs` from a clean committed checkout. It builds and validates both variants, checks identical election data, verifies every staged file, preserves previous release pointers, publishes voteranomaly.com and the CAS-TX mount, and verifies their public assets. Local SSH configuration remains ignored. See [DEPLOYMENT.md](DEPLOYMENT.md).


### Winning candidates and reported leaders

`/winners/` lists reconciled statewide Senate/Governor, full House-district and presidential state popular-vote leaders for imported years 2006–2026. It defaults to 2026, ordered by office, state name and numeric district, with party/state/search filters and margin/share/name sorting. Provisional vote leads are not race calls. Ties, missing candidate counts, conditional outcomes and source holds remain unavailable; county portions never substitute for a complete race. `scripts/build-winners.mjs` regenerates the per-year directory from the same source precedence as the map; `verify-winners.mjs` and deterministic output checks protect these rules.

The default 2026 candidate directory is also rendered into initial HTML from the same qualified JSON used by the interactive filters. All qualified reported leaders, provisional labels, source dates/links and the held-count notice are readable without JavaScript. Both deployment mounts identify voteranomaly.com as canonical. `verify-winners-prerender.mjs` and `verify-seo-canonicals.mjs` check content/source parity, escaping and both mount paths.


The November 7 congressional research expansion qualifies complete House countywide scopes in Minnesota, Ohio, South Dakota, Virginia, Wyoming, Idaho and West Virginia in addition to the original Arizona/Montana proofs. Source-pinned inventories now cover 654 county identities across 11 states; 645 pass at least one numerical screen. Each year’s actual district portions are summed independently; this is not a matched-seat or matched-candidate study. South Dakota’s absent2022Democratic nominee, changing district composition, source write-in controls and minimum-count holds remain explicit. Kentucky’s120current House county returns are imported but its historical comparison remains held: the existing imported2022baseline reconciles only5of17FECcontrols.

Senate source work adds controlled current returns for New Mexico, Wyoming, West Virginia, Oregon and Kentucky, plus independently qualified Idaho/Oregon historical sources. The dated November 7 audit screens 1,405 Senate counties (1,136 party-count comparisons) and flags 1,097 county/office cases; House screens 645 counties (564 party-count comparisons) and flags 197. These are numerical review signals, not completed source investigations. The public research-progress panel, state-by-state coverage page and `public/data/research-progress-2026.json` separate jurisdiction applicability, each screen’s coverage, source-context cases and the unresolved review queue. Source context remains six cases/eight items, with no verified county-office wrongdoing finding. Nothing here asserts nationwide completion.

Louisiana2026House imports are labeled general despite the official November3open-primary calendar. A scoped hold preserves the raw records while withholding unqualified general-election leaders/comparisons; Senate is unaffected. Earlier county source reviews retain their exact old numerical assessments in a separately hashed archive, so later data imports do not silently change the evidence originally reviewed. Current source times, unknown timestamps and provisional/counting limits are preserved. Original research snapshots and approval receipts remain ignored; new importer scripts accept only exact reviewed input hashes. No paid provider calls or recurring schedule were started by this research pass.


The second November 7 pass adds California and Utah House scope: all 58/29 counties with independently complete 130→144 and 36→32 district-portion inventories. Official source controls qualify the counts without implying identical candidates or district composition. Georgia’s 159 counties and Louisiana’s 64 parishes use separately reviewed, exact source/date/seat/vector contracts for the first November Senate ballot in 2020 and 2026. Georgia’s later runoff is excluded; Louisiana’s 15-to-2 candidate-field and nomination-system change is a major interpretation limit. These Senate current vectors reconcile an existing registered snapshot; no new direct primary refresh is claimed. Source-stage labels are preserved.

Nationwide completion is still unavailable: 2,496 House and 1,066 Senate reference units within the election scope lack an eligible comparison. Missing imports, unqualified historical sources, minimum-count holds and geography/round limits remain explicit. Texas needs qualified replacement historical vectors; Kentucky House keeps its unresolved baseline hold; Florida/Ohio special Senate seats require separately reviewed 2022-to-2026 special-seat contracts. The public [state-by-state progress table](https://voteranomaly.com/coverage/#congress-review-progress) and machine-readable work inventory identify the remaining numerical and source-review gaps. Published context is still one House and two Senate cases, with zero completed investigations; flags do not establish wrongdoing.
