# Vermont current 2026 governor county returns

This bounded addition reuses the already saved House research feed bytes. It performs no network fetch and adds no South Dakota records: Scout's `modern-counties` importer already provides South Dakota 2026 Governor.

Run `python3 scripts/import-current-governors.py` to rebuild offline. It verifies the three retained raw-file SHA-256 pins in `scripts/source-data/current-governors/provenance.json` before parsing. Published files are `public/data/current-governors/manifest.json` and `governor-2026.json`.

The official Vermont Secretary of State metadata explicitly reports `isOfficial=false`. Every result has `resultStatus="unofficial"`, `unofficial=true`, `provisional=true`, and `certified=false`. Source count update is **November 6, 2026, 2:18 PM Eastern**, retained as `2026-11-06T14:18:00-05:00`. The statewide results filename is supplied explicitly by `general.stateWide.path`, not guessed. The results snapshot's retrieval time uses its original saved download file modification time, `2026-11-06T19:19:39.588169+00:00`; the exact HTTP completion time was not separately logged. The general metadata has its original research retrieval timestamp and SHA. This is a static snapshot, not continuous monitoring.

The importer selects office ID 5, `GOVERNOR`, vote-for-one, and consumes 283 unique `(townId, repDistrict, senateDistrict)` reporting portions across 247 town IDs. Every town ID resolves to exactly one county in the same official metadata's `townDistricts` registry. Exact county names then resolve against the independent Census 2018 county Gazetteer; no fuzzy names, geographic allocation, or assumed precinct ownership is used. Fourteen counties and one separate statewide row are present. County presence does not assert certification or that every town has completed reporting.

Ballot candidate party labels are preserved verbatim. `REPUBLICAN` maps to Republican; `DEM/PROG` maps to Democrat; `PEACE AND JUSTICE`, `INDEPENDENT`, and `FREEDOM AND UNITY` map to Other. Five ballot candidates remain separate by source candidate ID. Source write-in entries, including repeated names with distinct IDs and labels such as BLANK, remain reporting categories without assuming identity or eligibility. Raw `sv` and `bv` fields also remain reporting categories named verbatim; their semantics are not guessed. No source winner flags are promoted to certified winners.

Checks passed:

- Three raw SHA-256 pins; explicit election ID 7100 and unofficial metadata; exact office selection.
- Unique reporting portion keys, unambiguous town ID/county ownership, all 14 independent Census county FIPS, no missing-as-zero conversion.
- Each portion's `rc + wc + sv + bv = sc` and every integer/nonnegative vote count.
- All 116 source candidate/reporting-category ID controls reconcile county sums to the explicitly supplied statewide row.
- Total source count **311,510** = **308,651** ballot-candidate votes + **2,859** reporting-category entries. County totals sum exactly to the statewide row. These are source vote-entry totals, not asserted turnout.
- Repeat offline rebuild produces byte-identical output and validation files.

Detailed controls are retained in `scripts/source-data/current-governors/validation.json`. No shared UI, package, build, or other importer files were changed. Other states remain outside this package; current 2026 results elsewhere are not declared absent.

The integrated county card excludes the undefined `sv`/`bv` fields from its **Candidate / write-in votes** figure: **309,055 statewide**. It separately labels the source-reported contest total of **311,510** and explains the extra unclassified reporting fields. Neither figure is presented as a sourced count of individual voters or ballots cast.
