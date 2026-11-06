import { appUrl } from './paths.js';
import { reviewForCounty, stateReviewSummary } from './2026-anomalies.js';
import { countingStatus } from './counting-status.js';

let report, request, failed = false;
const active = (office, year) => year === 2026 && office !== 'geography';
const node = (tag, className, text) => {
  const item = document.createElement(tag);
  item.className = className;
  item.textContent = text;
  return item;
};
function loadReview() {
  request ||= fetch(appUrl('/data/anomalies-2026.json')).then(async response => {
    if (!response.ok || (response.headers.get('content-type') || '').includes('text/html')) throw new Error('Review unavailable');
    const data = await response.json();
    if (data.schemaVersion !== 1 || data.electionYear !== 2026 || !data.counties) throw new Error('Review format unavailable');
    report = data;
    return data;
  }).catch(() => { failed = true; return null; });
  return request;
}
export function initPatternReview(onReady) { loadReview().then(onReady); }
export function hasPatternFlag(office, year, fips) {
  return active(office, year) && Boolean(report) && reviewForCounty(report, office, fips).flags.length > 0;
}
function summaryFor(office, stateFips) {
  if (stateFips) return stateReviewSummary(report, office, stateFips);
  const reviews = Object.keys(report.counties).map(fips => reviewForCounty(report, office, fips));
  return {
    countyCount: reviews.length,
    flaggedCount: reviews.filter(r => r.flags.length).length,
    officeAssessedCount: reviews.filter(r => r.officeStatus === 'assessed').length,
    participationAssessedCount: reviews.filter(r => r.participationStatus === 'assessed').length,
    notAssessedCount: reviews.filter(r => r.status === 'not-assessed').length,
  };
}
function summaryText(office, stateFips) {
  const s = summaryFor(office, stateFips);
  return `${s.flaggedCount} ${s.flaggedCount === 1 ? 'flagged county' : 'flagged counties'} · ${s.officeAssessedCount} office comparisons assessed · ${s.participationAssessedCount} population participation checks · ${s.notAssessedCount} counties with neither check assessed · ${s.countyCount} map counties.`;
}
function reportLink(container) {
  const a = node('a', 'pattern-source', 'Criteria, coverage and source evidence ↗');
  a.href = appUrl('/PATTERN-REVIEW.md');
  a.target = '_blank'; a.rel = 'noopener noreferrer';
  container.append(a);
}
export function updatePatternSummary({ office, year }, stateFips) {
  const box = document.querySelector('#pattern-review-summary');
  box.hidden = !active(office, year);
  if (box.hidden) return;
  box.replaceChildren(node('strong', '', '2026 county pattern review'));
  box.append(node('p', '', report ? summaryText(office, stateFips) : failed ? 'Review unavailable. Counties are not assessed.' : 'Loading county review…'));
  box.append(node('p', '', 'Light colors: count not confirmed complete. Dark colors: source reports a final or complete count. Yellow borders: provisional statistical patterns to review. Unassessed counties have no yellow border.'));
  if (report) box.append(node('p', '', `Snapshot audit: ${report.auditDate}. Reporting progress and candidate changes can explain flags; a flag does not establish an error or wrongdoing.`));
  reportLink(box);
}
const pp = value => `${value >= 0 ? '+' : ''}${value.toFixed(1)} pp`;
const pct = value => `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
const count = value => new Intl.NumberFormat('en-US').format(value);
function flagEvidence(flag) {
  const e = flag.evidence;
  if (flag.id === 'participation-state-peer-and-own-history') {
    return `Reported ballots / residents: ${e.ballotsPer100Residents.toFixed(1)}% in 2026; same-state peer median ${e.peer.peerMedian.toFixed(1)}%; own ${e.baselineYear} baseline ${e.priorBallotsPer100Residents.toFixed(1)}% (${pp(e.ownChangePp)}).`;
  }
  return `Democratic two-party share: ${e.priorDemocratTwoPartyShare.toFixed(1)}% in ${e.baselineYear} → ${e.currentDemocratTwoPartyShare.toFixed(1)}% reported in 2026 (${pp(e.democratShareChangePp)}). Same-state median change: ${pp(e.peer.peerMedian)}. Democratic votes: ${count(e.priorDemocratVotes)} → ${count(e.currentDemocratVotes)} (${pct(e.democratCountChangePercent)}). Republican votes: ${count(e.priorRepublicanVotes)} → ${count(e.currentRepublicanVotes)} (${pct(e.republicanCountChangePercent)}).`;
}
export async function appendPatternReview(container, { office, year, id, rows = [], level = 'county' }, isCurrent) {
  if (!active(office, year)) return;
  const status = countingStatus(rows);
  container.append(node('p', 'county-tip-note count-status', `${status.label} · ${status.reason}`));
  const data = await loadReview();
  if (!isCurrent()) return;
  const box = node('section', 'county-pattern-review', '');
  if (!data) box.append(node('p', 'county-tip-note', 'Pattern review unavailable; not assessed.'));
  else if (level === 'state') {
    box.append(node('strong', '', 'County pattern review'), node('p', 'county-tip-note', summaryText(office, id)));
  } else {
    const review = reviewForCounty(data, office, id);
    box.classList.toggle('has-pattern-flag', review.flags.length > 0);
    box.append(node('strong', '', review.flags.length ? 'Yellow border · provisional pattern review' : 'County pattern review'));
    for (const flag of review.flags) {
      box.append(node('p', 'pattern-flag-label', flag.label), node('p', 'county-tip-note', flagEvidence(flag)));
      const links = node('div', 'pattern-source-links', 'Sources: ');
      for (const [i, source] of flag.sources.entries()) {
        const a = node('a', '', source.title); a.href = source.url; a.target = '_blank'; a.rel = 'noopener noreferrer';
        if (i) links.append(' · '); links.append(a);
      }
      box.append(links);
    }
    box.append(node('p', 'county-tip-note', `Participation check: ${review.participationStatus === 'assessed' ? 'assessed' : 'not assessed'}. Office comparison: ${review.officeStatus === 'assessed' ? 'assessed' : 'not assessed'}.${review.status === 'assessed' ? ' No screen met every flag threshold.' : ''}`));
    if (review.reason) box.append(node('p', 'county-tip-note', review.reason));
  }
  box.append(node('p', 'county-tip-note', 'Exploratory, provisional review. Reporting progress may explain differences. A flag does not establish an error or wrongdoing.'));
  reportLink(box);
  container.append(box);
}
