# 2026 county pattern review

Snapshot audit: November 6, 2026. All 3142 atlas counties receive explicit assessed/not-assessed statuses. Review borders identify provisional exploratory screens, never fraud findings, error determinations, race calls or certified outcomes. Absence alone never causes a border. Democratic and Republican direction rules are symmetric. Conflicting directional screens return `mixed`; participation-only findings remain neutral.

## Three separate screens

**Participation:** Actual countywide reported ballots per 100 residents, including children, not eligible-voter turnout. Current ballots use 2025 Census population and own 2022 history uses 2022 population. Minimums are 100 ballots, 1,000 residents and 10 other same-state peers eligible for the same historical/current screen. A flag needs absolute peer distance ≥10 percentage points, |modifiedz|>3.5, and absolute own historical difference ≥10pp. At MAD = 0, the 10pp distance guard applies and z remains null. Candidate votes are never substituted for ballots. No ACS data is used.

**Party share shift:** Democratic two-party-share change, matching regular county contests, at least 500 two-party votes in both years and 100 votes for each prior party. At least 10 other eligible same-state peers. Flags require |own share change|≥10pp, |change minus peer median|≥10pp and |modifiedz|>3.5, with a10pp absolute guard at MAD0. Governor 2022 → 2026 is a fixed four-year comparison, including two-year-term states; it is not labeled immediately previous election. Other votes stay unassigned.

**Positive party-count growth:** Separately evaluate each party’s `(current / prior −1) ×100`, using the same qualified input pairs/minimums/peers. The party must grow ≥25%, gain ≥100 votes, exceed its own-party same-state peer median by ≥25 percentage points, and have positive modifiedz>3.5. At MAD = 0, the positive 25pp peer-distance guard applies. The opposing party must look ordinary: |its modifiedz|≤2, or within 10pp of its peer median when MAD = 0. Both unusually growing parties fail the unilateral condition; common same-state growth is not an outlier. These thresholds are application choices, not calibrated probabilities. A 1e-10 numerical tolerance absorbs floating-point roundoff at inclusive thresholds; strict z>3.5 treats values within that tolerance as equality.

The [NIST/SEMATECH reference](https://itl.nist.gov/div898/handbook/eda/section3/eda35h.htm) describes exploratory modified-z screening. The formula here is 0.6745×(value−peer median)/peer MAD. All thresholds are fixed before examining named examples. Reporting progress, shifting candidates, county composition and many simultaneous screens limit causal interpretation. A flag prompts source review, not a claim that votes are wrong.

## Qualified contest scopes

Senate uses the [official Class II seat/term record](https://www.senate.gov/senators/Class_II.htm): the 2021–2027 term follows the 2020 election, allowing regular 2020 → 2026 same-seat comparison only with a unique general/non-special county contest in each year and all source gates. Derived seat identities appear in audit evidence; raw returns are unchanged. Georgia/Louisiana 2020 ballot-round ambiguity is withheld. FL/OHspecials are not silently substituted for regular contests.

House is qualified **only for Montana’s hash-frozen full scope**:57 published county-district intersections across 56 counties in both 2022 and 2026. All portions are summed countywide, retaining source/district identities and unassigned Other votes; district summary totals are never allocated to counties. Verified scope completeness is distinct from completed counting. After quality/minimum gates, fewer counties may be assessed. The 2022 county sums were cross-checked against separate MEDSL district returns; a researcher’s assertion of FEC agreement is not described as this session’s independent FEC verification. The 2026 source is the official [Montana statewide export](https://electionresults.mt.gov/ResultsExport.aspx), still provisional. All other House scopes remain unassessed; mere 58/58 county presence in California is not proof of complete compatible district portions. Source file and exact intersection hashes are in `comparabilityContracts.montanaHouse`; changed inputs disable that qualification pending renewed review.

There is no 2026 presidential election. Holds, null counts, explicit incomplete coverage, unitemized/unknown candidate categories, incompatible boundaries/jurisdictions, unmatched stages and provisional historical baselines are withheld. A 100% precinct figure never establishes completed counting. Update, retrieval and snapshot timestamps stay separate; unknown count-update times remain null.

## Actual coverage

| Screen | Assessed | Not assessed | Flagged counties |
|---|---:|---:|---:|
| Ballots / residents | 58 | 3084 | 0 |
| president: share shift | 0 | 3142 | 0 |
| president: positive party-count growth | 0 | 3142 | 0 |
| president: union of party screens | 0 | 3142 | 0 |
| senate: share shift | 576 | 2566 | 1 |
| senate: positive party-count growth | 576 | 2566 | 1 |
| senate: union of party screens | 576 | 2566 | 1 |
| house: share shift | 43 | 3099 | 0 |
| house: positive party-count growth | 43 | 3099 | 0 |
| house: union of party screens | 43 | 3099 | 0 |
| governor: share shift | 1047 | 2095 | 6 |
| governor: positive party-count growth | 1047 | 2095 | 13 |
| governor: union of party screens | 1047 | 2095 | 16 |

Participation is global county evidence; office-specific coverage above remains separate. `reviewForCounty` combines the participation and office flag lists but reports their individual statuses. `office.evidence` retains share evidence; `office.shareShift.flags` and `office.partyGrowth.flags` are separate, and `office.flags` is their union. Growth evidence retains both party counts/count changes, percentages, peer distributions, opposing-normal gates, source times and qualified-scope references.

## Named-case controls without overrides

Webb(48479): Democratic count growth49.480778%, Republican growth5.423853%; Democratic peer median59.107807%, peer residual-9.627029pp; growth flags0, share flags0. Reasons blocking a Democratic growth flag: Positive growth does not pass both the 25pp peer-distance and modified-z criteria.

Zapata(48505): Democratic count growth38.422713%, Republican growth-37.644469%; Democratic peer median59.107807%, peer residual-20.685094pp; growth flags0, share flags1. Reasons blocking a Democratic growth flag: Positive growth does not pass both the 25pp peer-distance and modified-z criteria. Opposing-party growth is outside its ordinary peer range.

## Why screens were not assessed

### Participation

- 3084: Actual countywide 2026 regular-November ballots unavailable; candidate votes are not substituted.

### president share shift

- 3142: No 2026 presidential election; office-specific shift screen not applicable.

### president count growth

- 3142: No 2026 presidential election; office-specific shift screen not applicable.

### senate share shift

- 1732: No imported 2026 county contest for this office.
- 300: Source quality hold or inconsistent totals.
- 223: Georgia/Louisiana 2020 Senate ballot-round comparability is not established.
- 155: A unique regular current county contest is not established.
- 142: Both explicitly identified Democratic and Republican candidates are required; Other votes are not reassigned.
- 9: Two-party minimum of 500 each year or 100 votes for each prior party not met.
- 5: Fewer than 10 other eligible same-state comparable-contest peers.

### senate count growth

- 1732: No imported 2026 county contest for this office.
- 300: Source quality hold or inconsistent totals.
- 223: Georgia/Louisiana 2020 Senate ballot-round comparability is not established.
- 155: A unique regular current county contest is not established.
- 142: Both explicitly identified Democratic and Republican candidates are required; Other votes are not reassigned.
- 9: Two-party minimum of 500 each year or 100 votes for each prior party not met.
- 5: Fewer than 10 other eligible same-state comparable-contest peers.

### house share shift

- 1697: Complete comparable county-district coverage and county identity are not established; no district allocation is inferred.
- 1389: No imported 2026 county contest for this office.
- 13: Two-party minimum of 500 each year or 100 votes for each prior party not met.

### house count growth

- 1697: Complete comparable county-district coverage and county identity are not established; no district allocation is inferred.
- 1389: No imported 2026 county contest for this office.
- 13: Two-party minimum of 500 each year or 100 votes for each prior party not met.

### governor share shift

- 1912: No imported 2026 county contest for this office.
- 121: Source quality hold or inconsistent totals.
- 43: Two-party minimum of 500 each year or 100 votes for each prior party not met.
- 13: Unitemized candidates or unclassified/missing reporting categories prevent a qualified party comparison.
- 4: Fewer than 10 other eligible same-state comparable-contest peers.
- 1: Both explicitly identified Democratic and Republican candidates are required; Other votes are not reassigned.
- 1: A unique matching regular 2022 county contest is unavailable.

### governor count growth

- 1912: No imported 2026 county contest for this office.
- 121: Source quality hold or inconsistent totals.
- 43: Two-party minimum of 500 each year or 100 votes for each prior party not met.
- 13: Unitemized candidates or unclassified/missing reporting categories prevent a qualified party comparison.
- 4: Fewer than 10 other eligible same-state comparable-contest peers.
- 1: Both explicitly identified Democratic and Republican candidates are required; Other votes are not reassigned.
- 1: A unique matching regular 2022 county contest is unavailable.

## Actual provisional flags

### Hardee(12049) — governor / governor-symmetric-party-growth

Unusual Democratic vote-count growth with ordinary opposing growth. Provisional review: Democrat counts increased at least 25% and 100 votes, at least 25 percentage points above same-state peer growth, with modified z >3.5 (MAD-zero absolute guard). Opposing-party growth is within |z|≤2, or within 10pp of its peer median when MAD=0. Reporting progress, candidate changes and voting patterns may explain this exploratory result; it is not an error or fraud finding.

```json
{
  "office": "governor",
  "currentYear": 2026,
  "baselineYear": 2022,
  "currentDemocratVotes": 1933,
  "currentRepublicanVotes": 3962,
  "priorDemocratVotes": 949,
  "priorRepublicanVotes": 4558,
  "democratCountChange": 984,
  "republicanCountChange": -596,
  "democratCountChangePercent": 103.688093,
  "republicanCountChangePercent": -13.07591,
  "currentDemocratTwoPartyShare": 32.7905,
  "priorDemocratTwoPartyShare": 17.232613,
  "democratShareChangePp": 15.557887,
  "republicanShareChangePp": -15.557887,
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
    },
    "provisional": true,
    "unofficial": true,
    "countingStatus": "counting",
    "resultStatus": "unofficial"
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
    },
    "provisional": false,
    "unofficial": false,
    "countingStatus": null,
    "resultStatus": null
  },
  "seatId": null,
  "screen": "party-count-growth",
  "shareShiftPeer": {
    "peerCount": 66,
    "peerMedian": 7.572989,
    "peerMad": 1.482974,
    "distancePp": 7.984898,
    "modifiedZ": 3.631765,
    "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
    "outside": false
  },
  "parties": {
    "Democrat": {
      "ownGrowthPercent": 103.688093,
      "ownCountIncrease": 984,
      "opposingGrowthPercent": -13.07591,
      "peer": {
        "peerCount": 66,
        "peerMedian": 30.740999,
        "peerMad": 7.51779,
        "distancePp": 72.947094,
        "modifiedZ": 6.544851,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": true,
        "positiveOutlier": true,
        "ordinary": false
      },
      "opposingPeer": {
        "peerCount": 66,
        "peerMedian": -11.672791,
        "peerMad": 3.326828,
        "distancePp": -1.403119,
        "modifiedZ": -0.284476,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": false,
        "positiveOutlier": false,
        "ordinary": true
      },
      "ordinaryOpposition": true,
      "ownMinimumsPassed": true,
      "notFlaggedReasons": []
    },
    "Republican": {
      "ownGrowthPercent": -13.07591,
      "ownCountIncrease": -596,
      "opposingGrowthPercent": 103.688093,
      "peer": {
        "peerCount": 66,
        "peerMedian": -11.672791,
        "peerMad": 3.326828,
        "distancePp": -1.403119,
        "modifiedZ": -0.284476,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": false,
        "positiveOutlier": false,
        "ordinary": true
      },
      "opposingPeer": {
        "peerCount": 66,
        "peerMedian": 30.740999,
        "peerMad": 7.51779,
        "distancePp": 72.947094,
        "modifiedZ": 6.544851,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": true,
        "positiveOutlier": true,
        "ordinary": false
      },
      "ordinaryOpposition": false,
      "ownMinimumsPassed": false,
      "notFlaggedReasons": [
        "Own positive growth is below 25%.",
        "Vote count increase is below 100.",
        "Positive growth does not pass both the 25pp peer-distance and modified-z criteria.",
        "Opposing-party growth is outside its ordinary peer range."
      ]
    }
  },
  "growthParty": "Democrat",
  "ownGrowthPercent": 103.688093,
  "ownCountIncrease": 984,
  "opposingGrowthPercent": -13.07591,
  "peer": {
    "peerCount": 66,
    "peerMedian": 30.740999,
    "peerMad": 7.51779,
    "distancePp": 72.947094,
    "modifiedZ": 6.544851,
    "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
    "outside": true,
    "positiveOutlier": true,
    "ordinary": false
  },
  "opposingPeer": {
    "peerCount": 66,
    "peerMedian": -11.672791,
    "peerMad": 3.326828,
    "distancePp": -1.403119,
    "modifiedZ": -0.284476,
    "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
    "outside": false,
    "positiveOutlier": false,
    "ordinary": true
  },
  "ordinaryOpposition": true,
  "ownMinimumsPassed": true,
  "notFlaggedReasons": []
}
```

Sources: [Florida Division of Elections direct Nov3 2026 unofficial county returns](https://flelectionfiles.floridados.gov/enightfilespublic/20261103_ElecResultsFL.txt); [MEDSL 2022 FL official precinct returns](https://raw.githubusercontent.com/MEDSL/2022-elections-official/a8126c5790b8d1f438a3e63c3506cdcdc7406d9f/individual_states/2022-fl-local-precinct-general.zip); [NIST/SEMATECH: exploratory outlier screening (modified z score)](https://itl.nist.gov/div898/handbook/eda/section3/eda35h.htm).

### Hendry(12051) — governor / governor-symmetric-party-shift

Unusual shift toward Democrats relative to state peers. Provisional review: this county’s Democratic two-party-share change from 2022 is at least 10 percentage points in absolute size and differs unusually from eligible same-state peers. Swapping Democratic and Republican votes produces the same screen result in the opposite direction. Candidate changes, voting patterns and reporting progress may explain the difference; this is not a fraud or error finding.

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
    },
    "provisional": true,
    "unofficial": true,
    "countingStatus": "counting",
    "resultStatus": "unofficial"
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
    },
    "provisional": false,
    "unofficial": false,
    "countingStatus": null,
    "resultStatus": null
  },
  "seatId": null
}
```

Sources: [Florida Division of Elections direct Nov3 2026 unofficial county returns](https://flelectionfiles.floridados.gov/enightfilespublic/20261103_ElecResultsFL.txt); [MEDSL 2022 FL official precinct returns](https://raw.githubusercontent.com/MEDSL/2022-elections-official/a8126c5790b8d1f438a3e63c3506cdcdc7406d9f/individual_states/2022-fl-local-precinct-general.zip); [NIST/SEMATECH: exploratory outlier screening (modified z score)](https://itl.nist.gov/div898/handbook/eda/section3/eda35h.htm).

### Hendry(12051) — governor / governor-symmetric-party-growth

Unusual Democratic vote-count growth with ordinary opposing growth. Provisional review: Democrat counts increased at least 25% and 100 votes, at least 25 percentage points above same-state peer growth, with modified z >3.5 (MAD-zero absolute guard). Opposing-party growth is within |z|≤2, or within 10pp of its peer median when MAD=0. Reporting progress, candidate changes and voting patterns may explain this exploratory result; it is not an error or fraud finding.

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
    },
    "provisional": true,
    "unofficial": true,
    "countingStatus": "counting",
    "resultStatus": "unofficial"
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
    },
    "provisional": false,
    "unofficial": false,
    "countingStatus": null,
    "resultStatus": null
  },
  "seatId": null,
  "screen": "party-count-growth",
  "shareShiftPeer": {
    "peerCount": 66,
    "peerMedian": 7.572989,
    "peerMad": 1.482974,
    "distancePp": 11.289697,
    "modifiedZ": 5.134885,
    "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
    "outside": true
  },
  "parties": {
    "Democrat": {
      "ownGrowthPercent": 111.25731,
      "ownCountIncrease": 2283,
      "opposingGrowthPercent": -9.797848,
      "peer": {
        "peerCount": 66,
        "peerMedian": 30.740999,
        "peerMad": 7.51779,
        "distancePp": 80.516311,
        "modifiedZ": 7.223965,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": true,
        "positiveOutlier": true,
        "ordinary": false
      },
      "opposingPeer": {
        "peerCount": 66,
        "peerMedian": -11.890371,
        "peerMad": 3.195335,
        "distancePp": 2.092523,
        "modifiedZ": 0.441709,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": false,
        "positiveOutlier": false,
        "ordinary": true
      },
      "ordinaryOpposition": true,
      "ownMinimumsPassed": true,
      "notFlaggedReasons": []
    },
    "Republican": {
      "ownGrowthPercent": -9.797848,
      "ownCountIncrease": -601,
      "opposingGrowthPercent": 111.25731,
      "peer": {
        "peerCount": 66,
        "peerMedian": -11.890371,
        "peerMad": 3.195335,
        "distancePp": 2.092523,
        "modifiedZ": 0.441709,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": false,
        "positiveOutlier": false,
        "ordinary": true
      },
      "opposingPeer": {
        "peerCount": 66,
        "peerMedian": 30.740999,
        "peerMad": 7.51779,
        "distancePp": 80.516311,
        "modifiedZ": 7.223965,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": true,
        "positiveOutlier": true,
        "ordinary": false
      },
      "ordinaryOpposition": false,
      "ownMinimumsPassed": false,
      "notFlaggedReasons": [
        "Own positive growth is below 25%.",
        "Vote count increase is below 100.",
        "Positive growth does not pass both the 25pp peer-distance and modified-z criteria.",
        "Opposing-party growth is outside its ordinary peer range."
      ]
    }
  },
  "growthParty": "Democrat",
  "ownGrowthPercent": 111.25731,
  "ownCountIncrease": 2283,
  "opposingGrowthPercent": -9.797848,
  "peer": {
    "peerCount": 66,
    "peerMedian": 30.740999,
    "peerMad": 7.51779,
    "distancePp": 80.516311,
    "modifiedZ": 7.223965,
    "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
    "outside": true,
    "positiveOutlier": true,
    "ordinary": false
  },
  "opposingPeer": {
    "peerCount": 66,
    "peerMedian": -11.890371,
    "peerMad": 3.195335,
    "distancePp": 2.092523,
    "modifiedZ": 0.441709,
    "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
    "outside": false,
    "positiveOutlier": false,
    "ordinary": true
  },
  "ordinaryOpposition": true,
  "ownMinimumsPassed": true,
  "notFlaggedReasons": []
}
```

Sources: [Florida Division of Elections direct Nov3 2026 unofficial county returns](https://flelectionfiles.floridados.gov/enightfilespublic/20261103_ElecResultsFL.txt); [MEDSL 2022 FL official precinct returns](https://raw.githubusercontent.com/MEDSL/2022-elections-official/a8126c5790b8d1f438a3e63c3506cdcdc7406d9f/individual_states/2022-fl-local-precinct-general.zip); [NIST/SEMATECH: exploratory outlier screening (modified z score)](https://itl.nist.gov/div898/handbook/eda/section3/eda35h.htm).

### Murray(13213) — governor / governor-symmetric-party-growth

Unusual Democratic vote-count growth with ordinary opposing growth. Provisional review: Democrat counts increased at least 25% and 100 votes, at least 25 percentage points above same-state peer growth, with modified z >3.5 (MAD-zero absolute guard). Opposing-party growth is within |z|≤2, or within 10pp of its peer median when MAD=0. Reporting progress, candidate changes and voting patterns may explain this exploratory result; it is not an error or fraud finding.

```json
{
  "office": "governor",
  "currentYear": 2026,
  "baselineYear": 2022,
  "currentDemocratVotes": 2225,
  "currentRepublicanVotes": 9135,
  "priorDemocratVotes": 1160,
  "priorRepublicanVotes": 10290,
  "democratCountChange": 1065,
  "republicanCountChange": -1155,
  "democratCountChangePercent": 91.810345,
  "republicanCountChangePercent": -11.22449,
  "currentDemocratTwoPartyShare": 19.586268,
  "priorDemocratTwoPartyShare": 10.131004,
  "democratShareChangePp": 9.455263,
  "republicanShareChangePp": -9.455263,
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
    },
    "provisional": true,
    "unofficial": true,
    "countingStatus": "counting",
    "resultStatus": "unofficial"
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
    },
    "provisional": false,
    "unofficial": false,
    "countingStatus": null,
    "resultStatus": null
  },
  "seatId": null,
  "screen": "party-count-growth",
  "shareShiftPeer": {
    "peerCount": 156,
    "peerMedian": 5.88402,
    "peerMad": 1.425949,
    "distancePp": 3.571243,
    "modifiedZ": 1.689264,
    "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
    "outside": false
  },
  "parties": {
    "Democrat": {
      "ownGrowthPercent": 91.810345,
      "ownCountIncrease": 1065,
      "opposingGrowthPercent": -11.22449,
      "peer": {
        "peerCount": 156,
        "peerMedian": 21.851632,
        "peerMad": 10.507161,
        "distancePp": 69.958712,
        "modifiedZ": 4.490951,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": true,
        "positiveOutlier": true,
        "ordinary": false
      },
      "opposingPeer": {
        "peerCount": 156,
        "peerMedian": -9.844773,
        "peerMad": 2.623736,
        "distancePp": -1.379717,
        "modifiedZ": -0.354692,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": false,
        "positiveOutlier": false,
        "ordinary": true
      },
      "ordinaryOpposition": true,
      "ownMinimumsPassed": true,
      "notFlaggedReasons": []
    },
    "Republican": {
      "ownGrowthPercent": -11.22449,
      "ownCountIncrease": -1155,
      "opposingGrowthPercent": 91.810345,
      "peer": {
        "peerCount": 156,
        "peerMedian": -9.844773,
        "peerMad": 2.623736,
        "distancePp": -1.379717,
        "modifiedZ": -0.354692,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": false,
        "positiveOutlier": false,
        "ordinary": true
      },
      "opposingPeer": {
        "peerCount": 156,
        "peerMedian": 21.851632,
        "peerMad": 10.507161,
        "distancePp": 69.958712,
        "modifiedZ": 4.490951,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": true,
        "positiveOutlier": true,
        "ordinary": false
      },
      "ordinaryOpposition": false,
      "ownMinimumsPassed": false,
      "notFlaggedReasons": [
        "Own positive growth is below 25%.",
        "Vote count increase is below 100.",
        "Positive growth does not pass both the 25pp peer-distance and modified-z criteria.",
        "Opposing-party growth is outside its ordinary peer range."
      ]
    }
  },
  "growthParty": "Democrat",
  "ownGrowthPercent": 91.810345,
  "ownCountIncrease": 1065,
  "opposingGrowthPercent": -11.22449,
  "peer": {
    "peerCount": 156,
    "peerMedian": 21.851632,
    "peerMad": 10.507161,
    "distancePp": 69.958712,
    "modifiedZ": 4.490951,
    "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
    "outside": true,
    "positiveOutlier": true,
    "ordinary": false
  },
  "opposingPeer": {
    "peerCount": 156,
    "peerMedian": -9.844773,
    "peerMad": 2.623736,
    "distancePp": -1.379717,
    "modifiedZ": -0.354692,
    "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
    "outside": false,
    "positiveOutlier": false,
    "ordinary": true
  },
  "ordinaryOpposition": true,
  "ownMinimumsPassed": true,
  "notFlaggedReasons": []
}
```

Sources: [Pushbuild2026 GA official-source returns snapshot](https://raw.githubusercontent.com/pushbuild/us-2026-election-results/73b20975fc0a66da90688d372b4c619609fee9cb/data/ga.csv); [MEDSL 2022 GA official precinct returns](https://raw.githubusercontent.com/MEDSL/2022-elections-official/a8126c5790b8d1f438a3e63c3506cdcdc7406d9f/individual_states/2022-ga-local-precinct-general.zip); [NIST/SEMATECH: exploratory outlier screening (modified z score)](https://itl.nist.gov/div898/handbook/eda/section3/eda35h.htm).

### Whitfield(13313) — governor / governor-symmetric-party-shift

Unusual shift toward Democrats relative to state peers. Provisional review: this county’s Democratic two-party-share change from 2022 is at least 10 percentage points in absolute size and differs unusually from eligible same-state peers. Swapping Democratic and Republican votes produces the same screen result in the opposite direction. Candidate changes, voting patterns and reporting progress may explain the difference; this is not a fraud or error finding.

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
    },
    "provisional": true,
    "unofficial": true,
    "countingStatus": "counting",
    "resultStatus": "unofficial"
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
    },
    "provisional": false,
    "unofficial": false,
    "countingStatus": null,
    "resultStatus": null
  },
  "seatId": null
}
```

Sources: [Pushbuild2026 GA official-source returns snapshot](https://raw.githubusercontent.com/pushbuild/us-2026-election-results/73b20975fc0a66da90688d372b4c619609fee9cb/data/ga.csv); [MEDSL 2022 GA official precinct returns](https://raw.githubusercontent.com/MEDSL/2022-elections-official/a8126c5790b8d1f438a3e63c3506cdcdc7406d9f/individual_states/2022-ga-local-precinct-general.zip); [NIST/SEMATECH: exploratory outlier screening (modified z score)](https://itl.nist.gov/div898/handbook/eda/section3/eda35h.htm).

### Whitfield(13313) — governor / governor-symmetric-party-growth

Unusual Democratic vote-count growth with ordinary opposing growth. Provisional review: Democrat counts increased at least 25% and 100 votes, at least 25 percentage points above same-state peer growth, with modified z >3.5 (MAD-zero absolute guard). Opposing-party growth is within |z|≤2, or within 10pp of its peer median when MAD=0. Reporting progress, candidate changes and voting patterns may explain this exploratory result; it is not an error or fraud finding.

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
    },
    "provisional": true,
    "unofficial": true,
    "countingStatus": "counting",
    "resultStatus": "unofficial"
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
    },
    "provisional": false,
    "unofficial": false,
    "countingStatus": null,
    "resultStatus": null
  },
  "seatId": null,
  "screen": "party-count-growth",
  "shareShiftPeer": {
    "peerCount": 156,
    "peerMedian": 5.88402,
    "peerMad": 1.425949,
    "distancePp": 10.532092,
    "modifiedZ": 4.981874,
    "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
    "outside": true
  },
  "parties": {
    "Democrat": {
      "ownGrowthPercent": 94.994893,
      "ownCountIncrease": 5580,
      "opposingGrowthPercent": -11.941297,
      "peer": {
        "peerCount": 156,
        "peerMedian": 21.851632,
        "peerMad": 10.507161,
        "distancePp": 73.14326,
        "modifiedZ": 4.695381,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": true,
        "positiveOutlier": true,
        "ordinary": false
      },
      "opposingPeer": {
        "peerCount": 156,
        "peerMedian": -9.844773,
        "peerMad": 2.623736,
        "distancePp": -2.096524,
        "modifiedZ": -0.538966,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": false,
        "positiveOutlier": false,
        "ordinary": true
      },
      "ordinaryOpposition": true,
      "ownMinimumsPassed": true,
      "notFlaggedReasons": []
    },
    "Republican": {
      "ownGrowthPercent": -11.941297,
      "ownCountIncrease": -2498,
      "opposingGrowthPercent": 94.994893,
      "peer": {
        "peerCount": 156,
        "peerMedian": -9.844773,
        "peerMad": 2.623736,
        "distancePp": -2.096524,
        "modifiedZ": -0.538966,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": false,
        "positiveOutlier": false,
        "ordinary": true
      },
      "opposingPeer": {
        "peerCount": 156,
        "peerMedian": 21.851632,
        "peerMad": 10.507161,
        "distancePp": 73.14326,
        "modifiedZ": 4.695381,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": true,
        "positiveOutlier": true,
        "ordinary": false
      },
      "ordinaryOpposition": false,
      "ownMinimumsPassed": false,
      "notFlaggedReasons": [
        "Own positive growth is below 25%.",
        "Vote count increase is below 100.",
        "Positive growth does not pass both the 25pp peer-distance and modified-z criteria.",
        "Opposing-party growth is outside its ordinary peer range."
      ]
    }
  },
  "growthParty": "Democrat",
  "ownGrowthPercent": 94.994893,
  "ownCountIncrease": 5580,
  "opposingGrowthPercent": -11.941297,
  "peer": {
    "peerCount": 156,
    "peerMedian": 21.851632,
    "peerMad": 10.507161,
    "distancePp": 73.14326,
    "modifiedZ": 4.695381,
    "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
    "outside": true,
    "positiveOutlier": true,
    "ordinary": false
  },
  "opposingPeer": {
    "peerCount": 156,
    "peerMedian": -9.844773,
    "peerMad": 2.623736,
    "distancePp": -2.096524,
    "modifiedZ": -0.538966,
    "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
    "outside": false,
    "positiveOutlier": false,
    "ordinary": true
  },
  "ordinaryOpposition": true,
  "ownMinimumsPassed": true,
  "notFlaggedReasons": []
}
```

Sources: [Pushbuild2026 GA official-source returns snapshot](https://raw.githubusercontent.com/pushbuild/us-2026-election-results/73b20975fc0a66da90688d372b4c619609fee9cb/data/ga.csv); [MEDSL 2022 GA official precinct returns](https://raw.githubusercontent.com/MEDSL/2022-elections-official/a8126c5790b8d1f438a3e63c3506cdcdc7406d9f/individual_states/2022-ga-local-precinct-general.zip); [NIST/SEMATECH: exploratory outlier screening (modified z score)](https://itl.nist.gov/div898/handbook/eda/section3/eda35h.htm).

### Crawford(19047) — governor / governor-symmetric-party-growth

Unusual Democratic vote-count growth with ordinary opposing growth. Provisional review: Democrat counts increased at least 25% and 100 votes, at least 25 percentage points above same-state peer growth, with modified z >3.5 (MAD-zero absolute guard). Opposing-party growth is within |z|≤2, or within 10pp of its peer median when MAD=0. Reporting progress, candidate changes and voting patterns may explain this exploratory result; it is not an error or fraud finding.

```json
{
  "office": "governor",
  "currentYear": 2026,
  "baselineYear": 2022,
  "currentDemocratVotes": 2184,
  "currentRepublicanVotes": 2863,
  "priorDemocratVotes": 876,
  "priorRepublicanVotes": 3504,
  "democratCountChange": 1308,
  "republicanCountChange": -641,
  "democratCountChangePercent": 149.315068,
  "republicanCountChangePercent": -18.293379,
  "currentDemocratTwoPartyShare": 43.273232,
  "priorDemocratTwoPartyShare": 20,
  "democratShareChangePp": 23.273232,
  "republicanShareChangePp": -23.273232,
  "currentSource": {
    "electionDate": null,
    "sourceUpdatedAt": null,
    "asOf": "2026-11-06T15:03:51+00:00",
    "asOfBasis": "fetch time; source timestamp unavailable",
    "sourceTimestampBasis": null,
    "retrievedAt": "2026-11-06T15:03:51+00:00",
    "fetchedAt": "2026-11-06T15:03:51+00:00",
    "snapshotAsOf": "2026-11-06T10:02:00-05:00",
    "sourceId": "modern-current-2026-ia",
    "sourceSelection": {
      "bundle": "modern-counties",
      "url": "/data/modern-counties/governor-2026.json",
      "priority": 40
    },
    "provisional": true,
    "unofficial": true,
    "countingStatus": "counting",
    "resultStatus": "unofficial"
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
    "sourceId": "modern-medsl-governor-2022-ia",
    "sourceSelection": {
      "bundle": "modern-counties",
      "url": "/data/modern-counties/governor-2022.json",
      "priority": 40
    },
    "provisional": false,
    "unofficial": false,
    "countingStatus": null,
    "resultStatus": null
  },
  "seatId": null,
  "screen": "party-count-growth",
  "shareShiftPeer": {
    "peerCount": 98,
    "peerMedian": 16.024332,
    "peerMad": 1.515598,
    "distancePp": 7.2489,
    "modifiedZ": 3.226043,
    "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
    "outside": false
  },
  "parties": {
    "Democrat": {
      "ownGrowthPercent": 149.315068,
      "ownCountIncrease": 1308,
      "opposingGrowthPercent": -18.293379,
      "peer": {
        "peerCount": 98,
        "peerMedian": 71.56305,
        "peerMad": 10.471462,
        "distancePp": 77.752019,
        "modifiedZ": 5.008253,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": true,
        "positiveOutlier": true,
        "ordinary": false
      },
      "opposingPeer": {
        "peerCount": 98,
        "peerMedian": -15.64091,
        "peerMad": 2.68158,
        "distancePp": -2.652469,
        "modifiedZ": -0.667178,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": false,
        "positiveOutlier": false,
        "ordinary": true
      },
      "ordinaryOpposition": true,
      "ownMinimumsPassed": true,
      "notFlaggedReasons": []
    },
    "Republican": {
      "ownGrowthPercent": -18.293379,
      "ownCountIncrease": -641,
      "opposingGrowthPercent": 149.315068,
      "peer": {
        "peerCount": 98,
        "peerMedian": -15.64091,
        "peerMad": 2.68158,
        "distancePp": -2.652469,
        "modifiedZ": -0.667178,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": false,
        "positiveOutlier": false,
        "ordinary": true
      },
      "opposingPeer": {
        "peerCount": 98,
        "peerMedian": 71.56305,
        "peerMad": 10.471462,
        "distancePp": 77.752019,
        "modifiedZ": 5.008253,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": true,
        "positiveOutlier": true,
        "ordinary": false
      },
      "ordinaryOpposition": false,
      "ownMinimumsPassed": false,
      "notFlaggedReasons": [
        "Own positive growth is below 25%.",
        "Vote count increase is below 100.",
        "Positive growth does not pass both the 25pp peer-distance and modified-z criteria.",
        "Opposing-party growth is outside its ordinary peer range."
      ]
    }
  },
  "growthParty": "Democrat",
  "ownGrowthPercent": 149.315068,
  "ownCountIncrease": 1308,
  "opposingGrowthPercent": -18.293379,
  "peer": {
    "peerCount": 98,
    "peerMedian": 71.56305,
    "peerMad": 10.471462,
    "distancePp": 77.752019,
    "modifiedZ": 5.008253,
    "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
    "outside": true,
    "positiveOutlier": true,
    "ordinary": false
  },
  "opposingPeer": {
    "peerCount": 98,
    "peerMedian": -15.64091,
    "peerMad": 2.68158,
    "distancePp": -2.652469,
    "modifiedZ": -0.667178,
    "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
    "outside": false,
    "positiveOutlier": false,
    "ordinary": true
  },
  "ordinaryOpposition": true,
  "ownMinimumsPassed": true,
  "notFlaggedReasons": []
}
```

Sources: [Pushbuild2026 IA official-source returns snapshot](https://raw.githubusercontent.com/pushbuild/us-2026-election-results/73b20975fc0a66da90688d372b4c619609fee9cb/data/ia.csv); [MEDSL 2022 IA official precinct returns](https://raw.githubusercontent.com/MEDSL/2022-elections-official/a8126c5790b8d1f438a3e63c3506cdcdc7406d9f/individual_states/2022-ia-local-precinct-general.zip); [NIST/SEMATECH: exploratory outlier screening (modified z score)](https://itl.nist.gov/div898/handbook/eda/section3/eda35h.htm).

### Osceola(19143) — governor / governor-symmetric-party-growth

Unusual Democratic vote-count growth with ordinary opposing growth. Provisional review: Democrat counts increased at least 25% and 100 votes, at least 25 percentage points above same-state peer growth, with modified z >3.5 (MAD-zero absolute guard). Opposing-party growth is within |z|≤2, or within 10pp of its peer median when MAD=0. Reporting progress, candidate changes and voting patterns may explain this exploratory result; it is not an error or fraud finding.

```json
{
  "office": "governor",
  "currentYear": 2026,
  "baselineYear": 2022,
  "currentDemocratVotes": 612,
  "currentRepublicanVotes": 1763,
  "priorDemocratVotes": 245,
  "priorRepublicanVotes": 2018,
  "democratCountChange": 367,
  "republicanCountChange": -255,
  "democratCountChangePercent": 149.795918,
  "republicanCountChangePercent": -12.636274,
  "currentDemocratTwoPartyShare": 25.768421,
  "priorDemocratTwoPartyShare": 10.826337,
  "democratShareChangePp": 14.942084,
  "republicanShareChangePp": -14.942084,
  "currentSource": {
    "electionDate": null,
    "sourceUpdatedAt": null,
    "asOf": "2026-11-06T15:03:51+00:00",
    "asOfBasis": "fetch time; source timestamp unavailable",
    "sourceTimestampBasis": null,
    "retrievedAt": "2026-11-06T15:03:51+00:00",
    "fetchedAt": "2026-11-06T15:03:51+00:00",
    "snapshotAsOf": "2026-11-06T10:02:00-05:00",
    "sourceId": "modern-current-2026-ia",
    "sourceSelection": {
      "bundle": "modern-counties",
      "url": "/data/modern-counties/governor-2026.json",
      "priority": 40
    },
    "provisional": true,
    "unofficial": true,
    "countingStatus": "counting",
    "resultStatus": "unofficial"
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
    "sourceId": "modern-medsl-governor-2022-ia",
    "sourceSelection": {
      "bundle": "modern-counties",
      "url": "/data/modern-counties/governor-2022.json",
      "priority": 40
    },
    "provisional": false,
    "unofficial": false,
    "countingStatus": null,
    "resultStatus": null
  },
  "seatId": null,
  "screen": "party-count-growth",
  "shareShiftPeer": {
    "peerCount": 98,
    "peerMedian": 16.051266,
    "peerMad": 1.577729,
    "distancePp": -1.109182,
    "modifiedZ": -0.47419,
    "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
    "outside": false
  },
  "parties": {
    "Democrat": {
      "ownGrowthPercent": 149.795918,
      "ownCountIncrease": 367,
      "opposingGrowthPercent": -12.636274,
      "peer": {
        "peerCount": 98,
        "peerMedian": 71.56305,
        "peerMad": 10.471462,
        "distancePp": 78.232869,
        "modifiedZ": 5.039227,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": true,
        "positiveOutlier": true,
        "ordinary": false
      },
      "opposingPeer": {
        "peerCount": 98,
        "peerMedian": -15.732427,
        "peerMad": 2.689833,
        "distancePp": 3.096154,
        "modifiedZ": 0.776389,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": false,
        "positiveOutlier": false,
        "ordinary": true
      },
      "ordinaryOpposition": true,
      "ownMinimumsPassed": true,
      "notFlaggedReasons": []
    },
    "Republican": {
      "ownGrowthPercent": -12.636274,
      "ownCountIncrease": -255,
      "opposingGrowthPercent": 149.795918,
      "peer": {
        "peerCount": 98,
        "peerMedian": -15.732427,
        "peerMad": 2.689833,
        "distancePp": 3.096154,
        "modifiedZ": 0.776389,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": false,
        "positiveOutlier": false,
        "ordinary": true
      },
      "opposingPeer": {
        "peerCount": 98,
        "peerMedian": 71.56305,
        "peerMad": 10.471462,
        "distancePp": 78.232869,
        "modifiedZ": 5.039227,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": true,
        "positiveOutlier": true,
        "ordinary": false
      },
      "ordinaryOpposition": false,
      "ownMinimumsPassed": false,
      "notFlaggedReasons": [
        "Own positive growth is below 25%.",
        "Vote count increase is below 100.",
        "Positive growth does not pass both the 25pp peer-distance and modified-z criteria.",
        "Opposing-party growth is outside its ordinary peer range."
      ]
    }
  },
  "growthParty": "Democrat",
  "ownGrowthPercent": 149.795918,
  "ownCountIncrease": 367,
  "opposingGrowthPercent": -12.636274,
  "peer": {
    "peerCount": 98,
    "peerMedian": 71.56305,
    "peerMad": 10.471462,
    "distancePp": 78.232869,
    "modifiedZ": 5.039227,
    "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
    "outside": true,
    "positiveOutlier": true,
    "ordinary": false
  },
  "opposingPeer": {
    "peerCount": 98,
    "peerMedian": -15.732427,
    "peerMad": 2.689833,
    "distancePp": 3.096154,
    "modifiedZ": 0.776389,
    "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
    "outside": false,
    "positiveOutlier": false,
    "ordinary": true
  },
  "ordinaryOpposition": true,
  "ownMinimumsPassed": true,
  "notFlaggedReasons": []
}
```

Sources: [Pushbuild2026 IA official-source returns snapshot](https://raw.githubusercontent.com/pushbuild/us-2026-election-results/73b20975fc0a66da90688d372b4c619609fee9cb/data/ia.csv); [MEDSL 2022 IA official precinct returns](https://raw.githubusercontent.com/MEDSL/2022-elections-official/a8126c5790b8d1f438a3e63c3506cdcdc7406d9f/individual_states/2022-ia-local-precinct-general.zip); [NIST/SEMATECH: exploratory outlier screening (modified z score)](https://itl.nist.gov/div898/handbook/eda/section3/eda35h.htm).

### Charles(24017) — governor / governor-symmetric-party-growth

Unusual Democratic vote-count growth with ordinary opposing growth. Provisional review: Democrat counts increased at least 25% and 100 votes, at least 25 percentage points above same-state peer growth, with modified z >3.5 (MAD-zero absolute guard). Opposing-party growth is within |z|≤2, or within 10pp of its peer median when MAD=0. Reporting progress, candidate changes and voting patterns may explain this exploratory result; it is not an error or fraud finding.

```json
{
  "office": "governor",
  "currentYear": 2026,
  "baselineYear": 2022,
  "currentDemocratVotes": 48153,
  "currentRepublicanVotes": 15872,
  "priorDemocratVotes": 37367,
  "priorRepublicanVotes": 15830,
  "democratCountChange": 10786,
  "republicanCountChange": 42,
  "democratCountChangePercent": 28.865041,
  "republicanCountChangePercent": 0.265319,
  "currentDemocratTwoPartyShare": 75.209684,
  "priorDemocratTwoPartyShare": 70.242683,
  "democratShareChangePp": 4.967001,
  "republicanShareChangePp": -4.967001,
  "currentSource": {
    "electionDate": null,
    "sourceUpdatedAt": "2026-11-05T22:56:33",
    "asOf": "2026-11-05T22:56:33",
    "asOfBasis": "source timestamp",
    "sourceTimestampBasis": null,
    "retrievedAt": "2026-11-06T15:04:09+00:00",
    "fetchedAt": "2026-11-06T15:04:09+00:00",
    "snapshotAsOf": "2026-11-06T10:02:00-05:00",
    "sourceId": "modern-current-2026-md",
    "sourceSelection": {
      "bundle": "modern-counties",
      "url": "/data/modern-counties/governor-2026.json",
      "priority": 40
    },
    "provisional": true,
    "unofficial": true,
    "countingStatus": "counting",
    "resultStatus": "unofficial"
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
    "sourceId": "modern-medsl-governor-2022-md",
    "sourceSelection": {
      "bundle": "modern-counties",
      "url": "/data/modern-counties/governor-2022.json",
      "priority": 40
    },
    "provisional": false,
    "unofficial": false,
    "countingStatus": null,
    "resultStatus": null
  },
  "seatId": null,
  "screen": "party-count-growth",
  "shareShiftPeer": {
    "peerCount": 22,
    "peerMedian": -1.872915,
    "peerMad": 2.356248,
    "distancePp": 6.839916,
    "modifiedZ": 1.957996,
    "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
    "outside": false
  },
  "parties": {
    "Democrat": {
      "ownGrowthPercent": 28.865041,
      "ownCountIncrease": 10786,
      "opposingGrowthPercent": 0.265319,
      "peer": {
        "peerCount": 22,
        "peerMedian": -3.393358,
        "peerMad": 4.939732,
        "distancePp": 32.2584,
        "modifiedZ": 4.404751,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": true,
        "positiveOutlier": true,
        "ordinary": false
      },
      "opposingPeer": {
        "peerCount": 22,
        "peerMedian": 2.050902,
        "peerMad": 6.382259,
        "distancePp": -1.785583,
        "modifiedZ": -0.188707,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": false,
        "positiveOutlier": false,
        "ordinary": true
      },
      "ordinaryOpposition": true,
      "ownMinimumsPassed": true,
      "notFlaggedReasons": []
    },
    "Republican": {
      "ownGrowthPercent": 0.265319,
      "ownCountIncrease": 42,
      "opposingGrowthPercent": 28.865041,
      "peer": {
        "peerCount": 22,
        "peerMedian": 2.050902,
        "peerMad": 6.382259,
        "distancePp": -1.785583,
        "modifiedZ": -0.188707,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": false,
        "positiveOutlier": false,
        "ordinary": true
      },
      "opposingPeer": {
        "peerCount": 22,
        "peerMedian": -3.393358,
        "peerMad": 4.939732,
        "distancePp": 32.2584,
        "modifiedZ": 4.404751,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": true,
        "positiveOutlier": true,
        "ordinary": false
      },
      "ordinaryOpposition": false,
      "ownMinimumsPassed": false,
      "notFlaggedReasons": [
        "Own positive growth is below 25%.",
        "Vote count increase is below 100.",
        "Positive growth does not pass both the 25pp peer-distance and modified-z criteria.",
        "Opposing-party growth is outside its ordinary peer range."
      ]
    }
  },
  "growthParty": "Democrat",
  "ownGrowthPercent": 28.865041,
  "ownCountIncrease": 10786,
  "opposingGrowthPercent": 0.265319,
  "peer": {
    "peerCount": 22,
    "peerMedian": -3.393358,
    "peerMad": 4.939732,
    "distancePp": 32.2584,
    "modifiedZ": 4.404751,
    "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
    "outside": true,
    "positiveOutlier": true,
    "ordinary": false
  },
  "opposingPeer": {
    "peerCount": 22,
    "peerMedian": 2.050902,
    "peerMad": 6.382259,
    "distancePp": -1.785583,
    "modifiedZ": -0.188707,
    "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
    "outside": false,
    "positiveOutlier": false,
    "ordinary": true
  },
  "ordinaryOpposition": true,
  "ownMinimumsPassed": true,
  "notFlaggedReasons": []
}
```

Sources: [Pushbuild2026 MD official-source returns snapshot](https://raw.githubusercontent.com/pushbuild/us-2026-election-results/73b20975fc0a66da90688d372b4c619609fee9cb/data/md.csv); [MEDSL 2022 MD official precinct returns](https://raw.githubusercontent.com/MEDSL/2022-elections-official/a8126c5790b8d1f438a3e63c3506cdcdc7406d9f/individual_states/2022-md-local-precinct-general.zip); [NIST/SEMATECH: exploratory outlier screening (modified z score)](https://itl.nist.gov/div898/handbook/eda/section3/eda35h.htm).

### Martin(37117) — senate / senate-symmetric-party-shift

Unusual shift toward Republicans relative to state peers. Provisional review: this county’s Democratic two-party-share change from 2020 is at least 10 percentage points in absolute size and differs unusually from eligible same-state peers. Swapping Democratic and Republican votes produces the same screen result in the opposite direction. Candidate changes, voting patterns and reporting progress may explain the difference; this is not a fraud or error finding.

```json
{
  "office": "senate",
  "currentYear": 2026,
  "baselineYear": 2020,
  "currentDemocratVotes": 5794,
  "currentRepublicanVotes": 10103,
  "priorDemocratVotes": 5973,
  "priorRepublicanVotes": 6034,
  "democratCountChange": -179,
  "republicanCountChange": 4069,
  "democratCountChangePercent": -2.996819,
  "republicanCountChangePercent": 67.434538,
  "currentDemocratTwoPartyShare": 36.447128,
  "priorDemocratTwoPartyShare": 49.745982,
  "democratShareChangePp": -13.298853,
  "republicanShareChangePp": 13.298853,
  "peer": {
    "peerCount": 99,
    "peerMedian": 8.165253,
    "peerMad": 2.522121,
    "distancePp": -21.464106,
    "modifiedZ": -5.740224,
    "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
    "outside": true
  },
  "currentSource": {
    "electionDate": null,
    "sourceUpdatedAt": null,
    "asOf": "2026-11-06T15:06:14+00:00",
    "asOfBasis": "fetch time; source timestamp unavailable",
    "sourceTimestampBasis": null,
    "retrievedAt": "2026-11-06T15:06:14+00:00",
    "fetchedAt": "2026-11-06T15:06:14+00:00",
    "snapshotAsOf": "2026-11-06T10:02:00-05:00",
    "sourceId": "modern-current-2026-nc",
    "sourceSelection": {
      "bundle": "modern-counties",
      "url": "/data/modern-counties/senate-2026.json",
      "priority": 40
    },
    "provisional": true,
    "unofficial": true,
    "countingStatus": "counting",
    "resultStatus": "unofficial"
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
    "sourceId": "modern-heideman-v1-senate-nc_medsl_2020",
    "sourceSelection": {
      "bundle": "modern-counties",
      "url": "/data/modern-counties/senate-2020.json",
      "priority": 40
    },
    "provisional": false,
    "unofficial": false,
    "countingStatus": null,
    "resultStatus": null
  },
  "seatId": "37-senate-class-2",
  "comparability": {
    "id": "37-senate-class-2",
    "basis": "Official Class II2021–2027 term identifies the regular 2020 and 2026 seat; source general/non-special stages must independently match",
    "sources": [
      {
        "title": "U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election",
        "url": "https://www.senate.gov/senators/Class_II.htm"
      }
    ]
  }
}
```

Sources: [Pushbuild2026 NC official-source returns snapshot](https://raw.githubusercontent.com/pushbuild/us-2026-election-results/73b20975fc0a66da90688d372b4c619609fee9cb/data/nc.csv); [Paul Heideman U.S. county-level election results 1990–2024](https://github.com/pmheideman/us-county-election-results/releases/download/v1.0.0/us_county_election_results_v1.0.0.zip); [U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election](https://www.senate.gov/senators/Class_II.htm); [NIST/SEMATECH: exploratory outlier screening (modified z score)](https://itl.nist.gov/div898/handbook/eda/section3/eda35h.htm).

### Martin(37117) — senate / senate-symmetric-party-growth

Unusual Republican vote-count growth with ordinary opposing growth. Provisional review: Republican counts increased at least 25% and 100 votes, at least 25 percentage points above same-state peer growth, with modified z >3.5 (MAD-zero absolute guard). Opposing-party growth is within |z|≤2, or within 10pp of its peer median when MAD=0. Reporting progress, candidate changes and voting patterns may explain this exploratory result; it is not an error or fraud finding.

```json
{
  "office": "senate",
  "currentYear": 2026,
  "baselineYear": 2020,
  "currentDemocratVotes": 5794,
  "currentRepublicanVotes": 10103,
  "priorDemocratVotes": 5973,
  "priorRepublicanVotes": 6034,
  "democratCountChange": -179,
  "republicanCountChange": 4069,
  "democratCountChangePercent": -2.996819,
  "republicanCountChangePercent": 67.434538,
  "currentDemocratTwoPartyShare": 36.447128,
  "priorDemocratTwoPartyShare": 49.745982,
  "democratShareChangePp": -13.298853,
  "republicanShareChangePp": 13.298853,
  "currentSource": {
    "electionDate": null,
    "sourceUpdatedAt": null,
    "asOf": "2026-11-06T15:06:14+00:00",
    "asOfBasis": "fetch time; source timestamp unavailable",
    "sourceTimestampBasis": null,
    "retrievedAt": "2026-11-06T15:06:14+00:00",
    "fetchedAt": "2026-11-06T15:06:14+00:00",
    "snapshotAsOf": "2026-11-06T10:02:00-05:00",
    "sourceId": "modern-current-2026-nc",
    "sourceSelection": {
      "bundle": "modern-counties",
      "url": "/data/modern-counties/senate-2026.json",
      "priority": 40
    },
    "provisional": true,
    "unofficial": true,
    "countingStatus": "counting",
    "resultStatus": "unofficial"
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
    "sourceId": "modern-heideman-v1-senate-nc_medsl_2020",
    "sourceSelection": {
      "bundle": "modern-counties",
      "url": "/data/modern-counties/senate-2020.json",
      "priority": 40
    },
    "provisional": false,
    "unofficial": false,
    "countingStatus": null,
    "resultStatus": null
  },
  "seatId": "37-senate-class-2",
  "comparability": {
    "id": "37-senate-class-2",
    "basis": "Official Class II2021–2027 term identifies the regular 2020 and 2026 seat; source general/non-special stages must independently match",
    "sources": [
      {
        "title": "U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election",
        "url": "https://www.senate.gov/senators/Class_II.htm"
      }
    ]
  },
  "screen": "party-count-growth",
  "shareShiftPeer": {
    "peerCount": 99,
    "peerMedian": 8.165253,
    "peerMad": 2.522121,
    "distancePp": -21.464106,
    "modifiedZ": -5.740224,
    "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
    "outside": true
  },
  "parties": {
    "Democrat": {
      "ownGrowthPercent": -2.996819,
      "ownCountIncrease": -179,
      "opposingGrowthPercent": 67.434538,
      "peer": {
        "peerCount": 99,
        "peerMedian": -7.855833,
        "peerMad": 8.79533,
        "distancePp": 4.859014,
        "modifiedZ": 0.37263,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": false,
        "positiveOutlier": false,
        "ordinary": true
      },
      "opposingPeer": {
        "peerCount": 99,
        "peerMedian": -36.405551,
        "peerMad": 3.924188,
        "distancePp": 103.840088,
        "modifiedZ": 17.848316,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": true,
        "positiveOutlier": true,
        "ordinary": false
      },
      "ordinaryOpposition": false,
      "ownMinimumsPassed": false,
      "notFlaggedReasons": [
        "Own positive growth is below 25%.",
        "Vote count increase is below 100.",
        "Positive growth does not pass both the 25pp peer-distance and modified-z criteria.",
        "Opposing-party growth is outside its ordinary peer range."
      ]
    },
    "Republican": {
      "ownGrowthPercent": 67.434538,
      "ownCountIncrease": 4069,
      "opposingGrowthPercent": -2.996819,
      "peer": {
        "peerCount": 99,
        "peerMedian": -36.405551,
        "peerMad": 3.924188,
        "distancePp": 103.840088,
        "modifiedZ": 17.848316,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": true,
        "positiveOutlier": true,
        "ordinary": false
      },
      "opposingPeer": {
        "peerCount": 99,
        "peerMedian": -7.855833,
        "peerMad": 8.79533,
        "distancePp": 4.859014,
        "modifiedZ": 0.37263,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": false,
        "positiveOutlier": false,
        "ordinary": true
      },
      "ordinaryOpposition": true,
      "ownMinimumsPassed": true,
      "notFlaggedReasons": []
    }
  },
  "growthParty": "Republican",
  "ownGrowthPercent": 67.434538,
  "ownCountIncrease": 4069,
  "opposingGrowthPercent": -2.996819,
  "peer": {
    "peerCount": 99,
    "peerMedian": -36.405551,
    "peerMad": 3.924188,
    "distancePp": 103.840088,
    "modifiedZ": 17.848316,
    "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
    "outside": true,
    "positiveOutlier": true,
    "ordinary": false
  },
  "opposingPeer": {
    "peerCount": 99,
    "peerMedian": -7.855833,
    "peerMad": 8.79533,
    "distancePp": 4.859014,
    "modifiedZ": 0.37263,
    "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
    "outside": false,
    "positiveOutlier": false,
    "ordinary": true
  },
  "ordinaryOpposition": true,
  "ownMinimumsPassed": true,
  "notFlaggedReasons": []
}
```

Sources: [Pushbuild2026 NC official-source returns snapshot](https://raw.githubusercontent.com/pushbuild/us-2026-election-results/73b20975fc0a66da90688d372b4c619609fee9cb/data/nc.csv); [Paul Heideman U.S. county-level election results 1990–2024](https://github.com/pmheideman/us-county-election-results/releases/download/v1.0.0/us_county_election_results_v1.0.0.zip); [U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election](https://www.senate.gov/senators/Class_II.htm); [NIST/SEMATECH: exploratory outlier screening (modified z score)](https://itl.nist.gov/div898/handbook/eda/section3/eda35h.htm).

### Bennett(46007) — governor / governor-symmetric-party-shift

Unusual shift toward Democrats relative to state peers. Provisional review: this county’s Democratic two-party-share change from 2022 is at least 10 percentage points in absolute size and differs unusually from eligible same-state peers. Swapping Democratic and Republican votes produces the same screen result in the opposite direction. Candidate changes, voting patterns and reporting progress may explain the difference; this is not a fraud or error finding.

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
    },
    "provisional": true,
    "unofficial": true,
    "countingStatus": "counting",
    "resultStatus": "unofficial"
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
    },
    "provisional": false,
    "unofficial": false,
    "countingStatus": null,
    "resultStatus": null
  },
  "seatId": null
}
```

Sources: [SouthDakota official2026 county Governor results](https://sdresws.azurewebsites.us/ResultsAjax.svc/GetMapData?type=SWR&category=CTY&raceID=14896&osn=205&county=0&party=0); [MEDSL 2022 SD official precinct returns](https://raw.githubusercontent.com/MEDSL/2022-elections-official/a8126c5790b8d1f438a3e63c3506cdcdc7406d9f/individual_states/2022-sd-local-precinct-general.zip); [NIST/SEMATECH: exploratory outlier screening (modified z score)](https://itl.nist.gov/div898/handbook/eda/section3/eda35h.htm).

### Deaf Smith(48117) — governor / governor-symmetric-party-shift

Unusual shift toward Democrats relative to state peers. Provisional review: this county’s Democratic two-party-share change from 2022 is at least 10 percentage points in absolute size and differs unusually from eligible same-state peers. Swapping Democratic and Republican votes produces the same screen result in the opposite direction. Candidate changes, voting patterns and reporting progress may explain the difference; this is not a fraud or error finding.

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
    },
    "provisional": true,
    "unofficial": true,
    "countingStatus": "counting",
    "resultStatus": "unofficial"
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
    },
    "provisional": false,
    "unofficial": false,
    "countingStatus": null,
    "resultStatus": null
  },
  "seatId": null
}
```

Sources: [Pushbuild2026 TX official-source returns snapshot](https://raw.githubusercontent.com/pushbuild/us-2026-election-results/73b20975fc0a66da90688d372b4c619609fee9cb/data/tx.csv); [MEDSL 2022 TX official precinct returns](https://raw.githubusercontent.com/MEDSL/2022-elections-official/a8126c5790b8d1f438a3e63c3506cdcdc7406d9f/individual_states/2022-tx-local-precinct-general.zip); [NIST/SEMATECH: exploratory outlier screening (modified z score)](https://itl.nist.gov/div898/handbook/eda/section3/eda35h.htm).

### Gaines(48165) — governor / governor-symmetric-party-growth

Unusual Democratic vote-count growth with ordinary opposing growth. Provisional review: Democrat counts increased at least 25% and 100 votes, at least 25 percentage points above same-state peer growth, with modified z >3.5 (MAD-zero absolute guard). Opposing-party growth is within |z|≤2, or within 10pp of its peer median when MAD=0. Reporting progress, candidate changes and voting patterns may explain this exploratory result; it is not an error or fraud finding.

```json
{
  "office": "governor",
  "currentYear": 2026,
  "baselineYear": 2022,
  "currentDemocratVotes": 788,
  "currentRepublicanVotes": 3925,
  "priorDemocratVotes": 311,
  "priorRepublicanVotes": 3761,
  "democratCountChange": 477,
  "republicanCountChange": 164,
  "democratCountChangePercent": 153.376206,
  "republicanCountChangePercent": 4.360542,
  "currentDemocratTwoPartyShare": 16.719711,
  "priorDemocratTwoPartyShare": 7.637525,
  "democratShareChangePp": 9.082187,
  "republicanShareChangePp": -9.082187,
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
    },
    "provisional": true,
    "unofficial": true,
    "countingStatus": "counting",
    "resultStatus": "unofficial"
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
    },
    "provisional": false,
    "unofficial": false,
    "countingStatus": null,
    "resultStatus": null
  },
  "seatId": null,
  "screen": "party-count-growth",
  "shareShiftPeer": {
    "peerCount": 221,
    "peerMedian": 8.487797,
    "peerMad": 1.79732,
    "distancePp": 0.59439,
    "modifiedZ": 0.223063,
    "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
    "outside": false
  },
  "parties": {
    "Democrat": {
      "ownGrowthPercent": 153.376206,
      "ownCountIncrease": 477,
      "opposingGrowthPercent": 4.360542,
      "peer": {
        "peerCount": 221,
        "peerMedian": 59.090909,
        "peerMad": 13.501684,
        "distancePp": 94.285297,
        "modifiedZ": 4.710185,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": true,
        "positiveOutlier": true,
        "ordinary": false
      },
      "opposingPeer": {
        "peerCount": 221,
        "peerMedian": -3.467483,
        "peerMad": 4.951657,
        "distancePp": 7.828026,
        "modifiedZ": 1.06631,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": false,
        "positiveOutlier": false,
        "ordinary": true
      },
      "ordinaryOpposition": true,
      "ownMinimumsPassed": true,
      "notFlaggedReasons": []
    },
    "Republican": {
      "ownGrowthPercent": 4.360542,
      "ownCountIncrease": 164,
      "opposingGrowthPercent": 153.376206,
      "peer": {
        "peerCount": 221,
        "peerMedian": -3.467483,
        "peerMad": 4.951657,
        "distancePp": 7.828026,
        "modifiedZ": 1.06631,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": false,
        "positiveOutlier": false,
        "ordinary": true
      },
      "opposingPeer": {
        "peerCount": 221,
        "peerMedian": 59.090909,
        "peerMad": 13.501684,
        "distancePp": 94.285297,
        "modifiedZ": 4.710185,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": true,
        "positiveOutlier": true,
        "ordinary": false
      },
      "ordinaryOpposition": false,
      "ownMinimumsPassed": false,
      "notFlaggedReasons": [
        "Own positive growth is below 25%.",
        "Positive growth does not pass both the 25pp peer-distance and modified-z criteria.",
        "Opposing-party growth is outside its ordinary peer range."
      ]
    }
  },
  "growthParty": "Democrat",
  "ownGrowthPercent": 153.376206,
  "ownCountIncrease": 477,
  "opposingGrowthPercent": 4.360542,
  "peer": {
    "peerCount": 221,
    "peerMedian": 59.090909,
    "peerMad": 13.501684,
    "distancePp": 94.285297,
    "modifiedZ": 4.710185,
    "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
    "outside": true,
    "positiveOutlier": true,
    "ordinary": false
  },
  "opposingPeer": {
    "peerCount": 221,
    "peerMedian": -3.467483,
    "peerMad": 4.951657,
    "distancePp": 7.828026,
    "modifiedZ": 1.06631,
    "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
    "outside": false,
    "positiveOutlier": false,
    "ordinary": true
  },
  "ordinaryOpposition": true,
  "ownMinimumsPassed": true,
  "notFlaggedReasons": []
}
```

Sources: [Pushbuild2026 TX official-source returns snapshot](https://raw.githubusercontent.com/pushbuild/us-2026-election-results/73b20975fc0a66da90688d372b4c619609fee9cb/data/tx.csv); [MEDSL 2022 TX official precinct returns](https://raw.githubusercontent.com/MEDSL/2022-elections-official/a8126c5790b8d1f438a3e63c3506cdcdc7406d9f/individual_states/2022-tx-local-precinct-general.zip); [NIST/SEMATECH: exploratory outlier screening (modified z score)](https://itl.nist.gov/div898/handbook/eda/section3/eda35h.htm).

### Liberty(48291) — governor / governor-symmetric-party-growth

Unusual Democratic vote-count growth with ordinary opposing growth. Provisional review: Democrat counts increased at least 25% and 100 votes, at least 25 percentage points above same-state peer growth, with modified z >3.5 (MAD-zero absolute guard). Opposing-party growth is within |z|≤2, or within 10pp of its peer median when MAD=0. Reporting progress, candidate changes and voting patterns may explain this exploratory result; it is not an error or fraud finding.

```json
{
  "office": "governor",
  "currentYear": 2026,
  "baselineYear": 2022,
  "currentDemocratVotes": 8694,
  "currentRepublicanVotes": 16459,
  "priorDemocratVotes": 3488,
  "priorRepublicanVotes": 16079,
  "democratCountChange": 5206,
  "republicanCountChange": 380,
  "democratCountChangePercent": 149.254587,
  "republicanCountChangePercent": 2.363331,
  "currentDemocratTwoPartyShare": 34.564465,
  "priorDemocratTwoPartyShare": 17.825931,
  "democratShareChangePp": 16.738534,
  "republicanShareChangePp": -16.738534,
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
    },
    "provisional": true,
    "unofficial": true,
    "countingStatus": "counting",
    "resultStatus": "unofficial"
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
    },
    "provisional": false,
    "unofficial": false,
    "countingStatus": null,
    "resultStatus": null
  },
  "seatId": null,
  "screen": "party-count-growth",
  "shareShiftPeer": {
    "peerCount": 221,
    "peerMedian": 8.487797,
    "peerMad": 1.793196,
    "distancePp": 8.250737,
    "modifiedZ": 3.103466,
    "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
    "outside": false
  },
  "parties": {
    "Democrat": {
      "ownGrowthPercent": 149.254587,
      "ownCountIncrease": 5206,
      "opposingGrowthPercent": 2.363331,
      "peer": {
        "peerCount": 221,
        "peerMedian": 59.090909,
        "peerMad": 13.501684,
        "distancePp": 90.163678,
        "modifiedZ": 4.504283,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": true,
        "positiveOutlier": true,
        "ordinary": false
      },
      "opposingPeer": {
        "peerCount": 221,
        "peerMedian": -3.467483,
        "peerMad": 4.951657,
        "distancePp": 5.830814,
        "modifiedZ": 0.794256,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": false,
        "positiveOutlier": false,
        "ordinary": true
      },
      "ordinaryOpposition": true,
      "ownMinimumsPassed": true,
      "notFlaggedReasons": []
    },
    "Republican": {
      "ownGrowthPercent": 2.363331,
      "ownCountIncrease": 380,
      "opposingGrowthPercent": 149.254587,
      "peer": {
        "peerCount": 221,
        "peerMedian": -3.467483,
        "peerMad": 4.951657,
        "distancePp": 5.830814,
        "modifiedZ": 0.794256,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": false,
        "positiveOutlier": false,
        "ordinary": true
      },
      "opposingPeer": {
        "peerCount": 221,
        "peerMedian": 59.090909,
        "peerMad": 13.501684,
        "distancePp": 90.163678,
        "modifiedZ": 4.504283,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": true,
        "positiveOutlier": true,
        "ordinary": false
      },
      "ordinaryOpposition": false,
      "ownMinimumsPassed": false,
      "notFlaggedReasons": [
        "Own positive growth is below 25%.",
        "Positive growth does not pass both the 25pp peer-distance and modified-z criteria.",
        "Opposing-party growth is outside its ordinary peer range."
      ]
    }
  },
  "growthParty": "Democrat",
  "ownGrowthPercent": 149.254587,
  "ownCountIncrease": 5206,
  "opposingGrowthPercent": 2.363331,
  "peer": {
    "peerCount": 221,
    "peerMedian": 59.090909,
    "peerMad": 13.501684,
    "distancePp": 90.163678,
    "modifiedZ": 4.504283,
    "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
    "outside": true,
    "positiveOutlier": true,
    "ordinary": false
  },
  "opposingPeer": {
    "peerCount": 221,
    "peerMedian": -3.467483,
    "peerMad": 4.951657,
    "distancePp": 5.830814,
    "modifiedZ": 0.794256,
    "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
    "outside": false,
    "positiveOutlier": false,
    "ordinary": true
  },
  "ordinaryOpposition": true,
  "ownMinimumsPassed": true,
  "notFlaggedReasons": []
}
```

Sources: [Pushbuild2026 TX official-source returns snapshot](https://raw.githubusercontent.com/pushbuild/us-2026-election-results/73b20975fc0a66da90688d372b4c619609fee9cb/data/tx.csv); [MEDSL 2022 TX official precinct returns](https://raw.githubusercontent.com/MEDSL/2022-elections-official/a8126c5790b8d1f438a3e63c3506cdcdc7406d9f/individual_states/2022-tx-local-precinct-general.zip); [NIST/SEMATECH: exploratory outlier screening (modified z score)](https://itl.nist.gov/div898/handbook/eda/section3/eda35h.htm).

### Moore(48341) — governor / governor-symmetric-party-shift

Unusual shift toward Democrats relative to state peers. Provisional review: this county’s Democratic two-party-share change from 2022 is at least 10 percentage points in absolute size and differs unusually from eligible same-state peers. Swapping Democratic and Republican votes produces the same screen result in the opposite direction. Candidate changes, voting patterns and reporting progress may explain the difference; this is not a fraud or error finding.

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
    },
    "provisional": true,
    "unofficial": true,
    "countingStatus": "counting",
    "resultStatus": "unofficial"
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
    },
    "provisional": false,
    "unofficial": false,
    "countingStatus": null,
    "resultStatus": null
  },
  "seatId": null
}
```

Sources: [Pushbuild2026 TX official-source returns snapshot](https://raw.githubusercontent.com/pushbuild/us-2026-election-results/73b20975fc0a66da90688d372b4c619609fee9cb/data/tx.csv); [MEDSL 2022 TX official precinct returns](https://raw.githubusercontent.com/MEDSL/2022-elections-official/a8126c5790b8d1f438a3e63c3506cdcdc7406d9f/individual_states/2022-tx-local-precinct-general.zip); [NIST/SEMATECH: exploratory outlier screening (modified z score)](https://itl.nist.gov/div898/handbook/eda/section3/eda35h.htm).

### Moore(48341) — governor / governor-symmetric-party-growth

Unusual Democratic vote-count growth with ordinary opposing growth. Provisional review: Democrat counts increased at least 25% and 100 votes, at least 25 percentage points above same-state peer growth, with modified z >3.5 (MAD-zero absolute guard). Opposing-party growth is within |z|≤2, or within 10pp of its peer median when MAD=0. Reporting progress, candidate changes and voting patterns may explain this exploratory result; it is not an error or fraud finding.

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
    },
    "provisional": true,
    "unofficial": true,
    "countingStatus": "counting",
    "resultStatus": "unofficial"
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
    },
    "provisional": false,
    "unofficial": false,
    "countingStatus": null,
    "resultStatus": null
  },
  "seatId": null,
  "screen": "party-count-growth",
  "shareShiftPeer": {
    "peerCount": 221,
    "peerMedian": 8.487797,
    "peerMad": 1.793196,
    "distancePp": 10.758918,
    "modifiedZ": 4.046904,
    "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
    "outside": true
  },
  "parties": {
    "Democrat": {
      "ownGrowthPercent": 177.453027,
      "ownCountIncrease": 850,
      "opposingGrowthPercent": -11.23012,
      "peer": {
        "peerCount": 221,
        "peerMedian": 59.090909,
        "peerMad": 13.501684,
        "distancePp": 118.362118,
        "modifiedZ": 5.912985,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": true,
        "positiveOutlier": true,
        "ordinary": false
      },
      "opposingPeer": {
        "peerCount": 221,
        "peerMedian": -3.442944,
        "peerMad": 4.976196,
        "distancePp": -7.787176,
        "modifiedZ": -1.055515,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": false,
        "positiveOutlier": false,
        "ordinary": true
      },
      "ordinaryOpposition": true,
      "ownMinimumsPassed": true,
      "notFlaggedReasons": []
    },
    "Republican": {
      "ownGrowthPercent": -11.23012,
      "ownCountIncrease": -346,
      "opposingGrowthPercent": 177.453027,
      "peer": {
        "peerCount": 221,
        "peerMedian": -3.442944,
        "peerMad": 4.976196,
        "distancePp": -7.787176,
        "modifiedZ": -1.055515,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": false,
        "positiveOutlier": false,
        "ordinary": true
      },
      "opposingPeer": {
        "peerCount": 221,
        "peerMedian": 59.090909,
        "peerMad": 13.501684,
        "distancePp": 118.362118,
        "modifiedZ": 5.912985,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": true,
        "positiveOutlier": true,
        "ordinary": false
      },
      "ordinaryOpposition": false,
      "ownMinimumsPassed": false,
      "notFlaggedReasons": [
        "Own positive growth is below 25%.",
        "Vote count increase is below 100.",
        "Positive growth does not pass both the 25pp peer-distance and modified-z criteria.",
        "Opposing-party growth is outside its ordinary peer range."
      ]
    }
  },
  "growthParty": "Democrat",
  "ownGrowthPercent": 177.453027,
  "ownCountIncrease": 850,
  "opposingGrowthPercent": -11.23012,
  "peer": {
    "peerCount": 221,
    "peerMedian": 59.090909,
    "peerMad": 13.501684,
    "distancePp": 118.362118,
    "modifiedZ": 5.912985,
    "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
    "outside": true,
    "positiveOutlier": true,
    "ordinary": false
  },
  "opposingPeer": {
    "peerCount": 221,
    "peerMedian": -3.442944,
    "peerMad": 4.976196,
    "distancePp": -7.787176,
    "modifiedZ": -1.055515,
    "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
    "outside": false,
    "positiveOutlier": false,
    "ordinary": true
  },
  "ordinaryOpposition": true,
  "ownMinimumsPassed": true,
  "notFlaggedReasons": []
}
```

Sources: [Pushbuild2026 TX official-source returns snapshot](https://raw.githubusercontent.com/pushbuild/us-2026-election-results/73b20975fc0a66da90688d372b4c619609fee9cb/data/tx.csv); [MEDSL 2022 TX official precinct returns](https://raw.githubusercontent.com/MEDSL/2022-elections-official/a8126c5790b8d1f438a3e63c3506cdcdc7406d9f/individual_states/2022-tx-local-precinct-general.zip); [NIST/SEMATECH: exploratory outlier screening (modified z score)](https://itl.nist.gov/div898/handbook/eda/section3/eda35h.htm).

### Ochiltree(48357) — governor / governor-symmetric-party-growth

Unusual Democratic vote-count growth with ordinary opposing growth. Provisional review: Democrat counts increased at least 25% and 100 votes, at least 25 percentage points above same-state peer growth, with modified z >3.5 (MAD-zero absolute guard). Opposing-party growth is within |z|≤2, or within 10pp of its peer median when MAD=0. Reporting progress, candidate changes and voting patterns may explain this exploratory result; it is not an error or fraud finding.

```json
{
  "office": "governor",
  "currentYear": 2026,
  "baselineYear": 2022,
  "currentDemocratVotes": 515,
  "currentRepublicanVotes": 1790,
  "priorDemocratVotes": 135,
  "priorRepublicanVotes": 1975,
  "democratCountChange": 380,
  "republicanCountChange": -185,
  "democratCountChangePercent": 281.481481,
  "republicanCountChangePercent": -9.367089,
  "currentDemocratTwoPartyShare": 22.342733,
  "priorDemocratTwoPartyShare": 6.398104,
  "democratShareChangePp": 15.944629,
  "republicanShareChangePp": -15.944629,
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
    },
    "provisional": true,
    "unofficial": true,
    "countingStatus": "counting",
    "resultStatus": "unofficial"
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
    },
    "provisional": false,
    "unofficial": false,
    "countingStatus": null,
    "resultStatus": null
  },
  "seatId": null,
  "screen": "party-count-growth",
  "shareShiftPeer": {
    "peerCount": 221,
    "peerMedian": 8.487797,
    "peerMad": 1.793196,
    "distancePp": 7.456832,
    "modifiedZ": 2.804844,
    "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
    "outside": false
  },
  "parties": {
    "Democrat": {
      "ownGrowthPercent": 281.481481,
      "ownCountIncrease": 380,
      "opposingGrowthPercent": -9.367089,
      "peer": {
        "peerCount": 221,
        "peerMedian": 59.090909,
        "peerMad": 13.501684,
        "distancePp": 222.390572,
        "modifiedZ": 11.109906,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": true,
        "positiveOutlier": true,
        "ordinary": false
      },
      "opposingPeer": {
        "peerCount": 221,
        "peerMedian": -3.442944,
        "peerMad": 4.976196,
        "distancePp": -5.924145,
        "modifiedZ": -0.80299,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": false,
        "positiveOutlier": false,
        "ordinary": true
      },
      "ordinaryOpposition": true,
      "ownMinimumsPassed": true,
      "notFlaggedReasons": []
    },
    "Republican": {
      "ownGrowthPercent": -9.367089,
      "ownCountIncrease": -185,
      "opposingGrowthPercent": 281.481481,
      "peer": {
        "peerCount": 221,
        "peerMedian": -3.442944,
        "peerMad": 4.976196,
        "distancePp": -5.924145,
        "modifiedZ": -0.80299,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": false,
        "positiveOutlier": false,
        "ordinary": true
      },
      "opposingPeer": {
        "peerCount": 221,
        "peerMedian": 59.090909,
        "peerMad": 13.501684,
        "distancePp": 222.390572,
        "modifiedZ": 11.109906,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": true,
        "positiveOutlier": true,
        "ordinary": false
      },
      "ordinaryOpposition": false,
      "ownMinimumsPassed": false,
      "notFlaggedReasons": [
        "Own positive growth is below 25%.",
        "Vote count increase is below 100.",
        "Positive growth does not pass both the 25pp peer-distance and modified-z criteria.",
        "Opposing-party growth is outside its ordinary peer range."
      ]
    }
  },
  "growthParty": "Democrat",
  "ownGrowthPercent": 281.481481,
  "ownCountIncrease": 380,
  "opposingGrowthPercent": -9.367089,
  "peer": {
    "peerCount": 221,
    "peerMedian": 59.090909,
    "peerMad": 13.501684,
    "distancePp": 222.390572,
    "modifiedZ": 11.109906,
    "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
    "outside": true,
    "positiveOutlier": true,
    "ordinary": false
  },
  "opposingPeer": {
    "peerCount": 221,
    "peerMedian": -3.442944,
    "peerMad": 4.976196,
    "distancePp": -5.924145,
    "modifiedZ": -0.80299,
    "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
    "outside": false,
    "positiveOutlier": false,
    "ordinary": true
  },
  "ordinaryOpposition": true,
  "ownMinimumsPassed": true,
  "notFlaggedReasons": []
}
```

Sources: [Pushbuild2026 TX official-source returns snapshot](https://raw.githubusercontent.com/pushbuild/us-2026-election-results/73b20975fc0a66da90688d372b4c619609fee9cb/data/tx.csv); [MEDSL 2022 TX official precinct returns](https://raw.githubusercontent.com/MEDSL/2022-elections-official/a8126c5790b8d1f438a3e63c3506cdcdc7406d9f/individual_states/2022-tx-local-precinct-general.zip); [NIST/SEMATECH: exploratory outlier screening (modified z score)](https://itl.nist.gov/div898/handbook/eda/section3/eda35h.htm).

### Parmer(48369) — governor / governor-symmetric-party-growth

Unusual Democratic vote-count growth with ordinary opposing growth. Provisional review: Democrat counts increased at least 25% and 100 votes, at least 25 percentage points above same-state peer growth, with modified z >3.5 (MAD-zero absolute guard). Opposing-party growth is within |z|≤2, or within 10pp of its peer median when MAD=0. Reporting progress, candidate changes and voting patterns may explain this exploratory result; it is not an error or fraud finding.

```json
{
  "office": "governor",
  "currentYear": 2026,
  "baselineYear": 2022,
  "currentDemocratVotes": 509,
  "currentRepublicanVotes": 1433,
  "priorDemocratVotes": 202,
  "priorRepublicanVotes": 1546,
  "democratCountChange": 307,
  "republicanCountChange": -113,
  "democratCountChangePercent": 151.980198,
  "republicanCountChangePercent": -7.309185,
  "currentDemocratTwoPartyShare": 26.210093,
  "priorDemocratTwoPartyShare": 11.556064,
  "democratShareChangePp": 14.654029,
  "republicanShareChangePp": -14.654029,
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
    },
    "provisional": true,
    "unofficial": true,
    "countingStatus": "counting",
    "resultStatus": "unofficial"
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
    },
    "provisional": false,
    "unofficial": false,
    "countingStatus": null,
    "resultStatus": null
  },
  "seatId": null,
  "screen": "party-count-growth",
  "shareShiftPeer": {
    "peerCount": 221,
    "peerMedian": 8.487797,
    "peerMad": 1.793196,
    "distancePp": 6.166231,
    "modifiedZ": 2.319392,
    "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
    "outside": false
  },
  "parties": {
    "Democrat": {
      "ownGrowthPercent": 151.980198,
      "ownCountIncrease": 307,
      "opposingGrowthPercent": -7.309185,
      "peer": {
        "peerCount": 221,
        "peerMedian": 59.090909,
        "peerMad": 13.501684,
        "distancePp": 92.889289,
        "modifiedZ": 4.640445,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": true,
        "positiveOutlier": true,
        "ordinary": false
      },
      "opposingPeer": {
        "peerCount": 221,
        "peerMedian": -3.442944,
        "peerMad": 4.996792,
        "distancePp": -3.866241,
        "modifiedZ": -0.521891,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": false,
        "positiveOutlier": false,
        "ordinary": true
      },
      "ordinaryOpposition": true,
      "ownMinimumsPassed": true,
      "notFlaggedReasons": []
    },
    "Republican": {
      "ownGrowthPercent": -7.309185,
      "ownCountIncrease": -113,
      "opposingGrowthPercent": 151.980198,
      "peer": {
        "peerCount": 221,
        "peerMedian": -3.442944,
        "peerMad": 4.996792,
        "distancePp": -3.866241,
        "modifiedZ": -0.521891,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": false,
        "positiveOutlier": false,
        "ordinary": true
      },
      "opposingPeer": {
        "peerCount": 221,
        "peerMedian": 59.090909,
        "peerMad": 13.501684,
        "distancePp": 92.889289,
        "modifiedZ": 4.640445,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": true,
        "positiveOutlier": true,
        "ordinary": false
      },
      "ordinaryOpposition": false,
      "ownMinimumsPassed": false,
      "notFlaggedReasons": [
        "Own positive growth is below 25%.",
        "Vote count increase is below 100.",
        "Positive growth does not pass both the 25pp peer-distance and modified-z criteria.",
        "Opposing-party growth is outside its ordinary peer range."
      ]
    }
  },
  "growthParty": "Democrat",
  "ownGrowthPercent": 151.980198,
  "ownCountIncrease": 307,
  "opposingGrowthPercent": -7.309185,
  "peer": {
    "peerCount": 221,
    "peerMedian": 59.090909,
    "peerMad": 13.501684,
    "distancePp": 92.889289,
    "modifiedZ": 4.640445,
    "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
    "outside": true,
    "positiveOutlier": true,
    "ordinary": false
  },
  "opposingPeer": {
    "peerCount": 221,
    "peerMedian": -3.442944,
    "peerMad": 4.996792,
    "distancePp": -3.866241,
    "modifiedZ": -0.521891,
    "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
    "outside": false,
    "positiveOutlier": false,
    "ordinary": true
  },
  "ordinaryOpposition": true,
  "ownMinimumsPassed": true,
  "notFlaggedReasons": []
}
```

Sources: [Pushbuild2026 TX official-source returns snapshot](https://raw.githubusercontent.com/pushbuild/us-2026-election-results/73b20975fc0a66da90688d372b4c619609fee9cb/data/tx.csv); [MEDSL 2022 TX official precinct returns](https://raw.githubusercontent.com/MEDSL/2022-elections-official/a8126c5790b8d1f438a3e63c3506cdcdc7406d9f/individual_states/2022-tx-local-precinct-general.zip); [NIST/SEMATECH: exploratory outlier screening (modified z score)](https://itl.nist.gov/div898/handbook/eda/section3/eda35h.htm).

### Yoakum(48501) — governor / governor-symmetric-party-growth

Unusual Democratic vote-count growth with ordinary opposing growth. Provisional review: Democrat counts increased at least 25% and 100 votes, at least 25 percentage points above same-state peer growth, with modified z >3.5 (MAD-zero absolute guard). Opposing-party growth is within |z|≤2, or within 10pp of its peer median when MAD=0. Reporting progress, candidate changes and voting patterns may explain this exploratory result; it is not an error or fraud finding.

```json
{
  "office": "governor",
  "currentYear": 2026,
  "baselineYear": 2022,
  "currentDemocratVotes": 500,
  "currentRepublicanVotes": 1242,
  "priorDemocratVotes": 190,
  "priorRepublicanVotes": 1427,
  "democratCountChange": 310,
  "republicanCountChange": -185,
  "democratCountChangePercent": 163.157895,
  "republicanCountChangePercent": -12.964261,
  "currentDemocratTwoPartyShare": 28.702641,
  "priorDemocratTwoPartyShare": 11.750155,
  "democratShareChangePp": 16.952486,
  "republicanShareChangePp": -16.952486,
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
    },
    "provisional": true,
    "unofficial": true,
    "countingStatus": "counting",
    "resultStatus": "unofficial"
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
    },
    "provisional": false,
    "unofficial": false,
    "countingStatus": null,
    "resultStatus": null
  },
  "seatId": null,
  "screen": "party-count-growth",
  "shareShiftPeer": {
    "peerCount": 221,
    "peerMedian": 8.487797,
    "peerMad": 1.793196,
    "distancePp": 8.464689,
    "modifiedZ": 3.183943,
    "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
    "outside": false
  },
  "parties": {
    "Democrat": {
      "ownGrowthPercent": 163.157895,
      "ownCountIncrease": 310,
      "opposingGrowthPercent": -12.964261,
      "peer": {
        "peerCount": 221,
        "peerMedian": 59.090909,
        "peerMad": 13.501684,
        "distancePp": 104.066986,
        "modifiedZ": 5.198847,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": true,
        "positiveOutlier": true,
        "ordinary": false
      },
      "opposingPeer": {
        "peerCount": 221,
        "peerMedian": -3.442944,
        "peerMad": 4.976196,
        "distancePp": -9.521317,
        "modifiedZ": -1.29057,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": false,
        "positiveOutlier": false,
        "ordinary": true
      },
      "ordinaryOpposition": true,
      "ownMinimumsPassed": true,
      "notFlaggedReasons": []
    },
    "Republican": {
      "ownGrowthPercent": -12.964261,
      "ownCountIncrease": -185,
      "opposingGrowthPercent": 163.157895,
      "peer": {
        "peerCount": 221,
        "peerMedian": -3.442944,
        "peerMad": 4.976196,
        "distancePp": -9.521317,
        "modifiedZ": -1.29057,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": false,
        "positiveOutlier": false,
        "ordinary": true
      },
      "opposingPeer": {
        "peerCount": 221,
        "peerMedian": 59.090909,
        "peerMad": 13.501684,
        "distancePp": 104.066986,
        "modifiedZ": 5.198847,
        "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
        "outside": true,
        "positiveOutlier": true,
        "ordinary": false
      },
      "ordinaryOpposition": false,
      "ownMinimumsPassed": false,
      "notFlaggedReasons": [
        "Own positive growth is below 25%.",
        "Vote count increase is below 100.",
        "Positive growth does not pass both the 25pp peer-distance and modified-z criteria.",
        "Opposing-party growth is outside its ordinary peer range."
      ]
    }
  },
  "growthParty": "Democrat",
  "ownGrowthPercent": 163.157895,
  "ownCountIncrease": 310,
  "opposingGrowthPercent": -12.964261,
  "peer": {
    "peerCount": 221,
    "peerMedian": 59.090909,
    "peerMad": 13.501684,
    "distancePp": 104.066986,
    "modifiedZ": 5.198847,
    "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
    "outside": true,
    "positiveOutlier": true,
    "ordinary": false
  },
  "opposingPeer": {
    "peerCount": 221,
    "peerMedian": -3.442944,
    "peerMad": 4.976196,
    "distancePp": -9.521317,
    "modifiedZ": -1.29057,
    "scoreBasis": "0.6745 × (value − peer median) / peer MAD",
    "outside": false,
    "positiveOutlier": false,
    "ordinary": true
  },
  "ordinaryOpposition": true,
  "ownMinimumsPassed": true,
  "notFlaggedReasons": []
}
```

Sources: [Pushbuild2026 TX official-source returns snapshot](https://raw.githubusercontent.com/pushbuild/us-2026-election-results/73b20975fc0a66da90688d372b4c619609fee9cb/data/tx.csv); [MEDSL 2022 TX official precinct returns](https://raw.githubusercontent.com/MEDSL/2022-elections-official/a8126c5790b8d1f438a3e63c3506cdcdc7406d9f/individual_states/2022-tx-local-precinct-general.zip); [NIST/SEMATECH: exploratory outlier screening (modified z score)](https://itl.nist.gov/div898/handbook/eda/section3/eda35h.htm).

### Zapata(48505) — governor / governor-symmetric-party-shift

Unusual shift toward Democrats relative to state peers. Provisional review: this county’s Democratic two-party-share change from 2022 is at least 10 percentage points in absolute size and differs unusually from eligible same-state peers. Swapping Democratic and Republican votes produces the same screen result in the opposite direction. Candidate changes, voting patterns and reporting progress may explain the difference; this is not a fraud or error finding.

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
    },
    "provisional": true,
    "unofficial": true,
    "countingStatus": "counting",
    "resultStatus": "unofficial"
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
    },
    "provisional": false,
    "unofficial": false,
    "countingStatus": null,
    "resultStatus": null
  },
  "seatId": null
}
```

Sources: [Pushbuild2026 TX official-source returns snapshot](https://raw.githubusercontent.com/pushbuild/us-2026-election-results/73b20975fc0a66da90688d372b4c619609fee9cb/data/tx.csv); [MEDSL 2022 TX official precinct returns](https://raw.githubusercontent.com/MEDSL/2022-elections-official/a8126c5790b8d1f438a3e63c3506cdcdc7406d9f/individual_states/2022-tx-local-precinct-general.zip); [NIST/SEMATECH: exploratory outlier screening (modified z score)](https://itl.nist.gov/div898/handbook/eda/section3/eda35h.htm).

## Reproduction

Run `node scripts/build-2026-anomalies.mjs` and `node scripts/verify-2026-anomalies.mjs`. All inputs are existing immutable local snapshots merged with `COUNTY_SOURCES`/`mergeElectionData`, retaining precedence and holds. No network/provider/paid API call occurs. `public/data/anomalies-2026.json` records every atlas county, input hashes, criteria, qualification contracts, selected source IDs/times, assessed evidence and non-assessment reasons. No absence becomes zero, no Other votes become a party, and no finding is forced. Identical inputs yield deterministic JSON and both identical report copies.
