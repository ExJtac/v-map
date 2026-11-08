# Research publication status

## Current prepared checkpoint — November 7, 2026

The generated research inventory now contains **1,219 House counties screened / 357 flagged**, and **1,563 Senate counties screened / 1,111 flagged**. Party-count comparisons cover 1,116 House counties (230 flags) and 1,294 Senate counties (90 flags). Of the Senate flags, 823 involve only race votes per resident; the 2020 presidential-year baseline versus the 2026 midterm limits interpretation. Those are race-vote proxies, never ballots or eligible-voter turnout.

New paired House sources now include Iowa, North Carolina, South Carolina and Vermont, plus qualified parts of Washington and Florida. The sixth batch adds 76 comparisons: 14 Vermont and 62 Florida. Florida retains five paired county holds, 63 historical/65 current single-year county facts, and a statewide aggregate hold for the 27-of-28 numeric district scope. Vermont overvotes and blanks are excluded from candidate/write-in totals based on actual source labels; literal write-in choices are retained. Washington current facts cover all 39 counties; seven historical CD3 counties and its old district summary remain held after an amended certification without county allocations. South Carolina accounting columns are retained separately from candidate votes. Delaware adds three Senate county returns. Approved New Mexico 2022, Delaware 2026 and Kentucky 2026 House facts can appear without a qualified historical comparison. Ohio's state metadata supplement preserves all original counts and clocks. Exact normalized files, scope inventories, source-selection pins and independent approvals remain versioned; raw research stays outside Git.

The saved Pennsylvania 2026 source is temporarily held for Governor and House production-status review: current official feeds explicitly carry a Testing label. Original counts remain unchanged and their earlier exact feed lineage is unproven. Eighteen reported leaders are withheld; the directory now has 319 leaders / 32 held or tied records. This is a source-quality decision, not a numerical anomaly or completed investigation.

This checkpoint is generated source, not a deployment receipt. Verify the matching public research-progress artifact and immutable-release receipt before reporting a production publication. Nationwide completion is **not** claimed: 1,922 House and 908 Senate reference-map units within their election scopes remain unassessed. Source context remains six cases / eight items, with zero completed investigations. Numerical flags never establish wrongdoing. The schedule remains paused; manual checks and publications only.

## Archived November 6 publication audit

This is a bounded publication audit, not a claim that every U.S. county or election has been researched or imported.

## Already deployed before this release

An exact SHA-256 audit compared **169 tracked static data files** from the previously committed source revision with both active Vultr artifact trees: `/var/www/voteranomaly` and `/var/www/vmap`. **169 of 169 matched on each host, with no missing or different files.** The dynamic research-status receipt was deliberately excluded. The machine-readable audit receipt is retained locally at `/tmp/vmap-research-live-artifact-audit.json`.

This includes the registered Arizona House 2022/2026 supplement, Alabama/Nebraska Senate current supplement, historical source bundles, population, ballots, generated coverage and generated pattern-review evidence. Their public presence does not mean every record qualifies for a historical comparison.

| 2026 office | Imported county contests / portions | Unique reference-map counties | States with county returns | Qualified office comparisons | Office-only flagged counties |
|---|---:|---:|---:|---:|---:|
| Governor | 1,230 | 1,230 | 18 | 1,080 | 495 |
| U.S. Senate | 1,570 | 1,570 | 20 | 873 | 661 |
| U.S. House | 2,127 | 1,768 | 27 | 67 | 19 |

These are the pre-release generated counts. The browser's border/list union also includes qualified actual-ballot participation flags: that union was Governor 496, Senate 683, House 41. There are no 2026 presidential general-election results. House means U.S. House of Representatives; “congress” is not a separate fifth office.

Senate and House review flags already exist in the audit. Showing only Governor flags is therefore a selection/discoverability issue, not evidence that the other two audit layers are empty. Changing office must switch both the results and the selected-office review list/borders; the 2026 layer is required for current review borders.

## New eligible current batch prepared for this release

`public/data/research-house-nm/` contains a separate **current-only New Mexico House supplement**: 43 actual county-district portions across 33 counties and three district summaries. All known candidate counts are integral and retain their original parties. One Chaves CD2 candidate count remains source-suppressed and held. Five candidate sum controls pass exactly; the sixth is withheld because of suppression. Every 2026 row remains provisional and unconfirmed complete.

The new bundle is independently replayed from five retained official source snapshots. The second rebuild is byte-identical. Integration at priority 130 adds 46 current records without duplicates or changing any existing result. The resulting House inventory is expected to be 2,464 total records, 2,170 county portions, 1,801 unique reference-map counties and 28 states with county returns. Root regenerates the authoritative coverage report after registration.

All existing 2022 New Mexico numeric baselines and frozen Arizona output files remain byte-for-byte unchanged. New Mexico whole-county anomaly qualification remains withheld pending a separately reviewed historical scope contract. Adding current returns alone does not authorize new anomaly borders.

The importer also corrects a staging-only party-label parser defect: source `Democrat` is explicitly recognized and checked against source `DEM`. The older combined NM staging output is not blindly published.

## Held and missing work

The only directory named staging found under retained source data is the earlier combined `research-house/nm-staging` batch. Its 2022 primary API has 20 suppressed candidate cells across 19 portions. Those held rows remain unpublished so they cannot overwrite usable numeric historical evidence. The new current-only supplement takes the eligible 2026 batch through a separate parser and explicit source controls.

Other coverage gaps remain. The prior [House/Senate gap inventory](HOUSE-SENATE-COVERAGE-GAPS.md) identifies broader acquisition and comparability work. Senate 2020 Texas/Idaho/Michigan source holds and unqualified House county/district scope cannot be bypassed merely to draw additional borders. Nebraska's current official ballot has no Democratic nominee; other affiliations stay Other. Alaska election-district data are not allocated to counties. Missing and held data are never normal results or zero votes.

All approved normalized research should be deployed in both root and CAS-TX build variants. Raw downloads, source holds, failed probes and unreviewed staging data should not be represented as approved public results. No paid model/API calls, source credentials or political outreach were used in this audit.
