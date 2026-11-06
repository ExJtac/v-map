# California 2026 reported results

Direct public California Secretary of State feeds were retrieved November 6, 2026. They are dated **unofficial reported returns**, with no race call, final turnout, or certification inferred.

- [Election media index](https://media.sos.ca.gov/) and its [published endpoint catalog](https://media.sos.ca.gov/media/json-endpoints.csv) identify the November 3, 2026 election.
- [Governor JSON](https://media.sos.ca.gov/media/governor.json): 58 county results plus one independent statewide result.
- [U.S. House JSON](https://media.sos.ca.gov/media/us-rep.json): 144 county–district portions plus 52 independent district results. All 58 counties are represented.

The original `ReportingTime`, reported precinct counts, party labels, names, vote counts, and source percentages are preserved. Precinct reporting is distinct from ballot completion and certification. No Presidential or California Senate contest is manufactured for 2026.

## Validation and preservation

`scripts/import-current-california.py` checks nonnegative integer votes, exact county FIPS joins against the Census registry, unique geographic contests, published percentage rounding, and candidate-by-candidate county sums against the independent state/district records. All checks pass for 255 geographic records and 510 candidate entries. Raw feed files and source SHA-256/retrieval receipts live under `scripts/source-data/current-california/`.

An offline rebuild preserves the recorded retrieval time; touching or copying a raw file does not make it appear newly downloaded. Explicit `--download` refreshes public source snapshots and retains previous raw contents in an archive. The generic public endpoints describe the current California election, so inspect the published election-year catalog before using that option for a later election.

```sh
python3 scripts/import-current-california.py
```

The runtime gives these direct official-publisher snapshots precedence over a republished 2026 snapshot for the same California contest. Original snapshots remain intact, and alternate source references are retained. Publisher authority does not turn unofficial counts into a certified result.
