import { defineConfig, optimizeDeps } from 'vite'
import pkg from './package.json'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  css: {
  },
  minify: false,
  sourcemap: true,
  base: "/static/",
  build: {
    // rollupOptions: {
    //   external: Object.keys(pkg.dependencies || {}),
    // },
    rollupOptions: {
      input: {
        app: 'game.html',
      },
      output: {
        assetFileNames: 'site.css',
        entryFileNames: 'site.js',
        chunkFileNames: 'chunks.js',
        manualChunks: undefined,
      },
    },
    outDir: "static/out"
  },
  optimizeDeps: {
    include: ['lodash'] 
  }
})
