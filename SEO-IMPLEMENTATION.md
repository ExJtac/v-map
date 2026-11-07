# Crawlable V-Map documentation

Current status update — November 6, 2026: primary origin is `https://voteranomaly.com/`, with preserved CAS-TX mount. The latest public sitemap has **five** HTML URLs: map, winners, about, methodology and coverage. The new winners page is a separate Vite entry whose candidate cards are currently client-rendered; the three explanatory documentation pages retain substantive initial HTML. See `SEO-AI-GROWTH-PLAN.md` for the new read-only audit, primary-domain canonical-consolidation recommendation and current Google Search generative AI controls/reporting. Older observations below are explicitly historical implementation evidence, not a fresh indexing or performance claim.

Added a deterministic static generator, `scripts/build-seo-pages.mjs`, and five public outputs:

- `/vmap/about/`: project purpose, supported offices, historical range, source limits, open-source contribution and support links.
- `/vmap/methodology/`: source reconciliation, held records, the five schema3 own-history review screens, qualified scope, ballot/race-vote distinctions and source references.
- `/vmap/coverage/`: all imported office/year combinations, current2026 source presence, qualified comparison counts and geographic limitations.
- `/vmap/sitemap.xml`: five canonical HTML URLs in the current release: the app, `/winners/` and the three pages above. The CAS-TX variant currently self-canonicalizes separately; see the primary-domain consolidation finding in the growth plan.
- `/vmap/llms.txt`: explanatory navigation and limitations, explicitly not a Google/Gemini ranking requirement or submission mechanism.

Pages contain substantive initial HTML, normal crawlable links, unique titles/descriptions, self-canonicals, truthful WebPage metadata and self-contained responsive CSS. They require no client JavaScript or external fonts. No ratings, images, separate county routes or unsupported nationwide-coverage claims are generated.

## Build order

Root owns package/build integration. Run these after source imports/registration and before Vite copies `public/`:

```sh
node scripts/build-coverage-report.mjs
node scripts/build-2026-anomalies.mjs
node scripts/build-winners.mjs
node scripts/build-seo-pages.mjs
node scripts/build-seo-pages.mjs --check
```

The generator checks that coverage source registration matches `COUNTY_SOURCES`, current-status counts match coverage, every recorded anomaly input hash still matches its file, the report uses schema3, and the documented verified House scopes remain Montana and Arizona. Changed qualified scopes require updating the methodology copy rather than silently publishing stale claims. No current wall-clock timestamp enters the outputs. Identical inputs produce byte-identical pages, XML and text.

## Verified local snapshot

Current November 6 release: 13 registered source bundles; 50 imported office/year combinations. Current source presence: Senate 1,570 map counties / 20 states with county returns; House 1,801 map counties / 28 states; Governor 1,230 map counties / 18 states. Presence includes held records and is not qualified comparison or national completeness.

Qualified own-history union: Senate873assessed/661flagged; House67/19; Governor1,080/495. Actual-ballot/resident screen58assessed/22flagged. All2026findings are provisional review prompts, not fraud/error determinations or certified outcomes.

## Historical implementation checks

The original four-URL checks below describe the earlier release. The current read-only HTML/XML audit verified five exact sitemap URLs per origin, HTTP 200 and one H1/self-canonical for each sampled page, and no X-Robots exclusion. Receipt: `/tmp/vmap-seo-public-audit-20261106.json`. It also confirmed the alternate-host self-canonical conflict and absence of candidate cards in the winners page initial HTML.

- Generator then `--check`: passed, including exact deterministic output equality and all upstream freshness assertions. Raw logs: `/tmp/vmap-seo-generate.log` and `/tmp/vmap-seo-check.log`.
- Independent Python XML/HTML parser: four exact sitemap URLs, one H1 and self-canonical per page, parseable WebPage JSON-LD, and every local linked file/page target exists.
- Generator checks: no executable external script, image, rating markup, `noindex`, malformed placeholder or noncanonical relative link.

This subagent did not modify root metadata, robots policy, server configuration, package scripts or anomaly files. It did not deploy, inspect authenticated Search Console, request indexing or establish Google/Gemini inclusion. Root must verify actual production responses and perform any authorized Search Console submission. Follow the separate `SEO-INDEXING-AUDIT.md` for the observed public-site and official Google documentation findings.
