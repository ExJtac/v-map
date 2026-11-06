/** Pure exploratory screens. No I/O, forecasts, p-values, or fraud/error attribution. */
export const OFFICES = ['president', 'senate', 'house', 'governor'];
export const PATTERN_CRITERIA = Object.freeze({ minBallots: 100, minResidents: 1000, minPeers: 10, minDistancePp: 10, modifiedZThreshold: 3.5, minHistoricalParticipationChangePp: 10, minTwoPartyVotes: 500, minPriorPartyVotes: 100 });
export const METHOD_SOURCE = { title: 'NIST/SEMATECH: exploratory outlier screening (modified z score)', url: 'https://itl.nist.gov/div898/handbook/eda/section3/eda35h.htm' };
const round = x => Number.isFinite(x) ? Math.round(x * 1e6) / 1e6 : null;
export function median(values) { const a = [...values].sort((a,b)=>a-b), n=a.length; return n ? (a[Math.floor((n-1)/2)]+a[Math.floor(n/2)])/2 : null; }
export function peerScreen(value, peers, criteria=PATTERN_CRITERIA) {
  if (!Number.isFinite(value) || peers.length < criteria.minPeers || peers.some(v=>!Number.isFinite(v))) return null;
  const center=median(peers), mad=median(peers.map(v=>Math.abs(v-center))), distance=value-center;
  const z=mad>0 ? .6745*distance/mad : null;
  return { peerCount:peers.length, peerMedian:round(center), peerMad:round(mad), distancePp:round(distance), modifiedZ:round(z), scoreBasis:mad===0?'MAD is zero; absolute-distance threshold only':'0.6745 × (value − peer median) / peer MAD', outside:Math.abs(distance)>=criteria.minDistancePp && (mad===0 || Math.abs(z)>criteria.modifiedZThreshold) };
}
const notAssessed=reason=>({status:'not-assessed',flags:[],reason});
const regular=r=>!r.special && ['general','gen','g'].includes(String(r.stage||'general').toLowerCase()) && (!r.contestType || r.contestType==='candidate');
function qualityReason(r, prior=false) {
  if (!r) return 'Matching source record unavailable.';
  if (r.sourceNeedsReview || r.sourceTotalConflict || r.voteTotalMismatch) return 'Source quality hold or inconsistent totals.';
  if (r.incomplete) return 'Source explicitly marks incomplete coverage.';
  if (r.boundaryChanged || r.boundaryIncompatible || r.boundaryNote || r.geographicCoverageNote) return 'Geographic boundary or jurisdiction comparability is unproven.';
  if (prior && (r.provisional || r.unofficial)) return 'Prior baseline is provisional or unofficial.';
  return null;
}
function sourceRefs(sources, ids) { return [...new Set(ids.filter(Boolean))].map(id=>{const s=sources[id]||{};return {sourceId:id,title:s.title||id,url:s.url||s.sourceUrl||null,...(s.retrievedAt?{retrievedAt:s.retrievedAt}:{})};}).filter(s=>s.url); }
function exactPopulation(populations, fips, year) { const rows=(populations.counties?.[fips]||[]).filter(p=>p.year===year);return rows.length===1?rows[0]:null; }
function exactBallot(turnout,fips,year) { const rows=(turnout.counties?.[fips]||[]).filter(r=>r.year===year && regular(r) && new RegExp(`^${year}-11-\\d{2}$`).test(r.electionDate||''));return rows.length===1?rows[0]:null; }
function participationInput(fips,populations,turnout,criteria) {
  const current=exactBallot(turnout,fips,2026), prior=exactBallot(turnout,fips,2022);
  if (!current) return {reason:'Actual countywide 2026 regular-November ballots unavailable; candidate votes are not substituted.'};
  const problem=qualityReason(current);if(problem)return {reason:problem};
  if (!Number.isInteger(current.ballotsCast) || current.ballotsCast<criteria.minBallots) return {reason:'Fewer than 100 explicitly reported ballots, or ballot count missing.'};
  const population=exactPopulation(populations,fips,2025);
  if (!population || population.value<criteria.minResidents || !Number.isInteger(population.value)) return {reason:'Exact 2025 resident population unavailable or below 1,000.'};
  const currentRate=current.ballotsCast/population.value*100;
  const base={current,population,currentRate};
  const historicalPopulation=exactPopulation(populations,fips,2022);
  const priorProblem=qualityReason(prior,true);
  if (priorProblem || !(prior?.certified===true || prior?.final===true) || !historicalPopulation || historicalPopulation.value<criteria.minResidents || !Number.isInteger(prior?.ballotsCast) || prior.ballotsCast<criteria.minBallots) return {...base,reason:'Comparable final 2022 ballots and exact 2022 population unavailable or below minimums.'};
  return {...base,prior,historicalPopulation,historicalRate:prior.ballotsCast/historicalPopulation.value*100};
}
function partyInput(row, prior, criteria) {
  const reason=qualityReason(row)||qualityReason(prior,true);if(reason)return {reason};
  if (!regular(row)||!regular(prior))return {reason:'Comparable regular general-election contests not established.'};
  for(const r of [row,prior]) {
    if (!Array.isArray(r.candidates)||r.candidates.some(c=>!Number.isInteger(c.votes)||c.votes<0))return {reason:'Candidate count missing, nonintegral or negative.'};
    if (r.candidates.some(c=>/^(OTHER|ALL OTHER CANDIDATES.*|OTHER CANDIDATES)$/i.test(c.name||'')) || (r.reportingCategories||[]).some(c=>/unitemized|other.*candidates|candidates.*aggregat|sourceReportingCategory/i.test(c.category||'') || c.votes===null)) return {reason:'Unitemized candidates or unclassified/missing reporting categories prevent a qualified party comparison.'};
    if (r.suppressElectionWinner || r.winnerEligible===false)return {reason:'Ballot question or conditional contest is not comparable to a regular candidate election.'};
  }
  const counts=r=>{const d=r.candidates.filter(c=>c.party==='Democrat'),p=r.candidates.filter(c=>c.party==='Republican');return d.length&&p.length?{democrat:d.reduce((n,c)=>n+c.votes,0),republican:p.reduce((n,c)=>n+c.votes,0)}:null;};
  const a=counts(row),b=counts(prior);if(!a||!b)return {reason:'Both explicitly identified Democratic and Republican candidates are required; Other votes are not reassigned.'};
  if(a.democrat+a.republican<criteria.minTwoPartyVotes || b.democrat+b.republican<criteria.minTwoPartyVotes || b.democrat<criteria.minPriorPartyVotes || b.republican<criteria.minPriorPartyVotes)return {reason:'Two-party minimum of 500 each year or 100 votes for each prior party not met.'};
  return {row,prior,current:a,historical:b,currentShare:a.democrat/(a.democrat+a.republican)*100,priorShare:b.democrat/(b.democrat+b.republican)*100,shift:(a.democrat/(a.democrat+a.republican)-b.democrat/(b.democrat+b.republican))*100};
}
function countyRows(data,fips) { return (data?.results||[]).filter(r=>r.geoLevel==='county'&&r.countyFips===fips); }
function matchingPair(office,fips,elections,criteria) {
  if(office==='president')return {reason:'No 2026 presidential election; office-specific shift screen not applicable.'};
  const current=countyRows(elections[`${office}-2026`],fips);
  if(!current.length)return {reason:'No imported 2026 county contest for this office.'};
  if(office==='house')return {reason:'Complete comparable county-district coverage and unchanged boundaries are not established; no district allocation is inferred.'};
  const rows=current.filter(regular);
  if(rows.length!==1)return {reason:'A unique regular current county contest is not established.'};
  const row=rows[0];
  if(row.stateFips!==fips.slice(0,2)||row.district!=null)return {reason:'Current county/state identity or statewide-office geography is inconsistent.'};
  let baselineYear=2022;
  if(office==='senate') {
    if(!row.seatId)return {reason:'Explicit comparable Senate seat identity is unavailable.'};
    baselineYear=2020;
  }
  const matches=countyRows(elections[`${office}-${baselineYear}`],fips).filter(p=>regular(p)&&p.stateFips===row.stateFips&&(p.contestType||'candidate')===(row.contestType||'candidate')&&(office!=='senate'||p.seatId===row.seatId));
  if(matches.length!==1)return {reason:`A unique matching regular ${baselineYear} county contest is unavailable.`};
  return {...partyInput(row,matches[0],criteria),baselineYear};
}
function rowDates(r) {return {electionDate:r.electionDate||null,sourceUpdatedAt:r.sourceUpdatedAt||null,asOf:r.asOf||null,asOfBasis:r.asOfBasis||null,sourceTimestampBasis:r.sourceTimestampBasis||null,retrievedAt:r.retrievedAt||null,fetchedAt:r.fetchedAt||null,snapshotAsOf:r.snapshotAsOf||null,sourceId:r.sourceId||null,sourceSelection:r.sourceSelection||null};}
function participationEvidence(p,peer) {return {currentYear:2026,baselineYear:2022,reportedBallots:p.current.ballotsCast,population:p.population.value,populationYear:2025,populationReferenceDate:p.population.referenceDate,ballotsPer100Residents:round(p.currentRate),priorBallots:p.prior.ballotsCast,priorPopulation:p.historicalPopulation.value,priorPopulationYear:2022,priorPopulationReferenceDate:p.historicalPopulation.referenceDate,priorBallotsPer100Residents:round(p.historicalRate),ownChangePp:round(p.currentRate-p.historicalRate),currentSource:rowDates(p.current),priorSource:rowDates(p.prior),peer};}
export function buildPatternReview({mapCounties,population,turnout,elections,inputHashes={},criteria=PATTERN_CRITERIA}) {
  const maps=[...mapCounties].sort((a,b)=>a.fips.localeCompare(b.fips)),sources={...population.sources,...turnout.sources};
  for(const data of Object.values(elections))Object.assign(sources,data?.sources||{});
  const participation=new Map(),pairs={};
  for(const c of maps)participation.set(c.fips,participationInput(c.fips,population,turnout,criteria));
  for(const office of OFFICES)pairs[office]=new Map(maps.map(c=>[c.fips,matchingPair(office,c.fips,elections,criteria)]));
  const counties={};
  for(const c of maps) {
    const fips=c.fips,stateFips=fips.slice(0,2),p=participation.get(fips);let participationReview;
    if(p.reason)participationReview=notAssessed(p.reason);
    else {
      const peers=maps.filter(o=>o.fips!==fips&&o.fips.startsWith(stateFips)).map(o=>participation.get(o.fips)).filter(v=>!v.reason&&Number.isFinite(v.currentRate)).map(v=>v.currentRate),peer=peerScreen(p.currentRate,peers,criteria);
      if(!peer)participationReview=notAssessed('Fewer than 10 other eligible same-state participation peers.');
      else {
        const evidence=participationEvidence(p,peer),flag=peer.outside&&Math.abs(p.currentRate-p.historicalRate)>=criteria.minHistoricalParticipationChangePp;
        participationReview={status:'assessed',flags:flag?[{id:'participation-state-peer-and-own-history',label:'Ballots per resident outside state peers',description:'Provisional review: reported 2026 ballots per resident differ unusually from eligible same-state peers and by at least 10 percentage points from this county’s 2022 baseline. All residents include children; this is not eligible-voter turnout, proof of an error, or evidence of fraud. Reporting progress can explain differences.',provisional:true,evidence,sources:[...sourceRefs(sources,[p.current.sourceId,p.prior.sourceId,p.population.sourceId,p.historicalPopulation.sourceId]),METHOD_SOURCE]}]:[],evidence};
      }
    }
    const offices={};
    for(const office of OFFICES) {
      const a=pairs[office].get(fips);
      if(a.reason){offices[office]=notAssessed(a.reason);continue;}
      const peers=maps.filter(o=>o.fips!==fips&&o.fips.startsWith(stateFips)).map(o=>pairs[office].get(o.fips)).filter(v=>!v.reason&&v.baselineYear===a.baselineYear).map(v=>v.shift),peer=peerScreen(a.shift,peers,criteria);
      if(!peer){offices[office]=notAssessed('Fewer than 10 other eligible same-state comparable-contest peers.');continue;}
      const evidence={office,currentYear:2026,baselineYear:a.baselineYear,currentDemocratVotes:a.current.democrat,currentRepublicanVotes:a.current.republican,priorDemocratVotes:a.historical.democrat,priorRepublicanVotes:a.historical.republican,democratCountChange:a.current.democrat-a.historical.democrat,republicanCountChange:a.current.republican-a.historical.republican,democratCountChangePercent:round((a.current.democrat/a.historical.democrat-1)*100),republicanCountChangePercent:round((a.current.republican/a.historical.republican-1)*100),currentDemocratTwoPartyShare:round(a.currentShare),priorDemocratTwoPartyShare:round(a.priorShare),democratShareChangePp:round(a.shift),republicanShareChangePp:round(-a.shift),peer,currentSource:rowDates(a.row),priorSource:rowDates(a.prior),seatId:a.row.seatId||null};
      const flag=peer.outside&&Math.abs(a.shift)>=criteria.minDistancePp;
      offices[office]={status:'assessed',evidence,flags:flag?[{id:`${office}-symmetric-party-shift`,label:`Unusual shift toward ${peer.distancePp>0?'Democrats':'Republicans'} relative to state peers`,description:`Provisional review: this county’s Democratic two-party-share change from ${a.baselineYear} is at least 10 percentage points in absolute size and differs unusually from eligible same-state peers. Swapping Democratic and Republican votes produces the same screen result in the opposite direction. Candidate changes, voting patterns and reporting progress may explain the difference; this is not a fraud or error finding.`,provisional:true,evidence,sources:[...sourceRefs(sources,[a.row.sourceId,a.prior.sourceId]),METHOD_SOURCE]}]:[]};
    }
    counties[fips]={name:c.name,stateFips,participation:participationReview,offices};
  }
  const tally=items=>{const reasons={};for(const a of items)if(a.reason)reasons[a.reason]=(reasons[a.reason]||0)+1;return {assessed:items.filter(a=>a.status==='assessed').length,notAssessed:items.filter(a=>a.status==='not-assessed').length,flagged:items.filter(a=>a.flags.length).length,reasons};};
  return {schemaVersion:1,electionYear:2026,auditDate:'2026-11-06',mapCountyCount:maps.length,criteria,method:{...METHOD_SOURCE,interpretation:'Exploratory symmetric screens, not formal probabilities, fraud findings, error determinations or race calls.',madZeroPolicy:'Absolute 10pp distance guard; modifiedZ is null when peer MAD is zero.'},inputHashes,sources,counties,summary:{participation:tally(Object.values(counties).map(c=>c.participation)),offices:Object.fromEntries(OFFICES.map(o=>[o,tally(Object.values(counties).map(c=>c.offices[o]))]))}};
}
export function reviewForCounty(report,office,fips) {
  const county=report?.counties?.[String(fips).padStart(5,'0')];
  if(!county||!OFFICES.includes(office))return {status:'not-assessed',flags:[],reason:'County or office is outside this audit.'};
  const assessments=[county.participation,county.offices[office]],flags=assessments.flatMap(a=>a.flags);
  return {status:flags.length?'flagged':assessments.some(a=>a.status==='assessed')?'assessed':'not-assessed',flags,participationStatus:county.participation.status,officeStatus:county.offices[office].status,...(assessments.some(a=>a.reason)?{reason:assessments.filter(a=>a.reason).map(a=>a.reason).join(' ')}:{})};
}
// Direction is relative to same-state peers, matching the screening criterion.
// Participation-only or conflicting flags must not be assigned to a party.
export function patternDirection(flags = []) {
  const directions = new Set(flags.filter(f => f.id?.endsWith('-symmetric-party-shift'))
    .map(f => f.evidence?.peer?.distancePp)
    .filter(value => Number.isFinite(value) && value !== 0)
    .map(value => value > 0 ? 'democrat' : 'republican'));
  return directions.size === 1 ? [...directions][0] : 'neutral';
}
export function stateReviewSummary(report,office,stateFips) {
  const rows=Object.entries(report?.counties||{}).filter(([f])=>f.startsWith(String(stateFips).padStart(2,'0'))).map(([f])=>reviewForCounty(report,office,f));
  return {countyCount:rows.length,flaggedCount:rows.filter(r=>r.status==='flagged').length,assessedCount:rows.filter(r=>r.status==='assessed').length,notAssessedCount:rows.filter(r=>r.status==='not-assessed').length,officeAssessedCount:rows.filter(r=>r.officeStatus==='assessed').length,participationAssessedCount:rows.filter(r=>r.participationStatus==='assessed').length,flagCount:rows.reduce((n,r)=>n+r.flags.length,0)};
}
