# House and Senate county coverage audit

## Current manual research checkpoint — November 7, 2026

The current machine-readable [research inventory](public/data/research-progress-2026.json) supersedes the historical November 6 table below. **1,065 House counties and 1,563 Senate counties** pass at least one numerical comparison screen. Their respective eligible election scopes contain 3,141 and 2,471 legacy map-reference units; **2,076 House and 908 Senate units in those scopes remain unassessed**. Some require different geography or ballot-round treatment. Screening is not a completed investigation; all flagged cases remain unresolved.

House paired source scopes now cover 1,076 unique county identities across 15 states. At least one numerical rule assesses 1,065; tiny samples, missing parties and Gwinnett's unresolved historical write-in categories can hold individual screens. The approved paired states are AZ, CA, CO, GA, IA, ID, MN, MT, NC, OH, SD, UT, VA, WV and WY. Each state requires all actual per-year county/district portions and independent candidate controls. This is not nationwide completeness.

The fourth batch adds Iowa's 99 and North Carolina's 100 county comparisons. The North Carolina baseline corrects 12 vote cells by +372 from the official archive. Iowa's current vector is a retained saved snapshot, not a newly downloaded live feed. New Mexico's separately approved 2022 source repair adds 167 historical candidate votes and preserves official write-in parties. Its masked 2026 Chaves CD2 cell stays unavailable. Delaware's three current House counties are approved source facts only; its missing historical named write-ins (15 Walker and 3 Shlikas) prevent a paired qualification. Kentucky's current House facts likewise do not qualify its held baseline. Selected-place details and graphs can display approved single-year facts without adding comparison flags.

Senate now includes Delaware's three current county records, independently checked in the original official rendered table and against separate state controls. Delaware uses a date-only capture and raw source clocks with unspecified timezone; no intraday time or certification is inferred. Florida and Ohio comparisons use their separately reviewed 2022 regular / 2026 special Class III seat contracts. The Ohio state-only supplement adds date/seat metadata and changes none of its seven reported counts, clocks or county vectors.

Outstanding acquisition/source holds include Arkansas's missing Phillips House baseline; Kansas Senate's 103 missing current county imports; New Jersey Senate's 17 missing current county imports (four imported does not mean four eligible comparisons); New Mexico's masked current House count; and remaining states without qualified complete House inventories or Senate baselines/current records. A North Dakota official bulk-feed endpoint was identified but its complete 53-county payload was not obtained. These are documented gaps, not evidence of zero votes, normal patterns, or wrongdoing.

The public [coverage page](https://voteranomaly.com/coverage/#congress-review-progress) provides current per-state and screen-specific numbers. Six published source-context cases with eight items remain context only; zero completed investigations. Research scheduling remains paused and publications are manual.

## Archived November 6 inventory

Read-only merged-snapshot audit, November 6, 2026, before new research-house/research-senate registration. All 3,142 atlas county identities were checked using the actual COUNTY_SOURCES/mergeElectionData precedence and holds. County presence does not establish complete House county-district scope. Counts below distinguish source rows from unique counties; a held row is not usable evidence. These are import gaps, not claims that no election occurred.

## Priority handoff

Senate: obtain missing Alabama, Illinois, Kentucky, Mississippi, Nebraska and Tennessee county returns, then the other absent Class II states below. Repair held 2020 baselines in Alabama (67 counties), Texas (254), Idaho (44) and Michigan (83). Preserve Nebraska/Arkansas/South Dakota ballot party labels: absence of a Democratic nominee is not missing votes and does not justify assigning Other to Democrat. Georgia/Louisiana first-round baselines and Florida/Ohio 2026 specials require separate seat/round qualification. Alaska electoral districts cannot be allocated to atlas counties.

House: prioritize missing Alabama, Arizona, Illinois, Indiana, Kentucky, New York, Tennessee, Washington and other absent/partial states below. Demand all published county-district portions and independent district-sum controls; mere county presence cannot establish scope. California has county presence but unresolved historical district controls, and remains unqualified. Montana alone had a frozen full-scope proof in this audit: 57 intersections across 56 counties in both years.

The official [Senate Class II term record](https://www.senate.gov/senators/Class_II.htm) identifies the regular 2020→2026 seat. States with no scheduled Class II regular election are distinguished from absent expected imports. This is not a complete independent audit of every special-election schedule. DC has no voting Senate/House member; its delegate contest requires separate semantics. Hawaii includes Kalawao/jurisdiction caveats; Alaska is geographically incompatible.

## State-by-state inventory

| Office | State | Expected current scope | Atlas counties | Prior counties / rows / holds | Current counties / rows / holds | Prior stages | Current stages |
|---|---|---|---:|---|---|---|---|
| senate | AL (01) | Class2 regular election | 67 | 67/67/67 | 0/0/0 | general |  |
| house | AL (01) | regular election | 67 | 67/73/73 | 0/0/0 | general |  |
| senate | AK (02) | Class2 regular election | 29 | 0/0/0 | 0/0/0 |  |  |
| house | AK (02) | regular election | 29 | 0/0/0 | 0/0/0 |  |  |
| senate | AZ (04) | no Class2 regular election; no imported special established | 15 | 13/13/13 | 0/0/0 | general |  |
| house | AZ (04) | regular election | 15 | 15/30/0 | 0/0/0 | general |  |
| senate | AR (05) | Class2 regular election | 75 | 75/75/0 | 75/75/0 | general | general |
| house | AR (05) | regular election | 75 | 74/77/0 | 75/78/0 | general | general |
| senate | CA (06) | no Class2 regular election; no imported special established | 58 | 0/0/0 | 0/0/0 |  |  |
| house | CA (06) | regular election | 58 | 58/130/1 | 58/144/0 | general | general |
| senate | CO (08) | Class2 regular election | 64 | 64/64/0 | 64/64/0 | general | general |
| house | CO (08) | regular election | 64 | 64/82/0 | 64/82/0 | general | general |
| senate | CT (09) | no Class2 regular election; no imported special established | 8 | 0/0/0 | 0/0/0 |  |  |
| house | CT (09) | regular election | 8 | 8/18/0 | 0/0/0 | general |  |
| senate | DE (10) | Class2 regular election | 3 | 3/3/0 | 0/0/0 | general |  |
| house | DE (10) | regular election | 3 | 3/3/0 | 0/0/0 | general |  |
| senate | DC (11) | no Senate representation | 1 | 0/0/0 | 0/0/0 |  |  |
| house | DC (11) | DC nonvoting delegate | 1 | 0/0/0 | 0/0/0 |  |  |
| senate | FL (12) | special election | 67 | 0/0/0 | 67/67/0 |  | general |
| house | FL (12) | regular election | 67 | 67/94/94 | 67/98/0 | general | general |
| senate | GA (13) | Class2 regular election | 159 | 159/159/0 | 159/159/0 | first round | general |
| house | GA (13) | regular election | 159 | 159/180/0 | 159/181/0 | general | general |
| senate | HI (15) | no Class2 regular election; no imported special established | 5 | 0/0/0 | 0/0/0 |  |  |
| house | HI (15) | regular election | 5 | 4/5/0 | 0/0/0 | general |  |
| senate | ID (16) | Class2 regular election | 44 | 44/44/44 | 44/44/0 | general | general |
| house | ID (16) | regular election | 44 | 44/45/45 | 44/45/0 | general | general |
| senate | IL (17) | Class2 regular election | 102 | 102/102/0 | 0/0/0 | general |  |
| house | IL (17) | regular election | 102 | 102/155/0 | 0/0/0 | general |  |
| senate | IN (18) | no Class2 regular election; no imported special established | 92 | 0/0/0 | 0/0/0 |  |  |
| house | IN (18) | regular election | 92 | 92/100/100 | 0/0/0 | general |  |
| senate | IA (19) | Class2 regular election | 99 | 99/99/0 | 99/99/0 | general | general |
| house | IA (19) | regular election | 99 | 99/99/0 | 99/99/0 | general | general |
| senate | KS (20) | Class2 regular election | 105 | 105/105/0 | 2/2/0 | general | general |
| house | KS (20) | regular election | 105 | 105/109/0 | 1/1/0 | general | general |
| senate | KY (21) | Class2 regular election | 120 | 120/120/0 | 0/0/0 | general |  |
| house | KY (21) | regular election | 120 | 120/126/0 | 0/0/0 | general |  |
| senate | LA (22) | Class2 regular election | 64 | 64/64/0 | 64/64/0 | first round | general |
| house | LA (22) | regular election | 64 | 49/63/0 | 64/79/0 | general | general |
| senate | ME (23) | Class2 regular election | 16 | 16/16/16 | 0/0/0 | general |  |
| house | ME (23) | regular election | 16 | 16/17/0 | 0/0/0 | general |  |
| senate | MD (24) | no Class2 regular election; no imported special established | 24 | 0/0/0 | 0/0/0 |  |  |
| house | MD (24) | regular election | 24 | 24/33/33 | 23/23/0 | general | general |
| senate | MA (25) | Class2 regular election | 14 | 14/14/0 | 0/0/0 | general |  |
| house | MA (25) | regular election | 14 | 14/36/0 | 0/0/0 | general |  |
| senate | MI (26) | Class2 regular election | 83 | 83/83/83 | 2/2/0 | general | general |
| house | MI (26) | regular election | 83 | 83/103/103 | 2/4/0 | general | general |
| senate | MN (27) | Class2 regular election | 87 | 87/87/0 | 87/87/0 | general | general |
| house | MN (27) | regular election | 87 | 87/99/0 | 87/99/0 | general | general |
| senate | MS (28) | Class2 regular election | 82 | 82/82/82 | 0/0/0 | general |  |
| house | MS (28) | regular election | 82 | 82/86/86 | 0/0/0 | general |  |
| senate | MO (29) | no Class2 regular election; no imported special established | 115 | 0/0/0 | 0/0/0 |  |  |
| house | MO (29) | regular election | 115 | 115/125/0 | 114/123/0 | general | general |
| senate | MT (30) | Class2 regular election | 56 | 56/56/0 | 56/56/0 | general | general |
| house | MT (30) | regular election | 56 | 56/57/0 | 56/57/0 | general | general |
| senate | NE (31) | Class2 regular election | 93 | 93/93/0 | 0/0/0 | general |  |
| house | NE (31) | regular election | 93 | 93/95/0 | 0/0/0 | general |  |
| senate | NV (32) | no Class2 regular election; no imported special established | 17 | 0/0/0 | 0/0/0 |  |  |
| house | NV (32) | regular election | 17 | 17/20/0 | 0/0/0 | general |  |
| senate | NH (33) | Class2 regular election | 10 | 10/10/10 | 0/0/0 | general |  |
| house | NH (33) | regular election | 10 | 10/15/15 | 0/0/0 | general |  |
| senate | NJ (34) | Class2 regular election | 21 | 21/21/0 | 4/4/0 | general | general |
| house | NJ (34) | regular election | 21 | 21/41/0 | 2/5/0 | general | general |
| senate | NM (35) | Class2 regular election | 33 | 33/33/0 | 0/0/0 | general |  |
| house | NM (35) | regular election | 33 | 33/43/0 | 0/0/0 | general |  |
| senate | NY (36) | no Class2 regular election; no imported special established | 62 | 0/0/0 | 0/0/0 |  |  |
| house | NY (36) | regular election | 62 | 62/87/87 | 0/0/0 | general |  |
| senate | NC (37) | Class2 regular election | 100 | 100/100/0 | 100/100/0 | general | general |
| house | NC (37) | regular election | 100 | 100/113/0 | 100/115/0 | general | general |
| senate | ND (38) | no Class2 regular election; no imported special established | 53 | 0/0/0 | 0/0/0 |  |  |
| house | ND (38) | regular election | 53 | 53/53/53 | 0/0/0 | general |  |
| senate | OH (39) | special election | 88 | 0/0/0 | 88/88/0 |  | general |
| house | OH (39) | regular election | 88 | 88/102/0 | 88/103/0 | general | general |
| senate | OK (40) | Class2 regular election | 77 | 77/77/77 | 0/0/0 | general |  |
| house | OK (40) | regular election | 77 | 77/84/84 | 0/0/0 | general |  |
| senate | OR (41) | Class2 regular election | 36 | 36/36/36 | 0/0/0 | general |  |
| house | OR (41) | regular election | 36 | 36/48/48 | 0/0/0 | general |  |
| senate | PA (42) | no Class2 regular election; no imported special established | 67 | 0/0/0 | 0/0/0 |  |  |
| house | PA (42) | regular election | 67 | 67/84/0 | 67/84/0 | general | general |
| senate | RI (44) | Class2 regular election | 5 | 5/5/0 | 0/0/0 | general |  |
| house | RI (44) | regular election | 5 | 5/6/0 | 0/0/0 | general |  |
| senate | SC (45) | Class2 regular election | 46 | 46/46/0 | 46/46/0 | general | general |
| house | SC (45) | regular election | 46 | 46/56/0 | 46/56/0 | general | general |
| senate | SD (46) | Class2 regular election | 66 | 66/66/0 | 66/66/0 | general | general |
| house | SD (46) | regular election | 66 | 66/66/0 | 66/66/0 | general | general |
| senate | TN (47) | Class2 regular election | 95 | 95/95/95 | 0/0/0 | general |  |
| house | TN (47) | regular election | 95 | 95/106/106 | 0/0/0 | general |  |
| senate | TX (48) | Class2 regular election | 254 | 254/254/254 | 254/254/0 | general | general |
| house | TX (48) | regular election | 254 | 254/311/311 | 254/310/0 | general | general |
| senate | UT (49) | no Class2 regular election; no imported special established | 29 | 0/0/0 | 0/0/0 |  |  |
| house | UT (49) | regular election | 29 | 29/36/36 | 29/32/0 | general | general |
| senate | VT (50) | no Class2 regular election; no imported special established | 14 | 0/0/0 | 0/0/0 |  |  |
| house | VT (50) | regular election | 14 | 14/14/7 | 14/14/0 | general | general |
| senate | VA (51) | Class2 regular election | 133 | 133/133/0 | 133/133/0 | general | general |
| house | VA (51) | regular election | 133 | 133/145/0 | 133/145/0 | general | general |
| senate | WA (53) | no Class2 regular election; no imported special established | 39 | 0/0/0 | 0/0/0 |  |  |
| house | WA (53) | regular election | 39 | 39/49/0 | 39/50/0 | general | general |
| senate | WV (54) | Class2 regular election | 55 | 55/55/0 | 0/0/0 | general |  |
| house | WV (54) | regular election | 55 | 55/55/0 | 0/0/0 | general |  |
| senate | WI (55) | no Class2 regular election; no imported special established | 72 | 0/0/0 | 0/0/0 |  |  |
| house | WI (55) | regular election | 72 | 72/85/0 | 2/4/0 | general | general |
| senate | WY (56) | Class2 regular election | 23 | 23/23/0 | 0/0/0 | general |  |
| house | WY (56) | regular election | 23 | 23/23/0 | 0/0/0 | general |  |

## Webb and broad Texas change

The same 254 Texas county identities have regular Governor rows in both years. Matched source sums: 2022 D3,554,772/R4,437,097; 2026 D5,230,789/R4,524,527, or D+47.148368% and R+1.970432%. Webb: 2022 D27,156/R16,409; 2026 D40,593/R17,299, or D+49.480778% (+13,437) and R+5.423853% (+890). The eligible county-median Democratic growth was59.107807%; Webb therefore was not unusually high relative to those peers. A state-peer screen removes common statewide patterns; it does not establish that a large own-county change is ordinary in an everyday sense. The newly requested own-history review policy handles such changes uniformly without a Webb exception.

Webb2022 raw MEDSL precinct vector reconciled exactly (323 Governor rows, TOTAL mode, GEN, special FALSE, 2022-11-08); the pinned2026 mirror Governor seven-candidate vector also reconciled exactly to58,776 race votes. No mismatched county set, ballot round or year was found in those checks. This does not independently certify the2026 counts. The2026 Texas count-update timestamp is unavailable; retrieval time2026-11-06T15:07:47Z is not a count-update time, completion claim or November6 live feed. Candidate changes and reporting progress limit interpretation. These are candidate counts, never ballots or turnout.

Sources: [official Texas results portal](https://goelect.txelections.civixapps.com/ivis-enr-ui/races), [pinned2026 snapshot](https://raw.githubusercontent.com/pushbuild/us-2026-election-results/73b20975fc0a66da90688d372b4c619609fee9cb/data/tx.csv), [pinned MEDSL2022 Texas archive](https://raw.githubusercontent.com/MEDSL/2022-elections-official/a8126c5790b8d1f438a3e63c3506cdcdc7406d9f/individual_states/2022-tx-local-precinct-general.zip). Raw SHA256:2026 Texas14a7e565c032909982b4f05475ab6ddbe28de77219f95cea990f756b66bb6b13;2022 archivea0a07ea481572afdb714cb25b2655e859badc74337a755955b2316a57a209e56.

## New research batches awaiting independent review

Researchers delivered separate frozen bundles after this inventory: research-senate (Alabama2026/2020 and Nebraska2026) and research-house (Arizona2022/2026). Their own validators are not represented here as this coordinator’s independent verification. Root controls registration and qualification. The inventory is intentionally a pre-registration snapshot and must be rerun for coverage gains after integration.

## Checks and limits

Checked actual merged county IDs, row/unique-county counts, stages, special flags, source holds and missing atlas identities for each state/office/year (102 state-office rows). Exact machine-readable snapshot was generated locally at /tmp/vmap-house-senate-state-audit.json; this document is its durable human-readable inventory. No source artifacts were edited, no votes allocated, no network/provider calls made for the inventory. Missing source coverage cannot receive a review border solely for being missing.
