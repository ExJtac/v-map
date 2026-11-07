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

## New isolated research batch — Arizona2022/2026 (frozen for review)

The new `research-house` bundle owns `scripts/import-research-house.py`, ignored `scripts/source-data/research-house/`, and `public/data/research-house/`. It does not modify prior imports or UI registration. Arizona adds30actual2026county-district portions coveringall15counties/all9districts, plus9district summaries. Its comparable2022primarybaseline contains the same30actualportions plus9summaries, replacing earlier partial/research-source values when the parent registers priority130.

2026source: the Arizona Secretary of State's [official Enhanced Voting export](https://app.enhancedvoting.com/cdn/results/Arizona/export-110326GeneralElection.json). All15localResults publications andall9Housecontests are present. All49candidateID county sums match the separately published official district summaries in that export. This is a same-authority publication control, not an independent authority certification. `createdAt`2026-11-06T21:13:20.2005274Z is retained separately from retrieval. All2026records remain unofficial/provisional, and complete published contest scope does not imply completed counting.

2022source: [Arizona certified statewide canvass](https://apps.azsos.gov/election/2022/General/canvass/2022dec05_general_election_canvass_web.pdf), House tables on pages1–2. Direct PDF download returned403including a normal browserUserAgent. The web extraction service could read the actual primary PDF; the verbatim returned text is saved as a JSON string with extraction metadata and SHA256. This is explicitly **not a hash of downloaded PDF bytes**. All26candidate county-row sums match the primary TOTALcolumn. Source dashes remain absent; actual printedzeroes remainzeroes. Named qualified write-ins preserve the primary ballot parties. This repairs earlier count and party omissions: SantaCruzAZ7primaryD8209/R4907 versus earlier6275/3787; AZ8/AZ9Democratic namedwrite-ins are preserved with their actual source parties.

Both years' exact30portion inventories hash to `7da0af2af5b7b0636aec3756b9b62c138d6a1e4c7ada2583065b28445e2eed81`. Scope proofs, all75candidate controls, source hashes, and normalized file hashes are in the manifest and ignored `validation.json`. All nonnegative integer sums, unique identities, exactFIPS joins, stages/general/non-special identities, and record totals passed the offline importer. Atlas/root independently review qualification and publish registration; this worker does not deploy or push.

The existing source constraints remain: source2026generic unassigned/unofficial write-ins are reporting categories rather than named people. Historical2022qualified namedwrite-ins are candidates. Candidate votes are not labeled ballots cast. New2026data for Oklahoma/Nevada is not inferred: direct probes were blocked/redirected and are not imported. The next bounded candidate is NewMexico's directly reachable official federal feed.

## NewMexico second batch — normalized staging only

At the parent's request, the reviewed Arizona public bundle remains frozen. Combined Arizona+NewMexico candidate files are staged only under ignored `scripts/source-data/research-house/nm-staging/`; no public Arizona files were rewritten. Reproduce using `python3 scripts/import-research-house.py --include-nm --output-dir scripts/source-data/research-house/nm-staging`.

NewMexico provides43explicitcounty-district portions acrossall33counties/all3districts in both2022and2026, plus3separate district summaries eachyear. The official[2022results archive](https://electionresults.sos.nm.gov/?eid=2838) is labeledOfficialResults; the[current2026federal page](https://electionresults.sos.nm.gov/resultsSW.aspx?type=FED&map=CTY) is unofficial. Actual county API records and independently published districtCSVcandidate totals are pinned with retrieval timestamps and SHA256 in `nm-sources.json`. The official site specifiesMT for update times; local source strings and normalized offsets are retained separately from retrieval. SourceCountyID is internal; exact county-name joins to existingFIPS are used instead.

The primary API suppresses small counts with`*`. They remain explicit `votes:null`, `totalVotes:null`, `missingVoteCount`, `incomplete`, and `sourceNeedsReview`, with the original`*` preserved. No district residual is allocated back to these rows.2022has20suppressedcandidatecells in19county-district records (24fullynumeric portions);2026hasone suppressed cell—GabrielVasquez,ChavesCounty,CD2—so42portions are fullynumeric andone held.2026Chaves has other congressional portions, but whole-county comparison must remain held until every portion qualifies.

TenNewMexico candidateID county-sum controls exactly equal the separate official districtCSV; four controls are explicitly withheld due to source suppression (three2022,one2026). They are not reported as passed. The exact43portion inventories match bothyears, SHA256`0e563803ae500ea7c1f91a21e658e4a7352ff6b207d3ff10d5482efa7d6d66cf`; complete published geometry does not establish numeric completeness or completed counting. The combined staging receipt includes75Arizona passed controls,10NewMexico passed controls,and4NewMexico source holds.

Staged primary2022rows with suppressed counts should not silently replace previously reviewed numeric baseline evidence: the parent/Atlas must review precedence and qualification before publishing them. The staging source holds make the limitations explicit. `validation-with-nm.json` preserves every candidate control and source-suppression status. No paid provider calls, other agents, deployments, or pushes were used by this worker.

### Arizona default-build reproducibility repair

The importer now emits NM-only scope metadata, limits, and quality counters only when NM is actually included. The default offline build exactly reproduces the approved Arizona manifest as well as both normalized data files; no NM staging rows were promoted. Verified SHA256:

- Manifest: `329c56179670a339f5ac69e92f1fb3ca5a6b6321dec09ff6eb706a23abf84be7`
- House2022: `8dde8edd835873088cbb056200887cce7309f08995e68aa8f7ca9bed14ebf562`
- House2026: `d33465a0234394558319df650815741807aa4f3b683a01e296489efa5f89de29`

The default import and exact approved-hash assertions passed. Arizona normalized data and qualification inputs are unchanged. Root and Atlas were notified directly; the default public bundle is frozen again.

## New Mexico current-only publication batch — November 6, 2026

The approved current-only publication uses the separate `research-house-nm` supplement, reproduced by `python3 scripts/import-research-house-nm.py`. It publishes **43 actual 2026 county-district portions across all 33 New Mexico counties, plus three separately reported district controls**. This leaves all approved Arizona file bytes and all existing numeric 2022 New Mexico baseline rows unchanged. Root registers the new supplement with priority 130 and deploys it to both website mounts.

The importer verifies all five retained 2026 primary snapshot hashes before parsing. Exact county names join uniquely to the existing FIPS reference; source CountyID is not treated as FIPS. Candidate IDs, district identities, the official page's explicit Mountain update time, and original retrieval times remain separate. Five candidate county sums exactly match their separately published district CSV controls. The sixth control is explicitly withheld: Chaves County's CD2 Gabriel Vasquez count is `*`, retained as `votes:null`, `missingVoteCount:true`, original `*`, `sourceNeedsReview:true`, `incomplete:true`, and `totalVotes:null`. Forty-two portions are fully numeric; one remains held. No residual is allocated to the suppressed cell.

This review also caught a defect in the old NM staging-only importer: the API's ballot label `Democrat` was not among that shared helper's accepted Democratic spellings. The dedicated importer checks the exact `DEM`/`Democrat` and `REP`/`Republican` pairs. The shared staging helper now also recognizes `Democrat`; its default Arizona output remains byte-identical. Earlier NM staging rows are not copied blindly. Published 2026 county rows preserve the correct source parties; no Other votes are reassigned.

The current source was checked again against the [official federal results page](https://electionresults.sos.nm.gov/resultsSW.aspx?type=FED&map=CTY), which remains labeled unofficial and has the same six House candidate district controls as the retained snapshot. Its 100% precinct display is not treated as completed counting. Suppressed 2022 primary rows remain staging-only; they do not replace the existing numeric baseline.

**New Mexico anomaly comparisons remain not assessed.** The complete 43-portion inventory is evidence of published geographic scope, not an approved historical comparability contract or proof of complete vote counts. A separate reviewed scope/seat/baseline qualification is required before adding NM House review borders. Existing Montana and Arizona House contracts remain intact.

Second offline imports reproduce all three new JSON files exactly. Canonical integration adds 46 current records with no duplicate geographic-contest identities and changes no prior record. All 2022 results remain unchanged. Validation details and source holds are public in `/data/research-house-nm/validation.json`; raw source snapshots remain ignored locally.
