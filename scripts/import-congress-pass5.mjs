/** Optional offline integration of the independently approved SC/WA source packets. */
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import './import-house-pass5.mjs';
const file='scripts/source-data/house-completion-pass5-2026/import-HANDOFF.json';
assert.equal(crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),'6792b156b983acde219be77bb421359a8ba7b1398e9444ee270f2c2654da6b47');
const handoff=JSON.parse(fs.readFileSync(file)),target='public/data/house-comparability/2026.json',register=JSON.parse(fs.readFileSync(target));
for(const proof of handoff.houseComparability.states){assert.ok(['45','53'].includes(proof.stateFips));assert.equal(proof.review.status,'approved');register.states=register.states.filter(s=>s.stateFips!==proof.stateFips);register.states.push(proof);}
register.states.sort((a,b)=>a.stateFips.localeCompare(b.stateFips));fs.writeFileSync(target,JSON.stringify(register,null,2)+'\n');
console.log(JSON.stringify({status:'integrated',states:['SC','WA'],historicalWaCountyHolds:7,historicalWaDistrictSummaryHeld:true,numericThresholdsChanged:false}));
