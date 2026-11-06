# Official off-cycle governor county imports

Snapshot: November 6, 2026. Rebuild offline with `python3 scripts/import-offcycle-governors.py` (Python standard library plus Poppler `pdftotext`). Sources, SHA-256 values, download timestamps and official-status evidence are in `scripts/source-data/offcycle-governors/provenance.json` and the browser manifest. The importer verifies every retained raw file hash before parsing.

| Year | State | County equivalents | State rows | Source/status |
|---|---|---:|---:|---|
| 2021 | NJ | 21 | 1 | State Division of Elections official general results PDF, 11/30/2021 |
| 2021 | VA | 133 | 1 | Department of Elections historical county/state CSV; all rows need review for the discrepancy below |
| 2023 | KY | 120 | 1 | State Board of Elections certification of general results PDF, governor pages 2–7 |
| 2023 | LA | 64 | 1 | Secretary of State portal race 63500, October 14 first round; election metadata `ResultsOfficial=1` |
| 2023 | MS | 82 | 1 | Secretary of State certified statewide recapitulation PDF, pages 2–9 |
| 2025 | NJ | 21 | 1 | State Division of Elections official general results PDF, 12/03/2025 |
| 2025 | VA | 133 | 1 | Department of Elections published API; `isOfficialResults=true`, as of 2025-12-01T18:15:08.0669878Z |

There are 574 county/county-equivalent rows and seven separate statewide rows. This package covers historical contests; current 2026 reporting is a separate integration and is not declared absent nationwide.

## Geography and vote conservation

The independent U.S. Census 2018 county Gazetteer validates every county FIPS and the complete state inventory. Virginia independent cities remain separate county equivalents. VA 2025 uses the official API `mapFeatureId` county code and independently checks the locality name. Other official county tables match exact normalized Census names after removing only county/parish suffixes and punctuation. Explicit source spelling aliases are Mississippi `Jeff Davis` → `Jefferson Davis` and Virginia `KING & QUEEN COUNTY` → `King and Queen County`; these are identity aliases, not spatial allocation. Louisiana's official portal parish ID/name list is retained in `la-parish-identities.js`; its parish numbers are not treated as FIPS.

The importer asserts full inventories (21 NJ, 133 VA, 120 KY, 64 LA, 82 MS), unique FIPS/contest pairs, integer nonnegative votes, candidate sums and candidate-by-candidate county/state source totals. Every listed source statewide total reconciles to that source's county entries. No larger geography total is copied to a county, and no absent vote cell is converted to zero. Kentucky's explicitly printed zero votes remain zeros. KY governor/lieutenant-governor tickets remain single candidate entries. NJ PDFs list only named ballot candidates; unlisted write-ins are not guessed. `totalVotes` is the sum of those listed entries, not ballots cast or turnout.

Louisiana remains `stage: "first round"`. All 15 listed candidates and 64 parishes are retained, including multiple candidates of the same party. No November runoff is invented.

## Virginia 2021 unresolved source discrepancy

The current official historical database's [contest 147466](https://historical.elections.virginia.gov/contest/147466) links to the retained `va-2021-historical-table.csv`. Its explicit county rows sum to its statewide row:

| Candidate | Historical table | Proposed certification abstract in official board agenda | Difference |
|---|---:|---:|---:|
| Youngkin | 1,663,158 | 1,663,596 | 438 |
| McAuliffe | 1,599,470 | 1,600,116 | 646 |
| Blanding | 23,107 | 23,125 | 18 |
| Write-ins | 2,592 | 2,593 | 1 |

The board agenda PDF is retained as diagnostic evidence. Its abstract is an unsigned proposed form, so this import does not represent that PDF as a signed certificate. Its figures also appear on the contemporary reported certified results, but no third-party figures are imported.

The separately retained official precinct CSV has 12,316 governor rows and totals 3,288,318, including 2,583 write-ins and 237 blank vote cells; those are further reasons to prefer the explicit historical county table. No precinct CSV counts are used in the published county dataset. All 134 VA 2021 published rows carry `sourceNeedsReview=true`, a quality flag and a reason; no certified-reconciliation success is claimed and no residual difference is allocated to any county.

## Checks actually run

- Offline importer: every raw-file SHA verified; 574 county rows, seven state rows, seven full county inventories; all source county/state candidate sums exact.
- JSON source references, integer/nonnegative votes, duplicate county FIPS and per-row sums checked by importer.
- MS first county-table page visually rendered and inspected: rotated county headers align with governor candidate columns. County names are parsed from the headers, not inferred from alphabetical positions.
- KY first governor county page visually rendered and inspected: three ticket columns match the source text and values. Poppler reports malformed Flate stream warnings in the supplied official PDF; governor pages still extract and render, and all 120 county rows reconcile exactly to printed candidate totals.
- NJ candidate page totals individually checked against all 21 county entries for every candidate in both years.
- LA official election-status metadata and all parish candidate sums checked; VA 2025 official status, 133 source locality IDs, county codes and candidate totals checked.

No network refresh occurs during an offline rebuild. Refreshing a snapshot requires deliberate source download and provenance revision. No credentials, paid services or accounts were used. UI integration and independent Proof review belong to the root task.
