import fs from 'node:fs';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {renderAccountability,renderAccountabilityJumpLinks,renderAccountabilityIntroduction,accountabilitySummary,escapeAccountabilityHtml} from '../src/accountability-render.js';
import {validateAccountability} from '../src/accountability-data.js';

const file=fileURLToPath(new URL('../public/data/candidates/pilot-2026.json',import.meta.url));
export function prerenderAccountability(html,{base='/'}={}) {
  if(!html.includes('<!--vmap:accountability-candidates-->'))return html;
  const bytes=fs.readFileSync(file),data=JSON.parse(bytes);
  validateAccountability(data);
  const hash=crypto.createHash('sha256').update(bytes).digest('hex');
  return html.replace('<!--vmap:accountability-candidates-->',renderAccountability(data,{base}))
    .replace('<!--vmap:accountability-summary-->',escapeAccountabilityHtml(accountabilitySummary(data)))
    .replace('<!--vmap:accountability-jump-links-->',renderAccountabilityJumpLinks(data))
    .replace('<!--vmap:accountability-introduction-->',renderAccountabilityIntroduction(data))
    .replace('data-prerender-sha=""',`data-prerender-sha="${hash}"`);
}
export function accountabilityPrerenderPlugin() {
  let base='/';
  return {name:'vmap-accountability-pilot-html',configResolved(config){base=config.base;},transformIndexHtml:{order:'pre',handler(html){return prerenderAccountability(html,{base});}}};
}
