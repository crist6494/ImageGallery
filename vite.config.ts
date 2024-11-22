
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        gallery: './src/gallery/gallery.html',
      },
    },
    outDir: 'dist',
  },
  server: {
    port:4173
  }
});