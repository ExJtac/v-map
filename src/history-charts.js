import {loadElection, OFFICE_LABELS} from './election-data.js';
import {loadCountySupplement, mergeElectionData} from './county-data.js';
import {appUrl} from './paths.js';
import {selectHistoryYears, qualifiedRaceCounts, auditedHouseCounts, auditedSenateRoundCounts, historyPoint} from './history-series.js';
const merged = new Map(), documents = new Map();
const fmt = value => value == null ? '—' : value.toLocaleString(undefined,{maximumFractionDigits:0});
const pct = value => value == null ? '—' : `${value.toFixed(1)}%`;
function documentData(url) {
  if (!documents.has(url)) documents.set(url,fetch(appUrl(url)).then(r => {if(!r.ok) throw new Error('History evidence unavailable.');return r.json();}).catch(e => {documents.delete(url);throw e;}));
  return documents.get(url);
}
function election(office,year) {
  const key = `${office}-${year}`;
  if (!merged.has(key)) merged.set(key,Promise.all([loadElection(office,year),loadCountySupplement(office,year)]).then(([base,supplement]) => mergeElectionData(base,supplement)).catch(e => {merged.delete(key);throw e;}));
  return merged.get(key);
}
function node(tag,text,className) {const el=document.createElement(tag);if(text != null)el.textContent=text;if(className)el.className=className;return el;}
function svgNode(tag,attributes={},text) {const el=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const [k,v] of Object.entries(attributes))el.setAttribute(k,String(v));if(text!=null)el.textContent=text;return el;}
function chart(points,rate,label,selectedYear) {
  const fig=node('figure',null,'history-chart');fig.append(node('figcaption',label));
  const svg=svgNode('svg',{viewBox:'0 0 720 240',role:'img','aria-label':`${label}. Values and missing-data reasons appear in the table below.`,width:'100%',height:240});
  svg.append(svgNode('title',{},label));
  const keys=rate ? ['totalRate','republicanRate','democratRate'] : ['total','republican','democrat'];
  const colors=['#555b69','#d33c49','#2678ca'];
  const values=points.flatMap(p=>keys.map(k=>p[k])).filter(Number.isFinite),max=Math.max(1,...values)*1.12;
  const x=y=>58+(y-2006)/20*640,y=v=>198-v/max*170;
  if(Number.isInteger(selectedYear)) {svg.append(svgNode('line',{x1:x(selectedYear),x2:x(selectedYear),y1:20,y2:198,stroke:'#174e47','stroke-dasharray':'3 4','stroke-width':1.5}));svg.append(svgNode('text',{x:Math.min(640,Math.max(72,x(selectedYear))),y:15,'text-anchor':'middle','font-size':12,fill:'#174e47'},`Selected: ${selectedYear}`));}
  for (let i=0;i<=4;i++) {const v=max*i/4;svg.append(svgNode('line',{x1:58,x2:698,y1:y(v),y2:y(v),stroke:'#c9ced6','stroke-opacity':.45}));svg.append(svgNode('text',{x:52,y:y(v)+4,'text-anchor':'end','font-size':11,fill:'currentColor'},rate?`${v.toFixed(0)}%`:Math.round(v).toLocaleString()));}
  for (const year of [2006,2010,2014,2018,2022,2026]) svg.append(svgNode('text',{x:x(year),y:220,'text-anchor':'middle','font-size':11,fill:'currentColor'},year));
  keys.forEach((key,index)=>{let path='';let open=false;for(const p of points){if(!Number.isFinite(p[key])){open=false;continue;}path+=`${open?'L':'M'}${x(p.year)},${y(p[key])} `;open=true;const circle=svgNode('circle',{cx:x(p.year),cy:y(p[key]),r:3,fill:colors[index]});circle.append(svgNode('title',{},`${p.year}: ${['Total','Republican','Democratic'][index]} ${rate?pct(p[key]):fmt(p[key])}${p.provisional?' (provisional)':''}`));svg.append(circle);}svg.append(svgNode('path',{d:path,stroke:colors[index],fill:'none','stroke-width':2,'stroke-dasharray':index===0?'5 3':'none'}));});
  fig.append(svg);return fig;
}
/** Append beneath the selected facts card. Guard both selection changes and reused containers. */
export async function renderHistoryCharts(container, context, isCurrent = () => true) {
  const token=Symbol('history');container._historyToken=token;
  const current=()=>isCurrent() && container._historyToken===token;
  if (!OFFICE_LABELS[context.office]) return;
  const section=node('section',null,'history-chart-content');section.append(node('h3',`${OFFICE_LABELS[context.office]} history · 2006–2026`));section.append(node('p','Loading actual election cycles…','history-note'));container.replaceChildren(section);
  const id=String(context.id).padStart(context.level==='county'?5:2,'0');
  const [population,report]=await Promise.all([documentData('/data/population/counties.json').catch(()=>null),['house','senate'].includes(context.office) && context.level==='county' ? context.report || null : null]);
  if (!current()) return;
  const populations=(context.level==='state'?population?.states:population?.counties)?.[id] || [];
  const specialContract=report?.comparabilityContracts?.senateSpecials?.[id.slice(0,2)],senateContract=specialContract||report?.comparabilityContracts?.senateRounds?.[id.slice(0,2)];
  const reviewedSenate=context.office==='senate'&&context.level==='county'&&senateContract?.verified;
  const years=selectHistoryYears({...context,specialYears:specialContract?.verified?[2026]:[]});
  // Sequential loads bound in-flight memory; both underlying loaders and this merged view cache by cycle.
  const points=[];
  for(const year of years) {
    if (!current()) return;
    let counts;
    if(context.office==='house') counts=context.level==='county'?auditedHouseCounts(report,id,year):{reason:'Statewide House aggregation is not qualified by the county audit.'};
    else if(reviewedSenate&&[senateContract.baselineYear||2020,2026].includes(year))counts=auditedSenateRoundCounts(report,id,year);
    else {try {const data=await election(context.office,year);counts=qualifiedRaceCounts(data?.results,{...context,id,year});}catch {counts={reason:'Source file could not be loaded.'};}}
    points.push(historyPoint(year,counts,populations));
  }
  if (!current()) return;
  section.replaceChildren(node('h3',`${OFFICE_LABELS[context.office]} history · 2006–2026`));
  section.append(node('p',`${reviewedSenate?specialContract?'2022 and 2026 compare the same Senate seat; 2026 is a special vacancy election. Other years require unique regular general returns.':'2020 and 2026 use separately reviewed first-November Senate ballots; other years require unique regular general returns.':'Actual regular general-election cycles.'} Missing or held observations remain gaps. ${context.office==='senate'?'Different Senate seats may appear in different years; concurrent seats and ambiguous rounds are withheld. ':''}2026 counts remain provisional.`,'history-note'));
  if(reviewedSenate){const contract=senateContract;for(const limit of contract.comparisonNotes?.length?contract.comparisonNotes:contract.limitations||[])section.append(node('p',limit,'history-note'));}
  section.append(node('p','Legend: total race votes (gray dashed) · Republican (red) · Democratic (blue). No party nominee is shown as missing, not zero.','history-note'));
  if (!points.length) {section.append(node('p','No applicable election cycles are imported for this selection.'));return;}
  section.append(chart(points,false,'Reported candidate / write-in race votes',context.year),chart(points,true,'Race votes per 100 residents — a proxy, not turnout',context.year));
  section.append(node('p','Population includes children and other people ineligible to vote. Each ratio uses that election year’s dated estimate; 2026 uses the 2025 estimate. Missing exact-year population leaves a gap. Candidate votes are not ballots cast.','history-note'));
  const wrap=node('div',null,'history-table-wrap'),table=node('table',null,'history-table');table.append(node('caption',`${context.name || id}: actual source values, population dates and coverage gaps`));
  const head=node('thead'),hr=node('tr');for(const label of ['Year','Total race votes','Republican','Democratic','Resident estimate','Votes / residents (total / R / D)','Status / source']){const th=node('th',label);th.scope='col';hr.append(th);}head.append(hr);table.append(head);const body=node('tbody');
  for(const p of points){const row=node('tr');const year=node('th',String(p.year));year.scope='row';row.append(year);for(const text of [fmt(p.total),fmt(p.republican),fmt(p.democrat),p.population?`${fmt(p.population.value)} (${p.population.referenceDate || p.population.year})`:'Unavailable',`${pct(p.totalRate)} / ${pct(p.republicanRate)} / ${pct(p.democratRate)}`,p.reason || `${p.provisional?'Provisional':'Reported'} · ${(p.sourceIds || []).filter(Boolean).join(', ') || 'audited source'}`])row.append(node('td',text));body.append(row);}table.append(body);wrap.append(table);section.append(wrap);
}
