# Crawlable V-Map documentation

Added a deterministic static generator, `scripts/build-seo-pages.mjs`, and five public outputs:

- `/vmap/about/`: project purpose, supported offices, historical range, source limits, open-source contribution and support links.
- `/vmap/methodology/`: source reconciliation, held records, the five schema3 own-history review screens, qualified scope, ballot/race-vote distinctions and source references.
- `/vmap/coverage/`: all imported office/year combinations, current2026 source presence, qualified comparison counts and geographic limitations.
- `/vmap/sitemap.xml`: exactly four real canonical HTML URLs: the app and the three pages above.
- `/vmap/llms.txt`: explanatory navigation and limitations, explicitly not a Google/Gemini ranking requirement or submission mechanism.

Pages contain substantive initial HTML, normal crawlable links, unique titles/descriptions, self-canonicals, truthful WebPage metadata and self-contained responsive CSS. They require no client JavaScript or external fonts. No ratings, images, separate county routes or unsupported nationwide-coverage claims are generated.

## Build order

Root owns package/build integration. Run these after source imports/registration and before Vite copies `public/`:

```sh
node scripts/build-coverage-report.mjs
node scripts/build-2026-anomalies.mjs
node scripts/build-seo-pages.mjs
node scripts/build-seo-pages.mjs --check
```

The generator checks that coverage source registration matches `COUNTY_SOURCES`, current-status counts match coverage, every recorded anomaly input hash still matches its file, the report uses schema3, and the documented verified House scopes remain Montana and Arizona. Changed qualified scopes require updating the methodology copy rather than silently publishing stale claims. No current wall-clock timestamp enters the outputs. Identical inputs produce byte-identical pages, XML and text.

## Verified local snapshot

November6,2026:12registered source bundles;50imported office/year combinations. Current source presence: Senate1,570map counties/20states with county returns; House1,768map counties/27states; Governor1,230map counties/18states. Presence includes held records and is not qualified comparison or national completeness.

Qualified own-history union: Senate873assessed/661flagged; House67/19; Governor1,080/495. Actual-ballot/resident screen58assessed/22flagged. All2026findings are provisional review prompts, not fraud/error determinations or certified outcomes.

## Checks run

- Generator then `--check`: passed, including exact deterministic output equality and all upstream freshness assertions. Raw logs: `/tmp/vmap-seo-generate.log` and `/tmp/vmap-seo-check.log`.
- Independent Python XML/HTML parser: four exact sitemap URLs, one H1 and self-canonical per page, parseable WebPage JSON-LD, and every local linked file/page target exists.
- Generator checks: no executable external script, image, rating markup, `noindex`, malformed placeholder or noncanonical relative link.

This subagent did not modify root metadata, robots policy, server configuration, package scripts or anomaly files. It did not deploy, inspect authenticated Search Console, request indexing or establish Google/Gemini inclusion. Root must verify actual production responses and perform any authorized Search Console submission. Follow the separate `SEO-INDEXING-AUDIT.md` for the observed public-site and official Google documentation findings.
