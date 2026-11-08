import fs from 'node:fs';import assert from 'node:assert/strict';import crypto from 'node:crypto';
import {COUNTY_SOURCES} from '../src/coverage-sources.js';import {mergeElectionData,resolveElectionSources} from '../src/county-data.js';
import {scopedHouseFacts} from '../src/house-facts.js';import {auditedHouseCounts} from '../src/history-series.js';import {summarizeRace} from '../src/election-data.js';import {SOURCE_HOLDS} from '../src/source-holds.js';
const read=file=>JSON.parse(fs.readFileSync(file));const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const report=read('public/data/anomalies-2026.json'),review=read('public/data/source-reviews/pa-2026.json');
function merged(office,year){const file=`public/data/elections/${office}-${year}.json`,base=fs.existsSync(file)?read(file):null,supplementBundles=[];for(const source of COUNTY_SOURCES){const manifest=read(`public/data/${source.name}/manifest.json`);for(const url of new Set(manifest.coverage.filter(c=>c.office===office&&c.year===year).map(c=>c.url)))supplementBundles.push({...source,url,data:read('public'+url)});}return mergeElectionData(base,{office,year,supplementBundles,sourceHolds:[]});}
const years=Object.fromEntries([2022,2026].map(y=>[y,merged('house',y)]));
for(const state of ['45','53'])assert.equal(report.comparabilityContracts.houseStates[state].verified,true);
for(const year of [2022,2026]){
 const data=years[year],sc=data.results.filter(r=>r.stateFips==='45'&&r.geoLevel==='county');assert.equal(sc.length,56);
 for(const id of new Set(sc.map(r=>r.countyFips))){const counts=scopedHouseFacts(data.results,report,id,year);assert.ok(!counts.reason,`${id}/${year}: ${counts.reason}`);assert.equal(counts.total,auditedHouseCounts(report,id,year).total);}
 const state=scopedHouseFacts(data.results,report,'45',year,'state');assert.equal(state.total,year===2022?1602341:2029688);
}
const sc2022=years[2022].results.filter(r=>r.stateFips==='45'&&r.geoLevel==='county');assert.ok(sc2022.some(r=>r.reportingCategories?.some(c=>c.category==='overUnderVotes'&&c.votes>0)));
const single=sc2022[0],changed=structuredClone(years[2022].results);const target=changed.find(r=>r.countyFips===single.countyFips&&r.district===single.district);assert.ok(target.reportingCategories.some(c=>c.category==='overUnderVotes'));target.reportingCategories.find(c=>c.category==='overUnderVotes').category='unknownCombinedField';assert.ok(scopedHouseFacts(changed,report,single.countyFips,2022).reason);
let waHeld=0,waCompared=0;for(const [id,c]of Object.entries(report.counties).filter(([id])=>id.startsWith('53'))){assert.ok(!scopedHouseFacts(years[2026].results,report,id,2026).reason);if(c.offices.house.status==='assessed')waCompared++;else{waHeld++;assert.match(scopedHouseFacts(years[2022].results,report,id,2022).reason,/amendment|amended/i);}}
assert.equal(waCompared,32);assert.equal(waHeld,7);assert.equal(scopedHouseFacts(years[2026].results,report,'53',2026,'state').total,2830836);assert.ok(scopedHouseFacts(years[2022].results,report,'53',2022,'state').reason);
for(const [file,digest]of Object.entries(review.normalizedCurrentSourcePins))assert.equal(hash(file),digest,'Original PA normalized payload changed');
for(const office of ['house','governor']){
 const data=office==='house'?years[2026]:merged(office,2026),rows=data.results.filter(r=>r.stateFips==='42');assert.equal(rows.length,office==='house'?101:68);
 for(const row of rows){assert.equal(row.sourceId,review.sourceId);assert.equal(row.sourceNeedsReview,true);assert.equal(row.sourceQualityNote,review.reason);assert.equal(summarizeRace(row).winner,null);}
}
const holders=SOURCE_HOLDS.filter(h=>h.sourceId===review.sourceId);assert.equal(holders.length,6);assert.ok(holders.every(h=>h.year===2026&&h.stateFips==='42'&&review.offices.includes(h.office)));
const fixture={office:'house',year:2026,sources:{},results:[{geoLevel:'district',stateFips:'42',district:'1',stage:'general',special:false,sourceId:review.sourceId,candidates:[{name:'A',party:'Democrat',votes:600},{name:'B',party:'Republican',votes:400}],totalVotes:1000}]};
const resolve=data=>resolveElectionSources(data,{office:data.office,year:data.year,supplementBundles:[],sourceHolds:[]}).results[0];assert.equal(resolve(fixture).sourceNeedsReview,true);
for(const mutate of [d=>d.year=2022,d=>d.office='senate',d=>d.results[0].stateFips='41',d=>d.results[0].sourceId='separately-approved-production-source']){const d=structuredClone(fixture);mutate(d);assert.equal(resolve(d).sourceNeedsReview,undefined,'Source hold leaked outside exact reviewed selector');}
const safe=structuredClone(fixture);safe.results[0].sourceId='separately-approved-production-source';const selected=resolveElectionSources(fixture,{office:'house',year:2026,sourceHolds:[],supplementBundles:[{name:'approved',priority:1000,url:'/data/approved/house-2026.json',data:safe}]}).results[0];assert.equal(selected.sourceNeedsReview,undefined);assert.equal(selected.sourceId,'separately-approved-production-source');assert.equal(fixture.results[0].sourceNeedsReview,undefined,'Hold resolver mutated original evidence');
assert.equal(Object.values(report.counties).filter(c=>c.stateFips==='42'&&c.offices.governor.status==='assessed').length,0);assert.equal(Object.values(report.counties).filter(c=>c.stateFips==='42'&&c.offices.house.flags.length).length,0);
console.log(JSON.stringify({status:'passed',newHouseComparisons:78,waCurrentFacts:39,waHistoricalHolds:7,scAccountingExcluded:true,paSourceRowsHeld:169,paRawPayloadsPreserved:true,alternateSourceNotHeld:true}));
