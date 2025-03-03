import legacy from '@vitejs/plugin-legacy';
import autoprefixer from 'autoprefixer';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [
    tsconfigPaths(),
    legacy({
      targets: ['Safari 8'],
    }),
  ],
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
});
