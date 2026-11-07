/** Build the dedicated V-Map domain without changing the CAS-TX artifact. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {build} from 'vite';
import {buildSeoOutputs} from './build-seo-pages.mjs';
import {verifySeoCanonicals, PRIMARY_ORIGIN} from './verify-seo-canonicals.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = path.join(root, 'dist-domain');
const origin = PRIMARY_ORIGIN;
const {outputs} = buildSeoOutputs();
for (const [file, expected] of Object.entries(outputs)) {
  assert.equal(fs.readFileSync(path.join(root, file), 'utf8'), expected, `Stale SEO source: ${file}`);
}
await build({root, base: '/', build: {outDir: target, emptyOutDir: true}});
fs.writeFileSync(path.join(target, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${origin}sitemap.xml\n`);
const verified=verifySeoCanonicals({directories:['dist-domain'],requireArtifacts:true});
console.log(JSON.stringify({origin, directory: 'dist-domain', existingCasBuildUnchanged: true, canonicalChecks:verified}));
