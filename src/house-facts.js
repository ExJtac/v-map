/** Source-qualified single-year totals. Never enables historical anomaly screens. */
import {normalizedStage} from './county-data.js';
const integer=value=>Number.isInteger(value)&&value>=0;
const excluded=/^(overvotes|undervotes|overUnderVotes|invalidBallots|blankBallots|spoiledBallots|exhaustedBallots|absentNomineeSlot|reportedBallotTotal)$/i;
const writeIns=/^(unattributedWriteIns|sourceWriteInEntries|namedWriteIns)$/i;
const accountingName=/^(?:OVER ?VOTES?|UNDER ?VOTES?|BLANK(?:S| BALLOTS?| VOTES?)?|INVALID(?: BALLOTS?| VOTES?)?|SPOILED(?: BALLOTS?| VOTES?)?|EXHAUSTED BALLOTS?|TOTAL (?:VOTES|BALLOTS) CAST)$/i;
export function houseFactScope(report,id,year){
 const state=String(id).slice(0,2),contracts=report?.comparabilityContracts;
 const paired=state==='04'?contracts?.azHouse:state==='30'?contracts?.montanaHouse:contracts?.houseStates?.[state];
 if(paired?.verified&&[2022,2026].includes(year))return {...paired,year,intersections:paired.intersectionsByYear?.[year]||paired.intersections||[]};
 const facts=contracts?.houseFacts?.[`${state}-${year}`];
 return facts?.verified&&facts.year===year&&facts.comparisonQualified===false?facts:null;
}
export function scopedHouseFacts(rows,report,id,year,level='county'){
 if(!['county','state'].includes(level))return {reason:'Unsupported House geography.'};
 const scope=houseFactScope(report,id,year);
 if(!scope)return {reason:'Complete source-qualified House facts are unavailable for this state and year.'};
 if(level==='state'&&scope.stateFactsQualified===false)return {reason:scope.stateFactsReason||'A complete statewide House aggregate is not source-qualified.',stateAggregateHeld:true};
 const state=String(id).slice(0,2),sourceRows=(rows||[]).filter(row=>row.stateFips===state&&row.geoLevel===(level==='state'?'district':'county')&&(level==='state'||row.countyFips===id)&&row.special===false&&normalizedStage(row.stage)==='general'&&(!row.contestType||row.contestType==='candidate'));
 const expected=level==='state'?[...new Set(scope.intersections.map(key=>key.split('|')[1]))].sort():scope.intersections.filter(key=>key.startsWith(id+'|')).sort(),keys=sourceRows.map(row=>level==='state'?String(Number(row.district)):`${row.countyFips}|${Number(row.district)}`).sort();
 if(!expected.length||new Set(keys).size!==keys.length||JSON.stringify(keys)!==JSON.stringify(expected))return {reason:'Complete actual House district portions are unavailable for this county and year.'};
 let total=0;const party={Democrat:null,Republican:null},sourceIds=new Set();
 for(const row of sourceRows){
  if(row.stateFips!==String(id).slice(0,2)||(row.office!=null&&row.office!=='house')||(row.year!=null&&row.year!==year)||row.sourceNeedsReview||row.sourceTotalConflict||row.voteTotalMismatch||row.incomplete||row.boundaryChanged||row.boundaryIncompatible||row.boundaryNote||row.geographicCoverageNote||row.suppressElectionWinner||row.winnerEligible===false||(year<2026&&(row.provisional||row.unofficial)))return {reason:row.sourceQualityNote||row.sourceReviewReason||'Source, geographic or historical status hold on a House portion.'};
  const file=`public${row.sourceSelection?.url}`;
  if(!scope.pinnedFileHashes?.[file]||scope.pinnedFileHashes[file]!==report.inputHashes?.[file]||!file.endsWith(`house-${year}.json`))return {reason:'A House portion comes from an unqualified source file.'};
  if(!row.candidates?.length||row.candidates.some(c=>!integer(c.votes)||typeof c.name!=='string'||!c.name.trim()||(/^(OTHER|OTHERS|ALL OTHER CANDIDATES.*|OTHER CANDIDATES)$/i.test(c.name)||accountingName.test(c.name))))return {reason:'Complete named candidate counts are unavailable for a House portion.'};
  for(const c of row.candidates){total+=c.votes;if(Object.hasOwn(party,c.party))party[c.party]=(party[c.party]??0)+c.votes;}
  for(const category of row.reportingCategories||[]){
   if(excluded.test(category.category||''))continue;
   if(!integer(category.votes))return {reason:'A House reporting-category count is missing.'};
   if(!writeIns.test(category.category||''))return {reason:'A House reporting category is unclassified; no countywide total is inferred.'};
   total+=category.votes;if(category.sourceId)sourceIds.add(category.sourceId);
  }
  for(const sourceId of [row.sourceId,...(row.sourceIds||[])].filter(Boolean))sourceIds.add(sourceId);
 }
 return {total,democrat:party.Democrat,republican:party.Republican,sourceIds:[...sourceIds].sort(),provisional:sourceRows.some(r=>r.provisional||r.unofficial),scope:scope.id,scopeYear:year,basis:'Source-qualified single-year sum; historical comparison eligibility is separate.'};
}
