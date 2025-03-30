import legacy from '@vitejs/plugin-legacy';
import autoprefixer from 'autoprefixer';
import { defineConfig } from 'vite';
import generateFile from 'vite-plugin-generate-file';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  build: {
    sourcemap: true,
  },
  server: {
    host: '0.0.0.0',
  },
  plugins: [
    tsconfigPaths(),
    legacy({
      targets: ['Safari 8'],
    }),
    generateFile([
      {
        type: 'json',
        output: './build.json',
        data: { buildTime: Date.now() },
      },
    ]),
  ],
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
});
