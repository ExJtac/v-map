# California 2021 Governor recall: official county returns

This supplement imports **118 records**: the recall question and conditional replacement-candidate contest for all **58 California counties**, plus two independently printed statewide records. These are distinct `contestType` values (`recall-question` and `replacement-election`), both under Governor / 2021, `stage: recall`, `special: true`.

The recall question is a **ballot measure**, not a gubernatorial candidate election. Its Yes/No choices have no party identity. Replacement results are conditional: the [official explanation](https://elections.cdn.sos.ca.gov/sov/2021-recall/sov/01-about-the-sov.pdf) states that the recall failed because more than half voted No. Accordingly, no replacement candidate was elected Governor. Every record has `winnerEligible: false`, `suppressElectionWinner: true`, an explicit `outcomeType`, and `sourceElectionOutcome`. Consumers must honor those fields instead of presenting a replacement vote leader as elected Governor.

## Official sources and amendment

The [California Secretary of State's published Statement of Vote index](https://www.sos.ca.gov/elections/prior-elections/statewide-election-results/2021-ca-gov-recall/statement-vote) links both the original Statement of Vote and its later Supplement. The import uses the **later Supplement**, supported by the [Secretary of State's signed certificate dated February 17, 2022](https://elections.cdn.sos.ca.gov/sov/2021-recall/ssov/certificate.pdf):

- [Recall Question, statewide summary by county, XLSX](https://elections.cdn.sos.ca.gov/sov/2021-recall/ssov/recall-summary-by-county.xlsx).
- [Replacement candidates, statewide summary by county, XLSX](https://elections.cdn.sos.ca.gov/sov/2021-recall/ssov/recall-candidate-summary-by-county.xlsx).
- [Supplement explanatory notes](https://elections.cdn.sos.ca.gov/sov/2021-recall/ssov/explanatory-notes.pdf), documenting Plumas County's amended final canvass on December 15, 2021.

The original [recall-question CSV](https://elections.cdn.sos.ca.gov/sov/2021-recall/sov/csv-recall-question.csv) and [candidate CSV](https://elections.cdn.sos.ca.gov/sov/2021-recall/sov/csv-candidates.csv) are retained for exact comparison and candidate IDs/party/write-in metadata. The later county tables differ only in two documented Plumas cells:

| Cell | Original SOV | Later Supplement |
| --- | ---: | ---: |
| Recall Yes | 5,842 | 5,843 |
| Replacement: Larry A. Elder | 3,918 | 3,919 |

The Supplement's **printed statewide totals were not increased** for these changes. Therefore county sums exceed the independently printed statewide Yes and Elder totals by one vote. The importer preserves both source views without silently correcting statewide totals. The two statewide records have `sourceNeedsReview: true` and an explicit reconciliation. County amendment values remain valid published evidence; no residual is allocated across counties. `/data/california-recall/reconciliation.json` provides the exact comparisons and source links.

The published statewide recall totals remain Yes 4,894,473 / No 7,944,092. The amended county Yes sum is 4,894,474. The difference does not alter the recall's failed outcome.

## Candidate and geography safeguards

The replacement table contains **53 named candidates**, including qualified write-ins. Party identities, candidate IDs and write-in flags are matched against the official original candidate registry. The original `csv-candidates.csv` also contains a different contest ID that labels the recall question's Yes votes as “Gavin Newsom.” Those rows are not replacement candidacies. The importer explicitly selects replacement `Contest ID: 20000000000`, `Contest Name: Governor`; it does not accidentally create a Newsom replacement candidate from the recall question.

All 58 county names are matched exactly after punctuation/space normalization to the [Census Bureau's 2010 county Gazetteer](https://www2.census.gov/geo/docs/maps-data/data/gazetteer/Gaz_counties_national.zip). The source's footnoted `Plumas1` label is explicitly normalized to Plumas while retaining `sourceCountyLabel`. No district-to-county estimation, inferred vote allocation or fabricated zero count is used.

Each question has its own valid-vote denominator. Voters could answer either or both parts; recall-question and replacement totals must not be added together as ballots cast. These tables do not itemize blank/overvote categories, so `reportingCategories: []` means not supplied here, not zero invalid or skipped ballots. Actual zero candidate cells remain zero as explicitly published.

## Files and checks

Run:

```sh
python3 scripts/import-california-recall.py
```

The importer uses the Python standard library to read the official XLSX's cached strings/numeric cells and original CSVs; no API, account, paid service or runtime dependency is needed. Raw sources, signed certificate, explanatory notes, companion PDFs, source-index snapshot and SHA-256 provenance are retained in `scripts/source-data/california-recall/`. `--download` fetches into temporary files and rejects source changes against saved hashes.

Output is local under `/data/california-recall/`: `governor-2021.json`, `manifest.json`, `reconciliation.json` and `validation.json`.

Checks passed for all 118 unique geographic/contest identities, all 58 counties for both questions, nonnegative integer counts, exact record vote sums, 53 candidate/party/write-in matches, explicit independent statewide controls, and the two documented Plumas amendments. Original and amended sources reconcile everywhere except those exact disclosed cells. Certificate and recall-question table pages were rendered and visually inspected. A repeated rebuild produced byte-identical JSON and unchanged source hashes. Browser integration and independent final QA belong to the root/Proof workers.
