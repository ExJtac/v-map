# Reported county ballots cast

Imported November 6, 2026 from the California Secretary of State's [2026 election media feed](https://media.sos.ca.gov/). This is an unofficial snapshot, separate from candidate vote totals. It is not a live polling service or final turnout figure.

`scripts/import-turnout.py` parses county reporting-status **A messages** from [V26GG.txt](https://media.sos.ca.gov/media/V26GG.txt), using the official [ASCII data-feed guide, pages 5–8](https://cms.cdn.sos.ca.gov/media/2-ascii-file-format-v9.pdf). The guide defines the Voter Turnout field as ballots cast. County names from [S26GG.txt](https://media.sos.ca.gov/media/S26GG.txt) join exactly to the retained Census Gazetteer; California's sequential county codes are not mistaken for FIPS codes.

All 58 counties are present. Their reported ballots, registered voters, precincts reporting, and total precincts each sum exactly to the statewide A-message control. The retained snapshot reports **9,027,710 ballots cast statewide**. Los Angeles reports **2,617,572 ballots cast**, distinct from its Governor candidate-vote total of 2,560,939 in the separately retained contest snapshot.

The card shows countywide ballots once for the matching regular November 2026 election, with the source's county update time and unofficial label. It never adds ballots across offices or House district portions. No ballot figure is inferred where a participation source is missing. “Reported votes for [office]” remains the contest-specific total and can differ because of blank selections, write-ins, source coverage, or snapshot timing.

Precinct reporting is not evidence that every ballot is counted or that results are certified. The source guide includes historical illustrative certification dates; V-Map does not apply those dates to 2026.

Raw files, format guide, retrieval receipts, and hashes: `scripts/source-data/turnout/`. Public output and reconciliation controls: `public/data/turnout/`.


## Historical final participation and statewide controls

The dataset now contains **58 California counties × 5 regular November general elections = 290 county-election records**, plus **5 independent statewide records under `states["06"]`**. Historical `ballotsCast` comes from the official Statement of Vote **Total Voters** column. Precinct Voters plus Vote-By-Mail Voters equals Total Voters for every county and state control; candidate vote totals are never used as participation.

| Election date | Statewide ballots cast | Published registered voters | Certification date |
| --- | ---: | ---: | --- |
| 2018-11-06 | 12,712,542 | 19,696,371 | 2018-12-14 |
| 2020-11-03 | 17,785,151 | 22,047,448 | 2020-12-11 |
| 2022-11-08 | 11,146,620 | 21,940,274 | 2022-12-16 |
| 2024-11-05 | 16,140,044 | 22,595,659 | 2024-12-13 |
| 2026-11-03 | 9,027,710 reported so far | Source A-message control | Unofficial, not certified |

Official participation tables: [2018](https://elections.cdn.sos.ca.gov/sov/2018-general/sov/03-voter-participation-stats-by-county.pdf), [2020](https://elections.cdn.sos.ca.gov/sov/2020-general/sov/03-voter-participation-stats-by-county.pdf), [2022](https://elections.cdn.sos.ca.gov/sov/2022-general/sov/03-voter-participation-stats-by-county.pdf), [2024](https://admin.cdn.sos.ca.gov/elections/sov/2024-general/sov/03-voter-participation-stats-by-county.pdf). These exact files are linked by the [Secretary of State participation index](https://www.sos.ca.gov/elections/statistics/voter-participation-stats-county).

Each historical record has `electionDate`, `stage: "general"`, `special: false`, source ID, `unofficial: false`, `provisional: false`, `certified: true`, `final: true` and an evidenced certification date. Certification evidence is retained and hashed: the Secretary of State’s [2018 announcement](https://www.sos.ca.gov/administration/news-releases-and-advisories/2018-news-releases-and-advisories/california-secretary-state-certifies-november-2018-general-election-results), [2020 announcement](https://www.sos.ca.gov/administration/news-releases-and-advisories/2020-news-releases-and-advisories/ap20116), [2022 release](https://elections.cdn.sos.ca.gov/statewide-elections/2022-general/media-releases/12-16-22.pdf), and [2024 announcement](https://www.sos.ca.gov/administration/news-releases-and-advisories/2024-news-releases-and-advisories/secretary-state-shirley-n-weber-phd-has-certified-results-california-november-5-2024-general-election). A certification date is not invented as the PDF’s update time: historical `sourceUpdatedAt` remains null.

**2022 source discrepancy:** the certification release states 11,146,610 ballots and 9,755,188 mail ballots, while the participation table prints 11,146,620 and 9,755,198. All 58 county sums exactly match the participation table’s printed control. The table is retained as published; the ten-ballot difference is documented in source metadata and is not allocated or silently corrected.

Registration figures are source report denominators. The 2022/2024 tables explicitly use the 15-day Report of Registration and exclude later registrants even though same-day registration remains available. Those figures are not total population and must not be substituted for population. Percent of total population voted must use a separately dated population source and label that denominator; it is distinct from turnout among registered or eligible voters.

The existing 2026 county objects and original source metadata are **exactly unchanged**. Its statewide record comes from the independent A-message state control59. A 2026-versus-2022 comparison is a comparison of **reported ballots so far against final prior ballots**, not evidence of a final turnout decline. Countywide figures count once across offices and House district portions.

## Verification and rebuild

Run `python3 scripts/import-turnout.py` offline. It verifies pinned original and historical receipts, parses the four saved source tables, checks all 58 exact Census Gazetteer county/FIPS joins, verifies each county’s in-person/mail sum and printed percentages, and reconciles county totals to the independently printed statewide ballot/registration/mode controls. All four original table pages were rendered and visually inspected. Historical final-status evidence and the unchanged 2026 snapshot are checked explicitly. Every county and state has one record per election; an identical second rebuild produces identical public JSON hashes.

The machine report is `public/data/turnout/validation.json`; preservation/determinism evidence is `scripts/source-data/turnout/final-audit.json`. Original 2026 receipts remain unchanged. Historical PDF/text/certification hashes and URLs are in `historical-receipts.json`. California only; no unsupported state allocation, other-state participation inference or estimate of missing 2026 ballots is included.
