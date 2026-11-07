import {defineConfig} from 'vite';
import {fileURLToPath} from 'node:url';
import {winnersPrerenderPlugin} from './scripts/prerender-winners.mjs';
import {accountabilityPrerenderPlugin} from './scripts/prerender-accountability.mjs';
export default defineConfig({plugins:[winnersPrerenderPlugin(),accountabilityPrerenderPlugin()],build:{rollupOptions:{input:{
  map:fileURLToPath(new URL('./index.html',import.meta.url)),
  winners:fileURLToPath(new URL('./winners/index.html',import.meta.url)),
  accountability:fileURLToPath(new URL('./accountability/index.html',import.meta.url)),
}}}});
