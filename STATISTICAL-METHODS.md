# County statistics and what they can establish

V-Map’s statistical panel describes an observed county among other source-qualified counties. It does not calculate the odds of election fraud, certify a result, or replace the map’s own-history review rules. A county can meet a review rule while being ordinary among its state peers.

## What the panel shows

For the selected office and election year, the panel can display the county’s Democratic share of identified Democratic plus Republican votes. Both parties must be explicitly identified, the combined two-party count must be at least 500, and the contest must pass the existing regular-general-election and source-quality checks. A missing party nominee is unavailable rather than zero. A published zero for an identified candidate remains zero.

A known aggregate for Other candidates can prevent a qualified whole-race historical total without invalidating the separately identified major-party counts. For the current-cycle `D / (D + R)` distribution, the panel accepts retained major-party values only when the shared historical qualification helper explicitly marks them with `namedPartyCounts: true`. All candidate counts must still be nonnegative integers. Unique regular contest, round, source and geography holds remain in force. Missing major-party counts remain unavailable, and no Other vote is assigned to either party. This marker does not produce a race-total estimate or an audited historical-change comparison.

For 2026, a loaded schema-3 source audit additionally supplies qualified changes in Democratic votes, Republican votes, two-party share, total candidate/write-in race votes, race votes per 100 residents, and actual reported ballots per 100 residents. Every change retains its audited baseline year. Senate changes use the same qualified seat; House changes require the independently verified whole-county district-portion inventory. No district-wide votes are distributed among counties. Actual ballots and candidate-vote proxies remain separate.

The existing historical graphs display actual imported cycles within 2006–2026, with missing or incompatible observations as gaps. Changing the main election-year control updates the statistical distribution for that cycle. This does not imply a complete twenty-year county panel exists for every office.

## The comparison cohort

The selected county is excluded from its own peers. Every remaining observation has the same state, office and selected year. A change metric also requires the same baseline and current year, seat identifier and audited district-scope identifier as the selected observation. Counties with unavailable, suppressed, ambiguous, incompatible or held source records are excluded for that metric. Each county has one observation; the distribution is not population weighted.

A descriptive score is displayed only with at least **10 other qualified counties**. This application minimum helps avoid a ranking based on only a handful of places. It is not a claim that ten counties are enough to fit or validate a probability model. The number of observations and coverage limitations are always shown. These counties are the available qualified subset, not a random sample of all counties or voters.

## Calculations

- **Median:** the middle peer value, averaging the two central values for an even number of peers.
- **Middle 80%:** the 10th and 90th peer quantiles, linearly interpolated between sorted observations at index `(n − 1) × p`. This is a descriptive range, not a confidence or prediction interval.
- **Percentile position:** `100 × (peers below the selected value + half of tied peers) / n`. The selected county is not included in `n`.
- **Peers at least as far from their median:** count peer observations whose absolute distance from the peer median is at least the selected county’s absolute distance, and divide by `n`. This is a displayed empirical count and fraction, not a p-value. If the count is zero, none of the observed peers met that condition; the true probability is not asserted to be zero.
- **Median absolute deviation (MAD):** median of the peers’ absolute distances from their median.
- **Modified z score:** `0.6745 × (selected value − peer median) / MAD`. When MAD is zero the score is unavailable; it is never treated as infinite evidence. The score is a robust descriptive distance and is not converted into a normal-tail probability.

Floating-point comparisons allow a small numeric tolerance when identifying ties and equal distances. The histogram’s bin counts always sum to the available other-county count. Wide ranges use signed-log horizontal spacing, `sign(x) × log(1 + |x| / 10)`, with labels and the accessible bin table in the original units. This visual transformation changes no scores, counts, flags or ranks.

The median/MAD definitions and modified-z formulation follow the [NIST/SEMATECH discussion of exploratory outlier screening](https://itl.nist.gov/div898/handbook/eda/section3/eda35h.htm) and [NIST Dataplot’s MAD reference](https://www.itl.nist.gov/div898/software/dataplot/refman2/auxillar/mad.htm). NIST distinguishes exploratory labeling from formal testing and explains the role of distributional assumptions. An unusual observation can be legitimate and should not be removed merely for being unusual.

## Why the displayed fraction is not “the odds”

County totals are aggregate observations from related populations. Voters are not independent identical coin flips. Counties differ in age, eligibility, registration, size, geography, candidates and election administration. A statewide political change can move many counties together. A presidential-cycle Senate baseline can differ systematically from a midterm. Provisional reporting often includes different ballot methods and precincts at different times, so reporting progress can create a large temporary change.

The website examines many offices, counties, years and metrics. Selecting a striking observation after inspecting many comparisons changes how surprising it should seem. The current descriptive panel makes no multiple-testing-adjusted significance claim. It offers a transparent way to prioritize source review.

## A defensible future probability-model study

Before publishing model-based tail probabilities, the research team should assemble final, source-reconciled precinct or comparable county results; exact geographic crosswalks; identified candidates and uncontested races; actual ballot and registration/eligibility measures where available; and reporting sequences by ballot method. Reporting incompleteness needs an explicit model rather than treating the available snapshot as a random fraction of final votes.

A preregistered study could evaluate an overdispersed hierarchical model with state, county and election-cycle structure, candidate and demographic covariates, and separate reporting-process effects. Hold out entire historical elections or states to test calibration; compare with simple prior-cycle and state-swing baselines; inspect residuals, sensitivity to source holds and boundary assumptions, and correlated errors. Establish the family of comparisons and an appropriate multiplicity procedure before examining the target cycle. Publish assumptions, fitted parameters, code, provenance and out-of-sample calibration. A model-based tail probability would describe a specified model’s fit, not the probability that fraud occurred.

No such fitted probability model or validated fraud-odds estimator is deployed in this release.

## Reproduction and source evidence

The panel uses the same source loaders, holds and qualified historical-count helpers as the existing map. It receives the already-loaded 2026 audit rather than downloading another copy. The visible source identifiers can be traced through [election source notes](DATA-SOURCES.md), [county-review rules](PATTERN-REVIEW.md), and the [machine-readable audit](data/anomalies-2026.json). The actual statistical methods are implemented in `src/statistical-math.js` and `src/statistical-review.js`; `node scripts/verify-statistical-review.mjs` checks arithmetic, ties, zero dispersion, null handling, peer minimums, symmetry and real qualified source fixtures. No provider API calls are needed for these calculations.
