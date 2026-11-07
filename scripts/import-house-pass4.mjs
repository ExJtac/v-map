/**
 * Optional offline import of independently reviewed fourth-pass House packets.
 * Requires the ignored local source/review cache. No network, builds or shared
 * source-register writes occur. Public data bytes are copied without rewriting.
 * Root integrates only the ready-to-insert entries in the ignored HANDOFF JSON.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const sourceRoot='scripts/source-data/house-completion-pass4-2026';
const reviewRoot='scripts/source-data/completion-review-2026/pass4';
const senateRoot='scripts/source-data/senate-completion-pass4-2026';
const handoffFile=`${sourceRoot}/import-HANDOFF.json`;
const checkOnly=process.argv.includes('--check');
assert.ok(process.argv.slice(2).every(arg=>arg==='--check'),'Only --check is supported.');
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const read=file=>JSON.parse(fs.readFileSync(file));
const jsonBytes=value=>Buffer.from(JSON.stringify(value,null,2)+'\n');
const hashFile=file=>sha(fs.readFileSync(file));
const assertHash=(bytes,digest,label)=>assert.equal(sha(bytes),digest,`Reviewed input changed: ${label}`);
const inventory=rows=>rows.filter(row=>row.geoLevel==='county').map(row=>`${row.countyFips}|${Number(row.district)}`).sort();
const receipts=[
 {name:'ia-house-source-approval.json',digest:'c65bc218f588c850c8c20671ded5e15777af9ca77c25ca6399b2a605ff21760b',directory:`${sourceRoot}/ia`,status:'approved'},
 {name:'nc-house-source-approval.json',digest:'dac43953ac4e65218e2d1b4bf53b736cc7c5bdd60ec23112cb900f515dc2f0e4',directory:`${sourceRoot}/nc`,status:'approved'},
 {name:'nm-house-historical-source-approval.json',digest:'ed796c10702e11146c358421d8a509c08df7743949fa36ec985b9362778e09e5',directory:`${sourceRoot}/nm`,status:'approved'},
 {name:'de-house-current-source-cells-approval.json',digest:'18ff5ddab50d0d5f05b9a34d41dabeaf7724997ad7acf390b9b13a35c08607de',directory:senateRoot,status:'approved_source_cells_only'},
 {name:'de-house-current-normalization-approval.json',digest:'d7ff37ab49a8276ab3bec84ec0fdb826d033642b032b40d3219fd6c0542ddbf3',directory:`${sourceRoot}/de`,status:'approved'},
 // Batch barrier only. This importer never writes either Senate packet.
 {name:'de-senate-source-approval.json',digest:'f05929c42c14efc55162cad46f0da75e7c385c988f30c1391b5cd3d017d4db26',directory:senateRoot,status:'approved'},
 {name:'oh-state-source-approval.json',digest:'dd1aa3f7febb714f8fdaafa3e9fa07f3c391b03256015a7409afc38b6f9cd493',directory:senateRoot,status:'approved'},
];
const approvals=new Map();
for(const config of receipts){
 const file=`${reviewRoot}/${config.name}`,bytes=fs.readFileSync(file);assertHash(bytes,config.digest,file);
 const approval=JSON.parse(bytes);assert.equal(approval.status,config.status);assert.ok(Number.isFinite(Date.parse(approval.reviewedAt)));assert.ok(Object.keys(approval.inputHashes||{}).length);
 for(const [name,digest]of Object.entries(approval.inputHashes))assertHash(fs.readFileSync(`${config.directory}/${name}`),digest,`${config.directory}/${name}`);
 approvals.set(config.name,{...config,approval});
}
assert.equal(approvals.get('de-house-current-normalization-approval.json').approval.sourceCellApprovalSha256,approvals.get('de-house-current-source-cells-approval.json').digest);

const configurations=[
 {code:'ia',stateFips:'19',years:[2022,2026],receipt:'ia-house-source-approval.json',proof:'ia-house-proof.json',counties:99,portions:{2022:99,2026:99},cells:{2022:330,2026:361},controls:{2022:13,2026:15},totals:{2022:1211700,2026:1341241}},
 {code:'nc',stateFips:'37',years:[2022,2026],receipt:'nc-house-source-approval.json',proof:'nc-house-proof.json',counties:100,portions:{2022:113,2026:115},cells:{2022:259,2026:326},controls:{2022:32,2026:39},totals:{2022:3760753,2026:4190869}},
 {code:'nm',stateFips:'35',years:[2022],receipt:'nm-house-historical-source-approval.json',proof:'nm-historical-source-proof.json',counties:33,portions:{2022:43},cells:{2022:111},controls:{2022:8},totals:{2022:704126}},
 {code:'de',stateFips:'10',years:[2026],receipt:'de-house-current-normalization-approval.json',proof:'de-current-source-proof.json',counties:3,portions:{2026:3},cells:{2026:6},controls:{2026:2},totals:{2026:378433}},
];
const outputs=new Map(),pairedStates=[],factScopes=[],registrations=[],summaries=[];
for(const config of configurations){
 const {code,stateFips,years}=config,directory=`${sourceRoot}/${code}`,target=`public/data/house-completion-${code}`;
 const {approval,digest}=approvals.get(config.receipt);assert.equal(approval.approvedStateFips,stateFips);assert.deepEqual(approval.approvedYears,years);
 const proof=read(`${directory}/${config.proof}`);
 for(const [file,metadata]of Object.entries(proof.sourceFiles||{}))assertHash(fs.readFileSync(file),metadata.sha256,file);
 const review={status:'approved',reviewedAt:approval.reviewedAt,evidenceSha256:approval.inputHashes[config.proof],approvalReceiptSha256:digest};
 assert.match(review.evidenceSha256,/^[a-f0-9]{64}$/);
 const manifest=read(`${directory}/proposed-${code}-manifest.json`),pins={},scopes={};
 assert.equal(manifest.coverage.length,years.length);assert.deepEqual([...new Set(manifest.coverage.map(row=>row.year))].sort(),years);
 for(const year of years){
  const proposal=`proposed-${code}-house-${year}.json`,bytes=fs.readFileSync(`${directory}/${proposal}`);assertHash(bytes,approval.inputHashes[proposal],proposal);const data=JSON.parse(bytes);
  assert.equal(data.office,'house');assert.equal(data.year,year);assert.ok(data.results.every(row=>row.stateFips===stateFips&&row.special===false&&row.stage==='general'));
  const counties=data.results.filter(row=>row.geoLevel==='county'),districts=data.results.filter(row=>row.geoLevel==='district');assert.equal(counties.length,config.portions[year]);assert.equal(new Set(counties.map(row=>row.countyFips)).size,config.counties);
  assert.equal(counties.reduce((n,row)=>n+row.candidates.length,0),config.cells[year]);assert.equal(districts.reduce((n,row)=>n+row.candidates.length,0),config.controls[year]);
  assert.equal(counties.reduce((n,row)=>n+row.totalVotes,0),config.totals[year]);assert.equal(districts.reduce((n,row)=>n+row.totalVotes,0),config.totals[year]);
  assert.ok(data.results.every(row=>data.sources[row.sourceId]&&/^\d+$/.test(String(row.district))&&!row.sourceNeedsReview&&!row.incomplete&&!row.sourceTotalConflict&&!row.voteTotalMismatch&&row.candidates.every(candidate=>Number.isInteger(candidate.votes)&&candidate.votes>=0)&&row.totalVotes===row.candidates.reduce((n,candidate)=>n+candidate.votes,0)));
  if(year===2026)assert.ok(data.results.every(row=>row.provisional&&row.unofficial&&row.certified!==true));
  if(code==='nm'){
   assert.equal(proof['2026CurrentHold'].controlsPassed,false);assert.equal(proof['2026CurrentHold'].maskedCells.length,1);assert.equal(proof['2026CurrentHold'].maskedCells[0].count,null);
   const luna=counties.flatMap(row=>row.candidates).filter(candidate=>candidate.name==='Eliseo Luna');assert.equal(luna.length,15);assert.ok(luna.every(candidate=>candidate.party==='Democrat'&&candidate.partyOriginal==='Democratic'));
   const gonzales=counties.flatMap(row=>row.candidates).filter(candidate=>candidate.name==='Victoria L. Gonzales');assert.equal(gonzales.length,10);assert.ok(gonzales.every(candidate=>candidate.party==='Other'&&candidate.partyOriginal==='Independent'));
  }
  if(code==='de')assert.ok(data.results.every(row=>row.district==='0'&&row.sourceDistrict===null&&row.sourceUpdatedAt===null&&row.asOf===null&&row.sourceTimezone===null&&row.retrievedAt==='2026-11-07'&&row.countingStatus==='unknown'));
  const intersections=inventory(counties);assert.equal(new Set(intersections).size,intersections.length);
  const scope=code==='de'?{scopeComplete:true,controlsPassed:true,candidateControlCount:2,expectedCountyCount:3,districtCount:1,intersections,inventorySha256:sha(JSON.stringify(intersections))}:structuredClone(proof.years[year]);
  assert.equal(scope.candidateControlCount,config.controls[year]);assert.deepEqual(intersections,scope.intersections);assert.equal(sha(JSON.stringify(intersections)),scope.inventorySha256);scopes[year]=scope;
  const file=`${target}/house-${year}.json`;outputs.set(file,bytes);pins[file]=sha(bytes);
  const coverage=manifest.coverage.find(row=>row.year===year);assert.equal(coverage.url,`/data/house-completion-${code}/house-${year}.json`);assert.equal(coverage.rows,data.results.length);coverage.countyCount=config.counties;coverage.candidateCount=data.results.reduce((n,row)=>n+row.candidates.length,0);coverage.countyDistrictIntersections=true;
  summaries.push({stateFips,year,countyCount:config.counties,portions:counties.length,countyCandidateCells:config.cells[year],districtControls:config.controls[year],candidateVoteSum:config.totals[year],file,payloadSha256:pins[file]});
 }
 manifest.review={...review,approvedManifestProposalSha256:approval.inputHashes[`proposed-${code}-manifest.json`]};manifest.normalizedPayloadHashes=pins;manifest.limitations=approval.limitations;outputs.set(`${target}/manifest.json`,jsonBytes(manifest));
 registrations.push({name:`house-completion-${code}`,priority:180,manifestUrl:`/data/house-completion-${code}/manifest.json`,years,office:'house',approvalReceiptSha256:digest});
 if(years.length===2){
  const contract=read(`${directory}/proposed-${code}-contract.json`).states[0];assert.equal(contract.stateFips,stateFips);assert.deepEqual(contract.pinnedFileHashes,pins);assert.deepEqual(contract.years,scopes);contract.review={...review,approvedContractProposalSha256:approval.inputHashes[`proposed-${code}-contract.json`]};contract.limitations=approval.limitations;
  contract.comparisonNotes=code==='ia'?[
   'Each year’s complete House portions are summed countywide. Candidates, fields and election conditions differ; this is not a matched-candidate causal comparison.',
   'Historical county vectors retain exact research-source provenance and reconcile independent FEC controls, including separately retained scattered write-ins.',
   'Current counts are the fixed previously saved official-attributed extract. Original-source refresh access was blocked; count-update time remains unknown and returns remain provisional.',
  ]:[
   'Complete House portion inventories differ by year and are independently summed countywide. District boundaries, nominees and competition can change.',
   'The historical baseline is rebuilt from the official precinct and voting-method file, including administrative precincts; every candidate vector reconciles independent FEC controls.',
   'Current counts are the fixed previously saved extract. Accessible current dashboard HTML is not a newly reconciled county count refresh; update times remain unknown.',
  ];pairedStates.push(contract);
 }else{
  const year=years[0];factScopes.push({id:code==='nm'?'new-mexico-house-2022-historical-source-only':'delaware-house-2026-current-source-only',office:'house',year,stateFips,comparisonQualified:false,countyBoundariesCompatible:true,...scopes[year],pinnedFileHashes:pins,review:{...review,sourceApprovalStatus:code==='nm'?'historical_source_only_approved':'current_source_only_approved'},basis:code==='nm'?'Historical facts only: explicit official county aggregates and numeric county API match all eight separate state/FEC controls. The current protected Chaves value remains null and held.':'Current facts only: all three counties in the single statewide House contest, six exact reviewed source cells, and two separate native state controls; historical missing named write-ins stay held.',sources:Object.values(manifest.sources).map(source=>({title:source.title,url:source.url})),limitations:approval.limitations});
 }
}
// Preflight all existing destinations before the first mutation. Never replace a
// different public artifact or silently update an earlier source release.
for(const [file,bytes]of outputs)if(fs.existsSync(file))assertHash(fs.readFileSync(file),sha(bytes),`Existing public output differs; explicit review required: ${file}`);
const deData=JSON.parse(outputs.get('public/data/house-completion-de/house-2026.json')),deSourceId='de2026-house-reviewed-official-ui-county-table',deSource=deData.sources[deSourceId];
const deNarrowTimeAcceptance={
 normalizedPayloadFile:'public/data/house-completion-de/house-2026.json',normalizedPayloadSha256:sha(outputs.get('public/data/house-completion-de/house-2026.json')),
 normalizedApprovalReceiptSha256:approvals.get('de-house-current-normalization-approval.json').digest,rawCellApprovalReceiptSha256:approvals.get('de-house-current-source-cells-approval.json').digest,
 office:'house',year:2026,stateFips:'10',sourceId:deSourceId,sourceUrl:deSource.sourceUrl,allowedGeoLevels:['county','district'],allowedCountyFips:['10001','10003','10005'],normalizedDistrict:'0',sourcePrintedDistrict:null,
 rowFields:{asOf:null,sourceUpdatedAt:null,sourceTimezone:null,retrievedAt:'2026-11-07',retrievalPrecision:'Date only recorded in actual source capture packet; precise retrieval clock unknown',sourceTimestampRaw:'Data as of 11/04/2026 01:03 AM',sourceStateControlTimestampRaw:'2026-11-04T03:03:18.000'},
 sourceFields:{structuredCaptureSha256:deSource.structuredCaptureSha256,sourceCaptureShaBasis:deSource.sourceCaptureShaBasis,sourceCaptureMethod:deSource.sourceCaptureMethod,capturedDate:deSource.capturedDate,sourceUpdatedAt:null,sourceTimezone:null,stateControlSha256:deSource.stateControlSha256},
 acceptanceLimit:'Exact reviewed source/format/hash/receipt/date-only tuple only. This payload already retains a known capture date; do not reinterpret it as an intraday clock, copy the normalization approval into data fields, or loosen a global timestamp guard.',
};
const handoff={schemaVersion:1,status:checkOnly?'verified_approved_house_import':'imported_approved_house_sources',sourceRegistrations:registrations,countySourcesEntries:registrations.map(({name,priority})=>({name,priority})),houseComparability:{schemaVersion:1,states:pairedStates},houseFacts:{schemaVersion:1,scopes:factScopes},deNarrowTimeAcceptance,approvals:receipts.map(({name,digest,status})=>({file:`${reviewRoot}/${name}`,sha256:digest,status})),publicFileHashes:Object.fromEntries([...outputs].map(([file,bytes])=>[file,sha(bytes)])),sourceChecks:summaries,sharedIntegrationRequired:['Append the provided four COUNTY_SOURCES entries; preserve all prior sources and precedence.','Append only IA/NC approved states to house-comparability/2026.json.','Append only NM2022 and DE2026 single-year source facts to house-facts/scopes.json; no paired contract for either.','Retain NM2026 Chaves protected value and DE2022 missing named write-in holds.','Review/integrate only an exact source-specific DE date-only timestamp tuple if required; no global unknown-time fallback.','Root performs shared-source registration, builds, regression/independent integration checks, and any deployment.'],limits:['Importer performs no network/provider calls, builds, scheduler edits, shared register writes or deployments.','Approved normalized payload bytes are copied unchanged; only public manifests receive documented top-level review/coverage metadata.','Other two Senate approvals are a batch hash barrier only; this script never writes Senate artifacts.']};
if(!checkOnly){
 for(const [file,bytes]of outputs){fs.mkdirSync(path.dirname(file),{recursive:true});if(!fs.existsSync(file))fs.writeFileSync(file,bytes,{flag:'wx'});}
 fs.mkdirSync(sourceRoot,{recursive:true});fs.writeFileSync(handoffFile,jsonBytes(handoff));
}else{
 for(const [file,bytes]of outputs){assert.ok(fs.existsSync(file),`Public output missing: ${file}`);assertHash(fs.readFileSync(file),sha(bytes),file);}
 assert.ok(fs.existsSync(handoffFile),'Handoff missing; run importer first.');const previous=read(handoffFile);assert.deepEqual(previous.publicFileHashes,handoff.publicFileHashes);assert.deepEqual(previous.houseComparability,handoff.houseComparability);assert.deepEqual(previous.houseFacts,handoff.houseFacts);assert.deepEqual(previous.deNarrowTimeAcceptance,handoff.deNarrowTimeAcceptance);
}
// Negative checks are in-memory only; no approved input or payload is mutated.
const deBytes=outputs.get('public/data/house-completion-de/house-2026.json');assert.throws(()=>assertHash(Buffer.concat([deBytes,Buffer.from('\n')]),sha(deBytes),'in-memory altered payload'));
for(const [file,bytes]of outputs)assertHash(fs.readFileSync(file),sha(bytes),file);
console.log(JSON.stringify({status:handoff.status,approvedReceiptsChecked:receipts.length,publicFilesChecked:outputs.size,payloadBytesUnchanged:true,sourceChecks:summaries,handoff:handoffFile,pairedStateFips:pairedStates.map(state=>state.stateFips),singleYearFacts:factScopes.map(scope=>`${scope.stateFips}-${scope.year}`),retainedHolds:['NM2026 protected Chaves/CD2 candidate cell','DE2022 missing ScottWalker15/EdwardShlikas3 county write-ins'],sharedFilesWritten:false}));
