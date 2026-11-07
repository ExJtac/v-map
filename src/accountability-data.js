/** Publication guards for a dated, source-linked candidate pilot. No political scoring. */
export const PILOT_IDS = [
  'pilot-r-senate-01','pilot-r-senate-05','pilot-d-senate-02','pilot-d-senate-08',
  'pilot-r-house-01','pilot-r-house-02','pilot-d-house-01','pilot-d-house-04',
  'pilot-r-governor-01','pilot-r-governor-05','pilot-d-governor-02','pilot-d-governor-04',
];
const requireValue=(test,message)=>{if(!test)throw Error('Accountability data: '+message);};
export function isPublicSourceUrl(value){
  try{const u=new URL(value);return ['http:','https:'].includes(u.protocol)&&!u.username&&!u.password;}catch{return false;}
}
const knownDate=value=>value===null||(/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(value)&&Number.isFinite(Date.parse(value)));
export function validateAccountability(data){
  requireValue(data?.schemaVersion===1,'unsupported version');
  requireValue(Number.isFinite(Date.parse(data.reviewedAt)),'review date required');
  requireValue(typeof data.scope==='string'&&data.scope.length>20,'explicit bounded scope required');
  requireValue(typeof data.methodology==='string'&&data.methodology.length>20,'methodology required');
  requireValue(data.review?.status==='source_reviewed','independent source review required');
  requireValue(Array.isArray(data.review?.reviewers)&&data.review.reviewers.length>0,'reviewer receipt required');
  requireValue(Array.isArray(data.subjects)&&data.subjects.length===12,'exactly twelve pilot subjects required');
  requireValue(JSON.stringify(data.subjects.map(s=>s.id).sort())===JSON.stringify([...PILOT_IDS].sort()),'roster identity mismatch');
  const quotedWords=new Map(),ids=new Set();
  const url=(u,label)=>requireValue(isPublicSourceUrl(u),label+' needs a public source URL');
  const urls=(values,label)=>{requireValue(Array.isArray(values),label+' must be an array');values.forEach(u=>url(u,label));};
  for(const office of ['senate','house','governor'])for(const party of ['Republican','Democrat']){
    const rows=data.subjects.filter(s=>s.office===office&&s.party===party);
    requireValue(rows.length===2&&new Set(rows.map(s=>s.state)).size===2,'fixed office/party/distinct-state selection changed');
  }
  const counts={subjects:12,statements:0,actions:0,accounts:0,archives:0,postElectionStatements:0,authenticatedDeletedPosts:0};
  for(const person of data.subjects){
    requireValue(typeof person.name==='string'&&person.name.length>1,'public identity required');
    requireValue(['confirmed','held'].includes(person.identity?.status),'identity review status required');
    urls(person.identity.evidenceUrls,'identity evidence');
    requireValue(person.identity.status!=='confirmed'||person.identity.evidenceUrls.length>=2,'confirmed identity needs two references');
    requireValue(['reported_leader','winner_declared','winner_certified','unresolved'].includes(person.outcome?.status),'honest outcome status required');
    urls(person.outcome.sourceUrls,'outcome evidence');
    requireValue(typeof person.outcome.note==='string'&&person.outcome.note.length>0,'outcome qualification note required');
    requireValue(person.outcome.status==='reported_leader'||person.outcome.status==='unresolved'||person.outcome.officialNamedOutcomeVerified===true,'winner promotion needs official named outcome review');
    for(const key of ['statements','actions','accounts','archives'])requireValue(Array.isArray(person[key]),key+' must be an array');
    requireValue(person.identity.status!=='held'||(!person.statements.length&&!person.actions.length),'unresolved person cannot receive attributed facts');
    requireValue(person.review?.status==='source_reviewed','per-person source review required');
    requireValue(person.coverage&&typeof person.coverage.limits==='string','explicit search limits required');
    requireValue(Array.isArray(person.coverage.checkedPlatforms),'checked platform scope required');
    const statementIds=new Set();
    for(const statement of person.statements){
      requireValue(typeof statement.id==='string'&&!ids.has(statement.id),'duplicate statement ID');ids.add(statement.id);statementIds.add(statement.id);
      requireValue(statement.verified===true,'unverified quotation cannot be published');
      requireValue(knownDate(statement.date),'statement date must be qualified or null');
      requireValue(['campaign','after_election','prior_record','unknown'].includes(statement.phase),'unknown statement phase');
      requireValue(statement.phase!=='after_election'||(statement.date&&Date.parse(statement.date)>=Date.parse('2026-11-03')),'post-election phase needs a qualifying date');
      for(const key of ['dateBasis','attribution','quote','context','locator'])requireValue(typeof statement[key]==='string'&&statement[key].length>0,'statement '+key+' required');
      url(statement.sourceUrl,'quotation');url(statement.fullSourceUrl,'full original');
      const key=statement.fullSourceUrl.split('#')[0];quotedWords.set(key,(quotedWords.get(key)||0)+statement.quote.trim().split(/\s+/).length);
      counts.statements++;if(statement.phase==='after_election')counts.postElectionStatements++;
    }
    for(const action of person.actions){
      requireValue(typeof action.id==='string'&&!ids.has(action.id),'duplicate action ID');ids.add(action.id);
      requireValue(action.verified===true,'unverified official action cannot be published');
      requireValue(knownDate(action.date),'action date must be qualified or null');
      for(const key of ['type','recordId','title','description'])requireValue(typeof action[key]==='string'&&action[key].length>0,'action '+key+' required');
      url(action.sourceUrl,'official action');
      requireValue(Array.isArray(action.relatedStatementIds)&&action.relatedStatementIds.every(id=>statementIds.has(id)),'action points to an unknown statement');
      requireValue(['related','supports_narrow_claim','not_yet_assessable'].includes(action.relationship),'unsupported promise judgment');
      counts.actions++;
    }
    for(const directory of person.recordLinks||[]){url(directory.url,'official-record directory');requireValue(typeof directory.label==='string'&&typeof directory.scope==='string','directory scope required');}
    for(const account of person.accounts){
      url(account.url,'public account');urls(account.ownershipEvidenceUrls,'account attribution');
      requireValue(['primary_linked','corroborated','directory_listed','unverified'].includes(account.ownershipStatus),'account linkage status required');
      requireValue(account.ownershipStatus==='unverified'||account.ownershipEvidenceUrls.length>0,'account attribution evidence required');
      requireValue(typeof account.accessStatus==='string'&&typeof account.notes==='string','account access/context required');
      counts.accounts++;
    }
    for(const archive of person.archives){
      url(archive.originalUrl,'archive original');if(archive.archiveUrl)url(archive.archiveUrl,'archive replay');
      requireValue(knownDate(archive.captureDate),'capture date must be qualified or null');
      requireValue(typeof archive.contentReviewed==='boolean','replay fetch and semantic review must be separate');
      requireValue(['not_established','public_archive_only','unavailable','no_capture'].includes(archive.deletionStatus),'unsupported deletion assertion');
      requireValue(archive.deletionStatus!=='public_archive_only'||(archive.contentReviewed&&archive.archiveUrl),'archive-only claim needs content review');
      counts.archives++;
    }
  }
  for(const [source,count] of quotedWords)requireValue(count<=25,'quotation budget exceeded for '+source);
  for(const [key,value] of Object.entries(counts))requireValue(data.coverage?.[key]===value,'coverage '+key+' is stale');
  return counts;
}
