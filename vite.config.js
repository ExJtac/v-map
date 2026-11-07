import {defineConfig} from 'vite';
import {fileURLToPath} from 'node:url';
import {winnersPrerenderPlugin} from './scripts/prerender-winners.mjs';
export default defineConfig({plugins:[winnersPrerenderPlugin()],build:{rollupOptions:{input:{
  map:fileURLToPath(new URL('./index.html',import.meta.url)),
  winners:fileURLToPath(new URL('./winners/index.html',import.meta.url)),
}}}});
