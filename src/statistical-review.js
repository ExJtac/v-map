import {loadElection, OFFICE_LABELS} from './election-data.js';
import {loadCountySupplement, mergeElectionData} from './county-data.js';
import {qualifiedRaceCounts, auditedHouseCounts, auditedSenateRoundCounts} from './history-series.js';
import {appUrl} from './paths.js';
import {AUDIT_METRICS, auditedMetricCohort, describePeerPosition, histogram, twoPartyShare} from './statistical-math.js';

const cycles = new Map();
const cohortCache = new Map();
const shareMetric = {key: 'share', label: 'Democratic share of identified Democratic + Republican votes', unit: '%'};
const number = value => Number.isFinite(value) ? value.toLocaleString('en-US', {maximumFractionDigits: 1}) : 'Unavailable';
const measure = (value, metric) => `${number(value)}${metric.unit === 'pp' ? ' pp' : '%'}`;
function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text != null) node.textContent = text;
  if (className) node.className = className;
  return node;
}
function svgElement(tag, attributes = {}, text) {
  const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, String(value));
  if (text != null) node.textContent = text;
  return node;
}
async function cycle(office, year) {
  const key = `${office}-${year}`;
  if (!cycles.has(key)) cycles.set(key, Promise.all([loadElection(office, year), loadCountySupplement(office, year)])
    .then(([base, extra]) => mergeElectionData(base, extra)).catch(error => { cycles.delete(key); throw error; }));
  return cycles.get(key);
}

export function snapshotShareCounts(rows, context) {
  // The shared helper explicitly marks retained named-party counts only after
  // source/round/geography and integer-count checks. A withheld whole-race total
  // does not prevent a D/(D+R) share when that typed marker is present.
  return qualifiedRaceCounts(rows, context);
}

async function shareCohort(context) {
  const {office, year, id, report} = context, stateFips = id.slice(0, 2);
  const key = `${office}-${year}-${stateFips}`;
  const senateContract=report?.comparabilityContracts?.senateSpecials?.[stateFips]||report?.comparabilityContracts?.senateRounds?.[stateFips];
  const reviewedSenate=office==='senate'&&[senateContract?.baselineYear||2020,2026].includes(year)&&senateContract?.verified;
  if (office === 'house'||reviewedSenate) {
    const records = Object.entries(report?.counties || {}).filter(([fips]) => fips.startsWith(stateFips)).flatMap(([fips, county]) => {
      const counts = reviewedSenate?auditedSenateRoundCounts(report,fips,year):auditedHouseCounts(report, fips, year), value = twoPartyShare(counts);
      return value == null ? [] : [{id: fips, name: county.name, value, sourceIds: counts.sourceIds, provisional: counts.provisional}];
    });
    return {metric: shareMetric, records, selected: records.find(r => r.id === id), reason:reviewedSenate?'The source-pinned same-seat Senate scope, exact year and qualified party counts are required. Unqualified rounds remain excluded.':'Complete audited whole-county House scope is required; partial district portions are not combined.'};
  }
  if (!cohortCache.has(key)) cohortCache.set(key, cycle(office, year).then(data => {
    const groups = new Map();
    for (const row of data?.results || []) if (row.geoLevel === 'county' && row.stateFips === stateFips) {
      if (!groups.has(row.countyFips)) groups.set(row.countyFips, []);
      groups.get(row.countyFips).push(row);
    }
    return [...groups].flatMap(([fips, rows]) => {
      const counts = snapshotShareCounts(rows, {...context, level: 'county', id: fips}), value = twoPartyShare(counts);
      return value == null ? [] : [{id: fips, name: rows[0].countyName || rows[0].name || fips, value,
        sourceIds: counts.sourceIds, provisional: counts.provisional, seatId: counts.seatId}];
    });
  }).catch(error => { cohortCache.delete(key); throw error; }));
  const all = await cohortCache.get(key), selected = all.find(r => r.id === id);
  const records = selected ? all.filter(r => r.seatId === selected.seatId) : all;
  return {metric: shareMetric, records, selected, reason: 'A unique qualified countywide general-election contest, both identified parties and at least 500 two-party votes are required.'};
}

function distributionFigure(records, selected, description, metric, selectedName) {
  const peers = records.filter(r => r.id !== selected.id);
  const distribution = histogram(peers.map(r => r.value), selected.value);
  const figure = element('figure', null, 'statistics-distribution');
  figure.append(element('figcaption', `${metric.label} · ${peers.length} other counties`));
  const width = typeof window === 'object' && window.innerWidth <= 680 ? 360 : 720;
  const left = 44, right = width - 24;
  const svg = svgElement('svg', {viewBox: `0 0 ${width} 260`, width: '100%', height: 260, role: 'img',
    'aria-label': `${metric.label}. Gray bars count other qualified counties. Purple line marks ${selectedName}; dashed green line marks the peer median. A bin-count table follows.`});
  svg.append(svgElement('title', {}, `${selectedName} compared with other qualified counties`));
  const {bins, transformed, lowerTransformed: lo, upperTransformed: hi} = distribution;
  const transform = transformed ? value => Math.sign(value) * Math.log1p(Math.abs(value) / 10) : value => value;
  const x = value => left + (transform(value) - lo) / (hi - lo) * (right - left);
  const maximumCount = Math.max(1, ...bins.map(bin => bin.count));
  const y = count => 200 - count / maximumCount * 158;
  svg.append(svgElement('line', {x1: left, x2: right, y1: 200, y2: 200, stroke: '#586962'}));
  for (const count of new Set([0, Math.round(maximumCount / 2), maximumCount])) {
    svg.append(svgElement('text', {x: left - 8, y: y(count) + 4, 'text-anchor': 'end', 'font-size': 12, fill: '#344c40'}, count));
  }
  for (const bin of bins) {
    const rect = svgElement('rect', {x: x(bin.lower) + 1, y: y(bin.count), width: Math.max(1, x(bin.upper) - x(bin.lower) - 2), height: 200 - y(bin.count), fill: '#819a8c'});
    rect.append(svgElement('title', {}, `${measure(bin.lower, metric)} to ${measure(bin.upper, metric)}: ${bin.count} other counties`));
    svg.append(rect);
  }
  for (const [value, color, dash] of [[description.median, '#14633e', '6 4'], [selected.value, '#64248c', 'none']]) {
    svg.append(svgElement('line', {x1: x(value), x2: x(value), y1: 30, y2: 204, stroke: color, 'stroke-width': 3, 'stroke-dasharray': dash}));
  }
  svg.append(svgElement('text', {x: left, y: 20, 'font-size': 12, fill: '#64248c'}, `Selected: ${measure(selected.value, metric)}`));
  svg.append(svgElement('text', {x: right, y: 20, 'text-anchor': 'end', 'font-size': 12, fill: '#14633e'}, `Peer median: ${measure(description.median, metric)}`));
  for (const index of [0, Math.floor(bins.length / 2), bins.length]) {
    const value = index === bins.length ? bins.at(-1).upper : bins[index].lower;
    svg.append(svgElement('text', {x: x(value), y: 225, 'text-anchor': 'middle', 'font-size': 12, fill: '#344c40'}, measure(value, metric)));
  }
  svg.append(svgElement('text', {x: left, y: 248, 'font-size': width < 500 ? 10 : 12, fill: '#344c40'}, transformed ? 'Signed log spacing; labels show original values.' : 'Linear spacing · bar height = other county count.'));
  figure.append(svg);
  const details = element('details', null, 'statistics-bin-details');
  details.append(element('summary', 'View the distribution counts'));
  const table = element('table', null, 'history-table');
  table.append(element('caption', `${metric.label}: intervals include the lower boundary; the last also includes its upper boundary.`));
  const head = element('thead'), heading = element('tr');
  for (const text of ['Interval', 'Other counties']) { const th = element('th', text); th.scope = 'col'; heading.append(th); }
  head.append(heading); table.append(head);
  const body = element('tbody');
  for (const bin of bins) { const row = element('tr'); row.append(element('td', `${measure(bin.lower, metric)} to ${measure(bin.upper, metric)}`), element('td', String(bin.count))); body.append(row); }
  table.append(body); details.append(table); figure.append(details);
  return figure;
}

function metricSummary(cohort, context) {
  const {metric, selected, records} = cohort;
  const box = element('div', null, 'statistics-metric-content');
  if (!selected) { box.append(element('p', cohort.reason || 'This metric is unavailable for the selected county.')); return box; }
  const peers = records.filter(r => r.id !== selected.id), description = describePeerPosition(selected.value, peers.map(r => r.value));
  box.append(element('p', `${context.name}: ${measure(selected.value, metric)}${cohort.baselineYear ? ` versus ${cohort.baselineYear}` : ''}.`, 'statistics-selected-value'));
  if (description.status !== 'described') { box.append(element('p', description.reason)); return box; }
  const list = element('dl', null, 'statistics-summary-grid');
  const summaries = [
    ['Percentile rank among other counties', `${number(description.percentile)} / 100 (ties receive half weight)`],
    ['Peer median', measure(description.median, metric)],
    ['Middle 80% of peer values', `${measure(description.p10, metric)} to ${measure(description.p90, metric)}`],
    ['Peers at least as far from their median', `${description.atLeastAsFarCount} of ${description.peerCount} (${number(description.tailFraction * 100)}%)`],
    ['Modified z score', description.modifiedZ == null ? 'Unavailable' : number(description.modifiedZ)],
  ];
  for (const [label, value] of summaries) { list.append(element('dt', label), element('dd', value)); }
  box.append(list, element('p', 'The peer fraction counts observed counties in this snapshot. It is not a p-value, a future-event probability, or the odds of fraud. A zero count means none of these observed peers was as far away; it does not mean the pattern is impossible.', 'statistics-caution'));
  if (description.scoreReason) box.append(element('p', description.scoreReason, 'statistics-note'));
  box.append(distributionFigure(records, selected, description, metric, context.name));
  const sourceLine = element('p', null, 'statistics-note');
  sourceLine.append(document.createTextNode(`Selected-county source identifiers: ${(selected.sourceIds || []).join(', ') || 'qualified comparison audit'}. `));
  const evidence = element('a', 'Methods and source qualification'); evidence.href = appUrl('/STATISTICAL-METHODS.md'); evidence.target = '_blank'; evidence.rel = 'noopener noreferrer'; sourceLine.append(evidence); box.append(sourceLine);
  return box;
}

/** context.report reuses the already-loaded audit; this module never refetches it. */
export async function renderSelectedStatistics(container, context, isCurrent = () => true) {
  const token = Symbol('statistics'); container._statisticsToken = token;
  const current = () => isCurrent() && container._statisticsToken === token;
  const section = element('section', null, 'statistics-content');
  section.append(element('h3', 'How unusual is this county’s pattern?'));
  container.replaceChildren(section);
  if (context.level !== 'county') { section.append(element('p', 'Select a county to compare its available vote pattern with other qualified counties in the same state. Historical state totals remain in the history graphs.')); return; }
  if (!OFFICE_LABELS[context.office]) { section.append(element('p', 'Choose an election office to view statistics.')); return; }
  const id = String(context.id).padStart(5, '0'); context = {...context, id, name: context.name || id, year: Number(context.year)};
  section.append(element('p', `${context.name} · ${OFFICE_LABELS[context.office]} · ${context.year}`, 'statistics-context'));
  section.append(element('p', 'Each other county receives one observation, regardless of population. Cohorts use the same state, office and year; change comparisons also require matching baseline years and qualified seat/district scope. Missing or held records are excluded, never replaced with zero.', 'statistics-note'));
  if (context.year === 2026) section.append(element('p', 'Provisional 2026 snapshot: incomplete counting, which ballots have reported, candidate changes and a presidential-versus-midterm Senate baseline can change these comparisons. These descriptive measures do not cancel the map’s own-history review borders.', 'statistics-caution'));
  const loading = element('p', 'Loading qualified county comparisons…'); section.append(loading);
  let share;
  try { share = await shareCohort(context); }
  catch { if (current()) loading.textContent = 'County comparison data could not load. Select the county again to retry.'; return; }
  if (!current()) return;
  const choices = [share];
  if (context.year === 2026 && context.report) for (const metric of AUDIT_METRICS) {
    const cohort = auditedMetricCohort(context.report, context, metric.key);
    if (cohort.selected) choices.push(cohort);
  }
  loading.remove();
  if (context.year === 2026 && !context.report) section.append(element('p', 'The source-qualified historical-change audit has not loaded; those metrics are unavailable until it is ready.', 'statistics-note'));
  const available = choices.filter(cohort => cohort.selected);
  if (!available.length) { section.append(element('p', share.reason || 'No qualified county comparison is available for this selection.')); return; }
  const label = element('label', 'Compare a metric ', 'statistics-metric-label'), select = element('select');
  select.setAttribute('aria-label', 'County statistical comparison metric');
  for (const [index, cohort] of available.entries()) { const option = element('option', `${cohort.metric.label}${cohort.baselineYear ? ` vs ${cohort.baselineYear}` : ''}`); option.value = String(index); select.append(option); }
  const defaultIndex = Math.max(0, available.findIndex(cohort => cohort.metric.key === 'democratGrowth'));
  select.value = String(defaultIndex); label.append(select); section.append(label);
  const detail = element('div', null, 'statistics-current-metric'); section.append(detail);
  function renderMetric() { if (current()) detail.replaceChildren(metricSummary(available[Number(select.value)] || available[0], context)); }
  select.addEventListener('change', renderMetric); renderMetric();
  section.append(element('p', 'Use the election year control to view a distribution for another imported cycle. The history graphs trace the selected place across 2006–2026; unsupported years stay as gaps.', 'statistics-note'));
  const limits = element('details', null, 'statistics-limit-details'); limits.append(element('summary', 'Can these data tell us the odds of fraud?'));
  limits.append(element('p', 'No defensible fraud probability follows from aggregate vote changes alone. Counties are related observations, not independent random samples. Provisional counts arrive selectively; the full electorate, reporting sequence, candidate choices and boundary changes must be modeled and independently checked. This panel describes observed comparisons without inventing a probability model.'));
  const method = element('a', 'Statistical methods, assumptions and the model-validation plan'); method.href = appUrl('/STATISTICAL-METHODS.md'); method.target = '_blank'; method.rel = 'noopener noreferrer'; limits.append(method); section.append(limits);
}
