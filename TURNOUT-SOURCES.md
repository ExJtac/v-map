# Reported county ballots cast

Imported November 6, 2026 from the California Secretary of State's [2026 election media feed](https://media.sos.ca.gov/). This is an unofficial snapshot, separate from candidate vote totals. It is not a live polling service or final turnout figure.

`scripts/import-turnout.py` parses county reporting-status **A messages** from [V26GG.txt](https://media.sos.ca.gov/media/V26GG.txt), using the official [ASCII data-feed guide, pages 5–8](https://cms.cdn.sos.ca.gov/media/2-ascii-file-format-v9.pdf). The guide defines the Voter Turnout field as ballots cast. County names from [S26GG.txt](https://media.sos.ca.gov/media/S26GG.txt) join exactly to the retained Census Gazetteer; California's sequential county codes are not mistaken for FIPS codes.

All 58 counties are present. Their reported ballots, registered voters, precincts reporting, and total precincts each sum exactly to the statewide A-message control. The retained snapshot reports **9,027,710 ballots cast statewide**. Los Angeles reports **2,617,572 ballots cast**, distinct from its Governor candidate-vote total of 2,560,939 in the separately retained contest snapshot.

The card shows countywide ballots once for the matching regular November 2026 election, with the source's county update time and unofficial label. It never adds ballots across offices or House district portions. No ballot figure is inferred where a participation source is missing. “Reported votes for [office]” remains the contest-specific total and can differ because of blank selections, write-ins, source coverage, or snapshot timing.

Precinct reporting is not evidence that every ballot is counted or that results are certified. The source guide includes historical illustrative certification dates; V-Map does not apply those dates to 2026.

Raw files, format guide, retrieval receipts, and hashes: `scripts/source-data/turnout/`. Public output and reconciliation controls: `public/data/turnout/`.
