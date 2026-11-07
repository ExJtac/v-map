import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {readFile} from 'node:fs/promises';
import {AUDIT_METRICS, median, quantile, describePeerPosition, histogram, auditedMetricCohort, twoPartyShare} from '../src/statistical-math.js';

const close = (actual, expected, tolerance = 1e-9) => assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
const original = [9, 1, 3, 7];
assert.equal(median(original), 5); assert.deepEqual(original, [9, 1, 3, 7]);
assert.equal(median([]), null); assert.equal(median([null, undefined, NaN, Infinity]), null);
close(quantile([0, 10], .1), 1); close(quantile([0, 10], .9), 9);
assert.equal(quantile([1], -1), null);

let described = describePeerPosition(5, Array.from({length: 11}, (_, i) => i));
assert.equal(described.status, 'described'); close(described.percentile, 50);
assert.equal(described.tieCount, 1); assert.equal(described.atLeastAsFarCount, 11);
assert.equal(described.median, 5); assert.equal(described.mad, 3); assert.equal(described.modifiedZ, 0);
described = describePeerPosition(20, Array.from({length: 10}, (_, i) => i));
assert.equal(described.percentile, 100); assert.equal(described.atLeastAsFarCount, 0); assert.equal(described.tailFraction, 0);
assert.equal(describePeerPosition(1, [1, 2, 3]).status, 'unavailable');
assert.equal(describePeerPosition(null, Array(20).fill(1)).status, 'unavailable');
described = describePeerPosition(10, Array(10).fill(5));
assert.equal(described.modifiedZ, null); assert.match(described.scoreReason, /MAD is zero/);
assert.equal(described.tailFraction, 0); assert.equal(describePeerPosition(5, Array(10).fill(5)).tailFraction, 1);
close(describePeerPosition(5, Array(10).fill(5)).percentile, 50);
const values = [-20, -10, -5, -4, 1, 2, 4, 5, 10, 30];
const left = describePeerPosition(7, values), right = describePeerPosition(-7, values.map(v => -v));
close(left.percentile + right.percentile, 100); close(left.modifiedZ, -right.modifiedZ); close(left.tailFraction, right.tailFraction);

for (const values of [Array(10).fill(0), [-1, 0, 1], [-100, 0, 1, 5000], [0]]) {
  const chart = histogram(values, 2);
  assert.equal(chart.bins.reduce((n, bin) => n + bin.count, 0), values.length);
  assert.ok(chart.bins.every(bin => Number.isFinite(bin.lower) && Number.isFinite(bin.upper) && bin.upper > bin.lower));
}
assert.equal(histogram([], 1).bins.length, 0); assert.equal(histogram([-100, 5000], 0).transformed, true);
assert.equal(twoPartyShare({democrat: 500, republican: 0}), 100);
assert.equal(twoPartyShare({democrat: 0, republican: 500}), 0);
assert.equal(twoPartyShare({democrat: 500, republican: null}), null);
assert.equal(twoPartyShare({democrat: 10, republican: 10}), null);
assert.equal(twoPartyShare({democrat: 500, republican: 500, reason: 'Held'}), null);
assert.equal(twoPartyShare({democrat: 500, republican: 500, reason: 'Race total withheld', namedPartyCounts: true}), 50);

const report = JSON.parse(readFileSync(new URL('../public/data/anomalies-2026.json', import.meta.url)));
const context = {office: 'governor', year: 2026, id: '48479'};
const beforeFlags = JSON.stringify(report.counties['48479'].offices.governor.flags);
const cohort = auditedMetricCohort(report, context, 'democratGrowth');
assert.ok(cohort.selected); close(cohort.selected.value, 49.480778, 1e-6);
assert.equal(cohort.baselineYear, 2022);
assert.ok(cohort.records.every(r => r.id.startsWith('48') && r.baselineYear === 2022 && r.currentYear === 2026));
const peers = cohort.records.filter(r => r.id !== context.id);
described = describePeerPosition(cohort.selected.value, peers.map(r => r.value));
assert.equal(described.peerCount, peers.length); assert.equal(described.status, 'described');
assert.equal(JSON.stringify(report.counties['48479'].offices.governor.flags), beforeFlags, 'Statistics must not change the user’s border rules.');
assert.ok(JSON.parse(beforeFlags).some(f => f.id === 'governor-party-count-change'));
assert.equal(auditedMetricCohort(report, {...context, year: 2022}, 'democratGrowth').selected, null);
assert.equal(auditedMetricCohort(report, {...context, office: 'house'}, 'democratGrowth').selected, null, 'Unqualified House scope must stay unavailable.');
for (const office of ['house', 'senate']) {
  const metric = AUDIT_METRICS.find(m => m.key === 'shareSwing');
  const [id] = Object.entries(report.counties).find(([, c]) => c.offices[office].reviewScreens[metric.screen].status === 'assessed');
  const result = auditedMetricCohort(report, {office, year: 2026, id}, metric.key);
  assert.ok(result.selected); assert.ok(result.records.every(r => r.baselineYear === result.selected.baselineYear));
  if (office === 'senate') assert.ok(result.records.every(r => r.evidence.seatId === result.selected.evidence.seatId));
  if (office === 'house') assert.ok(result.records.every(r => r.evidence.comparability.id === result.selected.evidence.comparability.id));
}
const ballots = auditedMetricCohort(report, {office: 'governor', year: 2026, id: '06001'}, 'ballotPopulation');
assert.ok(ballots.selected); assert.ok(ballots.records.every(r => Number.isInteger(r.evidence.reportedBallots) && !('currentRaceVotes' in r.evidence)));

// Exercise actual packaged source loaders and renderer without browser/network side effects.
class TestNode {
  constructor(tag = '#text') { this.tagName = tag; this.children = []; this.attributes = {}; this.listeners = {}; this.parentNode = null; this._text = ''; }
  set textContent(value) { this._text = String(value); this.children = []; }
  get textContent() { return this._text + this.children.map(c => c.textContent).join(' '); }
  append(...nodes) { for (const node of nodes) { node.parentNode = this; this.children.push(node); } }
  replaceChildren(...nodes) { this._text = ''; this.children = []; this.append(...nodes); }
  remove() { if (this.parentNode) this.parentNode.children = this.parentNode.children.filter(n => n !== this); }
  setAttribute(name, value) { this.attributes[name] = value; }
  addEventListener(name, callback) { this.listeners[name] = callback; }
}
const oldDocument = globalThis.document, oldWindow = globalThis.window, oldFetch = globalThis.fetch;
let auditRequests = 0;
globalThis.document = {createElement: tag => new TestNode(tag), createElementNS: (ns, tag) => new TestNode(tag), createTextNode: text => { const node = new TestNode(); node.textContent = text; return node; }};
globalThis.window = {innerWidth: 390};
globalThis.fetch = async url => {
  if (String(url).includes('anomalies-2026')) auditRequests++;
  assert.ok(String(url).startsWith('/data/'), `Unexpected fetch: ${url}`);
  try { return new Response(await readFile(new URL('../public' + url, import.meta.url)), {status: 200, headers: {'content-type': 'application/json'}}); }
  catch (error) { if (error.code === 'ENOENT') return new Response('', {status: 404}); throw error; }
};
function descendants(node, tag) { return [...node.children.flatMap(n => [n, ...descendants(n, tag)])].filter(n => n.tagName === tag); }
try {
  const {renderSelectedStatistics, snapshotShareCounts} = await import('../src/statistical-review.js');
  const shareRow = {geoLevel: 'county', countyFips: '08031', stateFips: '08', stage: 'general', special: false, candidates: [{name: 'Named D', party: 'Democrat', votes: 600}, {name: 'Named R', party: 'Republican', votes: 400}, {name: 'OTHER', party: 'Other', votes: 20}], totalVotes: 1020, sourceId: 'test'};
  const shareContext = {office: 'president', year: 2024, level: 'county', id: '08031'};
  assert.equal(twoPartyShare(snapshotShareCounts([shareRow], shareContext)), 60);
  for (const held of [{...shareRow, sourceNeedsReview: true}, {...shareRow, boundaryIncompatible: true}, {...shareRow, voteTotalMismatch: true}, {...shareRow, special: true}, {...shareRow, candidates: [...shareRow.candidates.slice(0, 2), {...shareRow.candidates[2], votes: null}]}]) assert.equal(twoPartyShare(snapshotShareCounts([held], shareContext)), null);
  const container = new TestNode('div');
  await renderSelectedStatistics(container, {...context, name: 'Webb', level: 'county', report});
  assert.equal(descendants(container, 'svg').length, 1);
  assert.equal(descendants(container, 'select').length, 1);
  assert.ok(descendants(container, 'option').length >= 5);
  assert.equal(descendants(container, 'svg')[0].attributes.viewBox, '0 0 360 260');
  assert.match(container.textContent, /49\.5%/); assert.match(container.textContent, /not a p-value/);
  assert.doesNotMatch(container.textContent, /NaN|undefined/);
  const select = descendants(container, 'select')[0]; select.value = '0'; select.listeners.change();
  assert.equal(descendants(container, 'svg').length, 1, 'Changing metrics must replace the graph.');
  assert.equal(descendants(container, 'table').length, 1);
  assert.equal(auditRequests, 0, 'Do not download a second copy of the large audit.');
  const earlier = renderSelectedStatistics(container, {office: 'president', year: 2024, id: '08031', name: 'Denver', level: 'county', report});
  await renderSelectedStatistics(container, {office: 'president', year: 2024, id: '08', name: 'Colorado', level: 'state', report});
  await earlier;
  assert.match(container.textContent, /Select a county/); assert.equal(descendants(container, 'svg').length, 0, 'A stale county response must not replace state instructions.');
  await renderSelectedStatistics(container, {office: 'president', year: 2024, id: '08031', name: 'Denver', level: 'county', report});
  assert.match(container.textContent, /President · 2024/); assert.equal(descendants(container, 'svg').length, 1, container.textContent);
} finally { globalThis.document = oldDocument; globalThis.window = oldWindow; globalThis.fetch = oldFetch; }
console.log(JSON.stringify({status: 'passed', verified: ['quantiles and immutability', 'ties and zero MAD', 'minimum peers and null handling', 'party reflection symmetry', 'histogram mass and signed-log display', 'explicit zero versus missing party', 'real Webb rule preserved', 'actual Senate seat and House scope', 'actual-ballot separation', 'actual-source renderer', 'mobile SVG and metric replacement', 'historical 2024 distribution', 'stale response guard', 'no duplicate audit download'], webbOtherPeers: peers.length, webbPercentile: described.percentile}));
