import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, "src/renderer"),
  base: "./",
  build: {
    outDir: path.resolve(__dirname, "out/renderer"),
    rollupOptions: {
      // Exclude native Node modules from Vite bundle
      external: ["extract-file-icon", "node-window-manager", "child_process"]
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src/renderer")
    }
  },
  server: {
    port: 5173
  }
});
