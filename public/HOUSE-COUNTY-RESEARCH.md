# U.S. House county research — 2026-11-06

Display note for Vermont2026: the integrated county card excludes undefined `sv`/`bv` reporting fields from **Candidate / write-in votes** and labels the source-reported contest total separately. Raw source counts and categories remain intact; neither total is asserted as a count of voters.

Worker: `house_research`, requested dedicated House assignment; actual development model Sol, medium effort. Application/provider inference was not used. Work is confined to this report, `scripts/import-house-repairs.py`, `scripts/source-data/house-repairs/`, and `public/data/house-repairs/`.

## Delivered evidence

| Year | States | County-district records | Method |
|---|---|---:|---|
| 2006 | NV, WA | 69 | Original OpenElections source office/district labels, exact county/name/vote reconciliation |
| 2008 | NV | 19 | Original source office/district labels |
| 2010 | NV | 19 | Original source office/district labels |
| 2012 | IA | 99 | Full replacement from all 99 original precinct files; county subtotal rows excluded |
| 2014 | CO | 74 | Original source explicit district column |
| 2022 | NJ | 41 | Direct official county-district subtotal tables in all 12 NJ Division of Elections district PDFs |
| 2026 | SD | 66 | Direct South Dakota official county map API, checked against statewide candidate CSV |
| 2026 | MT | 57 | Primary statewide export district worksheets; all56counties, one split county |
| 2026 | VT | 14 | Actual reporting portions aggregated by exact official townId-to-county metadata |
| 2026 | VA | 145 | Direct Virginia Department of Elections API county/city breakdowns for all 11 congressional districts |

Virginia also supplies 11 separate district summaries. Its 145 county-district portions span all 133 county/city FIPS. These are actual portions, not allocations of a statewide result. Current feed records are explicitly unofficial, preserve source as-of timestamps and reporting status, and do not claim certification.

The manifest contains seven office-year files, 603 county-district records, and 27 district summaries. Source IDs all begin `house-repair-`. Historical records remain separate from current results. No Alaska county estimates, fabricated nonballot zeroes, or replacement of preexisting raw/user data occurred.

## Critical Iowa2012 finding and repair

The archive's 212 missing-district Iowa candidate rows combine real precincts with blank-precinct county subtotals. Assigning district identities and adding these archive values would double count votes. Allamakee illustrates this: source Braley county subtotal 3,271 equals the sum of actual precincts; simply combining the archive's labeled and unlabeled groups produces 6,542.

The delivered file replaces **all 99 Iowa2012 county records**, not only the 62 counties with missing district fields. The importer reads pinned original precinct files, excludes 630 blank-precinct subtotal rows after candidate-level comparisons with actual precinct sums, and holds 41 blank-vote source rows in the audit without converting them to zero. All 18 district candidate/write-in totals exactly match baseline district totals. Explicit name variants Braley/Bruce L Braley, Dave/David Loebsack and Leonard/Leonard L Boswell are used only in verification; original candidate names remain preserved.

Iowa missing district labels are recovered from exact full candidate identities occurring under unique district labels elsewhere in the same source. Every district has at least two independent exact candidate matches to the baseline contest. Reporting categories use the unique contest established by the actual precinct's named candidates and labels. Votes are never allocated geographically.

**Integration requirement:** `house-repair-*` must outrank `early-heideman` for the same semantic county/district/year/stage/special key. The Iowa file contains complete replacement candidate and reporting-category lists. Leave original files available as preserved evidence. The unchanged early manifest's old exclusion comments do not describe the new supplement.

## Checks actually run

`python3 scripts/import-house-repairs.py` completed successfully using saved snapshots. The final machine-readable receipt is `scripts/source-data/house-repairs/build-validation.json`.

- 600 archive candidate rows recovered through explicit original source district labels; 6,238,137 votes preserved exactly.
- 212 Iowa archive rows superseded by the raw precinct rebuild; 66 missing-district rows remain unresolved.
- All candidate/category sums equal each output record's total; nonnegative integer values; no duplicate named candidates in a record.
- 19 Washington2006 candidate county sums equal the source file's independently tabulated statewide candidate totals.
- All 18 Iowa2012 district candidate/write-in totals match the existing official-derived baseline (including all major/minor candidates and write-in aggregates).
- All 53 New Jersey2022 named-candidate district totals equal their official county sums and baseline district counts. All12districts and21counties are present.
- All 47 Virginia2026 district candidate/write-in totals equal the sums of their direct county/city breakdowns. All 11 districts are present.
- GitHub snapshots are pinned to commit-specific URLs with SHA256 hashes; direct Virginia API response files have SHA256 hashes and source timestamps.

The 11 historical source-gap entries and 218 no-ballot evidence entries are retained separately in `scripts/source-data/house-repairs/gap-inventory.json`. Upstream no-ballot geographic associations are evidence only; they do not create vote counts.

## Remaining bounded gaps and next-source plan

- IA2010: 60 candidate rows missing district2 labels. Three exact district2 candidate matches exist, but the fourth source name differs from the baseline. The next useful check is the original Iowa Secretary of State county/precinct canvass, with candidate totals reconciled to the district before importing.
- WA2012: six rows in King/Okanogan lack district labels, including generic write-ins. Named pairs identify district9/district4, but write-in geography requires the original precinct grouping; no broad write-in identity inference was applied.
- NJ2022: resolved in this supplement using all12primary official district PDFs. The old compiled-source hold remains preserved, while direct official county subtotals provide41county-district records covering all21counties. Every candidate county sum equals its official district total and existing baseline count (53checks).12official district summaries accompany the county records. Names and ballot labels are transcribed in original left-to-right PDF column order in `nj2022-headers.json`; numbers are parsed from native PDF text, not manually estimated.
- Other historical gaps, missing earlier rounds, and specials remain as cataloged. County presence is insufficient to assert all county-district portions exist.
- Virginia2026 is newly covered here. Other current2026 states retain the parent's existing official-feed/compiled-source inventory; California and Florida work was not duplicated. Ten Wikipedia placeholder files are not counted as actual results.

Source references: [Colorado2014 official abstract](https://www.sos.state.co.us/pubs/elections/Results/Abstract/pdf/2000-2099/2014AbstractBook.pdf), [Washington historical official archive](https://www.sos.wa.gov/elections/data-research/election-data-and-maps/election-results-and-voters-pamphlets/washington-state-election-results-archive), [Virginia current official results](https://enr.elections.virginia.gov/results/public/virginia/elections/2026-November-General), [Heideman source release](https://doi.org/10.5281/zenodo.22976553). The Colorado official PDF request returned403 and was not represented as a downloaded verification; historical CO/NV underlying source status remains OpenElections compiled from state records, rather than a new primary certification claim.

New Jersey2022 primary-source addition: [official election archive](https://nj.gov/state/elections/election-information-2022.shtml). All12PDF downloads succeeded with an ordinary browser User-Agent. `nj2022-sources.json` pins source URLs; PDF/text/headerSHA256 hashes are in the manifest; `nj2022-validation.json` preserves every county-sum/district/baseline check. No compiled repeated district totals were reused. The district8seven-column page was rendered and visually inspected to verify column/header layout.


## Additional bounded current2026 recovery

The follow-up added137actual county-district records and4district summaries to `house-2026.json`, which now contains297records acrossVA/SD/MT/VT. Three new primary sources were used; California/Florida/Virginia fetches were not repeated.

- South Dakota:66county returns, exact county-name/FIPS join, two candidate totals reconcile to official statewide CSV using source candidate IDs. The source's internalCountyID is not mistaken for FIPS. Official county API: `GetMapData?type=SWR&category=CTY&raceID=14869&osn=120&county=0&party=0`. Source page update time explicitly saysCT; preserved original string and converted timestamp. Ambiguous CSVCurrentDateTime timezone is not inferred.
- Montana:57actual county-district portions across56counties and2districts. Scout's downloaded primary statewide XLSX was copied to the owned raw directory; House worksheets2/3 were parsed natively. Seven county-sum/candidate controls match sourceTOTALS. One explicit spelling join, Lewis&Clark to LewisandClark, is documented per affected record. Source count-update time is unavailable: `sourceUpdatedAt:null`; `asOf` is explicitly based on retrieval, and the original source download time is retained.
- Vermont:14county aggregates from283disjoint actual source reporting portions across247towns. Exact officialtownId joins to countyName are checked unique; no municipal guess or proportional allocation is used. The sourceSTATEWIDEtid0 row is excluded before aggregating. All74candidate/write-in sourceID sums equal the separate statewide row; all source record sums including reporting fields equal source`sc`. Named source write-in entries remain reporting categories, preserving names without asserting eligibility; abbreviated`sv`/`bv`fields remain verbatim reporting categories without guessed labels. Source update time is preserved and normalized usingVermont's localEastern timezone.

Every current record retains unofficial/provisional status and `asOf`; priorVirginia fields remain present. SHA256comparison confirms all six historicalHouseJSONfiles remain byte-for-byte unchanged. The final offline rebuild passed. New receipts and pinned hashes are in `additional2026-sources.json` and `additional2026-validation.json`.

Delaware's official current results landing page returned403during the bounded probe; it was not imported or represented as zero votes. Other2026gaps remain. SD Senate/Governor source discovery was shared withScout for independent integration; this worker changedHouseonly.
