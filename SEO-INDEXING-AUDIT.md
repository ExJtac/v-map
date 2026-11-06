# V-Map public crawl and Google AI visibility audit

Observed November 6, 2026, approximately **21:47 UTC**, before the proposed SEO changes. Target: **https://cas-tx.com/vmap/**. This is a read-only HTTP/repository audit plus four official Google documentation pages. Only this report was written. No Search Console login, shared browser control, credential inspection, indexing submission, deployment or paid API call occurred.

## Confirmed public HTTP evidence

| URL | Observed response | Finding |
|---|---|---|
| `https://cas-tx.com/vmap` | 308 → `/vmap/` → 200 HTML | Slash normalization already works. |
| `https://cas-tx.com/vmap/` | 200 HTML | No `X-Robots-Tag` exclusion, robots meta exclusion or canonical link found. |
| `https://cas-tx.com/robots.txt` | 200 plain text | `User-Agent: *`, `Allow: /`, root sitemap advertised. No Googlebot or Google-Extended block. |
| `https://cas-tx.com/sitemap.xml` | 200 XML, 44 URLs | Includes `/projects/v-map`; does **not** include `/vmap/`. |
| `https://cas-tx.com/vmap/sitemap.xml` | 404 | No app sitemap at audit time. |
| `https://cas-tx.com/vmap/robots.txt` | 404 | This subdirectory file is not the root crawler policy; root robots already permits the app. |
| `https://cas-tx.com/vmap/assets/index-BCoujzVX.js` | 200 JavaScript, 211,222 bytes | The production module referenced by the HTML is publicly fetchable. |
| `https://cas-tx.com/vmap/data/modern-counties/manifest.json` | 200 JSON | A sampled application data dependency is publicly fetchable. |

The exact root robots body observed was:

```text
User-Agent: *
Allow: /

Host: https://cas-tx.com
Sitemap: https://cas-tx.com/sitemap.xml
```

The app's initial HTML title is `V-Map — A fresh perspective`. Its description says it explores U.S. election history at national/state/county levels. The initial H1 is `Every place has a history.` No Open Graph, Twitter-card or JSON-LD markup was found in the app HTML. These omissions are optimization opportunities, not evidence of an indexing block.

The source HTML includes interface controls and descriptive text, but actual interactive map returns are loaded by JavaScript. An initial heading still says `United States · President · 2024` while the available-year control defaults to 2026. Make static introductory material accurate independently of the selected interactive view. Repository inspection found no dedicated state/county election URL navigation using `pushState`, `replaceState` or `URLSearchParams`; controls and SVG interactions should not be counted as separately discoverable election pages.

## Existing public discovery is real; Google indexing remains unverified

The root homepage contains a normal HTML link to **[the V-Map project page](https://cas-tx.com/projects/v-map)**. That page returns 200, has its own project-page canonical and contains two normal links to the actual app. The **[open-source page](https://cas-tx.com/open-source)** also links directly to the app and to the project page. The root sitemap includes the project page. This is a working crawlable discovery chain, not proof that Google has fetched, indexed, selected a canonical for, ranked or cited V-Map.

No authenticated Search Console state was inspected. Property verification, user permissions, indexed status, Google-selected canonical, last crawl, rendered-page results and submission status are **unknown**. Root is responsible for checking the existing browser session without exposing credentials. Absence from a public search query would not resolve these questions reliably, so this audit makes no claim that the app is either indexed or absent from Google.

## Prioritized implementation recommendations

1. **P1 — Clarify the canonical app identity in initial HTML.** Use a single self-canonical `https://cas-tx.com/vmap/`, consistent with the existing redirect. Give the app a descriptive title such as `V-Map | U.S. Election Results by State and County`. Keep the separate CAS-TX project page self-canonical; do not canonicalize the app to the marketing page. Google recommends descriptive titles and consistent HTML canonicals for JavaScript applications. [Official JavaScript SEO guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics).
2. **P1 — Include the actual app in sitemap discovery.** Publish `/vmap/sitemap.xml` containing only genuine canonical HTML pages, initially the app URL. Advertise that sitemap through the existing root sitemap or an additional root-robots `Sitemap:` line, preserving the marketing site's 44 existing URLs and existing access policy. Do not enumerate raw JSON assets, fabricated county routes, fragments or control states as HTML pages. A sitemap is a discovery aid, not proof of inclusion. [Official recrawl/sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl).
3. **P1 — Add useful visible introductory and methodology text to initial HTML.** Describe supported offices, historical coverage gaps, dated 2026 unofficial snapshots, source provenance and comparison limits. Link to readable source/methodology pages. Do not imply every county/election is covered or every current count is finished. This can complement the map while making the page useful before interaction; Google can render JavaScript, but important content and links benefit from direct HTML availability. [Official JavaScript SEO guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics).
4. **P2 — Add consistent share metadata.** Open Graph/Twitter title, description, canonical app URL and a real public preview image can improve link presentation. Optional truthful WebApplication/Organization structured data must describe visible content. These are presentation improvements, not a required Google AI format or ranking guarantee.
5. **P2 — Add deeper indexable pages only with genuine content and routing.** Future office/year/state research pages need real stable URLs, useful visible text, source dates, normal `<a href>` links and correct server responses. Do not mass-generate thin county pages or pretend the current controls already create pages. Keep actual missing assets and unknown routes as 404 rather than serving a successful app shell for everything.

These recommendations are an implementation assessment from the observed site, not Google acceptance findings. Current root robots already permits crawling; adding another permissive robots file is not the main gap.

## Google Search, AI Overviews/AI Mode, and Gemini

**Search AI features:** A supporting page must be indexed and eligible for a Search snippet. Ordinary search/content requirements apply; Google describes no extra AI optimization requirement, special AI text file or special schema for AI Overviews/AI Mode. Googlebot controls Search crawling, including those features. Relevant AI-feature traffic is included in Search Console's Web performance reporting. Meeting requirements does not guarantee crawling, indexing or appearance. [Official AI-features documentation](https://developers.google.com/search/docs/appearance/ai-features).

**Gemini distinction:** Google-Extended is a robots product token governing specified Gemini training and grounding uses. It has no separate HTTP user-agent string, and Google says it does not determine Google Search inclusion or ranking. The current root wildcard policy does not block it. The reviewed documentation supplies no separate “submit V-Map to Gemini's index” workflow; do not invent one or promise citations. Search discovery/indexing and the owner's Google-Extended usage preference are distinct decisions. [Official crawler/product-token documentation](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers#google-extended).

## Exact handoff for root's authenticated submission check

Start at **https://search.google.com/search-console** using the existing authorized account. Select an already verified `cas-tx.com` domain property or a verified URL-prefix property covering `https://cas-tx.com/vmap/`. Do not claim property access until observed; indexing requests require an owner or full user.

After deployment, inspect **`https://cas-tx.com/vmap/`** in URL Inspection. Run its live test, inspect fetched/rendered HTML and resource errors, confirm the intended canonical, then use **Request indexing** if available. Record the observed response rather than claiming acceptance from an ordinary HTTP 200.

In the property's sitemap submission interface, submit **`https://cas-tx.com/vmap/sitemap.xml`** only after that exact URL returns valid XML. Keep the existing root sitemap submission intact. Record observed retrieval status and discovered URL count. Monitor indexing and Web performance afterward. Repeated requests do not accelerate crawling; inclusion is not guaranteed. [Official request/permission and sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl).

## Limits and completion criteria

This audit verified public access, source HTML, links, selected resources and root sitemap entries. It did not run Google's renderer or authenticate to Search Console, inspect origin/CDN access logs, demonstrate a Googlebot visit or prove Google/Gemini placement. Root should verify the deployed HTML/robots/XML, preserve other CAS-TX services, and use the live URL Inspection result before reporting any indexing submission. The frozen Senate bundle remains unchanged.
