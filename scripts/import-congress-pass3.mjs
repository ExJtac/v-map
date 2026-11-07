/** Optional offline import of independently reviewed third-pass source packets. */
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {senateRoundVectorInventory} from './build-2026-anomalies.mjs';
const read=file=>JSON.parse(fs.readFileSync(file)),sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const write=(file,value)=>{const bytes=JSON.stringify(value,null,2)+'\n';fs.writeFileSync(file,bytes);return sha(bytes);};
function approved(directory,name,digest){
 const bytes=fs.readFileSync(`scripts/source-data/completion-review-2026/pass3/${name}-source-approval.json`);assert.equal(sha(bytes),digest);const approval=JSON.parse(bytes);assert.equal(approval.status,'approved');assert.ok(Number.isFinite(Date.parse(approval.reviewedAt)));
 for(const [file,hash]of Object.entries(approval.inputHashes||{}))assert.equal(sha(fs.readFileSync(`${directory}/${file}`)),hash,`Approved packet changed: ${name}/${file}`);return {approval,digest};
}
const specialDirectory='scripts/source-data/senate-completion-pass3-2026';
const {approval:specialApproval,digest:specialDigest}=approved(specialDirectory,'special-senate','22c597889d783ce28c6ec4e1f3f834221ecf6ad931b26e8bf6cb6b8166ecdc10');
const specialRegister={schemaVersion:1,states:[]},specialDraft=read(specialDirectory+'/proposed-special-seat-contract.json');
for(const [code,stateFips]of [['fl','12'],['oh','39']]){
 const target=`public/data/senate-specials-${code}`;fs.mkdirSync(target,{recursive:true});const sources={},coverage=[],contract=structuredClone(specialDraft.states.find(s=>s.stateFips===stateFips));assert.ok(contract);
 contract.id=`${code}-senate-class-3-2022-2026-special`;contract.baselineYear=2022;contract.currentYear=2026;contract.pinnedFileHashes={};
 for(const year of [2022,2026]){
  const proposal=`proposed-${code}-senate-${year}${code==='oh'?'-date-qualified':''}.json`,bytes=fs.readFileSync(`${specialDirectory}/${proposal}`),data=JSON.parse(bytes);assert.equal(data.office,'senate');assert.equal(data.year,year);assert.ok(data.results.every(r=>r.stateFips===stateFips&&Boolean(r.special)===(year===2026)&&r.electionDate===(year===2022?'2022-11-08':'2026-11-03')&&r.sourceSeatId===contract.seatId&&!r.seatId));
  let published=bytes;
  if(code==='oh'){
   const original=read(`public/data/modern-counties/senate-${year}.json`);const oldRows=original.results.filter(r=>r.geoLevel==='county'&&r.stateFips===stateFips);assert.equal(oldRows.length,data.results.length);
   for(const row of data.results){const old=oldRows.find(r=>r.countyFips===row.countyFips);assert.ok(old);const a={...row},b={...old};for(const key of ['electionDate','sourceSeatId']){delete a[key];delete b[key];}assert.deepEqual(a,b);}
   data.status='source_reviewed_date_and_seat_metadata';data.review={reviewedAt:specialApproval.reviewedAt,approvalReceiptSha256:specialDigest,approvedProposalSha256:sha(bytes)};published=JSON.stringify(data)+'\n';contract.pinnedFileHashes[`public/data/modern-counties/senate-${year}.json`]=sha(fs.readFileSync(`public/data/modern-counties/senate-${year}.json`));
  }
  const file=`${target}/senate-${year}.json`;fs.writeFileSync(file,published);contract.pinnedFileHashes[file]=sha(published);Object.assign(sources,data.sources);const counties=data.results.filter(r=>r.geoLevel==='county');const scope=contract.years[year];scope.mergedVectorSha256=sha(JSON.stringify(senateRoundVectorInventory(counties,`/data/senate-specials-${code}/senate-${year}.json`)));delete scope.proposalFile;
  coverage.push({office:'senate',year,url:`/data/senate-specials-${code}/senate-${year}.json`,geoLevels:[...new Set(data.results.map(r=>r.geoLevel))],rows:data.results.length,stateCount:1,countyCount:counties.length,candidateCount:data.results.reduce((n,r)=>n+r.candidates.length,0)});
 }
 contract.review={status:'approved',reviewedAt:specialApproval.reviewedAt,evidenceSha256:specialApproval.inputHashes['proposed-special-seat-contract.json'],approvalReceiptSha256:specialDigest};
 if(contract.seatIdentityBasis)contract.seatIdentityBasis.status='reviewed_primary_source_inference';
 contract.comparisonNotes=[
  'This compares the same Class III Senate seat: its 2022 regular election and the 2026 special election for the remaining term ending January 3, 2029. Candidates and the term being contested differ.',
  'Both are midterm election years. Candidate choices, voting rules, population and incomplete reporting can affect changes; these screens do not determine a cause or establish wrongdoing.',
  code==='fl'?'Florida’s special-election classification is derived from official appointment, term, vacancy-rule and election records; a separate election writ was not retrieved.':'Ohio’s official contest identifies the unexpired term ending January 3, 2029.',
  code==='fl'?'Current county counts were freshly retrieved from the official download. The statewide cross-check uses the official publisher’s indexed summary; its full original summary page could not be opened.':'Current counts come from the previously saved report; no fresh Ohio count refresh is claimed.',
 ];
 specialRegister.states.push(contract);write(`${target}/manifest.json`,{schemaVersion:1,snapshotDate:'2026-11-07',sources,coverage,review:contract.review,limitations:contract.limitations});
}
// Independently approved indexed state summary, kept separate from native county returns.
{
 const file='scripts/source-data/completion-review-2026/pass3/fl-state-controls-supplemental-approval.json',bytes=fs.readFileSync(file),digest='a4270d7bc57cb3b6183f15115a6f0eb7ba6c6387926be881e9d415019e0a4e7d';assert.equal(sha(bytes),digest);const a=JSON.parse(bytes);assert.equal(a.status,'approved');assert.equal(sha(fs.readFileSync(a.sourceInputPath)),a.sourceInputSha256);
 const sourceId='fl-senate-indexed-state-controls-2026',sourceFormat='saved primary indexed summary extraction; original summary body not retrieved';
 const source={title:'Florida Election Watch: 2026 U.S. Senate statewide summary (indexed primary extraction)',publisher:'Florida Division of Elections / Florida Election Watch',url:a.sourceUrl,sha256:a.sourceInputSha256,evidenceSha256:a.sourceInputSha256,sourceIsOfficial:true,sourceFormat,sourceReviewDate:'2026-11-07',reviewedAt:a.reviewedAt,approvalReceiptSha256:digest,retrievedAt:null,retrievedDate:'2026-11-07',sourceUpdatedAt:null,retrievedAtBasis:'Exact successful indexed-summary retrieval timestamp unavailable; failed request times are not used.',accessNote:a.approvedSourceAuthority};
 const row={office:'senate',year:2026,stateFips:'12',state:'Florida',stateAbbr:'FL',geoLevel:'state',contestId:'senate-2026-12-state-general-True',stage:'general',special:true,electionDate:'2026-11-03',sourceSeatId:a.approvedSourceSeatId,sourceId,candidates:a.approvedCandidates,totalVotes:a.approvedTotalVotes,totalVotesBasis:a.totalVotesBasis,...a.statusRequirements,asOf:null,sourceUpdatedAt:null,retrievedAt:null,retrievedDate:'2026-11-07',sourceReviewDate:'2026-11-07',sourceTimestampBasis:'Successful indexed source retrieval is known only to the day; count-update time is unknown.'};
 const target='public/data/senate-specials-fl',stateFile=target+'/state-indexed-2026.json',hash=write(stateFile,{schemaVersion:1,office:'senate',year:2026,sources:{[sourceId]:source},results:[row]});const manifest=read(target+'/manifest.json');manifest.sources[sourceId]=source;manifest.coverage.push({office:'senate',year:2026,url:'/data/senate-specials-fl/state-indexed-2026.json',geoLevels:['state'],rows:1,stateCount:1,countyCount:0,candidateCount:3});manifest.indexedStateReview={reviewedAt:a.reviewedAt,approvalReceiptSha256:digest,normalizedSourceSha256:hash};write(target+'/manifest.json',manifest);specialRegister.states.find(s=>s.stateFips==='12').pinnedFileHashes[stateFile]=hash;
}
fs.mkdirSync('public/data/senate-special-comparability',{recursive:true});write('public/data/senate-special-comparability/2026.json',specialRegister);
// Renew only Georgia's current round vector; preserve all historical sources and qualification.
{
 const directory='scripts/source-data/ga-senate-refresh-pass3-2026',name='ga-senate';const {approval,digest}=approved(directory,name,'92534a633488f195be58c738c99d14bb971f261be6b9db6c1e9be95343d64e03');const bytes=fs.readFileSync(directory+'/proposed-ga-senate-2026.json'),data=JSON.parse(bytes),target='public/data/senate-current-ga';fs.mkdirSync(target,{recursive:true});fs.writeFileSync(target+'/senate-2026.json',bytes);
 const file='public/data/senate-comparability/2026.json',register=read(file),contract=register.states.find(s=>s.stateFips==='13');assert.ok(contract);const counties=data.results.filter(r=>r.geoLevel==='county');assert.equal(counties.length,159);
 contract.pinnedFileHashes[target+'/senate-2026.json']=sha(bytes);contract.years[2026].mergedVectorSha256=sha(JSON.stringify(senateRoundVectorInventory(counties,'/data/senate-current-ga/senate-2026.json')));contract.years[2026].sourceStage='US Senate';
 const currentScope=contract.years[2026];if(currentScope.candidateVectorInventorySha256){currentScope.supersededCandidateVectorInventorySha256=currentScope.candidateVectorInventorySha256;delete currentScope.candidateVectorInventorySha256;}
 const oldSources=contract.sources.filter(source=>source.retainedPath?.endsWith('results-2026-ga.csv'));contract.supersededCurrentSources=contract.supersededCurrentSources||[];for(const source of oldSources)if(!contract.supersededCurrentSources.some(old=>old.sha256===source.sha256))contract.supersededCurrentSources.push({...source,title:'Superseded earlier Georgia2026saved snapshot',access:'Preserved historical source; the active current vector is the newly reviewed direct official JSON.'});
 const info=Object.values(data.sources)[0],activeUrls=[info.url,info.controlUrl];contract.sources=contract.sources.filter(source=>!source.retainedPath?.endsWith('results-2026-ga.csv')&&!activeUrls.includes(source.url));contract.sources.push({title:'Georgia official2026Senate county breakdown, directly retrieved',url:info.url,sha256:info.sha256,retrievedAt:info.retrievedAt},{title:'Georgia official2026whole-election Senate controls, separately retrieved',url:info.controlUrl,sha256:info.controlSha256,retrievedAt:info.controlRetrievedAt});
 contract.priorBaselineApprovalReceiptSha256=contract.priorBaselineApprovalReceiptSha256||contract.review.approvalReceiptSha256;contract.review={status:'approved',reviewedAt:approval.reviewedAt,evidenceSha256:approval.inputHashes['proof.json'],approvalReceiptSha256:digest};
 contract.limitations=contract.limitations.filter(t=>!t.includes('Current 318 county cells')&&!t.includes('Any pinned source file'));contract.limitations=[...new Set([...contract.limitations,...data.limitations,'Any pinned input, merged candidate/source vector or seat/date/stage change requires renewed qualification.'])];contract.comparisonNotes=contract.comparisonNotes.filter(t=>!t.startsWith('Current counts come'));contract.comparisonNotes=[...new Set([...contract.comparisonNotes,'Current county counts were freshly retrieved from official Georgia JSON and reconcile the separately retrieved whole-election summary. Returns remain unofficial.'])];write(file,register);
 write(target+'/manifest.json',{schemaVersion:1,snapshotDate:'2026-11-07',sources:data.sources,coverage:[{office:'senate',year:2026,url:'/data/senate-current-ga/senate-2026.json',geoLevels:['county','state'],rows:160,stateCount:1,countyCount:159,candidateCount:320}],review:contract.review,limitations:data.limitations});
}
console.log(JSON.stringify({status:'imported_reviewed_sources',specialCounties:155,georgiaFreshCounties:159,originalPayloadsPreserved:true}));
function importHouse(code,stateFips,digest){
 const directory=`scripts/source-data/house-completion-pass3-2026/${code}`,{approval}=approved(directory,`${code}-house`,digest),target=`public/data/house-completion-${code}`;fs.mkdirSync(target,{recursive:true});const manifest=read(`${directory}/proposed-${code}-manifest.json`),contract=read(`${directory}/proposed-${code}-contract.json`).states[0];assert.equal(contract.stateFips,stateFips);
 for(const year of [2022,2026]){const bytes=fs.readFileSync(`${directory}/proposed-${code}-house-${year}.json`),data=JSON.parse(bytes);assert.equal(data.office,'house');assert.equal(data.year,year);assert.ok(data.results.every(r=>r.stateFips===stateFips));fs.writeFileSync(`${target}/house-${year}.json`,bytes);const entry=manifest.coverage.find(c=>c.year===year),counties=data.results.filter(r=>r.geoLevel==='county');assert.ok(entry);entry.countyCount=new Set(counties.map(r=>r.countyFips)).size;entry.candidateCount=data.results.reduce((n,r)=>n+r.candidates.length,0);entry.countyDistrictIntersections=true;}
 contract.review={status:'approved',reviewedAt:approval.reviewedAt,evidenceSha256:approval.inputHashes[`${code}-house-proof.json`],approvalReceiptSha256:digest};contract.limitations=approval.limitations;
 contract.comparisonNotes=code==='ga'?[
  'Each year’s complete House district portions are summed countywide independently. District composition, candidates and competition can differ.',
  'Current Georgia counts were freshly retrieved from official JSON and reconcile separate district and whole-election controls. They remain provisional; county count-update times are unknown.',
  'The historical Lisa Babbage14write-in votes come from the actual Gwinnett report. No Fulton zero or statewide allocation was invented.',
  'Gwinnett’s unresolved2022write-in categories remain unclassified, so that county’s historical comparisons stay held. A Henry/Harry Johnson source-name difference is preserved.',
 ]:[
  'Complete House county/district inventories differ:83portions in2022and82in2026. Countywide changes are not matched-seat or matched-candidate comparisons.',
  'The official2022state source reports Skowronski72votes; the FEC publication reports71. The state value is retained. This source disagreement is not a finding of a voting error.',
  'The official archive and election context identify2022despite an incorrectCongress heading in the printed table. Original source labels and explicit zero portions remain preserved.',
  'Current Colorado counts use the previously saved report. A direct refresh could not be retrieved; the source count-update time remains unknown.',
 ];
 contract.comparisonNotes=contract.comparisonNotes.map(t=>t.replaceAll('Babbage14','Babbage 14').replaceAll('unresolved2022','unresolved 2022').replaceAll('differ:83portions in2022and82in2026','differ: 83 portions in 2022 and 82 in 2026').replaceAll('official2022state','official 2022 state').replaceAll('Skowronski72votes','Skowronski 72 votes').replaceAll('reports71','reports 71').replaceAll('identify2022despite','identify 2022 despite').replaceAll('incorrectCongress','incorrect Congress'));
 manifest.review=contract.review;manifest.limitations=contract.limitations;write(`${target}/manifest.json`,manifest);const registerFile='public/data/house-comparability/2026.json',register=read(registerFile);register.states=register.states.filter(s=>s.stateFips!==stateFips);register.states.push(contract);register.states.sort((a,b)=>a.stateFips.localeCompare(b.stateFips));write(registerFile,register);
 console.log(JSON.stringify({status:'imported_reviewed_house',stateFips,scopeCounties:contract.years[2026].expectedCountyCount,baselineHoldsPreserved:code==='ga'?'Gwinnett unresolved write-ins':'primary/FEC publication discrepancy disclosed'}));
}
importHouse('ga','13','0b40ce901b471d0fd4b9810fb10de489053e5011c74dc0d1f1eda6b73fa37857');
importHouse('co','08','af68cdf834b83a5e4d420827212cc117658f9a66e7d3ea8f4039ad4a9f571590');
