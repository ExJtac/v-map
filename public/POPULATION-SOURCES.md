# County population history

Imported November 6, 2026 from the U.S. Census Bureau. `scripts/import-population.py` rebuilds 65,936 dated records for all 3,142 map counties from preserved, hashed snapshots. All population values describe total residents, including people who cannot vote. No turnout percentage uses population as a voter-eligibility denominator.

| Years displayed | Source | Join and checks |
|---|---|---|
| 2005–2009 | [2000–2010 intercensal county totals](https://www2.census.gov/programs-surveys/popest/datasets/2000-2010/intercensal/county/co-est00int-tot.csv) | County FIPS; each annual county sum equals the source state total. Shannon/Oglala Lakota and Wade Hampton/Kusilvak use documented name/code changes. |
| 2010–2019 | [2010–2020 intercensal county totals](https://www2.census.gov/programs-surveys/popest/tables/2010-2020/intercensal/county/co-est2020int-pop.xlsx) | Exact county name and state join to Census FIPS registry; all 3,143 source rows reconcile to each annual national total. This is the Census-preferred intercensal series for the decade. |
| 2020–2025 | [Vintage 2025 county estimates](https://www2.census.gov/programs-surveys/popest/datasets/2020-2025/counties/totals/co-est2025-alldata.csv) | Exact county FIPS; all six annual county sums reconcile to source state totals. |

The card selects the latest July 1 reference year at or before the selected election year. Map-only mode selects the latest available estimate. Estimates can be revised in a later vintage. The latest released county series is July 1, 2025; a 2026 estimate is not invented. Annual change is calculated only between consecutive years within one source series.

Geographic exceptions:

- The map uses 2017 county outlines. Connecticut's historical eight counties retain [Vintage 2021 estimates](https://www2.census.gov/programs-surveys/popest/datasets/2020-2021/counties/totals/co-est2021-alldata.csv); newer planning regions are not allocated to these old counties. The older reference year and a note appear on the card.
- Valdez-Cordova retains [Vintage 2019 estimates](https://www2.census.gov/programs-surveys/popest/datasets/2010-2019/counties/totals/co-est2019-alldata.csv). Later successor census areas are not allocated onto the old map polygon.
- Bedford County's pre-2013 population is withheld because the former independent city later merged into that county. Neither the city's population nor its elections are silently reassigned.
- Other same-FIPS observations retain the Census source's vintage geography. Historic estimates and modern outlines do not establish an exact historical boundary reconstruction.

Raw files and receipts: `scripts/source-data/population/`. Public data, manifest, and source controls: `public/data/population/`. Unused Census vintages are retained as research evidence; they do not override the series listed above.
