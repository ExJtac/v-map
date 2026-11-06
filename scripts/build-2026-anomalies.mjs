import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {COUNTY_SOURCES} from '../src/coverage-sources.js';
import {mergeElectionData} from '../src/county-data.js';
import {buildPatternReview,OFFICES} from '../src/2026-anomalies.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export function buildActualReport() {
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
  return buildPatternReview({mapCounties,population,turnout,elections,inputHashes});
}
export function renderPatternReport(report) {
  let md='# 2026 county pattern review\n\nSnapshot audit: November 6, 2026. Every one of the '+report.mapCountyCount+' counties in the map atlas receives an explicit screen status. Dark purple borders indicate unusual shifts toward Democrats relative to state peers; dark green borders indicate unusual shifts toward Republicans. Participation-only patterns use dashed slate borders. All review borders indicate **provisional exploratory review**, never a fraud finding, error determination or certified election outcome. Missing or unassessed data alone never produces a review border.\n\n';
  md+='## Criteria\n\nParticipation uses actual countywide reported ballots divided by **all residents**, including children. It is not eligible-voter turnout. Current ballots use 2025 Census population; the county’s own 2022 baseline uses 2022 population. At least 100 reported ballots, 1,000 residents and 10 other eligible same-state peers are required. A flag requires absolute peer distance ≥10 percentage points and |modified z| >3.5, plus an own-county historical difference ≥10pp. If MAD is zero, the ≥10pp absolute-distance guard applies and z is explicitly null. Peers exclude the county itself.\n\nParty screening uses Democratic two-party-share change from the same county’s matching regular Governor contest in 2022 to 2026. This is a fixed four-year comparison, including states such as Vermont and New Hampshire with two-year terms; it does not claim to compare only the immediately previous election. Both years need ≥500 two-party votes and each prior party ≥100 votes. Same-state peer changes need at least 10 other eligible counties. A flag needs |own shift| ≥10pp, |shift minus peer median| ≥10pp, and |modified z| >3.5 (same MAD-zero guard). Swapping all Republican and Democratic counts produces an equal, opposite result. Actual counts and both party changes remain in evidence. Other votes are never reassigned to a party.\n\nSenate requires explicit matching seat identity and a 2020 six-year baseline; House requires proven complete county-district coverage and compatible boundaries. Unproven House comparisons are withheld. There is no 2026 presidential election. Source holds, incomplete/null records, unknown candidate aggregates, incompatible jurisdictions/boundaries and provisional historical baselines prevent comparison. A 100% precinct-reporting value is never treated as completion or certification. All current screens remain provisional and may reflect uneven reporting progress. Source update, retrieval and snapshot times remain separate: a fetch time is never relabeled as a count-update time, and an unavailable update time stays null. No ACS data is used.\n\nThe [NIST/SEMATECH exploratory reference]('+report.method.url+') supplies the conventional modified-z formula and 3.5 threshold. The 10pp/minimum-size/historical gates are conservative application choices, not calibrated error probabilities. Thousands of screens, changing candidates, demographic composition, source timing and county differences limit causal interpretation. A flag is an invitation to inspect sources.\n\n';
  md+='## Actual screen coverage\n\n| Screen | Assessed | Not assessed | Flagged counties |\n|---|---:|---:|---:|\n';
  for(const [name,s] of [['Actual ballots / residents',report.summary.participation],...Object.entries(report.summary.offices)])md+=`| ${name} | ${s.assessed} | ${s.notAssessed} | ${s.flagged} |\n`;
  md+='\nParticipation is a global county screen that can be displayed alongside each office. Office-specific assessed counts above remain separate. `reviewForCounty` combines the two and reports their individual statuses; no office-specific assessment is implied by an available participation check.\n\n## Reasons a screen was not assessed\n\n';
  for(const [name,s] of [['Participation',report.summary.participation],...Object.entries(report.summary.offices)]){md+=`### ${name}\n\n`;for(const [reason,n] of Object.entries(s.reasons).sort((a,b)=>b[1]-a[1]))md+=`- ${n}: ${reason}\n`;md+='\n';}
  md+='## Actual flags\n\n';let flags=0;
  for(const [fips,c] of Object.entries(report.counties))for(const [screen,a] of [['participation',c.participation],...Object.entries(c.offices)])for(const flag of a.flags){flags++;md+=`### ${c.name} (${fips}) — ${screen}\n\n${flag.label}. ${flag.description}\n\nEvidence:\n\n\`\`\`json\n${JSON.stringify(flag.evidence,null,2)}\n\`\`\`\n\nSources: ${flag.sources.map(s=>`[${s.title}](${s.url})`).join('; ')}.\n\n`;}
  if(!flags)md+='No source-backed records met every flag criterion. This does not establish that all unflagged or unassessed results are complete, typical or correct.\n\n';
  md+='## Reproduction and source integrity\n\nRun `node scripts/build-2026-anomalies.mjs` and `node scripts/verify-2026-anomalies.mjs`. The audit uses existing local snapshots only, with `COUNTY_SOURCES` and `mergeElectionData` retaining source precedence, semantic contest identity and review holds. No new network, provider or paid API calls are made. `public/data/anomalies-2026.json` records every atlas county, assessed evidence, selected source IDs/dates, references, criteria and SHA-256 hashes for every loaded input. No candidate total is substituted for ballots, no absent count becomes zero, and no review finding is fabricated. The report is deterministic for identical inputs.\n';
  return md;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const report=buildActualReport();fs.writeFileSync(path.join(root,'public/data/anomalies-2026.json'),JSON.stringify(report)+'\n');
  const md=renderPatternReport(report);for(const name of ['PATTERN-REVIEW.md','public/PATTERN-REVIEW.md'])fs.writeFileSync(path.join(root,name),md);
  console.log(JSON.stringify({mapCountyCount:report.mapCountyCount,summary:report.summary,flags:Object.entries(report.counties).flatMap(([fips,c])=>[['participation',c.participation],...Object.entries(c.offices)].flatMap(([screen,a])=>a.flags.map(f=>({fips,county:c.name,screen,label:f.label,evidence:f.evidence}))))},null,2));
}
