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
export function isLargePartyChange(value) {
  return Number.isFinite(value) && Math.abs(value) > 15;
}
export function formatPartyChange(value) {
  if (!Number.isFinite(value)) return 'N/A';
  const digits = Math.abs(value) > 15 && Math.abs(value) < 15.05 ? 2 : 1;
  return `${value >= 0 ? '+' : ''}${value.toFixed(digits)}%`;
}
export function compareContest(row, priorRows, office) {
  if (office === 'house') return { reason: 'House district boundaries may have changed; comparison unavailable.' };
  if (office === 'senate' && !row.seatId) return { reason: 'Senate seat identity is unavailable for comparison.' };
  if (row.incomplete && !row.provisional && !row.unofficial) return { reason: 'Partial returns; comparison unavailable.' };
  if (!contestMetrics(row)) return { reason: 'Source needs review; comparison unavailable.' };
  const matches = priorRows.filter(p => contestIdentityKey(p) === contestIdentityKey(row));
  if (matches.length !== 1) return { reason: 'Matching prior contest unavailable.' };
  const prior = matches[0];
  if (prior.provisional || prior.unofficial || prior.incomplete || !contestMetrics(prior))
    return { reason: 'Prior source is partial or needs review.' };
  const a = contestMetrics(row), b = contestMetrics(prior);
  if (a?.totalBasis !== b?.totalBasis) return { reason: 'Source total bases differ; comparison unavailable.' };
  return { total: relativeChange(a?.total, b?.total), republican: relativeChange(a?.republican, b?.republican), democrat: relativeChange(a?.democrat, b?.democrat), provisional: Boolean(row.provisional || row.unofficial) };
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

// Countywide ballots are sourced independently of any candidate contest.
export function regularNovemberBallot(records, year) {
  const matches = (records || []).filter(r => r.year === year &&
    new RegExp(`^${year}-11-\\d{2}$`).test(r.electionDate || '') &&
    !r.special && normalizedStage(r.stage) === 'general');
  return matches.length === 1 ? matches[0] : null;
}
export function ballotComparison(records, year, regular) {
  const priorYear = year - 4;
  if (!regular) return { priorYear, reason: 'Regular November election not established.' };
  const current = regularNovemberBallot(records, year);
  const prior = regularNovemberBallot(records, priorYear);
  if (!current || !prior) return { priorYear, reason: 'Comparable county ballot totals unavailable.' };
  if (current.sourceNeedsReview || prior.sourceNeedsReview || current.boundaryIncompatible || prior.boundaryIncompatible || current.boundaryChanged || prior.boundaryChanged || current.boundaryNote || prior.boundaryNote)
    return { priorYear, reason: 'Source or county boundaries need review.' };
  if (prior.provisional || prior.unofficial || prior.incomplete)
    return { priorYear, reason: 'Prior ballot total is not final.' };
  if (!(prior.certified === true || prior.final === true || (prior.provisional === false && prior.unofficial === false)))
    return { priorYear, reason: 'Prior ballot total has no final-status evidence.' };
  if (!Number.isFinite(current.ballotsCast) || current.ballotsCast < 0 || !(prior.ballotsCast > 0)) return { priorYear, reason: 'Comparable ballot totals unavailable.' };
  const value = relativeChange(current.ballotsCast, prior.ballotsCast);
  if (value == null) return { priorYear, reason: 'Comparable county ballot totals unavailable.' };
  return { priorYear, value, prior, provisional: Boolean(current.provisional || current.unofficial || current.incomplete) };
}

// This is a ratio to all residents, including children, not an eligible-voter rate.
export function ballotsPerResident(ballots, population) {
  return Number.isFinite(ballots) && ballots >= 0 && Number.isFinite(population) && population > 0
    ? ballots / population * 100 : null;
}

// A separately labeled race-vote ratio, never a replacement ballot/voter total.
export function contestVotesPerResident(rows, office, population) {
  if (!['president', 'senate', 'governor'].includes(office) || rows?.length !== 1) return null;
  const row = rows[0];
  if (!['county', 'state'].includes(row.geoLevel) || row.special || normalizedStage(row.stage) !== 'general' ||
      (row.contestType && row.contestType !== 'candidate') || row.boundaryIncompatible || row.boundaryChanged ||
      row.boundaryNote || row.geographicCoverageNote || row.suppressElectionWinner || row.winnerEligible === false) return null;
  const metrics = contestMetrics(row);
  if (!metrics || row.candidates.some(candidate => !Number.isInteger(candidate.votes) || candidate.votes < 0)) return null;
  const categories = row.reportingCategories || [];
  const writeIns = categories.filter(item => item.category === 'sourceWriteInEntries' || /^(write[-_ ]?ins?|writeincount)$/i.test(item.category || ''));
  if (writeIns.some(item => !Number.isInteger(item.votes) || item.votes < 0)) return null;
  const votes = [...row.candidates, ...writeIns].reduce((sum, candidate) => sum + candidate.votes, 0);
  const value = ballotsPerResident(votes, population);
  return value == null ? null : { value, votes, provisional: Boolean(row.provisional || row.unofficial || row.incomplete), knownCandidateBasis: categories.length > 0 || votes !== row.totalVotes };
}

export function votingMethodShares(ballot) {
  if (!ballot || !Number.isFinite(ballot.ballotsCast) || ballot.ballotsCast <= 0) return null;
  const mail = ballot.voteByMailVoters, precinct = ballot.precinctVoters;
  if (!Number.isInteger(mail) || !Number.isInteger(precinct) || mail < 0 || precinct < 0 || mail + precinct !== ballot.ballotsCast) return null;
  return { mail: mail / ballot.ballotsCast * 100, precinct: precinct / ballot.ballotsCast * 100 };
}
