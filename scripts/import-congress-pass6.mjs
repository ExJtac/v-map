/** Optional exact-source integration of independently approved FL/VT packets. */
import fs from 'node:fs';import crypto from 'node:crypto';import assert from 'node:assert/strict';
import './import-house-fl-pass6.mjs';import './import-house-vt-pass6.mjs';
const handoffs=[['fl','1869284df3d8029be852b42204fea691bfefa06d859fc5ce32278c66e3ab1152'],['vt','eea3ff2783a955b55094691d4ec5ff0cd47e883979a19e413e3f2beffe20229e']];
const file='public/data/house-comparability/2026.json',register=JSON.parse(fs.readFileSync(file));
for(const [code,digest]of handoffs){const bytes=fs.readFileSync(`scripts/source-data/house-completion-pass6-2026/${code}/import-HANDOFF.json`);assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),digest);const h=JSON.parse(bytes);for(const proof of h.houseComparability.states){assert.equal(proof.review.status,'approved');
if(code==='vt')proof.basis=proof.basis.replace(/\s*Approval pending\.\s*$/,'');
if(code==='fl')proof.stateFactsReason='Only 27 of 28 House races have numeric totals in each year. The 2022 District 5 and 2026 District 10 races are unopposed non-tallies, not zero. Statewide aggregates and comparisons remain unavailable; published district totals are shown separately.';
if(code==='fl')proof.comparisonNotes=[
 'Historical 2022 and current 2026 returns use separately retrieved official county files and published candidate controls. Current counts are provisional; county count-update times remain unknown.',
 'Both years publish numeric tallies for 27 of 28 districts. District 5 in 2022 and District 10 in 2026 were unopposed without a numeric tally. No zero or county allocation is invented.',
 'Official enacted block geography identifies missing county/district portions. Four historical and two current counties remain held; their five-county union is excluded from historical comparisons. Only 62 counties qualify in both years.',
 'Single-year source facts are available for 63 counties in 2022 and 65 in 2026. A statewide aggregate is withheld because the files do not supply a complete 28-district numeric total.',
 'District boundaries and candidates changed. Reported House race votes are separate from ballots cast, residents and voter eligibility.'
];
register.states=register.states.filter(s=>s.stateFips!==proof.stateFips);register.states.push(proof);}}
register.states.sort((a,b)=>a.stateFips.localeCompare(b.stateFips));fs.writeFileSync(file,JSON.stringify(register,null,2)+'\n');console.log(JSON.stringify({status:'integrated',states:['FL','VT'],flStateAggregateHeld:true,flCountyHoldsByYear:{2022:4,2026:2},currentCountySourcesPreserved:true}));
