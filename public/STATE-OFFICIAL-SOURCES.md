# Hawaii official county-jurisdiction reports: 2006–2024

The supplemental importer reads **40 original Hawaii Office of Elections county-summary PDFs** for the even-year general elections from 2006 through 2024. It produces **23 office-year JSON files with 103 county-jurisdiction contest records**: 51 House county-district portions, 32 Senate records and 20 Governor records. Original PDFs, SHA-256 hashes, downloaded index and extracted evidence are preserved in `scripts/source-data/state-official/`. No earlier election datasets are modified.

The [official historical results index](https://elections.hawaii.gov/election-results/) places these links under **Certified Reports**. `electionStatus: certified` is retained as an **index-attributed status**; each record's `certificationBasis` explains that no independent certification instrument was examined. A heading on the source index does not prove that the county totals reconcile to a later statewide report.

## Coverage

| Office | Years | Records |
| --- | --- | --- |
| House | Every even year, 2006–2024 | Five county-district portions each year, except six in 2016 |
| Senate | 2006, 2010, 2012, 2014, 2016, 2018, 2022, 2024 | Four county-jurisdiction reports per election |
| Governor | 2006, 2010, 2014, 2018, 2022 | Four county-jurisdiction reports per election |

Honolulu reports both House districts; Hawaii, Maui and Kauai reports contribute District 2. House portions remain separate. Honolulu's **2016 District 1 Vacancy** is a distinct special contest alongside the regular District 1 contest; both remain present with different `special` values and contest identities. The separate May 2010 House special election is not imported by this general-election collection.

These files do not add President returns, since those are already available in the original county history, and contain no 2026 Hawaii results.

## County identity caveat

The reports describe **election jurisdictions**, not a new Census geographic crosswalk. The County of Maui summary is mapped to Maui FIPS 15009 with a prominent `geographicCoverageNote`. **Kalawao is a separate Census county, FIPS 15005**, and these files provide no separately reported Kalawao total. The importer does not infer whether a given Maui jurisdiction summary includes or excludes Kalawao voting administration, assign a residual to Kalawao, duplicate Maui votes into Kalawao or claim an independently isolated Kalawao return.

## Reconciliation and review holds

Five additional official statewide final-summary PDFs are retained as verification references. All 14 federal contests in **2006–2014** have candidate totals that differ from the sum of the four county-jurisdiction reports. Thus **41 county contest records are marked `sourceNeedsReview: true`**. Original county counts remain unchanged. The shared summary API suppresses winner, party, share and margin for these records while the source counts remain inspectable.

| Election | Candidate-sum difference: statewide minus county reports |
| --- | --- |
| Senate 2006 | Akaka +192; Thielen +34; all-candidate difference +236 |
| House 2006 District 1 / 2 | All-candidate differences +144 / +91 |
| House 2008 District 1 / 2 | All-candidate differences +389 / +307 |
| Senate 2010 | Inouye +61; Cavasso +15; all-candidate difference +77 |
| House 2010 District 1 / 2 | All-candidate differences +58 / +19 |
| Senate 2012 | Hirono +330; Lingle +97; all-candidate difference +427 |
| House 2012 District 1 / 2 | All-candidate differences +257 / +165 |
| Senate special 2014 | Schatz +50; Cavasso +11; all-candidate difference +61 |
| House 2014 District 1 / 2 | All-candidate differences +39 / +22 |

The exact candidate-by-candidate comparisons, state report hashes, county-record counts and reference URLs are in `/data/state-official/reconciliation.json`. The five primary references are the [2006](https://files.hawaii.gov/elections/files/results/2006/general/histatewide.pdf), [2008](https://files.hawaii.gov/elections/files/results/2008/general/histatewide.pdf), [2010](https://files.hawaii.gov/elections/files/results/2010/general/histatewide.pdf), [2012](https://files.hawaii.gov/elections/files/results/2012/general/histatewide.pdf) and [2014](https://files.hawaii.gov/elections/files/results/2014/general/histatewide.pdf) official final statewide summaries.

No causal explanation is inferred. In particular, the 2006 Honolulu county and statewide summaries bear the same November 22 report date, approximately one minute apart. It would be unsupported to explain every mismatch merely as an older report. No statewide residual is proportionally allocated to counties or used to overwrite their reported counts. Later corrected county totals were not established during this bounded review.

The 2016–2024 federal major-party county sums were independently checked by Proof against the existing state inventory without finding the earlier discrepancies. Governor sums also match that inventory, but this is a consistency check, not an independent examination of each certification instrument. Only the older federal comparisons above were reconciled programmatically to newly downloaded statewide PDFs in this follow-up.

## Parsing and checks

`pdftotext -bbox` extracts positioned words. The parser reads the first table column, identifies supported federal/Governor contest headings, pairs candidate names and counts even when the PDF separates them into adjacent text lines, and retains blank/overvote rows as `reportingCategories`. Local races in the same reports are excluded. `totalVotes` is the sum of reported candidate and ballot-category counts; it may include blank/invalid ballots and is not described as valid-candidate votes only.

The importer checks all candidate counts are nonnegative integers, both blank/overvote categories are present, and computed source percentages match printed percentages within 0.16 percentage points. It checks unique county/contest identity, all ten expected House inventories, and the distinct 2016 Honolulu vacancy contest.

Proof visually inspected the 2016 Honolulu and 2024 Maui source tables. Atlas additionally rendered and visually checked the 2014 statewide first page, including the special Senate heading and federal candidate totals. Original county source hashes and all five state reference hashes are enforced on subsequent runs.

A repeated rebuild initially exposed nondeterministic source-object ordering from Python set iteration. Source IDs are now sorted. **Two subsequent builds produced byte-identical output JSON; all 45 original/reference PDF hashes remained unchanged.** A Node regression verified summary suppression for all 41 held records.

Rebuild from preserved sources:

```sh
python3 scripts/import-state-official.py
```

`--download` refreshes the county report URLs into a temporary file and rejects changes against the stored source hash. Newly changed PDFs require separate review, not silent replacement. Output is served locally from `/data/state-official/`; `manifest.json` includes coverage, source attribution, status limitations, per-file hold counts and House intersection metadata. `validation.json` records the actual checks and source hashes.
