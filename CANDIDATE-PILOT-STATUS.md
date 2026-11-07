# Candidate research pilot — first-pass status

November 6, 2026, Mountain time (receipts use November 7 UTC). Manual work only; the recurring schedule remains paused.

The pilot has started and produced **12 private first-pass inventories: six Republican and six Democratic**. Each party has two Senate, two House and two Governor subjects. Selection used the first two provisional leaders from distinct states in each office/party group in the existing directory order, without selecting for controversy. These are reported leaders, not independently qualified winners.

Both teams used the same research window and checklist. Each party received six Wayback replay fetches, all HTTP 200; none has an authenticated historical-content or deletion finding. Each party has public social-link leads for four of six subjects, with zero reviewed account post histories. Available source access differs and remains recorded rather than treated as a negative finding.

Independent readiness review passed **102/102 structural assertions** against the fixed roster and source hashes. This verifies inventory structure and balance, not the truth of every source. All 12 profiles remain **held from public publication**: no complete evidence-schema packet, fully reviewed social history, authenticated deletion claim or officially qualified named winner was produced. Identity, source-provenance, article-version and chronology conflicts remain explicit holds.

Raw packets, source-access receipts, scripts and the independent report stay local and Git-ignored under `scripts/source-data/candidate-pilot-2026/` (`republican/`, `democrat/`, `review/`). They are excluded from website artifacts and the public repository. No paid provider calls or external outreach occurred.

Next work is to reconcile official candidate/outcome identities, resolve the recorded conflicts, and complete the same public-record/news/social/archive lanes for both parties before independent editorial review. Apply the same standards to favorable and unfavorable material. A missing post or successful archive HTTP request does not establish deletion, authorship or historical content.

Candidate background research remains separate from county anomaly calculations. County checks should use identical rules for either party, retain provisional counting status and comparable election/geography controls, and report a pattern needing review rather than an unsupported cause or accusation. Balanced research effort does not require an equal number of flags.

## Original statements and campaign commitments

A second bounded manual pass has collected source-attributed campaign statements for all 12 subjects and recorded related official action records or explicit search gaps. The Republican pass opened 11 pages; the Democratic pass opened 10, with one additional blocked URL. Short excerpts retain full-source links, surrounding context, conditions, attribution and chronology limits. Some campaign pages lack an established original publication date; chronology remains held where it cannot be verified. Campaign-attributed speech transcripts are not represented as independently authenticated audio/video.

These are method-testing inventories, not a complete collection of personal posts or campaign promises. Introduced bills, cosponsorship, procedural/final votes, enactment and implementation remain distinct. Historical records outside the default window require a documented contextual exception. No subject has a published fulfillment, reversal or overall-priority verdict. A handful of examples does not establish governing emphasis; no complete activity denominator was assembled. Incoming-term commitments remain not yet assessable where appropriate.

The separate accountability readiness review passed **131/131 offline structural assertions**, including exact roster balance, preserved earlier packets, bounded access, explicit chronology/scope holds and corrected transcript attribution. This qualifies the bounded collection method, not the truth of every item or any public assessment. All 12 profiles and substantive assessments remain held pending source-context and editorial verification.

The topic-agnostic collection protocol is now in [CANDIDATE-RESEARCH-PLAN.md](CANDIDATE-RESEARCH-PLAN.md#execution-update-and-commitments-workflow). The new inventories and source/access logs remain ignored under `scripts/source-data/candidate-pilot-2026/accountability/`; all original pilot packets remain frozen. Further editorial verification is required before any candidate timeline is published.

## Original-source verification and bounded public subset

A subsequent independent **content** review re-opened original campaign publications and official records, inspected retained native-post metadata/text, visually reviewed the signed Arizona order, and retrieved all 12 replay bodies. It approved the selected public subset: 17 short source-attributed excerpts, 10 official-record associations, 63 account-link observations and 12 visible-text replay reviews, plus nine metadata-only archive checks. Four subjects have selected statements after election day. Zero personal-composition/delivery authentications, winner promotions, deleted-post findings or promise/priority verdicts were approved.

The 12 person mappings are confirmed, including the Alaska gubernatorial ticket identity; filing status “Certified” is not winner certification. Known-date and unknown-date statements remain distinct. Five selected member votes are not complete voting histories. The Arizona order establishes issuance and conditional directives, not implementation or savings. Two Sanders account URLs are explicitly directory-listed rather than corroborated control; eight other account links retain historical-primary capture evidence and current-control limitations. Weak unverified leads are excluded. Native social access was incomplete and rate-limit signals ended further attempts.

The curated `public/data/candidates/pilot-2026.json` pins both final researcher-file hashes and the independent approval-receipt hash. The page at `/accountability/` presents the approved facts and their full sources, with visible gaps. Full biographies, complete social/voting histories and substantive promise assessments remain unqualified; this public subset does not promote the older private packets to complete dossiers. Raw source and editorial receipts stay ignored under `scripts/source-data/candidate-pilot-2026/verification/`. Root integrates, tests and records actual production publication separately; scheduling stays paused.

Actual contributors to this verification: `pilot_republican`, `pilot_democrat`, independent source reviewer `seo_primary_canonicals`, frontend `forge_accountability_page`, and root integration. Their assignments were bounded manual runs, not continuous monitoring.

## Separate authorized API cost test — November 7

James then authorized a small test using the saved V-Map key. One `gpt-6-luna` Responses request, low reasoning, at most four web tool calls and 2,500 output tokens, compared two source-guided cases (one Republican, one Democratic) with the already-reviewed reference. It completed in 8.641 seconds and reported 13,154 input tokens (4,826 cache-write tokens), 725 output tokens (220 reasoning tokens), zero cached reads, and one `web_search_call` item whose action was `open_page`.

At the published Standard rates, the token estimate is $0.00179855; counting the observed web-tool item at $0.01 gives approximately **$0.01179855**, or 1.2 cents. This is a calculated estimate from actual returned usage, not an invoice. Ten narrow date/attribution/action-role/limit checks matched the existing reference. Full quotation verification was not scored by those checks, and the returned trace explicitly shows only one of the four cited URLs opened. A correct-looking answer with citations is therefore not equivalent to a complete, independently traceable source review.

This is not an apples-to-apples cost comparison with the team's wider pilot: comparable team billing and elapsed time were not instrumented. No relative saving is measured, and the result does not establish the cost of complete candidate/social-history research. API results were not imported into the website. Request, response, usage, evaluation and local runner remain ignored under `scripts/source-data/api-cost-test-2026-11-07/`; the key was not written, printed, committed or deployed. No automatic retries or ongoing API/scheduler service was enabled. Pricing basis: [official API pricing](https://developers.openai.com/api/docs/pricing) and [Luna cache-write pricing](https://developers.openai.com/api/docs/models/gpt-6-luna).

Actual contributors: `pilot_republican`, `pilot_democrat`, independent readiness reviewer `seo_primary_canonicals`, with root integration. These were bounded manual assignments, not continuous running services.
