# Early county election supplement, 2006–2015

This supplement adds **37,743 county contest results / House county-district portions in 20 office-year files**, using actual public source counts. It leaves the earlier `/data/elections/` and `/data/county-elections/` files unchanged. It does not claim complete national coverage or include 2016–2026 returns. The existing presidential county history remains in the original source files, without duplication here.

## Loaded coverage

| Office | Years | States per year | Geographic records |
| --- | --- | --- | --- |
| House | 2006 / 2008 / 2010 / 2012 / 2014 | 46 / 47 / 47 / 48 / 47 | 3,713 / 3,670 / 3,704 / 3,763 / 3,674 |
| Senate | 2006 / 2008 / 2010 / 2012 / 2014 | 32 each | 1,874 / 2,288 / 2,054 / 1,874 / 2,287 |
| Governor | Every year 2006–2015 | Only states with covered elections | 8,842 records, including 72 Wisconsin recall counties |

All results have county FIPS, checked against the Census 2010 Gazetteer. House records retain the **specific congressional district portion of that county**, never a county allocation inferred from district totals. There are 91,048 named-candidate entries and 19,703 separately labeled reporting categories, principally unitemized minor-candidate aggregates. Fusion ballot lines with the same candidate name are summed; their original labels are retained in `ballotParties`.

## Sources and reproducibility

1. **Paul Heideman (2026), [U.S. county-level election results: President, U.S. House and U.S. Senate, 1990–2024, v1.0.0](https://doi.org/10.5281/zenodo.22976553)**. Actual download: [pinned GitHub release ZIP](https://github.com/pmheideman/us-county-election-results/releases/download/v1.0.0/us_county_election_results_v1.0.0.zip). Release data license CC BY 4.0; upstream sources retain their own terms. The ZIP contains candidate/party-line county×district returns, an upstream source register, known gaps, correction log and publisher SHA-256 manifest. The importer verifies every archived member named in that publisher manifest before parsing. Each result retains upstream source IDs; each browser dataset includes the corresponding publisher/document/locator/transcription/license metadata. This is a research compilation, not a certification authority.
2. **Carlos Algara and Sharif Amlani (2021), [Partisanship & Nationalization in American Elections: Evidence from Presidential, Senatorial, & Gubernatorial Elections in the U.S. Counties, 1872–2020](https://doi.org/10.7910/DVN/DGUMFI)**, Dataverse V1.1, CC0. Governor raw file [5028535](https://dataverse.harvard.edu/api/access/datafile/5028535), `dataverse_shareable_gubernatorial_county_returns_1865_2020.Rdata`. The original RData is preserved. Its `gov_elections_release` object is decoded with `rdata 1.1.0` into CSV, also preserved with SHA-256. Source columns contain the two major nominees' names/votes and an actual county total. Other-candidate aggregate votes are the exact nonnegative difference between that source total and the two reported nominee counts; no named minor candidate is invented. The source `sfips` column is an historical code, **not** standard state FIPS; the importer uses the actual county `fips` and independently verified state prefix.
3. **[OpenElections Wisconsin](https://github.com/openelections/openelections-data-wi)**, pinned commit `f344a0ee7effcea4cf835750a3584a7fbb754b6d`, [June 5, 2012 general recall ward CSV](https://raw.githubusercontent.com/openelections/openelections-data-wi/f344a0ee7effcea4cf835750a3584a7fbb754b6d/2012/20120605__wi__general-recall__ward.csv). Governor rows explicitly name their county. All 13,680 ward candidate rows are summed through those county names to 72 counties. Per-ward candidate sums match the source's repeated ward totals; repeated totals are not added once per candidate. The recall remains `stage: recall`, `special: true`, election date June 5.
4. **[Census Bureau 2010 Gazetteer](https://www.census.gov/geographies/reference-files/time-series/geo/gazetteer-files.2010.html)**, [county download](https://www2.census.gov/geo/docs/maps-data/data/gazetteer/Gaz_counties_national.zip). Historical county identity reference only; no boundary allocation is performed. Connecticut uses its historical counties, not current planning regions. The 2006–2014 source county FIPS, including historical Shannon County 46113, all match this historical reference.

Raw snapshots, code archive, documentation and provenance are under `scripts/source-data/early-counties/`. The importer writes only its owned source and output directories. All source downloads are public and require no account, paid API or key.

```sh
python3 scripts/import-early-counties.py
```

This rebuilds from the saved raw snapshots and runs validation. `--download` refetches pinned release/file/commit URLs. `--decode` repeats RData conversion through `uv run --with rdata==1.1.0`; ordinary offline rebuilds use the preserved decoded CSV. Browser output is under `/data/early-counties/`; `manifest.json` declares available office-years, source attribution, upstream provenance and limits. `gaps.json`, `no-ballot-evidence.json` and `validation.json` provide the missingness/audit record.

## Confirmed gaps and holds

- Heideman covers the 48 contiguous states, excluding Alaska, Hawaii and DC, and excludes special elections. Some states therefore have fewer covered Senate races than their full historical schedule. No missing special is manufactured from regular returns.
- House: **878 candidate rows lack district identity** and remain excluded rather than inventing county-district intersections. Affected state-years are NV 2006/2008/2010, WA 2006/2012, IA 2010/2012 and CO 2014. The raw rows and exact exclusions remain available. The release also lists unopposed/no-ballot seats and other source gaps. Its no-ballot county inventories can use boundary overlays; those inventories are retained only as missing-vote evidence, never converted to zero-vote returns or estimated counts.
- House 2010 Alabama, Montgomery County 01101, District 02: the source contains **Bobby Bright 23334.16236**. All three candidate rows for this entire county-district contest are held. The fractional cell was independently confirmed verbatim in the [Alabama SOS-hosted historical workbook](https://www.sos.alabama.gov/sites/default/files/election-data/2017-06/eaushouse1980-2012_0.xls), sheet `10Gen`, row 55. It is not rounded or silently accepted.
- Governor: Alaska is absent. Three Kalawao County, Hawaii, records (2006/2010/2014) have missing candidate and total counts and remain unavailable, not zero.
- Governor Utah2010 is imported separately from the official2010General workbook as a special election; the Algara archive has no UT2010 or WV2011 rows. Both gaps are now supplied by actual official sources described below; metadata flags alone did not supply either race. Wisconsin 2012 is separately sourced as a recall. Other early House/Senate specials remain gaps.
- Historical Missouri source statewide sums omit the separate Kansas City reporting bucket in Senate 2006/2010/2012 and Governor 2008/2012. Jackson/Clay/Platte county records are conservatively held with `sourceNeedsReview`; no city votes are allocated across county lines. The omission is consistent with the [Missouri official 2008 roster](https://s1.sos.mo.gov/CMSImages/Publications/2009-2010_Missouri_Roster.pdf), which itemizes Kansas City separately (Nixon 120,023 / Hulshof 26,316).
- Maine Governor 2010 historical county major-party sums (LePage 217,862 / Mitchell 109,087) differ from [official statewide totals](https://www.maine.gov/sos/sites/maine.gov.sos/files/inline-files/2010%20Gov%20General.pdf) (218,065 / 109,387). All 16 imported county records are held for source review, without scaling the counts. The existing legacy statewide record is more seriously partial and separately held.
- Any county where the unitemized other-candidate aggregate could exceed the largest named candidate is marked `sourceNeedsReview`. This prevents a false named winner, including Connecticut 2006 where independent Lieberman is not individually identified in the historical archive, and Rhode Island 2010 where Chafee is not individually identified. The aggregate remains available as actual votes, not a fabricated person.

There are **148 held county records**. Their source counts remain inspectable; the shared summary API must suppress winner/party/share/margin when `sourceNeedsReview` is true. `candidateDetailIncomplete` additionally marks unnamed minor-candidate detail even when the aggregate cannot exceed the named leader.

`gaps.json` lists every source exclusion and every missing county presence for states with an existing office contest inventory. House county presence is not a claim that every district portion is covered; the source district and no-ballot gap inventories remain necessary. Absence is never interpreted as zero votes or no election.

## Candidate identity and round semantics

The historical analysis source groups independent candidates into a Democratic nominee slot. That modeling convention is not a ballot-party identity. The import retains the original grouping in `sourcePartyGroup` and labels **Bernie Sanders, Vermont Senate 2006/2012**, and **Angus King, Maine Senate 2012**, as Independent (`party: Other`) using [House biographical history](https://history.house.gov/People/Listing/S/SANDERS%2C-Bernard-%28S000033%29/) and [King's Senate biography](https://www.king.senate.gov/about).

The raw stage is retained in `sourceStage`. Bounded `sourceStageOverride` metadata labels Georgia 2008 Senate as the December 2 runoff; its county sums exactly match the [House Clerk's official statistics](https://clerk.house.gov/member_info/electionInfo/2008/2008Stat.htm): Chambliss 1,228,033 and Martin 909,923. Louisiana 2014 Senate county sums match the [FEC December 6 runoff](https://www.fec.gov/documents/1698/2014senate.pdf): Cassidy 712,379 / Landrieu 561,210. Louisiana 2015 Governor is labeled the November 21 final runoff, retaining source election type G. Missing earlier rounds are not synthesized.

## Legacy state source holds for integration

The early manifest includes `sourceHolds` with office/year/state/contest identity, reason, primary URLs and independently verified totals. Runtime integration can flag these legacy state records without altering their stored source artifacts:

| Legacy record | Problem | Verified primary general/runoff totals |
| --- | --- | --- |
| Utah Senate 2010 | Legacy Lee 360,403 / Granato 191,732 differ from official final returns | [FEC](https://www.fec.gov/documents/1674/federalelections2010.pdf): Lee 390,179 / Granato 207,685; total 633,829 |
| West Virginia Senate 2006 | Legacy general contains primary counts | [FEC](https://www.fec.gov/documents/1639/2006senate.pdf): Byrd 296,276 / Raese 155,043; total 459,884 |
| Louisiana Senate 2014 | Legacy Cassidy/Landrieu counts each exceed runoff totals by 1,000,000 and do not describe an official round | [FEC](https://www.fec.gov/documents/1698/2014senate.pdf): Cassidy 712,379 / Landrieu 561,210; runoff total 1,273,589 |
| Maine Governor 2010 | Legacy state total 43,037 is a partial result | [Maine SOS](https://www.maine.gov/sos/sites/maine.gov.sos/files/inline-files/2010%20Gov%20General.pdf): LePage 218,065 / Mitchell 109,387 / Cutler 208,270; total including blanks 580,538 |

## Methodology audit and checks actually run

The release's exact v1.0.0 code archive is preserved. A targeted review searched its election-source scripts for allocation, prorating, estimation, reconstruction and imputation, and inspected the Alabama historical parser. No spatial/proportional allocation of early county vote counts was identified in the reviewed paths. The Alabama parser reads the malformed fractional source cell directly. A Massachusetts candidate-column residual reconstruction appears in 2000, outside this import's period. This audit is bounded; it does not independently re-transcribe every upstream county report or prove every compilation cell error-free.

The importer passed all publisher ZIP SHA checks, all county/state FIPS checks, nonnegative integer validation, candidate/category vote conservation, unique geographic contest identities, exact House district preservation, source missingness holds, independent-party overrides, separate recall/regular stages, and Georgia/Louisiana official runoff spot checks. A separate Node check confirmed that all 148 held early records return null winner, party, share and margin through the shared summary API. No paid inference, estimated county vote allocation or synthetic zero count was used.


## Absent nominee slots

A bounded source-semantic correction moves 405 literal `None` / zero-vote historical nominee slots into `reportingCategories` with `category: absentNomineeSlot`, retaining the source slot party and zero count. These occur only in Senate Kansas2014 (105counties), Indiana2006 (92), Arkansas2008 (75), Alabama2014 (67) and SouthDakota2010 (66). They are absent analytical slots, not actual people. The correction does not blanket-match `NONE`; actual write-ins with that supplied name in other sources remain untouched. Geographic records, total votes and source snapshots are unchanged.


## Utah2010 Governor special: actual official source

The Algara archive has Utah2008/2012, but no2010 rows. Earlier statements that a metadata branch had restored2010coverage were incorrect; that branch never executed without source rows. This gap is now filled with all29county rows from the Governor sheet in the [official2010General workbook](https://vote.utah.gov/wp-content/uploads/2023/09/2010Gen.xls), linked by the [Utah historical election index](https://vote.utah.gov/historical-election-results/). The [Utah Archives](https://archives.utah.gov/research/entities/5027/) explicitly identifies this as the2010special election to complete Huntsman's term. Every imported record has `special:true`, general ballot stage, election date2010-11-02.

Exact county sums equal the four printed statewide ticket controls: Herbert/Bell412,151; Corroon/Allen205,246; Anderson/Maxfield13,038; McCullough/Cramer12,871. The qualified-write-in column has one explicitly reported vote in UtahCounty, three explicit zero cells and25blank cells. Blank cells remain `votes:null` with missingness flags, never zero. The state write-in control is also blank and is not fabricated. The original workbook and verbatim decoded Governor rows are retained with SHA256 provenance. The four numeric ticket totals and all29Census county joins pass the importer checks. No electionwide ballots-cast total is used as the gubernatorial vote denominator.


## WestVirginia2011 Governor special: actual official source

The Algara archive also lacks the2011WestVirginia special, so its earlier metadata branch did not create county coverage. The gap is now filled with all55county returns for8named candidates, directly from the [WestVirginia SOS official statewide results](https://apps.sos.wv.gov/elections/results/results.aspx?county=Statewide&eid=10&type=OFFICIAL&year=2011) and its linked candidate-by-county tables. The heading specifies Special Gubernatorial General Election, October4,2011, Official Results. All55records carry `special:true`, `stage:general`, and the actual election date.

Every candidate county sum exactly matches the official statewide control: EarlRayTomblin149,202; BillMaloney141,656; BobHenryBaber6,083; MarlaDeeIngels2,875; HarryV.Bertram1,111; PhilHudok76; DonaldLeeUnderwood54; JohnR.“Rick”Bartlett27. The exact total is301,084. Names retain their original spelling/punctuation in the browser data, including three explicitly itemized write-in candidates; numeric zero cells remain actual reported zeros.

The candidate pages duplicate some HTML tables. The decoder deduplicates identical county/name rows and asserts equality before using a row once; it does not add duplicate presentations. It uses only each candidate's vote column. Candidate-page `Total Votes` and percentage fields are not used as voter counts or denominators because those ancillary fields can disagree with the full candidate table. County totals are sums of the eight actual candidate counts, and each candidate sum is independently checked against the statewide official control. The site's generic certification disclaimer remains preserved in raw HTML; the published Official Results heading is attributed to the SOS rather than treated as an independently examined certificate.

All9HTMLsources, links, hashes and a reproducibly decoded JSON are retained under the early source directory and referenced in provenance. The importer validates55Census county identities,8statecontrol totals, unique county-special-contest records and exact within-county candidate sums. Source hash checks now reject changed downloads into a retained temporary file rather than silently replacing the historical source snapshot.
