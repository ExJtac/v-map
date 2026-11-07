import './style.css';
import './winners.css';
import {appUrl} from './paths.js';
import {contestLabel,directorySummary,renderGroupedCandidates,renderOfficeNavigation} from './winner-render.js';
import {orderCandidates} from './winner-record.js';
const $=id=>document.querySelector(id);
const fields=['office','state','party','status','sort','search'];
let manifest,data,profiles=[],token=0;
function matchesQuery(value,query){const normalize=s=>String(s).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ');const hay=normalize(value),words=new Set(hay.split(/\s+/));return normalize(query).split(/\s+/).filter(Boolean).every(term=>/^\d+$/.test(term)?words.has(term):hay.includes(term));}
$('#directory-controls').addEventListener('submit',e=>e.preventDefault());
function render(){
  if(!data)return;
  const rows=orderCandidates(data.results.filter(row=>{
    const party=row.leader?.party;
    return (!$('#directory-office').value||row.office===$('#directory-office').value)
      &&(!$('#directory-state').value||row.stateFips===$('#directory-state').value)
      &&(!$('#directory-party').value||($('#directory-party').value==='Other'?party&&!['Democrat','Republican'].includes(party):party===$('#directory-party').value))
      &&($('#directory-status').value==='all'||($('#directory-status').value==='leaders'?Boolean(row.leader):!row.leader))
      &&matchesQuery(`${row.leader?.name||''} ${row.state} ${contestLabel(row)} ${row.leader?.party||''} ${profiles.find(p=>p.reportedName===row.leader?.name)?.displayName||''}`, $('#directory-search').value);
  }),$('#directory-sort').value);
  const list=$('#candidate-results');list.removeAttribute('data-prerender-year');
  list.innerHTML=renderGroupedCandidates(rows,{year:data.year,profiles,sort:$('#directory-sort').value});
  $('#directory-office-nav').innerHTML=renderOfficeNavigation(data,{activeOffice:$('#directory-office').value});
  $('#directory-summary').textContent=directorySummary(data,rows.length);
  $('#directory-order-note').textContent={office:'Each list: states A–Z, then districts numerically.',margin:'Within each office: reported lead margin, largest first.',share:'Within each office: share of reported contest total, highest first.',name:'Within each office: reported name A–Z.'}[$('#directory-sort').value];
  $('#directory-scope').textContent=`${data.year===2026?'There is no 2026 presidential election. ':''}Select a person to open their election-record profile. Source-reviewed statements and actions are shown where available. Photos are sourced individually; missing photos are labeled. Coverage is incomplete.`;
}
async function loadYear(){
  const current=++token;data=null;profiles=[];fields.forEach(field=>$('#directory-'+field).disabled=true);$('#candidate-results').setAttribute('aria-busy','true');$('#directory-error').hidden=true;$('#directory-retry').hidden=true;
  try{
    const year=Number($('#directory-year').value),entry=manifest.years.find(e=>e.year===year);
    const [response,cards]=await Promise.all([fetch(appUrl(entry.url)),year===2026?fetch(appUrl('data/candidates/profile-cards-2026.json')).then(r=>r.ok?r.json():null).catch(()=>null):null]);
    if(!response.ok)throw Error('Election year unavailable');const next=await response.json();if(current!==token)return;
    if(next.year!==entry.year||!Array.isArray(next.results))throw Error('Unexpected election year');
    data=next;profiles=cards?.year===2026&&Array.isArray(cards.profiles)?cards.profiles:[];
    const selected=$('#directory-state').value;$('#directory-state').replaceChildren(new Option('All states',''));
    for(const [fips,name] of [...new Map(data.results.map(r=>[r.stateFips,r.state]))].sort((a,b)=>a[1].localeCompare(b[1])))$('#directory-state').append(new Option(name,fips));
    if([...$('#directory-state').options].some(o=>o.value===selected))$('#directory-state').value=selected;
    if($('#directory-office').value&&!data.results.some(r=>r.office===$('#directory-office').value))$('#directory-office').value='';
    fields.forEach(field=>$('#directory-'+field).disabled=false);$('#candidate-results').setAttribute('aria-busy','false');render();
  }catch{if(current!==token)return;$('#candidate-results').setAttribute('aria-busy','false');$('#directory-error').textContent='The selected year could not load. Any records still shown retain their original year and source labels. Please retry.';$('#directory-error').hidden=false;$('#directory-retry').hidden=false;}
}
async function init(){
  try{
    const response=await fetch(appUrl('data/winners/manifest.json'));if(!response.ok)throw Error('Manifest unavailable');manifest=await response.json();
    $('#directory-year').replaceChildren(...manifest.years.map(e=>new Option(String(e.year),String(e.year))));$('#directory-year').disabled=false;
    const requested=new URL(location.href).searchParams;
    if(manifest.years.some(e=>String(e.year)===requested.get('year')))$('#directory-year').value=requested.get('year');
    if(['governor','house','senate','president'].includes(requested.get('office')))$('#directory-office').value=requested.get('office');
    await loadYear();
  }catch{$('#directory-error').textContent='Interactive filters could not load. The default 2026 lists and profiles remain available below.';$('#directory-error').hidden=false;$('#directory-retry').hidden=false;}
}
fields.forEach(field=>$('#directory-'+field).addEventListener(field==='search'?'input':'change',render));
$('#directory-year').addEventListener('change',loadYear);
$('#directory-office-nav').addEventListener('click',event=>{
  const link=event.target.closest('[data-office]');if(!link||!data)return;
  event.preventDefault();$('#directory-office').value=link.dataset.office;render();
  const target=document.querySelector(link.getAttribute('href'));if(target){(target.querySelector('h2')||target).focus({preventScroll:true});target.scrollIntoView({block:'start',behavior:'auto'});}
});
$('#directory-retry').addEventListener('click',()=>manifest?loadYear():init());
init();
