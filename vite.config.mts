import tailwindcss from '@tailwindcss/vite';
import legacy from '@vitejs/plugin-legacy';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    legacy({
      targets: ['Safari 8'],
    }),
  ],
});
