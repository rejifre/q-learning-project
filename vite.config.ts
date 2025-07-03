import { defineConfig } from 'vite';

export default defineConfig({
  // Configuração para GitHub Pages
  base: '/q-learning-project/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    fs: {
      strict: false,
    },
  },
});
