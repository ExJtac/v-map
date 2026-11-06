/** Pure exploratory screens. No I/O, forecasts, p-values, or fraud/error attribution. */
export const OFFICES = ['president', 'senate', 'house', 'governor'];
export const PATTERN_CRITERIA = Object.freeze({ minOwnPartyChangePercent:40, maxOpposingPartyChangePercent:15, minRaceVoteChangePercent:40, minRaceVotes:500, minOwnShareSwingPp:10, minRacePopulationChangePp:10, minBallots: 100, minResidents: 1000, minPeers: 10, minDistancePp: 10, modifiedZThreshold: 3.5, minHistoricalParticipationChangePp: 10, minTwoPartyVotes: 500, minPriorPartyVotes: 100, minPartyGrowthPercent:25, minPartyCountIncrease:100, minPartyGrowthPeerDistancePp:25, ordinaryOpposingModifiedZ:2, ordinaryOpposingMadZeroDistancePp:10 });
export const METHOD_SOURCE = { title: 'NIST/SEMATECH: exploratory outlier screening (modified z score)', url: 'https://itl.nist.gov/div898/handbook/eda/section3/eda35h.htm' };
const NUMERIC_TOLERANCE=1e-10;
const atLeast=(a,b)=>a-b>=-NUMERIC_TOLERANCE,atMost=(a,b)=>a-b<=NUMERIC_TOLERANCE,strictlyAbove=(a,b)=>a-b>NUMERIC_TOLERANCE;
const round = x => Number.isFinite(x) ? Math.round(x * 1e6) / 1e6 : null;
export function median(values) { const a = [...values].sort((a,b)=>a-b), n=a.length; return n ? (a[Math.floor((n-1)/2)]+a[Math.floor(n/2)])/2 : null; }
export function peerScreen(value, peers, criteria=PATTERN_CRITERIA) {
  if (!Number.isFinite(value) || peers.length < criteria.minPeers || peers.some(v=>!Number.isFinite(v))) return null;
  const center=median(peers), mad=median(peers.map(v=>Math.abs(v-center))), distance=value-center;
  const z=mad>0 ? .6745*distance/mad : null;
  return { peerCount:peers.length, peerMedian:round(center), peerMad:round(mad), distancePp:round(distance), modifiedZ:round(z), scoreBasis:mad===0?'MAD is zero; absolute-distance threshold only':'0.6745 × (value − peer median) / peer MAD', outside:atLeast(Math.abs(distance),criteria.minDistancePp) && (mad===0 || strictlyAbove(Math.abs(z),criteria.modifiedZThreshold)) };
}
export const SENATE_CLASS_2_FIPS=Object.freeze(['01','02','05','08','10','13','16','17','19','20','21','22','23','25','26','27','28','30','31','33','34','35','37','40','41','44','45','46','47','48','51','54','56']);
export const SENATE_CLASS_2_SOURCE={title:'U.S. Senate: Class II seats, 2021–2027 term following the November 2020 election',url:'https://www.senate.gov/senators/Class_II.htm'};
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
function aggregateHouseCounty(rows, fips, year) {
  const candidates=[];
  for(const r of rows)for(const c of r.candidates||[]) {
    const key=`${c.name}|${c.party}`,existing=candidates.find(a=>a.aggregateKey===key);
    if(existing)existing.votes=existing.votes===null||c.votes===null?null:existing.votes+c.votes;
    else candidates.push({...c,aggregateKey:key});
  }
  return {office:'house',year,geoLevel:'county',stateFips:fips.slice(0,2),countyFips:fips,stage:'general',special:false,candidates,reportingCategories:rows.flatMap(r=>r.reportingCategories||[]),sourceId:rows[0].sourceId,sourceIds:[...new Set(rows.map(r=>r.sourceId))],provisional:rows.some(r=>r.provisional),unofficial:rows.some(r=>r.unofficial),sourceSelection:{basis:'Sum of every source-verified county-district portion, no district votes allocated geographically'},sourceUpdatedAt:rows[0].sourceUpdatedAt||null,asOf:rows[0].asOf||null,asOfBasis:rows[0].asOfBasis||null,retrievedAt:rows[0].retrievedAt||null,portions:rows.map(r=>({district:r.district,contestId:r.contestId,sourceId:r.sourceId,sourceSelection:r.sourceSelection}))};
}
function matchingPair(office,fips,elections,criteria,comparability) {
  if(office==='president')return {reason:'No 2026 presidential election; office-specific shift screen not applicable.'};
  const current=countyRows(elections[`${office}-2026`],fips);
  if(!current.length)return {reason:'No imported 2026 county contest for this office.'};
  if(office==='house') {
    const contract=fips.startsWith('30')?comparability?.montanaHouse:fips.startsWith('04')?comparability?.azHouse:null;
    if(!contract?.verified)return {reason:'Complete comparable county-district coverage and county identity are not established; no district allocation is inferred.'};
    const now=current.filter(regular),old=countyRows(elections['house-2022'],fips).filter(regular);
    const expected=contract.intersections.filter(k=>k.startsWith(fips+'|')).sort(),keys=rows=>rows.map(r=>`${r.countyFips}|${Number(r.district)}`).sort();
    if(!expected.length||JSON.stringify(keys(now))!==JSON.stringify(expected)||JSON.stringify(keys(old))!==JSON.stringify(expected))return {reason:'Verified county-district portion inventory is incomplete or ambiguous.'};
    for(const r of [...now,...old]) {const reason=qualityReason(r,old.includes(r));if(reason)return {reason};if(r.stateFips!==fips.slice(0,2)||r.district==null)return {reason:'County-district identity inconsistent with verified state scope.'};}
    const row=aggregateHouseCounty(now,fips,2026),prior=aggregateHouseCounty(old,fips,2022);
    return {row,prior,...partyInput(row,prior,criteria),baselineYear:2022,comparability:{id:contract.id,basis:'Complete countywide sum across all verified House portions in both years; Other votes unassigned',countyDistrictPortions:row.portions,priorCountyDistrictPortions:prior.portions,sources:contract.sources}};
  }
  const rows=current.filter(regular);
  if(rows.length!==1)return {reason:'A unique regular current county contest is not established.'};
  const row=rows[0];
  if(row.stateFips!==fips.slice(0,2)||row.district!=null)return {reason:'Current county/state identity or statewide-office geography is inconsistent.'};
  let baselineYear=2022,contract=null;
  if(office==='senate') {
    baselineYear=2020;
    if(['13','22'].includes(row.stateFips))return {reason:'Georgia/Louisiana 2020 Senate ballot-round comparability is not established.'};
    if(!row.seatId&&!SENATE_CLASS_2_FIPS.includes(row.stateFips))return {reason:'Explicit comparable Senate seat identity is unavailable.'};
    if(!row.seatId)contract={id:`${row.stateFips}-senate-class-2`,basis:'Official Class II2021–2027 term identifies the regular 2020 and 2026 seat; source general/non-special stages must independently match',sources:[SENATE_CLASS_2_SOURCE]};
  }
  const matches=countyRows(elections[`${office}-${baselineYear}`],fips).filter(p=>regular(p)&&p.stateFips===row.stateFips&&(p.contestType||'candidate')===(row.contestType||'candidate')&&(office!=='senate'||(row.seatId?p.seatId===row.seatId:!p.seatId)));
  if(matches.length!==1)return {reason:`A unique matching regular ${baselineYear} county contest is unavailable.`};
  return {row,prior:matches[0],...partyInput(row,matches[0],criteria),baselineYear,...(contract?{comparability:contract}:{})};
}
function rowDates(r) {return {electionDate:r.electionDate||null,sourceUpdatedAt:r.sourceUpdatedAt||null,asOf:r.asOf||null,asOfBasis:r.asOfBasis||null,sourceTimestampBasis:r.sourceTimestampBasis||null,retrievedAt:r.retrievedAt||null,fetchedAt:r.fetchedAt||null,snapshotAsOf:r.snapshotAsOf||null,sourceId:r.sourceId||null,sourceSelection:r.sourceSelection||null,provisional:Boolean(r.provisional),unofficial:Boolean(r.unofficial),countingStatus:r.countingStatus||null,resultStatus:r.resultStatus||r.electionStatus||null};}
function participationEvidence(p,peer) {return {currentYear:2026,baselineYear:2022,reportedBallots:p.current.ballotsCast,population:p.population.value,populationYear:2025,populationReferenceDate:p.population.referenceDate,ballotsPer100Residents:round(p.currentRate),priorBallots:p.prior.ballotsCast,priorPopulation:p.historicalPopulation.value,priorPopulationYear:2022,priorPopulationReferenceDate:p.historicalPopulation.referenceDate,priorBallotsPer100Residents:round(p.historicalRate),ownChangePp:round(p.currentRate-p.historicalRate),currentSource:rowDates(p.current),priorSource:rowDates(p.prior),peer};}
function growthDistribution(value, peers, criteria) {
  const display=peerScreen(value,peers,{...criteria,minDistancePp:criteria.minPartyGrowthPeerDistancePp});if(!display)return null;
  const center=median(peers),mad=median(peers.map(v=>Math.abs(v-center))),distance=value-center,z=mad>0?.6745*distance/mad:null;
  return {...display,positiveOutlier:atLeast(distance,criteria.minPartyGrowthPeerDistancePp)&&(mad===0||strictlyAbove(z,criteria.modifiedZThreshold)),ordinary:mad===0?atMost(Math.abs(distance),criteria.ordinaryOpposingMadZeroDistancePp):atMost(Math.abs(z),criteria.ordinaryOpposingModifiedZ)};
}
function partyGrowthAssessment(a, peers, evidence, sources, criteria) {
  const growth=(p,party)=>(p.current[party]/p.historical[party]-1)*100;
  const parties={};
  for(const [name,own,opposing] of [['Democrat','democrat','republican'],['Republican','republican','democrat']]) {
    const ownGrowth=growth(a,own),opposingGrowth=growth(a,opposing),peer=growthDistribution(ownGrowth,peers.map(p=>growth(p,own)),criteria),opposingPeer=growthDistribution(opposingGrowth,peers.map(p=>growth(p,opposing)),criteria);
    if(!peer||!opposingPeer)return notAssessed('Fewer than 10 other eligible same-state comparable-contest growth peers.');
    const countIncrease=a.current[own]-a.historical[own];
    parties[name]={ownGrowthPercent:round(ownGrowth),ownCountIncrease:countIncrease,opposingGrowthPercent:round(opposingGrowth),peer,opposingPeer,ordinaryOpposition:opposingPeer.ordinary,ownMinimumsPassed:atLeast(ownGrowth,criteria.minPartyGrowthPercent)&&countIncrease>=criteria.minPartyCountIncrease,notFlaggedReasons:[...(!atLeast(ownGrowth,criteria.minPartyGrowthPercent)?['Own positive growth is below 25%.']:[]),...(countIncrease<criteria.minPartyCountIncrease?['Vote count increase is below 100.']:[]),...(!peer.positiveOutlier?['Positive growth does not pass both the 25pp peer-distance and modified-z criteria.']:[]),...(!opposingPeer.ordinary?['Opposing-party growth is outside its ordinary peer range.']:[])]};
  }
  const {peer:shareShiftPeer,...common}=evidence;
  const base={...common,screen:'party-count-growth',shareShiftPeer,parties},flags=[];
  for(const [growthParty,p] of Object.entries(parties))if(p.ownMinimumsPassed&&p.peer.positiveOutlier&&p.ordinaryOpposition)flags.push({id:`${evidence.office}-symmetric-party-growth`,label:`Unusual ${growthParty==='Democrat'?'Democratic':'Republican'} vote-count growth with ordinary opposing growth`,description:`Provisional review: ${growthParty} counts increased at least 25% and 100 votes, at least 25 percentage points above same-state peer growth, with modified z >3.5 (MAD-zero absolute guard). Opposing-party growth is within |z|≤2, or within 10pp of its peer median when MAD=0. Reporting progress, candidate changes and voting patterns may explain this exploratory result; it is not an error or fraud finding.`,provisional:true,evidence:{...base,growthParty,...p},sources:[...sourceRefs(sources,[...(a.row.sourceIds||[a.row.sourceId]),...(a.prior.sourceIds||[a.prior.sourceId])]),...(a.comparability?.sources||[]),METHOD_SOURCE]});
  return {status:'assessed',flags,evidence:base};
}

// Candidate/write-in totals are built from supplied race categories, never ballots or totalVotes.
function raceVoteInput(row,prior,criteria) {
  const problem=qualityReason(row)||qualityReason(prior,true);if(problem)return {reason:problem};
  if(!regular(row)||!regular(prior))return {reason:'Comparable regular general-election contests not established.'};
  const totals=[];
  for(const r of [row,prior]) {
    if(r.suppressElectionWinner||r.winnerEligible===false)return {reason:'Conditional or noncandidate contest is not comparable.'};
    if(!r.candidates?.length||r.candidates.some(c=>!Number.isInteger(c.votes)||c.votes<0))return {reason:'Complete candidate/write-in count vector is unavailable.'};
    if(r.candidates.some(c=>/^(OTHER|ALL OTHER CANDIDATES.*|OTHER CANDIDATES)$/i.test(c.name||'')))return {reason:'Unitemized candidate total has not been qualified for this race comparison.'};
    let total=r.candidates.reduce((n,c)=>n+c.votes,0);const included=[],excluded=[];
    for(const c of r.reportingCategories||[]) {
      const category=String(c.category||'');
      if(/^(overvotes|undervotes|invalidBallots|blankBallots|spoiledBallots|exhaustedBallots|absentNomineeSlot|reportedBallotTotal)$/i.test(category)){excluded.push({...c});continue;}
      if(/^(writeins?|writeInVotes|unqualifiedWriteIns|unattributedWriteIns|sourceWriteInEntries)$/i.test(category)&&Number.isInteger(c.votes)&&c.votes>=0){total+=c.votes;included.push({...c});continue;}
      return {reason:'Unclassified, missing or unitemized reporting categories prevent a qualified race-vote total.'};
    }
    totals.push({votes:total,includedReportingCategories:included,excludedReportingCategories:excluded});
  }
  if(totals.some(t=>t.votes<criteria.minRaceVotes))return {reason:'Fewer than 500 reported candidate/write-in race votes in either year.'};
  return {current:totals[0],prior:totals[1]};
}
function ownHistoryScreens(a,office,population,fips,sources,criteria,partyEvidence) {
  const unavailable=reason=>Object.fromEntries(['partyCountChange','raceVoteChange','racePopulationChange','shareSwing'].map(k=>[k,notAssessed(reason)]));
  if(!a.row||!a.prior)return unavailable(a.reason||'Comparable countywide race inputs unavailable.');
  const refs=[...sourceRefs(sources,[...(a.row.sourceIds||[a.row.sourceId]),...(a.prior.sourceIds||[a.prior.sourceId])]),...(a.comparability?.sources||[])];
  const flag=(id,label,description,evidence,extra=[])=>({id:`${office}-${id}`,label,description:`Provisional review: ${description} These application screening thresholds are not probabilities, error findings or evidence of fraud. Reporting progress and candidate changes may explain differences.`,provisional:true,evidence,sources:[...refs,...extra]});
  let partyCountChange,shareSwing;
  if(a.reason){partyCountChange=notAssessed(a.reason);shareSwing=notAssessed(a.reason);}
  else {
    const flags=[];
    for(const [party,opposing] of [['democrat','republican'],['republican','democrat']]) {
      const change=a.current[party]-a.historical[party],percent=100*change/a.historical[party],opposingPercent=100*(a.current[opposing]-a.historical[opposing])/a.historical[opposing];
      if(atLeast(Math.abs(percent),criteria.minOwnPartyChangePercent)&&atMost(Math.abs(opposingPercent),criteria.maxOpposingPartyChangePercent)&&Math.abs(change)>=criteria.minPartyCountIncrease) {
        const direction=(party==='democrat')===(change>0)?'democrat':'republican';
        flags.push(flag('party-count-change',`${party==='democrat'?'Democratic':'Republican'} vote-count ${change>0?'increase':'decrease'} of at least 40%`, `This party’s count changed by at least 40% and 100 votes from ${a.baselineYear}, while the opposing party’s count changed by at most 15% in absolute size. State-peer statistics are context, not a veto.`,{...partyEvidence,screen:'own-party-count-change',growthParty:party==='democrat'?'Democrat':'Republican',party,ownCountChange:change,ownCountChangePercent:round(percent),opposingCountChangePercent:round(opposingPercent),direction}));
      }
    }
    partyCountChange={status:'assessed',flags,evidence:partyEvidence};
    const direction=a.shift>0?'democrat':'republican';
    shareSwing={status:'assessed',flags:atLeast(Math.abs(a.shift),criteria.minOwnShareSwingPp)?[flag('share-swing',`Two-party share swing toward ${direction==='democrat'?'Democrats':'Republicans'} of at least 10pp`,`This county’s Democratic/Republican two-party share changed by at least 10 percentage points from its ${a.baselineYear} baseline, independently of state-peer changes. Other votes are not assigned to either party.`,{...partyEvidence,screen:'own-share-swing',direction})]:[],evidence:partyEvidence};
  }
  const total=raceVoteInput(a.row,a.prior,criteria);
  if(total.reason)return {partyCountChange,shareSwing,raceVoteChange:notAssessed(total.reason),racePopulationChange:notAssessed(total.reason)};
  const change=total.current.votes-total.prior.votes,percent=100*change/total.prior.votes;
  const evidence={...partyEvidence,office,currentYear:2026,baselineYear:a.baselineYear,currentRaceVotes:total.current.votes,priorRaceVotes:total.prior.votes,raceVoteCountChange:change,raceVoteCountChangePercent:round(percent),raceTotalBasis:'Sum of reported candidate and qualified write-in counts, excluding over/under/invalid/blank/spoiled/exhausted categories; not ballots.',currentRaceCategories:total.current,priorRaceCategories:total.prior,currentSource:rowDates(a.row),priorSource:rowDates(a.prior),...(a.comparability?{comparability:a.comparability}:{})};
  const raceVoteChange={status:'assessed',flags:atLeast(Math.abs(percent),criteria.minRaceVoteChangePercent)&&Math.abs(change)>=criteria.minPartyCountIncrease?[flag('race-vote-change',`Reported race-vote ${change>0?'increase':'decrease'} of at least 40%`,`Reported candidate/write-in race votes changed by at least 40% and 100 votes from ${a.baselineYear}; this is not a ballot-count or turnout measure.`,{...evidence,screen:'own-race-vote-change',direction:'neutral'})]:[],evidence};
  const currentPopulation=exactPopulation(population,fips,2025),priorPopulation=exactPopulation(population,fips,a.baselineYear);
  let racePopulationChange;
  if(!currentPopulation||!priorPopulation||![currentPopulation,priorPopulation].every(p=>Number.isInteger(p.value)&&p.value>=criteria.minResidents))racePopulationChange=notAssessed(`Exact 2025 and ${a.baselineYear} resident populations unavailable or below 1,000.`);
  else {
    const currentRatio=100*total.current.votes/currentPopulation.value,priorRatio=100*total.prior.votes/priorPopulation.value,ratioChange=currentRatio-priorRatio;
    const ratioEvidence={...evidence,screen:'own-race-votes-per-resident-change',population:currentPopulation.value,populationYear:2025,populationReferenceDate:currentPopulation.referenceDate,priorPopulation:priorPopulation.value,priorPopulationYear:a.baselineYear,priorPopulationReferenceDate:priorPopulation.referenceDate,currentRaceVotesPer100Residents:round(currentRatio),priorRaceVotesPer100Residents:round(priorRatio),raceVotesPerResidentChangePp:round(ratioChange),ownChangePp:round(ratioChange),direction:'neutral'};
    racePopulationChange={status:'assessed',flags:atLeast(Math.abs(ratioChange),criteria.minRacePopulationChangePp)?[flag('race-population-change','Race votes per resident changed by at least 10pp',`Candidate/write-in race votes per 100 residents changed by at least 10 percentage points. This race-vote proxy uses all residents including children; it is neither actual ballots nor eligible-voter turnout.`,ratioEvidence,sourceRefs(sources,[currentPopulation.sourceId,priorPopulation.sourceId]))]:[],evidence:ratioEvidence};
  }
  return {partyCountChange,shareSwing,raceVoteChange,racePopulationChange};
}
export function buildPatternReview({mapCounties,population,turnout,elections,inputHashes={},criteria=PATTERN_CRITERIA,comparability={}}) {
  const maps=[...mapCounties].sort((a,b)=>a.fips.localeCompare(b.fips)),sources={...population.sources,...turnout.sources};
  for(const data of Object.values(elections))Object.assign(sources,data?.sources||{});
  const participation=new Map(),pairs={};
  for(const c of maps)participation.set(c.fips,participationInput(c.fips,population,turnout,criteria));
  for(const office of OFFICES)pairs[office]=new Map(maps.map(c=>[c.fips,matchingPair(office,c.fips,elections,criteria,comparability)]));
  const counties={};
  for(const c of maps) {
    const fips=c.fips,stateFips=fips.slice(0,2),p=participation.get(fips);let participationReview;
    if(p.reason)participationReview=notAssessed(p.reason);
    else {
      const peers=maps.filter(o=>o.fips!==fips&&o.fips.startsWith(stateFips)).map(o=>participation.get(o.fips)).filter(v=>!v.reason&&Number.isFinite(v.currentRate)).map(v=>v.currentRate),peer=peerScreen(p.currentRate,peers,criteria);
      const evidence=participationEvidence(p,peer),flag=atLeast(Math.abs(p.currentRate-p.historicalRate),criteria.minHistoricalParticipationChangePp);
      participationReview={status:'assessed',flags:flag?[{id:'participation-own-history',label:'Ballots per resident changed by at least 10pp',description:'Provisional review: actual reported ballots per 100 residents changed by at least 10 percentage points from this county’s 2022 baseline. All residents include children; this is not eligible-voter turnout, an error finding or evidence of fraud. State peers are context only. Reporting progress can explain differences.',provisional:true,evidence,sources:sourceRefs(sources,[p.current.sourceId,p.prior.sourceId,p.population.sourceId,p.historicalPopulation.sourceId])}]:[],evidence};
    }
    const offices={};
    for(const office of OFFICES) {
      const a=pairs[office].get(fips);
      let evidence=null,shareShift,partyGrowth;
      if(a.reason){shareShift=notAssessed(a.reason);partyGrowth=notAssessed(a.reason);}
      else {
        const peerPairs=maps.filter(o=>o.fips!==fips&&o.fips.startsWith(stateFips)).map(o=>pairs[office].get(o.fips)).filter(v=>!v.reason&&v.baselineYear===a.baselineYear),peer=peerScreen(a.shift,peerPairs.map(v=>v.shift),criteria);
        evidence={office,currentYear:2026,baselineYear:a.baselineYear,currentDemocratVotes:a.current.democrat,currentRepublicanVotes:a.current.republican,priorDemocratVotes:a.historical.democrat,priorRepublicanVotes:a.historical.republican,democratCountChange:a.current.democrat-a.historical.democrat,republicanCountChange:a.current.republican-a.historical.republican,democratCountChangePercent:round((a.current.democrat/a.historical.democrat-1)*100),republicanCountChangePercent:round((a.current.republican/a.historical.republican-1)*100),currentDemocratTwoPartyShare:round(a.currentShare),priorDemocratTwoPartyShare:round(a.priorShare),democratShareChangePp:round(a.shift),republicanShareChangePp:round(-a.shift),peer,currentSource:rowDates(a.row),priorSource:rowDates(a.prior),seatId:office==='senate'?(a.row.seatId||a.comparability?.id||null):null,...(a.comparability?{comparability:a.comparability}:{})};
        if(!peer)shareShift=notAssessed('Fewer than 10 other eligible same-state comparable-contest peers; own-history screens remain eligible.');
        else shareShift={status:'assessed',flags:peer.outside&&atLeast(Math.abs(a.shift),criteria.minDistancePp)?[{id:`${office}-symmetric-party-shift`,label:`Peer-context shift toward ${peer.distancePp>0?'Democrats':'Republicans'}`,description:'Advanced peer-context screen only; not an independent border trigger under the own-history policy.',provisional:true,evidence,sources:[...sourceRefs(sources,[a.row.sourceId,a.prior.sourceId]),METHOD_SOURCE]}]:[]};
        partyGrowth=partyGrowthAssessment(a,peerPairs,evidence,sources,criteria);
      }
      const reviewScreens=ownHistoryScreens(a,office,population,fips,sources,criteria,evidence||{}),assessed=Object.values(reviewScreens).some(s=>s.status==='assessed');
      offices[office]={status:assessed?'assessed':'not-assessed',...(!assessed?{reason:a.reason||Object.values(reviewScreens)[0].reason}:{}),...(evidence?{evidence}:{}),shareShift,partyGrowth,reviewScreens,flags:Object.values(reviewScreens).flatMap(s=>s.flags)};
    }
    counties[fips]={name:c.name,stateFips,participation:participationReview,offices};
  }
  const tally=items=>{const reasons={};for(const a of items)if(a.reason)reasons[a.reason]=(reasons[a.reason]||0)+1;return {assessed:items.filter(a=>a.status==='assessed').length,notAssessed:items.filter(a=>a.status==='not-assessed').length,flagged:items.filter(a=>a.flags.length).length,reasons};};
  const stateContext={};
  for(const office of OFFICES) {
    stateContext[office]={};
    for(const state of new Set(maps.map(c=>c.fips.slice(0,2)))) {
      const rows=Object.values(counties).filter(c=>c.stateFips===state).map(c=>c.offices[office]),qualified=rows.filter(r=>r.reviewScreens.partyCountChange.status==='assessed');
      if(!qualified.length)continue;
      const sum=k=>qualified.reduce((n,r)=>n+r.evidence[k],0),d=sum('currentDemocratVotes'),r=sum('currentRepublicanVotes'),pd=sum('priorDemocratVotes'),pr=sum('priorRepublicanVotes');
      stateContext[office][state]={basis:'Only qualified party-comparison counties, not necessarily complete statewide results; provisional2026snapshot',qualifiedCountyCount:qualified.length,currentDemocratVotes:d,priorDemocratVotes:pd,currentRepublicanVotes:r,priorRepublicanVotes:pr,democratCountChangePercent:round(100*(d-pd)/pd),republicanCountChangePercent:round(100*(r-pr)/pr),countyMedianDemocratChangePercent:round(median(qualified.map(r=>r.evidence.democratCountChangePercent))),countyMedianRepublicanChangePercent:round(median(qualified.map(r=>r.evidence.republicanCountChangePercent))),flaggedCountyCount:rows.filter(r=>r.flags.length).length};
    }
  }
  return {schemaVersion:3,electionYear:2026,auditDate:'2026-11-06',mapCountyCount:maps.length,criteria,method:{...METHOD_SOURCE,interpretation:'Own-history symmetric application screens, not probabilities, fraud findings, error determinations or race calls. Peer statistics are context only and never veto a border trigger.',madZeroPolicy:'Advanced context retains absolute guards and null modifiedZ at MAD0; own-history triggers do not require peers.',numericTolerance:NUMERIC_TOLERANCE},inputHashes,sources,comparabilityContracts:comparability,stateContext,counties,summary:{participation:tally(Object.values(counties).map(c=>c.participation)),offices:Object.fromEntries(OFFICES.map(o=>[o,tally(Object.values(counties).map(c=>c.offices[o]))])),shareShift:Object.fromEntries(OFFICES.map(o=>[o,tally(Object.values(counties).map(c=>c.offices[o].shareShift))])),partyGrowth:Object.fromEntries(OFFICES.map(o=>[o,tally(Object.values(counties).map(c=>c.offices[o].partyGrowth))])),reviewScreens:Object.fromEntries(['partyCountChange','raceVoteChange','racePopulationChange','shareSwing'].map(k=>[k,Object.fromEntries(OFFICES.map(o=>[o,tally(Object.values(counties).map(c=>c.offices[o].reviewScreens[k]))]))]))}};
}
export function reviewForCounty(report,office,fips) {
  const county=report?.counties?.[String(fips).padStart(5,'0')];
  if(!county||!OFFICES.includes(office))return {status:'not-assessed',flags:[],reason:'County or office is outside this audit.'};
  const assessments=[county.participation,county.offices[office]],flags=assessments.flatMap(a=>a.flags);
  return {status:flags.length?'flagged':assessments.some(a=>a.status==='assessed')?'assessed':'not-assessed',flags,participationStatus:county.participation.status,officeStatus:county.offices[office].status,...(assessments.some(a=>a.reason)?{reason:assessments.filter(a=>a.reason).map(a=>a.reason).join(' ')}:{})};
}
// New border direction uses the county’s own signed change. Legacy peer flags remain context only.
// Participation-only or conflicting flags must not be assigned to a party.
export function patternDirection(flags = []) {
  const directions=new Set();
  for(const flag of flags) {
    if(['democrat','republican'].includes(flag.evidence?.direction)){directions.add(flag.evidence.direction);continue;}
    if(flag.id?.endsWith('-symmetric-party-growth')) {
      if(flag.evidence?.growthParty==='Democrat')directions.add('democrat');
      if(flag.evidence?.growthParty==='Republican')directions.add('republican');
    } else if(flag.id?.endsWith('-symmetric-party-shift')) {
      const value=flag.evidence?.peer?.distancePp;
      if(Number.isFinite(value)&&value!==0)directions.add(value>0?'democrat':'republican');
    }
  }
  return directions.size>1?'mixed':directions.size===1?[...directions][0]:'neutral';
}
export function stateReviewSummary(report,office,stateFips) {
  const rows=Object.entries(report?.counties||{}).filter(([f])=>f.startsWith(String(stateFips).padStart(2,'0'))).map(([f])=>reviewForCounty(report,office,f));
  return {countyCount:rows.length,flaggedCount:rows.filter(r=>r.status==='flagged').length,assessedCount:rows.filter(r=>r.status==='assessed').length,notAssessedCount:rows.filter(r=>r.status==='not-assessed').length,officeAssessedCount:rows.filter(r=>r.officeStatus==='assessed').length,participationAssessedCount:rows.filter(r=>r.participationStatus==='assessed').length,flagCount:rows.reduce((n,r)=>n+r.flags.length,0)};
}
