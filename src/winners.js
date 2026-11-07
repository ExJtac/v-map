import './style.css';
import './winners.css';
import {appUrl} from './paths.js';
import {OFFICE_LABELS} from './election-data.js';
import {orderCandidates} from './winner-record.js';
const $=id=>document.querySelector(id),fmt=n=>Number.isFinite(n)?new Intl.NumberFormat('en-US').format(n):'Unavailable';
const percent=n=>Number.isFinite(n)?`${n.toFixed(1)}%`:'Unavailable';
const node=(tag,className,text)=>{const el=document.createElement(tag);el.className=className;el.textContent=text;return el;};
const fields=['office','state','party','status','sort','search'];
let manifest, data, page=0, token=0;
const perPage=50;
$('#directory-controls').addEventListener('submit',e=>e.preventDefault());
function contestLabel(row){return `${OFFICE_LABELS[row.office]}${row.office==='house'?` · ${Number(row.district)===0?'At-large':`District ${row.district}`}`:row.office==='senate' && row.seatClass?` · Class ${['','I','II','III'][row.seatClass]}`:''} · ${row.special?'Special · ':''}${row.stage}`;}
function render() {
  if(!data)return;
  let rows=data.results.filter(row=>{
    const party=row.leader?.party;
    return (!$('#directory-office').value || row.office===$('#directory-office').value)
      && (!$('#directory-state').value || row.stateFips===$('#directory-state').value)
      && (!$('#directory-party').value || ($('#directory-party').value==='Other'?party && !['Democrat','Republican'].includes(party):party===$('#directory-party').value))
      && ($('#directory-status').value==='all' || ($('#directory-status').value==='leaders'?Boolean(row.leader):!row.leader))
      && `${row.leader?.name||''} ${row.state} ${contestLabel(row)}`.toLowerCase().includes($('#directory-search').value.trim().toLowerCase());
  });
  rows=orderCandidates(rows,$('#directory-sort').value);
  page=Math.max(0,Math.min(page,Math.ceil(rows.length/perPage)-1));
  const list=$('#candidate-results');list.replaceChildren();list.start=page*perPage+1;
  for(const row of rows.slice(page*perPage,(page+1)*perPage)){
    const item=node('li','candidate-card','');
    item.append(node('p','candidate-place',`${row.state} · ${data.year}`),node('p','candidate-contest',contestLabel(row)));
    item.append(node('h3','',row.leader?.name || 'No qualified leader available'));
    const badges=node('div','candidate-badges','');
    if(row.leader)badges.append(node('span',`party-badge party-${row.leader.party==='Democrat'?'democrat':row.leader.party==='Republican'?'republican':'other'}`,row.leader.party==='Democrat'?'Democratic':row.leader.party));
    badges.append(node('span',row.provisional?'status-provisional':'status-recorded',row.status));item.append(badges);
    if(row.leader){
      const grid=node('dl','candidate-numbers','');
      for(const [label,value] of [['Reported candidate votes',fmt(row.leader.votes)],['Share of reported contest total',percent(row.leader.share)],['Lead over runner-up',Number.isFinite(row.leader.margin)?`${row.leader.margin.toFixed(1)} percentage points`:'Unavailable']])grid.append(node('dt','',label),node('dd','',value));
      item.append(grid);
    }
    if(row.office==='president')item.append(node('p','candidate-note','State popular-vote leader; this is not a national Electoral College outcome.'));
    if(row.certifiedCount)item.append(node('p','candidate-note','Source marks counts certified; V-Map makes no independent race call.'));
    if(row.sourceUpdatedAt)item.append(node('p','candidate-note',`Source update (as supplied): ${row.sourceUpdatedAt}`));
    else if(row.retrievedAt)item.append(node('p','candidate-note',`Source retrieved: ${row.retrievedAt}`));
    if(row.timestampBasis)item.append(node('p','candidate-note',row.timestampBasis));
    const links=node('div','candidate-links','');
    const map=node('a','','View state on map →');map.href=appUrl(`?office=${row.office}&year=${data.year}&state=${row.stateFips}`);links.append(map);
    row.sourceLinks.slice(0,2).forEach((url,i)=>{const a=node('a','',`Original source${i?' '+(i+1):''} ↗`);a.href=url;a.target='_blank';a.rel='noopener noreferrer';links.append(a);});
    item.append(links);list.append(item);
  }
  if(!rows.length)list.append(node('li','directory-empty','No matching candidates. Try another office, year, state or status.'));
  $('#directory-summary').textContent=`${data.year} · ${rows.length.toLocaleString()} matching races · ${data.counts.leaders} reported leaders and ${data.counts.heldOrTied} held/tied races in ${data.counts.races} imported contests · snapshot ${data.snapshotDate}. This is not nationwide-complete coverage.`;
  $('#directory-order-note').textContent={office:'Order: President, Senate, House, Governor; states A–Z; districts numerically.',margin:'Order: reported lead margin, largest first; unavailable margins last. Provisional margins can change.',share:'Order: share of reported contest total, highest first; unavailable shares last.',name:'Order: candidate name A–Z.'}[$('#directory-sort').value];
  $('#directory-scope').textContent=`${data.year===2026?'There is no 2026 presidential election. ':''}Governor and Senate statewide contests and House district returns appear once per contest; stages and special elections stay separate. Presidential entries in earlier years are state popular-vote leaders, not national winners. County totals are not substituted for full-race results.`;
  const pages=Math.max(1,Math.ceil(rows.length/perPage));$('#directory-page').textContent=`Page ${page+1} of ${pages}`;
  $('#directory-previous').disabled=page===0;$('#directory-next').disabled=page+1>=pages;
}
async function loadYear(){
  const current=++token;data=null;page=0;$('#candidate-results').replaceChildren();$('#directory-summary').textContent='Loading the selected election year…';$('#directory-error').hidden=true;$('#directory-retry').hidden=true;
  try{
    const entry=manifest.years.find(e=>e.year===Number($('#directory-year').value));
    const response=await fetch(appUrl(entry.url));if(!response.ok)throw Error('Election year unavailable');
    const next=await response.json();if(current!==token)return;
    if(next.year!==entry.year || !Array.isArray(next.results))throw Error('Unexpected election year');
    data=next;const selected=$('#directory-state').value;$('#directory-state').replaceChildren(new Option('All states',''));
    for(const [fips,name] of [...new Map(data.results.map(r=>[r.stateFips,r.state]))].sort((a,b)=>a[1].localeCompare(b[1])))$('#directory-state').append(new Option(name,fips));
    if([...$('#directory-state').options].some(o=>o.value===selected))$('#directory-state').value=selected;
    render();
  }catch(error){if(current!==token)return;$('#directory-summary').textContent='The candidate directory could not load.';$('#directory-error').textContent='Results are unavailable right now. Retry loading the imported records.';$('#directory-error').hidden=false;$('#directory-retry').hidden=false;}
}
async function init(){
  try{const response=await fetch(appUrl('/data/winners/manifest.json'));if(!response.ok)throw Error('Manifest unavailable');manifest=await response.json();
    $('#directory-year').replaceChildren(...manifest.years.map(e=>new Option(String(e.year),String(e.year))));$('#directory-year').disabled=false;
    const requested=new URL(location.href).searchParams.get('year');if(manifest.years.some(e=>String(e.year)===requested))$('#directory-year').value=requested;
    await loadYear();
  }catch{ $('#directory-summary').textContent='The directory could not load. Please retry.';$('#directory-retry').hidden=false; }
}
fields.forEach(field=>$('#directory-'+field).addEventListener(field==='search'?'input':'change',()=>{page=0;render();}));
$('#directory-year').addEventListener('change',loadYear);
for(const [id,delta] of [['previous',-1],['next',1]])$('#directory-'+id).addEventListener('click',()=>{page+=delta;render();$('#directory-heading').focus({preventScroll:true});$('#directory-heading').scrollIntoView({block:'start',behavior:'auto'});});
$('#directory-retry').addEventListener('click',()=>manifest?loadYear():init());
init();
