# 2026 county pattern review

Snapshot audit: November 6, 2026. Every one of the 3142 counties in the map atlas receives an explicit screen status. Yellow borders indicate **provisional exploratory review**, never a fraud finding, error determination or certified election outcome. Missing or unassessed data alone never produces a yellow border.

## Criteria

Participation uses actual countywide reported ballots divided by **all residents**, including children. It is not eligible-voter turnout. Current ballots use 2025 Census population; the county’s own 2022 baseline uses 2022 population. At least 100 reported ballots, 1,000 residents and 10 other eligible same-state peers are required. A flag requires absolute peer distance ≥10 percentage points and |modified z| >3.5, plus an own-county historical difference ≥10pp. If MAD is zero, the ≥10pp absolute-distance guard applies and z is explicitly null. Peers exclude the county itself.

Party screening uses Democratic two-party-share change from the same county’s matching regular Governor contest in 2022 to 2026. This is a fixed four-year comparison, including states such as Vermont and New Hampshire with two-year terms; it does not claim to compare only the immediately previous election. Both years need ≥500 two-party votes and each prior party ≥100 votes. Same-state peer changes need at least 10 other eligible counties. A flag needs |own shift| ≥10pp, |shift minus peer median| ≥10pp, and |modified z| >3.5 (same MAD-zero guard). Swapping all Republican and Democratic counts produces an equal, opposite result. Actual counts and both party changes remain in evidence. Other votes are never reassigned to a party.

Senate requires explicit matching seat identity and a 2020 six-year baseline; House requires proven complete county-district coverage and compatible boundaries. Unproven House comparisons are withheld. There is no 2026 presidential election. Source holds, incomplete/null records, unknown candidate aggregates, incompatible jurisdictions/boundaries and provisional historical baselines prevent comparison. A 100% precinct-reporting value is never treated as completion or certification. All current screens remain provisional and may reflect uneven reporting progress. Source update, retrieval and snapshot times remain separate: a fetch time is never relabeled as a count-update time, and an unavailable update time stays null. No ACS data is used.

The [NIST/SEMATECH exploratory reference](https://itl.nist.gov/div898/handbook/eda/section3/eda35h.htm) supplies the conventional modified-z formula and 3.5 threshold. The 10pp/minimum-size/historical gates are conservative application choices, not calibrated error probabilities. Thousands of screens, changing candidates, demographic composition, source timing and county differences limit causal interpretation. A flag is an invitation to inspect sources.

## Actual screen coverage

| Screen | Assessed | Not assessed | Flagged counties |
|---|---:|---:|---:|
| Actual ballots / residents | 58 | 3084 | 0 |
| president | 0 | 3142 | 0 |
| senate | 0 | 3142 | 0 |
| house | 0 | 3142 | 0 |
| governor | 1047 | 2095 | 6 |

Participation is a global county screen that can be displayed alongside each office. Office-specific assessed counts above remain separate. `reviewForCounty` combines the two and reports their individual statuses; no office-specific assessment is implied by an available participation check.

## Reasons a screen was not assessed

### Participation

- 3084: Actual countywide 2026 regular-November ballots unavailable; candidate votes are not substituted.

### president

- 3142: No 2026 presidential election; office-specific shift screen not applicable.

### senate

- 1732: No imported 2026 county contest for this office.
- 1255: Explicit comparable Senate seat identity is unavailable.
- 155: A unique regular current county contest is not established.

### house

- 1753: Complete comparable county-district coverage and unchanged boundaries are not established; no district allocation is inferred.
- 1389: No imported 2026 county contest for this office.

### governor

- 1912: No imported 2026 county contest for this office.
- 121: Source quality hold or inconsistent totals.
- 43: Two-party minimum of 500 each year or 100 votes for each prior party not met.
- 13: Unitemized candidates or unclassified/missing reporting categories prevent a qualified party comparison.
- 4: Fewer than 10 other eligible same-state comparable-contest peers.
- 1: Both explicitly identified Democratic and Republican candidates are required; Other votes are not reassigned.
- 1: A unique matching regular 2022 county contest is unavailable.

## Actual flags

### Hendry (12051) — governor

Unusual shift toward Democrats relative to state peers. Provisional review: this county’s Democratic two-party-share change from 2022 is at least 10 percentage points in absolute size and differs unusually from eligible same-state peers. Swapping Democratic and Republican votes produces the same screen result in the opposite direction. Candidate changes, voting patterns and reporting progress may explain the difference; this is not a fraud or error finding.

Evidence:

```json
{
  "office": "governor",
  "currentYear": 2026,
  "baselineYear": 2022,
  "currentDemocratVotes": 4335,
  "currentRepublicanVotes": 5533,
  "priorDemocratVotes": 2052,
  "priorRepublicanVotes": 6134,
  "democratCountChange": 2283,
  "republicanCountChange": -601,
  "democratCountChangePercent": 111.25731,
  "republicanCountChangePercent": -9.797848,
  "currentDemocratTwoPartyShare": 43.929874,
  "priorDemocratTwoPartyShare": 25.067188,
  "democratShareChangePp": 18.862686,
  "republicanShareChangePp": -18.862686,
  "peer": {
    "peerCount": 66,
    "peerMedian": 7.572989,
    "peerMad": 1.482974,
    "distancePp": 11.289697,
    "modifiedZ": 5.134885,
    "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
    "outside": true
  },
  "currentSource": {
    "electionDate": null,
    "sourceUpdatedAt": null,
    "asOf": "2026-11-06T18:04:16.299477+00:00",
    "asOfBasis": "retrieval time; state download does not provide a source-wide count timestamp",
    "sourceTimestampBasis": null,
    "retrievedAt": "2026-11-06T18:04:16.299477+00:00",
    "fetchedAt": "2026-11-06T18:04:16.299477+00:00",
    "snapshotAsOf": "2026-11-06T18:04:16.299477+00:00",
    "sourceId": "modern-official-fl-2026",
    "sourceSelection": {
      "bundle": "modern-counties",
      "url": "/data/modern-counties/governor-2026.json",
      "priority": 40
    }
  },
  "priorSource": {
    "electionDate": null,
    "sourceUpdatedAt": null,
    "asOf": null,
    "asOfBasis": null,
    "sourceTimestampBasis": null,
    "retrievedAt": null,
    "fetchedAt": null,
    "snapshotAsOf": null,
    "sourceId": "modern-medsl-governor-2022-fl",
    "sourceSelection": {
      "bundle": "modern-counties",
      "url": "/data/modern-counties/governor-2022.json",
      "priority": 40
    }
  },
  "seatId": null
}
```

Sources: [Florida Division of Elections direct Nov3 2026 unofficial county returns](https://flelectionfiles.floridados.gov/enightfilespublic/20261103_ElecResultsFL.txt); [MEDSL 2022 FL official precinct returns](https://raw.githubusercontent.com/MEDSL/2022-elections-official/a8126c5790b8d1f438a3e63c3506cdcdc7406d9f/individual_states/2022-fl-local-precinct-general.zip); [NIST/SEMATECH: exploratory outlier screening (modified z score)](https://itl.nist.gov/div898/handbook/eda/section3/eda35h.htm).

### Whitfield (13313) — governor

Unusual shift toward Democrats relative to state peers. Provisional review: this county’s Democratic two-party-share change from 2022 is at least 10 percentage points in absolute size and differs unusually from eligible same-state peers. Swapping Democratic and Republican votes produces the same screen result in the opposite direction. Candidate changes, voting patterns and reporting progress may explain the difference; this is not a fraud or error finding.

Evidence:

```json
{
  "office": "governor",
  "currentYear": 2026,
  "baselineYear": 2022,
  "currentDemocratVotes": 11454,
  "currentRepublicanVotes": 18421,
  "priorDemocratVotes": 5874,
  "priorRepublicanVotes": 20919,
  "democratCountChange": 5580,
  "republicanCountChange": -2498,
  "democratCountChangePercent": 94.994893,
  "republicanCountChangePercent": -11.941297,
  "currentDemocratTwoPartyShare": 38.339749,
  "priorDemocratTwoPartyShare": 21.923637,
  "democratShareChangePp": 16.416112,
  "republicanShareChangePp": -16.416112,
  "peer": {
    "peerCount": 156,
    "peerMedian": 5.88402,
    "peerMad": 1.425949,
    "distancePp": 10.532092,
    "modifiedZ": 4.981874,
    "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
    "outside": true
  },
  "currentSource": {
    "electionDate": null,
    "sourceUpdatedAt": "2026-11-06T13:55:52.1591905Z",
    "asOf": "2026-11-06T13:55:52.1591905Z",
    "asOfBasis": "source timestamp",
    "sourceTimestampBasis": null,
    "retrievedAt": "2026-11-06T15:03:38+00:00",
    "fetchedAt": "2026-11-06T15:03:38+00:00",
    "snapshotAsOf": "2026-11-06T10:02:00-05:00",
    "sourceId": "modern-current-2026-ga",
    "sourceSelection": {
      "bundle": "modern-counties",
      "url": "/data/modern-counties/governor-2026.json",
      "priority": 40
    }
  },
  "priorSource": {
    "electionDate": null,
    "sourceUpdatedAt": null,
    "asOf": null,
    "asOfBasis": null,
    "sourceTimestampBasis": null,
    "retrievedAt": null,
    "fetchedAt": null,
    "snapshotAsOf": null,
    "sourceId": "modern-medsl-governor-2022-ga",
    "sourceSelection": {
      "bundle": "modern-counties",
      "url": "/data/modern-counties/governor-2022.json",
      "priority": 40
    }
  },
  "seatId": null
}
```

Sources: [Pushbuild2026 GA official-source returns snapshot](https://raw.githubusercontent.com/pushbuild/us-2026-election-results/73b20975fc0a66da90688d372b4c619609fee9cb/data/ga.csv); [MEDSL 2022 GA official precinct returns](https://raw.githubusercontent.com/MEDSL/2022-elections-official/a8126c5790b8d1f438a3e63c3506cdcdc7406d9f/individual_states/2022-ga-local-precinct-general.zip); [NIST/SEMATECH: exploratory outlier screening (modified z score)](https://itl.nist.gov/div898/handbook/eda/section3/eda35h.htm).

### Bennett (46007) — governor

Unusual shift toward Democrats relative to state peers. Provisional review: this county’s Democratic two-party-share change from 2022 is at least 10 percentage points in absolute size and differs unusually from eligible same-state peers. Swapping Democratic and Republican votes produces the same screen result in the opposite direction. Candidate changes, voting patterns and reporting progress may explain the difference; this is not a fraud or error finding.

Evidence:

```json
{
  "office": "governor",
  "currentYear": 2026,
  "baselineYear": 2022,
  "currentDemocratVotes": 467,
  "currentRepublicanVotes": 511,
  "priorDemocratVotes": 368,
  "priorRepublicanVotes": 619,
  "democratCountChange": 99,
  "republicanCountChange": -108,
  "democratCountChangePercent": 26.902174,
  "republicanCountChangePercent": -17.447496,
  "currentDemocratTwoPartyShare": 47.750511,
  "priorDemocratTwoPartyShare": 37.284701,
  "democratShareChangePp": 10.46581,
  "republicanShareChangePp": -10.46581,
  "peer": {
    "peerCount": 60,
    "peerMedian": -0.410774,
    "peerMad": 1.393448,
    "distancePp": 10.876585,
    "modifiedZ": 5.264824,
    "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
    "outside": true
  },
  "currentSource": {
    "electionDate": null,
    "sourceUpdatedAt": "2026-11-06T13:15:00-06:00",
    "asOf": "2026-11-06T13:15:00-06:00",
    "asOfBasis": "official page last-updated timestamp explicitly CentralTime",
    "sourceTimestampBasis": null,
    "retrievedAt": "2026-11-06T19:21:15.867362+00:00",
    "fetchedAt": "2026-11-06T19:21:15.867362+00:00",
    "snapshotAsOf": "2026-11-06T13:15:00-06:00",
    "sourceId": "modern-official-sd-governor-2026",
    "sourceSelection": {
      "bundle": "modern-counties",
      "url": "/data/modern-counties/governor-2026.json",
      "priority": 40
    }
  },
  "priorSource": {
    "electionDate": null,
    "sourceUpdatedAt": null,
    "asOf": null,
    "asOfBasis": null,
    "sourceTimestampBasis": null,
    "retrievedAt": null,
    "fetchedAt": null,
    "snapshotAsOf": null,
    "sourceId": "modern-medsl-governor-2022-sd",
    "sourceSelection": {
      "bundle": "modern-counties",
      "url": "/data/modern-counties/governor-2022.json",
      "priority": 40
    }
  },
  "seatId": null
}
```

Sources: [SouthDakota official2026 county Governor results](https://sdresws.azurewebsites.us/ResultsAjax.svc/GetMapData?type=SWR&category=CTY&raceID=14896&osn=205&county=0&party=0); [MEDSL 2022 SD official precinct returns](https://raw.githubusercontent.com/MEDSL/2022-elections-official/a8126c5790b8d1f438a3e63c3506cdcdc7406d9f/individual_states/2022-sd-local-precinct-general.zip); [NIST/SEMATECH: exploratory outlier screening (modified z score)](https://itl.nist.gov/div898/handbook/eda/section3/eda35h.htm).

### Deaf Smith (48117) — governor

Unusual shift toward Democrats relative to state peers. Provisional review: this county’s Democratic two-party-share change from 2022 is at least 10 percentage points in absolute size and differs unusually from eligible same-state peers. Swapping Democratic and Republican votes produces the same screen result in the opposite direction. Candidate changes, voting patterns and reporting progress may explain the difference; this is not a fraud or error finding.

Evidence:

```json
{
  "office": "governor",
  "currentYear": 2026,
  "baselineYear": 2022,
  "currentDemocratVotes": 1407,
  "currentRepublicanVotes": 2086,
  "priorDemocratVotes": 635,
  "priorRepublicanVotes": 2281,
  "democratCountChange": 772,
  "republicanCountChange": -195,
  "democratCountChangePercent": 121.574803,
  "republicanCountChangePercent": -8.548882,
  "currentDemocratTwoPartyShare": 40.280561,
  "priorDemocratTwoPartyShare": 21.776406,
  "democratShareChangePp": 18.504155,
  "republicanShareChangePp": -18.504155,
  "peer": {
    "peerCount": 221,
    "peerMedian": 8.487797,
    "peerMad": 1.793196,
    "distancePp": 10.016358,
    "modifiedZ": 3.767594,
    "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
    "outside": true
  },
  "currentSource": {
    "electionDate": null,
    "sourceUpdatedAt": null,
    "asOf": "2026-11-06T15:07:47+00:00",
    "asOfBasis": "fetch time; source timestamp unavailable",
    "sourceTimestampBasis": null,
    "retrievedAt": "2026-11-06T15:07:47+00:00",
    "fetchedAt": "2026-11-06T15:07:47+00:00",
    "snapshotAsOf": "2026-11-06T10:02:00-05:00",
    "sourceId": "modern-current-2026-tx",
    "sourceSelection": {
      "bundle": "modern-counties",
      "url": "/data/modern-counties/governor-2026.json",
      "priority": 40
    }
  },
  "priorSource": {
    "electionDate": null,
    "sourceUpdatedAt": null,
    "asOf": null,
    "asOfBasis": null,
    "sourceTimestampBasis": null,
    "retrievedAt": null,
    "fetchedAt": null,
    "snapshotAsOf": null,
    "sourceId": "modern-medsl-governor-2022-tx",
    "sourceSelection": {
      "bundle": "modern-counties",
      "url": "/data/modern-counties/governor-2022.json",
      "priority": 40
    }
  },
  "seatId": null
}
```

Sources: [Pushbuild2026 TX official-source returns snapshot](https://raw.githubusercontent.com/pushbuild/us-2026-election-results/73b20975fc0a66da90688d372b4c619609fee9cb/data/tx.csv); [MEDSL 2022 TX official precinct returns](https://raw.githubusercontent.com/MEDSL/2022-elections-official/a8126c5790b8d1f438a3e63c3506cdcdc7406d9f/individual_states/2022-tx-local-precinct-general.zip); [NIST/SEMATECH: exploratory outlier screening (modified z score)](https://itl.nist.gov/div898/handbook/eda/section3/eda35h.htm).

### Moore (48341) — governor

Unusual shift toward Democrats relative to state peers. Provisional review: this county’s Democratic two-party-share change from 2022 is at least 10 percentage points in absolute size and differs unusually from eligible same-state peers. Swapping Democratic and Republican votes produces the same screen result in the opposite direction. Candidate changes, voting patterns and reporting progress may explain the difference; this is not a fraud or error finding.

Evidence:

```json
{
  "office": "governor",
  "currentYear": 2026,
  "baselineYear": 2022,
  "currentDemocratVotes": 1329,
  "currentRepublicanVotes": 2735,
  "priorDemocratVotes": 479,
  "priorRepublicanVotes": 3081,
  "democratCountChange": 850,
  "republicanCountChange": -346,
  "democratCountChangePercent": 177.453027,
  "republicanCountChangePercent": -11.23012,
  "currentDemocratTwoPartyShare": 32.701772,
  "priorDemocratTwoPartyShare": 13.455056,
  "democratShareChangePp": 19.246715,
  "republicanShareChangePp": -19.246715,
  "peer": {
    "peerCount": 221,
    "peerMedian": 8.487797,
    "peerMad": 1.793196,
    "distancePp": 10.758918,
    "modifiedZ": 4.046904,
    "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
    "outside": true
  },
  "currentSource": {
    "electionDate": null,
    "sourceUpdatedAt": null,
    "asOf": "2026-11-06T15:07:47+00:00",
    "asOfBasis": "fetch time; source timestamp unavailable",
    "sourceTimestampBasis": null,
    "retrievedAt": "2026-11-06T15:07:47+00:00",
    "fetchedAt": "2026-11-06T15:07:47+00:00",
    "snapshotAsOf": "2026-11-06T10:02:00-05:00",
    "sourceId": "modern-current-2026-tx",
    "sourceSelection": {
      "bundle": "modern-counties",
      "url": "/data/modern-counties/governor-2026.json",
      "priority": 40
    }
  },
  "priorSource": {
    "electionDate": null,
    "sourceUpdatedAt": null,
    "asOf": null,
    "asOfBasis": null,
    "sourceTimestampBasis": null,
    "retrievedAt": null,
    "fetchedAt": null,
    "snapshotAsOf": null,
    "sourceId": "modern-medsl-governor-2022-tx",
    "sourceSelection": {
      "bundle": "modern-counties",
      "url": "/data/modern-counties/governor-2022.json",
      "priority": 40
    }
  },
  "seatId": null
}
```

Sources: [Pushbuild2026 TX official-source returns snapshot](https://raw.githubusercontent.com/pushbuild/us-2026-election-results/73b20975fc0a66da90688d372b4c619609fee9cb/data/tx.csv); [MEDSL 2022 TX official precinct returns](https://raw.githubusercontent.com/MEDSL/2022-elections-official/a8126c5790b8d1f438a3e63c3506cdcdc7406d9f/individual_states/2022-tx-local-precinct-general.zip); [NIST/SEMATECH: exploratory outlier screening (modified z score)](https://itl.nist.gov/div898/handbook/eda/section3/eda35h.htm).

### Zapata (48505) — governor

Unusual shift toward Democrats relative to state peers. Provisional review: this county’s Democratic two-party-share change from 2022 is at least 10 percentage points in absolute size and differs unusually from eligible same-state peers. Swapping Democratic and Republican votes produces the same screen result in the opposite direction. Candidate changes, voting patterns and reporting progress may explain the difference; this is not a fraud or error finding.

Evidence:

```json
{
  "office": "governor",
  "currentYear": 2026,
  "baselineYear": 2022,
  "currentDemocratVotes": 2194,
  "currentRepublicanVotes": 1133,
  "priorDemocratVotes": 1585,
  "priorRepublicanVotes": 1817,
  "democratCountChange": 609,
  "republicanCountChange": -684,
  "democratCountChangePercent": 38.422713,
  "republicanCountChangePercent": -37.644469,
  "currentDemocratTwoPartyShare": 65.945296,
  "priorDemocratTwoPartyShare": 46.590241,
  "democratShareChangePp": 19.355055,
  "republicanShareChangePp": -19.355055,
  "peer": {
    "peerCount": 221,
    "peerMedian": 8.487797,
    "peerMad": 1.793196,
    "distancePp": 10.867258,
    "modifiedZ": 4.087655,
    "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
    "outside": true
  },
  "currentSource": {
    "electionDate": null,
    "sourceUpdatedAt": null,
    "asOf": "2026-11-06T15:07:47+00:00",
    "asOfBasis": "fetch time; source timestamp unavailable",
    "sourceTimestampBasis": null,
    "retrievedAt": "2026-11-06T15:07:47+00:00",
    "fetchedAt": "2026-11-06T15:07:47+00:00",
    "snapshotAsOf": "2026-11-06T10:02:00-05:00",
    "sourceId": "modern-current-2026-tx",
    "sourceSelection": {
      "bundle": "modern-counties",
      "url": "/data/modern-counties/governor-2026.json",
      "priority": 40
    }
  },
  "priorSource": {
    "electionDate": null,
    "sourceUpdatedAt": null,
    "asOf": null,
    "asOfBasis": null,
    "sourceTimestampBasis": null,
    "retrievedAt": null,
    "fetchedAt": null,
    "snapshotAsOf": null,
    "sourceId": "modern-medsl-governor-2022-tx",
    "sourceSelection": {
      "bundle": "modern-counties",
      "url": "/data/modern-counties/governor-2022.json",
      "priority": 40
    }
  },
  "seatId": null
}
```

Sources: [Pushbuild2026 TX official-source returns snapshot](https://raw.githubusercontent.com/pushbuild/us-2026-election-results/73b20975fc0a66da90688d372b4c619609fee9cb/data/tx.csv); [MEDSL 2022 TX official precinct returns](https://raw.githubusercontent.com/MEDSL/2022-elections-official/a8126c5790b8d1f438a3e63c3506cdcdc7406d9f/individual_states/2022-tx-local-precinct-general.zip); [NIST/SEMATECH: exploratory outlier screening (modified z score)](https://itl.nist.gov/div898/handbook/eda/section3/eda35h.htm).

## Reproduction and source integrity

Run `node scripts/build-2026-anomalies.mjs` and `node scripts/verify-2026-anomalies.mjs`. The audit uses existing local snapshots only, with `COUNTY_SOURCES` and `mergeElectionData` retaining source precedence, semantic contest identity and review holds. No new network, provider or paid API calls are made. `public/data/anomalies-2026.json` records every atlas county, assessed evidence, selected source IDs/dates, references, criteria and SHA-256 hashes for every loaded input. No candidate total is substituted for ballots, no absent count becomes zero, and no yellow finding is fabricated. The report is deterministic for identical inputs.
