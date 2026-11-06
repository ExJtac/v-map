# V-Map historical and current election data

V-Map serves local source-backed election history and dated current-result snapshots. The working window is 2006–2026. Historical and current records preserve source versions, original vote counts, review flags, and reporting geography. **2026 returns are provisional snapshots with source update times, not a live feed or a claim of certified outcomes.**

The generated [coverage report](COVERAGE-REPORT.md) is the current inventory by office and year. Some county data remain missing or incompatible; a missing return is not zero votes or proof that no election occurred. All browser data requests go to this local project. No paid election-data service or inference API is used.

## Source collections

| Collection | Scope | Source notes |
| --- | --- | --- |
| Original base | State, district, and presidential county returns, 2006–2024 | Details below |
| Early counties | House/Senate cycles 2006–2014; Governor 2006–2015 and recall/special records | [Early sources](EARLY-COUNTY-SOURCES.md) |
| Modern counties | House/Senate/Governor 2016 onward; provisional 2026 snapshots and selected specials | [Modern sources](MODERN-COUNTY-SOURCES.md) |
| 2018 county archive | County Senate/Governor and House district portions | [2018 sources](COUNTY-DATA-SOURCES.md) |
| Off-cycle Governors | Official 2021, 2023, and 2025 county results | [Off-cycle sources](OFFCYCLE-GOVERNOR-SOURCES.md) |
| California recall | Separate 2021 recall question and conditional replacement ballot | [Recall sources](CALIFORNIA-RECALL-SOURCES.md) |
| Hawaii official | Certified-index county reports 2006–2024, with reconciliation holds | [Hawaii sources](STATE-OFFICIAL-SOURCES.md) |
| Presidential repairs | Verified Kalawao/Maui separation and Oglala code changes | [Presidential sources](PRESIDENTIAL-COUNTY-SOURCES.md) |
| House repairs | Direct district-identity recovery, Iowa subtotal correction, NJ2022 and VA2026 | [House research](HOUSE-COUNTY-RESEARCH.md) |
| Current California | Direct 2026 Secretary of State county/district JSON feeds | [California current sources](CURRENT-CALIFORNIA-SOURCES.md) |

## Original base dataset

### Original base coverage

| Office | Election years | Geography | Source |
| --- | --- | --- | --- |
| President | 2008, 2012, 2016, 2020, 2024 | 51 state/DC results each cycle and actual county returns | MEDSL state and county datasets |
| U.S. Senate | 2006–2024 even years; 2021 Georgia runoffs | Statewide contests | MEDSL Senate dataset |
| U.S. House | 2006–2024 even years | Congressional districts | MEDSL House dataset |
| Governor | Every calendar year 2006–2024; only states holding covered elections | Statewide contests | FiveThirtyEight results archive, with original source links retained |

The 45 base files contain 20,786 geographic contest results and 69,856 candidate entries and 766 separately retained reporting-category entries. The 2024 presidential file has 3,112 county records and 51 independent statewide records; Senate has 35 statewide contests, House has 436 district contests (including specials), and Governor has 11 statewide contests. These numbers describe loaded coverage; they are not a promise that all historical special elections are present.

The runtime also loads three separately verified **2018 county supplements**: 2,046 Senate county/contest records, 3,552 House county–district intersections, and 2,134 Governor county records. These add 7,732 geographic results and 34,292 candidate entries with source-specific exclusions and review flags. See [COUNTY-DATA-SOURCES.md](COUNTY-DATA-SOURCES.md) for the Pettigrew/Census sources, exact coverage, and validation. This is the retained 2018 collection; the newer early/modern and targeted collections listed above expand other years.

## Sources and exact snapshots

- [MEDSL County Presidential Election Returns 2000–2024](https://doi.org/10.7910/DVN/VOQCHQ), Dataverse V20, CC0. Direct Dataverse file download required a guestbook response, so this import uses the [Election Data mirror](https://electiondata.dev/datasets/county-president/), pinned to `2026-10-26.a942e8daa5`. This mirror normalizes voting modes; its `from_modes` column remains in the raw snapshot. It does not turn Alaska election districts into counties.
- [MEDSL U.S. President 1976–2024](https://doi.org/10.7910/DVN/42MVDX), Dataverse V10, direct file `13887042`, CC0. State totals are independent source totals, **not** sums of whatever county records happen to map.
- [MEDSL U.S. Senate statewide 1976–2024](https://doi.org/10.7910/DVN/PEJ5QU), direct file `13887039`, CC0.
- [MEDSL U.S. House 1976–2024](https://doi.org/10.7910/DVN/IG0UN2), Dataverse V15, CC0. Direct download also required a guestbook response; import uses the [Election Data mirror](https://electiondata.dev/datasets/house-results/), pinned to `2026-10-26.cc2e247a45`.
- [FiveThirtyEight election-results archive](https://github.com/fivethirtyeight/election-results), `election_results_gubernatorial.csv`, pinned Git commit `d7a7cff101da28f4ff77114450a964874800ca54`. Its rows name their original results sources, commonly state election authorities. Those links are retained in each contest's `sourceLinks`. The repository does not state a standalone data license; this snapshot retains attribution and does not assert CC0 for this file.
- [FEC official 2024 presidential general-election report](https://www.fec.gov/resources/cms-content/documents/2024presgeresults.pdf), sourced from state election offices, used to spot-check California's Harris (9,276,179) and Trump (6,081,697) totals. This check does not independently certify every row.

The full raw downloads, mirror catalog, SHA-256 values, URLs and source versions are retained under `scripts/source-data/`. Browser JSON contains the same source metadata. Raw files include earlier years; the browser extracts only 2006–2024.

## Geography and interpretation

In the 45 base files, county returns are loaded **only for President**. Base Senate and Governor returns are statewide; base House results are district-level. Those larger-geography totals are never assigned to county polygons. The separate 2018 supplements provide actual county Senate/Governor returns and House county–district portions where documented. Each House card explicitly identifies its county portion and congressional district. Historical district geometries are not included, and separate district contests are never combined into a fabricated whole-county race.

Alaska's presidential source uses election districts with no county FIPS. Those 787 candidate rows across loaded cycles are excluded from county maps and retained in raw data. Alaska statewide presidential results are available. Connecticut uses historical counties; the 2023 Census planning-region county equivalents do not match those historical FIPS. County renames, independent cities and other boundary changes can also cause unmatched polygons; missing joins must remain visibly missing.

General, special, runoff, first-round, jungle-primary and recall contests remain distinct. The `special` flag and `stage` must be respected: for example, California's 2024 full-term and partial-term Senate elections are two separate contests. MEDSL's Georgia Senate `pre` stage is preserved as `first round`, not silently discarded as a party primary. Louisiana Governor jungle primaries and runoffs are retained separately. No totals from separate stages/seats should be added to create a single winner.

Candidate ballot lines with the same case-insensitive candidate name within a geographic contest are summed (fusion voting). Names are otherwise retained as supplied. `party` is normalized to `Democrat`, `Republican` or `Other`; `partyOriginal` retains source ballot-party labels. Republican/Democrat classification takes precedence over a minor-party fusion line.

## Source limitations retained in the data

- 35 candidate counts are missing: 4 presidential county entries and 31 House entries. They remain `votes: null` with `missingVoteCount` and `incomplete` flags. Missing does not mean zero.
- 129 presidential geographic records and 30 House records have a source total different from the sum of listed candidate votes; `voteTotalMismatch` and `candidateVoteSum` preserve that fact. This may reflect omitted/write-in categories or a source inconsistency; it is not silently repaired. Reported `totalVotes` remains the denominator.
- Five House districts in Georgia in 2018 have inconsistent source totals across ballot rows. The maximum reported total is retained, marked `sourceTotalConflict`; the candidate sum matches that maximum. Raw values remain available.
- 9 Senate and 16 House geographic contests carry the source's `unofficial` flag. A historical research dataset is not a certification authority, and the app should not label all these returns certified.
- Governor totals are sums of archived candidate rows (marked `totalVotesBasis`); the import does not independently verify each state canvass. Ranked-choice rounds are retained when supplied. The archive is not a guaranteed exhaustive inventory of recalls, specials or every off-cycle election.
- This original base contains no 2026 results. The newer current collections provide explicitly unofficial snapshots; certification and race calls are not inferred from vote leads or precinct reporting.

## Rebuilding and verifying

Run from the project directory:

```sh
python3 scripts/import-elections.py
python3 scripts/extend-county-elections.py
python3 scripts/verify-elections.py
node scripts/verify-election-summary.mjs
node scripts/verify-election-integration.mjs
```

The first command rebuilds deterministically from the saved raw snapshots. `--download` fetches the pinned URLs again; retaining the existing raw snapshots is recommended for offline reproducibility. Source files on Dataverse are addressed by immutable file ID, mirror exports by version and the Governor file by commit.

Validation checks every record for valid nonnegative integer counts (or explicit missingness), source hashes, FIPS formatting, geography separation, unique contest identities, source sum discrepancy flags, all 51 state/DC presidential results in each cycle, the California 2024 FEC spot-check and the concurrent California Senate contest distinction. It passes for all 45 browser data files. No statistical inference, estimated county result or mock vote count is present.

## Browser contract

`src/election-data.js` exports `OFFICE_LABELS`, `loadManifest()`, `loadElection(office, year)`, `summarizeRace(result)` and `selectResults(data, filters)`. Offices are `president`, `senate`, `house`, `governor`. Missing office/year coverage resolves to `null`; HTTP/network errors remain visible errors. `manifest.coverage` gives available years and geographic levels.

Each dataset has `office`, `year`, `sources` and `results`. Each result has `geoLevel`, `stateFips`, `contestId`, `stage`, `special`, `candidates` and `totalVotes`. County results additionally have `countyFips` and `county`; district results have `district`. Each candidate has `name`, normalized `party`, `partyOriginal` and `votes`. Optional quality flags above must remain visible in presentation. `summarizeRace()` excludes null candidate counts and reports ties and known incompleteness; it never merges separate contests.


## Reviewed reporting semantics and stage corrections

Ballot-reporting labels are separated from candidacies in `reportingCategories`, with their original names/counts and a `category` classification. This includes blank, void, spoiled, overvote, undervote, exhausted-ballot, mixed blank/void/scattering and unattributed write-in categories. Exact whole-label matching preserves real candidates such as Don Blankenship and Eric Blankenburg. The source's `totalVotes` is retained; category-bearing records explain that percentages use the reported source total, which may include invalid/blank ballot categories. The 69,856 candidate entries plus 766 reporting-category entries conserve all 70,622 previously imported entries. No counts were deleted or changed.

Three source-semantic records have `sourceNeedsReview: true` and explanatory `reviewReasons`. The summary API returns null winner, party, share and margin for them:

- **Maine 2022 House District 2:** source `EXHAUSTED BALLOT` reports 322,778, alongside a total of 656,104. This suspicious RCV entry is retained separately; no corrected round or total is invented.
- **Maine 2024 House District 2:** source `EXHAUSTED BALLOTS` reports 11,340, alongside a total of 402,936. Candidate-round/denominator interpretation remains unverified.
- **Louisiana 2014 Senate:** source labels one `gen` contest with 3,523,183 votes, Cassidy 1,712,379 and Landrieu 1,561,210. These appear to combine rounds; they remain source values requiring review, with no synthetic split or derived winner metrics.

Two bounded stage corrections retain the exact raw `sourceStage` and an object `sourceStageOverride` containing the reason, effective date and primary-source URL:

| Contest | Source stage | Effective stage | Primary evidence |
| --- | --- | --- | --- |
| Georgia 2008 Senate, 2,137,956 votes | gen | runoff, December 2 | [House Clerk official statistics](https://clerk.house.gov/member_info/electionInfo/2008/2008Stat.htm): Chambliss 1,228,033 / Martin 909,923 |
| Mississippi 2018 special Senate, 907,588 votes | gen | runoff, November 27 | [Mississippi certified general-runoff report](https://sos.ms.gov/elections/electionresults/2018GeneralRunoff/Certified%20Results/United%20States%20Senate%20Special.pdf): Hyde-Smith 486,769 / Espy 420,819 |

Georgia's 2008 first round remains independently present. Mississippi's 2018 special first round is absent from this source snapshot and is **not** invented. Georgia 2020 general contests and their 2021 runoffs remain separate files; Georgia 2022 general/runoff remain separate contests. Louisiana 2016 source contains only a large-field first-stage record; no runoff is synthesized. This is a bounded source-stage audit rather than independent verification of every stage in all 45 files.
