import fs from 'node:fs';import assert from 'node:assert/strict';import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {prerenderWinners} from './prerender-winners.mjs';
import {renderCandidateCard,escapeHtml,groupedCandidates} from '../src/winner-render.js';
import {orderCandidates} from '../src/winner-record.js';
import {profileUrl,profileId} from '../src/candidate-profile-data.js';
const root=fileURLToPath(new URL('../',import.meta.url)),bytes=fs.readFileSync(root+'public/data/winners/2026.json'),data=JSON.parse(bytes);
const cards=JSON.parse(fs.readFileSync(root+'public/data/candidates/profile-cards-2026.json')).profiles;
const expected=groupedCandidates(orderCandidates(data.results.filter(r=>r.leader))).flatMap(g=>g.rows);
function verify(html,base){
 assert.ok(!html.includes('<!--vmap:'));assert.ok(html.includes('data-prerender-sha="'+crypto.createHash('sha256').update(bytes).digest('hex')+'"'));
 const keys=[...html.matchAll(/data-contest-key="([^"]+)"/g)].map(m=>m[1]);
 assert.deepEqual(keys,expected.map(r=>escapeHtml(r.key)),'Every qualified leader appears exactly once in its office list.');
 for(const office of ['governor','house','senate'])assert.ok(html.includes(`id="office-${office}"`),'Missing separate office list');
 for(const row of expected){const profile=cards.find(p=>p.id===profileId(row,2026));assert.ok(html.includes(escapeHtml(profile.displayName)));assert.ok(html.includes(escapeHtml(row.status)));assert.ok(html.includes(escapeHtml(profileUrl(row,{year:2026,base}))));}
 assert.ok(html.includes(`${data.counts.heldOrTied} held/tied races`));assert.ok(!/<h3>undefined|<h3>null/.test(html));
}
const template=fs.readFileSync(root+'winners/index.html','utf8');
for(const base of ['/','/vmap/'])verify(prerenderWinners(template,{base}),base);
const unsafe=renderCandidateCard({...expected[0],leader:{...expected[0].leader,name:'<script>"&</script>'},sourceLinks:['javascript:alert(1)','https://example.org/?a=1&b=2']},{year:2026,base:'/'});
assert.ok(!unsafe.includes('<script>'));assert.ok(!unsafe.includes('javascript:'));assert.ok(unsafe.includes('&lt;script&gt;'));assert.ok(unsafe.includes('?a=1&amp;b=2'));
if(process.argv.includes('--require-artifacts'))for(const [directory,base] of [['dist','/vmap/'],['dist-domain','/']])verify(fs.readFileSync(root+directory+'/winners/index.html','utf8'),base);
console.log(JSON.stringify({status:'passed',initialHtmlLeaders:expected.length,separateOfficeLists:3,heldCount:data.counts.heldOrTied,escapeGuards:true,artifactsChecked:process.argv.includes('--require-artifacts')}));
