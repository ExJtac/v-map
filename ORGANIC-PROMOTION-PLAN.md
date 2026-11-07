# V-Map organic distribution plan

Prepared November 6, 2026, Mountain time. Launch week: **November 7–13**. Thirty-day review: **December 6**. Primary address: https://voteranomaly.com/; candidate directory: https://voteranomaly.com/winners/.

This replaces the earlier November 6–12 launch draft. It is a plan and draft copy, not a record of outreach, posts, partnerships, traffic or donations. No external messages, subscriptions or posts were sent while preparing it. The research schedule remains **PAUSED**; all work below is manual. Role names are proposed work owners, not continuously running agents.

The advertising and new marketing-tool budget is **$0**. Use existing accounts, the public repository, existing Analytics/Search Console, and ordinary phone/screen-recording tools. Staff time, existing hosting and assistant usage still have costs; none have been measured here. Do not buy ads, backlinks, contact lists, engagement, memberships or new software to execute this plan.

## Start with what is already useful

The promise is a free, open-source way to explore available election returns, follow original sources and understand historical comparisons. It is not a fraud detector or a national race-calling service. Lead with a short demonstration and one reproducible answer; offer support after the tool has helped someone.

Confirmed in source `5ab2e78` and read-only public checks on November 6:

| Deliverable | Observed state | Evidence / next action |
| --- | --- | --- |
| Primary address and distribution link | Root map and `/winners/` return HTTP 200; main header links to the directory | Share the primary domain. Preserve the existing CAS-TX mount. |
| Mobile map | Cooperative two-finger zoom and one-finger page scrolling shipped | Root's release evidence records phone-emulation touch tests. Record one short public-facing walkthrough; do not claim physical-device testing not performed. |
| County results, office review shortcuts and graphs | Shipped with explicit source/coverage limits | Use one source-verified example, not a sensational screenshot. |
| Candidate directory | 2026 snapshot: 330 provisional reported leaders, eight held/unavailable races, 338 imported contests; 2006–2026 year selector | Label the office/year and provisional status. These counts are dated, not a completeness or confirmed-winner claim. |
| Share thumbnail | Root and directory HTML specify the V-Map logo image | Use the versioned logo asset; old message previews may be cached. |
| Share and support interactions | `share` and `support_engagement` events implemented in `src/main.js` | Verify actual GA receipts before reporting counts; see measurement section. |
| Search Console | Prior ownership/sitemap/index-request receipts are recorded in the release handoff | The current sitemap has five URLs. Do not repeat an old four-page result as current discovery, indexing or ranking evidence. SEO owner should recheck the property. |

Public checks found the existing GA measurement tag on both pages. No authenticated Analytics report, traffic baseline, conversion total, donation receipt or current index-position report was inspected for this plan.

## Audience, asset and useful next step

| Audience | Asset to prepare | Useful request | Avoid |
| --- | --- | --- | --- |
| Local readers | A 30–45 second county walkthrough with office/year/source visible | Try their county and report an authoritative missing source | Party-targeted persuasion, claims a border proves wrongdoing |
| Local/data reporters | One reproducible local example, methodology, coverage and correction links | Ask whether the tool is useful for source checking | Mass pitches, a prewritten allegation, implied newsroom endorsement |
| Educators and libraries | A one-page guide: candidate votes versus ballots versus population; one historical graph | Resource-list consideration or teaching feedback | Unverified institutional affiliations or paid directory placements |
| Open-source developers | A small, reproducible coverage/accessibility issue and contribution instructions | A source-backed correction or focused pull request | Spamming unrelated repositories or asking for stars as proof of quality |
| Interested supporters | A brief explanation of the work and optional support link | Help maintain public access and verify sources | Access-gating results or implying tax-deductibility/guaranteed findings |

Choose audiences because the tool is useful to their work, not because of inferred political preferences. The new candidate-research project needs a separately reviewed publishing process; do not promote unverified personal allegations as acquisition material.

## Distribution order and channel rules

1. **Owned channels first.** James can choose one existing account and review one honest demonstration. The CAS-TX project page already links to V-Map; prepare a small project update rather than duplicating a large campaign across accounts. Answer questions before posting another promotion.
2. **One relevant community.** Read its current rules and choose a single useful local or technical discussion. Reddit permits communities to set their own promotion policies; there is no universal permission or platform-wide “10% allowance.” Repeated similar posts, unwanted messages and promotion bots are spam risks. No mass cross-posting or unsolicited message campaign. [Official Reddit guidance](https://support.reddithelp.com/hc/en-us/articles/28012014962580-How-do-I-keep-spam-out-of-my-community).
3. **Individually relevant earned coverage.** Prepare at most three tailored newsroom/resource-suggestion drafts in week one. Each needs a verified public contact channel and a specific reason for relevance. A mention or resource link must be editorially voluntary; do not pay, exchange links or promise positive coverage. No contacts have been selected or sent messages in this assignment.
4. **Human maker discussion on Show HN, if appropriate.** The working tool can be tried without registration. A human maker who worked on it must be available to discuss it. Keep the submission about the usable product and technical feedback, not fundraising. Do not request coordinated upvotes/comments; a routine minor update is not a fresh Show HN. [Show HN rules](https://news.ycombinator.com/showhn.html).
5. **Data-journalism participation only through allowed human channels.** IRE explicitly prohibits AI bots from posting to its listservs. Existing eligible human participants may consider a relevant technical discussion under the list's rules; this plan does not subscribe anyone, use member-only archives or authorize an agent to post. [IRE listserv policy](https://www.ire.org/resources/listservs/).

Use descriptive links, readable graphs with axes/denominators, alt text and source captions. Do not crop away provisional labels. Publish a genuinely useful walkthrough before pitching it. Google's guidance favors content that serves a real audience; a new URL alone does not create value. [Google's people-first content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).

## Thirty-day work plan

The detailed first-week queue and channel drafts are in [MARKETING-ACTION-QUEUE.md](MARKETING-ACTION-QUEUE.md). The public [sharing kit](https://voteranomaly.com/PROMOTION-KIT.md) is an existing draft asset; its text should be checked against the latest shipped features before use. No proposed post is already scheduled.

| Period | Manual work | Owner / estimated effort | Decision evidence |
| --- | --- | --- | --- |
| Nov 6 evening | Confirm one demo route, provisional wording, support status and the baseline fields | James + integration owner, 30–45 min | Ready-to-review asset and explicit unknown metrics |
| Nov 7–13 | One demo, one source walkthrough, one suitable community discussion if allowed, up to three tailored pitch drafts, responses and a seven-day report | James, 3–4 hr; content/research support, 3–5 hr; optional developer instrumentation, 1–2 hr | Actual public URLs/replies only after authorized sends; qualified visits and corrections, not impressions alone |
| Nov 14–20 | Improve the most useful walkthrough from real feedback; offer one educator/library resource draft; prepare two small contribution tasks | Content/research owner, 2–3 hr; James, 1–2 hr | Reproducible examples, useful replies, accepted corrections/resource consideration |
| Nov 21–27 | Repeat only the channel with evidence of useful sessions; release notes tied to real source/UI improvements | James + integration owner, 2–4 hr | Comparable source/medium/date ranges and a clear reason to repeat |
| Nov 28–Dec 6 | Review four weeks, correct stale content, choose one next audience or discontinue ineffective activity | James + analytics owner, 2–3 hr | Dated report with denominators, limits, time spent and actual support receipts if separately reconciled |

These are work estimates, not employee assignments already accepted or measured costs. If time is tight, do the demo, baseline and responses first; postpone additional channels. Set numerical traffic or support targets only after a real baseline exists. Operational targets are controllable: one reviewed demo, one sourced guide, a maximum of three individually relevant pitch drafts and a completed weekly report.

## Measurement: implemented versus proposed

The existing GA tag is `G-7K67FPGPPG`. Inspection of current source found:

| Signal | Implementation state | What it can establish |
| --- | --- | --- |
| GA configuration/page views | Tag/config present on map and directory | Actual reporting still needs verification; tag presence is not a traffic count |
| `share` | Fires after successful native-share resolution or clipboard copy | A share/copy action, not a confirmed recipient visit |
| `support_engagement` | Click listener on header QR, wallet-open and invoice-copy controls | Click intent only. The copy listener fires before clipboard completion; it is not a successful-copy receipt or payment |
| `select_county`, `view_county_results`, `view_history`, `source_open`, `contribute_open` | Proposed, not found as implemented custom events in source | No report may claim these tracked conversions yet |
| Donation revenue/settlement | Not implemented or inspected | Never synthesize donations, revenue or donor counts from clicks |

Before distribution, James/analytics owner should record: property timezone; exact date range; available sessions and engaged sessions; source/medium/campaign; known testing traffic; existing share/support event counts; and Search Console clicks/impressions/indexing separately. Missing observations are **unknown**, not zero. Confirm event receipts in Realtime/DebugView before using them in a funnel. Any new engagement events need a small developer task and verification; this document does not deploy them. [Google GA event setup](https://developers.google.com/analytics/devguides/collection/ga4/events), [recommended share event](https://developers.google.com/analytics/devguides/collection/ga4/reference/events#share).

Compare the first 24 hours with the next comparable period and report a seven-day total. Separate sessions from event counts and unique users. For channels, report the numerator and denominator: engaged sessions / sessions; sessions reaching a useful answer only after that event is implemented; source opens / sessions after instrumentation; share/support actions as intent. Do not rank channels from tiny samples or promise donations from a support-click rate.

Use stable lowercase campaign fields: `utm_campaign=vmap_launch_2026`, one `utm_source` per platform, an appropriate consistent medium, and a short asset `utm_content`. Add UTMs only to external distribution links, never internal navigation. Never put a recipient's name, email, wallet request, search query or inferred political preference into tracking parameters. [Google campaign URL guidance](https://support.google.com/analytics/answer/10917952?hl=en).

## Support wording

**Support the research and platform.** “Help us verify public sources, fill coverage gaps and keep V-Map available to everyone.” Keep the same access and evidence standards whether or not someone contributes. Donations do not buy a conclusion or influence which party is reviewed.

Share https://voteranomaly.com/#support rather than an invoice. The current combined Bitcoin request includes an optional Lightning invoice expiring **November 9, 2026**; the on-chain address remains available afterward. Recheck the displayed payment options before using a support CTA after that date. Do not claim tax deductibility, nonprofit status, verified receipts, partnerships, endorsements or guaranteed publication unless separately established.

No ranking, AI-answer citation, virality, traffic or fundraising result is guaranteed by this plan. It creates a measurable manual launch, not an always-running marketing team.
