import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {COUNTY_SOURCES} from '../src/coverage-sources.js';
import {mergeElectionData} from '../src/county-data.js';
import {buildPatternReview,OFFICES,SENATE_CLASS_2_SOURCE} from '../src/2026-anomalies.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const MT_PINNED_FILES={
 'public/data/modern-counties/house-2022.json':'303d76373d5d82b863ce7b8ef4bfb49946887351f8fdb2c41e04835b555a4b64',
 'public/data/house-repairs/house-2026.json':'5f90fa16ee626b188d970ce040cbf1c30c70e02ca229bb9d228d369a3f119b0e',
 'public/data/elections/house-2022.json':'599a4451f2682f8cf59a3a5364f4a35e59ba844724bc8fac95f70c9d394c2e3a',
};
const MT_INVENTORY_SHA256='fdf01df4ceae0c1ddddf0ab07b72feb0a81e320ce184642aa064fd27e6e6453c';
const selectedFromPinnedHouseFiles=(rows,pins,year)=>rows.every(row=>{
 const file=`public${row.sourceSelection?.url}`;
 return file.endsWith(`house-${year}.json`)&&Object.hasOwn(pins,file);
});
export function montanaComparability(elections,inputHashes) {
 const hash=text=>crypto.createHash('sha256').update(text).digest('hex');
 const byYear={};
 for(const year of [2022,2026])byYear[year]=(elections[`house-${year}`]?.results||[]).filter(r=>r.geoLevel==='county'&&r.stateFips==='30');
 const keys=year=>byYear[year].map(r=>`${r.countyFips}|${Number(r.district)}`).sort();
 const intersections=keys(2022),inventoryHashes=Object.fromEntries([2022,2026].map(year=>[year,hash(keys(year).join('\n')+'\n')]));
 const sourceHashesMatch=Object.entries(MT_PINNED_FILES).every(([name,digest])=>inputHashes[name]===digest);
 const selectedSourceFilesMatch=[2022,2026].every(year=>selectedFromPinnedHouseFiles(byYear[year],MT_PINNED_FILES,year));
 const verified=sourceHashesMatch&&selectedSourceFilesMatch&&[2022,2026].every(year=>byYear[year].length===57&&new Set(byYear[year].map(r=>r.countyFips)).size===56&&new Set(keys(year)).size===57&&inventoryHashes[year]===MT_INVENTORY_SHA256);
 return {id:'montana-house-2022-2026-complete-county-portions',verified,scopeComplete:verified,countComplete:false,intersections,inventoryHashes,expectedInventorySha256:MT_INVENTORY_SHA256,pinnedFileHashes:MT_PINNED_FILES,sourceHashesMatch,selectedSourceFilesMatch,official2026WorkbookSha256:'e76f185e9ab3fefcc5fdd4ea6b93e8b112eca156bdedeb86813290c445559498',basis:'All57 published county-district portions across56Montana counties, both years; aggregate all portions, not district-summary allocations. Complete scope does not imply completed 2026 counting.',baselineControlQualification:'Researcher asserted FEC agreement; session independently cross-checked2022candidate county sums against the separate MEDSL constituency totals, not a newly downloaded FEC canvass.',sources:[{title:'Montana Secretary of State2026statewide public workbook export (provisional)',url:'https://electionresults.mt.gov/ResultsExport.aspx'},{title:'MEDSL 2022 U.S. House constituency returns used as independent county-sum controls',url:'https://doi.org/10.7910/DVN/IG0UN2'},{title:'Heideman county-district source register (candidate county sums)',url:'https://doi.org/10.5281/zenodo.22976553'}],...(!verified?{reason:'Pinned Montana source files or complete scope inventory changed; renewed source qualification required.'}:{})};
}
const AZ_PINNED_FILES={
 'public/data/research-house/house-2022.json':'8dde8edd835873088cbb056200887cce7309f08995e68aa8f7ca9bed14ebf562',
 'public/data/research-house/house-2026.json':'d33465a0234394558319df650815741807aa4f3b683a01e296489efa5f89de29',
};
const AZ_INVENTORY_SHA256='7da0af2af5b7b0636aec3756b9b62c138d6a1e4c7ada2583065b28445e2eed81';
export function arizonaComparability(elections,inputHashes,manifest) {
 const inventories={},inventoryHashes={};
 for(const year of [2022,2026]) {
   inventories[year]=(elections[`house-${year}`]?.results||[]).filter(r=>r.geoLevel==='county'&&r.stateFips==='04').map(r=>[r.countyFips,String(Number(r.district))]).sort((a,b)=>a[0].localeCompare(b[0])||a[1].localeCompare(b[1]));
   inventoryHashes[year]=crypto.createHash('sha256').update(JSON.stringify(inventories[year])).digest('hex');
 }
 const sourceHashesMatch=Object.entries(AZ_PINNED_FILES).every(([p,h])=>inputHashes[p]===h);
 const proof=manifest?.scopeProofs,validation=manifest?.validation;
 const proofMatches=validation?.status==='passed'&&validation?.sourceCandidateControls===75&&[2022,2026].every(year=>proof?.[year]?.scopeComplete===true&&proof[year].stage==='general'&&proof[year].special===false&&proof[year].countyCount===15&&proof[year].districtCount===9&&proof[year].countyDistrictIntersections===30&&proof[year].inventorySha256===AZ_INVENTORY_SHA256&&JSON.stringify(proof[year].inventory)===JSON.stringify(inventories[year]));
 const selectedSourceFilesMatch=[2022,2026].every(year=>selectedFromPinnedHouseFiles((elections[`house-${year}`]?.results||[]).filter(r=>r.geoLevel==='county'&&r.stateFips==='04'),AZ_PINNED_FILES,year));
 const verified=sourceHashesMatch&&proofMatches&&selectedSourceFilesMatch&&[2022,2026].every(year=>inventories[year].length===30&&new Set(inventories[year].map(a=>a[0])).size===15&&new Set(inventories[year].map(a=>a[1])).size===9&&new Set(inventories[year].map(a=>a.join('|'))).size===30&&inventoryHashes[year]===AZ_INVENTORY_SHA256);
 return {id:'arizona-house-2022-2026-complete-county-portions',verified,stateFips:'04',scopeComplete:verified,countComplete:false,intersections:inventories[2022].map(a=>a.join('|')),inventoryHashBasis:'SHA256 of compact JSON array of sorted [countyFips,district] pairs; no trailing newline',inventoryHashes,expectedInventorySha256:AZ_INVENTORY_SHA256,pinnedFileHashes:AZ_PINNED_FILES,sourceHashesMatch,selectedSourceFilesMatch,proofMatches,sourceCandidateControls:75,sourceCandidateControlsByYear:{2022:26,2026:49},basis:'All30 actual county-district portions across15Arizona counties and9districts in both years. Scope completeness is distinct from completed2026counting; no district allocation.',baselineRawFormat:'Saved primary certified PDF web-text extraction, not downloaded PDF bytes; direct PDF request returned403.',sources:[{title:'Arizona Secretary of State2022certified general canvass (saved primary PDF web-text extraction)',url:'https://apps.azsos.gov/election/2022/General/canvass/2022dec05_general_election_canvass_web.pdf'},{title:'Arizona Secretary of State2026official provisional export via Enhanced Voting',url:'https://app.enhancedvoting.com/cdn/results/Arizona/export-110326GeneralElection.json'}],...(!verified?{reason:'Pinned Arizona files, actual complete portion inventory or manifest control proof changed; renewed qualification required.'}:{})};
}
export function additionalHouseComparability(elections,inputHashes,proofs) {
 const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
 const result={};
 if(!proofs)return result;
 if(proofs.schemaVersion!==1||!Array.isArray(proofs.states))throw Error('Invalid reviewed House scope register.');
 for(const proof of proofs.states){
  const state=proof.stateFips;
  if(!/^\d{2}$/.test(state)||['04','30'].includes(state)||result[state])throw Error('Duplicate or reserved House scope state.');
  const inventories={},inventoryHashes={};
  for(const year of [2022,2026]){
   inventories[year]=(elections[`house-${year}`]?.results||[]).filter(r=>r.geoLevel==='county'&&r.stateFips===state&&!r.special&&['general','gen','g'].includes(String(r.stage||'general').toLowerCase())).map(r=>`${r.countyFips}|${Number(r.district)}`).sort();
   inventoryHashes[year]=hash(JSON.stringify(inventories[year]));
  }
  const pins=Object.entries(proof.pinnedFileHashes||{}),sourceHashesMatch=pins.length>=2&&[2022,2026].every(year=>pins.some(([file])=>file.endsWith(`house-${year}.json`)))&&pins.every(([file,digest])=>inputHashes[file]===digest);
  const sourceProofReviewed=proof.review?.status==='approved'&&/^\d{4}-\d{2}-\d{2}T/.test(proof.review.reviewedAt||'')&&/^[a-f0-9]{64}$/.test(proof.review.evidenceSha256||'');
  const scopeMatches=[2022,2026].every(year=>{
   const scope=proof.years?.[year],actual=inventories[year];
   return scope?.scopeComplete===true&&scope?.controlsPassed===true&&scope.candidateControlCount>0&&scope.expectedCountyCount>0&&scope.districtCount>0&&Array.isArray(scope.intersections)&&actual.length===scope.intersections.length&&new Set(actual).size===actual.length&&JSON.stringify(actual)===JSON.stringify([...scope.intersections].sort())&&new Set(actual.map(k=>k.split('|')[0])).size===scope.expectedCountyCount&&new Set(actual.map(k=>k.split('|')[1])).size===scope.districtCount&&inventoryHashes[year]===scope.inventorySha256;
  });
  const countyIdentityMatches=JSON.stringify([...new Set(inventories[2022].map(k=>k.split('|')[0]))].sort())===JSON.stringify([...new Set(inventories[2026].map(k=>k.split('|')[0]))].sort());
  const selectedSourceFilesMatch=[2022,2026].every(year=>selectedFromPinnedHouseFiles((elections[`house-${year}`]?.results||[]).filter(r=>r.geoLevel==='county'&&r.stateFips===state&&!r.special&&['general','gen','g'].includes(String(r.stage||'general').toLowerCase())),proof.pinnedFileHashes||{},year));
  const verified=sourceHashesMatch&&selectedSourceFilesMatch&&sourceProofReviewed&&scopeMatches&&countyIdentityMatches&&proof.countyBoundariesCompatible===true;
  result[state]={...proof,verified,scopeComplete:verified,countComplete:false,sourceHashesMatch,selectedSourceFilesMatch,sourceProofReviewed,scopeMatches,countyIdentityMatches,inventoryHashes,intersectionsByYear:inventories,...(!verified?{reason:proof.reason||'Pinned House source files, reviewed controls or complete per-year county scope changed; renewed qualification required.'}:{})};
 }
 return result;
}

/** Reviewed November-ballot comparisons do not establish runoff or winner outcomes. */
export function senateRoundVectorInventory(rows,selectionUrl=null){
 return [...rows].sort((a,b)=>a.countyFips<b.countyFips?-1:a.countyFips>b.countyFips?1:0).map(r=>[
  r.countyFips,r.stage,Boolean(r.special),r.sourceId,r.sourceIds||[],r.sourceSeatId||null,r.sourceStage||null,r.seatId||null,r.electionDate||null,r.sourceSelection?.url||selectionUrl,
  (r.candidates||[]).map(c=>[c.name,c.party,c.partyOriginal??null,c.votes]).sort((a,b)=>JSON.stringify(a)<JSON.stringify(b)?-1:JSON.stringify(a)>JSON.stringify(b)?1:0),
  r.reportingCategories||[],r.totalVotes??null,...['sourceNeedsReview','sourceTotalConflict','voteTotalMismatch','incomplete','boundaryChanged','boundaryIncompatible','boundaryNote','geographicCoverageNote','suppressElectionWinner'].map(key=>r[key]||false),r.winnerEligible??null,
 ]);
}
function senateScopeComparability(elections,inputHashes,proofs,configuration) {
 const result={},hash=value=>crypto.createHash('sha256').update(value).digest('hex');
 if(!proofs)return result;
 if(proofs.schemaVersion!==1||!Array.isArray(proofs.states))throw Error('Invalid reviewed Senate scope register.');
 const years=Object.keys(configuration.years).map(Number),baselineYear=years[0];
 for(const proof of proofs.states){
  const state=proof.stateFips;
  if(!configuration.states.includes(state)||result[state])throw Error('Duplicate or unsupported Senate scope.');
  const pins=Object.entries(proof.pinnedFileHashes||{});
  const sourceHashesMatch=pins.length>=2&&years.every(year=>pins.some(([file])=>file.endsWith(`senate-${year}.json`)))&&pins.every(([file,digest])=>inputHashes[file]===digest);
  const sourceProofReviewed=typeof proof.id==='string'&&proof.id.trim().length>0&&proof.review?.status==='approved'&&/^\d{4}-\d{2}-\d{2}T/.test(proof.review.reviewedAt||'')&&['evidenceSha256','approvalReceiptSha256'].every(key=>/^[a-f0-9]{64}$/.test(proof.review[key]||''));
  const inventories={},inventoryHashes={};
  const scopeChecks=years.map(year=>{
   const scope=proof.years?.[year],expected=configuration.years[year];
   const rows=(elections[`senate-${year}`]?.results||[]).filter(r=>r.geoLevel==='county'&&r.stateFips===state&&r.special===expected.special&&String(r.stage||'general').toLowerCase()===scope?.stage);
   const actual=rows.map(r=>r.countyFips).sort();inventories[year]=actual;inventoryHashes[year]=hash(JSON.stringify(actual));
   return scope?.scopeComplete===true&&scope?.controlsPassed===true&&scope.candidateControlCount>0&&expected.stages.includes(scope.stage)&&scope.electionDate===expected.date&&(!configuration.requireSpecialDeclaration||scope.special===expected.special)&&scope.expectedCountyCount>0&&Array.isArray(scope.countyFips)&&actual.length===scope.expectedCountyCount&&new Set(actual).size===actual.length&&JSON.stringify(actual)===JSON.stringify([...scope.countyFips].sort())&&inventoryHashes[year]===scope.inventorySha256&&hash(JSON.stringify(senateRoundVectorInventory(rows)))===scope.mergedVectorSha256&&rows.every(r=>r.countyFips?.startsWith(state)&&r.electionDate===expected.date&&r.sourceSeatId===proof.seatId&&(r.sourceStage??null)===(scope.sourceStage??null)&&!r.seatId&&(!r.contestType||r.contestType==='candidate'));
  });
  const scopeMatches=scopeChecks.every(Boolean),countyIdentityMatches=JSON.stringify(inventories[baselineYear])===JSON.stringify(inventories[2026]);
  const seatMatches=proof.seatId===configuration.seatId(state)&&(!configuration.requireSpecialDeclaration||(proof.seatClass===3&&proof.termEndDate==='2029-01-03'&&proof.baselineYear===2022&&proof.currentYear===2026));
  const verified=sourceHashesMatch&&sourceProofReviewed&&scopeMatches&&countyIdentityMatches&&seatMatches&&proof.countyBoundariesCompatible===true;
  result[state]={...proof,verified,baselineYear,currentYear:2026,scopeComplete:verified,countComplete:false,sourceHashesMatch,sourceProofReviewed,scopeMatches,countyIdentityMatches,seatMatches,inventoryHashes,...(!verified?{reason:proof.reason||'Reviewed Senate scope, seat, term, dates or source pins changed; renewed qualification required.'}:{})};
 }
 return result;
}
export function senateRoundComparability(elections,inputHashes,proofs){
 return senateScopeComparability(elections,inputHashes,proofs,{states:['13','22'],seatId:state=>`${state}-senate-class-2`,years:{2020:{date:'2020-11-03',special:false,stages:['general','first round']},2026:{date:'2026-11-03',special:false,stages:['general']}}});
}
export function senateSpecialComparability(elections,inputHashes,proofs){
 return senateScopeComparability(elections,inputHashes,proofs,{states:['12','39'],seatId:state=>`${state}-senate-class-3-term-ending-2029-01-03`,requireSpecialDeclaration:true,years:{2022:{date:'2022-11-08',special:false,stages:['general']},2026:{date:'2026-11-03',special:true,stages:['general']}}});
}

export function buildActualReport({mirrorParties=false}={}) {
  const inputHashes={};
  const read=name=>{const bytes=fs.readFileSync(path.join(root,name));inputHashes[name]=crypto.createHash('sha256').update(bytes).digest('hex');return JSON.parse(bytes);};
  for(const name of ['src/2026-anomalies.js','src/county-data.js','src/source-holds.js','src/coverage-sources.js','scripts/build-2026-anomalies.mjs'])inputHashes[name]=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,name))).digest('hex');
  const atlas=read('node_modules/us-atlas/counties-albers-10m.json');
  const mapCounties=atlas.objects.counties.geometries.map(c=>({fips:String(c.id).padStart(5,'0'),name:c.properties.name}));
  const manifests=COUNTY_SOURCES.map(s=>({...s,manifest:read(`public/data/${s.name}/manifest.json`)}));
  const elections={};
  for(const office of OFFICES)for(const year of [2020,2022,2026]) {
    const name=`public/data/elections/${office}-${year}.json`,base=fs.existsSync(path.join(root,name))?read(name):null,bundles=[],sourceHolds=[];
    for(const source of manifests) {
      sourceHolds.push(...(source.manifest.sourceHolds||[]).filter(h=>h.office===office&&h.year===year));
      for(const url of new Set(source.manifest.coverage.filter(e=>e.office===office&&e.year===year).map(e=>e.url)))bundles.push({...source,url,data:read(`public${url}`)});
    }
    elections[`${office}-${year}`]=mergeElectionData(base,{office,year,supplementBundles:bundles,sourceHolds});
  }
  const population=read('public/data/population/counties.json'),turnout=read('public/data/turnout/counties.json');
  const comparability={senateClass2:{id:'regular-class-2-2020-2026',source:SENATE_CLASS_2_SOURCE,basis:'Official 2021–2027 Class II term; unique general/non-special2020→2026countycontests only. GA/LA November ballot pairs require separate reviewed round contracts.'},montanaHouse:montanaComparability(elections,inputHashes),azHouse:arizonaComparability(elections,inputHashes,manifests.find(s=>s.name==='research-house')?.manifest),houseStates:additionalHouseComparability(elections,inputHashes,fs.existsSync(path.join(root,'public/data/house-comparability/2026.json'))?read('public/data/house-comparability/2026.json'):null),senateRounds:senateRoundComparability(elections,inputHashes,fs.existsSync(path.join(root,'public/data/senate-comparability/2026.json'))?read('public/data/senate-comparability/2026.json'):null),senateSpecials:senateSpecialComparability(elections,inputHashes,fs.existsSync(path.join(root,'public/data/senate-special-comparability/2026.json'))?read('public/data/senate-special-comparability/2026.json'):null)};
  // Counterfactual symmetry checks mirror counts only after validating real source contracts.
  if(mirrorParties)for(const data of Object.values(elections))for(const row of data?.results||[])for(const c of row.candidates||[])c.party=c.party==='Democrat'?'Republican':c.party==='Republican'?'Democrat':c.party;
  return buildPatternReview({mapCounties,population,turnout,elections,inputHashes,comparability});
}
export function renderPatternReport(report) {
  let md='# 2026 county pattern review\n\nSnapshot audit: November 7, 2026. Schema '+report.schemaVersion+'. All '+report.mapCountyCount+' atlas counties have explicit assessed/not-assessed statuses. Borders flag provisional changes for review, never fraud, errors, race calls or certified outcomes. Missing coverage alone never causes a border.\n\n## Own-history review rules\n\nThese transparent thresholds are application screening choices. They are not probability estimates and were changed at the user’s request to highlight substantial own-county changes even when similar changes occur statewide. Each criterion independently triggers a review; no state-peer outlier test can veto it. Democratic and Republican rules, increases and decreases are symmetric. A numerical tolerance of1e-10 handles inclusive boundaries.\n\n- **A — Party counts:** absolute count change ≥40%, absolute opposing-party change ≤15%, and absolute own-party count difference ≥100. Require at least500 two-party votes in both years and100 votes for each prior party. Democratic gains/Republican losses point Democratic; Republican gains/Democratic losses point Republican.\n- **B — Reported race votes:** absolute change ≥40% and ≥100 votes; at least500 reported candidate/write-in race votes each year. Sum supplied candidate vectors and explicitly classified separate write-ins. Exclude overvotes, undervotes, invalid/blank/spoiled/exhausted categories and reported ballot totals. Withhold unknown or unitemized categories rather than guess their meaning. Never call these totals ballots or turnout.\n- **C1 — Actual ballots per resident:** absolute own-history change ≥10 percentage points, at least100 explicitly reported ballots and1,000 residents each year. Current2026 ballots use exact2025 Census population; historical2022 ballots use exact2022 population and a final/certified historical ballot record. No peer minimum. Candidate votes never substitute for ballots.\n- **C2 — Race votes per resident:** absolute change ≥10pp in qualified candidate/write-in race votes per100 residents, using exact2025 population for2026 and exact baseline-year population for the prior contest. Race minimums above and at least1,000 residents each year. This is explicitly a **race-vote proxy**, never actual ballots or eligible-voter turnout.\n- **D — Party share:** absolute own-county Democratic/Republican two-party-share swing ≥10pp, with the same party minimums asA. Other votes stay unassigned.\n\nAll resident measures include children and other people ineligible to vote. No ACS data is used. Reporting progress, candidate differences and election-cycle differences limit interpretation. In particular, Senate2020 was a presidential election year while2026 is a midterm; broad race-vote/population differences can reflect that normal cycle distinction. The snapshot may be incomplete even when all precincts are marked reported.\n\n## Qualified comparison scopes and holds\n\nGovernor uses a fixed2022→2026 comparison, including states with two-year terms; this is not labeled the immediately previous election. Senate uses [official Class II seat/term identity](https://www.senate.gov/senators/Class_II.htm) plus unique regular/general/non-special2020→2026 county contests. Separately reviewed Florida/Ohio Class III contracts compare the November8,2022 regular election with the November3,2026 special election for the same term ending January3,2029; they never substitute a2020baseline. Georgia/Louisiana November-ballot rounds require separate source-pinned, reviewed contracts; all unqualified rounds and special-seat scopes remain withheld. There is no2026 presidential election.\n\nHouse is qualified for two separately frozen scope proofs: Montana57 county-district intersections across56 counties, and Arizona30 intersections across15 counties/all9districts, each in both2022/2026. Every published portion is summed countywide; district summaries are never allocated to counties. Exact inventories/source hashes are in `comparabilityContracts.montanaHouse` and `.azHouse`; changes disable the affected qualification. Scope completeness is not counting completion. The baseline was checked against separate MEDSL district returns, not an independently downloaded FEC canvass. Source: [Montana official statewide export](https://electionresults.mt.gov/ResultsExport.aspx), provisional. Arizona sources are the official2026export and certified2022canvass saved as primary-PDF web-text extraction (not PDF bytes, direct request403);75candidate/write-in controls passed. Arizona2026scope is complete, counting is not declared complete. New registered Alabama/Nebraska Senate sources retain exact ballot party labels; Nebraska has no Democratic nominee and is not reassigned. Alabama2020Perry’s unknown write-in dash remains held. The separately reviewed current New Mexico source is registered with its own dated controls and provisional status. Additional states may qualify only through separately approved, source-hash-pinned contracts in `comparabilityContracts.houseStates`, with complete per-year inventories and candidate controls. District intersections may differ between years only when each inventory independently covers the same county geography. Boundary changes, candidate lineups and uncontested races limit interpretation; the countywide sum is not a matched-candidate causal comparison. Other House scope remains unqualified until separately proved.\n\nSource holds, missing/null/nonintegral counts, explicit incomplete coverage, incompatible boundaries/jurisdictions, unmatched rounds and provisional historical baselines remain excluded. Party screens also withhold unitemized candidates or unclassified categories. Race-total screens can assess a valid race with no Democratic nominee without assigning Other votes to Democrat. A known ballot-accounting category is excluded from race totals; an unknown category withholds the total. Update/retrieval/as-of timestamps remain separate; unknown update time stays null.\n\n## Peer context is not a border rule\n\nLegacy `shareShift` and `partyGrowth` retain the advanced symmetric peer screens as context, including medians, MAD and modifiedz. They are excluded from the border flag union. [NIST/SEMATECH]('+report.method.url+') describes the exploratory modified-z method:0.6745×(value−median)/MAD. At MAD0 z is null and prior absolute guards remain only in the context screens. These statistics are neither calibrated probabilities nor prerequisites forA–D.\n\n## Coverage and findings\n\n| Screen | Office | Assessed | Not assessed | Flagged counties |\n|---|---|---:|---:|---:|\n';
  const row=(label,office,a)=>`| ${label} | ${office} | ${a.assessed} | ${a.notAssessed} | ${a.flagged} |\n`;
  md+=row('Actual ballots/residents','global',report.summary.participation);
  for(const [screen,offices] of Object.entries(report.summary.reviewScreens))for(const office of OFFICES)md+=row(screen,office,offices[office]);
  for(const office of OFFICES)md+=row('Own-history union',office,report.summary.offices[office]);
  for(const contract of [...Object.values(report.comparabilityContracts.senateRounds||{}),...Object.values(report.comparabilityContracts.senateSpecials||{})].filter(c=>c.verified)){md+='\n### Reviewed Senate seat/ballot scope: '+contract.stateFips+'\n\n'+contract.basis+'\n\n';for(const limit of contract.limitations||[])md+='- '+limit+'\n';}
  md+='\n## State-broad party context\n\nThese totals use only qualified party-comparison counties, not necessarily complete states. Percent changes are weighted count changes; county medians are unweighted. Shared statewide change is visible here and is never removed from the own-history flags. All2026 counts remain provisional.\n\n| Office | State FIPS | Qualified counties | D count change % | R count change % | County median D % | County median R % | Union flagged counties |\n|---|---|---:|---:|---:|---:|---:|---:|\n';
  for(const [office,states] of Object.entries(report.stateContext))for(const [state,a] of Object.entries(states))md+=`| ${office} | ${state} | ${a.qualifiedCountyCount} | ${a.democratCountChangePercent} | ${a.republicanCountChangePercent} | ${a.countyMedianDemocratChangePercent} | ${a.countyMedianRepublicanChangePercent} | ${a.flaggedCountyCount} |\n`;
  md+='\n## Webb control, without a county exception\n\n';
  const webb=report.counties['48479'].offices.governor,e=webb.evidence;
  md+=`Webb D${e.priorDemocratVotes}→${e.currentDemocratVotes} (${e.democratCountChangePercent}%), R${e.priorRepublicanVotes}→${e.currentRepublicanVotes} (${e.republicanCountChangePercent}%). RuleAflags it because the same40%/15%/100-vote criteria apply everywhere; no peer veto or Webb override exists. Its old advanced peer-growth result remains context. Source update time is${e.currentSource.sourceUpdatedAt===null?'unknown':e.currentSource.sourceUpdatedAt}; retrieval is${e.currentSource.retrievedAt||e.currentSource.asOf}. Retrieval is not a count-update or completion claim.\n\n`;
  md+='## Not-assessed reasons\n\n';
  for(const [label,a] of [['Actual ballots/residents',report.summary.participation],...Object.entries(report.summary.reviewScreens).flatMap(([screen,offices])=>OFFICES.map(o=>[`${o}: ${screen}`,offices[o]]))]){md+=`### ${label}\n\n`;for(const [reason,n] of Object.entries(a.reasons).sort((a,b)=>b[1]-a[1]))md+=`- ${n}: ${reason}\n`;md+='\n';}
  md+='## Flag index and evidence\n\nFull exact current/prior counts, own changes, peer context, source dates, inclusion/exclusion categories, source IDs/URLs and qualification contracts are retained in [anomalies-2026.json](https://voteranomaly.com/data/anomalies-2026.json). This index lists every triggered rule; one county may trigger several. Neutral count/ratio flags never acquire a party direction. Conflicting party directions return `mixed`.\n\n| County FIPS | County | Office | Rule | Direction | Change evidence | Source IDs |\n|---|---|---|---|---|---|---|\n';
  for(const [fips,c] of Object.entries(report.counties))for(const [office,a] of [['global',c.participation],...Object.entries(c.offices)])for(const f of a.flags){const e=f.evidence,change=f.id.endsWith('party-count-change')?`${e.growthParty}: ${e.ownCountChangePercent}%; opponent ${e.opposingCountChangePercent}%`:f.id.endsWith('share-swing')?`D share ${e.democratShareChangePp}pp`:f.id.endsWith('race-vote-change')?`${e.priorRaceVotes}→${e.currentRaceVotes}; ${e.raceVoteCountChangePercent}%`:f.id.endsWith('race-population-change')?`${e.raceVotesPerResidentChangePp}pp`:`${e.ownChangePp}pp`;md+=`| ${fips} | ${c.name} | ${office} | ${f.id} | ${e.direction||'neutral'} | ${change} | ${f.sources.map(s=>s.sourceId||s.title).join('; ')} |\n`;}
  md+='\n## Sources and reproduction\n\n';
  const urls=new Map();for(const c of Object.values(report.counties))for(const a of [c.participation,...Object.values(c.offices)])for(const f of a.flags)for(const source of f.sources)urls.set(source.url,source.title);
  for(const [url,title] of urls)md+=`- [${title}](${url})\n`;
  md+='\nRun `node scripts/build-2026-anomalies.mjs` then `node scripts/verify-2026-anomalies.mjs`. Existing local source snapshots are merged through COUNTY_SOURCES/mergeElectionData, retaining all precedence and holds. No network/provider calls occur. Input hashes include engine/builder/merged source inputs. Identical inputs produce deterministic JSON and identical Markdown copies. Schema3 keeps office.evidence and advanced context for compatibility, exposes separate office.reviewScreens statuses/flags/evidence, and makes office.flags the union ofA/B/C2/D only. Global participation addsC1 through reviewForCounty. Summary counts exist separately for every screen. Absence never becomes zero.\n';
  return md;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  // A fresh checkout omits this large derived artifact; verification still compares
  // an existing artifact against a complete independent rebuild below.
  if(process.argv.includes('--ensure')&&fs.existsSync(path.join(root,'public/data/anomalies-2026.json'))) {
    console.log(JSON.stringify({status:'present',artifact:'public/data/anomalies-2026.json'}));
  } else {
  const report=buildActualReport();fs.writeFileSync(path.join(root,'public/data/anomalies-2026.json'),JSON.stringify(report)+'\n');
  if(!process.argv.includes('--ensure')){const md=renderPatternReport(report);for(const name of ['PATTERN-REVIEW.md','public/PATTERN-REVIEW.md'])fs.writeFileSync(path.join(root,name),md);}
  console.log(JSON.stringify({mapCountyCount:report.mapCountyCount,summary:report.summary,...(!process.argv.includes('--quiet')?{flags:Object.entries(report.counties).flatMap(([fips,c])=>[['participation',c.participation],...Object.entries(c.offices)].flatMap(([screen,a])=>a.flags.map(f=>({fips,county:c.name,screen,label:f.label,evidence:f.evidence}))))}:{})},null,2));
  }
}
