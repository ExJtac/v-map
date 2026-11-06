import assert from 'node:assert/strict';
import fs from 'node:fs';
import { summarizeRace } from '../src/election-data.js';
for (const year of [2022,2024]) {
 const data=JSON.parse(fs.readFileSync(new URL(`../public/data/elections/house-${year}.json`,import.meta.url)));
 const record=data.results.find(r=>r.stateFips==='23'&&r.district==='2');
 const summary=summarizeRace(record);
 for (const field of ['winner','party','share','margin']) assert.equal(summary[field],null,`${year} suspect RCV ${field} must be suppressed`);
 assert.equal(summary.sourceNeedsReview,true);assert.equal(summary.incomplete,true);
}
const la=JSON.parse(fs.readFileSync(new URL('../public/data/elections/senate-2014.json',import.meta.url))).results.find(r=>r.stateFips==='22');
assert.equal(la.totalVotes,3523183);assert.equal(summarizeRace(la).winner,null);assert.equal(summarizeRace(la).share,null);
const ordinary={candidates:[{name:'A',party:'Democrat',votes:60},{name:'B',party:'Republican',votes:40}],totalVotes:100};
assert.equal(summarizeRace(ordinary).winner.name,'A');assert.equal(summarizeRace(ordinary).margin,20);
assert.equal(summarizeRace({...ordinary,sourceNeedsReview:true}).winner,null);
const zero={candidates:[{name:'A',party:'Democrat',votes:0},{name:'B',party:'Republican',votes:0}],totalVotes:0};
assert.equal(summarizeRace(zero).winner,null);
assert.equal(summarizeRace(zero).qualityNeedsReview,false);
assert.equal(summarizeRace({...zero,candidates:[...zero.candidates,{name:'OTHER',party:'Other',votes:0}]}).qualityNeedsReview,false);
assert.equal(summarizeRace({...zero,reportingCategories:[{category:'unitemized candidates',votes:null}]}).qualityNeedsReview,true);
console.log('Passed: 2022/2024 Maine CD2 winner, party, share and margin suppressed; ordinary summary preserved.');
