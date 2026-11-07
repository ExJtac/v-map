/** Reproducible work inventory: numerical screens and source-context reviews stay separate. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
export function buildResearchProgress(){
 const inputs={};const read=file=>{const b=fs.readFileSync(path.join(root,file));inputs[file]=hash(b);return JSON.parse(b);};
 const audit=read('public/data/anomalies-2026.json'),sources=read('public/data/county-reviews/2026.json');
 const atlas=read('node_modules/us-atlas/counties-albers-10m.json');
 const names=new Map(atlas.objects.states.geometries.map(s=>[String(s.id).padStart(2,'0'),s.properties.name]));
 const scopeFile='public/data/congress-scope-2026.json';const scope=fs.existsSync(path.join(root,scopeFile))?read(scopeFile):null;
 const offices=['house','senate'];
 const summaries={};const states=[];const queue=[];
 const tally=(rows,office)=>{
  const records=rows.map(([f,c])=>[f,c.offices[office]]),flagged=records.filter(([f,a])=>a.flags.length);
  const context=rows.filter(([f,c])=>sources.cases.some(r=>r.fips===f&&r.office===office));
  const reasons={};for(const [f,a]of records)if(a.status!=='assessed')reasons[a.reason]=(reasons[a.reason]||0)+1;
  const proxyOnly=flagged.filter(([f,a])=>a.flags.every(flag=>flag.id===office+'-race-population-change'));
  return {referenceCounties:rows.length,numericallyAssessed:records.filter(([f,a])=>a.status==='assessed').length,notAssessed:records.filter(([f,a])=>a.status!=='assessed').length,flaggedCounties:flagged.length,proxyOnlyFlaggedCounties:proxyOnly.length,publishedSourceContextCases:context.length,flaggedWithSourceContext:flagged.filter(([f])=>context.some(([cf])=>cf===f)).length,completedInvestigations:0,screenCoverage:Object.fromEntries(['partyCountChange','shareSwing','raceVoteChange','racePopulationChange'].map(screen=>[screen,{assessed:records.filter(([f,a])=>a.reviewScreens?.[screen]?.status==='assessed').length,flagged:records.filter(([f,a])=>a.reviewScreens?.[screen]?.flags?.length).length}])),notAssessedReasons:reasons};
 };
 const countyRows=Object.entries(audit.counties);
 for(const office of offices){summaries[office]=tally(countyRows,office);summaries[office].referenceUnitsInElectionScope=scope?.states?.reduce((n,s)=>n+s[office].referenceUnitsInScope,0)??null;summaries[office].referenceUnitsOutsideElectionScope=scope?audit.mapCountyCount-summaries[office].referenceUnitsInElectionScope:null;}
 for(const [stateFips,name]of [...names].sort((a,b)=>a[1].localeCompare(b[1]))){
  const counties=countyRows.filter(([f,c])=>c.stateFips===stateFips);if(!counties.length)continue;
  const jurisdiction=scope?.states?.find(s=>s.stateFips===stateFips)||null;
  const row={stateFips,state:name,scope:jurisdiction,offices:{}};
  for(const office of offices)row.offices[office]=tally(counties,office);
  states.push(row);
 }
 for(const [f,c]of countyRows)for(const office of offices){
  const a=c.offices[office];if(!a.flags.length)continue;
  const hasContext=sources.cases.some(r=>r.fips===f&&r.office===office);
  queue.push({fips:f,county:c.name,stateFips:c.stateFips,state:names.get(c.stateFips),office,flagIds:a.flags.map(flag=>flag.id),sourceContext:hasContext?'published_context_only':'not_reviewed',investigationStatus:'unresolved',priority:a.flags.some(flag=>/party-count-change|share-swing/.test(flag.id))?'party_pattern_review':'race_total_or_population_review'});
 }
 queue.sort((a,b)=>a.priority.localeCompare(b.priority)||a.state.localeCompare(b.state)||a.county.localeCompare(b.county)||a.office.localeCompare(b.office));
 for(const office of offices){const a=summaries[office];assert.equal(a.numericallyAssessed+a.notAssessed,audit.mapCountyCount);assert.equal(a.flaggedCounties,queue.filter(q=>q.office===office).length);}
 return {schemaVersion:1,electionYear:2026,auditDate:audit.auditDate,status:'incomplete',explanation:'Numerical screening, source context and resolved investigations are separate stages. Context reports do not close a case or establish wrongdoing. Missing comparisons remain unavailable.',inputHashes:inputs,offices:summaries,states,flaggedReviewQueue:queue};
}
const file=path.join(root,'public/data/research-progress-2026.json');
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const result=buildResearchProgress(),bytes=JSON.stringify(result,null,2)+'\n';
 if(process.argv.includes('--check'))assert.equal(fs.readFileSync(file,'utf8'),bytes,'Stale research work inventory');else fs.writeFileSync(file,bytes);
 console.log(JSON.stringify({status:process.argv.includes('--check')?'verified':'generated',completion:result.status,offices:result.offices,states:result.states.length,queued:result.flaggedReviewQueue.length}));
}
