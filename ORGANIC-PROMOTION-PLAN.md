# V-Map organic launch plan

Working window: November 6–12, 2026, Mountain time. Primary address: https://voteranomaly.com/. This is an execution plan and draft copy, not a record of posts, outreach, traffic, donations or continuous agents already running. No external messages, subscriptions or posts were sent while preparing it. No advertising spend is proposed.

The immediate objective is to help people successfully explore a county, check its sources and return or share a useful view. Financial support is a secondary outcome of that usefulness. Promote V-Map as an open-source election-history explorer with explicit limits; the domain name does not turn a statistical review flag into a fraud finding.

## Publish before distributing

| Priority | Deliverable | Owner | Completion evidence |
| --- | --- | --- | --- |
| P0 | CAS-TX project links point to the primary domain; every app/research release reaches that domain | Root integration | Live link, release SHA and matching artifact hashes |
| P0 | Repair page/map scrolling, selected-county visibility and light state fills | Root integration | Desktop/mobile interaction checks, including moving back up the page |
| P0 | Explicit logo social image, not the Bitcoin QR | Root integration | Public PNG responds 200; absolute `og:image` and `twitter:image` match it; a fresh share renders the logo |
| P0 | Office selectors make Governor, Senate and House reviews discoverable; available/held comparisons are clear | Root integration + research_coverage_release | Per-office counts, real county examples and explicit missing-data states |
| P0 | Qualified statistical graphs describe their denominator, comparison cohort and provisional status | statistics_graphs + Root | Math checks and independent visual/data review |
| P1 | Add useful share/copy controls, source-linked captions and a concise contributor kit | Root integration | Shared URL opens the intended supported context; cancellation does not count as a completed share |
| P1 | Instrument the useful actions below and establish a real baseline | Root integration + James | GA DebugView/Realtime receipt and a dated baseline export |

Existing evidence from the preceding domain launch: Search Console ownership was verified, its sitemap was accepted with four discovered pages, and indexing was requested. This is not evidence of indexing, rankings, ongoing traffic or Gemini inclusion. Recheck the current Search Console property rather than submitting the same request repeatedly. Google says discovery can use crawlable links and sitemaps and does not guarantee inclusion. [Google Search Essentials](https://developers.google.com/search/docs/essentials), [How Search works](https://developers.google.com/search/docs/fundamentals/how-search-works).

## Audience and useful angle

| Audience | Useful reason to visit | Best first asset | What to ask for |
| --- | --- | --- | --- |
| Local readers and community groups | Find their county and distinguish candidate votes from ballots/population | One county walkthrough with election office/year and source links | Try their county; report a missing source |
| Local reporters and data journalists | Trace a reported change to its original return and see comparison limits | One reproducible county example plus methodology/coverage links | Technical feedback or a relevant source correction |
| Civic educators and librarians | Teach how elections, denominators and historical comparisons differ | A short illustrated “how to read this map” guide | A resource link or classroom feedback |
| Open-source/data developers | Inspect code, importers, coverage gaps and accessible graphics | Public repository, one scoped contribution issue | One reproducible improvement or source-backed PR |
| Supporters | Keep the research and platform available | Clear support section after the tool proves useful | Optional contribution; never access-gated results |

Google's official guidance favors useful content built for a real audience, clear descriptive text, good experience and crawlable links. These are reasons to publish original source walkthroughs, not mass-generated county SEO pages. Do not invent fresh dates, citations or analyses to produce more indexed URLs. [People-first content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).

## Seven-day schedule

| Day | Human-led action | Team preparation | Intended evidence |
| --- | --- | --- | --- |
| Fri Nov 6 | James reviews the repaired live experience and the public share kit; chooses one first channel | Root ships P0 fixes; research verifies one useful example; statistics documents what its measures mean | One clean mobile/desktop walkthrough, live metadata, baseline GA counts |
| Sat Nov 7 | James shares one short demo on an account he controls, after reviewing the final copy | Prepare a 30–45 second walkthrough: select office → county → results → source → historical graph | One attributable link, actual comments and useful-action counts |
| Sun Nov 8 | James answers questions and reviews one local community's current rules before any post | Research prepares two clearly sourced examples, including one unflagged comparison and one unavailable comparison | Corrections resolved; moderation permission or documented posting rule |
| Mon Nov 9 | James may send up to three individually relevant tool pitches after explicitly approving recipients/copy | Draft a short local-data pitch with coverage limits and no allegation; verify support links after Lightning expiry | Actual replies/resource links; on-chain support still works |
| Tue Nov 10 | James may submit one Show HN if the tool is ready and he can remain available to discuss it | Developer-focused explanation, source provenance, screenshots and known limits | Constructive feedback and engaged map sessions, not requested votes |
| Wed Nov 11 | James or a human researcher may discuss the methodology with an appropriate educator/data group | Publish one original methods walkthrough with reproducible values and a correction history | One useful discussion, source contribution or teaching/resource link |
| Thu Nov 12 | James reviews results and chooses the next useful audience/content item | Root compiles the funnel; research lists newly published/held coverage; statistics lists unresolved assumptions | Dated seven-day review with actual counts, problems and next priorities |

All external sends/posts remain drafts until James chooses and authorizes the specific action. Avoid bulk outreach, repeated cross-posting, unsolicited direct-message campaigns, purchased engagement and coordinated voting. Recheck channel rules immediately before posting; rules and local community expectations change.

## Channels and current constraints

- **Owned accounts first:** one honest demonstration on James's own social channels or a CAS-TX project update. The current task prepares the material; no account posting has occurred.
- **Show HN:** a working map can be tried without registration, which fits the format. The maker should be available to discuss implementation. The official rules reject fundraiser/landing-page submissions and requests for friends to upvote or comment. Keep the post about the usable tool and feedback, not a donation appeal. [Show HN guidelines](https://news.ycombinator.com/showhn.html).
- **Reddit:** choose a genuinely relevant community only after reading its current rules and, where necessary, asking moderators. There is no universal permission or universal “10% rule.” Reddit explains that communities handle promotional material differently. Do not post the same link across local communities or imply moderator endorsement. [Reddit's explanation of community spam controls](https://support.reddithelp.com/hc/en-us/articles/28012014962580-How-do-I-keep-spam-out-of-my-community).
- **Data-journalism community:** NICAR-L is a relevant forum for methodological feedback. IRE explicitly bans AI bots from posting to its listservs; any participation must be by a human following the list's rules, not an automation. No subscription or email has been sent. [IRE listserv policy](https://www.ire.org/resources/listservs/).
- **A concrete newsroom target:** The Texas Tribune accepts story pitches through `pitches@texastribune.org`; its general contact page is the source. A relevant, individually reviewed tool/methods pitch is appropriate to consider, with no assumption of interest or endorsement. Do not use its confidential-tip channel for promotion. [Tribune contact page](https://www.texastribune.org/contact/), [confidential-tip channel limits](https://www.texastribune.org/tips/).
- **Educators/libraries:** select an identifiable local institution and its public resource-suggestion/contact channel before drafting an individual message. No institutions have agreed to partner; do not name imaginary partners or add this to their pages without permission.

## Measurement and honest attribution

Use the existing GA4 tag. Define the following events; these are implementation recommendations until live receipts are observed. Google's recommended `share` event supports `method`, `content_type` and `item_id`. Custom events can measure the remaining actions. [GA event reference](https://developers.google.com/analytics/devguides/collection/ga4/reference/events), [event setup](https://developers.google.com/analytics/devguides/collection/ga4/events).

| Event | Fire only when | Suggested low-cardinality context | Meaning |
| --- | --- | --- | --- |
| `select_county` | A user completes county selection | office, year, state | Useful exploration; not an unique person count |
| `view_county_results` | Selected results are actually shown | office, year, state | Reached the useful answer, separate from merely clicking |
| `view_history` | Historical chart/table becomes visible | office, year | History reached |
| `source_open` | User activates an original-source link | office, year, source family | Verification interest |
| `share` | Native share resolves successfully or copy succeeds | method, content_type=`election_map`, item_id | Sharing intent/completion; not confirmed recipient visits |
| `support_open` | User activates support navigation/wallet action | placement, method | Support intent; not money received |
| `payment_request_copy` | Clipboard write succeeds | placement | Copy succeeded; not settlement |
| `contribute_open` | GitHub contribution link activated | placement | Contribution interest; not a submitted PR |

Do not send wallet invoices, payment addresses, email addresses, search text, visitor identity or private data as custom event parameters. Count QR impressions/clicks only as exposure/intent. The app does not verify payment settlement, so it must not synthesize `donation_received`, revenue, donor count or conversion amounts from clicks. If James later reconciles actual receipts, report that separately with the payment provider's evidence.

Use lowercase, stable campaign labels: `utm_campaign=vmap_launch_2026`, a single source per platform, `utm_medium=organic_social`, `referral`, or `email` as appropriate, and a meaningful `utm_content` such as `county_walkthrough_01`. Do not attach UTM parameters to internal navigation. Never put personal recipient names or sensitive information in public tracking URLs. Google's campaign guidance recommends consistent source/medium/campaign fields. [GA campaign URL guide](https://support.google.com/analytics/answer/10917952?hl=en).

Example owned-channel link:
`https://voteranomaly.com/?utm_source=cas_tx&utm_medium=referral&utm_campaign=vmap_launch_2026&utm_content=project_page`

Use GA Traffic acquisition for source/medium/campaign, then compare actual meaningful actions per session. Search Console reports search impressions/clicks/indexing separately; a sitemap success is not a visit. Establish the first 24-hour baseline before choosing a numeric traffic or donation target. For the first week, operational targets are one useful demo, up to three individually relevant human-approved pitches, every substantive correction acknowledged, and a clear seven-day funnel report. These are work targets, not promised audience or donation forecasts.

Report sessions, engaged sessions, sessions reaching results/history, share completions, source opens and support intentions, including denominators. Do not add overlapping event counts and call them unique people. Avoid ranking channels from tiny samples; document the date range and uncertainty. If support interest is low but results engagement is strong, test one clearer support explanation rather than increasing fear-based claims or the QR's prominence.

## Donation wording and reusable assets

Recommended CTA: **Support the research and platform.** Secondary sentence: “Help us verify public sources, fill coverage gaps and keep V-Map available to everyone.” Donations do not influence review thresholds or conclusions. Do not imply a tax deduction, nonprofit status, endorsement, payment verification or guaranteed publication unless separately established.

The supplied QR is a Bitcoin request with an optional Lightning invoice expiring November 9, 2026; the app retains the on-chain address afterward. Do not put the payment QR in the site's social preview, post a stale Lightning-only link, or frame a contribution as buying proof of a conclusion. Use the regular support page so current payment options and status are visible.

Public, reviewed draft copy is in `public/PROMOTION-KIT.md`. Optional vector share art is in `public/share/logo-preview.svg`, derived from the existing V-Map favicon mark. Root should rasterize it to PNG for social-preview compatibility and add explicit absolute Open Graph/Twitter image metadata. Metadata should include image alt text, dimensions and MIME type. Open Graph defines these image fields; clients can cache previews, so a corrected tag does not instantly replace every old shared thumbnail. [Open Graph protocol](https://ogp.me/).

This plan is frozen for root integration. No social outreach worker, human publishing schedule or paid AI process has been installed by this document.
