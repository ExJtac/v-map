/** Deterministic election-record profiles; only explicit reviewed person/photo joins. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {profileFromElection,personMatch} from '../src/candidate-profile-data.js';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=file=>JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));
const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex');
export function buildCandidateProfiles(){
  const winnerFile='public/data/winners/2026.json',pilotFile='public/data/candidates/pilot-2026.json',portraitFile='public/data/candidates/portraits-2026.json';
  const winners=read(winnerFile),pilot=read(pilotFile),portraits=fs.existsSync(path.join(root,portraitFile))?read(portraitFile):{portraits:[]};
  assert.equal(winners.year,2026);assert.equal(pilot.subjects.length,12);
  const photos=new Map();
  for(const photo of portraits.portraits){
    const key=photo.recordKey+'\0'+photo.leaderName;assert.ok(!photos.has(key),'Ambiguous portrait mapping');
    assert.match(photo.src,/^people-photos\/[a-zA-Z0-9._-]+\.(?:jpe?g|png|webp)$/);
    assert.ok(fs.statSync(path.join(root,'public',photo.src)).size>100,'Missing portrait asset');
    for(const field of ['sourceUrl','imageUrl']){const u=new URL(photo[field]);assert.ok(['http:','https:'].includes(u.protocol)&&!u.username&&!u.password,'Unsafe portrait source');}
    assert.ok(photo.attribution&&photo.rightsBasis&&photo.sourcePersonId&&photo.identityEvidenceUrls?.length,'Portrait attribution/identity/rights incomplete');
    photos.set(key,photo);
  }
  const profiles=winners.results.filter(row=>row.leader).map(row=>{
    const profile=profileFromElection(row,winners.year),match=personMatch(row,winners.year);
    if(match){const subject=pilot.subjects.find(s=>s.id===match.pilotId);assert.equal(subject?.identity.status,'confirmed');assert.equal(subject.office,row.office);assert.equal(subject.state,row.state);profile.personStatus='verified_pilot';profile.accountability=subject;}
    profile.portrait=photos.get(row.key+'\0'+row.leader.name)||null;
    return profile;
  });
  assert.equal(profiles.length,winners.counts.leaders);assert.equal(new Set(profiles.map(p=>p.id)).size,profiles.length);assert.equal(new Set(profiles.map(p=>p.path)).size,profiles.length);
  const sourceHashes={winners:hash(winnerFile),pilot:hash(pilotFile),portraits:fs.existsSync(path.join(root,portraitFile))?hash(portraitFile):null};
  const updatedAt=[pilot.reviewedAt,portraits.reviewedAt,...winners.results.flatMap(row=>[row.retrievedAt,row.sourceUpdatedAt])].filter(value=>value&&Number.isFinite(Date.parse(value))).sort((a,b)=>Date.parse(b)-Date.parse(a))[0];
  const counts={profiles:profiles.length,sourceReviewedPeople:profiles.filter(p=>p.accountability).length,portraits:profiles.filter(p=>p.portrait).length,photoUnavailable:profiles.filter(p=>!p.portrait).length};
  const data={schemaVersion:1,year:winners.year,snapshotDate:winners.snapshotDate,updatedAt,sourceHashes,counts,profiles};
  const cards={schemaVersion:1,year:winners.year,sourceHashes,profiles:profiles.map(p=>({id:p.id,path:p.path,displayName:p.displayName,reportedName:p.reportedName,portrait:p.portrait?{src:p.portrait.src,attribution:p.portrait.attribution}:null}))};
  return {data,cards};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const {data,cards}=buildCandidateProfiles(),check=process.argv.includes('--check');
  for(const [name,value] of [['profiles-2026.json',data],['profile-cards-2026.json',cards]]){
    const file=path.join(root,'public/data/candidates',name),body=JSON.stringify(value,null,2)+'\n';
    if(check)assert.equal(fs.readFileSync(file,'utf8'),body,'Stale candidate profiles: '+name);else fs.writeFileSync(file,body);
  }
  console.log(JSON.stringify({status:check?'verified':'generated',...data.counts,sourceHashes:data.sourceHashes}));
}
