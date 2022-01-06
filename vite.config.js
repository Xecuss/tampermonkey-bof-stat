import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import Banner from 'vite-plugin-banner'
import { resolve } from 'path'
import { readFileSync } from 'fs'

function generateTampermonkeyMeta() {
  let metaStr = '// ==UserScript==\n'
  const pkg = JSON.parse(readFileSync('package.json').toString())
  const { tampermonkey, license, author, version, description } = pkg
  const meta = { ...tampermonkey, license, author, description, version }
  const keys = Object.getOwnPropertyNames(meta)
  const maxLength = keys.reduce((prev, curr) => curr.length > prev ? curr.length : prev, 0)
  const whiteSpace = maxLength + 2
  metaStr += keys.map(key => `// @${(key + ' '.repeat(whiteSpace)).slice(0, whiteSpace)}${meta[key]}`).join('\n')
  return metaStr + '\n// ==/UserScript==\n/* svelte app */'
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), Banner(generateTampermonkeyMeta())],
  resolve: {
    alias: [{find: 'src', replacement: resolve('src')}]
  },
  build: {
    target: 'es2017',
    minify: false,
    lib: {
      name: 'bofStat',
      entry: resolve('src/main.ts'),
      formats: ['iife']
    },
    rollupOptions: {
      output: {
        banner: '/*! 123 */'
      }
    }
  }
})
