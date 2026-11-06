import { contestIdentityKey, normalizedStage } from './county-data.js';
import { summarizeRace } from './election-data.js';

// Candidate totals describe a contest, not the number of individual voters.
export function contestMetrics(row) {
  if (!row || !Array.isArray(row.candidates) || summarizeRace(row).qualityNeedsReview) return null;
  const candidates = row.candidates || [];
  const party = (name) => {
    const matching = candidates.filter(c => c.party === name && !/^(OTHER|ALL OTHER CANDIDATES.*|OTHER CANDIDATES)$/i.test(c.name || ''));
    if (!matching.length || matching.some(c => !Number.isFinite(c.votes))) return null;
    return matching.reduce((sum, c) => sum + c.votes, 0);
  };
  const metrics = { total: Number.isFinite(row.totalVotes) ? row.totalVotes : null,
    republican: party('Republican'), democrat: party('Democrat') };
  const categories = Array.isArray(row.reportingCategories) ? row.reportingCategories : [];
  if (categories.some(c => c.category === 'sourceReportingCategory')) {
    // Unclassified source fields (such as VT sv/bv) are preserved but cannot be
    // called candidate votes, ballots, or voters without a source definition.
    const knownVotes = [...candidates, ...categories.filter(c => c.category !== 'sourceReportingCategory')];
    metrics.sourceReportedTotal = metrics.total;
    metrics.total = knownVotes.every(c => Number.isFinite(c.votes))
      ? knownVotes.reduce((sum, c) => sum + c.votes, 0) : null;
    metrics.totalBasis = 'known-candidate-and-write-in-votes';
  }
  return metrics;
}
export function relativeChange(current, previous) {
  return Number.isFinite(current) && Number.isFinite(previous) && previous > 0
    ? (current - previous) / previous * 100 : null;
}
export function compareContest(row, priorRows, office) {
  if (office === 'house') return { reason: 'House district boundaries may have changed; comparison unavailable.' };
  if (office === 'senate' && !row.seatId) return { reason: 'Senate seat identity is unavailable for comparison.' };
  if (row.provisional || row.unofficial || row.incomplete) return { reason: 'Partial or unofficial returns; comparison unavailable.' };
  if (!contestMetrics(row)) return { reason: 'Source needs review; comparison unavailable.' };
  const matches = priorRows.filter(p => contestIdentityKey(p) === contestIdentityKey(row));
  if (matches.length !== 1) return { reason: 'Matching prior contest unavailable.' };
  const prior = matches[0];
  if (prior.provisional || prior.unofficial || prior.incomplete || !contestMetrics(prior))
    return { reason: 'Prior source is partial or needs review.' };
  const a = contestMetrics(row), b = contestMetrics(prior);
  if (a?.totalBasis !== b?.totalBasis) return { reason: 'Source total bases differ; comparison unavailable.' };
  return { total: relativeChange(a?.total, b?.total), republican: relativeChange(a?.republican, b?.republican), democrat: relativeChange(a?.democrat, b?.democrat) };
}
export function previousElectionYear(years, year) {
  return [...years].filter(y => y < year).sort((a,b) => b-a)[0] ?? null;
}

// Expected regular cycles prevent skipping a missing election to manufacture a trend.
export function expectedPriorYear(row, office, year) {
  if (row.special || normalizedStage(row.stage) !== 'general' || (row.contestType && row.contestType !== 'candidate')) return null;
  if (office === 'president') return year - 4;
  if (office === 'governor') return year - (['33', '50'].includes(row.stateFips) ? 2 : 4);
  if (office === 'senate' && row.seatId) return year - 6;
  return null;
}
export function populationAt(records, year) {
  return (records || []).filter(r => Number.isInteger(r.year) && Number.isFinite(r.value) && (year == null || r.year <= year)).sort((a, b) => b.year - a.year)[0] || null;
}

export function populationChange(current, prior) {
  if (!current || !prior || current.year !== prior.year + 1 || !current.sourceId || current.sourceId !== prior.sourceId) return null;
  return relativeChange(current.value, prior.value);
}
