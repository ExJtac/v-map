import fs from 'node:fs';import assert from 'node:assert/strict';import crypto from 'node:crypto';
import {validateCountySourceData,renderCountySourceNotes,safeCountySource} from '../src/county-source-context.js';
const file='public/data/county-reviews/2026.json',bytes=fs.readFileSync(file),data=JSON.parse(bytes),reportBytes=fs.readFileSync('public/data/anomalies-2026.json'),report=JSON.parse(reportBytes);
validateCountySourceData(data);
const subsetBytes=fs.readFileSync('public/'+data.sourceInput.reviewedSubset.url),subset=JSON.parse(subsetBytes);
assert.equal(data.sourceInput.reviewedSubset.sha256,crypto.createHash('sha256').update(subsetBytes).digest('hex'));
assert.equal(subset.fullAuditSha256,data.sourceInput.sha256);assert.equal(subset.cases.length,data.cases.length);
assert.equal(subset.originalSourceUrl,'https://raw.githubusercontent.com/ExJtac/v-map/705bcf7654e02eac3ee8fcdc03e57ef8b1daf352/public/data/anomalies-2026.json');
assert.equal(data.cases.length,6);assert.equal(data.cases.reduce((n,r)=>n+r.items.length,0),8);
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
for(const row of data.cases){
 const saved=subset.cases.find(c=>c.fips===row.fips&&c.office===row.office);assert.ok(saved,'Reviewed assessment missing');
 const flags=saved.assessment.flags||[];for(const id of row.flagIds)assert.ok(flags.some(f=>f.id===id),'County note not linked to saved office flag');
 const html=renderCountySourceNotes(data,{fips:row.fips,selectedOffice:row.office});
 for(const item of row.items){assert.ok(html.includes(esc(item.url)));assert.ok(html.includes(esc(item.relationToFlag)));for(const limit of item.limits)assert.ok(html.includes(esc(limit)),'Source caveat hidden');}
 for(const value of Object.values(row.coverage.window))assert.ok(html.includes(esc(value)),'Bounded search dates must remain visible');
 assert.ok(html.includes(esc(row.coverage.noQualifiedReportLane.negativeInference)),'Missing coverage is not exoneration');
}
assert.equal(safeCountySource('javascript:alert(1)'),null);
assert.equal(renderCountySourceNotes(data,{fips:'00000',selectedOffice:'governor',flagged:false}),'');
assert.match(renderCountySourceNotes(data,{fips:'00000',selectedOffice:'governor',flagged:true}),/coverage gap/);
const bad=structuredClone(data);bad.cases[0].items[0].url='javascript:alert(1)';assert.throws(()=>validateCountySourceData(bad));
console.log(JSON.stringify({status:'passed',countyCases:data.cases.length,sourceItems:8,sourceHash:crypto.createHash('sha256').update(bytes).digest('hex'),visibleLimits:true,reviewedSnapshotPinned:true,currentAuditHash:crypto.createHash('sha256').update(reportBytes).digest('hex')}));
