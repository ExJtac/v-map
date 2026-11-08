import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {COUNTY_SOURCES} from '../src/coverage-sources.js';
import {mergeElectionData} from '../src/county-data.js';
import {scopedHouseFacts} from '../src/house-facts.js';
import {auditedHouseCounts, historyPoint} from '../src/history-series.js';

const read=file=>JSON.parse(fs.readFileSync(file));
const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const copy=value=>structuredClone(value);
// A verified county scope does not authorize a partial state aggregate.
const selected='/data/synthetic/house-2026.json',file=`public${selected}`,digest='a'.repeat(64);
const row={office:'house',year:2026,stateFips:'12',countyFips:'12001',geoLevel:'county',district:'1',stage:'general',special:false,sourceId:'fixture',sourceSelection:{url:selected},candidates:[{name:'R',party:'Republican',votes:600},{name:'D',party:'Democrat',votes:400}]};
const scope={id:'bounded-fl-fixture',verified:true,intersectionsByYear:{2026:['12001|1']},pinnedFileHashes:{[file]:digest},stateFactsQualified:false,stateFactsReason:'Only 27 of 28 numeric district races; unopposed is not zero.'};
const synthetic={inputHashes:{[file]:digest},comparabilityContracts:{houseStates:{12:scope}}};
const district={...row,geoLevel:'district'};delete district.countyFips;
assert.equal(scopedHouseFacts([row,district],synthetic,'12001',2026).total,1000);
const held=scopedHouseFacts([row,district],synthetic,'12',2026,'state');
assert.equal(held.stateAggregateHeld,true);assert.equal(held.reason,scope.stateFactsReason);assert.equal(held.total,undefined);
assert.equal(historyPoint(2026,held).total,null);
const complete=copy(synthetic);delete complete.comparabilityContracts.houseStates[12].stateFactsQualified;
assert.equal(scopedHouseFacts([row,district],complete,'12',2026,'state').total,1000,'Unrelated complete state scopes must retain facts');
for(const mutate of [r=>r.candidates[0].votes=null,r=>r.reportingCategories=[{category:'unknownAccountingAlias',votes:99}],r=>r.sourceSelection.url='/data/unapproved/house-2026.json']){
 const changed=copy(row);mutate(changed);assert.ok(scopedHouseFacts([changed],synthetic,'12001',2026).reason);
}
console.log('Pass6 synthetic partial-state and source/category/typed-count holds passed.');

const report=read('public/data/anomalies-2026.json');
function merged(office,year){
 const name=`public/data/elections/${office}-${year}.json`,base=fs.existsSync(name)?read(name):null,supplementBundles=[],sourceHolds=[];
 for(const source of COUNTY_SOURCES){const manifest=read(`public/data/${source.name}/manifest.json`);sourceHolds.push(...(manifest.sourceHolds||[]).filter(h=>h.office===office&&h.year===year));for(const url of new Set(manifest.coverage.filter(c=>c.office===office&&c.year===year).map(c=>c.url)))supplementBundles.push({...source,url,data:read('public'+url)});}
 return mergeElectionData(base,{office,year,supplementBundles,sourceHolds});
}
const years=Object.fromEntries([2022,2026].map(y=>[y,merged('house',y)]));
const facts=(id,year,level='county',rows=years[year].results)=>scopedHouseFacts(rows,report,id,year,level);
const pins={
 'public/data/house-completion-vt/house-2022.json':'e2e2810e54d23a6d9bea4514ad66ffb4868e3276613f1daacc8aa460fefd9a01',
 'public/data/house-completion-vt/house-2026.json':'cdd1724258637ab1f7d139f1eaabaaa5dde39981e73e65169d3417149d1b6074',
 'public/data/house-completion-fl/house-2022.json':'239ab455f93caadc3657bab563c3994e53bd59c2b7cf8ea6a94adf21752439aa',
 'public/data/house-completion-fl/house-2026.json':'b0139603f0f943cd28bbf44f83ea7615d057f6624ae24c1809aa1251b567f724',
};
for(const [name,digest]of Object.entries(pins)){assert.equal(hash(name),digest,'Approved payload bytes changed');assert.equal(report.inputHashes[name],digest,'Audit must use exact approved source');}
for(const state of ['12','50'])assert.equal(report.comparabilityContracts.houseStates[state]?.verified,true,`${state} paired scope must be registered`);
const countyIds=state=>Object.keys(report.counties).filter(id=>id.startsWith(state)).sort();

const vtIds=countyIds('50');assert.equal(vtIds.length,14);
for(const [year,total,democrat,republican]of [[2022,282026,176494,78397],[2026,304675,198758,94078]]){
 let sum=0;for(const id of vtIds){const f=facts(id,year),a=auditedHouseCounts(report,id,year);assert.ok(!f.reason,`${id}/${year}: ${f.reason}`);assert.equal(f.total,a.total);sum+=f.total;}
 assert.equal(sum,total);assert.deepEqual([facts('50',year,'state').total,facts('50',year,'state').democrat,facts('50',year,'state').republican],[total,democrat,republican]);
 assert.ok(vtIds.every(id=>report.counties[id].offices.house.reviewScreens.raceVoteChange.status==='assessed'));
}
const vtCurrent=read('public/data/house-completion-vt/house-2026.json').results;
const vtCounty=vtCurrent.filter(r=>r.geoLevel==='county'),vtState=vtCurrent.find(r=>r.geoLevel==='district');
assert.equal(vtCounty.length,14);assert.ok(vtCurrent.every(r=>r.district==='0'&&r.sourceDistrict===null));
assert.equal(vtCounty.reduce((n,r)=>n+r.candidates.length,0),84);
const wc=vtCounty.flatMap(r=>r.reportingCategories.filter(c=>c.category==='sourceWriteInEntries'));
assert.equal(wc.length,82);assert.ok(wc.every(c=>c.sourceContainer==='wc'&&c.identityNotEstablished===true&&c.includedInCandidateVotes===true));
assert.equal(vtState.reportingCategories.filter(c=>c.category==='sourceWriteInEntries').length,68);
const literalWriteIns=vtState.reportingCategories.filter(c=>/^(BLANK|BLANK WRITE INS|FICTIOUS)$/.test(c.name));
assert.equal(literalWriteIns.length,5);assert.equal(literalWriteIns.reduce((n,c)=>n+c.votes,0),11);assert.ok(literalWriteIns.every(c=>c.category==='sourceWriteInEntries'&&c.identityNotEstablished===true),'Literal write-in names are neither reclassified accounting nor established identities');
assert.deepEqual(['overvotes','blankBallots'].map(k=>vtCounty.reduce((n,r)=>n+r.reportingCategories.filter(c=>c.category===k).reduce((m,c)=>m+c.votes,0),0)),[594,6241]);
assert.equal(vtCounty.reduce((n,r)=>n+r.sourcePublishedTotalVotesIncludingAccounting,0),311510);
assert.notEqual(facts('50',2026,'state').total,311510,'Accounting is not candidate votes');
const vtChanged=copy(years[2026].results),change=vtChanged.find(r=>r.countyFips==='50001');
change.reportingCategories.find(c=>c.category==='overvotes').votes=999999;
assert.equal(facts('50001',2026,'county',vtChanged).total,facts('50001',2026).total,'Explicit accounting remains excluded');
change.reportingCategories.find(c=>c.category==='overvotes').category='svUnverifiedAlias';assert.ok(facts('50001',2026,'county',vtChanged).reason,'Unknown alias must not inherit sv classification');

const flIds=countyIds('12'),flHolds={2022:['12031','12083','12095','12109'],2026:['12057','12095']};
const pairHolds=[...new Set([...flHolds[2022],...flHolds[2026]])].sort();assert.equal(flIds.length,67);
for(const year of [2022,2026]){
 let accepted=0;for(const id of flIds){const f=facts(id,year);if(flHolds[year].includes(id)){assert.ok(f.reason,`${id}/${year} incomplete source geometry must be held`);}else{assert.ok(!f.reason,`${id}/${year}: ${f.reason}`);accepted++;}}
 assert.equal(accepted,year===2022?63:65);
 const state=facts('12',year,'state');assert.equal(state.stateAggregateHeld,true);assert.match(state.reason,/27/);assert.match(state.reason,/28/);assert.match(state.reason,/unopposed/i);assert.equal(historyPoint(year,state).total,null);
 const raw=read(`public/data/house-completion-fl/house-${year}.json`).results,districts=raw.filter(r=>r.geoLevel==='district'),county=raw.filter(r=>r.geoLevel==='county');
 assert.equal(districts.length,27);assert.ok(!districts.some(r=>Number(r.district)===(year===2022?5:10)),'Unopposed non-tally must not become numeric zero');
 assert.equal(county.length,year===2022?94:98);assert.equal(county.reduce((n,r)=>n+r.candidates.length,0),year===2022?238:282);
 assert.equal(county.flatMap(r=>r.candidates).filter(c=>c.votes===0).length,year===2022?7:1,'Only actually published candidate zeroes retained');
 assert.equal(districts.reduce((n,r)=>n+r.totalVotes,0),year===2022?7332304:8003642,'Published 27-district sum is not a qualified whole-state aggregate');
 if(year===2026)assert.ok(raw.every(r=>r.sourceUpdatedAt===null&&r.asOf===null),'Unknown source clocks remain unknown');
}
let paired=0;for(const id of flIds){for(const year of [2022,2026]){const a=auditedHouseCounts(report,id,year);if(pairHolds.includes(id))assert.ok(a.reason,`${id} must retain paired hold`);else{assert.ok(!a.reason,`${id}/${year}: ${a.reason}`);assert.equal(a.total,facts(id,year).total);}}if(!pairHolds.includes(id))paired++;}assert.equal(paired,62);

// Prior negative findings and single-year-only authority survive a new paired import.
assert.deepEqual([facts('21001',2026).total,facts('21001',2026).republican,facts('21001',2026).democrat],[5910,4870,1040]);
assert.ok(facts('21001',2022).reason);assert.ok(facts('35005',2026).reason);assert.ok(facts('10003',2022).reason);assert.ok(facts('13135',2022).reason);
assert.equal(facts('46003',2022).democrat,null);
assert.deepEqual(facts('54001',2022).sourceIds,['house-completion-wv2022-writein-repair','modern-heideman-v1-house-wv_medsl_2022']);
const pa=read('public/data/source-reviews/pa-2026.json');for(const [name,digest]of Object.entries(pa.normalizedCurrentSourcePins))assert.equal(hash(name),digest);
for(const office of ['house','governor']){const data=office==='house'?years[2026]:merged(office,2026),rows=data.results.filter(r=>r.stateFips==='42');assert.equal(rows.length,office==='house'?101:68);assert.ok(rows.every(r=>r.sourceId===pa.sourceId&&r.sourceNeedsReview===true&&r.sourceQualityNote===pa.reason));}
console.log(JSON.stringify({status:'passed',vtPairedCounties:14,vtRaceTotals:[282026,304675],vtCurrentAccountingExcluded:6835,flPairedCounties:paired,flSingleYearFacts:{2022:63,2026:65},flPairedHeldCounties:pairHolds,flStateAggregatesHeld:true,priorHoldsAndProvenancePreserved:true}));
