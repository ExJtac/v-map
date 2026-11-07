/** Pure history qualification: missing observations are gaps, never zero votes. */
const integer = value => Number.isInteger(value) && value >= 0;
const excluded = new Set(['overvotes','undervotes','invalidBallots','blankBallots','exhaustedBallots','reportedBallotTotal','absentNomineeSlot']);
const writeIns = new Set(['unattributedWriteIns','sourceWriteInEntries','namedWriteIns']);
const class1 = new Set('04 06 09 10 12 15 18 23 24 25 26 27 28 29 30 31 32 34 35 36 38 39 42 44 47 48 49 50 51 53 54 55 56'.split(' '));
const class2 = new Set('01 02 05 08 10 13 16 17 19 20 21 22 23 25 26 27 28 30 31 33 34 35 37 40 41 44 45 46 47 48 51 54 56'.split(' '));
export function selectHistoryYears({office, years = [], id, stateFips, specialYears = []}) {
  const sf = stateFips || String(id || '').slice(0,2);
  return [...new Set(years.map(Number))].filter(y => y >= 2006 && y <= 2026 && (
    office === 'president' ? y % 4 === 0 : office === 'house' ? y % 2 === 0 : office === 'senate' ? y % 2 === 0 && (specialYears.includes(y) || (y % 6 === 2 && class1.has(sf)) || (y % 6 === 4 && class2.has(sf)) || (y % 6 === 0 && !(class1.has(sf) && class2.has(sf)))) : office === 'governor' ? (['33','50'].includes(sf) ? y % 2 === 0 : ['34','51'].includes(sf) ? y % 4 === 1 : ['21','22','28'].includes(sf) ? y % 4 === 3 : ['10','18','29','30','37','38','49','53','54'].includes(sf) ? y % 4 === 0 : y % 4 === 2) : false
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
  if (!candidates.length) return {reason:'Candidate counts missing or unitemized.'};
  const party = label => candidates.some(c => c.party === label) ? candidates.filter(c => c.party === label).reduce((n,c) => n+c.votes,0) : null;
  const named = {democrat:party('Democrat'),republican:party('Republican'),provisional:Boolean(r.provisional || r.unofficial || r.resultStatus === 'unofficial'),sourceIds:r.sourceIds || [r.sourceId],seatId:r.seatId || null};
  if ((r.reportingCategories || []).some(category => !integer(category.votes))) return {reason:'Missing reporting-category count.'};
  if (candidates.some(c => /^(OTHER|OTHERS|OTHER CANDIDATES|ALL OTHER CANDIDATES.*)$/i.test(c.name || ''))) return {...named,namedPartyCounts:true,reason:'Candidate counts missing or unitemized; race total withheld, identified party counts retained.'};
  let total = candidates.reduce((n,c) => n+c.votes,0);
  for (const category of r.reportingCategories || []) {
    if (!integer(category.votes)) return {reason:'Missing reporting-category count.'};
    if (excluded.has(category.category)) continue;
    if (!writeIns.has(category.category)) return {...named,namedPartyCounts:true,reason:'Unknown or unitemized source category; race total withheld, identified party counts retained.'};
    total += category.votes;
  }
  return {total,...named};
}
export function auditedHouseCounts(report, id, year) {
  if (![2022,2026].includes(year)) return {reason:'Complete House county-district scope is not independently qualified for this year.'};
  const state=String(id).slice(0,2),contract=state==='04'?report?.comparabilityContracts?.azHouse:state==='30'?report?.comparabilityContracts?.montanaHouse:report?.comparabilityContracts?.houseStates?.[state];
  if(!contract?.verified)return {reason:contract?.reason||'Complete House county-district scope is not independently qualified for this state.'};
  const office = report?.counties?.[id]?.offices?.house;
  const race = office?.reviewScreens?.raceVoteChange;
  const e = race?.evidence;
  if (race?.status !== 'assessed' || !e?.comparability || e.comparability.id!==contract.id || e.baselineYear !== 2022 || e.currentYear !== 2026) return {reason:race?.reason || 'Audited whole-county House race totals unavailable.'};
  return auditedPairCounts(e,year);
}
/** Read only an already-assessed regular Class II pair; never infer a new match. */
export function auditedRegularSenateCounts(report,id,year){
  const state=String(id).slice(0,2),race=report?.counties?.[id]?.offices?.senate?.reviewScreens?.raceVoteChange,e=race?.evidence;
  if(![2020,2026].includes(year)||!class2.has(state)||['13','22'].includes(state)||report?.comparabilityContracts?.senateClass2?.id!=='regular-class-2-2020-2026'||race?.status!=='assessed'||e?.office!=='senate'||e.baselineYear!==2020||e.currentYear!==2026||e.comparability?.id!==`${state}-senate-class-2`||e.seatId!==`${state}-senate-class-2`)return {reason:'No assessed regular Class II Senate pair for this county and year.'};
  return auditedPairCounts(e,year);
}
export function auditedSenateRoundCounts(report,id,year) {
  const state=String(id).slice(0,2),contract=report?.comparabilityContracts?.senateSpecials?.[state]||report?.comparabilityContracts?.senateRounds?.[state];
  if(!contract?.verified)return {reason:'Senate seat and ballot scope are not independently qualified.'};
  const baselineYear=contract.baselineYear||2020;
  if(![baselineYear,2026].includes(year))return {reason:'This reviewed Senate comparison does not qualify the requested year or a different ballot round.'};
  const race=report?.counties?.[id]?.offices?.senate?.reviewScreens?.raceVoteChange,e=race?.evidence;
  if(race?.status!=='assessed'||e?.comparability?.id!==contract.id||e.baselineYear!==baselineYear||e.currentYear!==2026)return {reason:race?.reason||'Audited same-seat Senate race totals unavailable.'};
  return {...auditedPairCounts(e,year),roundBasis:contract.basis};
}
function auditedPairCounts(e,year) {
  const current = year === e.currentYear;
  const total = current ? e.currentRaceVotes : e.priorRaceVotes;
  const typed=current?e.currentNamedPartyCounts:e.priorNamedPartyCounts;
  const d=typed?typed.democrat:current?e.currentDemocratVotes:e.priorDemocratVotes;
  const r=typed?typed.republican:current?e.currentRepublicanVotes:e.priorRepublicanVotes;
  if (!integer(total)) return {reason:'Audited race count unavailable.'};
  return {total,democrat:integer(d)?d:null,republican:integer(r)?r:null,provisional:current,sourceIds:[...new Set([...(current?e.currentSource:e.priorSource)?.sourceIds||[],(current?e.currentSource:e.priorSource)?.sourceId].filter(Boolean))],scope:e.comparability.id};
}
export function historyPoint(year, counts, populations = []) {
  const populationYear = year === 2026 ? 2025 : year;
  const found = populations.filter(p => p.year === populationYear && integer(p.value) && p.value > 0);
  const population = found.length === 1 ? found[0] : null;
  const valid = !counts.reason && integer(counts.total);
  const validParty = valid || counts.namedPartyCounts === true;
  const rate = (value, qualified) => qualified && population && integer(value) ? value/population.value*100 : null;
  return {year,...counts,total:valid ? counts.total : null,democrat:validParty && integer(counts.democrat) ? counts.democrat : null,republican:validParty && integer(counts.republican) ? counts.republican : null,population,populationYear:population?.year ?? null,totalRate:rate(counts.total,valid),democratRate:rate(counts.democrat,validParty),republicanRate:rate(counts.republican,validParty)};
}
