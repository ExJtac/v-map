import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildPatternReview,peerScreen,reviewForCounty,stateReviewSummary,patternDirection,OFFICES} from '../src/2026-anomalies.js';
import {buildActualReport,renderPatternReport} from './build-2026-anomalies.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
function fixture(n=12) {
  const mapCounties=Array.from({length:n},(_,i)=>({fips:'06'+String(i+1).padStart(3,'0'),name:'County '+i}));
  const sources={population:{title:'Synthetic population',url:'https://example.test/pop'},ballots:{title:'Synthetic ballots',url:'https://example.test/ballots'},votes:{title:'Synthetic candidate counts',url:'https://example.test/votes'}};
  const population={sources,counties:{}},turnout={sources,counties:{}},elections={};
  for(const year of [2022,2026])elections[`governor-${year}`]={office:'governor',year,sources,results:[]};
  for(const {fips} of mapCounties) {
    population.counties[fips]=[2022,2025].map(year=>({year,value:10000,sourceId:'population',referenceDate:`${year}-07-01`}));
    turnout.counties[fips]=[2022,2026].map(year=>({year,stage:'general',special:false,electionDate:`${year}-11-03`,ballotsCast:3000,sourceId:'ballots',certified:year===2022,final:year===2022,provisional:year===2026,unofficial:year===2026}));
    for(const year of [2022,2026])elections[`governor-${year}`].results.push({office:'governor',year,geoLevel:'county',stateFips:'06',countyFips:fips,contestId:`governor-${year}-06-state-general-False`,stage:'general',special:false,sourceId:'votes',provisional:year===2026,unofficial:year===2026,totalVotes:10000,candidates:[{name:'D',party:'Democrat',votes:5000},{name:'R',party:'Republican',votes:5000}],reportingCategories:[]});
  }
  return {mapCounties,population,turnout,elections};
}
const target='06001';
const currentRow=f=>f.elections['governor-2026'].results[0];
const priorRow=f=>f.elections['governor-2022'].results[0];
const currentBallot=f=>f.turnout.counties[target][1];
const priorBallot=f=>f.turnout.counties[target][0];
function shifted(){const f=fixture();currentRow(f).candidates[0].votes=6500;currentRow(f).candidates[1].votes=3500;return f;}
let f=fixture();currentBallot(f).ballotsCast=5100;let r=buildPatternReview(f);
assert.equal(r.counties[target].participation.flags.length,1,'51 ballots/100 residents vs30 peers AND own30 baseline flagged');
assert.equal(r.counties[target].participation.flags[0].evidence.ballotsPer100Residents,51);
assert.equal(r.counties[target].participation.flags[0].evidence.peer.peerCount,11);
assert.equal(r.counties[target].participation.flags[0].evidence.peer.modifiedZ,null,'MAD0 explicit null, never infinity');
priorBallot(f).ballotsCast=5100;r=buildPatternReview(f);assert.equal(r.counties[target].participation.flags.length,0,'No own historical deviation means no participation flag');
f=fixture();currentBallot(f).ballotsCast=5100;f.population.counties[target]=f.population.counties[target].filter(p=>p.year!==2022);r=buildPatternReview(f);assert.equal(r.counties[target].participation.status,'not-assessed');
f=fixture();currentBallot(f).ballotsCast=99;r=buildPatternReview(f);assert.equal(r.counties[target].participation.status,'not-assessed');
f=fixture();f.turnout.counties={};r=buildPatternReview(f);assert.equal(r.summary.participation.assessed,0,'Candidate totals never substitute for ballots');
f=shifted();let positive=buildPatternReview(f);assert.equal(positive.counties[target].offices.governor.flags.length,1);
for(const d of Object.values(f.elections))for(const row of d.results)[row.candidates[0].votes,row.candidates[1].votes]=[row.candidates[1].votes,row.candidates[0].votes];
let negative=buildPatternReview(f);assert.equal(negative.counties[target].offices.governor.flags.length,1);
const pos=positive.counties[target].offices.governor.flags[0],neg=negative.counties[target].offices.governor.flags[0];
assert.equal(pos.evidence.democratShareChangePp,-neg.evidence.democratShareChangePp);assert.equal(pos.evidence.peer.modifiedZ,neg.evidence.peer.modifiedZ===null?null:-neg.evidence.peer.modifiedZ);
assert.match(pos.label,/Democrats relative to state peers/);assert.match(neg.label,/Republicans relative to state peers/);
assert.equal(patternDirection([pos]), 'democrat');
assert.equal(patternDirection([neg]), 'republican');
assert.equal(patternDirection([{id:'participation-state-peer-and-own-history'}]), 'neutral');
assert.equal(patternDirection([pos,neg]), 'mixed', 'Conflicting directions must not be assigned to one party');
assert.equal(pos.evidence.democratCountChange,1500);assert.equal(pos.evidence.republicanCountChange,-1500);assert.equal(pos.provisional,true);
for(const [name,mutate] of [
  ['held',f=>currentRow(f).sourceNeedsReview=true],['incomplete',f=>currentRow(f).incomplete=true],['null',f=>currentRow(f).candidates[0].votes=null],
  ['boundary',f=>currentRow(f).boundaryChanged=true],['wrongstate',f=>currentRow(f).stateFips='12'],['special',f=>currentRow(f).special=true],['runoff',f=>currentRow(f).stage='runoff'],
  ['previousunofficial',f=>priorRow(f).unofficial=true],['unknownaggregate',f=>currentRow(f).reportingCategories.push({name:'Other',category:'unitemizedCandidates',votes:20})],
  ['tiny',f=>priorRow(f).candidates[0].votes=99],['provisionalzero',f=>currentRow(f).candidates.forEach(c=>c.votes=0)],
  ['duplicatecurrentregularcontests',f=>f.elections['governor-2026'].results.push({...currentRow(f),contestId:'separate-regular-contest'})],
  ['mixedpriorcontests',f=>f.elections['governor-2022'].results.push({...priorRow(f)})],
]){f=shifted();mutate(f);r=buildPatternReview(f);assert.equal(r.counties[target].offices.governor.status,'not-assessed',name);assert.equal(r.counties[target].offices.governor.flags.length,0,name);}
f=shifted();f.mapCounties=f.mapCounties.slice(0,10);r=buildPatternReview(f);assert.equal(r.counties[target].offices.governor.status,'not-assessed','Nine other peers insufficient');
f=shifted();f.elections['senate-2026']={...f.elections['governor-2026'],office:'senate'};f.elections['house-2026']={...f.elections['governor-2026'],office:'house'};r=buildPatternReview(f);assert.equal(r.summary.offices.senate.assessed,0);assert.equal(r.summary.offices.house.assessed,0,'No guessing complete district coverage');
f=shifted();for(const row of f.elections['governor-2026'].results){row.candidates[0].votes=2000;row.candidates[1].votes=8000;}currentRow(f).candidates[0].votes=3500;currentRow(f).candidates[1].votes=6500;r=buildPatternReview(f);const flag=r.counties[target].offices.governor.flags[0];assert.equal(flag.evidence.democratShareChangePp,-15);assert.match(flag.label,/relative to state peers/,'Label does not imply an absolute positive shift');
assert.equal(patternDirection([flag]), 'democrat', 'Border direction follows peer residual, including an absolute negative share change');
assert.equal(peerScreen(51,Array(11).fill(30)).outside,true);assert.equal(peerScreen(39,Array(11).fill(30)).outside,false);
// Separate positive count-growth screen, not a replacement for share shift.
function growthFixture(d=1000,r=1000) {const f=fixture();for(const data of Object.values(f.elections))for(const row of data.results){row.candidates[0].votes=d;row.candidates[1].votes=r;row.totalVotes=d+r;}return f;}
function growthResult(f){return buildPatternReview(f).counties[target].offices.governor.partyGrowth;}
function setCurrent(f,d,r){const row=currentRow(f);row.candidates[0].votes=d;row.candidates[1].votes=r;row.totalVotes=d+r;return f;}
f=setCurrent(growthFixture(),1500,1000);let growth=growthResult(f);assert.equal(growth.flags.length,1);assert.equal(growth.flags[0].evidence.growthParty,'Democrat');assert.equal(growth.flags[0].evidence.ownGrowthPercent,50);assert.equal(growth.flags[0].evidence.ownCountIncrease,500);assert.equal(growth.flags[0].evidence.ordinaryOpposition,true);assert.equal(patternDirection(growth.flags),'democrat');
for(const data of Object.values(f.elections))for(const row of data.results)[row.candidates[0].votes,row.candidates[1].votes]=[row.candidates[1].votes,row.candidates[0].votes];let mirror=growthResult(f);assert.equal(mirror.flags.length,1);assert.equal(mirror.flags[0].evidence.growthParty,'Republican');assert.equal(mirror.flags[0].evidence.ownGrowthPercent,growth.flags[0].evidence.ownGrowthPercent);assert.equal(patternDirection(mirror.flags),'republican');assert.equal(patternDirection([pos,...mirror.flags]),'mixed','Conflicting actual screen directions remain mixed');
f=setCurrent(growthFixture(),1500,1100);growth=growthResult(f);assert.equal(growth.flags.length,1,'Opposing growth exactly10pp at MAD0 is inclusively ordinary despite float roundoff');assert.equal(growth.flags[0].evidence.opposingGrowthPercent,10);
f=growthFixture();for(const row of f.elections['governor-2026'].results){row.candidates[0].votes=1200;row.totalVotes=2200;}setCurrent(f,1450,1000);growth=growthResult(f);assert.equal(growth.flags.length,1,'Own45 minus peer20 is exactly25pp despite float roundoff');assert.equal(growth.flags[0].evidence.peer.distancePp,25);
f=setCurrent(growthFixture(400,1000),500,1000);assert.equal(growthResult(f).flags.length,1,'Exactly25percent and100votes pass inclusive growth minimums');
for(const [name,base,d,r] of [['bothparties-unusually-grow',growthFixture(),1500,1500],['below25percent',growthFixture(),1249,1000],['under100gain',growthFixture(300,1000),390,1000],['opponentMAD0outside10',growthFixture(),1500,1101]])assert.equal(growthResult(setCurrent(base,d,r)).flags.length,0,name);
f=growthFixture();for(const row of f.elections['governor-2026'].results){row.candidates[0].votes=1500;row.totalVotes=2500;}assert.equal(growthResult(f).flags.length,0,'Uniform same-state party growth is not an above-peer outlier');
f=growthFixture(10000,10000);for(let i=1;i<12;i++){f.elections['governor-2026'].results[i].candidates[1].votes=10000+(i-6)*100;}setCurrent(f,15000,12000);assert.equal(growthResult(f).flags.length,0,'Opposing nonzeroMAD |z|>2 rejects unilateral growth');
for(const [name,mutate] of [['sourcehold',f=>currentRow(f).sourceNeedsReview=true],['incomplete',f=>currentRow(f).incomplete=true],['null',f=>currentRow(f).candidates[0].votes=null],['zerobaseline',f=>priorRow(f).candidates[0].votes=0],['tiny',f=>priorRow(f).candidates[0].votes=99],['boundary',f=>currentRow(f).boundaryNote='incompatible'],['allcurrentzero',f=>currentRow(f).candidates.forEach(c=>c.votes=0)]]){f=setCurrent(growthFixture(),1500,1000);mutate(f);assert.equal(growthResult(f).status,'not-assessed',name);assert.equal(growthResult(f).flags.length,0,name);}
f=setCurrent(growthFixture(),1500,1000);currentRow(f).countingStatus='counting';currentRow(f).precinctReportingPercent=100;growth=growthResult(f);assert.equal(growth.flags[0].provisional,true);assert.equal(growth.flags[0].evidence.currentSource.countingStatus,'counting');assert.equal(growth.flags[0].evidence.currentSource.provisional,true,'100percent precincts is not certification');
// Only explicitly qualified Senate identities or complete House scopes can enter either screen.
function relocate(f,state){for(const c of f.mapCounties)c.fips=state+c.fips.slice(2);for(const data of Object.values(f.elections))for(const row of data.results){row.stateFips=state;row.countyFips=state+row.countyFips.slice(2);}return f;}
f=relocate(growthFixture(),'37');f.elections['senate-2026']={...f.elections['governor-2026'],office:'senate',results:f.elections['governor-2026'].results.map(row=>({...row,office:'senate'}))};f.elections['senate-2020']={...f.elections['governor-2022'],office:'senate',year:2020,results:f.elections['governor-2022'].results.map(row=>({...row,office:'senate',year:2020}))};r=buildPatternReview(f);assert.equal(r.summary.partyGrowth.senate.assessed,12,'Official ClassII regular2020-to2026 qualification');assert.match(r.counties['37001'].offices.senate.evidence.seatId,/class-2/);f.elections['senate-2020'].results[0].stage='first round';assert.equal(buildPatternReview(f).counties['37001'].offices.senate.partyGrowth.status,'not-assessed');
f=relocate(growthFixture(),'30');for(const year of [2022,2026])f.elections[`house-${year}`]={...f.elections[`governor-${year}`],office:'house',results:f.elections[`governor-${year}`].results.map(row=>({...row,office:'house',district:'1'}))};f.comparability={montanaHouse:{id:'synthetic-scope-proof',verified:true,intersections:f.mapCounties.map(c=>`${c.fips}|1`),sources:[{title:'Synthetic verified source scope',url:'https://example.test/scope'}]}};r=buildPatternReview(f);assert.equal(r.summary.partyGrowth.house.assessed,12);assert.equal(r.counties['30001'].offices.house.evidence.comparability.countyDistrictPortions.length,1);f.elections['house-2026'].results.shift();assert.equal(buildPatternReview(f).counties['30001'].offices.house.partyGrowth.status,'not-assessed','Incomplete portion inventory cannot be inferred');
const actual=buildActualReport(),again=buildActualReport(),saved=JSON.parse(fs.readFileSync(path.join(root,'public/data/anomalies-2026.json')));
assert.deepEqual(actual,again,'Identical actual inputs yield deterministic report');assert.deepEqual(saved,actual,'Published report reconciles to current merged source data');
assert.equal(actual.mapCountyCount,3142);assert.equal(Object.keys(actual.counties).length,3142);
for(const county of Object.values(actual.counties)) {
  for(const a of [county.participation,...Object.values(county.offices)]) {
    assert.ok(['assessed','not-assessed'].includes(a.status));if(a.status==='not-assessed'){assert.ok(a.reason);assert.equal(a.flags.length,0);}
    for(const flag of a.flags){assert.equal(flag.provisional,true);assert.ok(flag.sources.length>=2);assert.ok(flag.sources.every(s=>s.title&&s.url));assert.ok(flag.evidence.peer.peerCount>=10);}
  }
}
for(const screen of ['shareShift','partyGrowth'])for(const office of OFFICES){const s=actual.summary[screen][office];assert.equal(s.assessed+s.notAssessed,3142);}
assert.equal(actual.comparabilityContracts.montanaHouse.verified,true);assert.equal(actual.comparabilityContracts.montanaHouse.intersections.length,57);
assert.equal(actual.counties['48479'].offices.governor.partyGrowth.flags.length,0,'Webb is not forced above peer growth');assert.equal(actual.counties['48505'].offices.governor.partyGrowth.flags.length,0,'Zapata share flag does not force growth flag');assert.equal(actual.counties['48505'].offices.governor.shareShift.flags.length,1);
for(const office of OFFICES){const s=actual.summary.offices[office];assert.equal(s.assessed+s.notAssessed,3142);const globalCounts=['assessed','not-assessed','flagged'].map(status=>Object.keys(actual.counties).filter(f=>reviewForCounty(actual,office,f).status===status).length);assert.equal(globalCounts.reduce((a,b)=>a+b),3142);}
assert.equal(stateReviewSummary(actual,'governor','06').countyCount,58);assert.equal(reviewForCounty(actual,'house','99999').status,'not-assessed');
assert.ok(!/Infinity|NaN/.test(JSON.stringify(actual)));assert.equal(fs.readFileSync(path.join(root,'PATTERN-REVIEW.md'),'utf8'),renderPatternReport(actual));assert.equal(fs.readFileSync(path.join(root,'public/PATTERN-REVIEW.md'),'utf8'),renderPatternReport(actual));
console.log(JSON.stringify({status:'passed',syntheticChecks:['51vs30 participation plus historical gate','MAD0 guard and finite JSON','R/D mirror symmetry','relative direction label','tiny/missing/held/incomplete/null/provisional-zero exclusions','boundary/state/regular-contest gates','duplicate current and prior contests','no inferred Senate seats or House portions','ballots never candidate proxies','mirroredpositive party growth/count gain and opposing ordinary gates','no both-party turnout or uniform-peer growth flags','inclusive25pp/10pp roundoff guards','verified SenateClassII and completeMTcountyportion gates','Webb/Zapata non-cherrypicked actual controls'],mapCounties:actual.mapCountyCount,participation:actual.summary.participation,governor:actual.summary.offices.governor,shareShift:actual.summary.shareShift,partyGrowth:actual.summary.partyGrowth,deterministic:true},null,2));
