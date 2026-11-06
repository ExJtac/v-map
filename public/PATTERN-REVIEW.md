# 2026 county pattern review

Snapshot audit: November 6, 2026. Schema 3. All 3142 atlas counties have explicit assessed/not-assessed statuses. Borders flag provisional changes for review, never fraud, errors, race calls or certified outcomes. Missing coverage alone never causes a border.

## Own-history review rules

These transparent thresholds are application screening choices. They are not probability estimates and were changed at the user’s request to highlight substantial own-county changes even when similar changes occur statewide. Each criterion independently triggers a review; no state-peer outlier test can veto it. Democratic and Republican rules, increases and decreases are symmetric. A numerical tolerance of1e-10 handles inclusive boundaries.

- **A — Party counts:** absolute count change ≥40%, absolute opposing-party change ≤15%, and absolute own-party count difference ≥100. Require at least500 two-party votes in both years and100 votes for each prior party. Democratic gains/Republican losses point Democratic; Republican gains/Democratic losses point Republican.
- **B — Reported race votes:** absolute change ≥40% and ≥100 votes; at least500 reported candidate/write-in race votes each year. Sum supplied candidate vectors and explicitly classified separate write-ins. Exclude overvotes, undervotes, invalid/blank/spoiled/exhausted categories and reported ballot totals. Withhold unknown or unitemized categories rather than guess their meaning. Never call these totals ballots or turnout.
- **C1 — Actual ballots per resident:** absolute own-history change ≥10 percentage points, at least100 explicitly reported ballots and1,000 residents each year. Current2026 ballots use exact2025 Census population; historical2022 ballots use exact2022 population and a final/certified historical ballot record. No peer minimum. Candidate votes never substitute for ballots.
- **C2 — Race votes per resident:** absolute change ≥10pp in qualified candidate/write-in race votes per100 residents, using exact2025 population for2026 and exact baseline-year population for the prior contest. Race minimums above and at least1,000 residents each year. This is explicitly a **race-vote proxy**, never actual ballots or eligible-voter turnout.
- **D — Party share:** absolute own-county Democratic/Republican two-party-share swing ≥10pp, with the same party minimums asA. Other votes stay unassigned.

All resident measures include children and other people ineligible to vote. No ACS data is used. Reporting progress, candidate differences and election-cycle differences limit interpretation. In particular, Senate2020 was a presidential election year while2026 is a midterm; broad race-vote/population differences can reflect that normal cycle distinction. The snapshot may be incomplete even when all precincts are marked reported.

## Qualified comparison scopes and holds

Governor uses a fixed2022→2026 comparison, including states with two-year terms; this is not labeled the immediately previous election. Senate uses [official Class II seat/term identity](https://www.senate.gov/senators/Class_II.htm) plus unique regular/general/non-special2020→2026 county contests. Georgia/Louisiana2020 first-round ambiguity and Florida/Ohio2026 specials remain withheld. There is no2026 presidential election.

House is qualified for two separately frozen scope proofs: Montana57 county-district intersections across56 counties, and Arizona30 intersections across15 counties/all9districts, each in both2022/2026. Every published portion is summed countywide; district summaries are never allocated to counties. Exact inventories/source hashes are in `comparabilityContracts.montanaHouse` and `.azHouse`; changes disable the affected qualification. Scope completeness is not counting completion. The baseline was checked against separate MEDSL district returns, not an independently downloaded FEC canvass. Source: [Montana official statewide export](https://electionresults.mt.gov/ResultsExport.aspx), provisional. Arizona sources are the official2026export and certified2022canvass saved as primary-PDF web-text extraction (not PDF bytes, direct request403);75candidate/write-in controls passed. Arizona2026scope is complete, counting is not declared complete. New registered Alabama/Nebraska Senate sources retain exact ballot party labels; Nebraska has no Democratic nominee and is not reassigned. Alabama2020Perry’s unknown write-in dash remains held. Staged New Mexico data is excluded. All other House scope remains unqualified until separately proved.

Source holds, missing/null/nonintegral counts, explicit incomplete coverage, incompatible boundaries/jurisdictions, unmatched rounds and provisional historical baselines remain excluded. Party screens also withhold unitemized candidates or unclassified categories. Race-total screens can assess a valid race with no Democratic nominee without assigning Other votes to Democrat. A known ballot-accounting category is excluded from race totals; an unknown category withholds the total. Update/retrieval/as-of timestamps remain separate; unknown update time stays null.

## Peer context is not a border rule

Legacy `shareShift` and `partyGrowth` retain the advanced symmetric peer screens as context, including medians, MAD and modifiedz. They are excluded from the border flag union. [NIST/SEMATECH](https://itl.nist.gov/div898/handbook/eda/section3/eda35h.htm) describes the exploratory modified-z method:0.6745×(value−median)/MAD. At MAD0 z is null and prior absolute guards remain only in the context screens. These statistics are neither calibrated probabilities nor prerequisites forA–D.

## Coverage and findings

| Screen | Office | Assessed | Not assessed | Flagged counties |
|---|---|---:|---:|---:|
| Actual ballots/residents | global | 58 | 3084 | 22 |
| partyCountChange | president | 0 | 3142 | 0 |
| partyCountChange | senate | 647 | 2495 | 26 |
| partyCountChange | house | 57 | 3085 | 17 |
| partyCountChange | governor | 1051 | 2091 | 290 |
| raceVoteChange | president | 0 | 3142 | 0 |
| raceVoteChange | senate | 873 | 2269 | 11 |
| raceVoteChange | house | 67 | 3075 | 0 |
| raceVoteChange | governor | 1080 | 2062 | 50 |
| racePopulationChange | president | 0 | 3142 | 0 |
| racePopulationChange | senate | 870 | 2272 | 654 |
| racePopulationChange | house | 67 | 3075 | 0 |
| racePopulationChange | governor | 1078 | 2064 | 76 |
| shareSwing | president | 0 | 3142 | 0 |
| shareSwing | senate | 647 | 2495 | 89 |
| shareSwing | house | 57 | 3085 | 9 |
| shareSwing | governor | 1051 | 2091 | 295 |
| Own-history union | president | 0 | 3142 | 0 |
| Own-history union | senate | 873 | 2269 | 661 |
| Own-history union | house | 67 | 3075 | 19 |
| Own-history union | governor | 1080 | 2062 | 495 |

## State-broad party context

These totals use only qualified party-comparison counties, not necessarily complete states. Percent changes are weighted count changes; county medians are unweighted. Shared statewide change is visible here and is never removed from the own-history flags. All2026 counts remain provisional.

| Office | State FIPS | Qualified counties | D count change % | R count change % | County median D % | County median R % | Union flagged counties |
|---|---|---:|---:|---:|---:|---:|---:|
| senate | 19 | 99 | -9.639416 | -27.460673 | -15.319321 | -28.067819 | 85 |
| senate | 20 | 1 | -7.706713 | -27.206036 | -7.706713 | -27.206036 | 1 |
| senate | 27 | 87 | -2.91461 | -11.778821 | -13.85948 | -9.542137 | 13 |
| senate | 30 | 49 | -78.514084 | -30.117476 | -76.836158 | -29.915433 | 52 |
| senate | 34 | 4 | -32.467817 | -44.084248 | -33.548481 | -43.734695 | 4 |
| senate | 37 | 100 | -3.969003 | -38.359498 | -6.964974 | -36.332722 | 100 |
| senate | 45 | 46 | -6.175303 | -30.541867 | -13.172764 | -33.312401 | 43 |
| senate | 51 | 133 | -11.451855 | -28.803241 | -15.097717 | -26.001551 | 100 |
| senate | 01 | 66 | -17.584599 | -34.072787 | -25.238434 | -33.877925 | 61 |
| senate | 08 | 62 | -25.359246 | -46.776757 | -11.739711 | -32.962563 | 57 |
| house | 30 | 43 | 27.460573 | 2.112161 | 27.477785 | 0.45403 | 16 |
| house | 04 | 14 | 28.623915 | -20.083501 | 5.524644 | -17.186835 | 3 |
| governor | 12 | 67 | 29.563215 | -10.443285 | 30.758455 | -11.755539 | 18 |
| governor | 13 | 157 | 25.078054 | -9.611099 | 22.129436 | -9.859836 | 32 |
| governor | 16 | 41 | -4.082979 | -43.192694 | 7.692308 | -40.52515 | 41 |
| governor | 19 | 99 | 55.82317 | -14.762027 | 71.611253 | -15.712799 | 97 |
| governor | 24 | 23 | -3.8668 | -0.494822 | -3.073342 | 1.810047 | 0 |
| governor | 26 | 2 | 13.839592 | 5.58802 | 4.593915 | 6.891774 | 0 |
| governor | 27 | 87 | 19.609342 | 7.735318 | 13.523557 | 7.598231 | 1 |
| governor | 39 | 88 | 55.560991 | -20.953688 | 61.88121 | -17.454655 | 85 |
| governor | 42 | 67 | -0.724605 | -14.785799 | -3.495022 | -15.912637 | 0 |
| governor | 46 | 61 | -9.643515 | -10.970986 | -13.850416 | -10.931845 | 5 |
| governor | 48 | 222 | 47.127695 | 2.026044 | 59.099358 | -3.455213 | 178 |
| governor | 55 | 2 | 8.050347 | -8.323163 | 8.007559 | -7.244325 | 0 |
| governor | 04 | 15 | 2.833392 | -19.548614 | 1.625124 | -18.383797 | 0 |
| governor | 06 | 58 | -11.10599 | -29.677931 | -10.803829 | -36.20332 | 31 |
| governor | 08 | 62 | -11.384776 | -27.200739 | -4.802965 | -15.158922 | 7 |

## Webb control, without a county exception

Webb D27156→40593 (49.480778%), R16409→17299 (5.423853%). RuleAflags it because the same40%/15%/100-vote criteria apply everywhere; no peer veto or Webb override exists. Its old advanced peer-growth result remains context. Source update time isunknown; retrieval is2026-11-06T15:07:47+00:00. Retrieval is not a count-update or completion claim.

## Not-assessed reasons

### Actual ballots/residents

- 3084: Actual countywide 2026 regular-November ballots unavailable; candidate votes are not substituted.

### president: partyCountChange

- 3142: No 2026 presidential election; office-specific shift screen not applicable.

### senate: partyCountChange

- 1572: No imported 2026 county contest for this office.
- 301: Source quality hold or inconsistent totals.
- 235: Both explicitly identified Democratic and Republican candidates are required; Other votes are not reassigned.
- 223: Georgia/Louisiana 2020 Senate ballot-round comparability is not established.
- 155: A unique regular current county contest is not established.
- 9: Two-party minimum of 500 each year or 100 votes for each prior party not met.

### house: partyCountChange

- 1697: Complete comparable county-district coverage and county identity are not established; no district allocation is inferred.
- 1374: No imported 2026 county contest for this office.
- 14: Two-party minimum of 500 each year or 100 votes for each prior party not met.

### governor: partyCountChange

- 1912: No imported 2026 county contest for this office.
- 121: Source quality hold or inconsistent totals.
- 43: Two-party minimum of 500 each year or 100 votes for each prior party not met.
- 13: Unitemized candidates or unclassified/missing reporting categories prevent a qualified party comparison.
- 1: Both explicitly identified Democratic and Republican candidates are required; Other votes are not reassigned.
- 1: A unique matching regular 2022 county contest is unavailable.

### president: raceVoteChange

- 3142: No 2026 presidential election; office-specific shift screen not applicable.

### senate: raceVoteChange

- 1572: No imported 2026 county contest for this office.
- 301: Source quality hold or inconsistent totals.
- 223: Georgia/Louisiana 2020 Senate ballot-round comparability is not established.
- 155: A unique regular current county contest is not established.
- 18: Fewer than 500 reported candidate/write-in race votes in either year.

### house: raceVoteChange

- 1697: Complete comparable county-district coverage and county identity are not established; no district allocation is inferred.
- 1374: No imported 2026 county contest for this office.
- 4: Fewer than 500 reported candidate/write-in race votes in either year.

### governor: raceVoteChange

- 1912: No imported 2026 county contest for this office.
- 121: Source quality hold or inconsistent totals.
- 15: Fewer than 500 reported candidate/write-in race votes in either year.
- 13: Unclassified, missing or unitemized reporting categories prevent a qualified race-vote total.
- 1: A unique matching regular 2022 county contest is unavailable.

### president: racePopulationChange

- 3142: No 2026 presidential election; office-specific shift screen not applicable.

### senate: racePopulationChange

- 1572: No imported 2026 county contest for this office.
- 301: Source quality hold or inconsistent totals.
- 223: Georgia/Louisiana 2020 Senate ballot-round comparability is not established.
- 155: A unique regular current county contest is not established.
- 18: Fewer than 500 reported candidate/write-in race votes in either year.
- 3: Exact 2025 and 2020 resident populations unavailable or below 1,000.

### house: racePopulationChange

- 1697: Complete comparable county-district coverage and county identity are not established; no district allocation is inferred.
- 1374: No imported 2026 county contest for this office.
- 4: Fewer than 500 reported candidate/write-in race votes in either year.

### governor: racePopulationChange

- 1912: No imported 2026 county contest for this office.
- 121: Source quality hold or inconsistent totals.
- 15: Fewer than 500 reported candidate/write-in race votes in either year.
- 13: Unclassified, missing or unitemized reporting categories prevent a qualified race-vote total.
- 2: Exact 2025 and 2022 resident populations unavailable or below 1,000.
- 1: A unique matching regular 2022 county contest is unavailable.

### president: shareSwing

- 3142: No 2026 presidential election; office-specific shift screen not applicable.

### senate: shareSwing

- 1572: No imported 2026 county contest for this office.
- 301: Source quality hold or inconsistent totals.
- 235: Both explicitly identified Democratic and Republican candidates are required; Other votes are not reassigned.
- 223: Georgia/Louisiana 2020 Senate ballot-round comparability is not established.
- 155: A unique regular current county contest is not established.
- 9: Two-party minimum of 500 each year or 100 votes for each prior party not met.

### house: shareSwing

- 1697: Complete comparable county-district coverage and county identity are not established; no district allocation is inferred.
- 1374: No imported 2026 county contest for this office.
- 14: Two-party minimum of 500 each year or 100 votes for each prior party not met.

### governor: shareSwing

- 1912: No imported 2026 county contest for this office.
- 121: Source quality hold or inconsistent totals.
- 43: Two-party minimum of 500 each year or 100 votes for each prior party not met.
- 13: Unitemized candidates or unclassified/missing reporting categories prevent a qualified party comparison.
- 1: Both explicitly identified Democratic and Republican candidates are required; Other votes are not reassigned.
- 1: A unique matching regular 2022 county contest is unavailable.

## Flag index and evidence

Full exact current/prior counts, own changes, peer context, source dates, inclusion/exclusion categories, source IDs/URLs and qualification contracts are retained in [anomalies-2026.json](data/anomalies-2026.json). This index lists every triggered rule; one county may trigger several. Neutral count/ratio flags never acquire a party direction. Conflicting party directions return `mixed`.

| County FIPS | County | Office | Rule | Direction | Change evidence | Source IDs |
|---|---|---|---|---|---|---|
| 12005 | Bay | governor | governor-party-count-change | democrat | Democrat: 46.810021%; opponent -7.992014% | modern-official-fl-2026; modern-medsl-governor-2022-fl |
| 12019 | Clay | governor | governor-party-count-change | democrat | Democrat: 45.27426%; opponent -12.025204% | modern-official-fl-2026; modern-medsl-governor-2022-fl |
| 12019 | Clay | governor | governor-share-swing | democrat | D share 10.456666pp | modern-official-fl-2026; modern-medsl-governor-2022-fl |
| 12027 | DeSoto | governor | governor-party-count-change | democrat | Democrat: 58.675235%; opponent -14.147958% | modern-official-fl-2026; modern-medsl-governor-2022-fl |
| 12027 | DeSoto | governor | governor-share-swing | democrat | D share 12.674748pp | modern-official-fl-2026; modern-medsl-governor-2022-fl |
| 12031 | Duval | governor | governor-share-swing | democrat | D share 11.466573pp | modern-official-fl-2026; modern-medsl-governor-2022-fl |
| 12033 | Escambia | governor | governor-share-swing | democrat | D share 10.145582pp | modern-official-fl-2026; modern-medsl-governor-2022-fl |
| 12043 | Glades | governor | governor-party-count-change | democrat | Democrat: 51.733703%; opponent -14.914267% | modern-official-fl-2026; modern-medsl-governor-2022-fl |
| 12043 | Glades | governor | governor-share-swing | democrat | D share 10.463058pp | modern-official-fl-2026; modern-medsl-governor-2022-fl |
| 12049 | Hardee | governor | governor-party-count-change | democrat | Democrat: 103.688093%; opponent -13.07591% | modern-official-fl-2026; modern-medsl-governor-2022-fl |
| 12049 | Hardee | governor | governor-share-swing | democrat | D share 15.557887pp | modern-official-fl-2026; modern-medsl-governor-2022-fl |
| 12051 | Hendry | governor | governor-party-count-change | democrat | Democrat: 111.25731%; opponent -9.797848% | modern-official-fl-2026; modern-medsl-governor-2022-fl |
| 12051 | Hendry | governor | governor-share-swing | democrat | D share 18.862686pp | modern-official-fl-2026; modern-medsl-governor-2022-fl |
| 12057 | Hillsborough | governor | governor-share-swing | democrat | D share 10.532823pp | modern-official-fl-2026; modern-medsl-governor-2022-fl |
| 12059 | Holmes | governor | governor-party-count-change | democrat | Democrat: 45.028143%; opponent -14.950113% | modern-official-fl-2026; modern-medsl-governor-2022-fl |
| 12069 | Lake | governor | governor-party-count-change | democrat | Democrat: 40.067327%; opponent -4.636041% | modern-official-fl-2026; modern-medsl-governor-2022-fl |
| 12093 | Okeechobee | governor | governor-party-count-change | democrat | Democrat: 61.231361%; opponent -13.217471% | modern-official-fl-2026; modern-medsl-governor-2022-fl |
| 12093 | Okeechobee | governor | governor-share-swing | democrat | D share 11.428711pp | modern-official-fl-2026; modern-medsl-governor-2022-fl |
| 12095 | Orange | governor | governor-share-swing | democrat | D share 11.412429pp | modern-official-fl-2026; modern-medsl-governor-2022-fl |
| 12097 | Osceola | governor | governor-party-count-change | democrat | Democrat: 61.075822%; opponent -2.512424% | modern-official-fl-2026; modern-medsl-governor-2022-fl |
| 12097 | Osceola | governor | governor-share-swing | democrat | D share 12.448123pp | modern-official-fl-2026; modern-medsl-governor-2022-fl |
| 12101 | Pasco | governor | governor-share-swing | democrat | D share 10.089086pp | modern-official-fl-2026; modern-medsl-governor-2022-fl |
| 12105 | Polk | governor | governor-party-count-change | democrat | Democrat: 49.998753%; opponent -10.281679% | modern-official-fl-2026; modern-medsl-governor-2022-fl |
| 12105 | Polk | governor | governor-share-swing | democrat | D share 12.384533pp | modern-official-fl-2026; modern-medsl-governor-2022-fl |
| 12111 | St. Lucie | governor | governor-party-count-change | democrat | Democrat: 42.677875%; opponent -8.678166% | modern-official-fl-2026; modern-medsl-governor-2022-fl |
| 12111 | St. Lucie | governor | governor-share-swing | democrat | D share 11.033282pp | modern-official-fl-2026; modern-medsl-governor-2022-fl |
| 12117 | Seminole | governor | governor-share-swing | democrat | D share 11.046566pp | modern-official-fl-2026; modern-medsl-governor-2022-fl |
| 13003 | Atkinson | governor | governor-party-count-change | democrat | Democrat: 48.179872%; opponent -12.393888% | modern-current-2026-ga; modern-medsl-governor-2022-ga |
| 13005 | Bacon | governor | governor-party-count-change | democrat | Democrat: 40.966921%; opponent -10.416667% | modern-current-2026-ga; modern-medsl-governor-2022-ga |
| 13011 | Banks | governor | governor-party-count-change | democrat | Democrat: 65.074135%; opponent -5.442791% | modern-current-2026-ga; modern-medsl-governor-2022-ga |
| 13013 | Barrow | governor | governor-party-count-change | democrat | Democrat: 70.447394%; opponent -6.137498% | modern-current-2026-ga; modern-medsl-governor-2022-ga |
| 13013 | Barrow | governor | governor-share-swing | democrat | D share 12.727014pp | modern-current-2026-ga; modern-medsl-governor-2022-ga |
| 13015 | Bartow | governor | governor-party-count-change | democrat | Democrat: 57.736266%; opponent -6.502157% | modern-current-2026-ga; modern-medsl-governor-2022-ga |
| 13025 | Brantley | governor | governor-party-count-change | democrat | Democrat: 45.038168%; opponent -9.01034% | modern-current-2026-ga; modern-medsl-governor-2022-ga |
| 13029 | Bryan | governor | governor-party-count-change | democrat | Democrat: 44.952951%; opponent -7.983262% | modern-current-2026-ga; modern-medsl-governor-2022-ga |
| 13047 | Catoosa | governor | governor-party-count-change | democrat | Democrat: 43.360752%; opponent -12.389425% | modern-current-2026-ga; modern-medsl-governor-2022-ga |
| 13057 | Cherokee | governor | governor-party-count-change | democrat | Democrat: 42.70565%; opponent -5.70968% | modern-current-2026-ga; modern-medsl-governor-2022-ga |
| 13071 | Colquitt | governor | governor-party-count-change | democrat | Democrat: 41.09538%; opponent -12.302231% | modern-current-2026-ga; modern-medsl-governor-2022-ga |
| 13085 | Dawson | governor | governor-party-count-change | democrat | Democrat: 57.744937%; opponent -3.863447% | modern-current-2026-ga; modern-medsl-governor-2022-ga |
| 13097 | Douglas | governor | governor-share-swing | democrat | D share 10.970876pp | modern-current-2026-ga; modern-medsl-governor-2022-ga |
| 13103 | Effingham | governor | governor-party-count-change | democrat | Democrat: 40.478315%; opponent -10.249067% | modern-current-2026-ga; modern-medsl-governor-2022-ga |
| 13115 | Floyd | governor | governor-party-count-change | democrat | Democrat: 41.629535%; opponent -11.6799% | modern-current-2026-ga; modern-medsl-governor-2022-ga |
| 13117 | Forsyth | governor | governor-party-count-change | democrat | Democrat: 42.308814%; opponent -8.129149% | modern-current-2026-ga; modern-medsl-governor-2022-ga |
| 13119 | Franklin | governor | governor-party-count-change | democrat | Democrat: 43.881857%; opponent -7.667442% | modern-current-2026-ga; modern-medsl-governor-2022-ga |
| 13123 | Gilmer | governor | governor-party-count-change | democrat | Democrat: 45.572139%; opponent -7.354418% | modern-current-2026-ga; modern-medsl-governor-2022-ga |
| 13129 | Gordon | governor | governor-party-count-change | democrat | Democrat: 66.934014%; opponent -10.385553% | modern-current-2026-ga; modern-medsl-governor-2022-ga |
| 13135 | Gwinnett | governor | governor-share-swing | democrat | D share 11.047402pp | modern-current-2026-ga; modern-medsl-governor-2022-ga |
| 13137 | Habersham | governor | governor-party-count-change | democrat | Democrat: 56.546081%; opponent -5.016192% | modern-current-2026-ga; modern-medsl-governor-2022-ga |
| 13139 | Hall | governor | governor-party-count-change | democrat | Democrat: 63.27382%; opponent -7.759885% | modern-current-2026-ga; modern-medsl-governor-2022-ga |
| 13139 | Hall | governor | governor-share-swing | democrat | D share 11.407101pp | modern-current-2026-ga; modern-medsl-governor-2022-ga |
| 13143 | Haralson | governor | governor-party-count-change | democrat | Democrat: 43.138937%; opponent -7.05905% | modern-current-2026-ga; modern-medsl-governor-2022-ga |
| 13151 | Henry | governor | governor-share-swing | democrat | D share 11.468706pp | modern-current-2026-ga; modern-medsl-governor-2022-ga |
| 13157 | Jackson | governor | governor-party-count-change | democrat | Democrat: 81.365314%; opponent -0.392785% | modern-current-2026-ga; modern-medsl-governor-2022-ga |
| 13157 | Jackson | governor | governor-share-swing | democrat | D share 10.214942pp | modern-current-2026-ga; modern-medsl-governor-2022-ga |
| 13183 | Long | governor | governor-party-count-change | democrat | Democrat: 57.172557%; opponent -8.627717% | modern-current-2026-ga; modern-medsl-governor-2022-ga |
| 13183 | Long | governor | governor-share-swing | democrat | D share 12.851614pp | modern-current-2026-ga; modern-medsl-governor-2022-ga |
| 13213 | Murray | governor | governor-party-count-change | democrat | Democrat: 91.810345%; opponent -11.22449% | modern-current-2026-ga; modern-medsl-governor-2022-ga |
| 13217 | Newton | governor | governor-share-swing | democrat | D share 10.922561pp | modern-current-2026-ga; modern-medsl-governor-2022-ga |
| 13223 | Paulding | governor | governor-party-count-change | democrat | Democrat: 51.201677%; opponent -7.551373% | modern-current-2026-ga; modern-medsl-governor-2022-ga |
| 13223 | Paulding | governor | governor-share-swing | democrat | D share 11.702013pp | modern-current-2026-ga; modern-medsl-governor-2022-ga |
| 13253 | Seminole | governor | governor-share-swing | democrat | D share 10.639263pp | modern-current-2026-ga; modern-medsl-governor-2022-ga |
| 13295 | Walker | governor | governor-party-count-change | democrat | Democrat: 44.707561%; opponent -11.958293% | modern-current-2026-ga; modern-medsl-governor-2022-ga |
| 13297 | Walton | governor | governor-party-count-change | democrat | Democrat: 47.654863%; opponent -6.076703% | modern-current-2026-ga; modern-medsl-governor-2022-ga |
| 13313 | Whitfield | governor | governor-party-count-change | democrat | Democrat: 94.994893%; opponent -11.941297% | modern-current-2026-ga; modern-medsl-governor-2022-ga |
| 13313 | Whitfield | governor | governor-share-swing | democrat | D share 16.416112pp | modern-current-2026-ga; modern-medsl-governor-2022-ga |
| 16001 | Ada | governor | governor-party-count-change | democrat | Republican: -50.494415%; opponent -8.282271% | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16001 | Ada | governor | governor-share-swing | democrat | D share 14.807796pp | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16001 | Ada | governor | governor-race-population-change | neutral | -29.529451pp | modern-current-2026-id; modern-medsl-governor-2022-id; census2025 |
| 16003 | Adams | governor | governor-party-count-change | democrat | Republican: -43.978244%; opponent -3.556485% | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16003 | Adams | governor | governor-race-vote-change | neutral | 4040→2162; -46.485149% | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16003 | Adams | governor | governor-race-population-change | neutral | -41.426339pp | modern-current-2026-id; modern-medsl-governor-2022-id; census2025 |
| 16005 | Bannock | governor | governor-party-count-change | democrat | Republican: -50.040147%; opponent -4.760206% | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16005 | Bannock | governor | governor-share-swing | democrat | D share 15.275622pp | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16005 | Bannock | governor | governor-race-population-change | neutral | -22.422901pp | modern-current-2026-id; modern-medsl-governor-2022-id; census2025 |
| 16007 | Bear Lake | governor | governor-race-vote-change | neutral | 4532→2394; -47.17564% | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16007 | Bear Lake | governor | governor-race-population-change | neutral | -31.63248pp | modern-current-2026-id; modern-medsl-governor-2022-id; census2025 |
| 16009 | Benewah | governor | governor-race-vote-change | neutral | 6908→4016; -41.864505% | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16009 | Benewah | governor | governor-race-population-change | neutral | -28.895072pp | modern-current-2026-id; modern-medsl-governor-2022-id; census2025 |
| 16011 | Bingham | governor | governor-share-swing | democrat | D share 13.696518pp | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16011 | Bingham | governor | governor-race-population-change | neutral | -19.611356pp | modern-current-2026-id; modern-medsl-governor-2022-id; census2025 |
| 16013 | Blaine | governor | governor-share-swing | democrat | D share 12.655709pp | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16013 | Blaine | governor | governor-race-vote-change | neutral | 19440→11459; -41.054527% | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16013 | Blaine | governor | governor-race-population-change | neutral | -32.23554pp | modern-current-2026-id; modern-medsl-governor-2022-id; census2025 |
| 16015 | Boise | governor | governor-race-vote-change | neutral | 6888→3962; -42.479675% | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16015 | Boise | governor | governor-race-population-change | neutral | -35.448646pp | modern-current-2026-id; modern-medsl-governor-2022-id; census2025 |
| 16017 | Bonner | governor | governor-race-vote-change | neutral | 41588→23524; -43.435606% | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16017 | Bonner | governor | governor-race-population-change | neutral | -37.62555pp | modern-current-2026-id; modern-medsl-governor-2022-id; census2025 |
| 16019 | Bonneville | governor | governor-share-swing | democrat | D share 16.421286pp | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16019 | Bonneville | governor | governor-race-population-change | neutral | -22.936055pp | modern-current-2026-id; modern-medsl-governor-2022-id; census2025 |
| 16021 | Boundary | governor | governor-race-vote-change | neutral | 10478→5526; -47.260928% | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16021 | Boundary | governor | governor-race-population-change | neutral | -39.160159pp | modern-current-2026-id; modern-medsl-governor-2022-id; census2025 |
| 16023 | Butte | governor | governor-race-vote-change | neutral | 2018→1130; -44.003964% | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16023 | Butte | governor | governor-race-population-change | neutral | -34.414922pp | modern-current-2026-id; modern-medsl-governor-2022-id; census2025 |
| 16025 | Camas | governor | governor-race-vote-change | neutral | 1034→538; -47.969052% | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16025 | Camas | governor | governor-race-population-change | neutral | -48.026538pp | modern-current-2026-id; modern-medsl-governor-2022-id; census2025 |
| 16027 | Canyon | governor | governor-share-swing | democrat | D share 12.456081pp | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16027 | Canyon | governor | governor-race-population-change | neutral | -18.270297pp | modern-current-2026-id; modern-medsl-governor-2022-id; census2025 |
| 16029 | Caribou | governor | governor-race-vote-change | neutral | 4240→2496; -41.132075% | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16029 | Caribou | governor | governor-race-population-change | neutral | -24.462619pp | modern-current-2026-id; modern-medsl-governor-2022-id; census2025 |
| 16031 | Cassia | governor | governor-share-swing | democrat | D share 13.430185pp | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16031 | Cassia | governor | governor-race-vote-change | neutral | 11604→6801; -41.3909% | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16031 | Cassia | governor | governor-race-population-change | neutral | -19.463132pp | modern-current-2026-id; modern-medsl-governor-2022-id; census2025 |
| 16035 | Clearwater | governor | governor-race-vote-change | neutral | 6242→3235; -48.173662% | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16035 | Clearwater | governor | governor-race-population-change | neutral | -33.63056pp | modern-current-2026-id; modern-medsl-governor-2022-id; census2025 |
| 16037 | Custer | governor | governor-party-count-change | democrat | Republican: -44.95114%; opponent -5.387931% | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16037 | Custer | governor | governor-race-vote-change | neutral | 4072→2010; -50.638507% | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16037 | Custer | governor | governor-race-population-change | neutral | -47.072261pp | modern-current-2026-id; modern-medsl-governor-2022-id; census2025 |
| 16039 | Elmore | governor | governor-party-count-change | democrat | Republican: -44.835681%; opponent 5.913978% | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16039 | Elmore | governor | governor-share-swing | democrat | D share 12.192723pp | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16039 | Elmore | governor | governor-race-vote-change | neutral | 13260→7530; -43.21267% | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16039 | Elmore | governor | governor-race-population-change | neutral | -19.507977pp | modern-current-2026-id; modern-medsl-governor-2022-id; census2025 |
| 16041 | Franklin | governor | governor-race-vote-change | neutral | 8674→4678; -46.068711% | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16041 | Franklin | governor | governor-race-population-change | neutral | -27.702987pp | modern-current-2026-id; modern-medsl-governor-2022-id; census2025 |
| 16043 | Fremont | governor | governor-race-vote-change | neutral | 8524→4838; -43.242609% | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16043 | Fremont | governor | governor-race-population-change | neutral | -26.678314pp | modern-current-2026-id; modern-medsl-governor-2022-id; census2025 |
| 16045 | Gem | governor | governor-race-vote-change | neutral | 15262→8166; -46.494562% | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16045 | Gem | governor | governor-race-population-change | neutral | -36.485234pp | modern-current-2026-id; modern-medsl-governor-2022-id; census2025 |
| 16047 | Gooding | governor | governor-share-swing | democrat | D share 11.82123pp | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16047 | Gooding | governor | governor-race-vote-change | neutral | 8102→4363; -46.149099% | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16047 | Gooding | governor | governor-race-population-change | neutral | -24.426728pp | modern-current-2026-id; modern-medsl-governor-2022-id; census2025 |
| 16049 | Idaho | governor | governor-race-vote-change | neutral | 14940→7874; -47.29585% | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16049 | Idaho | governor | governor-race-population-change | neutral | -40.573899pp | modern-current-2026-id; modern-medsl-governor-2022-id; census2025 |
| 16051 | Jefferson | governor | governor-race-population-change | neutral | -21.887504pp | modern-current-2026-id; modern-medsl-governor-2022-id; census2025 |
| 16053 | Jerome | governor | governor-share-swing | democrat | D share 18.302442pp | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16053 | Jerome | governor | governor-race-population-change | neutral | -15.156903pp | modern-current-2026-id; modern-medsl-governor-2022-id; census2025 |
| 16055 | Kootenai | governor | governor-race-vote-change | neutral | 124592→74227; -40.423944% | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16055 | Kootenai | governor | governor-race-population-change | neutral | -29.205808pp | modern-current-2026-id; modern-medsl-governor-2022-id; census2025 |
| 16057 | Latah | governor | governor-race-vote-change | neutral | 29946→15419; -48.510653% | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16057 | Latah | governor | governor-race-population-change | neutral | -35.814532pp | modern-current-2026-id; modern-medsl-governor-2022-id; census2025 |
| 16059 | Lemhi | governor | governor-party-count-change | democrat | Republican: -50.993915%; opponent -2.731591% | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16059 | Lemhi | governor | governor-share-swing | democrat | D share 10.729182pp | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16059 | Lemhi | governor | governor-race-vote-change | neutral | 7320→3816; -47.868852% | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16059 | Lemhi | governor | governor-race-population-change | neutral | -43.320582pp | modern-current-2026-id; modern-medsl-governor-2022-id; census2025 |
| 16061 | Lewis | governor | governor-race-vote-change | neutral | 2722→1449; -46.767083% | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16061 | Lewis | governor | governor-race-population-change | neutral | -33.641423pp | modern-current-2026-id; modern-medsl-governor-2022-id; census2025 |
| 16063 | Lincoln | governor | governor-share-swing | democrat | D share 15.528135pp | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16063 | Lincoln | governor | governor-race-vote-change | neutral | 2642→1407; -46.74489% | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16063 | Lincoln | governor | governor-race-population-change | neutral | -23.996259pp | modern-current-2026-id; modern-medsl-governor-2022-id; census2025 |
| 16067 | Minidoka | governor | governor-share-swing | democrat | D share 16.223893pp | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16067 | Minidoka | governor | governor-race-population-change | neutral | -16.473563pp | modern-current-2026-id; modern-medsl-governor-2022-id; census2025 |
| 16069 | Nez Perce | governor | governor-race-vote-change | neutral | 26962→14999; -44.369854% | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16069 | Nez Perce | governor | governor-race-population-change | neutral | -27.746613pp | modern-current-2026-id; modern-medsl-governor-2022-id; census2025 |
| 16071 | Oneida | governor | governor-race-vote-change | neutral | 3254→1620; -50.21512% | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16071 | Oneida | governor | governor-race-population-change | neutral | -36.791382pp | modern-current-2026-id; modern-medsl-governor-2022-id; census2025 |
| 16073 | Owyhee | governor | governor-race-vote-change | neutral | 6580→3576; -45.653495% | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16073 | Owyhee | governor | governor-race-population-change | neutral | -23.804512pp | modern-current-2026-id; modern-medsl-governor-2022-id; census2025 |
| 16075 | Payette | governor | governor-race-vote-change | neutral | 15218→8672; -43.014851% | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16075 | Payette | governor | governor-race-population-change | neutral | -25.352625pp | modern-current-2026-id; modern-medsl-governor-2022-id; census2025 |
| 16079 | Shoshone | governor | governor-race-vote-change | neutral | 8256→4576; -44.573643% | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16079 | Shoshone | governor | governor-race-population-change | neutral | -26.90831pp | modern-current-2026-id; modern-medsl-governor-2022-id; census2025 |
| 16081 | Teton | governor | governor-party-count-change | democrat | Republican: -47.971415%; opponent -14.680744% | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16081 | Teton | governor | governor-share-swing | democrat | D share 12.224669pp | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16081 | Teton | governor | governor-race-population-change | neutral | -28.720474pp | modern-current-2026-id; modern-medsl-governor-2022-id; census2025 |
| 16083 | Twin Falls | governor | governor-share-swing | democrat | D share 11.563219pp | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16083 | Twin Falls | governor | governor-race-population-change | neutral | -20.413608pp | modern-current-2026-id; modern-medsl-governor-2022-id; census2025 |
| 16085 | Valley | governor | governor-share-swing | democrat | D share 11.199091pp | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16085 | Valley | governor | governor-race-vote-change | neutral | 10464→6113; -41.580657% | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16085 | Valley | governor | governor-race-population-change | neutral | -36.527456pp | modern-current-2026-id; modern-medsl-governor-2022-id; census2025 |
| 16087 | Washington | governor | governor-race-vote-change | neutral | 7848→4329; -44.83945% | modern-current-2026-id; modern-medsl-governor-2022-id |
| 16087 | Washington | governor | governor-race-population-change | neutral | -32.835602pp | modern-current-2026-id; modern-medsl-governor-2022-id; census2025 |
| 19001 | Adair | senate | senate-race-population-change | neutral | -12.987915pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19001 | Adair | governor | governor-share-swing | democrat | D share 18.731075pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19003 | Adams | senate | senate-race-population-change | neutral | -13.571455pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19003 | Adams | governor | governor-share-swing | democrat | D share 18.009567pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19005 | Allamakee | senate | senate-race-population-change | neutral | -11.992829pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19005 | Allamakee | governor | governor-share-swing | democrat | D share 16.405067pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19007 | Appanoose | senate | senate-race-population-change | neutral | -12.229026pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19007 | Appanoose | governor | governor-share-swing | democrat | D share 16.71845pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19009 | Audubon | senate | senate-race-population-change | neutral | -15.129494pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19009 | Audubon | governor | governor-share-swing | democrat | D share 16.340596pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19011 | Benton | senate | senate-race-population-change | neutral | -10.922762pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19011 | Benton | governor | governor-share-swing | democrat | D share 16.075518pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19013 | Black Hawk | senate | senate-race-population-change | neutral | -10.264702pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19013 | Black Hawk | governor | governor-share-swing | democrat | D share 16.277837pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19015 | Boone | senate | senate-race-population-change | neutral | -10.599156pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19015 | Boone | governor | governor-party-count-change | democrat | Democrat: 65.854859%; opponent -13.019228% | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19015 | Boone | governor | governor-share-swing | democrat | D share 15.851712pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19017 | Bremer | senate | senate-race-population-change | neutral | -10.768124pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19017 | Bremer | governor | governor-share-swing | democrat | D share 16.081727pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19019 | Buchanan | senate | senate-race-population-change | neutral | -10.543685pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19019 | Buchanan | governor | governor-share-swing | democrat | D share 18.333683pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19021 | Buena Vista | governor | governor-share-swing | democrat | D share 22.349566pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19023 | Butler | senate | senate-race-population-change | neutral | -10.442851pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19023 | Butler | governor | governor-share-swing | democrat | D share 16.401172pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19025 | Calhoun | senate | senate-race-population-change | neutral | -13.633117pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19025 | Calhoun | governor | governor-share-swing | democrat | D share 17.134314pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19027 | Carroll | senate | senate-race-population-change | neutral | -10.199087pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19027 | Carroll | governor | governor-share-swing | democrat | D share 18.584038pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19029 | Cass | senate | senate-race-population-change | neutral | -13.809421pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19029 | Cass | governor | governor-share-swing | democrat | D share 14.048976pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19031 | Cedar | governor | governor-share-swing | democrat | D share 16.032317pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19033 | Cerro Gordo | senate | senate-race-population-change | neutral | -10.961604pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19033 | Cerro Gordo | governor | governor-share-swing | democrat | D share 10.387569pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19035 | Cherokee | senate | senate-race-population-change | neutral | -13.309038pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19035 | Cherokee | governor | governor-share-swing | democrat | D share 17.964666pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19037 | Chickasaw | senate | senate-race-population-change | neutral | -12.722948pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19037 | Chickasaw | governor | governor-share-swing | democrat | D share 19.61792pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19039 | Clarke | senate | senate-race-population-change | neutral | -10.775416pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19039 | Clarke | governor | governor-share-swing | democrat | D share 19.188587pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19041 | Clay | senate | senate-race-population-change | neutral | -13.483316pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19041 | Clay | governor | governor-share-swing | democrat | D share 15.687671pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19043 | Clayton | senate | senate-race-population-change | neutral | -12.236265pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19043 | Clayton | governor | governor-share-swing | democrat | D share 16.070216pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19045 | Clinton | senate | senate-race-population-change | neutral | -12.277746pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19045 | Clinton | governor | governor-party-count-change | democrat | Democrat: 49.921948%; opponent -13.830728% | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19045 | Clinton | governor | governor-share-swing | democrat | D share 13.64165pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19047 | Crawford | senate | senate-race-population-change | neutral | -11.95245pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19047 | Crawford | governor | governor-share-swing | democrat | D share 23.273232pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19049 | Dallas | senate | senate-race-population-change | neutral | -12.300742pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19049 | Dallas | governor | governor-party-count-change | democrat | Democrat: 55.832296%; opponent -14.117117% | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19049 | Dallas | governor | governor-share-swing | democrat | D share 14.771893pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19051 | Davis | senate | senate-race-population-change | neutral | -12.183474pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19051 | Davis | governor | governor-share-swing | democrat | D share 17.34143pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19053 | Decatur | senate | senate-race-population-change | neutral | -11.752728pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19053 | Decatur | governor | governor-share-swing | democrat | D share 16.2494pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19055 | Delaware | senate | senate-race-population-change | neutral | -11.689975pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19055 | Delaware | governor | governor-share-swing | democrat | D share 17.924017pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19057 | Des Moines | senate | senate-race-population-change | neutral | -11.724124pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19057 | Des Moines | governor | governor-party-count-change | democrat | Democrat: 56.018519%; opponent -13.06596% | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19057 | Des Moines | governor | governor-share-swing | democrat | D share 14.455098pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19059 | Dickinson | senate | senate-race-population-change | neutral | -10.317076pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19059 | Dickinson | governor | governor-party-count-change | democrat | Democrat: 78.248316%; opponent -3.926097% | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19059 | Dickinson | governor | governor-share-swing | democrat | D share 13.34664pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19061 | Dubuque | governor | governor-party-count-change | democrat | Democrat: 56.42196%; opponent -13.868845% | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19061 | Dubuque | governor | governor-share-swing | democrat | D share 14.802809pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19063 | Emmet | senate | senate-race-population-change | neutral | -12.384222pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19063 | Emmet | governor | governor-party-count-change | democrat | Democrat: 79.452055%; opponent -13.148515% | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19063 | Emmet | governor | governor-share-swing | democrat | D share 15.524669pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19065 | Fayette | senate | senate-race-population-change | neutral | -10.540799pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19065 | Fayette | governor | governor-share-swing | democrat | D share 17.804199pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19067 | Floyd | senate | senate-race-population-change | neutral | -10.32974pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19067 | Floyd | governor | governor-party-count-change | democrat | Democrat: 50.486431%; opponent -14.027892% | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19067 | Floyd | governor | governor-share-swing | democrat | D share 13.502142pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19069 | Franklin | senate | senate-race-population-change | neutral | -12.055453pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19069 | Franklin | governor | governor-party-count-change | democrat | Democrat: 79.568672%; opponent -14.648729% | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19069 | Franklin | governor | governor-share-swing | democrat | D share 16.152785pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19071 | Fremont | senate | senate-race-population-change | neutral | -17.621962pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19071 | Fremont | governor | governor-share-swing | democrat | D share 15.785106pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19073 | Greene | senate | senate-race-population-change | neutral | -14.161207pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19073 | Greene | governor | governor-share-swing | democrat | D share 17.493813pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19075 | Grundy | senate | senate-race-population-change | neutral | -11.738854pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19075 | Grundy | governor | governor-party-count-change | democrat | Democrat: 92.921074%; opponent -14.976444% | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19075 | Grundy | governor | governor-share-swing | democrat | D share 17.523172pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19077 | Guthrie | senate | senate-race-population-change | neutral | -11.381273pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19077 | Guthrie | governor | governor-share-swing | democrat | D share 17.416885pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19079 | Hamilton | senate | senate-race-population-change | neutral | -13.405275pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19079 | Hamilton | governor | governor-share-swing | democrat | D share 17.349812pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19081 | Hancock | senate | senate-race-population-change | neutral | -13.157759pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19081 | Hancock | governor | governor-party-count-change | democrat | Democrat: 56.590684%; opponent -7.116899% | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19081 | Hancock | governor | governor-share-swing | democrat | D share 10.595188pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19083 | Hardin | senate | senate-race-population-change | neutral | -11.780852pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19083 | Hardin | governor | governor-share-swing | democrat | D share 16.659012pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19085 | Harrison | senate | senate-race-population-change | neutral | -15.589778pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19085 | Harrison | governor | governor-party-count-change | democrat | Democrat: 69.509434%; opponent -11.10838% | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19085 | Harrison | governor | governor-share-swing | democrat | D share 13.743703pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19087 | Henry | governor | governor-party-count-change | democrat | Democrat: 71.514847%; opponent -12.280339% | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19087 | Henry | governor | governor-share-swing | democrat | D share 15.425378pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19089 | Howard | senate | senate-race-population-change | neutral | -11.780955pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19089 | Howard | governor | governor-party-count-change | democrat | Democrat: 67.227723%; opponent -10.735931% | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19089 | Howard | governor | governor-share-swing | democrat | D share 14.606306pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19091 | Humboldt | senate | senate-race-population-change | neutral | -14.356529pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19091 | Humboldt | governor | governor-share-swing | democrat | D share 14.24179pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19093 | Ida | senate | senate-race-population-change | neutral | -13.654981pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19093 | Ida | governor | governor-share-swing | democrat | D share 16.104602pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19095 | Iowa | governor | governor-share-swing | democrat | D share 16.218853pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19097 | Jackson | senate | senate-race-population-change | neutral | -11.985559pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19097 | Jackson | governor | governor-party-count-change | democrat | Democrat: 74.495171%; opponent -13.669202% | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19097 | Jackson | governor | governor-share-swing | democrat | D share 16.456626pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19099 | Jasper | senate | senate-race-population-change | neutral | -10.158551pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19099 | Jasper | governor | governor-party-count-change | democrat | Democrat: 63.339311%; opponent -14.447236% | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19099 | Jasper | governor | governor-share-swing | democrat | D share 15.634283pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19101 | Jefferson | senate | senate-race-population-change | neutral | -11.229514pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19105 | Jones | senate | senate-race-population-change | neutral | -12.111249pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19105 | Jones | governor | governor-share-swing | democrat | D share 16.253611pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19107 | Keokuk | senate | senate-race-population-change | neutral | -12.454589pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19107 | Keokuk | governor | governor-share-swing | democrat | D share 16.984393pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19109 | Kossuth | senate | senate-race-population-change | neutral | -14.32527pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19109 | Kossuth | governor | governor-share-swing | democrat | D share 12.804975pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19111 | Lee | senate | senate-race-population-change | neutral | -12.190313pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19111 | Lee | governor | governor-share-swing | democrat | D share 14.157042pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19113 | Linn | governor | governor-party-count-change | democrat | Democrat: 47.428427%; opponent -14.666449% | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19113 | Linn | governor | governor-share-swing | democrat | D share 13.123296pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19115 | Louisa | senate | senate-race-population-change | neutral | -11.537082pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19115 | Louisa | governor | governor-party-count-change | democrat | Democrat: 98.958333%; opponent -14.119472% | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19115 | Louisa | governor | governor-share-swing | democrat | D share 18.605409pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19117 | Lucas | senate | senate-race-population-change | neutral | -13.565586pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19117 | Lucas | governor | governor-share-swing | democrat | D share 15.600907pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19119 | Lyon | senate | senate-race-population-change | neutral | -12.898273pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19119 | Lyon | governor | governor-party-count-change | democrat | Democrat: 102.808989%; opponent -2.568725% | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19121 | Madison | senate | senate-race-vote-change | neutral | 9720→5086; -47.674897% | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 19121 | Madison | senate | senate-race-population-change | neutral | -28.995159pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19121 | Madison | governor | governor-party-count-change | democrat | Republican: -42.811381%; opponent -0.674049% | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19121 | Madison | governor | governor-share-swing | democrat | D share 12.338464pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19121 | Madison | governor | governor-race-population-change | neutral | -14.720635pp | modern-current-2026-ia; modern-medsl-governor-2022-ia; census2025 |
| 19123 | Mahaska | senate | senate-race-population-change | neutral | -12.603447pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19123 | Mahaska | governor | governor-party-count-change | democrat | Democrat: 78.584283%; opponent -13.367201% | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19123 | Mahaska | governor | governor-share-swing | democrat | D share 14.371168pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19125 | Marion | senate | senate-race-population-change | neutral | -10.345493pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19125 | Marion | governor | governor-party-count-change | democrat | Democrat: 80.278361%; opponent -8.430204% | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19125 | Marion | governor | governor-share-swing | democrat | D share 15.161919pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19127 | Marshall | governor | governor-share-swing | democrat | D share 18.806552pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19129 | Mills | senate | senate-race-population-change | neutral | -15.102321pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19129 | Mills | governor | governor-party-count-change | democrat | Democrat: 64.761264%; opponent -6.172533% | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19129 | Mills | governor | governor-share-swing | democrat | D share 12.36078pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19131 | Mitchell | senate | senate-race-population-change | neutral | -13.045273pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19131 | Mitchell | governor | governor-share-swing | democrat | D share 14.936607pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19133 | Monona | senate | senate-race-population-change | neutral | -13.591626pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19133 | Monona | governor | governor-share-swing | democrat | D share 17.001503pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19135 | Monroe | senate | senate-race-population-change | neutral | -11.43215pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19135 | Monroe | governor | governor-share-swing | democrat | D share 17.760119pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19137 | Montgomery | senate | senate-race-population-change | neutral | -14.254099pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19137 | Montgomery | governor | governor-party-count-change | democrat | Democrat: 70.838117%; opponent -12.951576% | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19137 | Montgomery | governor | governor-share-swing | democrat | D share 14.569099pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19139 | Muscatine | governor | governor-party-count-change | democrat | Democrat: 77.030303%; opponent -13.591496% | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19139 | Muscatine | governor | governor-share-swing | democrat | D share 17.690097pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19141 | O'Brien | senate | senate-race-population-change | neutral | -13.704192pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19141 | O'Brien | governor | governor-party-count-change | democrat | Democrat: 111.082474%; opponent -12.310064% | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19141 | O'Brien | governor | governor-share-swing | democrat | D share 14.551211pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19143 | Osceola | senate | senate-race-population-change | neutral | -12.737602pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19143 | Osceola | governor | governor-party-count-change | democrat | Democrat: 149.795918%; opponent -12.636274% | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19143 | Osceola | governor | governor-share-swing | democrat | D share 14.942084pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19145 | Page | senate | senate-race-population-change | neutral | -13.501009pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19145 | Page | governor | governor-share-swing | democrat | D share 15.228952pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19147 | Palo Alto | governor | governor-party-count-change | democrat | Democrat: 82.629674%; opponent -7.021434% | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19147 | Palo Alto | governor | governor-share-swing | democrat | D share 14.117036pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19149 | Plymouth | senate | senate-race-population-change | neutral | -12.297155pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19149 | Plymouth | governor | governor-party-count-change | democrat | Democrat: 119.720024%; opponent -7.649184% | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19149 | Plymouth | governor | governor-share-swing | democrat | D share 15.759012pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19151 | Pocahontas | senate | senate-race-population-change | neutral | -13.166182pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19151 | Pocahontas | governor | governor-share-swing | democrat | D share 16.285971pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19153 | Polk | governor | governor-share-swing | democrat | D share 13.196226pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19155 | Pottawattamie | senate | senate-race-population-change | neutral | -12.024355pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19155 | Pottawattamie | governor | governor-party-count-change | democrat | Democrat: 61.988758%; opponent -7.238872% | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19155 | Pottawattamie | governor | governor-share-swing | democrat | D share 13.573554pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19157 | Poweshiek | senate | senate-race-population-change | neutral | -10.259755pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19157 | Poweshiek | governor | governor-share-swing | democrat | D share 13.973449pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19159 | Ringgold | senate | senate-race-population-change | neutral | -12.981062pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19159 | Ringgold | governor | governor-share-swing | democrat | D share 15.288702pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19161 | Sac | senate | senate-race-population-change | neutral | -11.191439pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19161 | Sac | governor | governor-party-count-change | democrat | Democrat: 107.95756%; opponent -13.07815% | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19161 | Sac | governor | governor-share-swing | democrat | D share 17.136557pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19163 | Scott | senate | senate-race-population-change | neutral | -10.442989pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19163 | Scott | governor | governor-party-count-change | democrat | Democrat: 56.044315%; opponent -11.267484% | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19163 | Scott | governor | governor-share-swing | democrat | D share 14.010031pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19165 | Shelby | senate | senate-race-population-change | neutral | -15.402802pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19165 | Shelby | governor | governor-party-count-change | democrat | Democrat: 79.081134%; opponent -11.736695% | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19165 | Shelby | governor | governor-share-swing | democrat | D share 14.491977pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19167 | Sioux | senate | senate-race-population-change | neutral | -11.068903pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19167 | Sioux | governor | governor-party-count-change | democrat | Democrat: 141.5625%; opponent -3.792025% | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19167 | Sioux | governor | governor-share-swing | democrat | D share 10.984464pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19169 | Story | governor | governor-party-count-change | democrat | Democrat: 42.815456%; opponent -14.882201% | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19169 | Story | governor | governor-share-swing | democrat | D share 12.212703pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19171 | Tama | senate | senate-race-population-change | neutral | -10.332047pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19171 | Tama | governor | governor-share-swing | democrat | D share 18.71429pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19173 | Taylor | senate | senate-race-population-change | neutral | -17.330162pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19173 | Taylor | governor | governor-share-swing | democrat | D share 16.712598pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19175 | Union | senate | senate-race-population-change | neutral | -11.218496pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19175 | Union | governor | governor-share-swing | democrat | D share 18.548189pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19177 | Van Buren | senate | senate-race-population-change | neutral | -12.806568pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19177 | Van Buren | governor | governor-share-swing | democrat | D share 13.607488pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19179 | Wapello | senate | senate-race-population-change | neutral | -11.925982pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19179 | Wapello | governor | governor-share-swing | democrat | D share 16.753529pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19181 | Warren | senate | senate-race-population-change | neutral | -10.120925pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19181 | Warren | governor | governor-party-count-change | democrat | Democrat: 71.714922%; opponent -10.669127% | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19181 | Warren | governor | governor-share-swing | democrat | D share 16.016347pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19183 | Washington | governor | governor-party-count-change | democrat | Democrat: 57.507661%; opponent -11.770907% | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19183 | Washington | governor | governor-share-swing | democrat | D share 13.911372pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19185 | Wayne | senate | senate-race-population-change | neutral | -13.467694pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19185 | Wayne | governor | governor-share-swing | democrat | D share 19.521789pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19187 | Webster | senate | senate-race-population-change | neutral | -13.26948pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19187 | Webster | governor | governor-share-swing | democrat | D share 16.280017pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19189 | Winnebago | senate | senate-race-population-change | neutral | -12.519533pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19189 | Winnebago | governor | governor-party-count-change | democrat | Democrat: 43.812452%; opponent -12.437312% | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19189 | Winnebago | governor | governor-share-swing | democrat | D share 11.35817pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19191 | Winneshiek | governor | governor-share-swing | democrat | D share 17.14462pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19193 | Woodbury | senate | senate-race-population-change | neutral | -10.490769pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19193 | Woodbury | governor | governor-party-count-change | democrat | Democrat: 90.047498%; opponent -13.249394% | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19193 | Woodbury | governor | governor-share-swing | democrat | D share 18.804088pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19195 | Worth | senate | senate-race-population-change | neutral | -12.61562pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19195 | Worth | governor | governor-party-count-change | democrat | Democrat: 48.411935%; opponent -11.49317% | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19195 | Worth | governor | governor-share-swing | democrat | D share 12.21559pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 19197 | Wright | senate | senate-race-population-change | neutral | -13.526129pp | modern-current-2026-ia; modern-heideman-v1-senate-ia_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 19197 | Wright | governor | governor-share-swing | democrat | D share 19.181034pp | modern-current-2026-ia; modern-medsl-governor-2022-ia |
| 20121 | Miami | senate | senate-race-population-change | neutral | -13.285139pp | modern-current-2026-ks; modern-heideman-v1-senate-ks_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 27023 | Chippewa | senate | senate-race-population-change | neutral | -10.89336pp | modern-current-2026-mn; modern-heideman-v1-senate-mn_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 27059 | Isanti | senate | senate-race-population-change | neutral | -10.646551pp | modern-current-2026-mn; modern-heideman-v1-senate-mn_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 27061 | Itasca | senate | senate-race-population-change | neutral | -10.000472pp | modern-current-2026-mn; modern-heideman-v1-senate-mn_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 27065 | Kanabec | senate | senate-race-population-change | neutral | -10.614654pp | modern-current-2026-mn; modern-heideman-v1-senate-mn_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 27069 | Kittson | senate | senate-race-population-change | neutral | -11.219065pp | modern-current-2026-mn; modern-heideman-v1-senate-mn_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 27077 | Lake of the Woods | senate | senate-race-population-change | neutral | -13.050398pp | modern-current-2026-mn; modern-heideman-v1-senate-mn_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 27087 | Mahnomen | governor | governor-party-count-change | democrat | Democrat: 42.089094%; opponent 11.024499% | modern-current-2026-mn; modern-medsl-governor-2022-mn |
| 27095 | Mille Lacs | senate | senate-race-population-change | neutral | -10.783pp | modern-current-2026-mn; modern-heideman-v1-senate-mn_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 27107 | Norman | senate | senate-race-population-change | neutral | -10.476856pp | modern-current-2026-mn; modern-heideman-v1-senate-mn_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 27113 | Pennington | senate | senate-race-population-change | neutral | -11.718912pp | modern-current-2026-mn; modern-heideman-v1-senate-mn_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 27119 | Polk | senate | senate-race-population-change | neutral | -10.124284pp | modern-current-2026-mn; modern-heideman-v1-senate-mn_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 27135 | Roseau | senate | senate-race-population-change | neutral | -10.932396pp | modern-current-2026-mn; modern-heideman-v1-senate-mn_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 27141 | Sherburne | senate | senate-race-population-change | neutral | -10.465734pp | modern-current-2026-mn; modern-heideman-v1-senate-mn_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 27167 | Wilkin | senate | senate-race-population-change | neutral | -11.132522pp | modern-current-2026-mn; modern-heideman-v1-senate-mn_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30001 | Beaverhead | senate | senate-share-swing | republican | D share -21.557198pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 30001 | Beaverhead | senate | senate-race-population-change | neutral | -15.559595pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30003 | Big Horn | senate | senate-share-swing | republican | D share -12.586457pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 30005 | Blaine | senate | senate-share-swing | republican | D share -23.508554pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 30005 | Blaine | senate | senate-race-population-change | neutral | -13.139285pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30005 | Blaine | house | house-party-count-change | democrat | Democrat: 57.921635%; opponent 2.403846% | house-repair-mt2026; modern-heideman-v1-house-mt_medsl_2022; Montana Secretary of State2026statewide public workbook export (provisional); MEDSL 2022 U.S. House constituency returns used as independent county-sum controls; Heideman county-district source register (candidate county sums) |
| 30005 | Blaine | house | house-share-swing | democrat | D share 10.457472pp | house-repair-mt2026; modern-heideman-v1-house-mt_medsl_2022; Montana Secretary of State2026statewide public workbook export (provisional); MEDSL 2022 U.S. House constituency returns used as independent county-sum controls; Heideman county-district source register (candidate county sums) |
| 30007 | Broadwater | senate | senate-share-swing | republican | D share -16.203603pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 30007 | Broadwater | senate | senate-race-population-change | neutral | -15.923369pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30007 | Broadwater | house | house-party-count-change | democrat | Democrat: 62.155388%; opponent 11.998345% | house-repair-mt2026; modern-heideman-v1-house-mt_medsl_2022; Montana Secretary of State2026statewide public workbook export (provisional); MEDSL 2022 U.S. House constituency returns used as independent county-sum controls; Heideman county-district source register (candidate county sums) |
| 30009 | Carbon | senate | senate-share-swing | republican | D share -21.320998pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 30009 | Carbon | senate | senate-race-population-change | neutral | -13.392169pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30009 | Carbon | house | house-party-count-change | democrat | Democrat: 77.184466%; opponent 10.352155% | house-repair-mt2026; modern-heideman-v1-house-mt_medsl_2022; Montana Secretary of State2026statewide public workbook export (provisional); MEDSL 2022 U.S. House constituency returns used as independent county-sum controls; Heideman county-district source register (candidate county sums) |
| 30011 | Carter | senate | senate-race-population-change | neutral | -11.129093pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30013 | Cascade | senate | senate-share-swing | republican | D share -21.609992pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 30013 | Cascade | senate | senate-race-population-change | neutral | -12.731675pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30013 | Cascade | house | house-party-count-change | democrat | Democrat: 59.310033%; opponent 0.12153% | house-repair-mt2026; modern-heideman-v1-house-mt_medsl_2022; Montana Secretary of State2026statewide public workbook export (provisional); MEDSL 2022 U.S. House constituency returns used as independent county-sum controls; Heideman county-district source register (candidate county sums) |
| 30013 | Cascade | house | house-share-swing | democrat | D share 10.515267pp | house-repair-mt2026; modern-heideman-v1-house-mt_medsl_2022; Montana Secretary of State2026statewide public workbook export (provisional); MEDSL 2022 U.S. House constituency returns used as independent county-sum controls; Heideman county-district source register (candidate county sums) |
| 30015 | Chouteau | senate | senate-share-swing | republican | D share -21.877284pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 30015 | Chouteau | senate | senate-race-population-change | neutral | -11.793963pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30015 | Chouteau | house | house-party-count-change | democrat | Democrat: 73.924051%; opponent -4.647984% | house-repair-mt2026; modern-heideman-v1-house-mt_medsl_2022; Montana Secretary of State2026statewide public workbook export (provisional); MEDSL 2022 U.S. House constituency returns used as independent county-sum controls; Heideman county-district source register (candidate county sums) |
| 30015 | Chouteau | house | house-share-swing | democrat | D share 11.737699pp | house-repair-mt2026; modern-heideman-v1-house-mt_medsl_2022; Montana Secretary of State2026statewide public workbook export (provisional); MEDSL 2022 U.S. House constituency returns used as independent county-sum controls; Heideman county-district source register (candidate county sums) |
| 30017 | Custer | senate | senate-share-swing | republican | D share -19.234524pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 30017 | Custer | senate | senate-race-population-change | neutral | -13.719237pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30019 | Daniels | senate | senate-share-swing | republican | D share -15.959834pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 30019 | Daniels | senate | senate-race-population-change | neutral | -12.362208pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30021 | Dawson | senate | senate-share-swing | republican | D share -13.132147pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 30021 | Dawson | senate | senate-race-population-change | neutral | -15.591287pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30023 | Deer Lodge | senate | senate-share-swing | republican | D share -29.982138pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 30023 | Deer Lodge | senate | senate-race-population-change | neutral | -11.083608pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30025 | Fallon | senate | senate-race-population-change | neutral | -12.185831pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30027 | Fergus | senate | senate-share-swing | republican | D share -15.46778pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 30027 | Fergus | senate | senate-race-population-change | neutral | -11.259771pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30027 | Fergus | house | house-party-count-change | democrat | Democrat: 85.46042%; opponent -0.735294% | house-repair-mt2026; modern-heideman-v1-house-mt_medsl_2022; Montana Secretary of State2026statewide public workbook export (provisional); MEDSL 2022 U.S. House constituency returns used as independent county-sum controls; Heideman county-district source register (candidate county sums) |
| 30029 | Flathead | senate | senate-share-swing | republican | D share -20.339648pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 30029 | Flathead | senate | senate-race-population-change | neutral | -12.380278pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30031 | Gallatin | senate | senate-share-swing | republican | D share -27.695437pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 30031 | Gallatin | senate | senate-race-population-change | neutral | -16.233972pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30033 | Garfield | senate | senate-race-population-change | neutral | -12.263766pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30035 | Glacier | senate | senate-share-swing | republican | D share -21.931684pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 30035 | Glacier | senate | senate-race-population-change | neutral | -12.481142pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30035 | Glacier | house | house-party-count-change | democrat | Democrat: 47.768879%; opponent -0.989283% | house-repair-mt2026; modern-heideman-v1-house-mt_medsl_2022; Montana Secretary of State2026statewide public workbook export (provisional); MEDSL 2022 U.S. House constituency returns used as independent county-sum controls; Heideman county-district source register (candidate county sums) |
| 30039 | Granite | senate | senate-share-swing | republican | D share -22.091878pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 30039 | Granite | senate | senate-race-population-change | neutral | -13.668589pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30041 | Hill | senate | senate-share-swing | republican | D share -20.799081pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 30041 | Hill | senate | senate-race-population-change | neutral | -13.329571pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30043 | Jefferson | senate | senate-share-swing | republican | D share -23.27168pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 30043 | Jefferson | senate | senate-race-population-change | neutral | -16.308276pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30043 | Jefferson | house | house-party-count-change | democrat | Democrat: 88.942774%; opponent 12.28678% | house-repair-mt2026; modern-heideman-v1-house-mt_medsl_2022; Montana Secretary of State2026statewide public workbook export (provisional); MEDSL 2022 U.S. House constituency returns used as independent county-sum controls; Heideman county-district source register (candidate county sums) |
| 30043 | Jefferson | house | house-share-swing | democrat | D share 10.062735pp | house-repair-mt2026; modern-heideman-v1-house-mt_medsl_2022; Montana Secretary of State2026statewide public workbook export (provisional); MEDSL 2022 U.S. House constituency returns used as independent county-sum controls; Heideman county-district source register (candidate county sums) |
| 30045 | Judith Basin | senate | senate-share-swing | republican | D share -16.101352pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 30045 | Judith Basin | senate | senate-race-population-change | neutral | -12.775117pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30047 | Lake | senate | senate-share-swing | republican | D share -25.269353pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 30047 | Lake | senate | senate-race-population-change | neutral | -11.923793pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30049 | Lewis and Clark | senate | senate-share-swing | republican | D share -32.412218pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 30049 | Lewis and Clark | senate | senate-race-population-change | neutral | -14.087644pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30049 | Lewis and Clark | house | house-party-count-change | democrat | Democrat: 94.179466%; opponent 9.707101% | house-repair-mt2026; modern-heideman-v1-house-mt_medsl_2022; Montana Secretary of State2026statewide public workbook export (provisional); MEDSL 2022 U.S. House constituency returns used as independent county-sum controls; Heideman county-district source register (candidate county sums) |
| 30049 | Lewis and Clark | house | house-share-swing | democrat | D share 13.7229pp | house-repair-mt2026; modern-heideman-v1-house-mt_medsl_2022; Montana Secretary of State2026statewide public workbook export (provisional); MEDSL 2022 U.S. House constituency returns used as independent county-sum controls; Heideman county-district source register (candidate county sums) |
| 30051 | Liberty | senate | senate-share-swing | republican | D share -14.601475pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 30051 | Liberty | senate | senate-race-population-change | neutral | -16.124488pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30053 | Lincoln | senate | senate-share-swing | republican | D share -13.073023pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 30053 | Lincoln | senate | senate-race-population-change | neutral | -15.193011pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30055 | McCone | senate | senate-race-population-change | neutral | -15.282771pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30057 | Madison | senate | senate-share-swing | republican | D share -18.83062pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 30057 | Madison | senate | senate-race-population-change | neutral | -18.486812pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30059 | Meagher | senate | senate-share-swing | republican | D share -19.929828pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 30059 | Meagher | senate | senate-race-population-change | neutral | -14.649623pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30061 | Mineral | senate | senate-share-swing | republican | D share -18.230842pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 30063 | Missoula | senate | senate-share-swing | republican | D share -32.585762pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 30063 | Missoula | senate | senate-race-population-change | neutral | -11.784479pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30065 | Musselshell | senate | senate-share-swing | republican | D share -11.525919pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 30065 | Musselshell | senate | senate-race-population-change | neutral | -17.371994pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30065 | Musselshell | house | house-party-count-change | democrat | Democrat: 63.387978%; opponent 9.258226% | house-repair-mt2026; modern-heideman-v1-house-mt_medsl_2022; Montana Secretary of State2026statewide public workbook export (provisional); MEDSL 2022 U.S. House constituency returns used as independent county-sum controls; Heideman county-district source register (candidate county sums) |
| 30067 | Park | senate | senate-share-swing | republican | D share -27.032098pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 30067 | Park | senate | senate-race-population-change | neutral | -15.628551pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30067 | Park | house | house-party-count-change | democrat | Democrat: 61.23844%; opponent 2.360718% | house-repair-mt2026; modern-heideman-v1-house-mt_medsl_2022; Montana Secretary of State2026statewide public workbook export (provisional); MEDSL 2022 U.S. House constituency returns used as independent county-sum controls; Heideman county-district source register (candidate county sums) |
| 30067 | Park | house | house-share-swing | democrat | D share 11.054555pp | house-repair-mt2026; modern-heideman-v1-house-mt_medsl_2022; Montana Secretary of State2026statewide public workbook export (provisional); MEDSL 2022 U.S. House constituency returns used as independent county-sum controls; Heideman county-district source register (candidate county sums) |
| 30071 | Phillips | senate | senate-share-swing | republican | D share -12.164699pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 30071 | Phillips | senate | senate-race-population-change | neutral | -16.46858pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30073 | Pondera | senate | senate-share-swing | republican | D share -21.478693pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 30073 | Pondera | senate | senate-race-population-change | neutral | -14.468709pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30075 | Powder River | senate | senate-race-population-change | neutral | -17.596504pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30077 | Powell | senate | senate-share-swing | republican | D share -19.263779pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 30079 | Prairie | senate | senate-race-population-change | neutral | -15.943406pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30081 | Ravalli | senate | senate-share-swing | republican | D share -21.850798pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 30081 | Ravalli | senate | senate-race-population-change | neutral | -15.106241pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30083 | Richland | senate | senate-race-population-change | neutral | -18.499096pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30085 | Roosevelt | senate | senate-share-swing | republican | D share -15.215333pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 30085 | Roosevelt | senate | senate-race-population-change | neutral | -12.407707pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30087 | Rosebud | senate | senate-share-swing | republican | D share -17.468214pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 30087 | Rosebud | senate | senate-race-population-change | neutral | -12.026711pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30087 | Rosebud | house | house-party-count-change | democrat | Democrat: 42.054264%; opponent 4.293074% | house-repair-mt2026; modern-heideman-v1-house-mt_medsl_2022; Montana Secretary of State2026statewide public workbook export (provisional); MEDSL 2022 U.S. House constituency returns used as independent county-sum controls; Heideman county-district source register (candidate county sums) |
| 30089 | Sanders | senate | senate-share-swing | republican | D share -16.979712pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 30089 | Sanders | senate | senate-race-population-change | neutral | -14.311389pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30091 | Sheridan | senate | senate-share-swing | republican | D share -17.516039pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 30091 | Sheridan | senate | senate-race-population-change | neutral | -12.297376pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30093 | Silver Bow | senate | senate-share-swing | republican | D share -30.382142pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 30093 | Silver Bow | senate | senate-race-population-change | neutral | -12.441255pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30095 | Stillwater | senate | senate-share-swing | republican | D share -16.271304pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 30095 | Stillwater | senate | senate-race-population-change | neutral | -15.80041pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30095 | Stillwater | house | house-party-count-change | democrat | Democrat: 53.278689%; opponent 6.440572% | house-repair-mt2026; modern-heideman-v1-house-mt_medsl_2022; Montana Secretary of State2026statewide public workbook export (provisional); MEDSL 2022 U.S. House constituency returns used as independent county-sum controls; Heideman county-district source register (candidate county sums) |
| 30097 | Sweet Grass | senate | senate-share-swing | republican | D share -15.031079pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 30097 | Sweet Grass | senate | senate-race-population-change | neutral | -15.972839pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30097 | Sweet Grass | house | house-party-count-change | democrat | Democrat: 98.536585%; opponent 6.191223% | house-repair-mt2026; modern-heideman-v1-house-mt_medsl_2022; Montana Secretary of State2026statewide public workbook export (provisional); MEDSL 2022 U.S. House constituency returns used as independent county-sum controls; Heideman county-district source register (candidate county sums) |
| 30099 | Teton | senate | senate-share-swing | republican | D share -18.400586pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 30099 | Teton | senate | senate-race-population-change | neutral | -15.388485pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30101 | Toole | senate | senate-share-swing | republican | D share -16.285487pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 30101 | Toole | senate | senate-race-population-change | neutral | -12.325671pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30101 | Toole | house | house-party-count-change | democrat | Democrat: 56.701031%; opponent -3.135314% | house-repair-mt2026; modern-heideman-v1-house-mt_medsl_2022; Montana Secretary of State2026statewide public workbook export (provisional); MEDSL 2022 U.S. House constituency returns used as independent county-sum controls; Heideman county-district source register (candidate county sums) |
| 30105 | Valley | senate | senate-share-swing | republican | D share -19.604356pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 30105 | Valley | senate | senate-race-population-change | neutral | -14.302125pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30107 | Wheatland | senate | senate-share-swing | republican | D share -16.800099pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 30107 | Wheatland | senate | senate-race-population-change | neutral | -10.226621pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30111 | Yellowstone | senate | senate-share-swing | republican | D share -20.936335pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 30111 | Yellowstone | senate | senate-race-population-change | neutral | -14.44142pp | modern-official-mt-senate-2026; modern-heideman-v1-senate-mt_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 30111 | Yellowstone | house | house-party-count-change | democrat | Democrat: 62.981768%; opponent 9.684399% | house-repair-mt2026; modern-heideman-v1-house-mt_medsl_2022; Montana Secretary of State2026statewide public workbook export (provisional); MEDSL 2022 U.S. House constituency returns used as independent county-sum controls; Heideman county-district source register (candidate county sums) |
| 31003 | Antelope | senate | senate-race-population-change | neutral | -10.403029pp | research-senate-official-ne-2026; modern-heideman-v1-senate-ne_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 31013 | Box Butte | senate | senate-race-population-change | neutral | -11.876001pp | research-senate-official-ne-2026; modern-heideman-v1-senate-ne_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 31017 | Brown | senate | senate-race-population-change | neutral | -10.189912pp | research-senate-official-ne-2026; modern-heideman-v1-senate-ne_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 31025 | Cass | senate | senate-race-population-change | neutral | -10.741585pp | research-senate-official-ne-2026; modern-heideman-v1-senate-ne_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 31033 | Cheyenne | senate | senate-race-population-change | neutral | -12.312818pp | research-senate-official-ne-2026; modern-heideman-v1-senate-ne_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 31041 | Custer | senate | senate-race-population-change | neutral | -17.525508pp | research-senate-official-ne-2026; modern-heideman-v1-senate-ne_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 31049 | Deuel | senate | senate-race-population-change | neutral | -12.882305pp | research-senate-official-ne-2026; modern-heideman-v1-senate-ne_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 31051 | Dixon | senate | senate-race-population-change | neutral | -11.727257pp | research-senate-official-ne-2026; modern-heideman-v1-senate-ne_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 31057 | Dundy | senate | senate-race-population-change | neutral | -14.482439pp | research-senate-official-ne-2026; modern-heideman-v1-senate-ne_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 31059 | Fillmore | senate | senate-race-population-change | neutral | -10.481583pp | research-senate-official-ne-2026; modern-heideman-v1-senate-ne_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 31061 | Franklin | senate | senate-race-population-change | neutral | -13.783403pp | research-senate-official-ne-2026; modern-heideman-v1-senate-ne_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 31063 | Frontier | senate | senate-race-population-change | neutral | -13.045136pp | research-senate-official-ne-2026; modern-heideman-v1-senate-ne_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 31065 | Furnas | senate | senate-race-population-change | neutral | -10.445769pp | research-senate-official-ne-2026; modern-heideman-v1-senate-ne_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 31069 | Garden | senate | senate-race-population-change | neutral | -10.795345pp | research-senate-official-ne-2026; modern-heideman-v1-senate-ne_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 31081 | Hamilton | senate | senate-race-population-change | neutral | -10.006085pp | research-senate-official-ne-2026; modern-heideman-v1-senate-ne_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 31083 | Harlan | senate | senate-race-population-change | neutral | -13.368781pp | research-senate-official-ne-2026; modern-heideman-v1-senate-ne_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 31087 | Hitchcock | senate | senate-race-population-change | neutral | -11.180924pp | research-senate-official-ne-2026; modern-heideman-v1-senate-ne_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 31095 | Jefferson | senate | senate-race-population-change | neutral | -10.753718pp | research-senate-official-ne-2026; modern-heideman-v1-senate-ne_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 31105 | Kimball | senate | senate-race-population-change | neutral | -15.22919pp | research-senate-official-ne-2026; modern-heideman-v1-senate-ne_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 31129 | Nuckolls | senate | senate-race-population-change | neutral | -12.336422pp | research-senate-official-ne-2026; modern-heideman-v1-senate-ne_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 31131 | Otoe | senate | senate-race-population-change | neutral | -10.605046pp | research-senate-official-ne-2026; modern-heideman-v1-senate-ne_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 31135 | Perkins | senate | senate-race-population-change | neutral | -10.875179pp | research-senate-official-ne-2026; modern-heideman-v1-senate-ne_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 31137 | Phelps | senate | senate-race-population-change | neutral | -10.055485pp | research-senate-official-ne-2026; modern-heideman-v1-senate-ne_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 31143 | Polk | senate | senate-race-population-change | neutral | -12.555308pp | research-senate-official-ne-2026; modern-heideman-v1-senate-ne_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 31165 | Sioux | senate | senate-race-population-change | neutral | -18.645442pp | research-senate-official-ne-2026; modern-heideman-v1-senate-ne_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 31169 | Thayer | senate | senate-race-population-change | neutral | -10.528988pp | research-senate-official-ne-2026; modern-heideman-v1-senate-ne_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 31175 | Valley | senate | senate-race-population-change | neutral | -10.765048pp | research-senate-official-ne-2026; modern-heideman-v1-senate-ne_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 31181 | Webster | senate | senate-race-population-change | neutral | -11.584064pp | research-senate-official-ne-2026; modern-heideman-v1-senate-ne_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 31185 | York | senate | senate-race-population-change | neutral | -11.214853pp | research-senate-official-ne-2026; modern-heideman-v1-senate-ne_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 34011 | Cumberland | senate | senate-race-population-change | neutral | -15.464927pp | modern-current-2026-nj; modern-heideman-v1-senate-nj_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 34013 | Essex | senate | senate-race-population-change | neutral | -14.908271pp | modern-current-2026-nj; modern-heideman-v1-senate-nj_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 34031 | Passaic | senate | senate-race-population-change | neutral | -17.016648pp | modern-current-2026-nj; modern-heideman-v1-senate-nj_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 34035 | Somerset | senate | senate-race-population-change | neutral | -17.26346pp | modern-current-2026-nj; modern-heideman-v1-senate-nj_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37001 | Alamance | senate | senate-share-swing | democrat | D share 11.297925pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37001 | Alamance | senate | senate-race-population-change | neutral | -13.379591pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37003 | Alexander | senate | senate-race-population-change | neutral | -18.596552pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37005 | Alleghany | senate | senate-race-population-change | neutral | -14.254858pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37007 | Anson | senate | senate-race-population-change | neutral | -13.133935pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37009 | Ashe | senate | senate-share-swing | democrat | D share 10.384463pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37009 | Ashe | senate | senate-race-population-change | neutral | -16.02963pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37011 | Avery | senate | senate-race-population-change | neutral | -15.107007pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37013 | Beaufort | senate | senate-race-population-change | neutral | -13.807955pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37015 | Bertie | senate | senate-race-population-change | neutral | -15.680122pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37017 | Bladen | senate | senate-race-population-change | neutral | -17.092482pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37019 | Brunswick | senate | senate-race-population-change | neutral | -14.955462pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37021 | Buncombe | senate | senate-party-count-change | democrat | Republican: -44.511271%; opponent 1.81516% | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37021 | Buncombe | senate | senate-share-swing | democrat | D share 13.270034pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37021 | Buncombe | senate | senate-race-population-change | neutral | -12.044501pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37023 | Burke | senate | senate-race-population-change | neutral | -16.645541pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37025 | Cabarrus | senate | senate-party-count-change | democrat | Republican: -42.986396%; opponent 2.327865% | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37025 | Cabarrus | senate | senate-share-swing | democrat | D share 14.502898pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37025 | Cabarrus | senate | senate-race-population-change | neutral | -16.289154pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37027 | Caldwell | senate | senate-party-count-change | democrat | Republican: -41.696974%; opponent -12.315319% | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37027 | Caldwell | senate | senate-race-population-change | neutral | -18.912409pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37029 | Camden | senate | senate-race-population-change | neutral | -16.187181pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37031 | Carteret | senate | senate-race-population-change | neutral | -12.51382pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37033 | Caswell | senate | senate-race-population-change | neutral | -14.63147pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37035 | Catawba | senate | senate-share-swing | democrat | D share 10.749877pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37035 | Catawba | senate | senate-race-population-change | neutral | -16.181018pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37037 | Chatham | senate | senate-share-swing | democrat | D share 11.750322pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37037 | Chatham | senate | senate-race-population-change | neutral | -12.479799pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37039 | Cherokee | senate | senate-race-population-change | neutral | -16.487432pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37041 | Chowan | senate | senate-race-population-change | neutral | -14.019602pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37043 | Clay | senate | senate-race-population-change | neutral | -14.235292pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37045 | Cleveland | senate | senate-party-count-change | democrat | Republican: -40.016239%; opponent -12.917861% | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37045 | Cleveland | senate | senate-race-population-change | neutral | -17.387068pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37047 | Columbus | senate | senate-race-population-change | neutral | -18.115554pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37049 | Craven | senate | senate-race-population-change | neutral | -11.863376pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37051 | Cumberland | senate | senate-race-population-change | neutral | -15.132057pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37053 | Currituck | senate | senate-race-population-change | neutral | -17.845586pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37055 | Dare | senate | senate-race-population-change | neutral | -14.357609pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37057 | Davidson | senate | senate-party-count-change | democrat | Republican: -40.175658%; opponent -3.364328% | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37057 | Davidson | senate | senate-share-swing | democrat | D share 10.590734pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37057 | Davidson | senate | senate-race-population-change | neutral | -18.481806pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37059 | Davie | senate | senate-race-population-change | neutral | -18.376503pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37061 | Duplin | senate | senate-race-population-change | neutral | -15.008349pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37063 | Durham | senate | senate-party-count-change | democrat | Republican: -49.730616%; opponent -5.34859% | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37063 | Durham | senate | senate-race-population-change | neutral | -12.125546pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37065 | Edgecombe | senate | senate-race-population-change | neutral | -15.2714pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37067 | Forsyth | senate | senate-party-count-change | democrat | Republican: -42.888211%; opponent -5.263011% | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37067 | Forsyth | senate | senate-share-swing | democrat | D share 11.821824pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37067 | Forsyth | senate | senate-race-population-change | neutral | -14.163253pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37069 | Franklin | senate | senate-race-population-change | neutral | -13.359509pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37071 | Gaston | senate | senate-party-count-change | democrat | Republican: -41.717341%; opponent 2.101275% | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37071 | Gaston | senate | senate-share-swing | democrat | D share 13.659614pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37071 | Gaston | senate | senate-race-population-change | neutral | -16.357074pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37073 | Gates | senate | senate-race-population-change | neutral | -15.500859pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37075 | Graham | senate | senate-race-population-change | neutral | -11.336335pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37077 | Granville | senate | senate-race-population-change | neutral | -12.283636pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37079 | Greene | senate | senate-race-population-change | neutral | -12.387544pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37081 | Guilford | senate | senate-party-count-change | democrat | Republican: -42.002516%; opponent -8.179203% | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37081 | Guilford | senate | senate-share-swing | democrat | D share 10.198585pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37081 | Guilford | senate | senate-race-population-change | neutral | -13.732611pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37083 | Halifax | senate | senate-race-population-change | neutral | -14.843778pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37085 | Harnett | senate | senate-share-swing | democrat | D share 11.056472pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37085 | Harnett | senate | senate-race-population-change | neutral | -13.324713pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37087 | Haywood | senate | senate-share-swing | democrat | D share 12.365609pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37087 | Haywood | senate | senate-race-population-change | neutral | -13.71589pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37089 | Henderson | senate | senate-share-swing | democrat | D share 13.501391pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37089 | Henderson | senate | senate-race-population-change | neutral | -11.719416pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37091 | Hertford | senate | senate-race-population-change | neutral | -11.321532pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37093 | Hoke | senate | senate-party-count-change | democrat | Republican: -40.865941%; opponent -9.384267% | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37093 | Hoke | senate | senate-share-swing | democrat | D share 10.007482pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37093 | Hoke | senate | senate-race-population-change | neutral | -12.946957pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37095 | Hyde | senate | senate-race-population-change | neutral | -11.77413pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37097 | Iredell | senate | senate-share-swing | democrat | D share 11.414018pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37097 | Iredell | senate | senate-race-population-change | neutral | -18.238201pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37099 | Jackson | senate | senate-party-count-change | democrat | Republican: -40.787884%; opponent -2.248987% | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37099 | Jackson | senate | senate-share-swing | democrat | D share 12.427907pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37099 | Jackson | senate | senate-race-population-change | neutral | -14.727345pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37101 | Johnston | senate | senate-share-swing | democrat | D share 15.066937pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37101 | Johnston | senate | senate-race-population-change | neutral | -16.067921pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37103 | Jones | senate | senate-race-population-change | neutral | -18.61439pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37105 | Lee | senate | senate-party-count-change | democrat | Republican: -40.151761%; opponent -4.075605% | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37105 | Lee | senate | senate-share-swing | democrat | D share 11.737171pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37105 | Lee | senate | senate-race-population-change | neutral | -15.100098pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37107 | Lenoir | senate | senate-race-population-change | neutral | -16.066007pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37109 | Lincoln | senate | senate-race-population-change | neutral | -18.302965pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37111 | McDowell | senate | senate-party-count-change | democrat | Republican: -41.902605%; opponent 9.757331% | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37111 | McDowell | senate | senate-share-swing | democrat | D share 14.174992pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37111 | McDowell | senate | senate-race-population-change | neutral | -15.183843pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37113 | Macon | senate | senate-share-swing | democrat | D share 20.07942pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37113 | Macon | senate | senate-race-vote-change | neutral | 20517→10477; -48.935029% | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37113 | Macon | senate | senate-race-population-change | neutral | -28.619014pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37115 | Madison | senate | senate-party-count-change | democrat | Republican: -43.776186%; opponent -3.689593% | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37115 | Madison | senate | senate-share-swing | democrat | D share 13.323768pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37115 | Madison | senate | senate-race-population-change | neutral | -20.21699pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37117 | Martin | senate | senate-party-count-change | republican | Republican: 67.434538%; opponent -2.996819% | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37117 | Martin | senate | senate-share-swing | republican | D share -13.298853pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37117 | Martin | senate | senate-race-population-change | neutral | 19.160069pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37119 | Mecklenburg | senate | senate-party-count-change | democrat | Republican: -47.592572%; opponent -4.91084% | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37119 | Mecklenburg | senate | senate-share-swing | democrat | D share 12.055244pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37119 | Mecklenburg | senate | senate-race-population-change | neutral | -14.739781pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37121 | Mitchell | senate | senate-share-swing | democrat | D share 10.960695pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37121 | Mitchell | senate | senate-race-population-change | neutral | -18.474407pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37123 | Montgomery | senate | senate-race-population-change | neutral | -15.317945pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37125 | Moore | senate | senate-race-population-change | neutral | -17.187904pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37127 | Nash | senate | senate-race-population-change | neutral | -13.172807pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37129 | New Hanover | senate | senate-share-swing | democrat | D share 11.353786pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37129 | New Hanover | senate | senate-race-population-change | neutral | -15.777309pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37131 | Northampton | senate | senate-race-population-change | neutral | -15.063071pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37133 | Onslow | senate | senate-race-population-change | neutral | -11.552247pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37135 | Orange | senate | senate-party-count-change | democrat | Republican: -47.368421%; opponent -1.901526% | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37135 | Orange | senate | senate-race-population-change | neutral | -11.486755pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37137 | Pamlico | senate | senate-race-population-change | neutral | -13.929874pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37139 | Pasquotank | senate | senate-race-population-change | neutral | -13.324074pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37141 | Pender | senate | senate-race-population-change | neutral | -20.149853pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37143 | Perquimans | senate | senate-race-population-change | neutral | -15.550059pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37145 | Person | senate | senate-race-population-change | neutral | -15.918745pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37147 | Pitt | senate | senate-race-population-change | neutral | -15.930315pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37149 | Polk | senate | senate-race-population-change | neutral | -14.095671pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37151 | Randolph | senate | senate-party-count-change | democrat | Republican: -41.286054%; opponent -4.820635% | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37151 | Randolph | senate | senate-race-population-change | neutral | -18.417821pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37153 | Richmond | senate | senate-race-population-change | neutral | -15.889362pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37155 | Robeson | senate | senate-race-population-change | neutral | -15.021778pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37157 | Rockingham | senate | senate-race-population-change | neutral | -15.646498pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37159 | Rowan | senate | senate-share-swing | democrat | D share 10.41008pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37159 | Rowan | senate | senate-race-population-change | neutral | -16.791209pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37161 | Rutherford | senate | senate-race-population-change | neutral | -18.075445pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37163 | Sampson | senate | senate-race-population-change | neutral | -18.048558pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37165 | Scotland | senate | senate-race-population-change | neutral | -12.110965pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37167 | Stanly | senate | senate-race-population-change | neutral | -18.121656pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37169 | Stokes | senate | senate-race-population-change | neutral | -19.306899pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37171 | Surry | senate | senate-party-count-change | democrat | Republican: -41.165849%; opponent -7.855833% | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37171 | Surry | senate | senate-race-population-change | neutral | -17.494431pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37173 | Swain | senate | senate-race-population-change | neutral | -12.899211pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37175 | Transylvania | senate | senate-share-swing | democrat | D share 13.031081pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37175 | Transylvania | senate | senate-race-population-change | neutral | -13.360745pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37177 | Tyrrell | senate | senate-race-population-change | neutral | -16.803457pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37179 | Union | senate | senate-share-swing | democrat | D share 12.396374pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37179 | Union | senate | senate-race-population-change | neutral | -16.611915pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37181 | Vance | senate | senate-race-population-change | neutral | -14.496665pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37183 | Wake | senate | senate-party-count-change | democrat | Republican: -42.78319%; opponent 3.43932% | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37183 | Wake | senate | senate-share-swing | democrat | D share 12.822051pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37183 | Wake | senate | senate-race-population-change | neutral | -13.844596pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37185 | Warren | senate | senate-race-population-change | neutral | -12.483152pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37187 | Washington | senate | senate-race-population-change | neutral | -13.411995pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37189 | Watauga | senate | senate-party-count-change | democrat | Republican: -41.762802%; opponent -8.126968% | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37189 | Watauga | senate | senate-share-swing | democrat | D share 10.996165pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37189 | Watauga | senate | senate-race-population-change | neutral | -15.077375pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37191 | Wayne | senate | senate-race-population-change | neutral | -15.115523pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37193 | Wilkes | senate | senate-race-population-change | neutral | -17.679626pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37195 | Wilson | senate | senate-race-population-change | neutral | -14.7867pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37197 | Yadkin | senate | senate-race-population-change | neutral | -17.731209pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 37199 | Yancey | senate | senate-share-swing | democrat | D share 11.458101pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 37199 | Yancey | senate | senate-race-population-change | neutral | -17.350221pp | modern-current-2026-nc; modern-heideman-v1-senate-nc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 39001 | Adams | governor | governor-share-swing | democrat | D share 11.349596pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39003 | Allen | governor | governor-party-count-change | democrat | Democrat: 68.032187%; opponent -13.577629% | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39003 | Allen | governor | governor-share-swing | democrat | D share 13.131231pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39005 | Ashland | governor | governor-party-count-change | democrat | Democrat: 67.846608%; opponent -12.984149% | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39005 | Ashland | governor | governor-share-swing | democrat | D share 12.697506pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39007 | Ashtabula | governor | governor-share-swing | democrat | D share 14.992544pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39009 | Athens | governor | governor-share-swing | democrat | D share 14.326367pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39011 | Auglaize | governor | governor-party-count-change | democrat | Democrat: 71.544058%; opponent -11.942069% | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39013 | Belmont | governor | governor-share-swing | democrat | D share 11.266553pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39015 | Brown | governor | governor-party-count-change | democrat | Democrat: 73.01855%; opponent -12.540745% | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39015 | Brown | governor | governor-share-swing | democrat | D share 11.792672pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39017 | Butler | governor | governor-party-count-change | democrat | Democrat: 71.552401%; opponent -14.694159% | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39017 | Butler | governor | governor-share-swing | democrat | D share 16.248659pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39019 | Carroll | governor | governor-share-swing | democrat | D share 10.890318pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39021 | Champaign | governor | governor-party-count-change | democrat | Democrat: 65.867657%; opponent -14.659131% | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39021 | Champaign | governor | governor-share-swing | democrat | D share 12.970195pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39023 | Clark | governor | governor-share-swing | democrat | D share 15.816065pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39025 | Clermont | governor | governor-party-count-change | democrat | Democrat: 68.556109%; opponent -13.684851% | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39025 | Clermont | governor | governor-share-swing | democrat | D share 14.716673pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39027 | Clinton | governor | governor-party-count-change | democrat | Democrat: 72.861014%; opponent -10.680373% | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39027 | Clinton | governor | governor-share-swing | democrat | D share 11.968349pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39029 | Columbiana | governor | governor-share-swing | democrat | D share 14.529504pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39031 | Coshocton | governor | governor-share-swing | democrat | D share 12.886094pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39033 | Crawford | governor | governor-share-swing | democrat | D share 12.152735pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39035 | Cuyahoga | governor | governor-share-swing | democrat | D share 16.843081pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39037 | Darke | governor | governor-party-count-change | democrat | Democrat: 77.719156%; opponent -14.926496% | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39037 | Darke | governor | governor-share-swing | democrat | D share 10.472135pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39039 | Defiance | governor | governor-share-swing | democrat | D share 15.017629pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39041 | Delaware | governor | governor-share-swing | democrat | D share 17.799605pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39043 | Erie | governor | governor-share-swing | democrat | D share 16.516818pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39045 | Fairfield | governor | governor-share-swing | democrat | D share 18.08395pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39047 | Fayette | governor | governor-party-count-change | democrat | Democrat: 80.623306%; opponent -13.409518% | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39047 | Fayette | governor | governor-share-swing | democrat | D share 13.219216pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39049 | Franklin | governor | governor-share-swing | democrat | D share 16.459249pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39051 | Fulton | governor | governor-share-swing | democrat | D share 17.006426pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39053 | Gallia | governor | governor-share-swing | democrat | D share 10.297611pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39055 | Geauga | governor | governor-share-swing | democrat | D share 14.242237pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39057 | Greene | governor | governor-share-swing | democrat | D share 17.101252pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39059 | Guernsey | governor | governor-share-swing | democrat | D share 12.615416pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39061 | Hamilton | governor | governor-share-swing | democrat | D share 15.883176pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39063 | Hancock | governor | governor-share-swing | democrat | D share 16.771933pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39065 | Hardin | governor | governor-share-swing | democrat | D share 12.479502pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39067 | Harrison | governor | governor-share-swing | democrat | D share 11.029939pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39069 | Henry | governor | governor-share-swing | democrat | D share 15.670571pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39071 | Highland | governor | governor-party-count-change | democrat | Democrat: 73.84106%; opponent -9.108456% | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39071 | Highland | governor | governor-share-swing | democrat | D share 10.82473pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39073 | Hocking | governor | governor-share-swing | democrat | D share 13.087057pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39075 | Holmes | governor | governor-party-count-change | democrat | Democrat: 62.600897%; opponent -7.174332% | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39077 | Huron | governor | governor-share-swing | democrat | D share 13.931682pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39079 | Jackson | governor | governor-party-count-change | democrat | Democrat: 74.328188%; opponent -10.607138% | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39079 | Jackson | governor | governor-share-swing | democrat | D share 12.742789pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39081 | Jefferson | governor | governor-share-swing | democrat | D share 11.575441pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39083 | Knox | governor | governor-party-count-change | democrat | Democrat: 45.59276%; opponent -13.13044% | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39083 | Knox | governor | governor-share-swing | democrat | D share 10.645852pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39085 | Lake | governor | governor-share-swing | democrat | D share 17.505055pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39087 | Lawrence | governor | governor-share-swing | democrat | D share 13.667319pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39089 | Licking | governor | governor-share-swing | democrat | D share 16.624449pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39091 | Logan | governor | governor-party-count-change | democrat | Democrat: 79.330212%; opponent -12.521213% | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39091 | Logan | governor | governor-share-swing | democrat | D share 12.573961pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39093 | Lorain | governor | governor-share-swing | democrat | D share 17.182124pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39095 | Lucas | governor | governor-share-swing | democrat | D share 19.59109pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39097 | Madison | governor | governor-party-count-change | democrat | Democrat: 81.011097%; opponent -9.960122% | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39097 | Madison | governor | governor-share-swing | democrat | D share 14.5601pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39099 | Mahoning | governor | governor-share-swing | democrat | D share 21.498852pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39101 | Marion | governor | governor-share-swing | democrat | D share 14.896701pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39103 | Medina | governor | governor-share-swing | democrat | D share 15.795779pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39105 | Meigs | governor | governor-party-count-change | democrat | Democrat: 47.333772%; opponent -13.97046% | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39105 | Meigs | governor | governor-share-swing | democrat | D share 10.248299pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39107 | Mercer | governor | governor-party-count-change | democrat | Democrat: 66.367713%; opponent -11.283516% | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39109 | Miami | governor | governor-share-swing | democrat | D share 15.384332pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39113 | Montgomery | governor | governor-share-swing | democrat | D share 18.520009pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39115 | Morgan | governor | governor-share-swing | democrat | D share 12.830926pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39117 | Morrow | governor | governor-party-count-change | democrat | Democrat: 63.636364%; opponent -12.834175% | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39117 | Morrow | governor | governor-share-swing | democrat | D share 11.491943pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39119 | Muskingum | governor | governor-share-swing | democrat | D share 14.502687pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39123 | Ottawa | governor | governor-share-swing | democrat | D share 17.481432pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39125 | Paulding | governor | governor-party-count-change | democrat | Democrat: 106.614786%; opponent 13.387502% | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39125 | Paulding | governor | governor-share-swing | democrat | D share 11.266475pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39125 | Paulding | governor | governor-race-population-change | neutral | 13.148857pp | modern-current-2026-oh; modern-medsl-governor-2022-oh; census2025 |
| 39127 | Perry | governor | governor-party-count-change | democrat | Democrat: 57.455268%; opponent -14.574112% | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39127 | Perry | governor | governor-share-swing | democrat | D share 11.999615pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39129 | Pickaway | governor | governor-party-count-change | democrat | Democrat: 76.474703%; opponent -10.368861% | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39129 | Pickaway | governor | governor-share-swing | democrat | D share 13.704018pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39131 | Pike | governor | governor-party-count-change | democrat | Democrat: 52.605863%; opponent -8.269655% | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39131 | Pike | governor | governor-share-swing | democrat | D share 10.400072pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39133 | Portage | governor | governor-share-swing | democrat | D share 15.691815pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39135 | Preble | governor | governor-share-swing | democrat | D share 12.530571pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39137 | Putnam | governor | governor-party-count-change | democrat | Democrat: 93.290323%; opponent -12.841367% | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39137 | Putnam | governor | governor-share-swing | democrat | D share 10.046385pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39139 | Richland | governor | governor-party-count-change | democrat | Democrat: 49.832199%; opponent -14.13638% | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39139 | Richland | governor | governor-share-swing | democrat | D share 11.831497pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39141 | Ross | governor | governor-party-count-change | democrat | Democrat: 56.832864%; opponent -14.027643% | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39141 | Ross | governor | governor-share-swing | democrat | D share 13.24201pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39143 | Sandusky | governor | governor-share-swing | democrat | D share 18.134884pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39145 | Scioto | governor | governor-share-swing | democrat | D share 12.972473pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39147 | Seneca | governor | governor-share-swing | democrat | D share 17.752583pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39149 | Shelby | governor | governor-party-count-change | democrat | Democrat: 84.068093%; opponent -11.439842% | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39149 | Shelby | governor | governor-share-swing | democrat | D share 10.529972pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39151 | Stark | governor | governor-share-swing | democrat | D share 16.664066pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39153 | Summit | governor | governor-share-swing | democrat | D share 16.734074pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39155 | Trumbull | governor | governor-share-swing | democrat | D share 20.40157pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39157 | Tuscarawas | governor | governor-share-swing | democrat | D share 13.220519pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39159 | Union | governor | governor-party-count-change | democrat | Democrat: 94.362533%; opponent -8.990047% | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39159 | Union | governor | governor-share-swing | democrat | D share 17.214213pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39161 | Van Wert | governor | governor-party-count-change | democrat | Democrat: 58.695652%; opponent -12.235777% | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39161 | Van Wert | governor | governor-share-swing | democrat | D share 10.047029pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39165 | Warren | governor | governor-party-count-change | democrat | Democrat: 69.571481%; opponent -14.686933% | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39165 | Warren | governor | governor-share-swing | democrat | D share 15.293811pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39167 | Washington | governor | governor-share-swing | democrat | D share 13.493048pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39169 | Wayne | governor | governor-party-count-change | democrat | Democrat: 55.323697%; opponent -13.816999% | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39169 | Wayne | governor | governor-share-swing | democrat | D share 12.719438pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39171 | Williams | governor | governor-share-swing | democrat | D share 14.126361pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39173 | Wood | governor | governor-share-swing | democrat | D share 19.534399pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39175 | Wyandot | governor | governor-party-count-change | democrat | Democrat: 90.372272%; opponent -5.09408% | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 39175 | Wyandot | governor | governor-share-swing | democrat | D share 13.098154pp | modern-current-2026-oh; modern-medsl-governor-2022-oh |
| 45001 | Abbeville | senate | senate-race-population-change | neutral | -14.969887pp | modern-current-2026-sc; modern-heideman-v1-senate-sc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 45003 | Aiken | senate | senate-race-population-change | neutral | -13.022349pp | modern-current-2026-sc; modern-heideman-v1-senate-sc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 45005 | Allendale | senate | senate-race-population-change | neutral | -11.594445pp | modern-current-2026-sc; modern-heideman-v1-senate-sc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 45007 | Anderson | senate | senate-race-population-change | neutral | -13.520658pp | modern-current-2026-sc; modern-heideman-v1-senate-sc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 45009 | Bamberg | senate | senate-race-population-change | neutral | -12.673925pp | modern-current-2026-sc; modern-heideman-v1-senate-sc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 45011 | Barnwell | senate | senate-race-population-change | neutral | -13.037362pp | modern-current-2026-sc; modern-heideman-v1-senate-sc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 45013 | Beaufort | senate | senate-race-population-change | neutral | -10.071094pp | modern-current-2026-sc; modern-heideman-v1-senate-sc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 45015 | Berkeley | senate | senate-race-population-change | neutral | -12.052992pp | modern-current-2026-sc; modern-heideman-v1-senate-sc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 45017 | Calhoun | senate | senate-race-population-change | neutral | -17.333752pp | modern-current-2026-sc; modern-heideman-v1-senate-sc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 45019 | Charleston | senate | senate-race-population-change | neutral | -13.410861pp | modern-current-2026-sc; modern-heideman-v1-senate-sc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 45021 | Cherokee | senate | senate-race-population-change | neutral | -14.624662pp | modern-current-2026-sc; modern-heideman-v1-senate-sc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 45023 | Chester | senate | senate-race-population-change | neutral | -12.273259pp | modern-current-2026-sc; modern-heideman-v1-senate-sc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 45025 | Chesterfield | senate | senate-race-population-change | neutral | -12.741434pp | modern-current-2026-sc; modern-heideman-v1-senate-sc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 45027 | Clarendon | senate | senate-race-population-change | neutral | -10.480533pp | modern-current-2026-sc; modern-heideman-v1-senate-sc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 45029 | Colleton | senate | senate-race-population-change | neutral | -15.262114pp | modern-current-2026-sc; modern-heideman-v1-senate-sc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 45031 | Darlington | senate | senate-race-population-change | neutral | -14.201545pp | modern-current-2026-sc; modern-heideman-v1-senate-sc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 45033 | Dillon | senate | senate-race-population-change | neutral | -14.196386pp | modern-current-2026-sc; modern-heideman-v1-senate-sc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 45035 | Dorchester | senate | senate-race-population-change | neutral | -12.766097pp | modern-current-2026-sc; modern-heideman-v1-senate-sc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 45037 | Edgefield | senate | senate-race-population-change | neutral | -15.567261pp | modern-current-2026-sc; modern-heideman-v1-senate-sc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 45039 | Fairfield | senate | senate-race-population-change | neutral | -10.581456pp | modern-current-2026-sc; modern-heideman-v1-senate-sc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 45041 | Florence | senate | senate-race-population-change | neutral | -11.917969pp | modern-current-2026-sc; modern-heideman-v1-senate-sc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 45043 | Georgetown | senate | senate-race-population-change | neutral | -10.8571pp | modern-current-2026-sc; modern-heideman-v1-senate-sc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 45045 | Greenville | senate | senate-race-population-change | neutral | -12.091348pp | modern-current-2026-sc; modern-heideman-v1-senate-sc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 45047 | Greenwood | senate | senate-race-population-change | neutral | -11.269193pp | modern-current-2026-sc; modern-heideman-v1-senate-sc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 45049 | Hampton | senate | senate-race-population-change | neutral | -13.702421pp | modern-current-2026-sc; modern-heideman-v1-senate-sc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 45051 | Horry | senate | senate-race-population-change | neutral | -12.420612pp | modern-current-2026-sc; modern-heideman-v1-senate-sc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 45055 | Kershaw | senate | senate-share-swing | democrat | D share 10.324243pp | modern-current-2026-sc; modern-heideman-v1-senate-sc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 45055 | Kershaw | senate | senate-race-population-change | neutral | -15.913005pp | modern-current-2026-sc; modern-heideman-v1-senate-sc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 45057 | Lancaster | senate | senate-race-population-change | neutral | -14.210012pp | modern-current-2026-sc; modern-heideman-v1-senate-sc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 45059 | Laurens | senate | senate-race-population-change | neutral | -12.571907pp | modern-current-2026-sc; modern-heideman-v1-senate-sc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 45061 | Lee | senate | senate-race-population-change | neutral | -10.746594pp | modern-current-2026-sc; modern-heideman-v1-senate-sc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 45063 | Lexington | senate | senate-share-swing | democrat | D share 10.658815pp | modern-current-2026-sc; modern-heideman-v1-senate-sc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 45063 | Lexington | senate | senate-race-population-change | neutral | -12.620111pp | modern-current-2026-sc; modern-heideman-v1-senate-sc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 45067 | Marion | senate | senate-race-population-change | neutral | -10.862009pp | modern-current-2026-sc; modern-heideman-v1-senate-sc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 45069 | Marlboro | senate | senate-race-population-change | neutral | -15.006191pp | modern-current-2026-sc; modern-heideman-v1-senate-sc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 45071 | Newberry | senate | senate-race-population-change | neutral | -12.992079pp | modern-current-2026-sc; modern-heideman-v1-senate-sc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 45073 | Oconee | senate | senate-race-population-change | neutral | -12.891292pp | modern-current-2026-sc; modern-heideman-v1-senate-sc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 45075 | Orangeburg | senate | senate-race-population-change | neutral | -12.030654pp | modern-current-2026-sc; modern-heideman-v1-senate-sc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 45077 | Pickens | senate | senate-race-population-change | neutral | -11.59207pp | modern-current-2026-sc; modern-heideman-v1-senate-sc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 45081 | Saluda | senate | senate-race-population-change | neutral | -13.409932pp | modern-current-2026-sc; modern-heideman-v1-senate-sc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 45083 | Spartanburg | senate | senate-share-swing | democrat | D share 10.270802pp | modern-current-2026-sc; modern-heideman-v1-senate-sc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 45083 | Spartanburg | senate | senate-race-population-change | neutral | -13.752162pp | modern-current-2026-sc; modern-heideman-v1-senate-sc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 45085 | Sumter | senate | senate-race-population-change | neutral | -11.747884pp | modern-current-2026-sc; modern-heideman-v1-senate-sc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 45087 | Union | senate | senate-race-population-change | neutral | -13.578157pp | modern-current-2026-sc; modern-heideman-v1-senate-sc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 45089 | Williamsburg | senate | senate-race-population-change | neutral | -12.390533pp | modern-current-2026-sc; modern-heideman-v1-senate-sc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 45091 | York | senate | senate-race-population-change | neutral | -13.022405pp | modern-current-2026-sc; modern-heideman-v1-senate-sc_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46003 | Aurora | senate | senate-race-population-change | neutral | -16.906115pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46005 | Beadle | senate | senate-race-population-change | neutral | -12.540468pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46007 | Bennett | governor | governor-share-swing | democrat | D share 10.46581pp | modern-official-sd-governor-2026; modern-medsl-governor-2022-sd |
| 46009 | Bon Homme | senate | senate-race-population-change | neutral | -13.219828pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46011 | Brookings | senate | senate-race-population-change | neutral | -11.938041pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46013 | Brown | senate | senate-race-population-change | neutral | -13.67008pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46015 | Brule | senate | senate-race-population-change | neutral | -13.857119pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46019 | Butte | senate | senate-race-population-change | neutral | -14.732823pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46021 | Campbell | senate | senate-race-population-change | neutral | -19.271665pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46023 | Charles Mix | senate | senate-race-population-change | neutral | -12.057189pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46027 | Clay | senate | senate-race-population-change | neutral | -10.818924pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46029 | Codington | senate | senate-race-population-change | neutral | -12.823253pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46031 | Corson | senate | senate-race-vote-change | neutral | 1264→710; -43.829114% | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 46031 | Corson | senate | senate-race-population-change | neutral | -13.707121pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46033 | Custer | senate | senate-race-population-change | neutral | -16.105517pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46035 | Davison | senate | senate-race-population-change | neutral | -12.148348pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46037 | Day | senate | senate-race-population-change | neutral | -13.527998pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46039 | Deuel | senate | senate-race-population-change | neutral | -16.244504pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46041 | Dewey | senate | senate-race-population-change | neutral | -14.11748pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46043 | Douglas | senate | senate-race-population-change | neutral | -16.532846pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46045 | Edmunds | senate | senate-race-population-change | neutral | -14.096465pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46047 | Fall River | senate | senate-race-population-change | neutral | -13.643364pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46049 | Faulk | senate | senate-race-population-change | neutral | -18.407417pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46051 | Grant | senate | senate-race-population-change | neutral | -11.235834pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46053 | Gregory | senate | senate-race-population-change | neutral | -17.533749pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46053 | Gregory | governor | governor-race-population-change | neutral | -12.504397pp | modern-official-sd-governor-2026; modern-medsl-governor-2022-sd; census2025 |
| 46055 | Haakon | senate | senate-race-population-change | neutral | -14.495279pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46057 | Hamlin | senate | senate-race-population-change | neutral | -17.43162pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46057 | Hamlin | governor | governor-race-population-change | neutral | -10.14949pp | modern-official-sd-governor-2026; modern-medsl-governor-2022-sd; census2025 |
| 46059 | Hand | senate | senate-race-population-change | neutral | -18.500729pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46061 | Hanson | senate | senate-race-vote-change | neutral | 2360→1181; -49.957627% | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 46061 | Hanson | senate | senate-race-population-change | neutral | -33.917564pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46061 | Hanson | governor | governor-race-population-change | neutral | -14.300664pp | modern-official-sd-governor-2026; modern-medsl-governor-2022-sd; census2025 |
| 46063 | Harding | senate | senate-race-population-change | neutral | -12.035394pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46065 | Hughes | senate | senate-race-population-change | neutral | -12.680488pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46067 | Hutchinson | senate | senate-race-population-change | neutral | -16.099255pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46069 | Hyde | senate | senate-race-population-change | neutral | -14.485847pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46071 | Jackson | senate | senate-race-population-change | neutral | -10.844472pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46073 | Jerauld | senate | senate-race-population-change | neutral | -18.685881pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46073 | Jerauld | governor | governor-race-population-change | neutral | -10.065099pp | modern-official-sd-governor-2026; modern-medsl-governor-2022-sd; census2025 |
| 46077 | Kingsbury | senate | senate-race-population-change | neutral | -14.627016pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46079 | Lake | senate | senate-race-population-change | neutral | -13.16516pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46081 | Lawrence | senate | senate-race-population-change | neutral | -16.319364pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46083 | Lincoln | senate | senate-race-population-change | neutral | -15.06905pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46085 | Lyman | senate | senate-race-population-change | neutral | -12.796493pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46087 | McCook | senate | senate-race-population-change | neutral | -15.009962pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46089 | McPherson | senate | senate-race-population-change | neutral | -12.797887pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46091 | Marshall | senate | senate-race-population-change | neutral | -13.45596pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46093 | Meade | senate | senate-race-population-change | neutral | -12.68733pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46095 | Mellette | senate | senate-race-population-change | neutral | -11.861582pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46097 | Miner | senate | senate-race-population-change | neutral | -11.071155pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46099 | Minnehaha | senate | senate-race-population-change | neutral | -14.992459pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46101 | Moody | senate | senate-race-population-change | neutral | -13.798525pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46103 | Pennington | senate | senate-race-population-change | neutral | -19.188775pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46105 | Perkins | senate | senate-race-population-change | neutral | -13.773115pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46107 | Potter | senate | senate-race-population-change | neutral | -17.114527pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46109 | Roberts | senate | senate-race-population-change | neutral | -13.012158pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46111 | Sanborn | senate | senate-race-population-change | neutral | -15.969368pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46115 | Spink | senate | senate-race-population-change | neutral | -13.212385pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46117 | Stanley | senate | senate-race-population-change | neutral | -11.794662pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46119 | Sully | senate | senate-race-population-change | neutral | -15.746339pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46123 | Tripp | senate | senate-race-population-change | neutral | -14.119551pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46125 | Turner | senate | senate-race-population-change | neutral | -17.49527pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46127 | Union | senate | senate-race-population-change | neutral | -18.915341pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46129 | Walworth | senate | senate-race-population-change | neutral | -17.042857pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46135 | Yankton | senate | senate-race-population-change | neutral | -14.034832pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 46137 | Ziebach | senate | senate-race-population-change | neutral | -14.241963pp | modern-official-sd-senate-2026; modern-heideman-v1-senate-sd_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 48001 | Anderson | governor | governor-party-count-change | democrat | Democrat: 52.534381%; opponent -4.318993% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48003 | Andrews | governor | governor-party-count-change | democrat | Democrat: 121.294363%; opponent -8.41914% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48003 | Andrews | governor | governor-share-swing | democrat | D share 13.28634pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48005 | Angelina | governor | governor-party-count-change | democrat | Democrat: 69.540008%; opponent -4.905444% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48005 | Angelina | governor | governor-share-swing | democrat | D share 11.240828pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48009 | Archer | governor | governor-party-count-change | democrat | Democrat: 72.063492%; opponent -2.973128% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48013 | Atascosa | governor | governor-party-count-change | democrat | Democrat: 55.87918%; opponent -2.352005% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48013 | Atascosa | governor | governor-share-swing | democrat | D share 10.568836pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48015 | Austin | governor | governor-party-count-change | democrat | Democrat: 69.620929%; opponent 3.08394% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48017 | Bailey | governor | governor-party-count-change | democrat | Democrat: 101.877934%; opponent -11.855204% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48017 | Bailey | governor | governor-share-swing | democrat | D share 14.465931pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48021 | Bastrop | governor | governor-party-count-change | democrat | Democrat: 60.473057%; opponent 3.268091% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48021 | Bastrop | governor | governor-share-swing | democrat | D share 10.942848pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48025 | Bee | governor | governor-party-count-change | democrat | Democrat: 47.064777%; opponent -4.37083% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48027 | Bell | governor | governor-party-count-change | democrat | Democrat: 55.374443%; opponent 5.463691% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48035 | Bosque | governor | governor-party-count-change | democrat | Democrat: 43.69287%; opponent -3.794643% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48037 | Bowie | governor | governor-party-count-change | democrat | Democrat: 43.382838%; opponent -8.07186% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48039 | Brazoria | governor | governor-party-count-change | democrat | Democrat: 63.612674%; opponent 5.463673% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48039 | Brazoria | governor | governor-share-swing | democrat | D share 10.843319pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48041 | Brazos | governor | governor-party-count-change | democrat | Democrat: 70.865256%; opponent 8.708902% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48041 | Brazos | governor | governor-share-swing | democrat | D share 11.134323pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48049 | Brown | governor | governor-party-count-change | democrat | Democrat: 72.782875%; opponent -3.270985% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48051 | Burleson | governor | governor-party-count-change | democrat | Democrat: 55.779335%; opponent 7.228478% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48053 | Burnet | governor | governor-party-count-change | democrat | Democrat: 54.300208%; opponent 4.992427% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48055 | Caldwell | governor | governor-party-count-change | democrat | Democrat: 70.083507%; opponent 1.669028% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48055 | Caldwell | governor | governor-share-swing | democrat | D share 12.791741pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48057 | Calhoun | governor | governor-party-count-change | democrat | Democrat: 57.817337%; opponent -0.118259% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48059 | Callahan | governor | governor-party-count-change | democrat | Democrat: 84.684685%; opponent -6.813417% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48061 | Cameron | governor | governor-party-count-change | democrat | Democrat: 64.669883%; opponent -3.467483% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48061 | Cameron | governor | governor-share-swing | democrat | D share 12.600754pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48063 | Camp | governor | governor-party-count-change | democrat | Democrat: 52.25956%; opponent -5.386113% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48065 | Carson | governor | governor-party-count-change | democrat | Democrat: 80.327869%; opponent -7.854846% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48067 | Cass | governor | governor-party-count-change | democrat | Democrat: 50.068493%; opponent 1.354724% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48069 | Castro | governor | governor-party-count-change | democrat | Democrat: 80.753138%; opponent -10.440457% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48069 | Castro | governor | governor-share-swing | democrat | D share 11.921301pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48071 | Chambers | governor | governor-party-count-change | democrat | Democrat: 91.094547%; opponent 10.302749% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48073 | Cherokee | governor | governor-party-count-change | democrat | Democrat: 82.880552%; opponent 0.806988% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48075 | Childress | governor | governor-party-count-change | democrat | Democrat: 85.802469%; opponent -14.212548% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48077 | Clay | governor | governor-party-count-change | democrat | Democrat: 65.394402%; opponent -3.479763% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48083 | Coleman | governor | governor-party-count-change | democrat | Democrat: 59.107807%; opponent -5.710401% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48085 | Collin | governor | governor-party-count-change | democrat | Democrat: 45.936922%; opponent 8.742105% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48089 | Colorado | governor | governor-party-count-change | democrat | Democrat: 57.634409%; opponent 0.098619% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48091 | Comal | governor | governor-party-count-change | democrat | Democrat: 50.909091%; opponent 7.916995% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48093 | Comanche | governor | governor-party-count-change | democrat | Democrat: 74.074074%; opponent -3.235784% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48097 | Cooke | governor | governor-party-count-change | democrat | Democrat: 64.861352%; opponent 2.746781% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48099 | Coryell | governor | governor-party-count-change | democrat | Democrat: 54.179775%; opponent -0.7724% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48103 | Crane | governor | governor-share-swing | democrat | D share 13.680054pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48105 | Crockett | governor | governor-share-swing | democrat | D share 10.463648pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48107 | Crosby | governor | governor-party-count-change | democrat | Democrat: 93.72549%; opponent -1.515152% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48107 | Crosby | governor | governor-share-swing | democrat | D share 13.146391pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48109 | Culberson | governor | governor-party-count-change | democrat | Democrat: 54.268293%; opponent -7.161125% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48109 | Culberson | governor | governor-share-swing | democrat | D share 12.608933pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48115 | Dawson | governor | governor-party-count-change | democrat | Democrat: 71.144279%; opponent -11.44636% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48115 | Dawson | governor | governor-share-swing | democrat | D share 10.974066pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48117 | Deaf Smith | governor | governor-party-count-change | democrat | Democrat: 121.574803%; opponent -8.548882% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48117 | Deaf Smith | governor | governor-share-swing | democrat | D share 18.504155pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48121 | Denton | governor | governor-party-count-change | democrat | Democrat: 46.365516%; opponent 8.133774% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48123 | DeWitt | governor | governor-party-count-change | democrat | Democrat: 49.088838%; opponent -5.241701% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48133 | Eastland | governor | governor-party-count-change | democrat | Democrat: 64.984227%; opponent -5.44989% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48135 | Ector | governor | governor-party-count-change | democrat | Democrat: 87.563025%; opponent -6.80304% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48135 | Ector | governor | governor-share-swing | democrat | D share 14.749928pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48139 | Ellis | governor | governor-party-count-change | democrat | Democrat: 87.027838%; opponent 3.77491% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48139 | Ellis | governor | governor-share-swing | democrat | D share 13.875841pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48141 | El Paso | governor | governor-party-count-change | democrat | Democrat: 46.105786%; opponent 6.664582% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48143 | Erath | governor | governor-party-count-change | democrat | Democrat: 74.392713%; opponent -4.764513% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48147 | Fannin | governor | governor-party-count-change | democrat | Democrat: 53.186813%; opponent 2.948174% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48149 | Fayette | governor | governor-party-count-change | democrat | Democrat: 56.922197%; opponent -3.098624% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48153 | Floyd | governor | governor-party-count-change | democrat | Democrat: 121.393035%; opponent -6.24% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48153 | Floyd | governor | governor-share-swing | democrat | D share 13.667583pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48157 | Fort Bend | governor | governor-party-count-change | democrat | Democrat: 55.67087%; opponent 7.510512% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48159 | Franklin | governor | governor-party-count-change | democrat | Democrat: 63.085938%; opponent 0.356189% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48161 | Freestone | governor | governor-party-count-change | democrat | Democrat: 70.534813%; opponent -1.214286% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48165 | Gaines | governor | governor-party-count-change | democrat | Democrat: 153.376206%; opponent 4.360542% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48167 | Galveston | governor | governor-party-count-change | democrat | Democrat: 48.44018%; opponent 5.700212% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48171 | Gillespie | governor | governor-party-count-change | democrat | Democrat: 40.974804%; opponent 2.036848% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48177 | Gonzales | governor | governor-party-count-change | democrat | Democrat: 90.168291%; opponent 1.785306% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48177 | Gonzales | governor | governor-share-swing | democrat | D share 12.025163pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48179 | Gray | governor | governor-party-count-change | democrat | Democrat: 104.811715%; opponent -12.028725% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48181 | Grayson | governor | governor-party-count-change | democrat | Democrat: 59.972863%; opponent 7.714318% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48183 | Gregg | governor | governor-party-count-change | democrat | Democrat: 63.691988%; opponent -3.616398% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48183 | Gregg | governor | governor-share-swing | democrat | D share 11.444193pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48185 | Grimes | governor | governor-party-count-change | democrat | Democrat: 73.267898%; opponent 11.528855% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48187 | Guadalupe | governor | governor-party-count-change | democrat | Democrat: 62.626576%; opponent 4.649965% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48187 | Guadalupe | governor | governor-share-swing | democrat | D share 10.502433pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48189 | Hale | governor | governor-party-count-change | democrat | Democrat: 110.472103%; opponent -2.493129% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48189 | Hale | governor | governor-share-swing | democrat | D share 14.437079pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48193 | Hamilton | governor | governor-party-count-change | democrat | Democrat: 43.879908%; opponent -3.892216% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48199 | Hardin | governor | governor-party-count-change | democrat | Democrat: 77.772302%; opponent -1.973382% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48201 | Harris | governor | governor-party-count-change | democrat | Democrat: 47.591635%; opponent -1.307671% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48203 | Harrison | governor | governor-party-count-change | democrat | Democrat: 55.887372%; opponent -0.406751% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48207 | Haskell | governor | governor-party-count-change | democrat | Democrat: 57.591623%; opponent -12.150171% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48209 | Hays | governor | governor-party-count-change | democrat | Democrat: 53.602205%; opponent 9.768453% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48211 | Hemphill | governor | governor-share-swing | democrat | D share 10.41446pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48213 | Henderson | governor | governor-party-count-change | democrat | Democrat: 57.065444%; opponent 1.322624% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48215 | Hidalgo | governor | governor-party-count-change | democrat | Democrat: 73.479213%; opponent 2.05167% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48215 | Hidalgo | governor | governor-share-swing | democrat | D share 11.940493pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48215 | Hidalgo | governor | governor-race-vote-change | neutral | 141238→203397; 44.010111% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48217 | Hill | governor | governor-party-count-change | democrat | Democrat: 76.065574%; opponent 3.429603% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48219 | Hockley | governor | governor-party-count-change | democrat | Democrat: 110.687023%; opponent 0.170576% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48219 | Hockley | governor | governor-share-swing | democrat | D share 11.70878pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48221 | Hood | governor | governor-party-count-change | democrat | Democrat: 51.476401%; opponent 3.469641% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48223 | Hopkins | governor | governor-party-count-change | democrat | Democrat: 63.931966%; opponent -3.893182% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48227 | Howard | governor | governor-party-count-change | democrat | Democrat: 76.41597%; opponent -5.980995% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48227 | Howard | governor | governor-share-swing | democrat | D share 10.640651pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48231 | Hunt | governor | governor-party-count-change | democrat | Democrat: 77.359078%; opponent 7.505054% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48233 | Hutchinson | governor | governor-party-count-change | democrat | Democrat: 91.666667%; opponent -9.196248% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48237 | Jack | governor | governor-party-count-change | democrat | Democrat: 118.061674%; opponent 3.93586% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48239 | Jackson | governor | governor-party-count-change | democrat | Democrat: 89.454545%; opponent -1.968602% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48241 | Jasper | governor | governor-party-count-change | democrat | Democrat: 61.71143%; opponent -3.442944% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48245 | Jefferson | governor | governor-party-count-change | democrat | Democrat: 47.950558%; opponent -6.337263% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48245 | Jefferson | governor | governor-share-swing | democrat | D share 11.374539pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48247 | Jim Hogg | governor | governor-party-count-change | democrat | Republican: -42.769231%; opponent 12.671233% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48247 | Jim Hogg | governor | governor-share-swing | democrat | D share 15.221951pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48251 | Johnson | governor | governor-party-count-change | democrat | Democrat: 92.996902%; opponent 5.121758% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48251 | Johnson | governor | governor-share-swing | democrat | D share 12.181966pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48253 | Jones | governor | governor-party-count-change | democrat | Democrat: 74.698795%; opponent -5.426535% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48255 | Karnes | governor | governor-party-count-change | democrat | Democrat: 48.840206%; opponent -5.187895% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48257 | Kaufman | governor | governor-party-count-change | democrat | Democrat: 113.355235%; opponent 11.193212% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48257 | Kaufman | governor | governor-share-swing | democrat | D share 15.602396pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48257 | Kaufman | governor | governor-race-vote-change | neutral | 42812→62365; 45.671774% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48259 | Kendall | governor | governor-party-count-change | democrat | Democrat: 48.162993%; opponent 8.301289% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48267 | Kimble | governor | governor-party-count-change | democrat | Democrat: 59.574468%; opponent -1.620648% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48271 | Kinney | governor | governor-party-count-change | democrat | Democrat: 59.302326%; opponent -9.922822% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48271 | Kinney | governor | governor-share-swing | democrat | D share 11.323133pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48275 | Knox | governor | governor-share-swing | democrat | D share 10.232942pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48277 | Lamar | governor | governor-party-count-change | democrat | Democrat: 58.874296%; opponent -4.718635% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48279 | Lamb | governor | governor-party-count-change | democrat | Democrat: 100.238663%; opponent -8.713851% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48279 | Lamb | governor | governor-share-swing | democrat | D share 12.159825pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48281 | Lampasas | governor | governor-party-count-change | democrat | Democrat: 49.400799%; opponent 2.732075% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48285 | Lavaca | governor | governor-party-count-change | democrat | Democrat: 74.967062%; opponent -2.682927% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48287 | Lee | governor | governor-party-count-change | democrat | Democrat: 66.118721%; opponent -1.076742% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48289 | Leon | governor | governor-party-count-change | democrat | Democrat: 54.584527%; opponent -3.091088% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48291 | Liberty | governor | governor-party-count-change | democrat | Democrat: 149.254587%; opponent 2.363331% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48291 | Liberty | governor | governor-share-swing | democrat | D share 16.738534pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48293 | Limestone | governor | governor-party-count-change | democrat | Democrat: 54.465593%; opponent -6.178108% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48303 | Lubbock | governor | governor-party-count-change | democrat | Democrat: 65.628444%; opponent 6.509293% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48305 | Lynn | governor | governor-party-count-change | democrat | Democrat: 125.510204%; opponent 9.720373% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48307 | McCulloch | governor | governor-party-count-change | democrat | Democrat: 53.184713%; opponent -3.556956% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48309 | McLennan | governor | governor-party-count-change | democrat | Democrat: 47.931833%; opponent -1.955091% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48313 | Madison | governor | governor-party-count-change | democrat | Democrat: 69.243697%; opponent -1.55868% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48315 | Marion | governor | governor-party-count-change | democrat | Democrat: 44.285714%; opponent 7.000391% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48317 | Martin | governor | governor-party-count-change | democrat | Democrat: 94.630872%; opponent -13.721104% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48317 | Martin | governor | governor-share-swing | democrat | D share 10.041465pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48321 | Matagorda | governor | governor-party-count-change | democrat | Democrat: 57.809063%; opponent -3.020408% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48323 | Maverick | governor | governor-party-count-change | democrat | Democrat: 55.733573%; opponent 6.502591% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48325 | Medina | governor | governor-party-count-change | democrat | Democrat: 69.287737%; opponent 4.579002% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48325 | Medina | governor | governor-share-swing | democrat | D share 10.393571pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48329 | Midland | governor | governor-party-count-change | democrat | Democrat: 74.447861%; opponent -4.58489% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48329 | Midland | governor | governor-share-swing | democrat | D share 10.674668pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48331 | Milam | governor | governor-party-count-change | democrat | Democrat: 50.737652%; opponent -8.530594% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48333 | Mills | governor | governor-party-count-change | democrat | Democrat: 64.646465%; opponent -6.177402% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48335 | Mitchell | governor | governor-party-count-change | democrat | Democrat: 78.378378%; opponent -4.822335% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48337 | Montague | governor | governor-party-count-change | democrat | Democrat: 64.575163%; opponent 4.111936% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48339 | Montgomery | governor | governor-party-count-change | democrat | Democrat: 76.71402%; opponent 6.195397% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48339 | Montgomery | governor | governor-share-swing | democrat | D share 10.81893pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48341 | Moore | governor | governor-party-count-change | democrat | Democrat: 177.453027%; opponent -11.23012% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48341 | Moore | governor | governor-share-swing | democrat | D share 19.246715pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48347 | Nacogdoches | governor | governor-party-count-change | democrat | Democrat: 60.310219%; opponent -6.068841% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48347 | Nacogdoches | governor | governor-share-swing | democrat | D share 12.121072pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48349 | Navarro | governor | governor-party-count-change | democrat | Democrat: 69.908141%; opponent -2.336319% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48349 | Navarro | governor | governor-share-swing | democrat | D share 11.078619pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48353 | Nolan | governor | governor-party-count-change | democrat | Democrat: 54.404946%; opponent -13.837698% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48357 | Ochiltree | governor | governor-party-count-change | democrat | Democrat: 281.481481%; opponent -9.367089% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48357 | Ochiltree | governor | governor-share-swing | democrat | D share 15.944629pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48361 | Orange | governor | governor-party-count-change | democrat | Democrat: 61.526061%; opponent -4.996927% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48363 | Palo Pinto | governor | governor-party-count-change | democrat | Democrat: 69.851952%; opponent -2.950861% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48365 | Panola | governor | governor-party-count-change | democrat | Democrat: 53.256389%; opponent -6.137235% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48367 | Parker | governor | governor-party-count-change | democrat | Democrat: 66.739109%; opponent 10.502066% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48369 | Parmer | governor | governor-party-count-change | democrat | Democrat: 151.980198%; opponent -7.309185% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48369 | Parmer | governor | governor-share-swing | democrat | D share 14.654029pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48371 | Pecos | governor | governor-share-swing | democrat | D share 12.66704pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48375 | Potter | governor | governor-party-count-change | democrat | Democrat: 79.164335%; opponent -2.107947% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48375 | Potter | governor | governor-share-swing | democrat | D share 12.89137pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48377 | Presidio | governor | governor-share-swing | democrat | D share 10.285117pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48379 | Rains | governor | governor-party-count-change | democrat | Democrat: 44.295302%; opponent -4.51717% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48381 | Randall | governor | governor-party-count-change | democrat | Democrat: 72.326203%; opponent -2.400428% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48389 | Reeves | governor | governor-share-swing | democrat | D share 10.64521pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48389 | Reeves | governor | governor-race-vote-change | neutral | 2177→3148; 44.602664% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48395 | Robertson | governor | governor-party-count-change | democrat | Democrat: 63.727765%; opponent 2.649149% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48397 | Rockwall | governor | governor-party-count-change | democrat | Democrat: 59.1576%; opponent 10.936414% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48399 | Runnels | governor | governor-party-count-change | democrat | Democrat: 82.67148%; opponent -10.328317% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48401 | Rusk | governor | governor-party-count-change | democrat | Democrat: 77.988122%; opponent -3.489922% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48401 | Rusk | governor | governor-share-swing | democrat | D share 10.596758pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48403 | Sabine | governor | governor-party-count-change | democrat | Democrat: 49.61039%; opponent -2.716378% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48405 | San Augustine | governor | governor-party-count-change | democrat | Democrat: 54.761905%; opponent -3.496503% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48407 | San Jacinto | governor | governor-party-count-change | democrat | Democrat: 52.857143%; opponent 0.063436% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48409 | San Patricio | governor | governor-party-count-change | democrat | Democrat: 44.922913%; opponent -3.27569% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48411 | San Saba | governor | governor-party-count-change | democrat | Democrat: 78%; opponent -7.036466% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48415 | Scurry | governor | governor-party-count-change | democrat | Democrat: 64.375%; opponent -7.707236% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48419 | Shelby | governor | governor-party-count-change | democrat | Democrat: 75.119617%; opponent -4.156688% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48423 | Smith | governor | governor-party-count-change | democrat | Democrat: 65.336034%; opponent 0.476964% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48423 | Smith | governor | governor-share-swing | democrat | D share 10.398188pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48425 | Somervell | governor | governor-party-count-change | democrat | Democrat: 48.643761%; opponent -0.116618% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48427 | Starr | governor | governor-share-swing | democrat | D share 15.465666pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48429 | Stephens | governor | governor-party-count-change | democrat | Democrat: 108.294931%; opponent -8.522501% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48437 | Swisher | governor | governor-party-count-change | democrat | Democrat: 76.470588%; opponent -10.221587% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48437 | Swisher | governor | governor-share-swing | democrat | D share 10.520875pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48439 | Tarrant | governor | governor-party-count-change | democrat | Democrat: 47.064129%; opponent 1.217721% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48441 | Taylor | governor | governor-party-count-change | democrat | Democrat: 51.993692%; opponent -5.377994% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48445 | Terry | governor | governor-party-count-change | democrat | Democrat: 80.371353%; opponent -12.505768% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48445 | Terry | governor | governor-share-swing | democrat | D share 11.578333pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48449 | Titus | governor | governor-party-count-change | democrat | Democrat: 100.781759%; opponent -2.929311% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48449 | Titus | governor | governor-share-swing | democrat | D share 14.557282pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48451 | Tom Green | governor | governor-party-count-change | democrat | Democrat: 62.373603%; opponent -2.26197% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48451 | Tom Green | governor | governor-share-swing | democrat | D share 10.396978pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48455 | Trinity | governor | governor-party-count-change | democrat | Democrat: 46.666667%; opponent 0.335946% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48457 | Tyler | governor | governor-party-count-change | democrat | Democrat: 43.504902%; opponent -5.927794% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48459 | Upshur | governor | governor-party-count-change | democrat | Democrat: 64.547414%; opponent -0.342298% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48465 | Val Verde | governor | governor-party-count-change | democrat | Democrat: 57.970635%; opponent 0.632911% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48465 | Val Verde | governor | governor-share-swing | democrat | D share 11.166832pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48467 | Van Zandt | governor | governor-party-count-change | democrat | Democrat: 61.060481%; opponent 1.553848% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48469 | Victoria | governor | governor-party-count-change | democrat | Democrat: 57.284563%; opponent -3.509909% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48469 | Victoria | governor | governor-share-swing | democrat | D share 10.382894pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48471 | Walker | governor | governor-party-count-change | democrat | Democrat: 69.039292%; opponent 6.91364% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48471 | Walker | governor | governor-share-swing | democrat | D share 10.127501pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48473 | Waller | governor | governor-party-count-change | democrat | Democrat: 116.568627%; opponent 8.496617% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48473 | Waller | governor | governor-share-swing | democrat | D share 16.270255pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48473 | Waller | governor | governor-race-vote-change | neutral | 16714→23762; 42.168242% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48475 | Ward | governor | governor-party-count-change | democrat | Democrat: 62.679426%; opponent -10.799031% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48475 | Ward | governor | governor-share-swing | democrat | D share 10.128254pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48477 | Washington | governor | governor-party-count-change | democrat | Democrat: 47.23796%; opponent 1.623347% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48479 | Webb | governor | governor-party-count-change | democrat | Democrat: 49.480778%; opponent 5.423853% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48481 | Wharton | governor | governor-party-count-change | democrat | Democrat: 44.864664%; opponent -7.985888% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48483 | Wheeler | governor | governor-party-count-change | democrat | Democrat: 120.38835%; opponent -8.731676% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48485 | Wichita | governor | governor-party-count-change | democrat | Democrat: 53.23364%; opponent -6.009945% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48485 | Wichita | governor | governor-share-swing | democrat | D share 10.234578pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48487 | Wilbarger | governor | governor-party-count-change | democrat | Democrat: 67.504836%; opponent -5.218726% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48491 | Williamson | governor | governor-party-count-change | democrat | Democrat: 42.079244%; opponent 6.09662% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48493 | Wilson | governor | governor-party-count-change | democrat | Democrat: 48.783878%; opponent 2.287319% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48495 | Winkler | governor | governor-party-count-change | democrat | Democrat: 106.214689%; opponent -14.159292% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48495 | Winkler | governor | governor-share-swing | democrat | D share 13.79836pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48497 | Wise | governor | governor-party-count-change | democrat | Democrat: 89.570379%; opponent 8.289731% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48499 | Wood | governor | governor-party-count-change | democrat | Democrat: 51.480051%; opponent 2.047455% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48501 | Yoakum | governor | governor-party-count-change | democrat | Democrat: 163.157895%; opponent -12.964261% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48501 | Yoakum | governor | governor-share-swing | democrat | D share 16.952486pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48503 | Young | governor | governor-party-count-change | democrat | Democrat: 79.206349%; opponent -2.728265% | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 48505 | Zapata | governor | governor-share-swing | democrat | D share 19.355055pp | modern-current-2026-tx; modern-medsl-governor-2022-tx |
| 51005 | Alleghany | senate | senate-race-population-change | neutral | -12.502089pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51007 | Amelia | senate | senate-race-population-change | neutral | -12.191123pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51009 | Amherst | senate | senate-race-population-change | neutral | -10.346306pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51011 | Appomattox | senate | senate-race-population-change | neutral | -10.631643pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51013 | Arlington | senate | senate-race-population-change | neutral | -12.129468pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51015 | Augusta | senate | senate-race-population-change | neutral | -10.503845pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51017 | Bath | senate | senate-race-population-change | neutral | -12.13458pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51019 | Bedford | senate | senate-race-population-change | neutral | -12.3394pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51021 | Bland | senate | senate-race-population-change | neutral | -13.797789pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51023 | Botetourt | senate | senate-race-population-change | neutral | -10.953496pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51025 | Brunswick | senate | senate-race-population-change | neutral | -11.874133pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51027 | Buchanan | senate | senate-race-vote-change | neutral | 9736→5438; -44.14544% | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 51027 | Buchanan | senate | senate-race-population-change | neutral | -18.678825pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51029 | Buckingham | senate | senate-race-population-change | neutral | -11.471247pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51033 | Caroline | senate | senate-race-population-change | neutral | -12.79457pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51035 | Carroll | senate | senate-race-population-change | neutral | -12.453978pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51036 | Charles City | senate | senate-race-population-change | neutral | -14.586178pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51037 | Charlotte | senate | senate-race-population-change | neutral | -11.199729pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51041 | Chesterfield | senate | senate-race-population-change | neutral | -10.929977pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51043 | Clarke | senate | senate-race-population-change | neutral | -12.89458pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51045 | Craig | senate | senate-race-population-change | neutral | -16.041906pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51047 | Culpeper | senate | senate-race-population-change | neutral | -11.894769pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51049 | Cumberland | senate | senate-race-population-change | neutral | -11.636814pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51051 | Dickenson | senate | senate-race-population-change | neutral | -13.672066pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51053 | Dinwiddie | senate | senate-race-population-change | neutral | -13.775773pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51057 | Essex | senate | senate-race-population-change | neutral | -11.055764pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51059 | Fairfax | senate | senate-race-population-change | neutral | -11.563793pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51061 | Fauquier | senate | senate-race-population-change | neutral | -12.54466pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51063 | Floyd | senate | senate-race-population-change | neutral | -12.679617pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51067 | Franklin | senate | senate-race-population-change | neutral | -11.312397pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51069 | Frederick | senate | senate-race-population-change | neutral | -11.892522pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51071 | Giles | senate | senate-race-population-change | neutral | -13.992041pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51073 | Gloucester | senate | senate-race-population-change | neutral | -12.32444pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51077 | Grayson | senate | senate-race-population-change | neutral | -11.812434pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51081 | Greensville | senate | senate-race-population-change | neutral | -10.31063pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51083 | Halifax | senate | senate-race-population-change | neutral | -11.868884pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51085 | Hanover | senate | senate-race-population-change | neutral | -10.995829pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51089 | Henry | senate | senate-race-population-change | neutral | -13.671135pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51091 | Highland | senate | senate-race-population-change | neutral | -16.207719pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51093 | Isle of Wight | senate | senate-race-population-change | neutral | -10.534636pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51095 | James City | senate | senate-race-population-change | neutral | -10.524895pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51097 | King and Queen | senate | senate-race-population-change | neutral | -12.620721pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51099 | King George | senate | senate-race-population-change | neutral | -12.82792pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51101 | King William | senate | senate-race-population-change | neutral | -12.61824pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51105 | Lee | senate | senate-race-population-change | neutral | -15.75402pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51107 | Loudoun | senate | senate-race-population-change | neutral | -12.492021pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51109 | Louisa | senate | senate-race-population-change | neutral | -12.847121pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51111 | Lunenburg | senate | senate-race-population-change | neutral | -11.467923pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51113 | Madison | senate | senate-race-population-change | neutral | -12.121933pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51115 | Mathews | senate | senate-race-population-change | neutral | -12.324224pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51117 | Mecklenburg | senate | senate-race-population-change | neutral | -11.30638pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51125 | Nelson | senate | senate-race-population-change | neutral | -10.645893pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51127 | New Kent | senate | senate-race-population-change | neutral | -11.428109pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51135 | Nottoway | senate | senate-race-population-change | neutral | -11.876709pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51137 | Orange | senate | senate-race-population-change | neutral | -12.946408pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51139 | Page | senate | senate-race-population-change | neutral | -12.625498pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51141 | Patrick | senate | senate-race-population-change | neutral | -12.539165pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51143 | Pittsylvania | senate | senate-race-population-change | neutral | -11.576477pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51145 | Powhatan | senate | senate-race-population-change | neutral | -12.45085pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51153 | Prince William | senate | senate-race-population-change | neutral | -10.40732pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51155 | Pulaski | senate | senate-race-population-change | neutral | -12.410869pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51157 | Rappahannock | senate | senate-race-population-change | neutral | -12.773344pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51161 | Roanoke | senate | senate-race-population-change | neutral | -13.300417pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51165 | Rockingham | senate | senate-race-population-change | neutral | -10.184665pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51167 | Russell | senate | senate-race-population-change | neutral | -15.857928pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51169 | Scott | senate | senate-race-population-change | neutral | -14.74222pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51171 | Shenandoah | senate | senate-race-population-change | neutral | -12.928271pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51173 | Smyth | senate | senate-race-population-change | neutral | -11.923715pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51175 | Southampton | senate | senate-race-population-change | neutral | -11.40091pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51177 | Spotsylvania | senate | senate-race-population-change | neutral | -13.130125pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51179 | Stafford | senate | senate-race-population-change | neutral | -10.509633pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51181 | Surry | senate | senate-race-population-change | neutral | -13.296348pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51183 | Sussex | senate | senate-race-population-change | neutral | -12.229867pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51185 | Tazewell | senate | senate-race-population-change | neutral | -14.520287pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51187 | Warren | senate | senate-race-population-change | neutral | -12.441495pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51191 | Washington | senate | senate-race-population-change | neutral | -13.86818pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51195 | Wise | senate | senate-race-population-change | neutral | -13.769136pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51197 | Wythe | senate | senate-race-population-change | neutral | -12.901766pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51510 | Alexandria | senate | senate-party-count-change | democrat | Republican: -41.620045%; opponent -13.559036% | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 51510 | Alexandria | senate | senate-race-population-change | neutral | -10.204925pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51520 | Bristol | senate | senate-race-population-change | neutral | -14.093915pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51530 | Buena Vista | senate | senate-race-population-change | neutral | -12.368878pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51550 | Chesapeake | senate | senate-race-population-change | neutral | -11.247347pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51570 | Colonial Heights | senate | senate-race-population-change | neutral | -14.439571pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51580 | Covington | senate | senate-race-population-change | neutral | -13.632566pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51590 | Danville | senate | senate-race-population-change | neutral | -11.360489pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51600 | Fairfax | senate | senate-race-population-change | neutral | -13.556192pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51640 | Galax | senate | senate-race-population-change | neutral | -10.062948pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51650 | Hampton | senate | senate-race-population-change | neutral | -11.513613pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51660 | Harrisonburg | senate | senate-party-count-change | democrat | Republican: -43.734469%; opponent -12.594458% | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 51670 | Hopewell | senate | senate-race-population-change | neutral | -13.084029pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51683 | Manassas | senate | senate-race-population-change | neutral | -10.430197pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51690 | Martinsville | senate | senate-race-population-change | neutral | -12.975677pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51700 | Newport News | senate | senate-race-population-change | neutral | -10.469084pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51720 | Norton | senate | senate-race-population-change | neutral | -12.72999pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51730 | Petersburg | senate | senate-race-population-change | neutral | -11.893587pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51735 | Poquoson | senate | senate-race-population-change | neutral | -15.021693pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51740 | Portsmouth | senate | senate-race-population-change | neutral | -11.247847pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51750 | Radford | senate | senate-race-population-change | neutral | -10.663172pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51760 | Richmond | senate | senate-party-count-change | democrat | Republican: -43.345235%; opponent -11.375545% | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 51770 | Roanoke | senate | senate-race-population-change | neutral | -10.332808pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 51775 | Salem | senate | senate-race-population-change | neutral | -12.709234pp | modern-official-va-senate-2026; modern-heideman-v1-senate-va_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01001 | Autauga | senate | senate-race-population-change | neutral | -14.434284pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01003 | Baldwin | senate | senate-race-population-change | neutral | -14.922276pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01005 | Barbour | senate | senate-race-population-change | neutral | -11.747175pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01007 | Bibb | senate | senate-race-population-change | neutral | -15.573568pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01009 | Blount | senate | senate-race-population-change | neutral | -16.934224pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01013 | Butler | senate | senate-race-population-change | neutral | -12.451024pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01015 | Calhoun | senate | senate-race-population-change | neutral | -15.744397pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01017 | Chambers | senate | senate-race-population-change | neutral | -13.906828pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01019 | Cherokee | senate | senate-race-population-change | neutral | -17.051553pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01021 | Chilton | senate | senate-race-population-change | neutral | -15.417071pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01023 | Choctaw | senate | senate-race-population-change | neutral | -14.235452pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01025 | Clarke | senate | senate-race-population-change | neutral | -13.871975pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01027 | Clay | senate | senate-race-population-change | neutral | -16.742661pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01029 | Cleburne | senate | senate-race-population-change | neutral | -19.832042pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01031 | Coffee | senate | senate-race-population-change | neutral | -12.684359pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01033 | Colbert | senate | senate-race-population-change | neutral | -17.484969pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01035 | Conecuh | senate | senate-race-population-change | neutral | -10.968058pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01037 | Coosa | senate | senate-race-population-change | neutral | -15.268161pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01039 | Covington | senate | senate-race-population-change | neutral | -16.871169pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01041 | Crenshaw | senate | senate-race-population-change | neutral | -14.129033pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01043 | Cullman | senate | senate-race-population-change | neutral | -18.538736pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01045 | Dale | senate | senate-race-population-change | neutral | -12.50309pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01049 | DeKalb | senate | senate-race-population-change | neutral | -15.11082pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01051 | Elmore | senate | senate-race-population-change | neutral | -12.932464pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01053 | Escambia | senate | senate-race-population-change | neutral | -16.643582pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01055 | Etowah | senate | senate-race-population-change | neutral | -16.277195pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01057 | Fayette | senate | senate-race-population-change | neutral | -16.393926pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01059 | Franklin | senate | senate-race-population-change | neutral | -14.31605pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01061 | Geneva | senate | senate-race-population-change | neutral | -14.224739pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01063 | Greene | senate | senate-race-population-change | neutral | -11.879997pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01065 | Hale | senate | senate-race-population-change | neutral | -13.671895pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01067 | Henry | senate | senate-race-population-change | neutral | -17.03483pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01069 | Houston | senate | senate-race-population-change | neutral | -13.853689pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01071 | Jackson | senate | senate-race-population-change | neutral | -18.407766pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01073 | Jefferson | senate | senate-race-population-change | neutral | -11.239741pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01075 | Lamar | senate | senate-race-population-change | neutral | -18.154374pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01077 | Lauderdale | senate | senate-race-population-change | neutral | -16.182697pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01079 | Lawrence | senate | senate-race-population-change | neutral | -18.43961pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01081 | Lee | senate | senate-race-population-change | neutral | -12.25171pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01083 | Limestone | senate | senate-race-population-change | neutral | -14.718819pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01085 | Lowndes | senate | senate-race-population-change | neutral | -15.327194pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01089 | Madison | senate | senate-race-population-change | neutral | -12.943712pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01091 | Marengo | senate | senate-race-population-change | neutral | -13.333949pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01093 | Marion | senate | senate-race-vote-change | neutral | 13760→8169; -40.632267% | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 01093 | Marion | senate | senate-race-population-change | neutral | -19.061142pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01095 | Marshall | senate | senate-race-population-change | neutral | -14.54157pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01097 | Mobile | senate | senate-race-population-change | neutral | -13.248421pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01099 | Monroe | senate | senate-race-population-change | neutral | -14.655151pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01103 | Morgan | senate | senate-race-population-change | neutral | -14.306062pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01107 | Pickens | senate | senate-race-population-change | neutral | -13.133759pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01109 | Pike | senate | senate-race-population-change | neutral | -11.758531pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01111 | Randolph | senate | senate-race-population-change | neutral | -17.738035pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01113 | Russell | senate | senate-race-population-change | neutral | -10.624077pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01115 | St. Clair | senate | senate-race-population-change | neutral | -16.60259pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01117 | Shelby | senate | senate-race-population-change | neutral | -15.082083pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01119 | Sumter | senate | senate-race-population-change | neutral | -13.155735pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01121 | Talladega | senate | senate-race-population-change | neutral | -13.938497pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01123 | Tallapoosa | senate | senate-race-population-change | neutral | -14.919693pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01125 | Tuscaloosa | senate | senate-race-population-change | neutral | -12.375616pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01127 | Walker | senate | senate-race-population-change | neutral | -18.960182pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01129 | Washington | senate | senate-race-population-change | neutral | -15.348596pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 01133 | Winston | senate | senate-race-population-change | neutral | -18.673744pp | research-senate-official-al-2026; research-senate-official-al-2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 04013 | Maricopa | house | house-share-swing | democrat | D share 15.887024pp | research-house-az-2026-official-export; research-house-az-2022-official-canvass-web-extract; Arizona Secretary of State2022certified general canvass (saved primary PDF web-text extraction); Arizona Secretary of State2026official provisional export via Enhanced Voting |
| 04015 | Mohave | house | house-party-count-change | democrat | Democrat: 5057.181572%; opponent -13.265418% | research-house-az-2026-official-export; research-house-az-2022-official-canvass-web-extract; Arizona Secretary of State2022certified general canvass (saved primary PDF web-text extraction); Arizona Secretary of State2026official provisional export via Enhanced Voting |
| 04015 | Mohave | house | house-share-swing | democrat | D share 25.041331pp | research-house-az-2026-official-export; research-house-az-2022-official-canvass-web-extract; Arizona Secretary of State2022certified general canvass (saved primary PDF web-text extraction); Arizona Secretary of State2026official provisional export via Enhanced Voting |
| 04027 | Yuma | house | house-share-swing | democrat | D share 21.585048pp | research-house-az-2026-official-export; research-house-az-2022-official-canvass-web-extract; Arizona Secretary of State2022certified general canvass (saved primary PDF web-text extraction); Arizona Secretary of State2026official provisional export via Enhanced Voting |
| 05003 | Ashley | senate | senate-race-population-change | neutral | -11.647691pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05005 | Baxter | senate | senate-race-population-change | neutral | -15.745584pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05007 | Benton | senate | senate-race-population-change | neutral | -11.216885pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05009 | Boone | senate | senate-race-population-change | neutral | -15.427527pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05011 | Bradley | senate | senate-race-population-change | neutral | -10.415653pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05013 | Calhoun | senate | senate-race-population-change | neutral | -15.373025pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05015 | Carroll | senate | senate-race-population-change | neutral | -11.156738pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05021 | Clay | senate | senate-race-population-change | neutral | -10.963276pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05023 | Cleburne | senate | senate-race-population-change | neutral | -13.52538pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05025 | Cleveland | senate | senate-race-population-change | neutral | -14.72816pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05029 | Conway | senate | senate-race-population-change | neutral | -10.23662pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05031 | Craighead | senate | senate-race-population-change | neutral | -11.595853pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05033 | Crawford | senate | senate-race-population-change | neutral | -14.236527pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05037 | Cross | senate | senate-race-population-change | neutral | -14.017679pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05039 | Dallas | senate | senate-race-population-change | neutral | -10.687574pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05045 | Faulkner | senate | senate-race-population-change | neutral | -13.096347pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05047 | Franklin | senate | senate-race-population-change | neutral | -12.066368pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05049 | Fulton | senate | senate-race-population-change | neutral | -13.431678pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05051 | Garland | senate | senate-race-population-change | neutral | -11.944284pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05053 | Grant | senate | senate-race-population-change | neutral | -17.419545pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05055 | Greene | senate | senate-race-population-change | neutral | -12.08135pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05057 | Hempstead | senate | senate-race-population-change | neutral | -11.738423pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05059 | Hot Spring | senate | senate-race-population-change | neutral | -11.911708pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05061 | Howard | senate | senate-race-population-change | neutral | -10.473888pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05063 | Independence | senate | senate-race-population-change | neutral | -13.992445pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05065 | Izard | senate | senate-race-population-change | neutral | -10.881616pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05071 | Johnson | senate | senate-race-population-change | neutral | -11.157352pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05075 | Lawrence | senate | senate-race-population-change | neutral | -11.752598pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05079 | Lincoln | senate | senate-race-population-change | neutral | -10.286582pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05081 | Little River | senate | senate-race-population-change | neutral | -10.608325pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05083 | Logan | senate | senate-race-population-change | neutral | -12.55676pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05085 | Lonoke | senate | senate-race-population-change | neutral | -11.457065pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05087 | Madison | senate | senate-race-population-change | neutral | -15.474056pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05089 | Marion | senate | senate-race-population-change | neutral | -11.750265pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05091 | Miller | senate | senate-race-population-change | neutral | -12.354053pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05097 | Montgomery | senate | senate-race-population-change | neutral | -15.079543pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05099 | Nevada | senate | senate-race-population-change | neutral | -12.450992pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05101 | Newton | senate | senate-race-population-change | neutral | -12.892803pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05103 | Ouachita | senate | senate-race-population-change | neutral | -11.669353pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05105 | Perry | senate | senate-race-population-change | neutral | -14.249726pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05109 | Pike | senate | senate-race-population-change | neutral | -12.271095pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05113 | Polk | senate | senate-race-population-change | neutral | -16.609131pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05115 | Pope | senate | senate-race-population-change | neutral | -12.469pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05117 | Prairie | senate | senate-race-population-change | neutral | -11.686174pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05121 | Randolph | senate | senate-race-population-change | neutral | -12.432539pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05125 | Saline | senate | senate-race-population-change | neutral | -12.979136pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05127 | Scott | senate | senate-race-population-change | neutral | -10.488085pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05129 | Searcy | senate | senate-race-population-change | neutral | -17.819888pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05131 | Sebastian | senate | senate-race-population-change | neutral | -11.199216pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05133 | Sevier | senate | senate-race-population-change | neutral | -12.720675pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05135 | Sharp | senate | senate-race-population-change | neutral | -13.002688pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05137 | Stone | senate | senate-race-population-change | neutral | -13.509377pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05139 | Union | senate | senate-race-population-change | neutral | -10.08611pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05141 | Van Buren | senate | senate-race-population-change | neutral | -14.962971pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05145 | White | senate | senate-race-population-change | neutral | -12.114792pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 05149 | Yell | senate | senate-race-population-change | neutral | -10.109159pp | modern-current-2026-ar; modern-heideman-v1-senate-ar_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 06001 | Alameda | global | participation-own-history | neutral | -11.13476pp | ca-sos-2026-status; ca-sos-2022-participation; census2025 |
| 06001 | Alameda | governor | governor-race-population-change | neutral | -10.955279pp | current-ca-sos-governor-2026; modern-medsl-governor-2022-ca; census2025 |
| 06009 | Calaveras | global | participation-own-history | neutral | -10.766656pp | ca-sos-2026-status; ca-sos-2022-participation; census2025 |
| 06009 | Calaveras | governor | governor-race-population-change | neutral | -10.452484pp | current-ca-sos-governor-2026; modern-medsl-governor-2022-ca; census2025 |
| 06011 | Colusa | governor | governor-share-swing | democrat | D share 16.59437pp | current-ca-sos-governor-2026; modern-medsl-governor-2022-ca |
| 06013 | Contra Costa | governor | governor-race-population-change | neutral | -10.598387pp | current-ca-sos-governor-2026; modern-medsl-governor-2022-ca; census2025 |
| 06015 | Del Norte | global | participation-own-history | neutral | -10.693297pp | ca-sos-2026-status; ca-sos-2022-participation; census2025 |
| 06015 | Del Norte | governor | governor-race-population-change | neutral | -10.60923pp | current-ca-sos-governor-2026; modern-medsl-governor-2022-ca; census2025 |
| 06021 | Glenn | governor | governor-share-swing | democrat | D share 10.198033pp | current-ca-sos-governor-2026; modern-medsl-governor-2022-ca |
| 06023 | Humboldt | global | participation-own-history | neutral | -16.809204pp | ca-sos-2026-status; ca-sos-2022-participation; census2025 |
| 06023 | Humboldt | governor | governor-race-vote-change | neutral | 47798→25103; -47.481066% | current-ca-sos-governor-2026; modern-medsl-governor-2022-ca |
| 06023 | Humboldt | governor | governor-race-population-change | neutral | -16.343017pp | current-ca-sos-governor-2026; modern-medsl-governor-2022-ca; census2025 |
| 06029 | Kern | governor | governor-share-swing | democrat | D share 12.713936pp | current-ca-sos-governor-2026; modern-medsl-governor-2022-ca |
| 06031 | Kings | governor | governor-party-count-change | democrat | Democrat: 63.798062%; opponent -1.055755% | current-ca-sos-governor-2026; modern-medsl-governor-2022-ca |
| 06031 | Kings | governor | governor-share-swing | democrat | D share 12.118361pp | current-ca-sos-governor-2026; modern-medsl-governor-2022-ca |
| 06033 | Lake | global | participation-own-history | neutral | -18.379525pp | ca-sos-2026-status; ca-sos-2022-participation; census2025 |
| 06033 | Lake | governor | governor-race-vote-change | neutral | 20131→7707; -61.715762% | current-ca-sos-governor-2026; modern-medsl-governor-2022-ca |
| 06033 | Lake | governor | governor-race-population-change | neutral | -18.114945pp | current-ca-sos-governor-2026; modern-medsl-governor-2022-ca; census2025 |
| 06039 | Madera | governor | governor-share-swing | democrat | D share 12.381504pp | current-ca-sos-governor-2026; modern-medsl-governor-2022-ca |
| 06041 | Marin | global | participation-own-history | neutral | -19.807165pp | ca-sos-2026-status; ca-sos-2022-participation; census2025 |
| 06041 | Marin | governor | governor-race-vote-change | neutral | 119064→68640; -42.350333% | current-ca-sos-governor-2026; modern-medsl-governor-2022-ca |
| 06041 | Marin | governor | governor-race-population-change | neutral | -19.265338pp | current-ca-sos-governor-2026; modern-medsl-governor-2022-ca; census2025 |
| 06045 | Mendocino | global | participation-own-history | neutral | -14.46045pp | ca-sos-2026-status; ca-sos-2022-participation; census2025 |
| 06045 | Mendocino | governor | governor-race-vote-change | neutral | 30394→17197; -43.419754% | current-ca-sos-governor-2026; modern-medsl-governor-2022-ca |
| 06045 | Mendocino | governor | governor-race-population-change | neutral | -14.243742pp | current-ca-sos-governor-2026; modern-medsl-governor-2022-ca; census2025 |
| 06047 | Merced | governor | governor-party-count-change | democrat | Republican: -42.074286%; opponent -4.34127% | current-ca-sos-governor-2026; modern-medsl-governor-2022-ca |
| 06047 | Merced | governor | governor-share-swing | democrat | D share 12.458498pp | current-ca-sos-governor-2026; modern-medsl-governor-2022-ca |
| 06049 | Modoc | global | participation-own-history | neutral | -10.901922pp | ca-sos-2026-status; ca-sos-2022-participation; census2025 |
| 06049 | Modoc | governor | governor-race-population-change | neutral | -10.802151pp | current-ca-sos-governor-2026; modern-medsl-governor-2022-ca; census2025 |
| 06055 | Napa | global | participation-own-history | neutral | -22.052596pp | ca-sos-2026-status; ca-sos-2022-participation; census2025 |
| 06055 | Napa | governor | governor-race-vote-change | neutral | 50108→20693; -58.703201% | current-ca-sos-governor-2026; modern-medsl-governor-2022-ca |
| 06055 | Napa | governor | governor-race-population-change | neutral | -21.690681pp | current-ca-sos-governor-2026; modern-medsl-governor-2022-ca; census2025 |
| 06057 | Nevada | global | participation-own-history | neutral | -21.56899pp | ca-sos-2026-status; ca-sos-2022-participation; census2025 |
| 06057 | Nevada | governor | governor-race-vote-change | neutral | 50737→28877; -43.084928% | current-ca-sos-governor-2026; modern-medsl-governor-2022-ca |
| 06057 | Nevada | governor | governor-race-population-change | neutral | -21.223475pp | current-ca-sos-governor-2026; modern-medsl-governor-2022-ca; census2025 |
| 06061 | Placer | global | participation-own-history | neutral | -14.497967pp | ca-sos-2026-status; ca-sos-2022-participation; census2025 |
| 06061 | Placer | governor | governor-race-population-change | neutral | -14.140891pp | current-ca-sos-governor-2026; modern-medsl-governor-2022-ca; census2025 |
| 06067 | Sacramento | global | participation-own-history | neutral | -13.715455pp | ca-sos-2026-status; ca-sos-2022-participation; census2025 |
| 06067 | Sacramento | governor | governor-race-vote-change | neutral | 477613→268289; -43.827115% | current-ca-sos-governor-2026; modern-medsl-governor-2022-ca |
| 06067 | Sacramento | governor | governor-race-population-change | neutral | -13.486193pp | current-ca-sos-governor-2026; modern-medsl-governor-2022-ca; census2025 |
| 06069 | San Benito | global | participation-own-history | neutral | -14.333398pp | ca-sos-2026-status; ca-sos-2022-participation; census2025 |
| 06069 | San Benito | governor | governor-race-vote-change | neutral | 19578→10417; -46.792318% | current-ca-sos-governor-2026; modern-medsl-governor-2022-ca |
| 06069 | San Benito | governor | governor-race-population-change | neutral | -14.065853pp | current-ca-sos-governor-2026; modern-medsl-governor-2022-ca; census2025 |
| 06071 | San Bernardino | governor | governor-share-swing | democrat | D share 10.995456pp | current-ca-sos-governor-2026; modern-medsl-governor-2022-ca |
| 06079 | San Luis Obispo | global | participation-own-history | neutral | -17.305907pp | ca-sos-2026-status; ca-sos-2022-participation; census2025 |
| 06079 | San Luis Obispo | governor | governor-race-vote-change | neutral | 119630→71481; -40.248265% | current-ca-sos-governor-2026; modern-medsl-governor-2022-ca |
| 06079 | San Luis Obispo | governor | governor-race-population-change | neutral | -16.994983pp | current-ca-sos-governor-2026; modern-medsl-governor-2022-ca; census2025 |
| 06081 | San Mateo | global | participation-own-history | neutral | -11.953632pp | ca-sos-2026-status; ca-sos-2022-participation; census2025 |
| 06081 | San Mateo | governor | governor-race-population-change | neutral | -11.619173pp | current-ca-sos-governor-2026; modern-medsl-governor-2022-ca; census2025 |
| 06085 | Santa Clara | global | participation-own-history | neutral | -10.479426pp | ca-sos-2026-status; ca-sos-2022-participation; census2025 |
| 06085 | Santa Clara | governor | governor-race-population-change | neutral | -10.290668pp | current-ca-sos-governor-2026; modern-medsl-governor-2022-ca; census2025 |
| 06089 | Shasta | global | participation-own-history | neutral | -18.948422pp | ca-sos-2026-status; ca-sos-2022-participation; census2025 |
| 06089 | Shasta | governor | governor-race-vote-change | neutral | 68520→34475; -49.686223% | current-ca-sos-governor-2026; modern-medsl-governor-2022-ca |
| 06089 | Shasta | governor | governor-race-population-change | neutral | -18.886335pp | current-ca-sos-governor-2026; modern-medsl-governor-2022-ca; census2025 |
| 06097 | Sonoma | global | participation-own-history | neutral | -19.261831pp | ca-sos-2026-status; ca-sos-2022-participation; census2025 |
| 06097 | Sonoma | governor | governor-race-vote-change | neutral | 197454→106915; -45.853211% | current-ca-sos-governor-2026; modern-medsl-governor-2022-ca |
| 06097 | Sonoma | governor | governor-race-population-change | neutral | -18.881889pp | current-ca-sos-governor-2026; modern-medsl-governor-2022-ca; census2025 |
| 06099 | Stanislaus | governor | governor-share-swing | democrat | D share 10.704259pp | current-ca-sos-governor-2026; modern-medsl-governor-2022-ca |
| 06101 | Sutter | global | participation-own-history | neutral | -15.023821pp | ca-sos-2026-status; ca-sos-2022-participation; census2025 |
| 06101 | Sutter | governor | governor-share-swing | democrat | D share 10.148742pp | current-ca-sos-governor-2026; modern-medsl-governor-2022-ca |
| 06101 | Sutter | governor | governor-race-vote-change | neutral | 28106→13598; -51.618871% | current-ca-sos-governor-2026; modern-medsl-governor-2022-ca |
| 06101 | Sutter | governor | governor-race-population-change | neutral | -14.723633pp | current-ca-sos-governor-2026; modern-medsl-governor-2022-ca; census2025 |
| 06105 | Trinity | global | participation-own-history | neutral | -11.532438pp | ca-sos-2026-status; ca-sos-2022-participation; census2025 |
| 06105 | Trinity | governor | governor-race-population-change | neutral | -11.249209pp | current-ca-sos-governor-2026; modern-medsl-governor-2022-ca; census2025 |
| 06107 | Tulare | governor | governor-share-swing | democrat | D share 11.641857pp | current-ca-sos-governor-2026; modern-medsl-governor-2022-ca |
| 06113 | Yolo | global | participation-own-history | neutral | -10.140961pp | ca-sos-2026-status; ca-sos-2022-participation; census2025 |
| 06115 | Yuba | global | participation-own-history | neutral | -13.424334pp | ca-sos-2026-status; ca-sos-2022-participation; census2025 |
| 06115 | Yuba | governor | governor-race-vote-change | neutral | 19631→8912; -54.602415% | current-ca-sos-governor-2026; modern-medsl-governor-2022-ca |
| 06115 | Yuba | governor | governor-race-population-change | neutral | -13.223516pp | current-ca-sos-governor-2026; modern-medsl-governor-2022-ca; census2025 |
| 08001 | Adams | senate | senate-race-population-change | neutral | -17.674772pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08003 | Alamosa | senate | senate-race-population-change | neutral | -10.596574pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08005 | Arapahoe | senate | senate-race-vote-change | neutral | 348655→195894; -43.814372% | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 08005 | Arapahoe | senate | senate-race-population-change | neutral | -24.135763pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08005 | Arapahoe | governor | governor-race-population-change | neutral | -10.140429pp | modern-current-2026-co; modern-medsl-governor-2022-co; census2025 |
| 08007 | Archuleta | senate | senate-share-swing | democrat | D share 15.864875pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 08007 | Archuleta | senate | senate-race-vote-change | neutral | 9020→3446; -61.796009% | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 08007 | Archuleta | senate | senate-race-population-change | neutral | -43.095282pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08007 | Archuleta | governor | governor-race-vote-change | neutral | 7810→3415; -56.274008% | modern-current-2026-co; modern-medsl-governor-2022-co |
| 08007 | Archuleta | governor | governor-race-population-change | neutral | -32.014407pp | modern-current-2026-co; modern-medsl-governor-2022-co; census2025 |
| 08009 | Baca | senate | senate-race-population-change | neutral | -17.15826pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08011 | Bent | senate | senate-race-population-change | neutral | -12.659141pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08013 | Boulder | senate | senate-race-vote-change | neutral | 205536→117000; -43.075666% | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 08013 | Boulder | senate | senate-race-population-change | neutral | -26.488911pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08013 | Boulder | governor | governor-race-population-change | neutral | -14.782447pp | modern-current-2026-co; modern-medsl-governor-2022-co; census2025 |
| 08014 | Broomfield | senate | senate-share-swing | democrat | D share 10.738604pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 08014 | Broomfield | senate | senate-race-population-change | neutral | -11.707279pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08015 | Chaffee | senate | senate-share-swing | democrat | D share 10.793365pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 08017 | Cheyenne | senate | senate-race-population-change | neutral | -15.629721pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08019 | Clear Creek | senate | senate-party-count-change | democrat | Republican: -42.257496%; opponent -11.448197% | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 08019 | Clear Creek | senate | senate-share-swing | democrat | D share 10.192242pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 08019 | Clear Creek | senate | senate-race-population-change | neutral | -13.743194pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08021 | Conejos | senate | senate-race-population-change | neutral | -11.319149pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08027 | Custer | senate | senate-race-population-change | neutral | -19.711078pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08029 | Delta | senate | senate-race-population-change | neutral | -16.83011pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08031 | Denver | senate | senate-race-vote-change | neutral | 393102→217201; -44.74691% | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 08031 | Denver | senate | senate-race-population-change | neutral | -25.446802pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08031 | Denver | governor | governor-race-population-change | neutral | -10.310098pp | modern-current-2026-co; modern-medsl-governor-2022-co; census2025 |
| 08033 | Dolores | senate | senate-race-population-change | neutral | -12.518358pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08035 | Douglas | senate | senate-race-population-change | neutral | -15.320467pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08037 | Eagle | senate | senate-race-population-change | neutral | -14.850403pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08039 | Elbert | senate | senate-race-population-change | neutral | -23.608951pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08039 | Elbert | governor | governor-race-population-change | neutral | -10.029855pp | modern-current-2026-co; modern-medsl-governor-2022-co; census2025 |
| 08041 | El Paso | senate | senate-share-swing | democrat | D share 11.212988pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 08041 | El Paso | senate | senate-race-population-change | neutral | -19.677376pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08043 | Fremont | senate | senate-race-population-change | neutral | -12.24127pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08045 | Garfield | senate | senate-race-population-change | neutral | -16.117656pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08047 | Gilpin | senate | senate-race-population-change | neutral | -15.951545pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08049 | Grand | senate | senate-race-population-change | neutral | -13.840847pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08051 | Gunnison | senate | senate-race-population-change | neutral | -19.390113pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08055 | Huerfano | senate | senate-race-population-change | neutral | -10.594491pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08059 | Jefferson | senate | senate-share-swing | democrat | D share 10.431877pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 08059 | Jefferson | senate | senate-race-population-change | neutral | -20.233141pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08061 | Kiowa | senate | senate-race-population-change | neutral | -11.67751pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08063 | Kit Carson | senate | senate-race-population-change | neutral | -12.742701pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08067 | La Plata | senate | senate-race-population-change | neutral | -10.998993pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08069 | Larimer | senate | senate-share-swing | democrat | D share 11.443517pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 08069 | Larimer | senate | senate-race-population-change | neutral | -19.946208pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08073 | Lincoln | senate | senate-race-population-change | neutral | -12.262713pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08075 | Logan | senate | senate-race-population-change | neutral | -11.648882pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08077 | Mesa | senate | senate-party-count-change | democrat | Republican: -40.191488%; opponent -5.224235% | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 08077 | Mesa | senate | senate-share-swing | democrat | D share 10.943562pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 08077 | Mesa | senate | senate-race-population-change | neutral | -17.572443pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08081 | Moffat | senate | senate-race-population-change | neutral | -13.401699pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08083 | Montezuma | senate | senate-race-population-change | neutral | -18.65036pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08085 | Montrose | senate | senate-share-swing | democrat | D share 14.129647pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 08085 | Montrose | senate | senate-race-vote-change | neutral | 24856→11388; -54.1841% | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 08085 | Montrose | senate | senate-race-population-change | neutral | -32.502078pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08085 | Montrose | governor | governor-race-vote-change | neutral | 20900→11358; -45.655502% | modern-current-2026-co; modern-medsl-governor-2022-co |
| 08085 | Montrose | governor | governor-race-population-change | neutral | -22.204025pp | modern-current-2026-co; modern-medsl-governor-2022-co; census2025 |
| 08087 | Morgan | senate | senate-race-population-change | neutral | -12.908821pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08089 | Otero | senate | senate-race-population-change | neutral | -16.270081pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08091 | Ouray | senate | senate-race-population-change | neutral | -14.560077pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08093 | Park | senate | senate-race-population-change | neutral | -18.492816pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08095 | Phillips | senate | senate-race-population-change | neutral | -11.585129pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08097 | Pitkin | senate | senate-race-population-change | neutral | -24.895642pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08097 | Pitkin | governor | governor-race-population-change | neutral | -13.825009pp | modern-current-2026-co; modern-medsl-governor-2022-co; census2025 |
| 08099 | Prowers | senate | senate-race-population-change | neutral | -12.414944pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08101 | Pueblo | senate | senate-race-population-change | neutral | -20.062325pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08103 | Rio Blanco | senate | senate-race-population-change | neutral | -14.72731pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08105 | Rio Grande | senate | senate-race-population-change | neutral | -10.621133pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08107 | Routt | senate | senate-race-population-change | neutral | -13.696983pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08109 | Saguache | senate | senate-race-population-change | neutral | -12.084201pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08111 | San Juan | senate | senate-share-swing | democrat | D share 11.016312pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election |
| 08113 | San Miguel | senate | senate-race-population-change | neutral | -11.198586pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08115 | Sedgwick | senate | senate-race-population-change | neutral | -13.122083pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08117 | Summit | senate | senate-race-population-change | neutral | -18.840611pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08119 | Teller | senate | senate-race-population-change | neutral | -14.646045pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08121 | Washington | senate | senate-race-population-change | neutral | -15.30888pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08123 | Weld | senate | senate-race-population-change | neutral | -19.920435pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |
| 08125 | Yuma | senate | senate-race-population-change | neutral | -12.293686pp | modern-current-2026-co; modern-heideman-v1-senate-co_medsl_2020; U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election; census2025 |

## Sources and reproduction

- [Florida Division of Elections direct Nov3 2026 unofficial county returns](https://flelectionfiles.floridados.gov/enightfilespublic/20261103_ElecResultsFL.txt)
- [MEDSL 2022 FL official precinct returns](https://raw.githubusercontent.com/MEDSL/2022-elections-official/a8126c5790b8d1f438a3e63c3506cdcdc7406d9f/individual_states/2022-fl-local-precinct-general.zip)
- [Pushbuild2026 GA official-source returns snapshot](https://raw.githubusercontent.com/pushbuild/us-2026-election-results/73b20975fc0a66da90688d372b4c619609fee9cb/data/ga.csv)
- [MEDSL 2022 GA official precinct returns](https://raw.githubusercontent.com/MEDSL/2022-elections-official/a8126c5790b8d1f438a3e63c3506cdcdc7406d9f/individual_states/2022-ga-local-precinct-general.zip)
- [Pushbuild2026 ID official-source returns snapshot](https://raw.githubusercontent.com/pushbuild/us-2026-election-results/73b20975fc0a66da90688d372b4c619609fee9cb/data/id.csv)
- [MEDSL 2022 ID official precinct returns](https://raw.githubusercontent.com/MEDSL/2022-elections-official/a8126c5790b8d1f438a3e63c3506cdcdc7406d9f/individual_states/2022-id-local-precinct-general.zip)
- [Census Vintage 2025 county population estimates](https://www2.census.gov/programs-surveys/popest/datasets/2020-2025/counties/totals/co-est2025-alldata.csv)
- [Pushbuild2026 IA official-source returns snapshot](https://raw.githubusercontent.com/pushbuild/us-2026-election-results/73b20975fc0a66da90688d372b4c619609fee9cb/data/ia.csv)
- [Paul Heideman U.S. county-level election results 1990–2024](https://github.com/pmheideman/us-county-election-results/releases/download/v1.0.0/us_county_election_results_v1.0.0.zip)
- [U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election](https://www.senate.gov/senators/Class_II.htm)
- [MEDSL 2022 IA official precinct returns](https://raw.githubusercontent.com/MEDSL/2022-elections-official/a8126c5790b8d1f438a3e63c3506cdcdc7406d9f/individual_states/2022-ia-local-precinct-general.zip)
- [Pushbuild2026 KS official-source returns snapshot](https://raw.githubusercontent.com/pushbuild/us-2026-election-results/73b20975fc0a66da90688d372b4c619609fee9cb/data/ks.csv)
- [Pushbuild2026 MN official-source returns snapshot](https://raw.githubusercontent.com/pushbuild/us-2026-election-results/73b20975fc0a66da90688d372b4c619609fee9cb/data/mn.csv)
- [MEDSL 2022 MN official precinct returns](https://raw.githubusercontent.com/MEDSL/2022-elections-official/a8126c5790b8d1f438a3e63c3506cdcdc7406d9f/individual_states/2022-mn-local-precinct-general.zip)
- [Montana Secretary of State2026statewide public workbook export (provisional)](https://electionresults.mt.gov/ResultsExport.aspx)
- [MEDSL 2022 U.S. House constituency returns used as independent county-sum controls](https://doi.org/10.7910/DVN/IG0UN2)
- [Heideman county-district source register (candidate county sums)](https://doi.org/10.5281/zenodo.22976553)
- [Nebraska official publisher: 2026 unofficial county Senate export](https://electionresults.nebraska.gov/resultsSW.aspx?type=SW&map=CTY)
- [Pushbuild2026 NJ official-source returns snapshot](https://raw.githubusercontent.com/pushbuild/us-2026-election-results/73b20975fc0a66da90688d372b4c619609fee9cb/data/nj.csv)
- [Pushbuild2026 NC official-source returns snapshot](https://raw.githubusercontent.com/pushbuild/us-2026-election-results/73b20975fc0a66da90688d372b4c619609fee9cb/data/nc.csv)
- [Pushbuild2026 OH official-source returns snapshot](https://raw.githubusercontent.com/pushbuild/us-2026-election-results/73b20975fc0a66da90688d372b4c619609fee9cb/data/oh.csv)
- [MEDSL 2022 OH official precinct returns](https://raw.githubusercontent.com/MEDSL/2022-elections-official/a8126c5790b8d1f438a3e63c3506cdcdc7406d9f/individual_states/2022-oh-local-precinct-general.zip)
- [Pushbuild2026 SC official-source returns snapshot](https://raw.githubusercontent.com/pushbuild/us-2026-election-results/73b20975fc0a66da90688d372b4c619609fee9cb/data/sc.csv)
- [SouthDakota official2026 county Senate results](https://sdresws.azurewebsites.us/ResultsAjax.svc/GetMapData?type=SWR&category=CTY&raceID=14412&osn=110&county=0&party=0)
- [SouthDakota official2026 county Governor results](https://sdresws.azurewebsites.us/ResultsAjax.svc/GetMapData?type=SWR&category=CTY&raceID=14896&osn=205&county=0&party=0)
- [MEDSL 2022 SD official precinct returns](https://raw.githubusercontent.com/MEDSL/2022-elections-official/a8126c5790b8d1f438a3e63c3506cdcdc7406d9f/individual_states/2022-sd-local-precinct-general.zip)
- [Pushbuild2026 TX official-source returns snapshot](https://raw.githubusercontent.com/pushbuild/us-2026-election-results/73b20975fc0a66da90688d372b4c619609fee9cb/data/tx.csv)
- [MEDSL 2022 TX official precinct returns](https://raw.githubusercontent.com/MEDSL/2022-elections-official/a8126c5790b8d1f438a3e63c3506cdcdc7406d9f/individual_states/2022-tx-local-precinct-general.zip)
- [Virginia Department of Elections direct2026Senate county/city and statewide returns](https://enr.elections.virginia.gov/results/public/api/elections/virginia/2026-November-General/data/ballot-item/01000000-f030-c43d-d69c-08df1fee529a)
- [Alabama official publisher: 2026 unofficial county Senate export](https://www2.alabamavotes.gov/electionNight/statewideResultsByContest.aspx?ecode=1001305)
- [Alabama State Canvassing Board: certified2020 county Senate results](https://www.sos.alabama.gov/sites/default/files/election-2020/Final%20Canvass%20of%20Results-Merged.pdf)
- [Arizona Secretary of State2026official provisional export via Enhanced Voting](https://app.enhancedvoting.com/cdn/results/Arizona/export-110326GeneralElection.json)
- [Arizona Secretary of State2022certified general canvass (saved primary PDF web-text extraction)](https://apps.azsos.gov/election/2022/General/canvass/2022dec05_general_election_canvass_web.pdf)
- [Pushbuild2026 AR official-source returns snapshot](https://raw.githubusercontent.com/pushbuild/us-2026-election-results/73b20975fc0a66da90688d372b4c619609fee9cb/data/ar.csv)
- [California Secretary of State: 2026 county reporting status / ballots cast](https://media.sos.ca.gov/media/V26GG.txt)
- [California Secretary of State: 2022 General Election final voter participation statistics by county](https://elections.cdn.sos.ca.gov/sov/2022-general/sov/03-voter-participation-stats-by-county.pdf)
- [California Secretary of State: 2026 Governor reported results](https://media.sos.ca.gov/media/governor.json)
- [MEDSL 2022 CA official precinct returns](https://raw.githubusercontent.com/MEDSL/2022-elections-official/a8126c5790b8d1f438a3e63c3506cdcdc7406d9f/individual_states/2022-ca-local-precinct-general.zip)
- [Pushbuild2026 CO official-source returns snapshot](https://raw.githubusercontent.com/pushbuild/us-2026-election-results/73b20975fc0a66da90688d372b4c619609fee9cb/data/co.csv)
- [MEDSL 2022 CO official precinct returns](https://raw.githubusercontent.com/MEDSL/2022-elections-official/a8126c5790b8d1f438a3e63c3506cdcdc7406d9f/individual_states/2022-co-local-precinct-general.zip)

Run `node scripts/build-2026-anomalies.mjs` then `node scripts/verify-2026-anomalies.mjs`. Existing local source snapshots are merged through COUNTY_SOURCES/mergeElectionData, retaining all precedence and holds. No network/provider calls occur. Input hashes include engine/builder/merged source inputs. Identical inputs produce deterministic JSON and identical Markdown copies. Schema3 keeps office.evidence and advanced context for compatibility, exposes separate office.reviewScreens statuses/flags/evidence, and makes office.flags the union ofA/B/C2/D only. Global participation addsC1 through reviewForCounty. Summary counts exist separately for every screen. Absence never becomes zero.
