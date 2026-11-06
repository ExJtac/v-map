import assert from 'node:assert/strict';
import { appUrl } from '../src/paths.js';
assert.equal(appUrl('/data/elections/manifest.json', '/'), '/data/elections/manifest.json');
assert.equal(appUrl('/data/elections/manifest.json', '/vmap/'), '/vmap/data/elections/manifest.json');
assert.equal(appUrl('data/population/counties.json', '/vmap'), '/vmap/data/population/counties.json');
console.log('Root and nested deployment URL checks passed.');
