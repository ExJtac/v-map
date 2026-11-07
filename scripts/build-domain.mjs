/** Build the dedicated V-Map domain without changing the CAS-TX artifact. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {build} from 'vite';
import {buildSeoOutputs} from './build-seo-pages.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = path.join(root, 'dist-domain');
const previousOrigin = 'https://cas-tx.com/vmap/';
const origin = 'https://voteranomaly.com/';
const {outputs} = buildSeoOutputs();
for (const [file, expected] of Object.entries(outputs)) {
  assert.equal(fs.readFileSync(path.join(root, file), 'utf8'), expected, `Stale SEO source: ${file}`);
}
await build({root, base: '/', build: {outDir: target, emptyOutDir: true}});
for (const file of ['index.html', 'winners/index.html', 'about/index.html', 'methodology/index.html', 'coverage/index.html', 'sitemap.xml', 'llms.txt']) {
  const location = path.join(target, file);
  const content = fs.readFileSync(location, 'utf8');
  assert.ok(content.includes(previousOrigin), `Missing original canonical origin: ${file}`);
  fs.writeFileSync(location, content.replaceAll(previousOrigin, origin));
}
fs.writeFileSync(path.join(target, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${origin}sitemap.xml\n`);
const html = fs.readFileSync(path.join(target, 'index.html'), 'utf8');
assert.ok(html.includes(`<link rel="canonical" href="${origin}"`));
assert.ok(!html.includes('/vmap/'), 'Dedicated-domain links must use root paths.');
for (const [, asset] of html.matchAll(/(?:src|href)="(\/[^"?#]+)"/g)) {
  assert.ok(fs.existsSync(path.join(target, asset)), `Missing root asset: ${asset}`);
}
console.log(JSON.stringify({origin, directory: 'dist-domain', existingCasBuildUnchanged: true}));
