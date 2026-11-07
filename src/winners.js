import './style.css';
import './winners.css';
import {appUrl} from './paths.js';
import {contestLabel,renderCandidateCard,directorySummary} from './winner-render.js';
import {orderCandidates} from './winner-record.js';
const $=id=>document.querySelector(id);
const fields=['office','state','party','status','sort','search'];
let manifest, data, page=0, token=0;
const perPage=50;
$('#directory-controls').addEventListener('submit',e=>e.preventDefault());
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
  const list=$('#candidate-results');list.start=page*perPage+1;list.removeAttribute('data-prerender-year');
  list.innerHTML=rows.slice(page*perPage,(page+1)*perPage).map(row=>renderCandidateCard(row,{year:data.year})).join('') || '<li class="directory-empty">No matching candidates. Try another office, year, state or status.</li>';
  $('#directory-summary').textContent=directorySummary(data,rows.length);
  $('#directory-order-note').textContent={office:'Order: President, Senate, House, Governor; states A–Z; districts numerically.',margin:'Order: reported lead margin, largest first; unavailable margins last. Provisional margins can change.',share:'Order: share of reported contest total, highest first; unavailable shares last.',name:'Order: candidate name A–Z.'}[$('#directory-sort').value];
  $('#directory-scope').textContent=`${data.year===2026?'There is no 2026 presidential election. ':''}Governor and Senate statewide contests and House district returns appear once per contest; stages and special elections stay separate. Presidential entries in earlier years are state popular-vote leaders, not national winners. County totals are not substituted for full-race results.`;
  const pages=Math.max(1,Math.ceil(rows.length/perPage));$('#directory-page').textContent=`Page ${page+1} of ${pages}`;
  $('#directory-previous').disabled=page===0;$('#directory-next').disabled=page+1>=pages;
}
async function loadYear(){
  const current=++token;data=null;page=0;fields.forEach(field=>$('#directory-'+field).disabled=true);$('#directory-previous').disabled=true;$('#directory-next').disabled=true;$('#candidate-results').setAttribute('aria-busy','true');if($('#candidate-results').dataset.prerenderYear!==$('#directory-year').value)$('#directory-summary').textContent='Loading the selected election year…';$('#directory-error').hidden=true;$('#directory-retry').hidden=true;
  try{
    const entry=manifest.years.find(e=>e.year===Number($('#directory-year').value));
    const response=await fetch(appUrl(entry.url));if(!response.ok)throw Error('Election year unavailable');
    const next=await response.json();if(current!==token)return;
    if(next.year!==entry.year || !Array.isArray(next.results))throw Error('Unexpected election year');
    data=next;const selected=$('#directory-state').value;$('#directory-state').replaceChildren(new Option('All states',''));
    for(const [fips,name] of [...new Map(data.results.map(r=>[r.stateFips,r.state]))].sort((a,b)=>a[1].localeCompare(b[1])))$('#directory-state').append(new Option(name,fips));
    if([...$('#directory-state').options].some(o=>o.value===selected))$('#directory-state').value=selected;
    fields.forEach(field=>$('#directory-'+field).disabled=false);$('#candidate-results').setAttribute('aria-busy','false');render();
  }catch(error){if(current!==token)return;$('#directory-summary').textContent='The candidate directory could not load.';$('#candidate-results').setAttribute('aria-busy','false');$('#directory-error').textContent='The selected year could not load. Any results still shown retain their original year and snapshot labels. Retry loading the imported records.';$('#directory-error').hidden=false;$('#directory-retry').hidden=false;}
}
async function init(){
  try{const response=await fetch(appUrl('/data/winners/manifest.json'));if(!response.ok)throw Error('Manifest unavailable');manifest=await response.json();
    $('#directory-year').replaceChildren(...manifest.years.map(e=>new Option(String(e.year),String(e.year))));$('#directory-year').disabled=false;
    const requested=new URL(location.href).searchParams.get('year');if(manifest.years.some(e=>String(e.year)===requested))$('#directory-year').value=requested;
    await loadYear();
  }catch{ $('#directory-error').textContent='Interactive filters could not load. The default 2026 snapshot remains available below. Please retry.';$('#directory-error').hidden=false;$('#directory-retry').hidden=false; }
}
fields.forEach(field=>$('#directory-'+field).addEventListener(field==='search'?'input':'change',()=>{page=0;render();}));
$('#directory-year').addEventListener('change',loadYear);
for(const [id,delta] of [['previous',-1],['next',1]])$('#directory-'+id).addEventListener('click',()=>{page+=delta;render();$('#directory-heading').focus({preventScroll:true});$('#directory-heading').scrollIntoView({block:'start',behavior:'auto'});});
$('#directory-retry').addEventListener('click',()=>manifest?loadYear():init());
init();
