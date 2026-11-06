# Official Senate county research batch — November 6, 2026

This isolated supplement adds **160 previously missing 2026 county returns**: all 67 Alabama counties and all 93 Nebraska counties. It also supplies a direct certified Alabama 2020 baseline for all 67 counties, replacing a held research-source baseline through the integration layer's explicit priority. Existing source files and bundles are unchanged.

The 2026 returns are dated unofficial snapshots. Complete geographic coverage and 100% precinct reporting do not establish that ballot counting is finished. Nebraska's source page explicitly reports its count update as **November 4, 2026, 1:33 PM CT**, although the workbook was downloaded November 6. The original update time, download time and retrieval time remain separate.

## Published files

| Year | County records | State controls | Review-held county records |
|---|---:|---:|---:|
| 2020 Alabama | 67 | 1 | 1 |
| 2026 Alabama | 67 | 1 | 0 |
| 2026 Nebraska | 93 | 1 | 0 |

The browser contract is `public/data/research-senate/manifest.json`, with `senate-2020.json` and `senate-2026.json`. Root owns registration and publishing. Suggested supplement priority: 130. The importer modifies only its owned new bundle.

## Primary sources and acquisition

**Alabama 2026:** [Secretary of State election-night results](https://www2.alabamavotes.gov/electionNight/statewideResultsByContest.aspx?ecode=1001305). The public **Export Data** link invokes the ordinary `hlnkExportData` form postback and returns `sosEnrExport.xlsx`. The retained workbook is `scripts/source-data/research-senate/al2026-export.xlsx`. Worksheet 1 contains county candidate rows; worksheet 2 supplies county reporting metadata and Excel date serials. The county codes are internal identifiers: code `01` means Jefferson, not FIPS 01001. Every published county name is joined uniquely within Alabama to the Census Gazetteer; source codes and names are retained. Only the `UNITED STATES SENATOR` contest is imported.

County candidate sums exactly equal the independently retained statewide HTML Senate section:

| Entry | Votes |
|---|---:|
| Everett Wess — Democratic | 758,465 |
| Barry Moore — Republican | 917,860 |
| Unattributed write-ins | 2,047 |
| Total published Senate entries | 1,678,372 |

County update timestamps come directly from the workbook's Excel serials. The source does not specify their timezone, so normalized timestamps have no invented UTC offset. The statewide page's timestamp is November 4, 2026, 11:16:06 AM, also without an inferred timezone. Ballots-cast fields are deliberately not used as candidate totals.

**Nebraska 2026:** [official statewide results](https://electionresults.nebraska.gov/resultsSW.aspx?type=SW&map=CTY). The Senate **Export → County Level** control invokes public postback `ctl00$MainContent$rptRace$ctl00$ctl01`. Its observed race is 13224, office sequence 102. The retained response is `ne2026-senate-counties.xlsx`. All 93 actual county rows reconcile, candidate by candidate, to the separate printed `TOTALS` row. Ballot-party labels are independently verified against the retained official HTML, rather than inferred from analytical caucus groupings:

| Candidate | Published affiliation | County sum / export control |
|---|---|---:|
| Pete Ricketts | Republican | 373,115 |
| Mike Marvin | Legal Marijuana Now | 15,974 |
| Dan Osborn | By Petition | 322,625 |
| Chuck Conboy | America First | 8,914 |
| Robin Richards | Nebraska Working People | 19,064 |

The sum is 739,692. There is **no Democratic candidate in this source**; all four other affiliations remain `Other`. Their votes are never assigned to Democrats. The source's all-precinct reporting status is not promoted to count completion or certification.

**Alabama 2020:** [official final canvass PDF](https://www.sos.alabama.gov/sites/default/files/election-2020/Final%20Canvass%20of%20Results-Merged.pdf), linked by the [official 2020 election-information page](https://www.sos.alabama.gov/alabama-votes/voter/election-information/2020). Physical PDF pages 3–4, printed pages 1–2, contain the county Senate table and an explicit State Canvassing Board certification dated November 23, 2020. Both pages were rendered and visually checked. The PDF's statewide controls are Doug Jones **920,478**, Tommy Tuberville **1,392,076**, and write-ins **3,891**; major-party county sums and the known write-in cells agree exactly.

Perry's write-in cell is printed as a dash. It remains `votes:null` with original `sourceValue`, and that county carries `incomplete:true` and `sourceNeedsReview:true`; no zero is invented. Its two named candidate counts remain exact. All other 66 county baselines are unheld. The certified statewide control is kept independently. `St_ Clair` is an explicit source spelling matched to the unique St. Clair county identity in Alabama.

All imported contests are regular November general elections, `special:false`. Seat identity is Class II, supported by the [official Senate class roster](https://www.senate.gov/senators/Class_II.htm), which identifies the 2021–2027 term following the November 2020 election. Explicit `seatClass`, `sourceSeatId` and `seatIdentitySource` accompany each row. The canonical `seatId` is left consistent with existing records because it is part of the merger's contest identity; adding it only to a replacement would create a duplicate contest. The analysis engine separately qualifies Class II identities from the official roster. The existing Nebraska 2020 baseline already covers 93 counties without a source hold, so it is not duplicated here.

## Reproduction and validation

Run `python3 scripts/import-research-senate.py` offline. It verifies all seven retained receipt hashes before parsing, extracts workbook XML using the standard library, and uses Poppler `pdftotext` for the two certified PDF table pages. Raw snapshots, public-form postback payloads, response headers, rendered PDF pages and `receipts.json` remain in the ignored raw directory. Initial receipts preserve local acquisition-completion timestamps; a separately reused Gazetteer retains its earlier snapshot timestamp. No account, personal data, authentication, paid service or provider call is used.

`public/data/research-senate/validation.json` records actual checks: 160 current county identities, 67 historical identities, unique contests/geographies, nonnegative integral known counts, exact source candidate counts, county-to-state candidate controls, party-label confirmation and seven pinned raw hashes. The existing Census 2018 national county Gazetteer is reused; it verifies all 160 Alabama/Nebraska county identities. Raw Excel local county codes never serve as FIPS.

The outputs must also survive an unchanged second offline rebuild byte-for-byte before handoff. Further source retrieval should produce a new pinned receipt and reviewed batch, preserving previous evidence.

## Remaining gaps

This batch does not fill other states or repair the held Texas/Idaho 2020 baselines. Illinois, Kentucky, Tennessee and Mississippi remain possible next official-feed targets. Nebraska's lack of a Democratic nominee is a comparison-eligibility limit rather than missing data. Alabama Perry's historical dash remains held. Source-specific timestamps and provisional status must remain visible after integration.
