/** The same escaped, source-qualified card markup is used in HTML and filters. */
import {OFFICE_LABELS} from './election-data.js';
import {appUrl} from './paths.js';
export const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const number=n=>Number.isFinite(n)?new Intl.NumberFormat('en-US').format(n):'Unavailable';
const percent=n=>Number.isFinite(n)?`${n.toFixed(1)}%`:'Unavailable';
const note=text=>`<p class="candidate-note">${escapeHtml(text)}</p>`;
export function contestLabel(row){return `${OFFICE_LABELS[row.office]}${row.office==='house'?` · ${Number(row.district)===0?'At-large':`District ${row.district}`}`:row.office==='senate'&&row.seatClass?` · Class ${['','I','II','III'][row.seatClass]}`:''} · ${row.special?'Special · ':''}${row.stage}`;}
export function directorySummary(data,count){return `${data.year} · ${count.toLocaleString()} matching races · ${data.counts.leaders} reported leaders and ${data.counts.heldOrTied} held/tied races in ${data.counts.races} imported contests · snapshot ${data.snapshotDate}. This is not nationwide-complete coverage.`;}
export function renderCandidateCard(row,{year,base}={}){
  const esc=escapeHtml, leader=row.leader, party=leader?.party;
  const badges=(leader?`<span class="party-badge party-${party==='Democrat'?'democrat':party==='Republican'?'republican':'other'}">${esc(party==='Democrat'?'Democratic':party)}</span>`:'')+`<span class="${row.provisional?'status-provisional':'status-recorded'}">${esc(row.status)}</span>`;
  const metrics=leader?`<dl class="candidate-numbers">${[['Reported candidate votes',number(leader.votes)],['Share of reported contest total',percent(leader.share)],['Lead over runner-up',Number.isFinite(leader.margin)?`${leader.margin.toFixed(1)} percentage points`:'Unavailable']].map(([label,value])=>`<dt>${esc(label)}</dt><dd>${esc(value)}</dd>`).join('')}</dl>`:'';
  const query=new URLSearchParams({office:row.office,year:String(year),state:row.stateFips});
  const links=[`<a href="${esc(appUrl('?'+query,base))}">View state on map →</a>`];
  (row.sourceLinks||[]).filter(url=>{try{const u=new URL(url);return ['https:','http:'].includes(u.protocol)&&!u.username&&!u.password;}catch{return false;}}).slice(0,2).forEach((url,i)=>links.push(`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">Original source${i?' '+(i+1):''} ↗</a>`));
  return `<li class="candidate-card" data-contest-key="${esc(row.key)}"><p class="candidate-place">${esc(row.state)} · ${esc(year)}</p><p class="candidate-contest">${esc(contestLabel(row))}</p><h3>${esc(leader?.name||'No qualified leader available')}</h3><div class="candidate-badges">${badges}</div>${metrics}${row.office==='president'?note('State popular-vote leader; this is not a national Electoral College outcome.'):''}${row.certifiedCount?note('Source marks counts certified; V-Map makes no independent race call.'):''}${row.sourceUpdatedAt?note('Source update (as supplied): '+row.sourceUpdatedAt):row.retrievedAt?note('Source retrieved: '+row.retrievedAt):''}${row.timestampBasis?note(row.timestampBasis):''}<div class="candidate-links">${links.join('')}</div></li>`;
}
