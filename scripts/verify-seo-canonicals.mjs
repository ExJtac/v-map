/** Identity and mount checks for the two independently packaged V-Map origins. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const PRIMARY_ORIGIN = 'https://voteranomaly.com/';
const pages = [
  {route:'', file:'index.html', source:'index.html'},
  {route:'winners/', file:'winners/index.html', source:'winners/index.html'},
  {route:'about/', file:'about/index.html', source:'public/about/index.html'},
  {route:'methodology/', file:'methodology/index.html', source:'public/methodology/index.html'},
  {route:'coverage/', file:'coverage/index.html', source:'public/coverage/index.html'},
];
function tags(html) {
  return [...html.matchAll(/<(?:meta|link)\b[^>]*>/gi)].map(([tag]) => Object.fromEntries(
    [...tag.matchAll(/([\w:-]+)\s*=\s*["']([^"']*)["']/g)].map(([,name,value])=>[name.toLowerCase(),value]),
  ));
}
export function verifyPageIdentity(html, route, label) {
  const expected = PRIMARY_ORIGIN + route, attributes = tags(html);
  const canonical = attributes.filter(tag=>tag.rel==='canonical');
  assert.equal(canonical.length,1,`${label}: one canonical required`);
  assert.equal(canonical[0].href,expected,`${label}: canonical must use the primary identity`);
  const og = attributes.filter(tag=>tag.property==='og:url');
  assert.equal(og.length,1,`${label}: one Open Graph URL required`);
  assert.equal(og[0].content,expected,`${label}: Open Graph URL must match the canonical`);
  for(const [attribute,name] of [['property','og:image'],['name','twitter:image']]) {
    const images=attributes.filter(tag=>tag[attribute]===name);
    assert.equal(images.length,1,`${label}: one ${name} required`);
    assert.equal(images[0].content,PRIMARY_ORIGIN+'share/v-map-logo-v2.png',`${label}: primary logo preview required`);
  }
  for(const [,body] of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    const value = JSON.parse(body);
    for(const node of Array.isArray(value)?value:[value]) {
      if(['WebPage','WebApplication'].includes(node['@type']) && node.url)assert.equal(node.url,expected,`${label}: structured page identity must match`);
    }
  }
}
function sitemap(file,label) {
  const body=fs.readFileSync(file,'utf8'),locations=[...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
  assert.equal(locations.length,pages.length,`${label}: exactly five canonical sitemap entries required`);
  assert.deepEqual([...locations].sort(),pages.map(page=>PRIMARY_ORIGIN+page.route).sort(),`${label}: sitemap must contain only primary page identities`);
}
function mountedAssets(html,directory,base,label) {
  for(const [,raw] of html.matchAll(/(?:src|href)=["'](\/[^"']*)["']/g)) {
    if(raw.startsWith('//'))continue;
    const url = new URL(raw,'https://artifact.invalid'),relative=url.pathname;
    assert.ok(relative.startsWith(base),`${label}: local path escaped ${base}: ${relative}`);
    const file=path.join(root,directory,relative.slice(base.length));
    assert.ok(fs.existsSync(file),`${label}: missing packaged target ${relative}`);
    if(fs.statSync(file).isDirectory())assert.ok(fs.existsSync(path.join(file,'index.html')),`${label}: missing directory index ${relative}`);
  }
}

export function verifySeoCanonicals({source=true,directories=['dist','dist-domain'],requireArtifacts=false}={}) {
  if(source) {
    for(const page of pages)verifyPageIdentity(fs.readFileSync(path.join(root,page.source),'utf8'),page.route,page.source);
    sitemap(path.join(root,'public/sitemap.xml'),'source');
    assert.ok(!fs.readFileSync(path.join(root,'public/llms.txt'),'utf8').includes('https://cas-tx.com/vmap/'),'llms navigation must use the primary domain');
  }
  const checked=[];
  for(const directory of directories) {
    if(!fs.existsSync(path.join(root,directory,'index.html'))) {
      assert.ok(!requireArtifacts,`Missing required artifact ${directory}`);continue;
    }
    const base=directory==='dist'?'/vmap/':'/';
    for(const page of pages) {
      const html=fs.readFileSync(path.join(root,directory,page.file),'utf8');
      verifyPageIdentity(html,page.route,`${directory}/${page.file}`);
      mountedAssets(html,directory,base,`${directory}/${page.file}`);
    }
    sitemap(path.join(root,directory,'sitemap.xml'),directory);
    assert.ok(fs.existsSync(path.join(root,directory,'share/v-map-logo-v2.png')),`${directory}: logo must remain packaged`);
    if(directory==='dist-domain')assert.ok(fs.readFileSync(path.join(root,directory,'robots.txt'),'utf8').includes(`Sitemap: ${PRIMARY_ORIGIN}sitemap.xml`),'Dedicated-domain robots must advertise the primary sitemap');
    checked.push(directory);
  }
  return {status:'passed',sourceChecked:source,artifactDirectories:checked,canonicalPagesPerArtifact:pages.length,primaryOrigin:PRIMARY_ORIGIN};
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(verifySeoCanonicals({directories:process.argv.includes('--sources')?[]:undefined,requireArtifacts:process.argv.includes('--require-artifacts')})));
}
