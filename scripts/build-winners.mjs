/** Reconcile existing imports; no network, race calls, or county allocation. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {COUNTY_SOURCES} from '../src/coverage-sources.js';
import {mergeElectionData} from '../src/county-data.js';
import {candidateRecord, orderCandidates, OFFICE_ORDER} from '../src/winner-record.js';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));
export function buildWinners() {
  const manifests = COUNTY_SOURCES.map(source => ({...source, manifest:read(`public/data/${source.name}/manifest.json`)}));
  const states = Object.fromEntries(read('node_modules/us-atlas/states-albers-10m.json').objects.states.geometries.map(g => [g.id,g.properties.name]));
  const snapshotDate = read('public/data/elections/manifest.json').snapshotDate;
  const outputs = {}, years = [];
  for(let year=2026;year>=2006;year--) {
    const rows = [];
    for(const office of OFFICE_ORDER) {
      const baseFile=`public/data/elections/${office}-${year}.json`;
      const base=fs.existsSync(path.join(root,baseFile)) ? read(baseFile) : null;
      const bundles=manifests.flatMap(source => [...new Set(source.manifest.coverage.filter(e=>e.office===office && e.year===year).map(e=>e.url))].map(url=>({...source,url,data:read('public'+url)})));
      if(!base && !bundles.length)continue;
      const sourceHolds=manifests.flatMap(source=>source.manifest.sourceHolds||[]).filter(h=>h.office===office && h.year===year);
      const data=mergeElectionData(base,{office,year,supplementBundles:bundles,sourceHolds});
      for(const result of data.results) {
        const row=candidateRecord(result,{office,year,sources:data.sources});
        if(row){row.state=states[row.stateFips]||row.state; rows.push(row);}
      }
    }
    if(!rows.length)continue;
    assert.equal(new Set(rows.map(r=>r.key)).size,rows.length,`Duplicate election identity in ${year}`);
    const counts={races:rows.length,leaders:rows.filter(r=>r.leader).length,heldOrTied:rows.filter(r=>!r.leader).length};
    outputs[`public/data/winners/${year}.json`]=JSON.stringify({schemaVersion:1,year,snapshotDate,counts,results:orderCandidates(rows)})+'\n';
    years.push({year,url:`/data/winners/${year}.json`,...counts});
  }
  outputs['public/data/winners/manifest.json']=JSON.stringify({schemaVersion:1,snapshotDate,years,officeOrder:OFFICE_ORDER})+'\n';
  return {outputs,years};
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const {outputs,years}=buildWinners(),check=process.argv.includes('--check');
  for(const [file,body] of Object.entries(outputs)) {
    if(check)assert.equal(fs.readFileSync(path.join(root,file),'utf8'),body,`Stale candidates directory: ${file}`);
    else {fs.mkdirSync(path.dirname(path.join(root,file)),{recursive:true});fs.writeFileSync(path.join(root,file),body);}
  }
  console.log(JSON.stringify({status:check?'verified':'generated',years:years.length,current:years[0]}));
}
