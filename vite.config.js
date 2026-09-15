import { defineConfig } from 'vite';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react-swc';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SPLUNK_APP_ID = 'conf2026';

export const viteResolveAlias = {
  $components: resolve(__dirname, './src/components'),
  $pages: resolve(__dirname, './src/pages'),
  $hooks: resolve(__dirname, './src/hooks'),
};

export const viteConfigObj = {
  resolve: { alias: viteResolveAlias },
};

export default defineConfig(({ mode }) => ({
  base: mode === 'development' ? '/' : `/en-US/static/app/${SPLUNK_APP_ID}/dist/`,
  resolve: { alias: viteResolveAlias },
  plugins: [react()],
  server: { port: 3001 },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    coverage: {
      clean: true,
      cleanOnRerun: true,
      reportsDirectory: './coverage',
    },
  },
  build: {
    outDir: 'app/appserver/static/dist/',
    emptyOutDir: true,
  },
}));
