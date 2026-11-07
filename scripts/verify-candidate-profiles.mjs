import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
import {buildCandidateProfiles} from './build-candidate-profiles.mjs';
import {profileId,profilePath,profileFromElection,profileUrl} from '../src/candidate-profile-data.js';
import {renderPersonProfile,escapeProfileHtml} from '../src/person-profile-render.js';
import {renderProfileDocument} from './prerender-profiles.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));const file='public/data/candidates/profiles-2026.json',bytes=fs.readFileSync(path.join(root,file)),data=JSON.parse(bytes),hash=crypto.createHash('sha256').update(bytes).digest('hex');
assert.deepEqual(data,buildCandidateProfiles().data,'Profile inventory must reproduce from exact source snapshots.');
assert.equal(data.profiles.length,330);assert.equal(new Set(data.profiles.map(p=>p.path)).size,330);assert.equal(data.profiles.filter(p=>p.accountability).length,12);
const template=fs.readFileSync(path.join(root,'people/index.html'),'utf8');
for(const base of ['/','/vmap/'])for(const profile of data.profiles){
 const html=renderProfileDocument(template,profile,{base,sourceHash:hash,snapshotDate:data.snapshotDate,updatedAt:data.updatedAt});
 assert.ok(html.includes(`data-profile-id="${profile.id}"`));assert.ok(html.includes(escapeProfileHtml(profile.displayName)));assert.ok(html.includes(escapeProfileHtml(profile.reportedName))||profile.reportedName===profile.displayName);
 assert.equal(profile.id,profileId(profile.election,2026));assert.equal(profile.path,profilePath(profile.election,2026));assert.ok(html.includes(`href="${base}winners/?year=2026&amp;office=${profile.election.office}#office-${profile.election.office}"`));
 assert.ok(html.includes(`https://voteranomaly.com/${profile.path}`));
 if(profile.portrait){assert.ok(html.includes(base+profile.portrait.src));assert.ok(html.includes(escapeProfileHtml(profile.portrait.attribution)));const image=fs.readFileSync(path.join(root,'public',profile.portrait.src));assert.ok(image.length>100);if(profile.portrait.sha256)assert.equal(crypto.createHash('sha256').update(image).digest('hex'),profile.portrait.sha256);}
 else assert.ok(html.includes('Photo not sourced'));
 for(const s of profile.accountability?.statements||[])assert.ok(html.includes(escapeProfileHtml(s.id)));
 for(const a of profile.accountability?.actions||[])if(a.scopeException)assert.ok(html.includes(escapeProfileHtml(a.scopeException.assessmentUse)));
 assert.ok(!/undefined|\[object Object\]|NaN/.test(html));
}
const historical=JSON.parse(fs.readFileSync(path.join(root,'public/data/winners/2024.json'))).results.find(r=>r.leader);
const h=profileFromElection(historical,2024);assert.equal(h.accountability,null);assert.equal(h.portrait,null);assert.ok(profileUrl(historical,{year:2024,base:'/vmap/'}).startsWith('/vmap/people/?year=2024&contest='));
const malicious=structuredClone(data.profiles[0]);malicious.displayName='<script>alert(1)</script>';
assert.ok(!renderPersonProfile(malicious).includes('<script>alert'));
const artifacts=[];if(process.argv.includes('--require-artifacts'))for(const directory of ['dist','dist-domain']){
 for(const profile of data.profiles){const html=fs.readFileSync(path.join(root,directory,profile.path,'index.html'),'utf8');assert.ok(html.includes(hash));assert.ok(html.includes(`data-profile-id="${profile.id}"`));}
 artifacts.push(directory);
}
console.log(JSON.stringify({status:'passed',...data.counts,sourceHash:hash,historicalIdentityIsolation:true,sourceEvidenceRetained:true,artifacts}));
