# Modern county election supplements and 2026 status

The importer writes only `/data/modern-counties/` and its owned raw-source directory. Original `/data/elections/` and reviewed `/data/county-elections/` records are preserved. Missing counties, districts, rounds and offices remain missing; no state/district total is allocated to county polygons.

This supplement contains historical 2016–2024 county results and a **separately dated, unofficial 2026 snapshot**. It does not claim complete national county coverage or certification. The importer uses saved free public files without keys, accounts, paid APIs or form submissions.

## Sources

### Historical House/Senate

[Paul Heideman, *U.S. county-level election results: President, U.S. House and U.S. Senate, 1990–2024*, v1.0.0](https://doi.org/10.5281/zenodo.22976553), [pinned public release ZIP](https://github.com/pmheideman/us-county-election-results/releases/download/v1.0.0/us_county_election_results_v1.0.0.zip), SHA-256 `e422fbfb1c56bed6787d08e59eed83d13b4ccf567510c69f94d2802a34b8e625`.

The import reads candidate/party-line rows in `us_county_results_long.csv`, **not** the county summary that combines different House districts. It imports absent county coverage in 2016/2018/2020/2022/2024; 2024 Senate instead uses direct MEDSL county returns below. Existing 2018 county results take precedence; only absent counties/districts are added. Presidential rows only qualify when the original Presidential county file lacks that county; no duplicate Presidential files are produced where nothing is added.

The archive's internal SHA-256 manifest is checked. Its `SOURCES.csv`, data dictionary, corrections log, modern gap inventory and no-ballot inventory remain saved locally. Browser sources retain each source token's publisher, document, locator, transcription method, rights statement and correction references. The modern House/Senate source records describe MEDSL precinct aggregation or explicit state election-office records; their descriptions do not claim population or crosswalk allocation. All imported modern vote counts are integers. This does not independently certify each upstream canvass.

The release is CC BY 4.0 for the researcher's work. Its documentation explicitly says underlying publishers' rights vary and are not overridden by that release license. Candidate-name completions and known source limitations remain attributed. No blanket CC0 claim is made for this archive.

### Direct 2024 Senate county data

[MEDSL 2024 Senate county returns](https://github.com/MEDSL/2024-elections-official/blob/df531089c78e6d0098db1a6bfb3849a066a06995/2024-senate-county.csv), commit `df531089c78e6d0098db1a6bfb3849a066a06995`. These rows include regular and special contests separately, including concurrent California and Nebraska elections. `totalvotes`, `special`, `unofficial`, party labels, source version and source total discrepancies are retained. Hawaii is left to the separately owned direct-state import; unresolved reporting-unit FIPS are excluded.

### Governor 2016–2020

[Algara and Amlani county election returns](https://doi.org/10.7910/DVN/DGUMFI), Harvard Dataverse **V1.1**, [Rdata file 5028535](https://dataverse.harvard.edu/api/access/datafile/5028535), CC0. The original Rdata, Dataverse metadata and losslessly decoded CSV are saved. The decoded CSV was supplied by the parallel historical-data assignment after reading the election frame with the `rdata` Python package; its hash is retained separately from the original Rdata hash.

Actual candidate names and Democratic/Republican vote fields are used. The source itemizes only those nominees. `raw_county_vote_totals - Democratic votes - Republican votes` is retained as an **unitemized other-candidate reporting category**, never a fictional named candidate. Missing or inconsistent totals are held. An unitemized category that could exceed the named leader forces review. Louisiana 2019 is the Edwards/Rispone **runoff**, despite the source's generic `G` election type. Hawaii is imported separately. For 2018 only missing Arizona county coverage is added; previously reviewed county results remain unchanged.

### Governor 2022 and 2024

[MEDSL 2022 official precinct-return repository](https://github.com/MEDSL/2022-elections-official/tree/a8126c5790b8d1f438a3e63c3506cdcdc7406d9f), commit `a8126c5790b8d1f438a3e63c3506cdcdc7406d9f`, and [MEDSL 2024 repository](https://github.com/MEDSL/2024-elections-official/tree/df531089c78e6d0098db1a6bfb3849a066a06995), commit `df531089c78e6d0098db1a6bfb3849a066a06995`. State ZIP files, codebooks and readmes are saved with exact hashes and pinned download URLs. Their readmes link the original state election authorities and identify source limitations.

Only `GOVERNOR` and explicit combined Governor/Lieutenant Governor contests are used; the Lieutenant Governor's separate office is excluded. Aggregation uses explicit county FIPS and preserves jurisdiction, precinct, candidate, party line, stage, special flag and source date. Within that exact key, `TOTAL` mode takes precedence over disaggregated modes. Otherwise the supplied mode rows are summed once. Repeated candidate/unit/mode keys remain review flags, not silently deduplicated. No source `TOTAL` row is added to its component modes.

The 2022 Tennessee state file contains **no Governor rows**. Its gap is filled using [OpenElections' pinned 2022 Tennessee county file](https://github.com/openelections/openelections-data-tn/blob/4cb8cc5d0bb74b45dc05ad03c80c41b246301c1c/2022/20221108__tn__general__county.csv), with exact county names independently checked against Census county names.

### Geography

County FIPS and state pairs are checked against the [Census 2018 Gazetteer](https://www.census.gov/geographies/reference-files/time-series/geo/gazetteer-files.2018.html) and [Census 2024 Gazetteer](https://www.census.gov/geographies/reference-files/time-series/geo/gazetteer-files.2024.html), both retained as original ZIP snapshots. The union permits historical Connecticut counties alongside current planning regions; no historic-to-current boundary allocation is invented.

The Heideman source retains historical Shannon County FIPS `46113` with the modern Oglala Lakota name. This is normalized explicitly to `46102`, retaining `sourceCountyFips` and the normalization explanation. [Census county changes](https://www.census.gov/programs-surveys/geography/technical-documentation/county-changes.2010.html) document the 2015 change.

## 2026 current results and status

The public [Pushbuild official-source snapshot](https://github.com/pushbuild/us-2026-election-results/tree/73b20975fc0a66da90688d372b4c619609fee9cb), commit `73b20975fc0a66da90688d372b4c619609fee9cb`, states **November 6, 2026, 10:02 AM ET**. Its freely downloadable CSV files are CC0 and cite each election office/feed. The optional API and signup service were not used. Raw CSVs, README, Git tree, exact hashes and per-contest official source URLs are saved.

This is an automated research mirror, not a certification authority. Every imported row retains the original official URL/publisher, `sourceUpdatedAt` where supplied, `fetchedAt`, `retrievedAt`, source contest name and snapshot label. `asOfBasis` distinguishes an actual source count timestamp from retrieval time. Mixed local formats in source timestamps are retained verbatim rather than assigned an invented timezone. Per-office manifest coverage records the oldest/latest retrieval times; that range is not described as a simultaneous live nationwide count.

All 2026 results have `unofficial: true`, `provisional: true`, `resultStatus: "unofficial"`, `countingStatus: "counting"` and `finalWinnerNotDeclared: true`. A numerical leader is **not** an election call or certification. Only source-provided precinct counts are retained; no vote-completion percentage is inferred from them. Preliminary status alone does not trigger a separate data-quality hold.

The importer rejects Wikipedia candidate-list placeholders, missing vote counts, non-HTTPS/missing source URLs, unresolved House district identities, ambiguous county/city names and noncounty reporting units. Connecticut and Rhode Island feed `county` rows actually represent towns/cities, so they are excluded rather than mistaken for same-named counties. Alaska electoral districts are excluded. Virginia mirror rows cite a Utah-host URL and remain excluded. Direct Virginia Senate data is now imported from the correct official host as described below; no mirrored URL was silently relabeled. Federal office classification uses explicit U.S./United States/Congress titles; North Carolina state House races, university regents, state education boards and university governors are excluded. New Jersey's explicit House/Congressional District titles remain eligible.

### Direct Florida refresh

The [Florida Division of Elections' official November 3 download](https://flelectionfiles.floridados.gov/enightfilespublic/20261103_ElecResultsFL.txt) was retrieved directly at **2026-11-06 18:04:16 UTC**, with exact bytes, hash and response headers retained. It supersedes mirrored Florida rows. The download does not provide a source-wide count timestamp, so its `asOf` is explicitly a **retrieval time**, not an invented official update time.

Its Governor and Senate returns cover **all 67 counties**. State summaries explicitly sum all 67 official county rows and are marked as geographic aggregations, not independent statewide source records. House district summaries sum the official county–district parts. **House District 10 is absent from this feed**; no zero votes, unopposed status or winner is inferred. The Senate contest is the special election for the term ending January 2029 (next regular election in 2028); Ohio's Senate vacancy election is likewise special. [Ohio's official writ](https://www.ohiosos.gov/assets/writ-of-election-us-senate-may-2026.pdf) expressly identifies its November 3 special election.

### Direct Virginia Senate refresh

The [Virginia Department of Elections' official public API](https://enr.elections.virginia.gov/results/public/api/elections/virginia/2026-November-General/data/ballot-item/01000000-f030-c43d-d69c-08df1fee529a) supplies the actual statewide Senate contest plus all **133 counties and independent cities**. Its snapshot explicitly records `isOfficialResults: false` and source `asOf: 2026-11-06T18:16:59.2813512Z`; retrieval was `2026-11-06T18:19:06.440580+00:00`. No certification is inferred.

Each official locality carries its three-digit `mapFeatureId` county suffix. The importer joins `51` plus that explicit identifier to Census county FIPS and checks that all 133 Virginia county equivalents appear exactly once. Each county's candidate sum equals its reported `voteTotal`; summing each candidate across all 133 county equivalents exactly matches the independently published statewide candidate count and statewide **3,570,562** votes. Vote-method subtotals are not added to their parent candidate totals. The snapshot adds **134 geographic results and 402 candidate entries**, with all source dates, the official host and preliminary status retained.

### Montana and South Dakota official refresh

[Montana's official statewide export](https://electionresults.mt.gov/ResultsExport.aspx) was downloaded through the page's observed public **Statewide Export** action. Its Senate worksheet gives **all 56 counties and an independent TOTALS row**. Each of four candidate columns sums exactly to the state row: Kurt Alme **232,916**, Seth Bodnar **181,674**, Alani Bankhead **58,555**, Kyle Austin **8,869** (482,014 reported candidate votes). The official source page declares its update **November 6, 2026, 12:15:25 PM MT**; the workbook separately records its download stamp. Census joins normalize punctuation and the explicit `&`/`and` spelling in Lewis and Clark; all 56 county FIPS are independently verified.

Montana explicitly **does not publish write-in totals on this site**. `sourceOmittedWriteIns`, `sourceLimitations`, `totalVotesBasis` and `percentageDenominatorBasis` retain that omission. The four-candidate sum is not presented as ballots cast or a certified complete total. Bodnar remains Independent/Other, matching his actual published party label.

[South Dakota's official results site](https://electionresults.sd.gov/) exposes its linked public county-map service. Senate race **14412**, office **110**, and Governor race **14896**, office **205**, each provide **all 66 counties**. Their county candidate sums exactly reconcile by **CandidateID** to the independently exported statewide CSV shared read-only by the House researcher: Senate Mike Rounds **184,589**, Brian Bengs **120,512**; Governor Larry Rhoden/Tony Venhuizen **193,334**, Dan Ahlers/Steven McCleerey **111,303**. Bengs remains Independent/Other. The official source's county ID is preserved as `sourceCountyId` and is **not treated as FIPS**; unique Census county-name joins supply verified FIPS.

South Dakota's official page explicitly reports **November 6, 2026, 1:15 PM CT**. The CSV's separate `CurrentDateTime` string lacks a timezone and is retained verbatim without guessing one. County reporting counts sum to the source's statewide 671/671 precincts; they are not converted to a vote-completion percentage or certification. Older mirrored South Dakota Senate/Governor state rows are superseded by this direct-source snapshot while original source evidence remains retained.

These two coordinated imports add **188 county results and one new Montana statewide result**, and refresh two South Dakota statewide results (net **189** geographic records). All remain unofficial/provisional, with no election calls imported. The bounded Kentucky and Tennessee official-page probes returned HTTP403; no access bypass or additional state-sprawl followed.

## Preserved limits and review flags

- House records are county–district intersections, with election-year district identifiers checked against the independently sourced baseline district inventory. At-large `00` becomes canonical `0`. Unknown district fields are excluded.
- The Heideman release excludes specials and most non-November rounds. Georgia **2020 Senate is the November first round**. Georgia **2022 Senate is the December 6 runoff**: 159 counties sum to Warnock **1,820,633**, Walker **1,721,244**, matching the [official runoff contest](https://results.sos.ga.gov/results/public/Georgia/elections/2022DecGenRun). Its original `sourceStage: "runoff"` remains intact. Louisiana Senate November first rounds are not labeled final runoffs. Maine 2024 House district 2 first-choice totals require ranked-choice review.
- **New Jersey 2022 House is excluded entirely**: the source corrections log says district-wide totals were repeated under county labels. Other unresolved source issues remain explicit review reasons, including missing/abbreviated candidate names, suspect counts, Missouri's unallocated Kansas City bucket and remaining upstream outliers. Source flags are not erased merely because transformation checks pass.
- The modern archive's no-ballot/gap inventories remain separate evidence. No-ballot county intersections derived from boundaries are not converted to zero-vote results.
- MEDSL 2022 Arkansas omits Phillips County. Nevada privacy-suppressed values remain `votes: null`, with known partial sums in `knownVoteSum`; they never become zero. Indiana 2024 source notes warn that straight-party inclusion can overstate Governor/Senate counts. Missouri 2024 synthetic Kansas City FIPS is excluded and affected county results are flagged.
- Actual ballot party text controls map classification. `partyOriginal` and Heideman's analytical `sourcePartyGroup(s)` remain separate. Independents such as Sanders, King and McMullin are not classified Democratic merely because an analytical grouping uses `DEM`. Democratic fusion labels in either order are recognized; both-major-party conflicts force review.
- Ballot accounting labels, blank-write-in labels and unitemized other candidates are separate `reportingCategories`. Redundant contest-total observations are retained but not added again to candidate sums.
- Remaining 2026 coverage is partial and timestamped. No 2026 Presidential election is invented. Separate office/state supplements owned by other assignments may add authoritative coverage with explicit precedence.

## Rebuild and verification

```sh
python3 scripts/import-modern-counties.py
```

Offline rebuilding verifies every pinned source hash in `scripts/source-data/modern-counties/snapshots.json`. `--download` can re-fetch pinned URLs; any changed bytes are rejected until provenance is deliberately reviewed. Original data files are only read. Exact transformed data and quality flags are written to the modern supplement directory.

`validation.json` records actual counts and checks: nonnegative integer votes/explicit missingness, Census FIPS/state validation, exact accepted source candidate identities and known vote sums, mode selection accounting, distinct county/district/stage/special contests, original-source preservation, and the Georgia runoff/fusion-party regressions. Fifteen actual-source office-title fixtures also verified positive federal titles and excluded state/university offices before the final import. These checks establish faithful transformation; they do not independently certify every source count or erase documented gaps.

## Alabama 2017 certified special election

The [Alabama State Canvassing Board's official December 28, 2017 canvass](https://www.sos.alabama.gov/sites/default/files/voter-pdfs/2017%20Official%20General%20Election%20Results%20with%20Write-In%20Appendix%20-%202017-12-28.pdf) supplies **all 67 counties plus an independent statewide total** for the December 12 Senate special general election. Both relevant table pages were rendered and visually checked; the original PDF and pinned Poppler text extraction are retained. County names are joined only through unique normalized Census Alabama county names.

All 67 county sums exactly match the printed certified statewide columns: **Doug Jones 673,896; Roy Moore 651,972; aggregate write-ins 22,852** (total 1,348,720). The result is `special: true`, `stage: "general"`, with `certified: true`, `resultStatus: "certified"` and `certificationDate: "2017-12-28"`. Write-in totals remain a separate aggregate reporting category; named entries from the PDF's write-in appendix are not added again.

The available OpenElections precinct file was checked but **not used** for this import because its aggregate figures differ from the certified table (Jones 673,352; Moore 650,940; write-ins 21,464). The primary certified county table takes precedence without modifying any existing dataset. This creates the genuinely held 2017 Senate voting year in the supplemental manifest. Massachusetts 2010 was not broadened into this bounded assignment.

## Senate research gap inventory

The [Senate's Class II roster](https://www.senate.gov/senators/Class_II.htm) plus the Florida/Ohio vacancy elections identifies 35 states with 2026 Senate elections. This modern snapshot has validated county and/or statewide returns for **25** of those states. No validated snapshot is currently imported for **IL, KY, MA, ME, MS, NH, OR, TN, WV, WY**; this is a local coverage statement, not a claim that those states have published no results. Several covered states have state totals only or partial county coverage. The exact per-state inventory is saved in `senate-research-gaps.json`.

Additional historical leads were checked without claiming unverified complete totals: OpenElections' Georgia January 5, 2021 runoff precinct file contains **155 of 159 counties**; its Arizona 2020 special-election file contains **13 of 15**. These reported precinct sums are now exported as **review-held partial county counts**, with no independent completeness claim for available counties. The four absent Georgia counties are Camden, Chattooga, Grady and Greene; Arizona is missing Pinal and Yuma. Both Georgia Senate contests remain distinct (`special: false/true`, `stage: "runoff"`); Arizona is `special: true`, general stage. Vote-mode components in the Georgia file are summed once; Arizona's supplied `votes` column is used without adding its component columns. Exact county/precinct/office/candidate/party keys have no duplicates in these sources. Noncandidate over/under-votes, unqualified labels and write-in total labels remain separate categories. Arizona's official2020 PDF and Georgia's legacy Clarity endpoints returned403 during this check. The Heideman release itself omits Arizona2020/Georgia2020 specials and Oklahoma2022 special county returns; the separate Arizona2020 and Georgia2021 imports above add the available reported precinct counts, all held for review; it does not claim exhaustive historical special-election coverage. No missing votes or counties were filled by state-total allocation.

## Actual exported coverage

| Office | Year | Geographic records | States | Candidate entries |
| --- | ---: | ---: | ---: | ---: |
| Governor | 2016 | 602 | 12 | 1,204 |
| Governor | 2017 | 154 | 2 | 308 |
| Governor | 2018 | 15 | 1 | 30 |
| Governor | 2019 | 266 | 3 | 532 |
| Governor | 2020 | 566 | 11 | 1,132 |
| Governor | 2022 | 2,144 | 34 | 10,976 |
| Governor | 2024 | 564 | 11 | 2,601 |
| Governor | 2026 | 1,180 | 24 | 5,842 |
| House | 2016 | 5,010 | 48 | 14,296 |
| House | 2018 | 154 | 5 | 334 |
| House | 2020 | 4,192 | 48 | 11,769 |
| House | 2022 | 3,636 | 47 | 10,603 |
| House | 2024 | 4,898 | 48 | 13,117 |
| House | 2026 | 1,940 | 30 | 6,025 |
| Senate | 2016 | 2,054 | 32 | 10,317 |
| Senate | 2017 | 68 | 1 | 136 |
| Senate | 2020 | 2,300 | 33 | 10,532 |
| Senate | 2021 | 310 | 1 | 620 |
| Senate | 2022 | 2,051 | 32 | 10,552 |
| Senate | 2024 | 1,964 | 32 | 8,842 |
| Senate | 2026 | 1,432 | 25 | 6,171 |

Total: **35,500 geographic results and 125,939 candidate entries in 21 files**. Historical rows are county/county–district results, with an independent certified statewide Alabama2017 record. Review-held partial Arizona2020 and Georgia2021 results are included and explicitly qualified. Current2026 rows also include labeled state/district totals; see each manifest geoLevels. Exact counts and limitations are in `validation.json`.
