/** Source, publication and packaged HTML guards for the manual accountability pilot. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {validateAccountability} from '../src/accountability-data.js';
import {renderAccountability,escapeAccountabilityHtml} from '../src/accountability-render.js';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const relative='data/candidates/pilot-2026.json';
const bytes=fs.readFileSync(path.join(root,'public',relative));
const data=JSON.parse(bytes),counts=validateAccountability(data);
const sourceHash=crypto.createHash('sha256').update(bytes).digest('hex');
const rejected=change=>{const next=structuredClone(data);change(next);assert.throws(()=>validateAccountability(next));};
rejected(d=>d.subjects[0].id=d.subjects[1].id);
rejected(d=>d.review.status='not_reviewed');
rejected(d=>{d.subjects[0].outcome.status='winner_certified';delete d.subjects[0].outcome.officialNamedOutcomeVerified;});
const withStatement=data.subjects.findIndex(s=>s.statements.length);
assert.ok(withStatement>=0,'At least one verified original statement is required.');
rejected(d=>d.subjects[withStatement].statements[0].verified=false);
rejected(d=>{const s=d.subjects[withStatement].statements[0];s.phase='after_election';s.date=null;});
rejected(d=>d.subjects[withStatement].statements[0].sourceUrl='javascript:alert(1)');
rejected(d=>d.subjects[withStatement].statements[0].quote=Array(26).fill('word').join(' '));
rejected(d=>d.subjects[withStatement].identity.status='held');
rejected(d=>d.coverage.statements++);

for(const base of ['/','/vmap/']){
  const html=renderAccountability(data,{base});
  for(const person of data.subjects)assert.ok(html.includes(person.id),`Missing ${person.id}`);
  assert.ok(/full original source/i.test(html),'Full original source links must be available.');
  for(const person of data.subjects)for(const statement of person.statements)assert.ok(html.includes(statement.fullSourceUrl.replaceAll('&','&amp;')),'Original source omitted');
  for(const person of data.subjects)for(const action of person.actions)if(action.scopeException){
    for(const key of ['reason','exactDateUncertainty','assessmentUse'])assert.ok(html.includes(escapeAccountabilityHtml(action.scopeException[key])),'Historical scope limit not visible: '+key);
  }
  assert.ok(!/undefined|\[object Object\]|NaN/.test(html));
}
const malicious=structuredClone(data);malicious.subjects[withStatement].name='<script>alert("x")</script>';
malicious.subjects[withStatement].statements[0].quote='<img src=x onerror=alert(1)>';
malicious.subjects[withStatement].statements[0].fullSourceUrl='javascript:alert(1)';
const escaped=renderAccountability(malicious,{base:'/'});
assert.ok(!escaped.includes('<script>alert')&&!escaped.includes('<img src=x')&&!escaped.includes('href="javascript:'),'Unsafe evidence rendering');

const artifacts=[];
if(process.argv.includes('--require-artifacts'))for(const folder of ['dist','dist-domain']){
  const artifact=fs.readFileSync(path.join(root,folder,'accountability/index.html'),'utf8');
  assert.equal(fs.readFileSync(path.join(root,folder,relative),'utf8'),bytes.toString(),'Packaged candidate data changed');
  for(const person of data.subjects)assert.ok(artifact.includes(person.id),`No-JS HTML omitted ${person.id}`);
  assert.ok(artifact.includes(sourceHash),'Initial HTML needs exact source hash');
  assert.ok(!artifact.includes('<!--vmap:accountability-candidates-->'),'Prerender marker left unfilled');
  artifacts.push(folder);
}
console.log(JSON.stringify({status:'passed',...counts,sourceHash,publicationGuards:true,escapeGuards:true,artifacts}));
