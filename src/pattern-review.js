import { appUrl } from './paths.js';
import { reviewForCounty, stateReviewSummary, patternDirection } from './2026-anomalies.js';
import { countingStatus } from './counting-status.js';
import { OFFICE_LABELS } from './election-data.js';

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
    if (![1, 2].includes(data.schemaVersion) || data.electionYear !== 2026 || !data.counties) throw new Error('Review format unavailable');
    report = data;
    return data;
  }).catch(() => { failed = true; return null; });
  return request;
}
export function initPatternReview(onReady) { loadReview().then(onReady); }
export function hasPatternFlag(office, year, fips) {
  return active(office, year) && Boolean(report) && reviewForCounty(report, office, fips).flags.length > 0;
}
export function countyPatternDirection(office, year, fips) {
  return hasPatternFlag(office, year, fips) ? patternDirection(reviewForCounty(report, office, fips).flags) : 'neutral';
}
let countyListKey = '';
export function updatePatternCountyList({ office, year }, states, selectedCounty, onSelect) {
  const section = document.querySelector('#pattern-county-browser');
  section.hidden = !active(office, year);
  if (section.hidden) { document.querySelector('#pattern-navigation-status').hidden = true; return; }
  const places = Object.entries(report?.counties || {}).flatMap(([fips, county]) => {
    const review = reviewForCounty(report, office, fips);
    const state = states.find(state => state.id === county.stateFips);
    return review.flags.length && state ? [{ fips, name: county.name, state, direction: patternDirection(review.flags), flags: review.flags }] : [];
  }).sort((a, b) => a.state.properties.name.localeCompare(b.state.properties.name) || a.name.localeCompare(b.name));
  const key = `${office}:${year}:${failed}:${Boolean(report)}:${places.map(p => p.fips).join(',')}`;
  if (key !== countyListKey) {
    countyListKey = key;
    document.querySelector('#pattern-navigation-status').hidden = true;
    document.querySelector('#pattern-county-context').textContent = report
      ? `${OFFICE_LABELS[office]} · ${year} · ${places.length} nationwide.${places.length ? ' Select a county to zoom in.' : ''} Provisional review.`
      : failed ? 'County review unavailable.' : 'Loading county review…';
    const list = document.querySelector('#pattern-county-list');
    list.replaceChildren();
    for (const place of places) {
      const item = node('li', '', '');
      const button = node('button', `pattern-county-button pattern-${place.direction}`, '');
      button.type = 'button'; button.dataset.fips = place.fips;
      const direction = { democrat: 'Toward Democrats', republican: 'Toward Republicans', neutral: 'Participation pattern', mixed: 'Democratic and Republican patterns' }[place.direction];
      button.setAttribute('aria-label', `Zoom to ${place.name}, ${place.state.properties.name}. ${direction}. Provisional review.`);
      button.append(node('strong', '', `${place.name}, ${place.state.abbreviation}`), node('span', '', direction));
      const metrics = place.flags.map(flag => flag.id.endsWith('-symmetric-party-shift')
        ? `D share ${pp(flag.evidence.democratShareChangePp)}`
        : flag.id.endsWith('-symmetric-party-growth') ? `${flag.evidence.growthParty === 'Democrat' ? 'D' : 'R'} vote-count growth` : 'Ballots / residents');
      button.append(node('small', '', metrics.join(' · ')));
      button.addEventListener('click', () => onSelect(place.fips));
      item.append(button); list.append(item);
    }
    if (report && !places.length) list.append(node('li', 'pattern-list-empty', 'No counties meet the flag criteria for this office in the imported snapshot. Unassessed counties remain unassessed.'));
  }
  document.querySelectorAll('#pattern-county-list button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.fips === selectedCounty?.id)));
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
  const legend = document.querySelector('#pattern-legend');
  legend.hidden = !active(office, year);
  document.querySelector('#pattern-neutral-key').hidden = !report?.summary?.participation?.flagged;
  document.querySelector('#pattern-mixed-key').hidden = !Object.keys(report?.counties || {}).some(fips => patternDirection(reviewForCounty(report, office, fips).flags) === 'mixed');
  box.hidden = !active(office, year);
  if (box.hidden) return;
  box.replaceChildren(node('strong', '', '2026 county pattern review'));
  box.append(node('p', '', report ? summaryText(office, stateFips) : failed ? 'Review unavailable. Counties are not assessed.' : 'Loading county review…'));
  if (report) {
    const officeRecords = Object.values(report.counties).filter(county => !stateFips || county.stateFips === stateFips).map(county => county.offices[office]);
    const summary = ['shareShift', 'partyGrowth'].map(screen => {
      const records = officeRecords.map(record => record?.[screen] || (screen === 'shareShift' ? record : null));
      return `${screen === 'shareShift' ? 'Share shifts' : 'Party-count growth'}: ${records.filter(record => record?.status === 'assessed').length} assessed, ${records.filter(record => record?.flags?.length).length} flagged`;
    });
    box.append(node('p', '', summary.join(' · ')));
  }
  box.append(node('p', '', 'Light fills: count not confirmed complete. Dark fills: source reports a final or complete count. Dark purple borders: a share-swing or party-count growth pattern toward Democrats relative to state peers. Dark green borders: the corresponding Republican pattern. Unassessed counties have no review border.'));
  if (report) box.append(node('p', '', `Snapshot audit: ${report.auditDate}. Reporting progress and candidate changes can explain flags; a flag does not establish an error or wrongdoing.`));
  reportLink(box);
}
const pp = value => `${value >= 0 ? '+' : ''}${value.toFixed(1)} pp`;
const pct = value => `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
const count = value => new Intl.NumberFormat('en-US').format(value);
function flagEvidence(flag) {
  const e = flag.evidence;
  if (flag.id.endsWith('-symmetric-party-growth')) {
    const democrat = e.growthParty === 'Democrat';
    const growth = democrat ? e.democratCountChangePercent : e.republicanCountChangePercent;
    const opposite = democrat ? e.republicanCountChangePercent : e.democratCountChangePercent;
    return `${e.growthParty === 'Democrat' ? 'Democratic' : 'Republican'} vote-count growth: ${pct(growth)} vs ${pct(e.peer.peerMedian)} among state peers. Opposing-party growth: ${pct(opposite)} vs ${pct(e.opposingPeer.peerMedian)} among peers. This is a separate count-growth screen, not a share-point change. Reported counts are provisional.`;
  }
  if (flag.id === 'participation-state-peer-and-own-history') {
    return `Reported ballots / residents: ${e.ballotsPer100Residents.toFixed(1)}% in 2026; same-state peer median ${e.peer.peerMedian.toFixed(1)}%; own ${e.baselineYear} baseline ${e.priorBallotsPer100Residents.toFixed(1)}% (${pp(e.ownChangePp)}).`;
  }
  return `Democratic two-party share: ${e.priorDemocratTwoPartyShare.toFixed(1)}% in ${e.baselineYear} → ${e.currentDemocratTwoPartyShare.toFixed(1)}% reported in 2026 (${pp(e.democratShareChangePp)}). Same-state median change: ${pp(e.peer.peerMedian)}. Democratic votes: ${count(e.priorDemocratVotes)} → ${count(e.currentDemocratVotes)} (${pct(e.democratCountChangePercent)}). Republican votes: ${count(e.priorRepublicanVotes)} → ${count(e.currentRepublicanVotes)} (${pct(e.republicanCountChangePercent)}).`;
}
function appendOfficeChecks(box, assessment, criteria) {
  const share = assessment?.shareShift || assessment;
  const shareEvidence = share?.evidence || assessment?.evidence;
  if (share?.status === 'assessed' && Number.isFinite(shareEvidence?.democratShareChangePp)) {
    const e = shareEvidence, threshold = criteria.minDistancePp, zThreshold = criteria.modifiedZThreshold;
    box.append(node('p', 'county-tip-note county-border-metric', `Border metric · Democratic two-party share: ${e.priorDemocratTwoPartyShare.toFixed(1)}% → ${e.currentDemocratTwoPartyShare.toFixed(1)}%, a ${pp(e.democratShareChangePp)} change vs ${e.baselineYear}. State peer median change: ${pp(e.peer.peerMedian)}; gap from peers: ${pp(e.peer.distancePp)}.`));
    const peers = assessment?.partyGrowth?.evidence?.parties;
    box.append(node('p', 'county-tip-note', peers
      ? `Separate vote-count growth: Democratic ${pct(e.democratCountChangePercent)} (state peer median ${pct(peers.Democrat.peer.peerMedian)}); Republican ${pct(e.republicanCountChangePercent)} (peer median ${pct(peers.Republican.peer.peerMedian)}). Vote-count percentages differ from vote-share percentage points.`
      : `Separate vote-count growth: Democratic ${pct(e.democratCountChangePercent)} · Republican ${pct(e.republicanCountChangePercent)}. Vote-count percentages differ from vote-share percentage points.`));
    const reasons = [];
    if (Math.abs(e.democratShareChangePp) < threshold) reasons.push(`own share change ${Math.abs(e.democratShareChangePp).toFixed(1)} pp is below ${threshold} pp`);
    if (Math.abs(e.peer.distancePp) < threshold) reasons.push(`peer gap ${Math.abs(e.peer.distancePp).toFixed(1)} pp is below ${threshold} pp`);
    if (e.peer.modifiedZ != null && Math.abs(e.peer.modifiedZ) <= zThreshold) reasons.push(`outlier score ${Math.abs(e.peer.modifiedZ).toFixed(2)} does not exceed ${zThreshold}`);
    box.append(node('p', 'county-tip-note', reasons.length ? `Share-shift check: not flagged — ${reasons.join('; ')}.` : `Share-shift check: flagged. Meets the ${threshold} pp own-change and peer-gap minimums and the outlier check.`));
  }
  const growth = assessment?.partyGrowth;
  if (growth) box.append(node('p', 'county-tip-note', growth.status === 'assessed'
    ? `Separate party-count growth check: ${growth.flags.length ? 'flagged; see evidence below' : 'assessed; no asymmetric spike met every criterion'}.`
    : `Separate party-count growth check: not assessed. ${growth.reason || ''}`));
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
    const direction = patternDirection(review.flags);
    box.classList.add(`pattern-${direction}`);
    const border = { democrat: 'Dark purple', republican: 'Dark green', neutral: 'Slate', mixed: 'Purple / green' }[direction];
    box.append(node('strong', '', review.flags.length ? `${border} border · provisional pattern review` : 'County pattern review'));
    appendOfficeChecks(box, data.counties?.[id]?.offices?.[office], data.criteria);
    for (const flag of review.flags) {
      box.append(node('p', 'pattern-flag-label', flag.label));
      const details = node('details', 'pattern-evidence', '');
      details.append(node('summary', '', 'Why this county is flagged'), node('p', 'county-tip-note', flagEvidence(flag)));
      const links = node('div', 'pattern-source-links', 'Sources: ');
      for (const [i, source] of flag.sources.entries()) {
        const a = node('a', '', source.title); a.href = source.url; a.target = '_blank'; a.rel = 'noopener noreferrer';
        if (i) links.append(' · '); links.append(a);
      }
      details.append(links);
      box.append(details);
    }
    box.append(node('p', 'county-tip-note', `Participation check: ${review.participationStatus === 'assessed' ? 'assessed' : 'not assessed'}. Office comparison: ${review.officeStatus === 'assessed' ? 'assessed' : 'not assessed'}.${review.status === 'assessed' ? ' No screen met every flag threshold.' : ''}`));
    if (review.reason) box.append(node('p', 'county-tip-note', review.reason));
  }
  box.append(node('p', 'county-tip-note', 'Exploratory, provisional review. Reporting progress may explain differences. A flag does not establish an error or wrongdoing.'));
  reportLink(box);
  container.append(box);
}
