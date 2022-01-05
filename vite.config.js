import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
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
        banner: '//123'
      }
    }
  }
})
