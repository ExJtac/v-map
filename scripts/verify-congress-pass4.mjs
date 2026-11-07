import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {auditedRegularSenateCounts} from '../src/history-series.js';
import {approvedUnknownSourceTime} from './reviewed-source-time.mjs';
const read=file=>JSON.parse(fs.readFileSync(file));
const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const scope=read('public/data/house-facts/scopes.json').scopes.find(s=>s.stateFips==='10'&&s.year===2026);
const cases=[['public/data/house-completion-de/house-2026.json',4],['public/data/senate-completion-de/senate-2026.json',4]];
let mutations=0;
for(const [file,count]of cases){
 const data=read(file);assert.equal(data.results.length,count);
 for(const row of data.results)assert.equal(approvedUnknownSourceTime(row,data,scope),true);
 for(const field of ['office','year']){const d=structuredClone(data);d[field]=field==='office'?'governor':2022;assert.equal(approvedUnknownSourceTime(d.results[0],d,scope),false);mutations++;}
 for(const [field,value]of [['stateFips','11'],['geoLevel','precinct'],['countyFips','10007'],['special',true],['stage','primary'],['asOf','2026-11-07T00:00:00Z'],['sourceUpdatedAt','2026-11-07T00:00:00Z'],['sourceTimestampRaw','changed']]){const d=structuredClone(data),row=d.results.find(r=>r.geoLevel==='county');row[field]=value;assert.equal(approvedUnknownSourceTime(row,d,scope),false,field);mutations++;}
 const d=structuredClone(data),source=d.sources[d.results[0].sourceId];if(data.office==='house')source.structuredCaptureSha256='0'.repeat(64);else source.sha256='0'.repeat(64);assert.equal(approvedUnknownSourceTime(d.results[0],d,scope),false);mutations++;
 if(data.office==='house'){
  assert.equal(hash(file),scope.pinnedFileHashes[file]);
  const changed=structuredClone(scope);changed.review.approvalReceiptSha256='0'.repeat(64);assert.equal(approvedUnknownSourceTime(data.results[0],data,changed),false);mutations++;
  assert.equal(approvedUnknownSourceTime(data.results[0],data,null),false);
 }else{const changed=structuredClone(data);changed.review.approvalReceiptSha256='0'.repeat(64);assert.equal(approvedUnknownSourceTime(changed.results[0],changed,scope),false);mutations++;}
}
const report=read('public/data/anomalies-2026.json'),progress=read('public/data/research-progress-2026.json');
for(const state of ['19','37'])assert.equal(report.comparabilityContracts.houseStates[state].verified,true);
for(const [key,year]of [['35-2022',2022],['10-2026',2026],['21-2026',2026]]){const c=report.comparabilityContracts.houseFacts[key];assert.equal(c.verified,true);assert.equal(c.year,year);assert.equal(c.comparisonQualified,false);}
for(const state of ['35','10','21']){assert.equal(report.comparabilityContracts.houseStates[state]?.verified===true,false);assert.equal(Object.values(report.counties).filter(c=>c.stateFips===state&&c.offices.house.status==='assessed').length,0);}
for(const fips of ['10001','10003','10005'])assert.equal(report.counties[fips].offices.senate.status,'assessed');
for(const fips of ['10001','10003','10005'])for(const year of [2020,2026]){const point=auditedRegularSenateCounts(report,fips,year),e=report.counties[fips].offices.senate.reviewScreens.raceVoteChange.evidence;assert.equal(point.total,year===2020?e.priorRaceVotes:e.currentRaceVotes);}
for(const [fips,year]of [['10001',2022],['13001',2026],['12001',2026],['39001',2026]])assert.ok(auditedRegularSenateCounts(report,fips,year).reason);
for(const mutate of [d=>d.comparabilityContracts.senateClass2.id='wrong',d=>d.counties['10001'].offices.senate.reviewScreens.raceVoteChange.status='not-assessed',d=>d.counties['10001'].offices.senate.reviewScreens.raceVoteChange.evidence.comparability.id='wrong',d=>d.counties['10001'].offices.senate.reviewScreens.raceVoteChange.evidence.seatId='wrong']){const d={comparabilityContracts:structuredClone(report.comparabilityContracts),counties:{'10001':structuredClone(report.counties['10001'])}};mutate(d);assert.ok(auditedRegularSenateCounts(d,'10001',2026).reason);}
const oh=read('public/data/senate-state-oh-pass4/senate-2026.json'),contract=report.comparabilityContracts.senateSpecials['39'];assert.equal(contract.verified,true);assert.equal(hash('public/data/senate-state-oh-pass4/senate-2026.json'),contract.pinnedFileHashes['public/data/senate-state-oh-pass4/senate-2026.json']);assert.equal(oh.results[0].candidates.length,7);assert.equal(oh.results[0].totalVotes,4601925);
assert.ok(progress.offices.house.numericallyAssessed>=1065);assert.ok(progress.offices.senate.numericallyAssessed>=1563);
console.log(JSON.stringify({status:'passed',unknownClockRows:8,rejectingMutations:mutations,pairedHouseStates:['IA','NC'],singleYearFactsNotComparisons:['KY2026','NM2022','DE2026'],newSenateCounties:3,ohStateMetadataOnly:true}));
