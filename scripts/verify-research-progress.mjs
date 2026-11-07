import fs from 'node:fs';import assert from 'node:assert/strict';
import {buildResearchProgress} from './build-research-progress.mjs';
import {renderResearchProgress} from '../src/research-progress.js';
const actual=JSON.parse(fs.readFileSync('public/data/research-progress-2026.json'));
assert.deepEqual(actual,buildResearchProgress());assert.equal(actual.status,'incomplete');assert.equal(actual.states.length,51);
const scope=JSON.parse(fs.readFileSync('public/data/congress-scope-2026.json'));
assert.equal(scope.states.length,51);assert.equal(new Set(scope.states.map(s=>s.stateFips)).size,51);
assert.equal(scope.states.filter(s=>s.senate.referenceUnitsInScope>0).length,35);
assert.equal(scope.states.filter(s=>s.house.referenceUnitsInScope>0).length,50);
assert.equal(actual.offices.senate.referenceUnitsInElectionScope,2471);assert.equal(actual.offices.house.referenceUnitsInElectionScope,3141);
assert.match(scope.states.find(s=>s.stateFips==='22').house.roundLimit,/open primary/);
for(const office of ['house','senate']){
 const sum=actual.offices[office];assert.equal(sum.referenceCounties,3142);assert.equal(sum.numericallyAssessed+sum.notAssessed,3142);
 assert.equal(actual.states.reduce((n,s)=>n+s.offices[office].flaggedCounties,0),sum.flaggedCounties);
 assert.equal(actual.states.reduce((n,s)=>n+s.offices[office].publishedSourceContextCases,0),sum.publishedSourceContextCases);
 assert.equal(actual.flaggedReviewQueue.filter(q=>q.office===office).length,sum.flaggedCounties);
 assert.equal(sum.completedInvestigations,0,'Source context alone must never become a completed investigation');
}
assert.ok(actual.flaggedReviewQueue.every(q=>q.investigationStatus==='unresolved'));
const html=renderResearchProgress(actual);assert.ok(html.includes('not a completed investigation'));assert.ok(html.includes('presidential'));assert.ok(html.includes('coverage/#congress-review-progress'));
const bad=structuredClone(actual);bad.offices.senate.publishedSourceContextCases='<script>bad</script>';assert.ok(!renderResearchProgress(bad).includes('<script>bad'));
console.log(JSON.stringify({status:'passed',jurisdictions:51,scopeStates:{house:50,senate:35},queueEntries:actual.flaggedReviewQueue.length,sourceReviewsNotInvestigations:true}));
