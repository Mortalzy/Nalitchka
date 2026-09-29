import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
const here = dirname(fileURLToPath(import.meta.url))
export default defineConfig({server: {proxy: {'/api': 'http://localhost:3001'}}, build: {outDir: resolve(here, '../server/public'), emptyOutDir: true}})
