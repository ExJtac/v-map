/** Offline, hash-gated import of independently approved SC/WA House sources.
 * No source refresh, shared register writes, builds, schedules, or deployment.
 * Exact normalized payload bytes remain unchanged; only public manifest review
 * metadata is added. Integration entries are returned in the ignored handoff.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const sourceRoot='scripts/source-data/house-completion-pass5-2026';
const reviewRoot='scripts/source-data/completion-review-2026/pass5';
const handoffFile=`${sourceRoot}/import-HANDOFF.json`;
const checkOnly=process.argv.includes('--check');
assert.ok(process.argv.slice(2).every(arg=>arg==='--check'),'Only --check is supported.');
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const read=file=>JSON.parse(fs.readFileSync(file));
const jsonBytes=value=>Buffer.from(JSON.stringify(value,null,2)+'\n');
const assertHash=(bytes,digest,label)=>assert.equal(sha(bytes),digest,`Reviewed bytes changed: ${label}`);
const inventory=rows=>rows.filter(row=>row.geoLevel==='county').map(row=>`${row.countyFips}|${Number(row.district)}`).sort();
const heldFips=['53011','53015','53041','53049','53059','53067','53069'];
// Exact independently frozen receipts. Missing, changed, or pending approvals
// cannot pass this barrier or create a public artifact.
const configs=[
 {code:'sc',stateFips:'45',receipt:'sc-house-source-approval.json',receiptSha256:'da29a7d3221a6a328e5e925a9235269d63634dc2d9fde49ffaad8c594c14d521',counties:46,portions:56,cells:{2022:171,2026:192},controls:{2022:21,2026:25},totals:{2022:1602341,2026:2029688}},
 {code:'wa',stateFips:'53',receipt:'wa-house-source-approval.json',receiptSha256:'a8c20f07f8487defa22ebe00ff4d884f1bd49f3d19ada903d576cc8cdda51ccf',counties:39,portions:50,cells:{2022:150,2026:150},controls:{2022:30,2026:30},totals:{2022:3026173,2026:2830836}},
];
const approvals=new Map();
// Validate the entire approval and source-input barrier before any write.
for(const config of configs){
 assert.match(config.receiptSha256,/^[a-f0-9]{64}$/,`Independent approval pending: ${config.code}`);
 const file=`${reviewRoot}/${config.receipt}`,bytes=fs.readFileSync(file);assertHash(bytes,config.receiptSha256,file);const approval=JSON.parse(bytes);
 assert.equal(approval.status,'approved');assert.equal(approval.approvedStateFips,config.stateFips);assert.deepEqual(approval.approvedYears,[2022,2026]);assert.ok(Number.isFinite(Date.parse(approval.reviewedAt)));
 const required=[`proposed-${config.code}-house-2022.json`,`proposed-${config.code}-house-2026.json`,`${config.code}-house-proof.json`,`proposed-${config.code}-contract.json`,`proposed-${config.code}-manifest.json`];
 for(const file of required)assert.match(approval.inputHashes?.[file]||'',/^[a-f0-9]{64}$/);
 for(const [name,digest]of Object.entries(approval.inputHashes))assertHash(fs.readFileSync(`${sourceRoot}/${config.code}/${name}`),digest,`${config.code}/${name}`);
 approvals.set(config.code,approval);
}
const outputs=new Map(),states=[],registrations=[],checks=[];
function validate(config,year,data,proof){
 assert.equal(data.schemaVersion,1);assert.equal(data.office,'house');assert.equal(data.year,year);assert.ok(data.results.every(row=>row.stateFips===config.stateFips&&row.office==='house'&&row.year===year&&row.stage==='general'&&row.special===false&&/^\d+$/.test(row.district)&&data.sources[row.sourceId]));
 const county=data.results.filter(row=>row.geoLevel==='county'),district=data.results.filter(row=>row.geoLevel==='district');assert.equal(county.length,config.portions);assert.equal(new Set(county.map(row=>row.countyFips)).size,config.counties);assert.equal(county.reduce((n,r)=>n+r.candidates.length,0),config.cells[year]);assert.equal(district.reduce((n,r)=>n+r.candidates.length,0),config.controls[year]);
 for(const rows of [county,district])assert.equal(rows.reduce((n,r)=>n+r.totalVotes,0),config.totals[year]);
 assert.ok(data.results.every(row=>row.sourceUpdatedAt===null&&row.candidates.every(c=>Number.isInteger(c.votes)&&c.votes>=0)&&row.totalVotes===row.candidates.reduce((n,c)=>n+c.votes,0)&&new Set(row.candidates.map(c=>`${c.name}|${c.partyOriginal}`)).size===row.candidates.length&&!row.incomplete&&!row.voteTotalMismatch));
 if(year===2026)assert.ok(data.results.every(row=>row.provisional===true&&row.unofficial===true&&row.certified===false&&row.finalWinnerNotDeclared===true));
 const held=data.results.filter(r=>r.sourceNeedsReview||r.sourceTotalConflict);
 if(config.code==='wa'&&year===2022){
  assert.deepEqual(held.filter(r=>r.geoLevel==='county').map(r=>r.countyFips).sort(),heldFips);assert.deepEqual(held.filter(r=>r.geoLevel==='district').map(r=>r.district),['3']);assert.ok(held.every(r=>r.sourceNeedsReview===true&&r.sourceTotalConflict===true&&r.district==='3'&&r.sourceAmendedCertifiedAt==='2022-12-22'&&r.sourceReviewReason));assert.deepEqual(proof.expectedHeldCountyFips,heldFips);assert.deepEqual(proof.expectedHeldDistrictSummaries,['3']);assert.equal(proof.eligibleCountyComparisonMaximum,32);
  assert.equal(proof.fecCrosscheckSummary.checked,30);assert.equal(proof.fecCrosscheckSummary.equal,28);assert.deepEqual(proof.fecCrosscheckSummary.conflicts.map(r=>[r.district,r.primaryName,r.deltaPrimaryMinusFec]),[[3,'Marie Gluesenkamp Perez',-9],[3,'Joe Kent',-5]]);
 }else assert.equal(held.length,0);
 if(config.code==='sc'&&year===2022){
  assert.equal(proof.sourceAccountingCategoryProof.rows.length,63);
  for(const row of data.results){assert.equal(row.reportingCategories.length,2);assert.deepEqual(row.reportingCategories.map(c=>[c.name,c.category,c.includedInCandidateVotes]),[['Overvotes/Undervotes','overUnderVotes',false],['Total Ballots Cast','reportedBallotTotal',false]]);assert.ok(row.reportingCategories.every(c=>Number.isInteger(c.votes)&&c.votes>=0));}
  assert.ok(county.filter(r=>r.district==='3').every(r=>r.candidates.some(c=>c.name==='Jeff Duncan'&&c.party==='Republican')&&!r.candidates.some(c=>c.name==='Jeff Dan')));
 }
 const intersections=inventory(county),scope=proof.years[year];assert.equal(new Set(intersections).size,intersections.length);assert.equal(scope.scopeComplete,true);assert.equal(scope.controlsPassed,true);assert.equal(scope.expectedCountyCount,config.counties);assert.equal(scope.candidateControlCount,config.controls[year]);assert.deepEqual(intersections,scope.intersections);assert.equal(sha(JSON.stringify(intersections)),scope.inventorySha256);
 return {stateFips:config.stateFips,year,countyCount:config.counties,countyPortions:county.length,countyCandidateCells:config.cells[year],districtCandidateControls:config.controls[year],candidateVoteSum:config.totals[year],heldCountyCount:held.filter(r=>r.geoLevel==='county').length,heldDistrictSummaryCount:held.filter(r=>r.geoLevel==='district').length};
}
for(const config of configs){
 const directory=`${sourceRoot}/${config.code}`,target=`public/data/house-completion-${config.code}`,approval=approvals.get(config.code),proof=read(`${directory}/${config.code}-house-proof.json`),manifest=read(`${directory}/proposed-${config.code}-manifest.json`);
 for(const [name,metadata]of Object.entries(proof.sourceFiles||{})){
  const file=name.startsWith('scripts/')?name:`${directory}/${name}`;assertHash(fs.readFileSync(file),typeof metadata==='string'?metadata:metadata.sha256,file);
 }
 if(proof.fecWorkbookSha256)assertHash(fs.readFileSync('scripts/source-data/house-completion-2026/fec-federalelections2022.xlsx'),proof.fecWorkbookSha256,'FEC2022 original workbook');
 const review={status:'approved',reviewedAt:approval.reviewedAt,evidenceSha256:approval.inputHashes[`${config.code}-house-proof.json`],approvalReceiptSha256:config.receiptSha256};const pins={};
 for(const year of [2022,2026]){
  const name=`proposed-${config.code}-house-${year}.json`,bytes=fs.readFileSync(`${directory}/${name}`),data=JSON.parse(bytes);assertHash(bytes,approval.inputHashes[name],name);const counts=validate(config,year,data,proof);const file=`${target}/house-${year}.json`;outputs.set(file,bytes);pins[file]=sha(bytes);checks.push({...counts,file,payloadSha256:pins[file]});
  const coverage=manifest.coverage.find(r=>r.year===year);assert.equal(coverage.url,`/data/house-completion-${config.code}/house-${year}.json`);assert.equal(coverage.rows,data.results.length);
 }
 assert.equal(manifest.coverage.length,2);manifest.review={...review,approvedManifestProposalSha256:approval.inputHashes[`proposed-${config.code}-manifest.json`]};manifest.normalizedPayloadHashes=pins;const approvedLimits=approval.limitations??approval.limits;assert.ok(Array.isArray(approvedLimits)&&approvedLimits.length);manifest.limitations=approvedLimits;outputs.set(`${target}/manifest.json`,jsonBytes(manifest));
 const contract=read(`${directory}/proposed-${config.code}-contract.json`).states[0];assert.equal(contract.stateFips,config.stateFips);assert.deepEqual(contract.pinnedFileHashes,pins);assert.deepEqual(contract.years,proof.years);assert.equal(contract.review.status,'pending');contract.review={...review,approvedContractProposalSha256:approval.inputHashes[`proposed-${config.code}-contract.json`]};contract.limitations=approvedLimits;
 contract.comparisonNotes=config.code==='wa'?[
  'The complete source inventories cover 39 counties and 50 actual county/district portions in each year. At most 32 county comparisons qualify because all seven historical CD3 counties remain held.',
  'The 2022 native CSV matches the signed December 7 canvass. CD3 was amended on December 22: Perez gained nine and Kent five votes statewide. Their county allocations are unknown. All seven original county portions and the pre-amendment district summary retain sourceNeedsReview and sourceTotalConflict.',
  'All 39 current counties have facts freshly retrieved from the positively linked official Washington results host. Every county candidate vector reconciles to the separately published district summary. Global snapshot and reporting-status clocks do not establish county count-update times.',
  'Party labels are candidate-expressed preferences, rather than nominations or voter affiliations. Candidate votes including explicit write-ins are not ballots or distinct voters. District and candidate changes limit historical interpretation.',
 ]:[
  'Complete source inventories cover 46 counties and 56 actual county/district portions in each year. Direct 2022 official historical CSV cells reconcile to all 21 published controls and 21 independent FEC controls.',
  'The direct-source replacement preserves old research files and corrects the prior Jeff Dan label to the primary source name Jeff Duncan. This is a positive source replacement, rather than a guessed alias or party reassignment.',
  'The source combined Overvotes/Undervotes count remains unsplit as overUnderVotes. Total Ballots Cast remains reportedBallotTotal. Both accounting categories are excluded from candidate votes and retained with their original labels and values.',
  'Current 2026 counts are the fixed registered county/state research snapshot. This is not a fresh primary-body audit: the direct host returned HTTP 403. Unknown count-update timestamps stay null; retrieval clocks are separate. Candidate votes are not ballots or distinct voters.',
 ];states.push(contract);registrations.push({name:`house-completion-${config.code}`,priority:200,manifestUrl:`/data/house-completion-${config.code}/manifest.json`,office:'house',years:[2022,2026],approvalReceiptSha256:config.receiptSha256});
}
// Negative, in-memory checks ensure changed bytes or removed holds are rejected.
const waOriginal=read(`${sourceRoot}/wa/proposed-wa-house-2022.json`);const noHold=structuredClone(waOriginal);delete noHold.results.find(r=>r.geoLevel==='county'&&r.district==='3').sourceNeedsReview;assert.throws(()=>validate(configs.find(c=>c.code==='wa'),2022,noHold,read(`${sourceRoot}/wa/wa-house-proof.json`)));
const example=outputs.get('public/data/house-completion-sc/house-2022.json');assert.throws(()=>assertHash(Buffer.concat([example,Buffer.from('\n')]),sha(example),'in-memory altered payload'));
// Strict immutable-output preflight occurs before the first mutation.
for(const [file,bytes]of outputs)if(fs.existsSync(file))assertHash(fs.readFileSync(file),sha(bytes),`Existing public artifact differs: ${file}`);
const handoff={schemaVersion:1,status:checkOnly?'verified_approved_house_import':'imported_approved_house_sources',sourceRegistrations:registrations,countySourcesEntries:registrations.map(({name,priority})=>({name,priority})),houseComparability:{schemaVersion:1,states},houseFacts:{schemaVersion:1,scopes:[]},approvals:configs.map(c=>({file:`${reviewRoot}/${c.receipt}`,sha256:c.receiptSha256,status:'approved'})),publicFileHashes:Object.fromEntries([...outputs].map(([f,b])=>[f,sha(b)])),sourceChecks:checks,retainedHolds:{wa2022CountyFips:heldFips,wa2022DistrictSummaries:['3'],waCurrentCountyFacts:39,scCurrentSourceFreshness:'Saved registered snapshot; primary body403; unknown count-update'},sharedIntegrationRequired:['Append only SC/WA paired contracts and source registrations with priority 200; preserve every prior supplement and contract.','Retain all seven Washington 2022 CD3 county holds AND the district-summary hold. Never allocate the statewide 14-vote amendment. All 39 current county facts remain independently usable subject to their own source and quality gates.','Retain the South Carolina overUnderVotes combined accounting category and canonical reportedBallotTotal. Exclude both from candidate votes consistently in the engine, history, and facts. Never split combined over/under counts.','Root owns all shared files, source registration, semantic merge and coverage tests, independent final QA, builds, and deployment.'],limits:['No network or provider calls, paid API use, scheduler edits, shared-register writes, builds, or deployments.','Normalized payload bytes are copied unchanged; manifest changes are top-level review/hash/limitation metadata only.','Complete geometry/control inventory does not clear row-level quality holds or establish misconduct.']};
if(!checkOnly){for(const [file,bytes]of outputs){fs.mkdirSync(path.dirname(file),{recursive:true});if(!fs.existsSync(file))fs.writeFileSync(file,bytes,{flag:'wx'});}fs.writeFileSync(handoffFile,jsonBytes(handoff));}
else{for(const [file,bytes]of outputs){assert.ok(fs.existsSync(file),`Missing public output: ${file}`);assertHash(fs.readFileSync(file),sha(bytes),file);}const previous=read(handoffFile);for(const key of ['publicFileHashes','houseComparability','sourceRegistrations','retainedHolds'])assert.deepEqual(previous[key],handoff[key]);}
for(const [file,bytes]of outputs)assertHash(fs.readFileSync(file),sha(bytes),file);
console.log(JSON.stringify({status:handoff.status,approvedReceiptsChecked:approvals.size,publicFilesChecked:outputs.size,payloadBytesUnchanged:true,sourceChecks:checks,handoff:handoffFile,sharedFilesWritten:false,retainedWaHistoricalCountyHolds:heldFips,retainedWaHistoricalDistrictSummaryHolds:['3']}));
