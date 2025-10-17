import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, 'src/renderer'),
  base: './', // critical for Electron file paths
  publicDir: path.resolve(__dirname, 'public'), // ✅ tells Vite where to find textures, icons, etc.
  build: {
    outDir: path.resolve(__dirname, 'out/renderer'),
    emptyOutDir: true, // ensures clean builds
  },
  server: {
    port: 5173,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/renderer'),
    },
  },
})
