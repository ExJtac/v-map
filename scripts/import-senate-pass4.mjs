/** Offline, exact-source pass4 imports. Shared source/contract/time registers are root-owned. */
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const json = value => `${JSON.stringify(value)}\n`;
const packetRoot = 'scripts/source-data/senate-completion-pass4-2026';
const reviewRoot = 'scripts/source-data/completion-review-2026/pass4';
const checkOnly = process.argv.includes('--check');
assert.ok(process.argv.slice(2).every(value => value === '--check'), 'Only --check is supported.');

function approved(name, expectedReceiptSha, proposalName, expectedProposalSha) {
  const receiptFile = `${reviewRoot}/${name}-source-approval.json`;
  const receiptBytes = fs.readFileSync(receiptFile);
  assert.equal(sha(receiptBytes), expectedReceiptSha, `${name}: changed approval receipt`);
  const receipt = JSON.parse(receiptBytes);
  assert.equal(receipt.status, 'approved');
  assert.ok(Number.isFinite(Date.parse(receipt.reviewedAt)));
  assert.equal(receipt.approvedStateFips, name === 'de-senate' ? '10' : '39');
  assert.equal(receipt.approvedOffice, 'senate');
  assert.equal(receipt.approvedYear, 2026);
  for (const [file, expected] of Object.entries(receipt.inputHashes)) {
    assert.equal(sha(fs.readFileSync(`${packetRoot}/${file}`)), expected, `Changed approved input: ${file}`);
  }
  assert.equal(receipt.inputHashes[proposalName], expectedProposalSha);
  const proposalBytes = fs.readFileSync(`${packetRoot}/${proposalName}`);
  assert.equal(sha(proposalBytes), expectedProposalSha);
  const data = JSON.parse(proposalBytes);
  assert.equal(data.schemaVersion, 1);
  assert.equal(data.office, 'senate');
  assert.equal(data.year, 2026);
  return { receipt, receiptSha: expectedReceiptSha, proposalSha: expectedProposalSha, data };
}

const de = approved('de-senate', 'f05929c42c14efc55162cad46f0da75e7c385c988f30c1391b5cd3d017d4db26', 'proposed-de-senate-2026.json', '949d99abf48d6aa45f9247f94627c38dd18f6e733aed3c35a0c3a5cb2355dc89');
const oh = approved('oh-state', 'dd1aa3f7febb714f8fdaafa3e9fa07f3c391b03256015a7409afc38b6f9cd493', 'proposed-oh-senate-state-2026.json', '4ac3b36feaebd7f5c72a3ad88d4126690f0d90bddb5ea46ef03cf8c8d549b674');

const deSourceId = 'senate-completion-official-de-2026-browser';
const deSource = de.data.sources[deSourceId];
assert.equal(Object.keys(de.data.sources).length, 1);
assert.equal(deSource.sha256, '87ac99a1dd007a99dafe6dffed13c416cda1009ebba7b7a9248f6e0ac4e8682d');
assert.equal(deSource.sourceUrl, 'https://elections.delaware.gov/results/enr/GE2026.html?group=County&filter=USSenator');
assert.equal(deSource.sourceUpdatedAt, null);
assert.equal(deSource.retrievedAt, null);
assert.equal(deSource.retrievedDate, '2026-11-07');
assert.equal(sha(fs.readFileSync('scripts/source-data/senate-current-expansion-2026/snapshots/de2026-result.csv')), deSource.stateControlSha256);
const deCounty = de.data.results.filter(row => row.geoLevel === 'county');
const deState = de.data.results.filter(row => row.geoLevel === 'state');
assert.equal(deCounty.length, de.receipt.approvedCountyRecords);
assert.equal(deState.length, de.receipt.approvedStateRecords);
assert.deepEqual(deCounty.map(row => row.countyFips).sort(), ['10001', '10003', '10005']);
const deNames = ['CHRIS COONS', 'MICHAEL "DR. MIKE" KATZ'];
const deTotals = Object.fromEntries(deState[0].candidates.map(candidate => [candidate.name, candidate.votes]));
assert.deepEqual(deTotals, { 'CHRIS COONS': 240347, 'MICHAEL "DR. MIKE" KATZ': 137764 });
for (const row of de.data.results) {
  assert.equal(row.stateFips, '10'); assert.equal(row.sourceId, deSourceId);
  assert.equal(row.stage, 'general'); assert.equal(row.special, false);
  assert.equal(row.electionDate, '2026-11-03'); assert.equal(row.sourceSeatId, '10-senate-class-2');
  assert.equal(row.sourceUpdatedAt, null); assert.equal(row.retrievedAt, null); assert.equal(row.asOf, null);
  assert.equal(row.retrievedDate, '2026-11-07'); assert.equal(row.sourceTimestampRaw, 'Data as of 11/04/2026 01:03 AM');
  assert.equal(row.seatId, undefined); assert.equal(row.candidates.length, 2);
  assert.deepEqual(row.candidates.map(candidate => candidate.name), deNames);
  assert.deepEqual(row.candidates.map(candidate => candidate.party), ['Democrat', 'Republican']);
  assert.ok(row.candidates.every(candidate => Number.isSafeInteger(candidate.votes) && candidate.votes >= 0));
  assert.equal(row.totalVotes, row.candidates.reduce((sum, candidate) => sum + candidate.votes, 0));
  assert.equal(row.provisional, true); assert.equal(row.unofficial, true); assert.equal(row.finalWinnerNotDeclared, true);
}
for (const name of deNames) assert.equal(deCounty.reduce((sum, row) => sum + row.candidates.find(candidate => candidate.name === name).votes, 0), deTotals[name]);
assert.equal(deState[0].totalVotes, de.receipt.approvedTotalVotes);
assert.equal(deCounty.reduce((sum, row) => sum + row.candidates.length, 0), 6);

// Recheck the exact pre-existing state record, not a county-derived state sum.
assert.equal(sha(fs.readFileSync('public/data/modern-counties/senate-2026.json')), oh.receipt.sourcePins.originalModernBundle);
assert.equal(sha(fs.readFileSync('scripts/source-data/modern-counties/results-2026-oh.csv')), oh.receipt.sourcePins.originalRegisteredCsv);
assert.equal(sha(fs.readFileSync('public/data/senate-specials-oh/senate-2026.json')), oh.receipt.sourcePins.approvedCountyBundle);
assert.equal(oh.data.results.length, 1);
const ohRow = oh.data.results[0];
const original = read('public/data/modern-counties/senate-2026.json');
const originalRows = original.results.filter(row => row.stateFips === '39' && row.geoLevel === 'state');
assert.equal(originalRows.length, 1);
const stripped = { ...ohRow };
for (const field of oh.receipt.approvedChangedFieldsOnly) delete stripped[field];
assert.deepEqual(stripped, originalRows[0], 'Ohio state record changed beyond approved metadata.');
assert.deepEqual(oh.data.sources, { [ohRow.sourceId]: original.sources[ohRow.sourceId] });
assert.equal(ohRow.candidates.length, 7); assert.equal(ohRow.totalVotes, 4601925);
assert.equal(ohRow.special, true); assert.equal(ohRow.electionDate, oh.receipt.approvedElectionDate);
assert.equal(ohRow.sourceSeatId, oh.receipt.approvedSourceSeatId); assert.equal(ohRow.seatId, undefined);
assert.equal(ohRow.sourceUpdatedAt, null);
assert.equal(ohRow.fetchedAt, '2026-11-06T15:06:24+00:00');

const output = new Map();
function plan(name, packet, kind) {
  const target = `public/data/${name}`;
  const review = { status: 'approved', kind, reviewedAt: packet.receipt.reviewedAt, sourceReviewDate: '2026-11-07', evidenceSha256: packet.proposalSha, approvalReceiptSha256: packet.receiptSha };
  if (name === 'senate-completion-de') {
    review.captureSha256 = deSource.sha256;
    review.sourceFormat = 'structured transcription of completed original public browser DOM; not original HTML/API bytes';
    review.retrievedAtBasis = 'Exact intraday browser capture timestamp unavailable; source timezone unspecified; no clock inferred.';
  }
  const data = { ...packet.data, snapshotDate: '2026-11-07', review, limitations: packet.receipt.limitations };
  // Only a top-level wrapper is added. Source dictionaries and rows remain exact.
  assert.deepEqual(data.sources, packet.data.sources);
  assert.deepEqual(data.results, packet.data.results);
  const coverage = { office: 'senate', year: 2026, url: `/data/${name}/senate-2026.json`, geoLevels: [...new Set(data.results.map(row => row.geoLevel))].sort(), rows: data.results.length, stateCount: 1, countyCount: new Set(data.results.filter(row => row.geoLevel === 'county').map(row => row.countyFips)).size, candidateCount: data.results.reduce((sum, row) => sum + row.candidates.length, 0) };
  const file = `${target}/senate-2026.json`;
  output.set(file, json(data));
  const manifest = { schemaVersion: 1, snapshotDate: '2026-11-07', sources: data.sources, coverage: [coverage], review, limitations: packet.receipt.limitations, currentPrimaryRefresh: false };
  output.set(`${target}/manifest.json`, `${JSON.stringify(manifest, null, 2)}\n`);
  return { name, recommendedPriority: 180, descriptor: { name, priority: 180 }, file, url: coverage.url, sha256: sha(output.get(file)), manifestFile: `${target}/manifest.json`, manifestSha256: sha(output.get(`${target}/manifest.json`)), coverage, review };
}
const deBundle = plan('senate-completion-de', de, 'reviewed_rendered_source_county_table');
const ohBundle = plan('senate-state-oh-pass4', oh, 'reviewed_existing_state_row_date_seat_metadata_only');
for (const [file, bytes] of output) {
  if (checkOnly) assert.equal(fs.readFileSync(file, 'utf8'), bytes, `Normalized artifact changed: ${file}`);
  else { fs.mkdirSync(file.slice(0, file.lastIndexOf('/')), { recursive: true }); fs.writeFileSync(file, bytes); }
}

const handoff = {
  schemaVersion: 1,
  status: 'normalized_exact_approved_payloads_shared_wiring_pending_root',
  importer: { file: 'scripts/import-senate-pass4.mjs', sha256: sha(fs.readFileSync('scripts/import-senate-pass4.mjs')), checkCommand: 'node scripts/import-senate-pass4.mjs --check' },
  bundles: [deBundle, ohBundle],
  counts: { deCountyRows: 3, deStateRows: 1, deCountyCandidateCells: 6, deStateCandidateCells: 2, deRaceVoteTotal: 378111, ohStateRows: 1, ohCandidateCells: 7, ohRaceVoteTotal: 4601925, ohioOriginalFieldsPreserved: true },
  ohSpecialContractUpdate: {
    file: 'public/data/senate-special-comparability/2026.json', stateFips: '39',
    addPinnedFileHashes: { [ohBundle.file]: ohBundle.sha256 },
    suggestedSupplementalStateReview: { scope: '2026 state record only', file: ohBundle.file, evidenceSha256: oh.proposalSha, approvalReceiptSha256: oh.receiptSha, reviewedAt: oh.receipt.reviewedAt, metadataOnlyFields: ['electionDate', 'sourceSeatId'] },
    preserve: ['All existing 2022/2026 county file pins', 'Both county mergedVectorSha256 values and inventories', 'Original county scope approval/evidence receipt', 'Class III term, dates, special flags and comparison notes'],
    note: 'A supplemental state-file pin/review does not replace county scope approval or alter any county vector. Root owns any required selected-state source check and shared contract edit.'
  },
  deUnknownClockException: {
    helperFile: 'scripts/reviewed-source-time.mjs', helperName: 'approvedUnknownSourceTime',
    placement: 'Separate DE-only branch before the existing generic sourceReviewDate guard. Approved DE rows/source remain unchanged; top-level review supplies receipt metadata.',
    require: {
      dataOffice: 'senate', dataYear: 2026, sourceId: deSourceId, stateFips: '10', geoLevels: ['county', 'state'], allowedCountyFips: ['10001', '10003', '10005'], special: false, stage: 'general', electionDate: '2026-11-03', sourceSeatId: '10-senate-class-2',
      rowNullFields: ['sourceUpdatedAt', 'retrievedAt', 'asOf'], sourceNullFields: ['sourceUpdatedAt', 'retrievedAt'], rowAndSourceRetrievedDate: '2026-11-07', rowSourceTimestampRaw: 'Data as of 11/04/2026 01:03 AM',
      sourceSha256: deSource.sha256, sourceUrl: deSource.sourceUrl,
      topLevelReview: deBundle.review,
      normalizedFile: deBundle.file, normalizedFileSha256: deBundle.sha256,
    },
    forbidden: ['Invented intraday retrieval/source timezone', 'Global timestamp relaxation', 'Other source IDs/offices/years/states', 'Changing original candidate/count/status/source fields'],
  },
  sharedFilesEdited: [],
  notRun: ['No audit/site build', 'No deployment', 'No schedule change', 'No paid provider or saved-key call'],
};
const handoffFile = `${packetRoot}/import-handoff.json`;
if (checkOnly) assert.deepEqual(read(handoffFile), handoff, 'Importer handoff changed.');
else fs.writeFileSync(handoffFile, `${JSON.stringify(handoff, null, 2)}\n`);
console.log(JSON.stringify({ status: checkOnly ? 'checked' : 'imported', bundles: handoff.bundles.map(bundle => ({ name: bundle.name, sha256: bundle.sha256, rows: bundle.coverage.rows, countyCount: bundle.coverage.countyCount })), counts: handoff.counts, handoffFile, handoffSha256: sha(fs.readFileSync(handoffFile)) }));
