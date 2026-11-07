import { appUrl } from './paths.js';
import { reviewForCounty, stateReviewSummary, patternDirection } from './2026-anomalies.js';
import { countingStatus } from './counting-status.js';
import { OFFICE_LABELS } from './election-data.js';
import { isLargePartyChange, formatPartyChange } from './county-metrics.js';

let report, request, failed = false;
export const getPatternReviewReport = () => report;
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
    if (![1, 2, 3].includes(data.schemaVersion) || data.electionYear !== 2026 || !data.counties) throw new Error('Review format unavailable');
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
let countyListKey = '', filterBound = false;
function filterCountyList() {
  const value = document.querySelector('#pattern-county-filter').value.trim().toLowerCase();
  const rows = [...document.querySelectorAll('#pattern-county-list li[data-search]')];
  for (const row of rows) row.hidden = !row.dataset.search.includes(value);
  document.querySelector('#pattern-filter-empty').hidden = !rows.length || rows.some(row => !row.hidden);
}
export function updatePatternCountyList({ office, year }, states, selectedCounty, onSelect) {
  const section = document.querySelector('#pattern-county-browser');
  if (!filterBound) { document.querySelector('#pattern-county-filter').addEventListener('input', filterCountyList); filterBound = true; }
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
      item.dataset.search = `${place.name} ${place.state.properties.name} ${place.state.abbreviation} ${place.flags.map(f => f.label).join(' ')}`.toLowerCase();
      const button = node('button', `pattern-county-button pattern-${place.direction}`, '');
      button.type = 'button'; button.dataset.fips = place.fips;
      const direction = { democrat: 'Toward Democrats', republican: 'Toward Republicans', neutral: 'Total votes / population review', mixed: 'Democratic and Republican patterns' }[place.direction];
      button.setAttribute('aria-label', `Zoom to ${place.name}, ${place.state.properties.name}. ${direction}. Provisional review.`);
      button.append(node('strong', '', `${place.name}, ${place.state.abbreviation}`), node('span', '', direction));
      const metrics = place.flags.map(flag => {
        const e = flag.evidence;
        if (flag.id.endsWith('-share-swing') || flag.id.endsWith('-symmetric-party-shift')) return `D share ${pp(e.democratShareChangePp)}`;
        if (flag.id.endsWith('-party-count-change')) return `${e.growthParty === 'Democrat' ? 'D' : 'R'} votes ${pct(e.growthParty === 'Democrat' ? e.democratCountChangePercent : e.republicanCountChangePercent)}`;
        if (flag.id.endsWith('-race-vote-change')) return `Race votes ${pct(e.raceVoteCountChangePercent)}`;
        if (flag.id.endsWith('-race-population-change')) return `Race/population ${pp(e.raceVotesPerResidentChangePp)}`;
        return 'Ballots / population';
      });
      button.append(node('small', '', metrics.join(' · ')));
      button.addEventListener('click', () => onSelect(place.fips));
      item.append(button); list.append(item);
    }
    if (report && !places.length) list.append(node('li', 'pattern-list-empty', 'No counties meet the flag criteria for this office in the imported snapshot. Unassessed counties remain unassessed.'));
    document.querySelector('#pattern-county-filter').disabled = !places.length;
    filterCountyList();
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
  document.querySelector('#pattern-neutral-key').hidden = !Object.keys(report?.counties || {}).some(fips => { const review = reviewForCounty(report, office, fips); return review.flags.length && patternDirection(review.flags) === 'neutral'; });
  document.querySelector('#pattern-mixed-key').hidden = !Object.keys(report?.counties || {}).some(fips => patternDirection(reviewForCounty(report, office, fips).flags) === 'mixed');
  box.hidden = !active(office, year);
  if (box.hidden) return;
  box.replaceChildren(node('strong', '', '2026 county pattern review'));
  box.append(node('p', '', report ? summaryText(office, stateFips) : failed ? 'Review unavailable. Counties are not assessed.' : 'Loading county review…'));
  if (report) {
    const officeRecords = Object.values(report.counties).filter(county => !stateFips || county.stateFips === stateFips).map(county => county.offices[office]);
    const screens = report.schemaVersion >= 3 ? [['partyCountChange','40% party change'],['raceVoteChange','40% race-total change'],['racePopulationChange','10-point race/population change'],['shareSwing','10-point share swing']] : [['shareShift','Share shifts'],['partyGrowth','Party-count growth']];
    const summary = screens.map(([screen, label]) => {
      const records = officeRecords.map(record => record?.reviewScreens?.[screen] || record?.[screen]);
      return `${label}: ${records.filter(record => record?.status === 'assessed').length} assessed, ${records.filter(record => record?.flags?.length).length} flagged`;
    });
    box.append(node('p', '', summary.join(' · ')));
  }
  box.append(node('p', '', 'Review borders: a 40% party-count change while the other party stays within ±15%; a 40% race-total change; a 10-point population-ratio change; or a 10-point two-party share swing. Purple/green mark party direction; slate marks total/population signals. State peers provide context and do not veto these own-history signals. Light fills indicate counts not confirmed complete.'));
  if (report) box.append(node('p', '', `Snapshot audit: ${report.auditDate}. Reporting progress and candidate changes can explain flags; a flag does not establish an error or wrongdoing.`));
  reportLink(box);
}
const pp = value => `${value >= 0 ? '+' : ''}${value.toFixed(1)} pp`;
const pct = value => `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
const count = value => new Intl.NumberFormat('en-US').format(value);
function flagEvidence(flag) {
  const e = flag.evidence;
  if (flag.id === 'participation-own-history') return `Actual reported ballots per 100 residents: ${e.priorBallotsPer100Residents.toFixed(1)}% in ${e.baselineYear} → ${e.ballotsPer100Residents.toFixed(1)}% in ${e.currentYear} (${pp(e.ownChangePp)}). Population references: ${e.priorPopulationYear} and ${e.populationYear}. Counts remain provisional.`;
  if (flag.id.endsWith('-party-count-change')) return `Democratic reported votes: ${count(e.priorDemocratVotes)} → ${count(e.currentDemocratVotes)} (${pct(e.democratCountChangePercent)}). Republican reported votes: ${count(e.priorRepublicanVotes)} → ${count(e.currentRepublicanVotes)} (${pct(e.republicanCountChangePercent)}). One party changed at least 40% and 100 votes while the other stayed within ±15% of its own ${e.baselineYear} count. State peer patterns do not cancel this signal.`;
  if (flag.id.endsWith('-race-vote-change')) return `Reported candidate/write-in votes: ${count(e.priorRaceVotes)} in ${e.baselineYear} → ${count(e.currentRaceVotes)} in ${e.currentYear} (${pct(e.raceVoteCountChangePercent)}). This is race votes, not ballots cast. Unclassified and nonvote categories are excluded.`;
  if (flag.id.endsWith('-race-population-change')) return `Race votes per 100 residents: ${e.priorRaceVotesPer100Residents.toFixed(1)}% in ${e.baselineYear} → ${e.currentRaceVotesPer100Residents.toFixed(1)}% in ${e.currentYear} (${pp(e.raceVotesPerResidentChangePp)}). Population estimates: ${e.priorPopulationYear} and ${e.populationYear}. This is a race-vote measure, not actual ballot turnout. ${e.office === 'senate' && e.baselineYear === 2020 ? 'The baseline is a presidential-election year; cycle and reporting differences can create large changes.' : ''}`;
  if (flag.id.endsWith('-share-swing')) return `Democratic two-party share: ${e.priorDemocratTwoPartyShare.toFixed(1)}% in ${e.baselineYear} → ${e.currentDemocratTwoPartyShare.toFixed(1)}% in ${e.currentYear} (${pp(e.democratShareChangePp)}). This meets the 10-point own-history share-swing rule.${Number.isFinite(e.peer?.peerMedian) ? ` State peer median change: ${pp(e.peer.peerMedian)} (context only).` : ''}`;
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
  if (assessment?.reviewScreens) {
    const screens = assessment.reviewScreens;
    const e = screens.partyCountChange?.evidence || screens.shareSwing?.evidence || assessment.evidence;
    if (Number.isFinite(e?.democratCountChangePercent)) {
      for (const [party, value] of [['Democratic',e.democratCountChangePercent],['Republican',e.republicanCountChangePercent]]) if (isLargePartyChange(value)) {
        const marker=node('p','major-party-change',''); marker.append(node('strong','',`Large reported ${party} vote-count change: ${formatPartyChange(value)} vs ${e.baselineYear} · exceeds 15%.`)); box.append(marker);
      }
      box.append(node('p','county-tip-note county-border-metric',`Own-history counts vs ${e.baselineYear}: Democratic ${pct(e.democratCountChangePercent)}; Republican ${pct(e.republicanCountChangePercent)}. Democratic share swing: ${pp(e.democratShareChangePp)}.`));
      if (Number.isFinite(e.peer?.peerMedian)) box.append(node('p','county-tip-note',`State peer share change: ${pp(e.peer.peerMedian)}, shown as context. It does not prevent this county meeting an own-history review rule.`));
      if (e.office === 'senate' && e.baselineYear === 2020) box.append(node('p','county-tip-note','Same-seat Senate comparison uses 2020, a presidential-election year. Election-cycle and reporting progress differences may explain large changes.'));
    }
    for (const [key,label] of [['partyCountChange','40% party change / opposing party within ±15%'],['raceVoteChange','40% total race-vote change'],['racePopulationChange','10-point race votes / population change'],['shareSwing','10-point share swing']]) {
      const screen=screens[key];
      box.append(node('p','county-tip-note',`${label}: ${screen?.status === 'assessed' ? screen.flags.length ? 'review signal' : 'checked; threshold not reached' : `not assessed${screen?.reason ? ` · ${screen.reason}` : ''}`}.`));
    }
    return;
  }
  const share = assessment?.shareShift || assessment;
  const shareEvidence = share?.evidence || assessment?.evidence;
  if (share?.status === 'assessed' && Number.isFinite(shareEvidence?.democratShareChangePp)) {
    const e = shareEvidence, threshold = criteria.minDistancePp, zThreshold = criteria.modifiedZThreshold;
    for (const [party, value] of [['Democratic', e.democratCountChangePercent], ['Republican', e.republicanCountChangePercent]]) {
      if (isLargePartyChange(value)) {
        const marker = node('p', 'major-party-change', '');
        marker.append(node('strong', '', `Large reported ${party} vote-count change: ${formatPartyChange(value)} vs ${e.baselineYear} · exceeds 15%.`));
        box.append(marker);
      }
    }
    box.append(node('p', 'county-tip-note', 'Changes greater than 15% are highlighted for review. Statistical borders use separate peer-comparison rules; absence of a border does not establish that a result is normal or explain its cause.'));
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
