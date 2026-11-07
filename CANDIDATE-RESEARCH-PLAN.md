# V-Map candidate research plan

Prepared November 6, 2026, Mountain time. This is a manual research and editorial plan, not an active monitoring service or a set of findings about named candidates. The saved research schedule remains **PAUSED**. No candidate dossiers, archive submissions, social posts, outreach, paid APIs or scheduled jobs were created for this plan.

## Execution update and commitments workflow

The paragraph above records the original planning pass. The manual pilot has since started: six Republican and six Democratic private first-pass inventories were produced, and independent structural review passed 102/102 checks. All profiles remain held for further evidence review; see [CANDIDATE-PILOT-STATUS.md](CANDIDATE-PILOT-STATUS.md). A second bounded source pass is testing original campaign statements against related official action records. These inventories are not complete histories or published promise assessments. No paid research API calls or recurring jobs have started.

James clarified the goal: present what candidates actually said, in context, alongside what they subsequently did. Apply this to **any subject**, without selecting policy topics or candidates to support a partisan conclusion. Policy reversal, follow-through and a change of priorities are separate questions. Working on another subject alone does not contradict a promise.

Use a source-linked commitments ledger with this collection order:

1. **Establish identity and dates.** Verify the person, campaign, account, office, election and governing term. Keep a prospective commitment separate from a past-term record. Do not infer that an undated live campaign page existed before the election; seek a dated original or verified historical capture and hold chronology when unavailable.
2. **Find the complete original.** Prefer a campaign platform, full interview/debate/speech, complete post/thread, or candidate-authored release. A news report or clipped video is a discovery lead. Link the full source and exact section or time range, preserve surrounding questions and answers, conditions, exceptions, edits and who actually spoke. Attribute campaign/staff text accordingly. Use brief exact excerpts plus a fair context summary, not a replacement collection of clips. Check machine transcripts against the recording before relying on the words.
3. **Separate one commitment per record.** Preserve exact wording, source date, topic, statement type (specific promise, goal, position, prediction or attack), promised action or outcome, qualifications, deadline, office authority, and an observable test established before judging subsequent events. A vague aspiration may remain not assessable; do not invent a deadline or turn every campaign sentence into a promise. Keep later revisions and explanations as new dated entries rather than overwriting the original.
4. **Collect official actions.** Match bills and amendments, recorded votes, orders, vetoes, budgets, funding decisions and implementation records using stable IDs, exact versions, dates and links. Distinguish an introduction, cosponsorship, procedural vote, final-passage vote, enactment and implementation. An official's press release proves what the office claimed, not by itself that the claimed outcome occurred. Check vote question, bill text and relevant provisions; do not infer an individual's vote from a voice vote, bill title, party position or legislative outcome. Official guidance: [Senate/House vote records](https://www.senate.gov/legislative/HowTo/how_to_votes.htm), [GovInfo bill versions](https://www.govinfo.gov/help/bills).
5. **Compare with relevant context.** Retain supporting and conflicting evidence, compromises, authority constraints, timing, court or legislative blocks, later policy changes and the candidate's own explanation. An incoming term that has not begun is not a broken promise. Possible evidence statuses include not yet assessable, evidence incomplete, action taken, partially fulfilled, fulfilled, contradicted and unclear. Any substantive assessment requires an explicit test, adequate evidence and independent review; do not infer dishonesty or intent from a policy change.
6. **Measure priorities separately.** Compare campaign emphasis with governing activity only within defined, dated and disclosed source collections. Record missing sources, classification rules, topic overlap, eligible record counts and the denominator. Keep speeches/posts, introduced bills, votes, spending and implemented outcomes as separate measures; ten posts are not equivalent to ten laws or evidence of time spent. A few selected examples cannot establish a change of overall priorities. Publish descriptive distributions and source links before an interpretive conclusion; avoid a composite honesty or hypocrisy score.
7. **Use APIs for collection and organization.** Use the [Congress.gov API](https://github.com/LibraryOfCongress/api.congress.gov) and official bulk/source records for federal legislation, official House/Senate vote records, and each state's legislative/executive records for state actions. API credentials and source coverage are service-specific. Use [Wayback Availability/CDX](https://archive.org/help/wayback_api.php) for historical capture discovery, then inspect actual content and capture dates. Use AI assistance to discover sources, extract candidate statements, suggest related actions and draft topic classifications, preserving URLs and uncertainty. Deterministic code handles dates, counts and comparisons; independent review checks meaning. Cache original retrievals and process changed or missing records before spending on AI search. The saved OpenAI key remains unused pending separate bounded authorization.
8. **Review, publish and maintain manually.** A second reviewer checks original-word accuracy, full context, identity, date sequence, action meaning, counterevidence and neutral wording. Publish a source-linked timeline with last-reviewed time, assessment rationale, coverage limits and corrections. Apply the same evidence and topic-selection rules to Republicans, Democrats, independents and other parties. Fairness does not require equal negative findings. This is a manual research workflow; it does not resume the paused five-minute schedule.

The first expansion uses the same fixed 12-person pilot and at most one original statement plus one related official record per subject in a bounded pass. That sample tests the collection method; it cannot support a complete promise inventory, a governing-priority score or a verdict on a whole career. The next gate is review of chronology, identity and source/action meaning before creating public candidate timelines.

## Start with an honest roster

The objective is to cover every person who wins an in-scope 2026 U.S. Senate, U.S. House or Governor contest, using the same process for Republicans and Democrats and including other parties when elected. There is no 2026 presidential election. Do not treat the present map directory as a complete winner census.

A read-only census of `public/data/winners/2026.json` found the following. Snapshot date: 2026-11-06. Input SHA-256: `f815acab51d2814ccaf4d4fbd24516c9c2dd0304b067b036db69cd61641a7122`.

| Office | Imported contest rows | Reported leader rows | Held / unavailable rows | Republican leaders | Democratic leaders | Other leaders |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| U.S. Senate | 22 | 22 | 0 | 9 | 13 | 0 |
| U.S. House | 294 | 286 | 8 | 119 | 163 | 4 |
| Governor | 22 | 22 | 0 | 8 | 14 | 0 |
| **Total** | **338** | **330** | **8** | **136** | **190** | **4** |

All 338 rows are marked provisional; zero have a certified-count flag. All 330 leading name/state label combinations are distinct after basic text normalization, but that is **not** verified person identity or a count of confirmed winners. The four Other leader rows are not assumed to be four elected people.

Maintain three separate registers:

1. **Eligible office/seat register:** the official 2026 ballot and election calendar for each state, full House district identities, Senate classes, special elections and required subsequent rounds. Record the official state election authority and a dated roster version. Scope voting seats and territories explicitly rather than silently mixing them. The completed register supplies the missing-coverage denominator; no nationwide total is invented here.
2. **Contest-outcome register:** each contest is `no_result`, `reported_leader`, `held`, `tied`, `winner_declared`, or `winner_certified`. A precinct-reporting percentage, FEC candidacy, current officeholder listing or count-certification flag alone does not establish a named election winner. A dated official election declaration or certification and the correct seat/round must support promotion to winner status. Keep a separate media race-call field if later desired; never merge it into official status.
3. **Person research register:** one stable person ID linked to all verified contest IDs. Confirm matching legal/public names, jurisdiction, office history and independent identifiers; handle initials, married names, name order, suffixes, transliterations and renamed accounts. Do not deduplicate solely by party or a similar name. Keep an unresolved-match queue. Link repeated contests to one person rather than charging or publishing duplicate biographies.

Newly elected federal candidates may not yet appear in current-member directories. The House explains that November winners generally become recognized members only after the new Congress begins; current district boundaries and officeholders therefore do not establish 2026 outcomes. [House directory timing](https://www.house.gov/representatives/find-your-representative), [House directory](https://www.house.gov/representatives), [Senate historical directory and Bioguide](https://www.senate.gov/senators/Senators1789toPresent.htm).

## Equal coverage and a practical queue

Use identical research lanes, dates, query templates, initial time budgets, evidence thresholds and reviewer requirements for both major parties. Alternate matched R/D packets within office/state-size groups where possible; handle others using the same checklist. Do not select subjects because an anomaly border favors a party, or demand equal numbers of negative stories. Report coverage and blocked-source rates by office and party so uneven source availability is visible.

Default ordering follows the live site: office, state A–Z, district numerically, then special/regular contest and round. Outcome verification takes priority over biography publication. Provisional leaders may receive an internal identity/source inventory, clearly labeled; a public profile must retain their actual outcome status and cannot be titled “winner” before qualification.

Recommended first pilot: **12 packets**, proposed as two R and two D subjects in each of Senate, House and Governor, drawn by the queue rule after identity/outcome checks. If the qualified roster cannot supply that mix, document the shortage and substitute the next same-office subject without pretending a party won. Include one archive-unavailable or ambiguous-identity example for workflow testing; it can remain held. This is a proposed sample, not work already done or a representative statistical sample.

## Standard research packet

| Lane | Fixed first-pass scope | Preferred evidence | Completion record |
| --- | --- | --- | --- |
| Identity and election | Correct person, seat, party as reported in that election, rounds and outcome | State election authority; official filings; corroborating public biography | Source IDs, status, seat/round, as-of date, unresolved conflicts |
| Public career and qualifications | Adult public professional timeline; education and employment claims; prior offices; campaign policy statements | Official biographies plus original employer/institution or legislative records where accessible | Verified fact / self-reported claim / unresolved distinction |
| Legislative and executive record | Prior public votes, bills, committee work, budgets, executive actions and official ethics findings relevant to office | Congress/state legislative records, official journals, orders and agency decisions | Exact record identifier and context, including contrary evidence |
| Campaign finance | Current-cycle candidate/committee financial summaries, amendments and official enforcement dispositions | FEC for federal campaigns; the appropriate state disclosure authority for Governor | Filing period, amendment chain, receipt/disbursement meaning; allegation versus finding |
| News | November 7, 2024 through the research cutoff for every subject; then trace specific, civically relevant earlier events to primary records | Original local/state/national reporting, full interviews and original documents | Publisher/byline/date, original versus syndicated reporting, corrections, subject response |
| Active social record | Public official/campaign accounts and verified public professional accounts, same two-year window; older posts only through a documented issue/history lead | Native post/permalink and full thread/media context | Account attribution, post ID/time, quote context, accessibility and edit status |
| Archived websites/posts | Public campaign/professional website changes across known campaign cycles; exact post URLs and verified handle/domain variants from earlier evidence | Wayback replay plus capture index; independent contemporaneous evidence if available | Capture time, original content time, replay completeness and what is not recoverable |
| Context and response | Accomplishments, policy positions, criticisms, explanations, denials, subsequent outcomes and corrections | Original records and direct public statements | Fair summary; no allegation promoted to adjudicated fact |

The two-year first pass is a uniform operational window, not an assertion that all relevant history begins then. Trace a relevant earlier event to its original date and public record; log the additional scope and reason. Avoid vague “find dirt” searches. Use templates such as name + state + office + official biography; exact name + original publication; verified handle + exact phrase + date; official case or filing identifier. A search snippet is a lead, not sufficient evidence for an adverse claim.

FEC guidance provides candidate and authorized-committee research paths and points to state disclosure offices for state campaigns. FEC registration or fundraising records do not determine election winners. Use candidate/committee summaries, not private donor contact lists. FEC states that individual-contributor information from its reports cannot be used for contribution solicitation or commercial purposes; do not repurpose it for V-Map fundraising or marketing. [FEC candidate research](https://www.fec.gov/introduction-campaign-finance/how-to-research-public-records/candidates/), [FEC jurisdiction and contributor-use notice](https://www.fec.gov/introduction-campaign-finance/).

## Public account verification

Before attributing a social post, link the account to the person through an official campaign/government site and another corroborating public source where possible. Record account type, platform, immutable platform account ID when publicly available, observed handle, historic handles with date ranges, and verification evidence. A badge, similar name, repost or screenshot alone does not prove control. Distinguish personal, campaign, staff-managed and institutional accounts; use “the campaign account posted” when authorship is not individually established. Impersonation, account takeover and name recycling remain explicit possibilities to investigate, not assumptions.

Record the full thread, quoted/reposted material, satire/context labels, relevant linked document and visible edits. Separate a subject's own words from a staff post or someone else's quote. Do not infer beliefs, criminality or intent from a like, follow, screenshot or isolated phrase. Use brief necessary attributed excerpts and links; do not mirror entire copyrighted articles, video libraries or social histories merely because they are reachable.

## Wayback Machine and unavailable/deleted posts

Use the **original exact URL** first, then documented campaign-domain and verified-handle variants. The Wayback help page describes incomplete captures, missing media and links resolving to another capture date or the live web. Inspect the timestamp in every replayed URL and verify media/thread elements separately. Save Page Now preserves a particular page once; it is not a scheduled monitor and cannot reconstruct already-lost content. An archive gap is a recorded limitation, not evidence of deliberate erasure. [Internet Archive usage and limitations](https://archivesupport.zendesk.com/hc/en-us/articles/360004651732-Using-The-Wayback-Machine).

For a later approved implementation, the Internet Archive Availability API can find a nearby capture and CDX can list/filter capture metadata. A “closest” capture is not necessarily the requested date. Index records alone do not establish that the body replays correctly. Use bounded, serial or small-batch requests, cache prior results, respect current limits and exclusions, and stop on rate limits. Access, uptime and cost are not assumed; no API or archive-save requests were executed for this plan. [Official Wayback API documentation](https://archive.org/help/wayback_api.php).

For each captured item retain the original URL, replay URL, raw archive timestamp, original publication/post time as available, retrieval time, returned URL/status, media completeness and a checksum of the exact retained artifact or clearly identified extracted text. Hashes show whether a saved artifact changed; they do not prove authorship, truth or legal authentication. Do not silently substitute an adjacent capture or embed live assets as historical evidence.

Use the following availability labels consistently:

| Label | Meaning and minimum basis |
| --- | --- |
| `public_live` | Exact content currently accessible on the verified public URL |
| `public_archive_only` | Relevant content replays in a public archive; current absence/deletion cause is not established |
| `unavailable` | A bounded check failed to retrieve it; log error, time, URL and archive search scope |
| `restricted` | Login, protection, paywall or permission barrier; no bypass or private content capture |
| `removed_by_platform` | A direct platform notice or comparably reliable record identifies platform removal; retain that evidence |
| `corroborated_author_deletion` | Verified earlier content plus a contemporaneous author admission or independently supported, specific deletion evidence; ordinary 404/error alone is insufficient |
| `not_verified` | Attribution or the content itself remains unresolved |

X's help distinguishes deleted content from posts missing because of profile/search display limits; its separate deletion page says deleted content and metadata stop being publicly available on X. Accordingly, search-cache remnants and a missing timeline entry cannot by themselves establish author deletion. [X deleted posts](https://help.x.com/en/using-x/delete-posts), [X missing posts](https://help.x.com/en/using-x/missing-posts), [X and search-cache visibility](https://help.x.com/en/safety-and-security/remove-x-profile-from-google-search).

Archive-It's own Facebook guidance describes login barriers and capture difficulties. Do not promise complete Facebook/Instagram/X histories, recovery of every removed post, or access to private material. For a blocked item, retain a search log and availability status, not an invented reconstruction. [Archive-It Facebook limitations](https://support.archive-it.org/hc/en-us/articles/208333113-Archiving-Facebook).

## Publication and correction gates

Keep packets internal until their review gates pass. The public product should present source-linked timelines and clearly attributed statements, with outcome status and a visible last-reviewed date. It should not publish a suspicion score, rumor count or unsupported opposition-research dossier.

1. **Identity/outcome:** resolve the person and account; establish the correct contest status from proper election evidence. A leading candidate stays a leading candidate until an actual winner declaration qualifies.
2. **Evidence:** each factual assertion has an accessible original or clearly labeled public archive source. Preserve original dates, capture dates, context and limitations. Multiple stories repeating one anonymous assertion count as one originating assertion, not independent corroboration.
3. **Adverse material:** distinguish allegation, charge, lawsuit, investigation, official finding, disposition, denial, appeal, correction and retraction. Use original documents and independent corroboration where obtainable. An allegation or complaint is not proof. Public records can be wrong or relate to a different person.
4. **Independent review:** a second reviewer checks identity, citation/content match, quote context, chronology, relevant counterevidence and neutral wording. Material adverse allegations require editorial review and a documented response/context check before publication. Draft any needed response request for separate authorized human sending; none is sent by this plan.
5. **Privacy and relevance:** cover public/professional civic conduct. Exclude home addresses, personal phone/email, account credentials, private/protected content, family/minor details, medical/sexual information and irrelevant personal-history material. Do not collect leaks, brokered private records or use archive access to evade restrictions.
6. **Release:** root integrates a reviewed, bounded batch, validates structured data and citations, then uses the existing dual-domain publication process and sends a production notice. No auto-publication of unreviewed allegations. Corrections update the claim, date, reason and affected sources; keep a non-harmful correction history and retract unsupported material promptly.

Schema file: `CANDIDATE-EVIDENCE-SCHEMA.json`. It describes a research packet and explicit statuses, not a database already populated or an enforcement system already deployed. The publication structure requires a recorded primary researcher, at least one independent reviewer, a review timestamp and completed check attestations; independence and cited-record integrity still need human checks. Structural JSON Schema validation cannot establish truth, legal sufficiency, identity matches or cross-reference integrity; the reviewer must also validate referenced IDs and the gates above. Reject duplicate IDs, self-corroboration and circular references; a copied story or same-origin screenshot is not a second independent source.

## Proposed capacity and delivery stages

| Stage | Owner role to assign | Planned work | Evidence needed to finish |
| --- | --- | --- | --- |
| 0: roster | Research lead | Build complete eligible-seat register and reconcile every imported outcome/missing seat | Official per-state roster references; coverage denominator; no invented winner status |
| 1: pilot | Two researchers plus an independent editor | Twelve matched packets; use all standard lanes and log blocked sources | Complete logs, identity/outcome checks, time receipts and reviewed examples of unavailable archives |
| 2: calibrate | Lead/editor | Review pilot agreement, time, source gaps, corrections and privacy checks | Actual median and range by lane; recurring ambiguities resolved before expansion |
| 3: staged coverage | Assigned researchers | Work the ordered queue in reviewable batches of ten people | Same baseline scope for both parties; verified IDs; second review; held queue preserved |
| 4: manual maintenance | Lead/editor/root | Recheck corrections and newly confirmed winners when a manual batch is authorized | Real review/publication receipts, not a heartbeat or fabricated monitoring claim |

Planning allowance, **not a measured forecast**: allow 60–90 researcher minutes per baseline packet and 20–30 reviewer minutes; complex primary-record/archive issues get an explicitly logged extension or a hold, never a rushed conclusion. The 12-packet pilot therefore budgets 16–24 total person-hours, excluding roster setup and difficult escalation. For an eventual confirmed, deduplicated roster of N people, use N × observed pilot time plus measured roster/escalation work; do not multiply the current330 provisional rows and call that completed or final scope. No paid tools or provider inference are authorized by this plan.

Weekly manual report: eligible seats known/unknown; named winners qualified; unique identities confirmed/unresolved; packets completed within stated bounds; source/replay failures; reviewed versus held claims; corrections; and time per lane. Break coverage out by office and party using denominators. Do not treat absence of negative news, an archive gap or a blocked account as a finding against a candidate. Do not claim “every winner researched” until the eligible roster, deduplication and every packet's completion record support it.

## Acceptance checklist for the next implementation step

- [ ] Complete eligible-office register with dated official sources and missing-seat accounting.
- [ ] Explicit contest outcome statuses; no provisional leader relabeled winner.
- [ ] Stable person and account identities, with independent evidence and unresolved matches held.
- [ ] Pilot roster chosen by the documented rule and equal baseline windows/effort.
- [ ] Each lane has a bounded completion/blocker log; missing data never invented.
- [ ] Archive replay and original dates distinguished; deletion wording independently supported.
- [ ] Evidence artifacts have hashes or explicit unavailability reasons; links and IDs resolve.
- [ ] Positive/neutral/critical facts and relevant responses handled by the same standards.
- [ ] Independent editorial, privacy, quotation and correction checks recorded.
- [ ] No external messages, paid access, bulk extraction or recurring job starts without the applicable authorization.
- [ ] Publish only reviewed batches through root; preserve manual-only research scheduling.
