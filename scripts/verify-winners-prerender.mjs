import fs from 'node:fs';import assert from 'node:assert/strict';import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {prerenderWinners} from './prerender-winners.mjs';
import {renderCandidateCard,escapeHtml} from '../src/winner-render.js';
import {orderCandidates} from '../src/winner-record.js';
const root=fileURLToPath(new URL('../',import.meta.url)),bytes=fs.readFileSync(root+'public/data/winners/2026.json'),data=JSON.parse(bytes);
const expected=orderCandidates(data.results.filter(r=>r.leader));
function verify(html,base){
 assert.ok(!html.includes('<!--vmap:'));assert.ok(html.includes('data-prerender-sha="'+crypto.createHash('sha256').update(bytes).digest('hex')+'"'));
 const keys=[...html.matchAll(/data-contest-key="([^"]+)"/g)].map(m=>m[1]);
 assert.deepEqual(keys,expected.map(r=>escapeHtml(r.key)),'Initial HTML must contain every qualified leader exactly once, in order.');
 for(const row of expected){assert.ok(html.includes(escapeHtml(row.leader.name)));assert.ok(html.includes(escapeHtml(row.status)));assert.ok(html.includes(escapeHtml(base+'?office='+row.office+'&year=2026&state='+row.stateFips)));}
 assert.ok(html.includes(`${data.counts.heldOrTied} held/tied races`));
 assert.ok(!/<h3>undefined|<h3>null/.test(html));
}
const template=fs.readFileSync(root+'winners/index.html','utf8');
for(const base of ['/','/vmap/'])verify(prerenderWinners(template,{base}),base);
const unsafe=renderCandidateCard({...expected[0],leader:{...expected[0].leader,name:'<script>"&</script>'},sourceLinks:['javascript:alert(1)','https://example.org/?a=1&b=2']},{year:2026,base:'/'});
assert.ok(!unsafe.includes('<script>'));assert.ok(!unsafe.includes('javascript:'));assert.ok(unsafe.includes('&lt;script&gt;'));assert.ok(unsafe.includes('?a=1&amp;b=2'));
if(process.argv.includes('--require-artifacts'))for(const [directory,base] of [['dist','/vmap/'],['dist-domain','/']])verify(fs.readFileSync(root+directory+'/winners/index.html','utf8'),base);
console.log(JSON.stringify({status:'passed',initialHtmlLeaders:expected.length,heldCount:data.counts.heldOrTied,escapeGuards:true,artifactsChecked:process.argv.includes('--require-artifacts')}));
