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
  build: {
    // rollupOptions: {
    //   external: Object.keys(pkg.dependencies || {}),
    // },
    outDir: "static/out"
  },
  optimizeDeps: {
    include: ['lodash'] 
  }
})
