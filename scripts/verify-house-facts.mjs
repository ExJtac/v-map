import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {houseFactComparability,additionalHouseComparability} from './build-2026-anomalies.mjs';
import {houseFactScope,scopedHouseFacts} from '../src/house-facts.js';
import {auditedHouseCounts,historyPoint} from '../src/history-series.js';
import {mergeElectionData} from '../src/county-data.js';
import {COUNTY_SOURCES} from '../src/coverage-sources.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const clone=structuredClone,hash=b=>crypto.createHash('sha256').update(b).digest('hex');
function fixture(year=2026){
 const file=`public/data/test-house/house-${year}.json`,digest='1'.repeat(64);
 const make=(county,district,r,d,geoLevel='county')=>({office:'house',year,stateFips:'01',countyFips:county,district,geoLevel,stage:'general',special:false,sourceId:'named',sourceIds:['named','appendix'],sourceSelection:{url:file.slice(6)},candidates:[{name:'R',party:'Republican',votes:r},{name:'D',party:'Democrat',votes:d}],reportingCategories:[],totalVotes:r+d,provisional:year===2026});
 const rows=[make('01001','1',40,0),make('01001','2',5,10),make('01003','2',7,3),make(null,'1',40,0,'district'),make(null,'2',12,13,'district')];
 const intersections=['01001|1','01001|2','01003|2'];
 const proof={id:`test-house-facts-${year}`,office:'house',stateFips:'01',year,comparisonQualified:false,scopeComplete:true,controlsPassed:true,countyBoundariesCompatible:true,candidateControlCount:4,expectedCountyCount:2,districtCount:2,intersections,inventorySha256:hash(JSON.stringify(intersections)),pinnedFileHashes:{[file]:digest},review:{status:'approved',reviewedAt:'2026-11-07T22:00:00Z',approvalReceiptSha256:'2'.repeat(64),evidenceSha256:'3'.repeat(64)}};
 return {rows,elections:{[`house-${year}`]:{office:'house',year,results:rows}},inputHashes:{[file]:digest},register:{schemaVersion:1,scopes:[proof]},file,year};
}
function report(f){return {inputHashes:f.inputHashes,comparabilityContracts:{houseFacts:houseFactComparability(f.elections,f.inputHashes,f.register)}};}
const withheld=(rows,r,id='01001',year=2026,level='county',message)=>assert.ok(scopedHouseFacts(rows,r,id,year,level).reason,message);
for(const year of [2022,2026]){
 const f=fixture(year),r=report(f);assert.equal(r.comparabilityContracts.houseFacts[`01-${year}`].verified,true);assert.equal(r.comparabilityContracts.houseFacts[`01-${year}`].comparisonQualified,false);
 const county=scopedHouseFacts(f.rows,r,'01001',year);assert.deepEqual([county.total,county.republican,county.democrat],[55,45,10]);assert.equal(county.provisional,year===2026);assert.deepEqual(county.sourceIds,['appendix','named']);
 assert.deepEqual([scopedHouseFacts(f.rows,r,'01',year,'state').total,scopedHouseFacts(f.rows,r,'01',year,'state').republican,scopedHouseFacts(f.rows,r,'01',year,'state').democrat],[65,52,13]);
 assert.ok(auditedHouseCounts(r,'01001',year).reason,'A single-year fact scope must never unlock a paired historical count');
 assert.equal(historyPoint(year,county,[{year:year===2026?2025:year,value:1000}]).totalRate,5.5);
 withheld(f.rows,r,'01001',year===2026?2022:2026,'county','Wrong-year scope cannot carry across cycles');
}
for(const [name,mutate] of [
 ['missing hash',f=>delete f.inputHashes[f.file]],['changed hash',f=>f.inputHashes[f.file]='9'.repeat(64)],
 ['wrong selected source',f=>f.rows[0].sourceSelection.url='/data/unapproved/house-2026.json'],['missing selected source',f=>delete f.rows[0].sourceSelection],
 ['missing portion',f=>f.elections['house-2026'].results=f.rows.filter((_,i)=>i!==0)],['duplicate portion',f=>f.rows.push(clone(f.rows[0]))],
 ['missing scope id',f=>delete f.register.scopes[0].id],['blank scope id',f=>f.register.scopes[0].id=' '],
 ['unapproved review',f=>f.register.scopes[0].review.status='pending'],['missing receipt',f=>delete f.register.scopes[0].review.approvalReceiptSha256],
 ['changed inventory digest',f=>f.register.scopes[0].inventorySha256='0'.repeat(64)],['incomplete inventory',f=>f.register.scopes[0].scopeComplete=false],
 ['wrong district count',f=>f.register.scopes[0].districtCount=3],['wrong county count',f=>f.register.scopes[0].expectedCountyCount=3],
 ['missing special false',f=>delete f.rows[0].special],['special contest',f=>f.rows[0].special=true],['runoff',f=>f.rows[0].stage='runoff'],
]){const f=fixture();mutate(f);assert.equal(report(f).comparabilityContracts.houseFacts['01-2026'].verified,false,`Builder must reject ${name}`);}
assert.throws(()=>{const f=fixture();f.register.scopes[0].comparisonQualified=true;report(f);},/scope/);
const f=fixture(),r=report(f);
for(const [name,mutate] of [
 ['null candidate',a=>a[0].candidates[0].votes=null],['negative candidate',a=>a[0].candidates[0].votes=-1],['fraction candidate',a=>a[0].candidates[0].votes=1.5],
 ['missing candidate name',a=>a[0].candidates[0].name=''],['unnamed aggregate',a=>a[0].candidates[0].name='OTHER'],['plural unnamed aggregate',a=>a[0].candidates[0].name='OTHERS'],['accounting category as candidate',a=>a[0].candidates[0].name='TOTAL BALLOTS CAST'],
 ['unknown reporting category',a=>a[0].reportingCategories=[{category:'sourceReportingCategory',votes:11}]],['missing write-ins',a=>a[0].reportingCategories=[{category:'sourceWriteInEntries',votes:null}]],
 ['unreviewed generic write-ins',a=>a[0].reportingCategories=[{category:'writeInVotes',votes:11}]],['wrong office',a=>a[0].office='senate'],['wrong year',a=>a[0].year=2022],
 ['wrong state',a=>a[0].stateFips='02'],['unqualified selected file',a=>a[0].sourceSelection.url='/data/wrong/house-2026.json'],
 ['missing portion',a=>a.splice(0,1)],['duplicate portion',a=>a.push(clone(a[0]))],['deleted special false',a=>delete a[0].special],
 ...['sourceNeedsReview','sourceTotalConflict','voteTotalMismatch','incomplete','boundaryChanged','boundaryIncompatible','boundaryNote','geographicCoverageNote','suppressElectionWinner'].map(flag=>[flag,a=>a[0][flag]=true]),
 ['winner hold',a=>a[0].winnerEligible=false],
]){const rows=clone(f.rows);mutate(rows);withheld(rows,r,'01001',2026,'county',name);}
for(const mutation of [a=>a[3].candidates[0].votes=null,a=>a.push(clone(a[3])),a=>a.splice(3,1),a=>a[3].sourceSelection.url='/data/wrong/house-2026.json']){const a=clone(f.rows);mutation(a);withheld(a,r,'01',2026,'state','State must validate actual distinct district rows');}
const swapped=clone(f.rows);for(const row of swapped)for(const c of row.candidates)c.party=c.party==='Democrat'?'Republican':c.party==='Republican'?'Democrat':c.party;const mirror=scopedHouseFacts(swapped,r,'01001',2026);assert.deepEqual([mirror.total,mirror.republican,mirror.democrat],[55,10,45],'Identical source rules treat party labels symmetrically');
const noParty=clone(f.rows);noParty[0].candidates=noParty[0].candidates.filter(c=>c.party!=='Democrat');noParty[1].candidates=noParty[1].candidates.filter(c=>c.party!=='Democrat');assert.equal(scopedHouseFacts(noParty,r,'01001',2026).democrat,null,'Absent nominee is typed missing');
const zero=clone(f.rows);zero[1].candidates.find(c=>c.party==='Democrat').votes=0;assert.equal(scopedHouseFacts(zero,r,'01001',2026).democrat,0,'Actual reported zero remains zero');
const cats=clone(f.rows);cats[0].reportingCategories=[{category:'unattributedWriteIns',votes:3,sourceId:'write-in-appendix'},{category:'undervotes',votes:500}];const accounted=scopedHouseFacts(cats,r,'01001',2026);assert.equal(accounted.total,58);assert.ok(accounted.sourceIds.includes('write-in-appendix'));assert.equal(accounted.republican,45);
const old=fixture(2022);old.rows[0].unofficial=true;withheld(old.rows,report(old),'01001',2022,'county','Provisional historical source is held');
assert.equal(houseFactScope({},'01001',2026),null);withheld(f.rows,{},'01001',2026);
console.log('House single-year synthetic gates passed: separate county/state facts, source/year/pin/inventory/review/quality/category holds, strict special false, typed missing versus zero, and no historical-pair authority.');
// Actual normalized inputs resolve through the same registered source precedence, without rebuilding the audit.
const inputHashes={},read=name=>{const bytes=fs.readFileSync(path.join(root,name));inputHashes[name]=hash(bytes);return JSON.parse(bytes);};
const manifests=COUNTY_SOURCES.map(s=>({...s,manifest:read(`public/data/${s.name}/manifest.json`)}));
const elections={};for(const year of [2022,2026]){
 const baseName=`public/data/elections/house-${year}.json`,base=fs.existsSync(path.join(root,baseName))?read(baseName):null,supplementBundles=[],sourceHolds=[];
 for(const source of manifests){sourceHolds.push(...(source.manifest.sourceHolds||[]).filter(h=>h.office==='house'&&h.year===year));for(const url of new Set(source.manifest.coverage.filter(c=>c.office==='house'&&c.year===year).map(c=>c.url)))supplementBundles.push({...source,url,data:read(`public${url}`)});}
 elections[`house-${year}`]=mergeElectionData(base,{office:'house',year,supplementBundles,sourceHolds});
}
const scopes=read('public/data/house-facts/scopes.json'),audit=read('public/data/anomalies-2026.json');
const actual={inputHashes,comparabilityContracts:{...audit.comparabilityContracts,houseStates:additionalHouseComparability(elections,inputHashes,read('public/data/house-comparability/2026.json')),houseFacts:houseFactComparability(elections,inputHashes,scopes)}};
for(const p of scopes.scopes)assert.equal(actual.comparabilityContracts.houseFacts[`${p.stateFips}-${p.year}`].verified,true,p.id);
const counts=(fips,year,level='county')=>scopedHouseFacts(elections[`house-${year}`].results,actual,fips,year,level);
assert.deepEqual([counts('21001',2026).total,counts('21001',2026).republican,counts('21001',2026).democrat],[5910,4870,1040]);
const kyRows=elections['house-2026'].results.filter(row=>row.countyFips==='21001'),kyFile=`public${kyRows[0].sourceSelection.url}`;
const actualWrongHash={...actual,inputHashes:{...inputHashes,[kyFile]:'0'.repeat(64)}};withheld(kyRows,actualWrongHash,'21001',2026,'county','Actual current-only source hash mutation must fail at viewer');
const actualWrongSelection=clone(kyRows);actualWrongSelection[0].sourceSelection.url='/data/modern-counties/house-2026.json';withheld(actualWrongSelection,actual,'21001',2026,'county','Actual selected higher-priority source must be approved, not any year file');
const actualUnapproved={...actual,comparabilityContracts:{...actual.comparabilityContracts,houseFacts:{...actual.comparabilityContracts.houseFacts,'21-2026':{...actual.comparabilityContracts.houseFacts['21-2026'],verified:false}}}};withheld(kyRows,actualUnapproved,'21001',2026,'county','Actual source needs verified single-year scope');
assert.equal(counts('21',2026,'state').total,1422600);assert.ok(counts('21001',2022).reason);assert.ok(auditedHouseCounts(actual,'21001',2026).reason);
assert.deepEqual([counts('13135',2026).total,counts('13135',2026).republican,counts('13135',2026).democrat],[342723,108141,234582]);assert.ok(counts('13135',2022).reason,'Unknown Gwinnett9/11/70 categories remain held');
assert.equal(counts('46003',2022).democrat,null,'Actual SD historical absence stays null');assert.ok(counts('46003',2022).republican>0);
const wv=counts('54001',2022);assert.ok(!wv.reason);assert.deepEqual(wv.sourceIds,['house-completion-wv2022-writein-repair','modern-heideman-v1-house-wv_medsl_2022'],'Both original WV named vector and separate write-in source survive aggregation');
// Every actual paired-scope county that passes fact gates must match the independently generated audit totals.
let pairedChecks=0;for(const [fips,county]of Object.entries(audit.counties)){
 const race=county.offices?.house?.reviewScreens?.raceVoteChange;if(race?.status!=='assessed')continue;
 for(const year of [2022,2026]){const a=counts(fips,year),e=race.evidence;assert.equal(a.total,year===2026?e.currentRaceVotes:e.priorRaceVotes,`${fips}/${year}`);pairedChecks++;}
}
console.log(`Actual House facts passed: KY current-only county/state, Gwinnett current counts with historical hold, SD missing nominee, WV source union, and ${pairedChecks} audited paired county/year totals.`);

// Release requires every approved pass4 scope; a missing registration is a failure.
for(const [state,year,total]of [['19',2022,1211700],['19',2026,1341241],['37',2022,3760753],['37',2026,4190869]]){assert.ok(houseFactScope(actual,state,year),`${state}/${year} approved paired scope must be registered`);assert.equal(counts(state,year,'state').total,total,`${state}/${year} published district controls`);}
assert.equal(actual.comparabilityContracts.houseFacts['35-2022']?.verified,true,'NM historical-only source must be registered');{assert.equal(counts('35',2022,'state').total,704126);assert.equal(counts('35001',2022).total,242371);assert.ok(counts('35005',2026).reason,'Current masked NM cell cannot inherit historical-only authority');assert.ok(auditedHouseCounts(actual,'35001',2022).reason);}
assert.equal(actual.comparabilityContracts.houseFacts['10-2026']?.verified,true,'DE current-only source must be registered');{assert.deepEqual([counts('10003',2026).total,counts('10003',2026).republican,counts('10003',2026).democrat],[199213,53638,145575]);assert.equal(counts('10',2026,'state').total,378433);assert.ok(counts('10003',2022).reason);assert.ok(auditedHouseCounts(actual,'10003',2026).reason);}
console.log('Registered pass4 IA/NC district controls and NM historical-only/DE current-only facts retain their exact-year authority.');
