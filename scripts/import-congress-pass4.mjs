/** Optional offline integration of exact independently approved pass4 source packets. */
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import './import-house-pass4.mjs';
import './import-senate-pass4.mjs';
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const read=file=>JSON.parse(fs.readFileSync(file));
const write=(file,data)=>fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n');
const houseFile='scripts/source-data/house-completion-pass4-2026/import-HANDOFF.json',senateFile='scripts/source-data/senate-completion-pass4-2026/import-handoff.json';
assert.equal(sha(fs.readFileSync(houseFile)),'d3f862bca79f1251c89b738b2fa00de8c34ad1fbe8559f79574eb2b5d0eff7f5');
assert.equal(sha(fs.readFileSync(senateFile)),'2c92a20671ddea210ba9286cc496d715995d6e4ea8e4e615f4c9822fb1355d07');
const house=read(houseFile),senate=read(senateFile);
const registerFile='public/data/house-comparability/2026.json',register=read(registerFile);
for(const proof of house.houseComparability.states){register.states=register.states.filter(s=>s.stateFips!==proof.stateFips);register.states.push(proof);}
register.states.sort((a,b)=>a.stateFips.localeCompare(b.stateFips));write(registerFile,register);
const factsFile='public/data/house-facts/scopes.json',facts=read(factsFile);
for(const proof of house.houseFacts.scopes){assert.equal(proof.comparisonQualified,false);facts.scopes=facts.scopes.filter(s=>s.stateFips!==proof.stateFips||s.year!==proof.year);facts.scopes.push(proof);}
facts.scopes.sort((a,b)=>a.stateFips.localeCompare(b.stateFips)||a.year-b.year);write(factsFile,facts);
const specialFile='public/data/senate-special-comparability/2026.json',special=read(specialFile),oh=special.states.find(s=>s.stateFips==='39');assert.ok(oh);
Object.assign(oh.pinnedFileHashes,senate.ohSpecialContractUpdate.addPinnedFileHashes);
oh.supplementalStateReview=senate.ohSpecialContractUpdate.suggestedSupplementalStateReview;write(specialFile,special);
console.log(JSON.stringify({status:'integrated',pairedHouseStates:house.houseComparability.states.map(s=>s.stateFips),singleYearHouseScopes:house.houseFacts.scopes.map(s=>s.id),senateBundles:senate.bundles.map(s=>s.name),existingCountyVectorsPreserved:true}));
