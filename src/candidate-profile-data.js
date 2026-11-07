import {appUrl} from './paths.js';
import {CANDIDATE_PERSON_MATCHES} from './candidate-person-matches.js';

function recordHash(value){let hash=2166136261;for(const character of value){hash^=character.codePointAt(0);hash=Math.imul(hash,16777619);}return (hash>>>0).toString(16).padStart(8,'0');}
export function profileId(row,year=row.year){
  if(!row?.leader?.name)throw Error('A held race has no person profile.');
  return `p${year}-${recordHash(row.key+'\0'+row.leader.name)}`;
}
export function profilePath(row,year=row.year){
  const slug=row.leader.name.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,70)||'reported-candidate';
  return `people/${year}/${row.office}-${row.stateFips}-${slug}-${profileId(row,year).split('-').at(-1)}/`;
}
export function profileUrl(row,{year=row.year,base}={}){
  if(Number(year)===2026)return appUrl(profilePath(row,year),base);
  return appUrl('people/?'+new URLSearchParams({year:String(year),contest:row.key,candidate:row.leader.name}),base);
}
export function personMatch(row,year=row.year){return Number(year)===2026?CANDIDATE_PERSON_MATCHES.find(m=>m.recordKey===row.key&&m.reportedName===row.leader?.name)||null:null;}
export function profileFromElection(row,year=row.year){
  const match=personMatch(row,year);
  return {id:profileId(row,year),path:profilePath(row,year),displayName:match?.displayName||row.leader.name,reportedName:row.leader.name,personStatus:'source_record',election:row,portrait:null,accountability:null,coverage:{notes:'This profile contains the selected reported election record. Additional career, statement, voting, bill-text and financial records have not been joined without source review. Missing research is not a finding about this person.'}};
}
