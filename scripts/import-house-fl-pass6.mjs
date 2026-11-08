/** Offline, independently approved Florida House source import.
 * Copies exact reviewed normalized bytes; no network, shared register writes,
 * builds, schedule changes, winner promotions, or deployment.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const raw='scripts/source-data/house-completion-pass6-2026/fl';
const review='scripts/source-data/completion-review-2026/pass6/fl-house-source-approval.json';
const reviewHash='ec9333c1efd2ff86ffa11aa42232adaa2d1b0d91d54cf0588c2764a2bb98152f';
const freezeHash='0e3e6806cc533c7eb11ad686c13063788cba3c53bff1e69f00466f8f53d4d2b4';
const checkOnly=process.argv.includes('--check');
assert.ok(process.argv.slice(2).every(arg=>arg==='--check'),'Only --check is supported.');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const bytes=file=>fs.readFileSync(file);
const read=file=>JSON.parse(bytes(file));
const formatted=value=>Buffer.from(JSON.stringify(value,null,2)+'\n');
const hashCheck=(b,h,label)=>assert.equal(sha(b),h,`Reviewed bytes changed: ${label}`);
hashCheck(bytes(review),reviewHash,review);
const approval=read(review);
assert.equal(approval.status,'approved');assert.equal(approval.approvedStateFips,'12');
assert.deepEqual(approval.approvedYears,[2022,2026]);assert.equal(approval.stateFactsQualified,false);
assert.ok(Number.isFinite(Date.parse(approval.reviewedAt)));
const summary=read(`${raw}/summary.json`);
assert.deepEqual(summary.files,approval.inputHashes,'All six summary/input pins must match the independent receipt.');
for(const [file,h]of Object.entries(approval.inputHashes))hashCheck(bytes(`${raw}/${file}`),h,file);
hashCheck(bytes(`${raw}/freeze.json`),freezeHash,'version2 freeze');assert.equal(approval.freezeSha256,freezeHash);
const freeze=read(`${raw}/freeze.json`);
for(const [file,h]of Object.entries(freeze.files))hashCheck(bytes(`${raw}/${file}`),h,file);
for(const [file,h]of Object.entries(freeze.externalFiles))hashCheck(bytes(file),h,file);
const proof=read(`${raw}/fl-house-proof.json`);
// Every retained raw source, including the private ignored catalog, is hash-gated;
// only the already reviewed public normalized payloads are copied below.
for(const [file,h]of Object.entries(proof.sourceFiles))hashCheck(bytes(file.startsWith('scripts/')?file:`${raw}/${file}`),h,file);
assert.deepEqual(approval.heldCountyFipsByYear,{'2022':['12031','12083','12095','12109'],'2026':['12057','12095']});
const pairedHeld=['12031','12057','12083','12095','12109'];
assert.deepEqual(approval.pairedComparisonHeldCountyFips,pairedHeld);assert.equal(approval.maximumPairedCounties,62);
const outputs=new Map(),sourceChecks=[];
function validate(year,data){
 assert.equal(data.schemaVersion,1);assert.equal(data.office,'house');assert.equal(data.year,year);
 const county=data.results.filter(r=>r.geoLevel==='county'),district=data.results.filter(r=>r.geoLevel==='district');
 assert.equal(county.length,year===2022?94:98);assert.equal(new Set(county.map(r=>r.countyFips)).size,67);assert.equal(district.length,27);
 assert.equal(county.reduce((n,r)=>n+r.candidates.length,0),year===2022?238:282);
 assert.equal(district.reduce((n,r)=>n+r.candidates.length,0),year===2022?71:82);
 const held=[...new Set(county.filter(r=>r.sourceNeedsReview||r.incomplete).map(r=>r.countyFips))].sort();
 assert.deepEqual(held,approval.heldCountyFipsByYear[year]);
 for(const row of data.results){
  assert.equal(row.stateFips,'12');assert.equal(row.office,'house');assert.equal(row.year,year);assert.equal(row.stage,'general');assert.equal(row.special,false);
  assert.equal(row.electionDate,year===2022?'2022-11-08':'2026-11-03');assert.ok(data.sources[row.sourceId]);
  assert.equal(row.asOf,null);assert.equal(row.sourceUpdatedAt,null);assert.equal(row.certified,false);assert.equal(row.finalWinnerNotDeclared,true);
  assert.equal(row.provisional,year===2026);assert.equal(row.unofficial,year===2026);
  assert.ok(row.candidates.every(c=>Number.isInteger(c.votes)&&c.votes>=0));assert.equal(row.totalVotes,row.candidates.reduce((n,c)=>n+c.votes,0));
  assert.equal(new Set(row.candidates.map(c=>`${c.name}|${c.partyOriginal}`)).size,row.candidates.length);
  assert.deepEqual(row.reportingCategories,[]);assert.ok(!row.sourceTotalConflict&&!row.voteTotalMismatch);
  if(row.geoLevel==='county'&&held.includes(row.countyFips))assert.ok(row.sourceNeedsReview===true&&row.incomplete===true&&row.sourceReviewReason);
  else assert.ok(!row.sourceNeedsReview&&!row.incomplete);
  assert.ok(row.candidates.every(c=>!['VoterID','Addr1','Addr2','Phone','Email','TrsNameLast'].some(k=>Object.hasOwn(c,k))));
 }
 assert.ok(!data.results.some(r=>r.district===(year===2022?'5':'10')),'Unopposed race cannot become a numeric row.');
 const inv=county.map(r=>`${r.countyFips}|${Number(r.district)}`).sort();assert.equal(new Set(inv).size,inv.length);
 assert.deepEqual(inv,proof.years[year].intersections);assert.equal(sha(Buffer.from(JSON.stringify(inv))),proof.years[year].inventorySha256);
 assert.equal(county.reduce((n,r)=>n+r.candidates.filter(c=>c.votes===0).length,0),year===2022?7:1);
 assert.equal(county.reduce((n,r)=>n+r.totalVotes,0),district.reduce((n,r)=>n+r.totalVotes,0));
 return {year,counties:67,publishedPortions:county.length,candidateCells:county.reduce((n,r)=>n+r.candidates.length,0),publishedDistrictSummaries:27,controls:district.reduce((n,r)=>n+r.candidates.length,0),heldCountyFips:held,maximumCompleteCountyFacts:67-held.length,countUpdateKnown:false,sourcePayloadSha256:sha(bytes(`${raw}/proposed-fl-house-${year}.json`))};
}
for(const year of [2022,2026]){
 const source=`${raw}/proposed-fl-house-${year}.json`,b=bytes(source),data=JSON.parse(b);sourceChecks.push(validate(year,data));outputs.set(`public/data/house-completion-fl/house-${year}.json`,b);
}
const contract=read(`${raw}/proposed-fl-contract.json`).states[0];
assert.equal(contract.stateFactsQualified,false);assert.match(contract.stateFactsReason,/27published numeric House races of28/);assert.equal(contract.stateFips,'12');
assert.deepEqual(contract.pinnedFileHashes,Object.fromEntries([...outputs].map(([f,b])=>[f,sha(b)])));
contract.review={status:'approved',reviewedAt:approval.reviewedAt,evidenceSha256:approval.inputHashes['fl-house-proof.json'],approvalReceiptSha256:reviewHash,approvedContractProposalSha256:approval.inputHashes['proposed-fl-contract.json']};
const manifest=read(`${raw}/proposed-fl-manifest.json`);assert.deepEqual(manifest.limitations,approval.limits);
manifest.review={status:'approved_conditional_countywide_source_scope',reviewedAt:approval.reviewedAt,approvalReceiptSha256:reviewHash,evidenceSha256:approval.inputHashes['fl-house-proof.json'],approvedContractProposalSha256:approval.inputHashes['proposed-fl-contract.json'],normalizedSourceHashes:contract.pinnedFileHashes};
manifest.stateFactsQualified=false;manifest.stateFactsReason=contract.stateFactsReason;
manifest.conditionalCoverage={countyIdentities:67,publishedPortions:{2022:94,2026:98},heldCountyFipsByYear:approval.heldCountyFipsByYear,pairedComparisonHeldCountyFips:pairedHeld,maximumPairedCounties:62,maximumSingleYearCountyFacts:{2022:63,2026:65},publishedNumericDistrictSummariesPerYear:27,fullCongressionalDistrictCount:28};
outputs.set('public/data/house-completion-fl/manifest.json',formatted(manifest));
// Negative in-memory checks exercise the source-cell and exact hold barriers.
const example=read(`${raw}/proposed-fl-house-2026.json`),changed=structuredClone(example);changed.results[0].candidates[0].votes++;assert.throws(()=>validate(2026,changed));
const relaxed=structuredClone(example);delete relaxed.results.find(r=>r.geoLevel==='county'&&r.countyFips==='12057').sourceNeedsReview;assert.throws(()=>validate(2026,relaxed));
assert.throws(()=>hashCheck(Buffer.concat([outputs.get('public/data/house-completion-fl/house-2022.json'),Buffer.from('\n')]),approval.inputHashes['proposed-fl-house-2022.json'],'tampered payload'));
// Validate every output before the first mutation and never overwrite a mismatch.
for(const [file,b]of outputs)if(fs.existsSync(file))hashCheck(bytes(file),sha(b),file);
const handoff={schemaVersion:1,status:'approved_source_import',approval:{file:review,sha256:reviewHash,reviewedAt:approval.reviewedAt},sourceRegistrations:[{name:'house-completion-fl',priority:220,manifestUrl:'/data/house-completion-fl/manifest.json',office:'house',years:[2022,2026],approvalReceiptSha256:reviewHash}],countySourcesEntries:[{name:'house-completion-fl',priority:220}],houseComparability:{schemaVersion:1,states:[contract]},publicFileHashes:Object.fromEntries([...outputs].map(([f,b])=>[f,sha(b)])),sourceChecks,coverage:{historicalCompleteCountyFacts:63,currentCompleteCountyFacts:65,maximumPairedCounties:62,heldCountyFipsByYear:approval.heldCountyFipsByYear,pairedComparisonHeldCountyFips:pairedHeld,stateFactsQualified:false,stateFactsReason:contract.stateFactsReason},unknownClockScope:{sourceIds:['fl-official-house-2022-county-pass6','fl-official-house-2026-county-pass6'],sourceUpdatedAt:null,asOf:null,currentRetrieval:'2026-11-07T22:02:32.746481+00:00',retrievalBasis:'Actual native county retrieval, not count-update; later primary control retrieval remains separately recorded',receiptSha256:reviewHash,normalizedPayloadHashes:contract.pinnedFileHashes,requirements:'Any shared time acceptance must pin exact source/rows/normalized hashes/receipt, never globally weaken unknown-clock guards.'},integrationRequirements:['Register only this new bundle at priority 220; retain every prior source and raw artifact.','Add this independently approved paired contract and preserve exact selected-source/merged-vector pins. Do not mix older held rows or silently zero-fill missing/unopposed races.','Keep 2022 whole-county source holds for Duval, Marion, Orange and St. Johns; keep 2026 holds for Hillsborough and Orange. The pair guard must retain the union of all five counties, leaving at most 62 comparisons.','State aggregate facts and historical comparisons must honor stateFactsQualified:false and the 27-of-28 numeric-race reason. Individual actual 27 district facts may remain with this limitation.','Preserve actual source timestamps and provisional status. Source retrieval and HTTP asset modification are not counting clocks. Do not copy raw catalog contact/address or VoterID fields.','Root owns shared registers, clock-review entries, final semantic checks, facts/UI guards, builds and deployment.'],limits:approval.limits};
const handoffFile=`${raw}/import-HANDOFF.json`;
if(checkOnly){for(const [f,b]of outputs){assert.ok(fs.existsSync(f));hashCheck(bytes(f),sha(b),f);}assert.deepEqual(read(handoffFile),handoff);}
else{for(const [f,b]of outputs){fs.mkdirSync(path.dirname(f),{recursive:true});if(!fs.existsSync(f))fs.writeFileSync(f,b,{flag:'wx'});}fs.writeFileSync(handoffFile,formatted(handoff));}
for(const [f,b]of outputs)hashCheck(bytes(f),sha(b),f);
console.log(JSON.stringify({passed:true,checkOnly,publicFiles:outputs.size,payloadBytesUnchanged:true,rawSourceHashesChecked:Object.keys(proof.sourceFiles).length,sourceChecks,maximumPairedCounties:62,stateFactsQualified:false,sharedFilesWritten:false,handoff:handoffFile}));
