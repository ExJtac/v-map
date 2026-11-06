# County election supplements

This is a free, local historical snapshot retrieved November 6, 2026. It supplements the original `/data/elections/` files without changing them. The browser manifest is `/data/county-elections/manifest.json`. No estimated county allocation, paid source, key, live feed, form submission or newly connected service is used.

## Loaded coverage

| Office | Year | Geographic results | Contests | States | Candidate entries |
| --- | --- | ---: | ---: | ---: | ---: |
| U.S. Senate | 2018 | 2,046 counties/contests | 35 | 33 | 10,009 |
| U.S. House | 2018 | 3,552 county–district intersections | 424 | 47 | 10,890 |
| Governor | 2018 | 2,134 counties/contests | 34 | 34 | 13,393 |

Total: **7,732 geographic results and 34,292 candidate entries**. The 2018 files do not claim complete coverage. Separate Senate seats remain separate contests. House counts represent only the named congressional district's part of the county; multiple district results for one county are never combined into a fabricated whole-county House contest.

## Primary source and pinned snapshots

[Stephen Pettigrew, *November 2018 general election results (county-level)*](https://doi.org/10.7910/DVN/UYSHST), Harvard Dataverse **V4**, released August 22, 2019, CC0. [MIT Election Lab lists this dataset](https://electionlab.mit.edu/data) as a county return source for Senate, House and Governor.

- [National ZIP file 3543104](https://dataverse.harvard.edu/api/access/datafile/3543104): SHA-256 `3134a85e3710188c11423f6f72d9e16d7c92d82390f0d3b360a8b6c62d121fe8`.
- [Codebook file 3337964](https://dataverse.harvard.edu/api/access/datafile/3337964): SHA-256 `106c45261a6a282833abc42b979cd46d22f385ab080f0c916b0936a2d9dcf27c`.
- [Corrections/notes file 3543105](https://dataverse.harvard.edu/api/access/datafile/3543105): SHA-256 `8adab7af4334bfaf7b02bccbd3d92a8f4830605e60e3839fd928fa51e5155557`.
- [U.S. Census Bureau 2018 national county Gazetteer ZIP](https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2018_Gazetteer/2018_Gaz_counties_national.zip): SHA-256 `744b5c900ad3aff0fc563078831084a12e46b390905045e91a0cbac07c76b6e4`. Used to verify every accepted county FIPS, its state and county name. [Census Gazetteer documentation](https://www.census.gov/geographies/reference-files/time-series/geo/gazetteer-files.2018.html).

Raw archives, codebook, notes, Dataverse metadata, exact hashes, provenance and all excluded source rows are retained under `scripts/source-data/county-supplements/`. Each browser file includes source metadata and its exact archive member. Source vote totals are not represented as independently certified returns.

## Geography and source limitations

New England municipalities and township groups are aggregated only through their **explicit source county FIPS**, checked against the 2018 Census registry. The ten-digit `fipscode2` plus source reporting-unit name distinguishes reporting units; `total.votes` is counted once per unit and contest, then summed. Maine's county township residual groups are distinct reporting units, not repeated county totals. Town names are never mapped to a county by guesswork. Every result records its reporting-unit count and aggregation basis.

The six historically at-large House states **Delaware, Montana, North Dakota, South Dakota, Vermont and Wyoming** use canonical `district: "0"`. Before normalizing their source `district: "1"`, the importer verifies that the independently sourced baseline `/data/elections/house-2018.json` contains **only district 0** for that state. All **215** affected county results retain `sourceDistrict: "1"` and an explicit `districtNormalization` explanation. Every remaining House state/district pair is also checked against that baseline inventory. The House payload, supplemental manifest and validation report retain `districtNormalizationReference` with its source DOI/version, local reference-file SHA-256, purpose and normalization rule. This reference checks district identity only; no baseline vote counts are imported.

Illinois Cook records with invalid primary `fipscode=00000` contain explicit `fipscode2=1703100000`. These are joined through the verified `17031` prefix and flagged `countyFipsRecoveredFromExplicitFipscode2`. No other name-based county recovery occurs. Connecticut uses 2018 county FIPS, which differ from today's planning-region county equivalents.

**694 source candidate rows are excluded**, retained with exact source line and reason in `exclusions.json`:

- 323 Alaska rows use electoral districts or an unallocated residual. These are not counties.
- 317 House rows have invalid or unspecified district identity: Nebraska uses `statewide`, and West Virginia uses `11`, `21`, `31` despite its three 2018 congressional districts. These are excluded rather than silently relabeled or combined.
- 54 rows lack a verified county FIPS, including Kansas City, Missouri; four New Hampshire reporting units; and Maine's unallocated `STATE UOCAVA` pool.

The source national archive has **no Arizona Governor returns**, and **no Florida House districts 10, 14, 21, 24**. Missing results remain missing. No assumption of exhaustive special elections or runoff coverage is made.

Review flags are conservative:

- Maine results flag the excluded unallocated UOCAVA pool. House district 2 additionally records `stage: "initial count"` and `rankedChoiceRound: "initial count"`: the source notes explicitly say these are initial preferences, not the final ranked-choice result. Winner/share/margin require review.
- New Hampshire results flag omitted units with unresolved county identities. Missouri Senate/House results flag the unallocated Kansas City rows; the affected county allocation is unknown, so all Missouri results for those offices require review.
- Mississippi's regular Senate results flag the source author's unresolved 29-vote discrepancy for Danny Bedwell. Its special Senate contest is the November **first round**, not the later runoff, and remains separate from the regular Senate contest.
- West Virginia Senate returns retain the source's unofficial status. West Virginia House rows are excluded for the district problem above.

Candidate labels are preserved, with case-insensitive identical names merged across municipality records or fusion ballot lines. Original party labels remain in `partyOriginal`; major-party ballot affiliation takes precedence over minor fusion lines. `SCATTERING`, `Other(s)` and ballot accounting labels live in `reportingCategories`, separate from named candidates. Generic write-in totals remain source aggregate write-in entries. Source `total.votes` equals the sum of listed entries and may omit write-ins not reported by the original state source; it is neither turnout nor an independently certified ballot total.

## 2022 Senate source was located but not imported

[MEDSL *U.S. Senate county-level results 2022*](https://doi.org/10.7910/DVN/YB60EJ), Harvard Dataverse V3, file **7412054**, is listed by MIT Election Lab. The public metadata was saved. The direct data and codebook downloads required a guestbook response (HTTP 400); no guestbook form was submitted and no unverified mirror was substituted. The supplemental manifest therefore claims **no 2022 county coverage**. The original independently sourced statewide 2022 Senate data remains available.

## Rebuild and validation

```sh
python3 scripts/extend-county-elections.py
```

This rebuilds deterministically offline from saved snapshots. `--download` fetches the immutable public snapshots again and rejects any file whose SHA-256 differs from the pinned hash. The importer does not modify original election files or frontend code. State names are labels read from the original 2016 Presidential file; independent Census records validate geography.

`public/data/county-elections/validation.json` records the actual checks. They pass for all three files:

- all accepted FIPS/state pairs exist in the independent Census 2018 registry;
- every vote is a nonnegative integer or explicit missing value;
- normalized candidate identity sets and vote sums exactly match accepted original source rows, including separately retained reporting categories;
- each reporting-unit total is consistent across its source candidate rows and counted once; aggregated totals exactly equal the source listed entry sums;
- accepted/excluded source row accounting is exact; House districts, Senate specials and stages remain distinct;
- all 3,552 supplemental House district identities match the baseline 2018 inventory; exactly 215 records in the six verified at-large states normalize source district 1 to canonical 0, retaining their original values and normalization provenance;
- all four pinned source hashes match.

Accepted/excluded source row counts are Senate **17,290 / 15**, House **16,796 / 463**, Governor **20,859 / 216**. These checks prove faithful source transformation and geographic joins; they do not independently certify every original state's canvass or repair the source's documented limitations.
