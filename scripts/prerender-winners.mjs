import fs from 'node:fs';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {orderCandidates} from '../src/winner-record.js';
import {renderGroupedCandidates,renderOfficeNavigation,escapeHtml,directorySummary} from '../src/winner-render.js';
const file=fileURLToPath(new URL('../public/data/winners/2026.json',import.meta.url));
export function prerenderWinners(html,{base='/'}={}){
  if(!html.includes('<!--vmap:candidates-->'))return html;
  const bytes=fs.readFileSync(file),data=JSON.parse(bytes);
  const rows=orderCandidates(data.results.filter(row=>row.leader));
  if(data.year!==2026||rows.length!==data.counts.leaders)throw Error('Unqualified prerender input.');
  const hash=crypto.createHash('sha256').update(bytes).digest('hex');
  const profiles=JSON.parse(fs.readFileSync(new URL('../public/data/candidates/profile-cards-2026.json',import.meta.url),'utf8')).profiles;
  return html.replace('<!--vmap:candidates-->',renderGroupedCandidates(rows,{year:data.year,base,profiles}))
    .replace('<!--vmap:office-nav-->',renderOfficeNavigation(data))
    .replace('<!--vmap:summary-->',escapeHtml(directorySummary(data,rows.length)))
    .replace('data-prerender-sha=""',`data-prerender-sha="${hash}"`);
}
export function winnersPrerenderPlugin(){
  let base='/';return {name:'vmap-qualified-directory-html',configResolved(config){base=config.base;},transformIndexHtml:{order:'pre',handler(html){return prerenderWinners(html,{base});}}};
}
