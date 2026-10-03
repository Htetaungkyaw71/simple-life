import { defineConfig } from 'vite';
export default defineConfig({ base: './', build: { target: 'es2020', rollupOptions: { output: { manualChunks: { phaser: ['phaser'] } } }, chunkSizeWarningLimit: 1500 } });
