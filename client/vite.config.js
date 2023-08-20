import { defineConfig, optimizeDeps } from 'vite'
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
    outDir: "static/out",
    watch: {},
// DEBUG OPTIONS
    minify: false,
    sourcemap: "inline",
// DEBUG OPTIONS
  },
  optimizeDeps: {
    include: ['lodash'] 
  }
})
