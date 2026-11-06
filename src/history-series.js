/** Pure history qualification: missing observations are gaps, never zero votes. */
const integer = value => Number.isInteger(value) && value >= 0;
const excluded = new Set(['overvotes','undervotes','invalidBallots','blankBallots','exhaustedBallots','reportedBallotTotal','absentNomineeSlot']);
const writeIns = new Set(['unattributedWriteIns','sourceWriteInEntries','namedWriteIns']);
const class1 = new Set('04 06 09 10 12 15 18 23 24 25 26 27 28 29 30 31 32 34 35 36 38 39 42 44 47 48 49 50 51 53 54 55 56'.split(' '));
const class2 = new Set('01 02 05 08 10 13 16 17 19 20 21 22 23 25 26 27 28 30 31 33 34 35 37 40 41 44 45 46 47 48 51 54 56'.split(' '));
export function selectHistoryYears({office, years = [], id, stateFips}) {
  const sf = stateFips || String(id || '').slice(0,2);
  return [...new Set(years.map(Number))].filter(y => y >= 2006 && y <= 2026 && (
    office === 'president' ? y % 4 === 0 : office === 'house' ? y % 2 === 0 : office === 'senate' ? y % 2 === 0 && ((y % 6 === 2 && class1.has(sf)) || (y % 6 === 4 && class2.has(sf)) || (y % 6 === 0 && !(class1.has(sf) && class2.has(sf)))) : office === 'governor' ? (['33','50'].includes(sf) ? y % 2 === 0 : ['34','51'].includes(sf) ? y % 4 === 1 : ['21','22','28'].includes(sf) ? y % 4 === 3 : ['10','18','29','30','37','38','49','53','54'].includes(sf) ? y % 4 === 0 : y % 4 === 2) : false
  )).sort((a,b) => a-b);
}
export function qualifiedRaceCounts(rows, {office, year, level, id}) {
  if (office === 'house') return {reason:'House countywide scope requires the separately audited 2022/2026 aggregate.'};
  const matches = (rows || []).filter(r => r.geoLevel === level && (level === 'county' ? r.countyFips === id : r.stateFips === id) && !r.special && ['general','gen','g','general election'].includes(String(r.stage || 'general').toLowerCase()));
  if (matches.length !== 1) return {reason:matches.length ? 'Concurrent seats or ambiguous general contests; not combined.' : 'No unique regular general-election return.'};
  const r = matches[0];
  if (office === 'senate' && ((r.stateFips === '13' && [2020,2022].includes(year)) || r.stateFips === '22')) return {reason:'Senate round identity is not qualified for this historical point.'};
  if (r.sourceNeedsReview || r.incomplete || r.sourceTotalConflict || r.voteTotalMismatch || r.boundaryChanged || r.boundaryIncompatible || r.boundaryNote || r.geographicCoverageNote || r.suppressElectionWinner || r.winnerEligible === false || (r.contestType && r.contestType.toLowerCase() !== 'candidate')) return {reason:'Source, coverage, contest or geographic quality hold.'};
  const sourceCandidates = r.candidates || [];
  if (sourceCandidates.some(c => !integer(c.votes))) return {reason:'Candidate counts missing or unitemized.'};
  const accountingName = /^(?:OVER ?VOTES?|UNDER ?VOTES?|BLANK(?:S| BALLOTS?| VOTES?)?|INVALID(?: BALLOTS?| VOTES?)?|SPOILED(?: BALLOTS?| VOTES?)?|EXHAUSTED BALLOTS?|TOTAL (?:VOTES|BALLOTS) CAST)$/i;
  const candidates = sourceCandidates.filter(c => !accountingName.test(c.name || ''));
  if (!candidates.length || candidates.some(c => !integer(c.votes) || /^(OTHER|OTHERS|OTHER CANDIDATES|ALL OTHER CANDIDATES.*)$/i.test(c.name || ''))) return {reason:'Candidate counts missing or unitemized.'};
  let total = candidates.reduce((n,c) => n+c.votes,0);
  for (const category of r.reportingCategories || []) {
    if (!integer(category.votes)) return {reason:'Missing reporting-category count.'};
    if (excluded.has(category.category)) continue;
    if (!writeIns.has(category.category)) return {reason:'Unknown or unitemized source category; race total withheld.'};
    total += category.votes;
  }
  const party = label => candidates.some(c => c.party === label) ? candidates.filter(c => c.party === label).reduce((n,c) => n+c.votes,0) : null;
  return {total,democrat:party('Democrat'),republican:party('Republican'),provisional:Boolean(r.provisional || r.unofficial || r.resultStatus === 'unofficial'),sourceIds:r.sourceIds || [r.sourceId],seatId:r.seatId || null};
}
export function auditedHouseCounts(report, id, year) {
  if (!['04','30'].includes(String(id).slice(0,2)) || ![2022,2026].includes(year)) return {reason:'Complete House county-district scope is not independently qualified for this year.'};
  const office = report?.counties?.[id]?.offices?.house;
  const race = office?.reviewScreens?.raceVoteChange;
  const party = office?.reviewScreens?.partyCountChange;
  const e = race?.evidence;
  if (race?.status !== 'assessed' || !e?.comparability || e.baselineYear !== 2022 || e.currentYear !== 2026) return {reason:race?.reason || 'Audited whole-county House race totals unavailable.'};
  const current = year === e.currentYear;
  const total = current ? e.currentRaceVotes : e.priorRaceVotes;
  const d = current ? e.currentDemocratVotes : e.priorDemocratVotes;
  const r = current ? e.currentRepublicanVotes : e.priorRepublicanVotes;
  if (!integer(total)) return {reason:'Audited House race count unavailable.'};
  return {total,democrat:party?.status === 'assessed' && integer(d) ? d : null,republican:party?.status === 'assessed' && integer(r) ? r : null,provisional:current,sourceIds:[(current ? e.currentSource : e.priorSource)?.sourceId].filter(Boolean),scope:e.comparability.id};
}
export function historyPoint(year, counts, populations = []) {
  const populationYear = year === 2026 ? 2025 : year;
  const found = populations.filter(p => p.year === populationYear && integer(p.value) && p.value > 0);
  const population = found.length === 1 ? found[0] : null;
  const valid = !counts.reason && integer(counts.total);
  const rate = value => valid && population && integer(value) ? value/population.value*100 : null;
  return {year,...counts,total:valid ? counts.total : null,democrat:valid && integer(counts.democrat) ? counts.democrat : null,republican:valid && integer(counts.republican) ? counts.republican : null,population,populationYear:population?.year ?? null,totalRate:rate(counts.total),democratRate:rate(counts.democrat),republicanRate:rate(counts.republican)};
}
