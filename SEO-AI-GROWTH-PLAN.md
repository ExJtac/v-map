# V-Map search and AI-answer growth plan

Prepared November 6, 2026, Mountain time. Primary site: https://voteranomaly.com/. Audited source: `5ab2e78d3e2ea193eb94a7f05bf0f24f518e1621`. This is a researched implementation plan and read-only public audit, not a record of ranking gains, account settings changed, submissions or advertising. No paid tools, provider calls, outreach, new accounts, service changes or deployment were performed by this specialist. The saved research schedule remains **PAUSED**; work below is manual until James changes that instruction.

The practical objective is to make a small number of useful, source-backed pages easy to discover, understand, verify and cite. We can improve eligibility and usefulness; neither first place on Google nor selection in an AI answer can be guaranteed. Start with precise questions V-Map can actually answer, rather than trying to outrank every national election publisher.

## Confirmed public audit

Raw HTTP/HTML receipt: `/tmp/vmap-seo-public-audit-20261106.json`. This checks initial HTML, not Google's rendered page or authenticated reports.

| Observation | Confirmed evidence | Implication |
| --- | --- | --- |
| Primary pages are reachable | `/`, `/winners/`, `/about/`, `/methodology/`, `/coverage/` each returned HTTP 200, one H1, primary-domain canonical and description; no X-Robots exclusion | No sampled public HTTP indexing block was found |
| Discovery is present | Root HTML links to winners, about, methodology and coverage; sitemap has these five canonical primary URLs; root robots allows `/` and advertises that sitemap | Preserve working links, metadata, robots and exact 404 behavior |
| Sharing uses the logo | Sampled primary pages point Open Graph images at `https://voteranomaly.com/share/v-map-logo-v2.png` | Keep the QR out of preview metadata |
| Duplicate hosts compete | Equivalent CAS-TX pages return 200 with **CAS-TX self-canonicals** and a separate CAS-TX sitemap of the same five routes | This conflicts with the intended single primary identity; consolidation is the first code priority |
| Actual candidate text requires JavaScript | `/winners/` initial HTML is 5,812 bytes, has zero candidate-card elements and no sampled Barry Moore name; initial HTML provides introductory text, controls and a JSON link | Prerender source-qualified candidates, dates, status and source links into initial HTML; progressively enhance filters |
| Source footprint is explicit | Registered sources: 13; office/year coverage rows: 50. Directory has 21 year files, 2006–2026; 2026 has 338 imported contests, 330 provisional leaders, eight held/unavailable | Do not promote this as all national winners or a complete national feed |
| Large audit exists | Local normalized anomaly artifact is 48,281,999 bytes uncompressed | Measure mobile transfer, parsing and rendering before optimizing; this is not a measured network payload or Core Web Vitals score |

Unknown in this public audit: Google-selected canonical, actual indexed pages, verified crawler visits/IPs, origin firewall treatment of real bots, GA traffic, Bing ownership, AI citation counts and field performance. Prior handoff records GSC ownership verification, sitemap success and an indexing request; none proves current rankings, index inclusion or citations. No `site:` query result is being treated as definitive index evidence.

Root's subsequent authenticated, read-only Search Console check confirmed URL-prefix ownership and the effective Search generative AI control **Include**, inherited from `voteranomaly.com` (Default). The checkbox and effective value were observed in the accessibility state; no screenshot was captured before browser access became unavailable. Root also observed robots Valid and Crawl stats No data available yet. No control, parent property or account setting was changed; no performance baseline was inspected. This resolves the AI inclusion-setting question, not indexing, ranking or citation performance.

## What current official guidance changes

**Google Search and AI features.** Normal crawlability, indexing and snippet eligibility remain prerequisites. The newer 2026 guide also requires that the site be included in Search generative AI features through Search Console. No special AI text file or magic schema produces placement. Google's current guidance favors distinctive, useful work over mass-produced variations of the same answer. [AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), [AI-features requirements](https://developers.google.com/search/docs/appearance/ai-features).

**Inspect the real inclusion setting.** Search Console → Settings → Search generative AI offers Include, Exclude and inherited controls. Google says the control rolled out globally by August 31, 2026; Include is the default unless inherited settings change it. Root subsequently observed V-Map's effective setting as **Include**, inherited from its parent; the exact account observation is recorded above. Preserve that value, and record property/inheritance again if it later changes. This is distinct from ordinary Search ranking and AI training policy. [Official control documentation](https://support.google.com/webmasters/answer/16908024).

**Use the new Google report.** The June 2026 announcement, updated for global rollout in August, describes dedicated Search Generative AI performance views with impressions, pages, countries, devices and dates. Overall performance still includes these impressions. Inspect the actual available reports rather than relying only on older documentation saying everything is aggregated under Web. [Google's report announcement](https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports).

**ChatGPT search versus training.** OpenAI's OAI-SearchBot controls automatic search discovery; GPTBot concerns potential model-training use. Their permissions are independent. ChatGPT-User is a user-triggered fetcher, not the search-index control. The current wildcard allow rule does not opt these bots out, but it does not prove that real bot requests pass infrastructure checks or that V-Map has been cited. Do not enable training merely as an imagined ranking requirement. [Official OpenAI crawler documentation](https://developers.openai.com/api/docs/bots).

**Gemini versus Search.** Googlebot handles Search crawling. Google-Extended is a separate product token affecting specified Gemini training/grounding uses; it is not a Google Search ranking signal. Make any future training-policy choice deliberately, separately from the Search generative AI control. [Google crawler/product-token reference](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers#google-extended).

**Bing and Copilot.** Bing Webmaster Tools offers AI citation-performance reporting across supported surfaces. Citations are not clicks or proof of ranking. IndexNow is a free change-notification protocol for participating engines, with a public ownership-key file and verifiable submission receipts; acknowledgement alone is not indexing. It is not a Google indexing API. [Bing AI Performance announcement](https://blogs.bing.com/webmaster/2026/2/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview/), [IndexNow protocol](https://www.indexnow.org/documentation).

## Prioritized delivery backlog

All cash estimates below mean **$0 advertising/new-tool spend**, not zero human effort or a promise of unchanged hosting costs. Roles are proposed owners, not continuously running workers. Ship app changes through the existing two-domain verified release process and notify James after each production push.

| Priority | Concrete task | Owner | Spend / effort estimate | Acceptance evidence |
| --- | --- | --- | --- | --- |
| P0 | Inspect primary-domain GSC URL Inspection for root, winners and one static source page; record selected canonical, crawl/render state, indexing exclusions and latest sitemap read | Root + James account session | $0; 30–60 min | Dated screenshots/export; failures explicitly recorded, no repeated blind indexing requests |
| Complete: eligibility setting | Read-only GSC Settings → Search generative AI inspection | Root authenticated session | $0; no account writes | Accessibility observation confirms inherited effective Include; screenshot unavailable after browser disconnect. This is not index/citation evidence |
| P0 | Consolidate equivalent CAS-TX app pages toward voteranomaly.com using corresponding primary-domain canonicals; align social identity and primary sitemap/internal promotional links | Developer + QA | $0; 1–3 h | Both mounts still work; every alternate app-page canonical points to its matching primary URL; primary sitemap contains only primary canonical pages; CAS-TX marketing and Bidlark routes unchanged |
| P0 | Prerender the default 2026 directory into `/winners/`, including names, office/state/district, provisional/held labels, reference dates and original-source links; keep filters as enhancement | Developer + research QA | $0; 3–6 h | Candidate content and source links visible with JS disabled and in fetched HTML; generated content matches qualified JSON exactly; held records publish no inferred winner |
| P1 | Add a small set of real office/year/state landing pages with stable links and useful text; start only where current coverage supports a satisfying answer | Editorial + developer | $0; 3–6 h per reviewed cluster | Unique source-linked explanation, dated tables, limitations, working navigation, 200 response and correct canonical; no invented routes or mass thin pages |
| P1 | Publish two original methods/data walkthroughs using verified examples, including an unflagged control and a missing-data example | Research + editor | $0; 2–4 h each | Reproducible values and source dates; uncertainty, denominators and count-status caveats; visible author/reviewer and corrections pathway |
| P1 | Inspect Bing Webmaster Tools ownership and sitemap state; if available, establish a measured baseline and enable verified IndexNow notifications for actual canonical-page changes | Root + James account session | $0; 1–2 h | Ownership evidence, key-file validation, changed-URL receipt, indexing/citation export; no URL spam or assertion that submission caused inclusion |
| P1 | Measure real phone performance and defer/split audit payloads only if traces show a bottleneck | Developer + QA | $0; 2–4 h diagnosis | Saved mobile trace and PageSpeed/Lighthouse run; report lab versus field data separately; compare same scenario before/after, preserve all audit semantics |
| P1 | Strengthen publisher trust pages: real organizational identity, methodology/reviewer credits, corrections log/contact route, update policy and donation independence | James + editor | $0; 2–4 h | Accurate visible identities and policies; no invented credentials, institutional endorsement or continuous-scraping claims |
| P2 | Add truthful structured data where it describes visible content, such as WebSite, BreadcrumbList and documented datasets | Developer + editor | $0; 1–3 h | Markup matches visible content and passes relevant validation; no fabricated ratings or unsupported winner assertions |
| P2 | Review content/query performance monthly and improve the pages people use; retire or merge unsupported/duplicative pages | SEO + research + marketing | $0; 1–2 h/week | Before/after page cohorts, query/citation logs, correction record and real user feedback |

Cross-domain canonical consolidation is a recommendation based on the observed duplicate-host setup; it is not evidence that Google currently chose the wrong domain. Redirects can be a stronger future consolidation option if James later wants the alternate mount retired, but the existing instruction is to preserve its availability. Canonicals, links and sitemap preferences should be consistent. [Google canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).

Google can render JavaScript; the directory is not proven unindexable. Initial HTML rendering reduces dependence on a separate render/fetch stage and makes core evidence usable by readers and other systems that do not execute the app. Serve the same substantive content to people and crawlers; do not cloak a different bot-only winners list. [JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics).

## Content that earns attention rather than imitating it

Start with answers supported by V-Map's actual work:

- “What does a county review border mean?” Show the rule, a sourced example and plausible reporting explanations; a flag is not proof of wrongdoing.
- “Reported votes versus ballots cast versus population.” Demonstrate each denominator and label unavailable quantities.
- “How to compare 2026 with an earlier election.” Explain office/seat/round/geographic compatibility and provisional-versus-final timing.
- A dated, source-linked state/office results page that states imported coverage and identifies provisional leaders correctly.
- A candidate research profile only after identity, election status, factual claims, archive provenance and human review pass the research plan's gates. Use the same standards across parties; do not index rumor collections or label provisional leaders as elected winners.

Each page should provide something the raw return or a generic AI summary does not: verified cross-source reconciliation, an accessible table/chart, explicit uncertainty, an explainable method or a reproducible correction. Link naturally from the map/directory and related methodology. Do not create thousands of nearly identical county/person pages to cover keyword permutations. Avoid misleading “fraud discovered,” “all winners” or “live every five minutes” headlines when the evidence does not support them. The domain name is not a finding.

## First 7 days, then 30 and 90

| Window | Deliverables under our control | Review decision |
| --- | --- | --- |
| Days 1–2 | Capture GSC/GA/Bing baselines; retain the already-observed inherited Include control; prepare and verify canonical consolidation; prereview source/status requirements for prerendering | Fix blockers before distributing more URLs |
| Days 3–4 | Ship source-matched initial HTML for the directory; inspect fetched/rendered output; prepare one narrow office/state page and one methods walkthrough | Publish only after useful content and source review pass |
| Days 5–7 | Support marketing's short demo, public contributor guide and a few individually relevant resource suggestions; log any real mentions/referrals and corrections | Seven-day evidence report, not a promised traffic or donation total |
| By day 30 | Maintain a small reviewed cluster, correct discovered gaps, compare 7/28-day Search and AI report cohorts, measure meaningful map/directory use | Expand the topics generating useful engagement and verifiable source contributions |
| By day 90 | Reassess coverage, publisher trust, canonical selection and citation patterns; audit older profiles and dated results | Continue useful clusters; merge weak duplicates rather than scaling automatically |

This is a proposed work cadence, not a scheduled automation. No research or marketing schedule was resumed or installed.

## Measurement record to establish

Begin every unknown metric as **not measured**, not zero. Record property, hostname, date range, timezone, source/export and any thresholding or sampling notes.

| Layer | Record | Avoid interpreting it as |
| --- | --- | --- |
| Technical discovery | HTTP response, canonical, sitemap read, verified crawler fetch, rendered-resource errors | Index inclusion or ranking |
| Google index | URL Inspection status, Google-selected canonical, last crawl, affected page count | A guaranteed position or future traffic |
| Search performance | GSC query/page impressions, clicks, CTR and average position, with branded/nonbranded groups | A universal live rank; average position is contextual |
| Google AI visibility | Available Generative AI performance impressions/pages/countries/devices/dates, plus overall Search | Clicks, donations or every possible answer impression |
| Bing AI visibility | Citation and cited-page trends with dashboard caveats | Traffic or a complete transcript of all AI answers |
| User value | GA sessions reaching county results, source opens, historical graphs, directory interactions and successful shares where genuinely instrumented | Unique people from summed events or a complete attribution picture |
| Support | Support-link/wallet/copy interactions; separately reconciled actual receipts if James supplies evidence | Settled donations or revenue from a click |

Keep a small, repeatable manual citation sample: fixed neutral questions, exact wording, product, locale, signed-in state if relevant, date/time, response screenshot and cited URL. Examples: “How can I compare county vote counts across elections?” and “What does V-Map's county review border mean?” Do not submit the same prompt repeatedly until it cites us, manufacture engagement or call a single favorable response a citation rate. GA referrals can miss some app-origin visits; attribution uncertainty must remain visible.

## Immediate handoff

Root's next useful sequence is: finish the still-pending authenticated indexing/performance baseline when browser access returns, consolidate primary identity, then prerender evidence-rich directory content. The effective Google Search generative AI control is already confirmed Include and needs no change. Marketing can prepare a demonstration and relevant resource suggestions alongside that work. No additional paid marketing tool is needed to begin. IndexNow/Bing setup remains unexecuted; the limited GSC observations above are complete, while performance/indexing observations remain pending; no new permission, credential, public posting or account state is implied by this plan.
