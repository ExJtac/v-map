import { summarizeRace } from './election-data.js';
import { geographicContestKey, normalizedStage } from './county-data.js';

export const OFFICE_ORDER = ['president', 'senate', 'house', 'governor'];
export function candidateRecord(row, { office, year, sources = {} }) {
  // County portions are never election-wide outcomes or another copy of a seat.
  if (row.geoLevel !== (office === 'house' ? 'district' : 'state')) return null;
  const stage = office === 'senate' && row.stateFips === '13' && [2020,2022].includes(year) && normalizedStage(row.stage) === 'general' ? 'first round' : normalizedStage(row.stage);
  const summary = summarizeRace(row);
  const invalid = [...(row.candidates || []), ...(row.reportingCategories || [])].some(c => !Number.isSafeInteger(c.votes) || c.votes < 0);
  const accounting = /^(?:WRITE[ -]?INS?|ALL WRITE[ -]?INS?|OTHER|OTHERS|ALL OTHER CANDIDATES.*|SCATTERING|SCATTERED|BLANK.*|OVER ?VOTES?|UNDER ?VOTES?)$/i;
  const badTotal = row.totalVotes != null && (!Number.isSafeInteger(row.totalVotes) || row.totalVotes < 0 || (row.candidates || []).reduce((n,c)=>n+(Number.isSafeInteger(c.votes)?c.votes:0),0) > row.totalVotes);
  const eligible = !invalid && !badTotal && !summary.qualityNeedsReview && !summary.outcomeSuppressed && !summary.tied && summary.winner && String(summary.winner.name || '').trim() && !accounting.test(summary.winner.name);
  const leader = eligible ? summary.winner : null;
  const named = (row.candidates || []).filter(c => !accounting.test(c.name)).sort((a,b)=>b.votes-a.votes);
  const writeInBuckets = (row.candidates || []).filter(c => /^(?:WRITE[ -]?INS?|ALL WRITE[ -]?INS?|SCATTERING|SCATTERED)$/i.test(c.name)).reduce((n,c)=>n+(c.votes||0),0)
    + (row.reportingCategories || []).filter(c=>/unattributedWriteIns|unitemizedWriteIns/i.test(c.category||'')).reduce((n,c)=>n+(c.votes||0),0);
  const uncertainWriteInRunnerUp = writeInBuckets > (named[1]?.votes ?? 0);
  const provisional = Boolean(row.provisional || row.unofficial || row.incomplete || row.resultStatus === 'unofficial' || (year === 2026 && row.certified !== true));
  const reason = summary.tied ? 'Tied reported count' : summary.outcomeSuppressed ? 'Conditional or ineligible outcome' : !leader ? 'Unavailable or source held' : provisional ? 'Provisional reported leader' : 'Recorded vote leader';
  const sourceIds = row.sourceIds || [row.sourceId];
  const urls = [...new Set([...(row.sourceLinks || []), ...sourceIds.flatMap(id => [sources[id]?.sourceUrl, sources[id]?.url])].filter(url => typeof url === 'string' && /^https?:\/\//.test(url)))];
  return {
    key: `${office}|${year}|${geographicContestKey({...row,office,year})}`, office, year, stateFips: row.stateFips, state: row.state || row.stateAbbr || row.stateFips,
    district: row.district ?? null, seat: row.seatId || row.sourceSeatId || null, seatClass: [1,2,3].includes(Number(row.seatClass)) ? Number(row.seatClass) : null, stage, special: Boolean(row.special),
    contestType: row.contestType || null, electionDate: row.electionDate || null,
    leader: leader ? { name: leader.name, party: leader.party || 'Other', votes: leader.votes, share: summary.share, margin: uncertainWriteInRunnerUp ? null : summary.margin } : null,
    status: reason, provisional, certifiedCount: row.certified === true && !provisional,
    sourceIds, sourceLinks: urls, sourceUpdatedAt: row.sourceUpdatedAt || null,
    retrievedAt: row.retrievedAt || row.fetchedAt || null, timestampBasis: row.sourceTimestampBasis || row.asOfBasis || null,
  };
}

export function orderCandidates(rows, sort = 'office') {
  const alphabetical = (a,b) => OFFICE_ORDER.indexOf(a.office) - OFFICE_ORDER.indexOf(b.office)
    || a.state.localeCompare(b.state) || Number(a.district ?? 0) - Number(b.district ?? 0)
    || String(a.seat || '').localeCompare(String(b.seat || '')) || Number(a.special) - Number(b.special)
    || a.stage.localeCompare(b.stage) || a.key.localeCompare(b.key);
  const numeric = (a,b,key) => (b.leader?.[key] ?? -Infinity) - (a.leader?.[key] ?? -Infinity);
  return [...rows].sort((a,b) => (sort === 'margin' ? numeric(a,b,'margin') : sort === 'share' ? numeric(a,b,'share') : sort === 'name' ? (a.leader?.name || '\uffff').localeCompare(b.leader?.name || '\uffff') : 0) || alphabetical(a,b));
}
