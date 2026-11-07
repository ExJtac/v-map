/** Optional offline imports of exact independently reviewed second-pass packets.
 * Builds use the tracked normalized facts and never need these ignored packets.
 */
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {senateRoundVectorInventory} from './build-2026-anomalies.mjs';
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const read=file=>JSON.parse(fs.readFileSync(file));
function approvedPacket(directory,name,digest){
 const bytes=fs.readFileSync(`scripts/source-data/completion-review-2026/pass2/${name}-source-approval.json`);assert.equal(sha(bytes),digest);
 const approval=JSON.parse(bytes);assert.equal(approval.status,'approved');assert.ok(Number.isFinite(Date.parse(approval.reviewedAt)));
 for(const [file,expected]of Object.entries(approval.inputHashes))assert.equal(sha(fs.readFileSync(`${directory}/${file}`)),expected,`Changed approved packet ${name}/${file}`);
 return {approval,receiptSha256:digest};
}
function importSenateRound(code,stateFips,approvalDigest){
 const directory='scripts/source-data/senate-completion-pass2-2026';
 const {approval,receiptSha256}=approvedPacket(directory,code,approvalDigest);
 const proposed=read(`${directory}/${code}-date-qualified-replacements.json`),contract=read(`${directory}/${code}-builder-round-contract.json`).states[0];
 assert.equal(contract.stateFips,stateFips);assert.equal(proposed.recordCount,approval.approvedReplacements);
 const target=`public/data/senate-rounds-${code}`,sources={},coverage=[];fs.mkdirSync(target,{recursive:true});
 for(const year of [2020,2026]){
  const original=read(`public/data/modern-counties/senate-${year}.json`);
  const results=proposed.records.filter(r=>Number(r.year||r.contestId.split('-')[1])===year);
  assert.equal(results.length,approval.approvedCountyCountPerYear);assert.equal(new Set(results.map(r=>r.countyFips)).size,results.length);
  const originals=original.results.filter(r=>r.geoLevel==='county'&&r.stateFips===stateFips&&!r.special);
  assert.equal(originals.length,results.length);
  for(const row of results){
   const before=originals.find(r=>r.countyFips===row.countyFips);assert.ok(before);const stripped={...row};for(const field of approval.approvedChangedFieldsOnly)delete stripped[field];const prior={...before};for(const field of approval.approvedChangedFieldsOnly)delete prior[field];assert.deepEqual(stripped,prior,'Replacement changed an unapproved source field');
   assert.equal(row.electionDate,`${year}-11-03`);assert.equal(row.sourceSeatId,`${stateFips}-senate-class-2`);assert.equal(row.seatId,undefined);
  }
  const ids=[...new Set(results.flatMap(r=>[r.sourceId,...(r.sourceIds||[])].filter(Boolean)))];
  const selected=Object.fromEntries(ids.map(id=>{assert.ok(original.sources[id]);return [id,original.sources[id]];}));Object.assign(sources,selected);
  const payload={schemaVersion:1,office:'senate',year,sources:selected,results,review:{status:'reviewed_november_round_metadata',reviewedAt:approval.reviewedAt,approvalReceiptSha256:receiptSha256,sourceEvidenceSha256:contract.review.evidenceSha256},limitations:approval.limitations};
  const file=`${target}/senate-${year}.json`,bytes=JSON.stringify(payload)+'\n';fs.writeFileSync(file,bytes);contract.pinnedFileHashes[file]=sha(bytes);contract.years[year].mergedVectorSha256=sha(JSON.stringify(senateRoundVectorInventory(results,`/data/senate-rounds-${code}/senate-${year}.json`)));
  coverage.push({office:'senate',year,url:`/data/senate-rounds-${code}/senate-${year}.json`,geoLevels:['county'],rows:results.length,stateCount:1,countyCount:results.length,candidateCount:results.reduce((n,r)=>n+r.candidates.length,0)});
 }
 contract.id=`${code}-senate-2020-2026-reviewed-november-ballots`;contract.review={status:'approved',reviewedAt:approval.reviewedAt,evidenceSha256:contract.review.evidenceSha256,approvalReceiptSha256:receiptSha256};contract.limitations=approval.limitations;
 contract.comparisonNotes=[
  code==='ga'?'These compare the first November ballot for the same Senate seat. Georgia’s January 2021 runoff and separate special election are excluded; these are not final-deciding-round or identical-candidate comparisons.':'Louisiana’s 2020 ballot had 15 candidates; its 2026 general ballot has two following a new party-primary system. This structural change can substantially affect party and total-vote comparisons.',
  'The 2020 baseline was a presidential-election year; 2026 is a midterm. Candidates, voting rules, population and incomplete reporting can affect changes.',
  'Current counts come from the previously saved source report. A fresh official count report could not be retrieved; no current refresh is claimed.',
  'Historical county totals reconcile with published statewide controls. This is not an independent county audit or a finding of wrongdoing.',
 ];
 const registerFile='public/data/senate-comparability/2026.json',register=fs.existsSync(registerFile)?read(registerFile):{schemaVersion:1,states:[]};register.states=register.states.filter(s=>s.stateFips!==stateFips);register.states.push(contract);register.states.sort((a,b)=>a.stateFips.localeCompare(b.stateFips));fs.mkdirSync('public/data/senate-comparability',{recursive:true});fs.writeFileSync(registerFile,JSON.stringify(register,null,2)+'\n');
 fs.writeFileSync(`${target}/manifest.json`,JSON.stringify({schemaVersion:1,snapshotDate:'2026-11-07',sources,coverage,review:contract.review,limitations:contract.limitations},null,2)+'\n');
 console.log(JSON.stringify({status:'imported_reviewed_round_metadata',stateFips,countyCountPerYear:coverage[0].countyCount,voteValuesChanged:0,currentPrimaryRefresh:false}));
}
importSenateRound('ga','13','2986c3921b5ff511c1ab84253e6fa4f88c1283d5abd5ed94ee00cd67e516d401');
importSenateRound('la','22','740e440f8b820e9562d5070c5aa60a2623f2a51aa499f34e819e6cad9a466232');
function importHousePacket(code,stateFips,approvalDigest){
 const directory=`scripts/source-data/house-completion-pass2-2026/${code}`;
 const {approval,receiptSha256}=approvedPacket(directory,code,approvalDigest),target=`public/data/house-completion-${code}`;fs.mkdirSync(target,{recursive:true});
 const manifest=read(`${directory}/proposed-${code}-manifest.json`),contract=read(`${directory}/proposed-${code}-contract.json`).states[0];assert.equal(contract.stateFips,stateFips);
 for(const year of [2022,2026]){
  const bytes=fs.readFileSync(`${directory}/proposed-${code}-house-${year}.json`),data=JSON.parse(bytes);assert.equal(data.office,'house');assert.equal(data.year,year);assert.ok(data.results.every(r=>r.stateFips===stateFips));if(year===2026)assert.ok(data.results.every(r=>r.provisional&&r.unofficial&&!r.certified));fs.writeFileSync(`${target}/house-${year}.json`,bytes);
  const entry=manifest.coverage.find(r=>r.year===year),counties=data.results.filter(r=>r.geoLevel==='county');assert.ok(entry);entry.rows=data.results.length;entry.countyCount=new Set(counties.map(r=>r.countyFips)).size;entry.candidateCount=data.results.reduce((n,r)=>n+r.candidates.length,0);entry.countyDistrictIntersections=true;
 }
 contract.review={status:'approved',reviewedAt:approval.reviewedAt,evidenceSha256:approval.inputHashes[`${code}-house-proof.json`],approvalReceiptSha256:receiptSha256};contract.limitations=approval.limitations;
 if(code==='ca')contract.limitations=[
  'All 2026 results are unofficial and provisional. Reporting every precinct does not establish complete counting or certification.',
  'The countywide aggregate sums each year’s complete House portions independently: 130 in 2022 and 144 in 2026. It is not a matched same-seat or same-candidate comparison.',
  'Original official candidate and party identities are retained. An absent opposing party is never invented for a same-party race.',
  'Explicit published zeros are preserved; missing values are never filled with inferred zeros.',
  'All 58 county FIPS match the Census roster. This bounded compatibility check does not adjudicate every minor cartographic correction.',
  'Source reporting times remain verbatim without an inferred time zone; actual retrieval times are separate.',
  'The old held Los Angeles District 30 source remains unchanged. This separately qualified official baseline supplies full published names.',
 ];
 contract.limitations=contract.limitations.map(text=>text.replaceAll('\\u2013','–'));
 if(code==='ca')contract.limitations.push('The two California official2022workbooks identify Douglas Brower as Republican; the FEC workbook labels him D. All sources show79029votes. The state party identity is retained and the disagreement remains unresolved.','Three encoding-damaged given/family-name cells are repaired only to the exact matching names corroborated by the separate official workbook; original source values remain in provenance.','Nine current districts have same-party nominees. An absent party remains null, not zero; a party comparison requires both named parties across the county.');
 manifest.review=contract.review;manifest.limitations=contract.limitations;fs.writeFileSync(`${target}/manifest.json`,JSON.stringify(manifest,null,2)+'\n');
 const file='public/data/house-comparability/2026.json',register=read(file);register.states=register.states.filter(s=>s.stateFips!==stateFips);register.states.push(contract);register.states.sort((a,b)=>a.stateFips.localeCompare(b.stateFips));fs.writeFileSync(file,JSON.stringify(register,null,2)+'\n');
 console.log(JSON.stringify({status:'imported_reviewed_house_scope',stateFips,counties:contract.years[2026].expectedCountyCount,portions:Object.fromEntries([2022,2026].map(y=>[y,contract.years[y].intersections.length]))}));
}
importHousePacket('ca','06','c184096469693235202644a0ce8f26b8a314c659559bb45a10662c4816d190be');
importHousePacket('ut','49','87a34e77708d8a07745515f647bcb00cec7453419191e3cf699e07e44364feab');
