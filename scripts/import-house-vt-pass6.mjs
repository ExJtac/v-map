/** Offline import of the independently approved Vermont House source packet.
 * Copies normalized payload bytes unchanged. No network, builds, schedules,
 * shared-register changes, earlier source rewrites, or deployment.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const directory='scripts/source-data/house-completion-pass6-2026/vt';
const receiptFile='scripts/source-data/completion-review-2026/pass6/vt-house-source-approval.json';
const receiptSha256='657732070781c54d5c9c2d307382b2b23de6a19e9ee69ce90203ec0593dee70a';
const target='public/data/house-completion-vt';
const handoffFile=`${directory}/import-HANDOFF.json`;
const checkOnly=process.argv.includes('--check');
assert.ok(process.argv.slice(2).every(arg=>arg==='--check'),'Only --check is supported.');
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const read=file=>JSON.parse(fs.readFileSync(file));
const jsonBytes=value=>Buffer.from(JSON.stringify(value,null,2)+'\n');
const assertHash=(bytes,digest,label)=>assert.equal(sha(bytes),digest,`Reviewed bytes changed: ${label}`);
const receiptBytes=fs.readFileSync(receiptFile);assertHash(receiptBytes,receiptSha256,receiptFile);
const approval=JSON.parse(receiptBytes);assert.equal(approval.status,'approved');assert.equal(approval.approvedStateFips,'50');assert.deepEqual(approval.approvedYears,[2022,2026]);assert.ok(Number.isFinite(Date.parse(approval.reviewedAt)));assert.ok(Array.isArray(approval.limits)&&approval.limits.length);
for(const file of ['proposed-vt-house-2022.json','proposed-vt-house-2026.json','vt-house-proof.json','proposed-vt-contract.json','proposed-vt-manifest.json'])assert.match(approval.inputHashes?.[file]||'',/^[a-f0-9]{64}$/);
for(const [file,digest]of Object.entries(approval.inputHashes))assertHash(fs.readFileSync(`${directory}/${file}`),digest,file);
for(const [file,digest]of Object.entries(approval.visualReceipts||{}))assertHash(fs.readFileSync(`${directory}/${file}`),digest,file);
const proof=read(`${directory}/vt-house-proof.json`);
for(const source of Object.values(proof.sourceFiles))assertHash(fs.readFileSync(source.path),source.sha256,source.path);
assertHash(fs.readFileSync('scripts/source-data/house-completion-2026/fec-federalelections2022.xlsx'),proof.fecWorkbookSha256,'FEC2022 original workbook');
const oldHolds=read(`${directory}/historical-holds-trace.json`);assertHash(fs.readFileSync('scripts/source-data/modern-counties/heideman-v1.0.0.zip'),oldHolds.archiveSha256,'Preserved historical research archive');
assert.equal(proof['2022TownRowsUsed'],247);assert.equal(proof['2022NestedPrecinctRowsExcluded'],60);assert.equal(proof['2026RawTownCount'],247);assert.equal(proof['2026RawPortionCount'],283);assert.equal(proof['2026NamedCandidateControls'],6);assert.equal(proof['2026WriteInControls'],68);assert.equal(proof['2022Controls'].length,7);assert.equal(proof.fec2022Controls.length,7);assert.equal(proof['2026Controls'].length,74);
const outputs=new Map(),pins={},sourceChecks=[];
function validate(data,year){
 assert.equal(data.schemaVersion,1);assert.equal(data.office,'house');assert.equal(data.year,year);assert.ok(data.results.every(r=>r.office==='house'&&r.year===year&&r.stateFips==='50'&&r.district==='0'&&r.sourceDistrict===null&&r.stage==='general'&&r.special===false&&r.sourceUpdatedAt===null&&data.sources[r.sourceId]&&!r.sourceNeedsReview&&!r.sourceTotalConflict&&!r.incomplete&&!r.voteTotalMismatch));
 const counties=data.results.filter(r=>r.geoLevel==='county'),districts=data.results.filter(r=>r.geoLevel==='district');assert.equal(counties.length,14);assert.equal(new Set(counties.map(r=>r.countyFips)).size,14);assert.equal(districts.length,1);assert.equal(data.results.length,15);
 const intersections=counties.map(r=>`${r.countyFips}|0`).sort();assert.deepEqual(intersections,proof.years[year].intersections);assert.equal(sha(JSON.stringify(intersections)),proof.years[year].inventorySha256);assert.equal(proof.years[year].expectedCountyCount,14);assert.equal(proof.years[year].districtCount,1);assert.equal(proof.years[year].scopeComplete,true);assert.equal(proof.years[year].controlsPassed,true);
 const expected=year===2022?{candidateCells:98,writeInCells:0,controlCount:7,total:282026,sourceInclusive:291955}:{candidateCells:84,writeInCells:82,controlCount:74,total:304675,sourceInclusive:311510};
 assert.equal(counties.reduce((n,r)=>n+r.candidates.length,0),expected.candidateCells);assert.equal(counties.flatMap(r=>r.reportingCategories).filter(c=>c.category==='sourceWriteInEntries').length,expected.writeInCells);assert.equal(proof.years[year].candidateControlCount,expected.controlCount);
 for(const r of data.results){
  assert.ok(r.candidates.every(c=>Number.isInteger(c.votes)&&c.votes>=0));assert.ok(r.reportingCategories.every(c=>Number.isInteger(c.votes)&&c.votes>=0));assert.equal(r.totalVotes,r.candidates.reduce((n,c)=>n+c.votes,0)+r.reportingCategories.filter(c=>c.category==='sourceWriteInEntries').reduce((n,c)=>n+c.votes,0));
  if(year===2022){assert.deepEqual(r.reportingCategories.map(c=>[c.name,c.category,c.includedInCandidateVotes]),[['Undervotes','undervotes',false],['Overvotes','overvotes',false],['Total Ballots Cast','reportedBallotTotal',false]]);assert.equal(r.sourcePublishedTotalBallotsCast,r.totalVotes+r.reportingCategories.filter(c=>c.category==='undervotes'||c.category==='overvotes').reduce((n,c)=>n+c.votes,0));}
  else{
   assert.ok(r.provisional===true&&r.unofficial===true&&r.certified===false&&r.finalWinnerNotDeclared===true);assert.equal(r.sourceTimezone,null);assert.equal(r.sourceSnapshotTimestampRaw,'11/07/2026 06:58 PM');assert.equal(r.asOf,r.retrievedAt);assert.match(r.asOfBasis,/retrievaltime/);
   const wc=r.reportingCategories.filter(c=>c.sourceContainer==='wc');assert.ok(wc.every(c=>c.category==='sourceWriteInEntries'&&c.partyOriginal===null&&c.identityNotEstablished===true&&c.includedInCandidateVotes===true&&Number.isInteger(c.sourceCandidateId)));
   assert.deepEqual(r.reportingCategories.filter(c=>c.rawField).map(c=>[c.name,c.rawField,c.category,c.includedInCandidateVotes]),[['Overvotes','sv','overvotes',false],['Blank Votes','bv','blankBallots',false]]);assert.equal(r.sourcePublishedTotalVotesIncludingAccounting,r.totalVotes+r.reportingCategories.filter(c=>c.rawField).reduce((n,c)=>n+c.votes,0));
  }
 }
 assert.equal(counties.reduce((n,r)=>n+r.totalVotes,0),expected.total);assert.equal(districts[0].totalVotes,expected.total);assert.equal(year===2022?districts[0].sourcePublishedTotalBallotsCast:districts[0].sourcePublishedTotalVotesIncludingAccounting,expected.sourceInclusive);
 if(year===2026){assert.equal(districts[0].candidates.length,6);assert.equal(districts[0].reportingCategories.filter(c=>c.sourceContainer==='wc').length,68);assert.equal(districts[0].reportingCategories.find(c=>c.rawField==='sv').votes,594);assert.equal(districts[0].reportingCategories.find(c=>c.rawField==='bv').votes,6241);}
 return {year,countyCount:14,countyPortions:14,countyCandidateCells:expected.candidateCells,countyWriteInCategoryCells:expected.writeInCells,candidateAndWriteInControls:expected.controlCount,raceVoteSum:expected.total,sourceInclusiveAccountingTotal:expected.sourceInclusive};
}
for(const year of [2022,2026]){
 const name=`proposed-vt-house-${year}.json`,bytes=fs.readFileSync(`${directory}/${name}`);assertHash(bytes,approval.inputHashes[name],name);const data=JSON.parse(bytes),file=`${target}/house-${year}.json`;sourceChecks.push({...validate(data,year),file,payloadSha256:sha(bytes)});outputs.set(file,bytes);pins[file]=sha(bytes);
}
const review={status:'approved',reviewedAt:approval.reviewedAt,evidenceSha256:approval.inputHashes['vt-house-proof.json'],approvalReceiptSha256:receiptSha256};
const manifest=read(`${directory}/proposed-vt-manifest.json`);assert.deepEqual(manifest.limitations,approval.limits);manifest.review={...review,approvedManifestProposalSha256:approval.inputHashes['proposed-vt-manifest.json']};manifest.normalizedPayloadHashes=pins;outputs.set(`${target}/manifest.json`,jsonBytes(manifest));
const contract=read(`${directory}/proposed-vt-contract.json`).states[0];assert.equal(contract.stateFips,'50');assert.equal(contract.review.status,'pending');assert.deepEqual(contract.pinnedFileHashes,pins);assert.deepEqual(contract.years,proof.years);contract.review={...review,approvedContractProposalSha256:approval.inputHashes['proposed-vt-contract.json']};contract.limitations=approval.limits;contract.comparisonNotes=[
 'Both years cover all 14 counties in the single statewide at-large House contest. District 0 is the normalized at-large convention; no numbered district is printed in the original sources.',
 'The 2022 replacement uses 247 official town aggregates and excludes 60 nested precinct rows. All six named candidates and the explicit aggregate write-ins reconcile to separate official statewide and canvass totals and all seven original FEC controls. It does not infer the identities behind old surname or initial flags.',
 'The current source contains 283 disjoint reporting parts across 247 towns. All six nominee vectors and 68 write-in choices reconcile to the separate statewide record. Original write-in IDs, names and blank parties remain source categories; names resembling nominees or accounting labels are not reassigned or treated as verified identities.',
 'The original site code explicitly labels sv as Overvotes and bv as Blank Votes. These accounting fields are excluded from race votes. The 2026 candidate/write-in total is 304,675; the source total including accounting is 311,510. Neither establishes unique voters or eligible-voter turnout.',
 'The newly retrieved current federal response is byte-identical to the earlier November 6 body, despite a new November 7 global metadata display clock. County count-update times remain unknown. The exact UTC retrieval reference is labeled separately; current returns remain unofficial, provisional and uncertified.',
 'Different nominees, competition and provisional reporting constrain historical interpretation. Complete county geography and source vectors do not establish matched-candidate causality, counting completion, a winner, an error, or wrongdoing.',
];
const sourceRegistration={name:'house-completion-vt',priority:220,manifestUrl:'/data/house-completion-vt/manifest.json',office:'house',years:[2022,2026],approvalReceiptSha256:receiptSha256};
const handoff={schemaVersion:1,status:checkOnly?'verified_approved_house_import':'imported_approved_house_sources',sourceRegistrations:[sourceRegistration],countySourcesEntries:[{name:sourceRegistration.name,priority:sourceRegistration.priority}],houseComparability:{schemaVersion:1,states:[contract]},houseFacts:{schemaVersion:1,scopes:[]},approvals:[{file:receiptFile,sha256:receiptSha256,status:'approved'}],publicFileHashes:Object.fromEntries([...outputs].map(([f,b])=>[f,sha(b)])),sourceChecks,sharedIntegrationRequired:['Append the Vermont paired scope and priority 220 registration without replacing earlier supplements or contracts.','Preserve every original write-in identity and unknown-party label, the known excluded overvote/blank accounting categories, and all source/proof/receipt/inventory pins.','The source total of 311,510 includes accounting categories. Do not use it as candidate votes or infer distinct voters or turnout from it.','Root owns all shared files, merged engine/history/facts checks, independent final QA, builds, and deployment.'],limits:approval.limits};
// Negative checks and immutable-output preflight occur before any mutation.
const original=outputs.get(`${target}/house-2026.json`);assert.throws(()=>assertHash(Buffer.concat([original,Buffer.from('\n')]),sha(original),'in-memory altered payload'));
const changed=JSON.parse(original);changed.results[0].reportingCategories.find(c=>c.rawField==='sv').category='sourceReportingCategory';assert.throws(()=>validate(changed,2026));
for(const [file,bytes]of outputs)if(fs.existsSync(file))assertHash(fs.readFileSync(file),sha(bytes),`Existing public artifact differs: ${file}`);
if(!checkOnly){for(const [file,bytes]of outputs){fs.mkdirSync(path.dirname(file),{recursive:true});if(!fs.existsSync(file))fs.writeFileSync(file,bytes,{flag:'wx'});}fs.writeFileSync(handoffFile,jsonBytes(handoff));}
else{for(const [file,bytes]of outputs){assert.ok(fs.existsSync(file),`Public artifact missing: ${file}`);assertHash(fs.readFileSync(file),sha(bytes),file);}const previous=read(handoffFile);for(const key of ['publicFileHashes','houseComparability','sourceRegistrations','sourceChecks','limits'])assert.deepEqual(previous[key],handoff[key]);}
for(const [file,bytes]of outputs)assertHash(fs.readFileSync(file),sha(bytes),file);
console.log(JSON.stringify({status:handoff.status,approvedReceiptSha256:receiptSha256,approvedInputsChecked:Object.keys(approval.inputHashes).length,sourceHashesChecked:Object.keys(proof.sourceFiles).length,publicFilesChecked:outputs.size,payloadBytesUnchanged:true,sourceChecks,handoff:handoffFile,sharedFilesWritten:false,networkCalls:0,buildOrDeployment:false}));
