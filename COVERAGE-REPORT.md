# V-Map county coverage

Snapshot: November 6, 2026. Counts below are source-backed imported coverage after source reconciliation. They do not assert every historical contest is present.

| Office | Year | States with county returns | Counties on 2017 map | County contest / district portions | Review-held records |
|---|---:|---:|---:|---:|---:|
| president | 2008 | 50 | 3113 | 3115 | 0 |
| president | 2012 | 50 | 3113 | 3115 | 0 |
| president | 2016 | 50 | 3113 | 3114 | 0 |
| president | 2020 | 50 | 3113 | 3113 | 0 |
| president | 2024 | 50 | 3113 | 3113 | 0 |
| senate | 2006 | 33 | 1877 | 1878 | 16 |
| senate | 2008 | 32 | 2286 | 2288 | 0 |
| senate | 2010 | 33 | 2057 | 2058 | 12 |
| senate | 2012 | 33 | 1877 | 1878 | 7 |
| senate | 2014 | 33 | 2290 | 2291 | 11 |
| senate | 2016 | 33 | 2058 | 2058 | 956 |
| senate | 2017 | 1 | 67 | 67 | 0 |
| senate | 2018 | 33 | 1877 | 2046 | 213 |
| senate | 2020 | 33 | 2300 | 2300 | 711 |
| senate | 2021 | 1 | 155 | 310 | 310 |
| senate | 2022 | 33 | 2055 | 2055 | 559 |
| senate | 2024 | 33 | 1875 | 1968 | 108 |
| senate | 2026 | 20 | 1570 | 1570 | 0 |
| house | 2006 | 49 | 3096 | 3787 | 5 |
| house | 2008 | 49 | 3055 | 3694 | 5 |
| house | 2010 | 49 | 3074 | 3728 | 5 |
| house | 2012 | 49 | 3107 | 3768 | 5 |
| house | 2014 | 49 | 3101 | 3753 | 5 |
| house | 2016 | 49 | 3108 | 5016 | 1751 |
| house | 2018 | 49 | 3111 | 3706 | 159 |
| house | 2020 | 49 | 3110 | 4197 | 1431 |
| house | 2022 | 49 | 3095 | 3682 | 1283 |
| house | 2024 | 49 | 3083 | 4903 | 1209 |
| house | 2026 | 27 | 1768 | 2127 | 0 |
| governor | 2006 | 35 | 2148 | 2149 | 63 |
| governor | 2007 | 3 | 266 | 266 | 6 |
| governor | 2008 | 11 | 566 | 566 | 3 |
| governor | 2009 | 2 | 154 | 155 | 0 |
| governor | 2010 | 36 | 2177 | 2178 | 47 |
| governor | 2011 | 4 | 321 | 321 | 0 |
| governor | 2012 | 12 | 638 | 638 | 3 |
| governor | 2013 | 2 | 154 | 154 | 0 |
| governor | 2014 | 35 | 2148 | 2149 | 0 |
| governor | 2015 | 3 | 266 | 266 | 0 |
| governor | 2016 | 12 | 602 | 602 | 0 |
| governor | 2017 | 2 | 154 | 154 | 0 |
| governor | 2018 | 35 | 2149 | 2149 | 26 |
| governor | 2019 | 3 | 266 | 266 | 1 |
| governor | 2020 | 11 | 566 | 566 | 0 |
| governor | 2021 | 3 | 212 | 270 | 135 |
| governor | 2022 | 35 | 2148 | 2148 | 154 |
| governor | 2023 | 3 | 266 | 266 | 0 |
| governor | 2024 | 11 | 564 | 564 | 207 |
| governor | 2025 | 2 | 154 | 154 | 0 |
| governor | 2026 | 18 | 1230 | 1230 | 0 |

- Counts describe imported records, not an assertion every election or county is covered.
- Alaska reports by election district; no unsupported county allocation is made.
- County and district boundaries change over time; 2017 map geometry is a reference.
- Unopposed races with no recorded vote totals remain distinct from missing sources.
- 2026 records are dated provisional snapshots; no certified outcome or race call is inferred.

Raw snapshots are preserved. Runtime overlap resolution is explicit: curated baseline state/district records have priority 95; supplemental priorities appear in `src/coverage-sources.js`. Known baseline defects receive review holds. Higher-priority sources replace a matching geographic contest in the displayed view and retain alternate source references; raw files are unchanged.
