import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'out/main',
    lib: {
      entry: 'src/main/index.js',
      formats: ['cjs']
    },
    rollupOptions: {
      external: ['electron']
    }
  }
})
