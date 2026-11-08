import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {qualifiedRaceCounts,historyPoint,selectHistoryYears,auditedHouseCounts,auditedSenateRoundCounts} from '../src/history-series.js';
const context={office:'governor',year:2022,level:'county',id:'30001'};
const row={geoLevel:'county',countyFips:'30001',stateFips:'30',stage:'general',special:false,candidates:[{name:'D',party:'Democrat',votes:0},{name:'R',party:'Republican',votes:100},{name:'I',party:'Other',votes:5}],reportingCategories:[{name:'write-in',category:'unattributedWriteIns',votes:2},{name:'under',category:'undervotes',votes:20},{name:'over',category:'overvotes',votes:1}],totalVotes:128};
let result=qualifiedRaceCounts([row],context);assert.equal(result.total,107);assert.equal(result.democrat,0);assert.equal(result.republican,100);
assert.equal(qualifiedRaceCounts([{...row,candidates:[row.candidates[1]]}],context).democrat,null);
assert.match(qualifiedRaceCounts([{...row,candidates:[{...row.candidates[0],votes:null}]}],context).reason,/missing/i);
assert.match(qualifiedRaceCounts([{...row,reportingCategories:[{category:'sourceReportingCategory',votes:3}]}],context).reason,/Unknown/);
assert.match(qualifiedRaceCounts([row,{...row,seatId:'second'}],{...context,office:'senate'}).reason,/Concurrent/);
assert.ok(qualifiedRaceCounts([{...row,sourceNeedsReview:true}],context).reason);
assert.equal(historyPoint(2022,{reason:'Held'},[]).total,null);
const pop=[{year:2022,value:1000},{year:2025,value:2000}];assert.equal(historyPoint(2022,result,pop).totalRate,10.7);assert.equal(historyPoint(2026,result,pop).populationYear,2025);assert.equal(historyPoint(2020,result,pop).totalRate,null);
const years=Array.from({length:21},(_,i)=>2006+i);assert.deepEqual(selectHistoryYears({office:'president',years,id:'30'}),[2008,2012,2016,2020,2024]);assert.deepEqual(selectHistoryYears({office:'governor',years,id:'30'}),[2008,2012,2016,2020,2024]);assert.deepEqual(selectHistoryYears({office:'governor',years,id:'34'}),[2009,2013,2017,2021,2025]);assert.equal(selectHistoryYears({office:'governor',years,id:'50'}).length,11);
assert.ok(auditedHouseCounts({},'30001',2020).reason);assert.ok(auditedHouseCounts({},'35001',2026).reason);
console.log('History series checks passed: candidate-only totals, source/null/category/seat holds, actual-zero versus missing, dated population, office schedules, unqualified House gaps.');

assert.equal(qualifiedRaceCounts([{...row,candidates:[...row.candidates,{name:'UNDERVOTES',votes:999}]}],context).total,107);
const audit=JSON.parse(readFileSync(new URL('../public/data/anomalies-2026.json',import.meta.url)));
const [fips,audited]=Object.entries(audit.counties).find(([id,c])=>id.startsWith('30')&&c.offices.house.reviewScreens.raceVoteChange.status==='assessed');
for(const year of [2022,2026]){const actual=auditedHouseCounts(audit,fips,year);assert.equal(actual.total,year===2026?audited.offices.house.reviewScreens.raceVoteChange.evidence.currentRaceVotes:audited.offices.house.reviewScreens.raceVoteChange.evidence.priorRaceVotes);assert.equal(actual.provisional,year===2026);}
console.log('Actual frozen Montana House audit points and legacy accounting-category exclusion passed.');

const namedOnly = qualifiedRaceCounts([{...row,reportingCategories:[{category:'sourceReportingCategory',votes:3}]}],context);
const partial = historyPoint(2022,namedOnly,pop);
assert.equal(partial.total,null);assert.equal(partial.totalRate,null);assert.equal(partial.republican,100);assert.equal(partial.republicanRate,10);assert.equal(partial.democrat,0);
const aggregate = qualifiedRaceCounts([{...row,candidates:[...row.candidates,{name:'OTHER',party:'Other',votes:8}]}],context);
assert.equal(historyPoint(2022,aggregate,pop).republican,100);assert.equal(historyPoint(2022,aggregate,pop).total,null);
const held = qualifiedRaceCounts([{...row,sourceNeedsReview:true,reportingCategories:[{category:'sourceReportingCategory',votes:3}]}],context);
assert.equal(historyPoint(2022,held,pop).republican,null);
console.log('Historical named party counts retained only for total-only category holds; source holds stay withheld.');
const missingAggregateCategory = qualifiedRaceCounts([{...row,candidates:[...row.candidates,{name:'OTHER',party:'Other',votes:8}],reportingCategories:[{category:'sourceReportingCategory',votes:null}]}],context);
assert.equal(historyPoint(2022,missingAggregateCategory,pop).republican,null);

const qualifiedAdditionalHouseStates=Object.entries(audit.comparabilityContracts.houseStates).filter(([state,c])=>c.verified).map(([state])=>state);
for(const state of qualifiedAdditionalHouseStates){
 const pair=Object.entries(audit.counties).find(([f,c])=>f.startsWith(state)&&c.offices.house.reviewScreens.raceVoteChange.status==='assessed');assert.ok(pair,'New approved state has no usable history');
 for(const year of [2022,2026]){const counts=auditedHouseCounts(audit,pair[0],year),e=pair[1].offices.house.reviewScreens.raceVoteChange.evidence;assert.equal(counts.total,year===2026?e.currentRaceVotes:e.priorRaceVotes);assert.equal(counts.scope,audit.comparabilityContracts.houseStates[state].id);assert.ok(counts.sourceIds.length>0);}
}
assert.ok(auditedHouseCounts(audit,'21001',2026).reason,'Current-only Kentucky source must not open historical aggregation');
const sd=Object.entries(audit.counties).find(([f,c])=>f.startsWith('46')&&c.offices.house.reviewScreens.raceVoteChange.status==='assessed');assert.equal(auditedHouseCounts(audit,sd[0],2022).democrat,null,'Absent nominee is not zero');assert.ok(auditedHouseCounts(audit,sd[0],2022).republican>0,'Known named votes remain visible even when party comparison is unavailable');
console.log(`All ${qualifiedAdditionalHouseStates.length} additional House scopes reach totals/history; current-only holds and absent nominees preserved.`);

const absentShadow={comparabilityContracts:audit.comparabilityContracts,counties:{[sd[0]]:structuredClone(audit.counties[sd[0]])}};absentShadow.counties[sd[0]].offices.house.reviewScreens.raceVoteChange.evidence.priorDemocratVotes=0;assert.equal(auditedHouseCounts(absentShadow,sd[0],2022).democrat,null,'Explicit typed absence must not fall back to a legacy zero');

for(const [state,contract]of Object.entries(audit.comparabilityContracts.senateRounds||{})){
 assert.equal(contract.verified,true);
 for(const [fips,county]of Object.entries(audit.counties).filter(([f])=>f.startsWith(state))){
  const race=county.offices.senate.reviewScreens.raceVoteChange;assert.equal(race.status,'assessed');
  for(const year of [2020,2026]){const point=auditedSenateRoundCounts(audit,fips,year);assert.equal(point.total,year===2020?race.evidence.priorRaceVotes:race.evidence.currentRaceVotes);assert.equal(point.scope,contract.id);assert.ok(point.sourceIds.length);}
 }
 const changed=structuredClone({comparabilityContracts:{senateRounds:{[state]:contract}},counties:{}});changed.comparabilityContracts.senateRounds[state].verified=false;assert.ok(auditedSenateRoundCounts(changed,state+'001',2020).reason);
}
assert.ok(auditedSenateRoundCounts(audit,'13001',2022).reason,'A reviewed2020/2026pair cannot qualify2022or a runoff');
console.log('Reviewed November Senate pairs reach graphs only for exact qualified scopes and years.');

assert.ok(!selectHistoryYears({office:'senate',years,id:'12'}).includes(2026),'Unqualified special year is not inferred');
assert.ok(selectHistoryYears({office:'senate',years,id:'12',specialYears:[2026]}).includes(2026),'Reviewed special year appears alongside regular cycles');
for(const [state,contract]of Object.entries(audit.comparabilityContracts.senateSpecials||{})){
 if(!contract.verified)continue;
 assert.equal(contract.baselineYear,2022);
 for(const [fips,county]of Object.entries(audit.counties).filter(([f])=>f.startsWith(state))){
  const e=county.offices.senate.reviewScreens.raceVoteChange.evidence;assert.ok(e);
  for(const year of [2022,2026]){const count=auditedSenateRoundCounts(audit,fips,year);assert.equal(count.total,year===2022?e.priorRaceVotes:e.currentRaceVotes);assert.equal(count.scope,contract.id);}
  assert.ok(auditedSenateRoundCounts(audit,fips,2020).reason,'Special contract cannot silently switch to2020');
 }
}
console.log('Reviewed special Senate history uses2022and2026only; missing special years are never inferred.');

const combinedAccounting={geoLevel:'county',countyFips:'45001',stateFips:'45',stage:'general',special:false,candidates:[{name:'Named D',party:'Democrat',votes:600},{name:'Named R',party:'Republican',votes:400}],reportingCategories:[{category:'overUnderVotes',votes:5000},{category:'reportedBallotTotal',votes:6000}]};assert.equal(qualifiedRaceCounts([combinedAccounting],{office:'governor',year:2022,level:'county',id:'45001'}).total,1000);combinedAccounting.reportingCategories[0].category='unknownCombinedField';assert.ok(qualifiedRaceCounts([combinedAccounting],{office:'governor',year:2022,level:'county',id:'45001'}).reason);
