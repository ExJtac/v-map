import {appUrl} from './paths.js';
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text=value=>(Array.isArray(value)?value:[value]).filter(v=>typeof v==='string'&&v.trim());
const human=value=>String(value||'').replaceAll('_',' ');
const office={governor:'Governor',house:'U.S. House',senate:'U.S. Senate'};
let sourcePromise;
export function safeCountySource(url){try{const u=new URL(url);return ['https:','http:'].includes(u.protocol)&&!u.username&&!u.password?u.href:null;}catch{return null;}}
export function validateCountySourceData(data){
  if(data?.schemaVersion!==1||data.review?.status!=='source_reviewed'||!Array.isArray(data.cases))throw Error('Source-reviewed county records unavailable.');
  const keys=new Set();
  for(const row of data.cases){
    const key=row.fips+'|'+row.office;
    if(!/^\d{5}$/.test(row.fips)||!office[row.office]||keys.has(key)||!Array.isArray(row.items))throw Error('Invalid county source identity.');keys.add(key);
    for(const item of row.items)if(!safeCountySource(item.url)||!item.summary||!item.relationToFlag||!item.status)throw Error('County source citation/context is incomplete.');
  }
  return data;
}
async function loadSources(){
  sourcePromise ||= fetch(appUrl('data/county-reviews/2026.json')).then(r=>{if(!r.ok)throw Error('County sources unavailable');return r.json();}).then(validateCountySourceData).catch(error=>{sourcePromise=null;throw error;});
  return sourcePromise;
}
export function renderCountySourceNotes(data,{fips,selectedOffice,flagged=true}={}){
  validateCountySourceData(data);
  const row=data.cases.find(c=>c.fips===String(fips)&&c.office===selectedOffice);
  if(!row)return flagged?'<h2>County source reports</h2><p>No source-reviewed report batch is published for this county and office yet. This is a research coverage gap, not a finding that no issue or explanation exists.</p>':'';
  const articles=row.items.map(item=>`<article class="county-source-item"><div class="county-source-meta"><span>${esc(human(item.status))}</span><span>${esc(item.date||'Publication date not established')}</span></div><h3><a href="${esc(safeCountySource(item.url))}" target="_blank" rel="noopener noreferrer">${esc(item.title)} ↗</a></h3><p class="county-source-publisher">${esc(item.publisher)}</p><p>${esc(item.summary)}</p><p><strong>Relation to this review flag:</strong> ${esc(item.relationToFlag)}</p><p class="county-source-limit">${esc(item.dateBasis||'')}</p>${text(item.limits).map(t=>`<p class="county-source-limit">${esc(t)}</p>`).join('')}</article>`).join('');
  return `<h2>${esc(row.county)}, ${esc(row.state)} · source reports</h2><p class="county-source-intro">${esc(office[row.office])} · ${esc(data.reviewedAt)} source review. Reports refer to the saved comparison below. Updated returns may change current flags. This is not live counting or a finding of wrongdoing.</p><p><strong>Saved comparison snapshot:</strong> ${esc(row.flagSummary)}</p>${articles||'<p>No qualifying report was obtained in this bounded review.</p>'}<details><summary>Research scope and unresolved gaps</summary>${row.coverage?.window?`<p><strong>Search window:</strong> ${esc(row.coverage.window.from)} through ${esc(row.coverage.window.through)} (${esc(row.coverage.window.timezone)}).</p>`:''}${text(row.coverage?.noQualifiedReportLane?.scope).map(t=>`<p>${esc(t)}</p>`).join('')}${text(row.coverage?.noQualifiedReportLane?.negativeInference).map(t=>`<p>${esc(t)}</p>`).join('')}${text(row.coverage?.limits).map(t=>`<p>${esc(t)}</p>`).join('')}</details>`;
}
export async function updateCountySourceContext(container,{fips,selectedOffice,year,flagged},valid=()=>true){
  if(Number(year)!==2026||!fips){container.hidden=true;container.replaceChildren();return;}
  try{const data=await loadSources();if(!valid())return;const html=renderCountySourceNotes(data,{fips,selectedOffice,flagged});container.innerHTML=html;container.hidden=!html;}
  catch{if(valid()){container.hidden=false;container.textContent='County source notes could not load. Existing election results and review flags remain separately available.';}}
}
export async function initCountySourceIndex(container){
  try{const data=await loadSources();container.innerHTML=`<summary>County report reviews · ${data.cases.length} county / office cases</summary><p>This first source-review batch includes counting context and original reporting. Its selection was based on saved flags, not on a search for misconduct. Other counties remain unreviewed.</p><nav aria-label="Open a county source review">${data.cases.map(row=>`<a href="${esc(appUrl('?'+new URLSearchParams({office:row.office,year:'2026',county:row.fips})))}">${esc(row.county)}, ${esc(row.state)} · ${esc(office[row.office])}</a>`).join('')}</nav>`;container.hidden=false;}
  catch{container.hidden=true;}
}
