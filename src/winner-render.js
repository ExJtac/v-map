/** The same escaped, source-qualified card markup is used in HTML and filters. */
import {OFFICE_LABELS} from './election-data.js';
import {appUrl} from './paths.js';
import {profileUrl,profileId,personMatch} from './candidate-profile-data.js';
export const DIRECTORY_OFFICES=['governor','house','senate','president'];
export const DIRECTORY_OFFICE_LABELS={governor:'Governors',house:'U.S. House',senate:'U.S. Senate',president:'President · state popular vote'};
export const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const number=n=>Number.isFinite(n)?new Intl.NumberFormat('en-US').format(n):'Unavailable';
const percent=n=>Number.isFinite(n)?`${n.toFixed(1)}%`:'Unavailable';
const note=text=>`<p class="candidate-note">${escapeHtml(text)}</p>`;
export function contestLabel(row){return `${OFFICE_LABELS[row.office]}${row.office==='house'?` · ${Number(row.district)===0?'At-large':`District ${row.district}`}`:row.office==='senate'&&row.seatClass?` · Class ${['','I','II','III'][row.seatClass]}`:''} · ${row.special?'Special · ':''}${row.stage}`;}
export function directorySummary(data,count){return `${data.year} · ${count.toLocaleString()} matching races · ${data.counts.leaders} reported leaders and ${data.counts.heldOrTied} held/tied races in ${data.counts.races} imported contests · snapshot ${data.snapshotDate}. This is not nationwide-complete coverage.`;}
export function renderCandidateCard(row,{year,base,profile}={}){
  const esc=escapeHtml, leader=row.leader, party=leader?.party;
  const name=profile?.displayName||personMatch(row,year)?.displayName||leader?.name;
  const badges=(leader?`<span class="party-badge party-${party==='Democrat'?'democrat':party==='Republican'?'republican':'other'}">${esc(party==='Democrat'?'Democratic':party)}</span>`:'')+`<span class="${row.provisional?'status-provisional':'status-recorded'}">${esc(row.status)}</span>`;

  const href=leader?profileUrl(row,{year,base}):null;
  const links=href?[`<a class="candidate-profile-link" href="${esc(href)}">View profile →</a>`]:[];
  if(profile?.portrait?.src)links.push(`<a href="${esc(href+'#portrait')}">Photo credits</a>`);
  (row.sourceLinks||[]).filter(url=>{try{const u=new URL(url);return ['https:','http:'].includes(u.protocol)&&!u.username&&!u.password;}catch{return false;}}).slice(0,2).forEach((url,i)=>links.push(`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">Original source${i?' '+(i+1):''} ↗</a>`));
  const portrait=leader?(profile?.portrait?.src?`<img src="${esc(appUrl(profile.portrait.src,base))}" width="96" height="120" loading="lazy" decoding="async" alt="Sourced portrait of ${esc(name)}" />`:`<span class="candidate-photo-placeholder" aria-label="Photo not sourced"><b>${esc(String(name).split(/\s+/).filter(Boolean).map(s=>s[0]).slice(0,2).join(''))}</b><small>Photo not sourced</small></span>`):'';
  return `<li class="candidate-card" data-contest-key="${esc(row.key)}"><div class="candidate-card-main">${href?`<a class="candidate-photo" href="${esc(href)}" tabindex="-1" aria-hidden="true">${portrait}</a>`:''}<div class="candidate-card-text"><p class="candidate-place">${esc(row.state)}${row.office==='house'?` · ${Number(row.district)===0?'At-large':'District '+esc(row.district)}`:''}</p><h3>${href?`<a href="${esc(href)}">${esc(name)}</a>`:'No qualified leader available'}</h3><p class="candidate-contest">${esc(year)} · ${esc(contestLabel(row))}</p><div class="candidate-badges">${badges}</div>${leader?`<p class="candidate-brief-votes">${esc(number(leader.votes))} reported votes · ${esc(percent(leader.share))}</p>`:''}</div></div>${row.office==='president'?note('State popular-vote leader, not a national Electoral College outcome.'):''}<div class="candidate-links">${links.join('')}</div></li>`;
}

export function groupedCandidates(rows,sort='office'){
  return DIRECTORY_OFFICES.map(office=>({office,rows:rows.filter(r=>r.office===office)})).filter(g=>g.rows.length);
}
export function renderOfficeNavigation(data,{activeOffice=''}={}){
  return `<a href="#directory-heading" data-office=""${!activeOffice?' aria-current="true"':''}>All lists</a>`+DIRECTORY_OFFICES.filter(o=>data.results.some(r=>r.office===o)).map(office=>`<a href="#office-${office}" data-office="${office}"${activeOffice===office?' aria-current="true"':''}>${escapeHtml(DIRECTORY_OFFICE_LABELS[office])}<span>${data.results.filter(r=>r.office===office&&r.leader).length}</span></a>`).join('');
}
export function renderGroupedCandidates(rows,{year,base,profiles=[],sort='office'}={}){
  const byId=new Map(profiles.map(p=>[p.id,p]));
  return groupedCandidates(rows,sort).map(group=>`<section class="directory-office-group" id="office-${group.office}" aria-labelledby="heading-${group.office}"><div class="directory-group-heading"><h2 id="heading-${group.office}" tabindex="-1">${escapeHtml(DIRECTORY_OFFICE_LABELS[group.office])}</h2><span>${group.rows.length} ${group.rows.length===1?'race':'races'}</span></div><ol class="candidate-results">${group.rows.map(row=>renderCandidateCard(row,{year,base,profile:row.leader?byId.get(profileId(row,year)):null})).join('')}</ol></section>`).join('')||'<p class="directory-empty">No matching records. Try another office, state or search.</p>';
}
