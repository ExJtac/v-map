import {defineConfig} from 'vite';
import {fileURLToPath} from 'node:url';
export default defineConfig({build:{rollupOptions:{input:{
  map:fileURLToPath(new URL('./index.html',import.meta.url)),
  winners:fileURLToPath(new URL('./winners/index.html',import.meta.url)),
}}}});
