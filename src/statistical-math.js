/** Descriptive county comparisons. These functions do not estimate fraud odds. */
export const MIN_STATISTICAL_PEERS = 10;
export const AUDIT_METRICS = Object.freeze([
  {key: 'democratGrowth', label: 'Democratic reported vote-count change', screen: 'partyCountChange', field: 'democratCountChangePercent', unit: '%'},
  {key: 'republicanGrowth', label: 'Republican reported vote-count change', screen: 'partyCountChange', field: 'republicanCountChangePercent', unit: '%'},
  {key: 'shareSwing', label: 'Democratic two-party share change', screen: 'shareSwing', field: 'democratShareChangePp', unit: 'pp'},
  {key: 'raceGrowth', label: 'Reported race-vote total change', screen: 'raceVoteChange', field: 'raceVoteCountChangePercent', unit: '%'},
  {key: 'racePopulation', label: 'Race votes per 100 residents change', screen: 'racePopulationChange', field: 'raceVotesPerResidentChangePp', unit: 'pp'},
  {key: 'ballotPopulation', label: 'Actual ballots per 100 residents change', screen: 'participation', field: 'ownChangePp', unit: 'pp'},
]);

const finite = values => values.filter(Number.isFinite);
export function quantile(values, probability) {
  const sorted = finite(values).sort((a, b) => a - b);
  if (!sorted.length || !Number.isFinite(probability) || probability < 0 || probability > 1) return null;
  const index = (sorted.length - 1) * probability;
  const lower = Math.floor(index), fraction = index - lower;
  return sorted[lower] + fraction * ((sorted[lower + 1] ?? sorted[lower]) - sorted[lower]);
}
export const median = values => quantile(values, 0.5);

/** Midrank gives tied observations half weight; the selected county is excluded. */
export function describePeerPosition(value, peers, minimum = MIN_STATISTICAL_PEERS) {
  const values = finite(peers);
  if (!Number.isFinite(value)) return {status: 'unavailable', reason: 'Selected county value is unavailable.', peerCount: values.length};
  if (values.length < minimum) return {status: 'unavailable', reason: `At least ${minimum} other qualified same-state counties are required; ${values.length} are available.`, peerCount: values.length};
  const center = median(values), mad = median(values.map(v => Math.abs(v - center)));
  const tolerance = 1e-9 * Math.max(1, Math.abs(value), Math.abs(center));
  const below = values.filter(v => v < value - tolerance).length;
  const ties = values.filter(v => Math.abs(v - value) <= tolerance).length;
  const distance = Math.abs(value - center);
  const atLeastAsFar = values.filter(v => Math.abs(v - center) >= distance - tolerance).length;
  const modified = mad > 0 ? 0.6745 * (value - center) / mad : null;
  return {
    status: 'described', value, peerCount: values.length, median: center, mad,
    p10: quantile(values, 0.1), p90: quantile(values, 0.9), min: Math.min(...values), max: Math.max(...values),
    belowCount: below, tieCount: ties, percentile: 100 * (below + ties / 2) / values.length,
    atLeastAsFarCount: atLeastAsFar, tailFraction: atLeastAsFar / values.length,
    distanceFromMedian: value - center,
    modifiedZ: Number.isFinite(modified) ? modified : null,
    scoreReason: mad === 0 ? 'Peer MAD is zero; a modified z score cannot be calculated.' : Number.isFinite(modified) ? null : 'The score exceeds numeric precision and is withheld.',
  };
}

/** Histogram bins are a display aid, never hypothesis-test regions. */
export function histogram(values, selectedValue) {
  const numbers = finite(values);
  if (!numbers.length) return {bins: [], transformed: false};
  const all = Number.isFinite(selectedValue) ? [...numbers, selectedValue] : numbers;
  let minimum = Math.min(...all), maximum = Math.max(...all);
  const transformed = maximum - minimum > 250;
  const forward = transformed ? v => Math.sign(v) * Math.log1p(Math.abs(v) / 10) : v => v;
  const inverse = transformed ? v => Math.sign(v) * Math.expm1(Math.abs(v)) * 10 : v => v;
  if (minimum === maximum) { minimum -= 1; maximum += 1; }
  const lo = forward(minimum), hi = forward(maximum);
  const count = Math.max(4, Math.min(16, Math.ceil(Math.sqrt(numbers.length))));
  const width = (hi - lo) / count;
  const bins = Array.from({length: count}, (_, index) => ({lower: inverse(lo + index * width), upper: inverse(lo + (index + 1) * width), count: 0}));
  for (const value of numbers) bins[Math.min(count - 1, Math.max(0, Math.floor((forward(value) - lo) / width)))].count++;
  return {bins, transformed, minimum, maximum, lowerTransformed: lo, upperTransformed: hi};
}

function auditScreen(county, office, metric) {
  return metric.screen === 'participation' ? county?.participation : county?.offices?.[office]?.reviewScreens?.[metric.screen];
}
function scope(evidence) { return `${evidence?.baselineYear}|${evidence?.currentYear}|${evidence?.seatId || ''}|${evidence?.comparability?.id || ''}`; }

/** Reuse only observations already qualified by the source/seat/district audit. */
export function auditedMetricCohort(report, {office, id, year}, metricKey) {
  const metric = AUDIT_METRICS.find(m => m.key === metricKey);
  if (!metric || Number(year) !== 2026 || report?.schemaVersion !== 3) return {metric, records: [], selected: null, reason: 'A qualified 2026 comparison audit is required.'};
  const selectedCounty = report.counties?.[id];
  const own = auditScreen(selectedCounty, office, metric);
  if (own?.status !== 'assessed' || !Number.isFinite(own.evidence?.[metric.field])) return {metric, records: [], selected: null, reason: own?.reason || 'This county has no qualified value for this comparison.'};
  const records = Object.entries(report.counties).flatMap(([fips, county]) => {
    if (county.stateFips !== selectedCounty.stateFips) return [];
    const screen = auditScreen(county, office, metric), e = screen?.evidence;
    if (screen?.status !== 'assessed' || !Number.isFinite(e?.[metric.field]) || scope(e) !== scope(own.evidence)) return [];
    return [{id: fips, name: county.name, value: e[metric.field], provisional: true, baselineYear: e.baselineYear,
      currentYear: e.currentYear, sourceIds: [e.currentSource?.sourceId, e.priorSource?.sourceId].filter(Boolean), evidence: e}];
  });
  return {metric, records, selected: records.find(r => r.id === id) || null, baselineYear: own.evidence.baselineYear};
}

/** Both parties must actually be identified; a missing nominee is not zero. */
export function twoPartyShare(counts) {
  if ((counts?.reason && counts.namedPartyCounts !== true) || !Number.isInteger(counts?.democrat) || !Number.isInteger(counts?.republican) || counts.democrat < 0 || counts.republican < 0 || counts.democrat + counts.republican < 500) return null;
  return 100 * counts.democrat / (counts.democrat + counts.republican);
}
