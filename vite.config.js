/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

// https://vite.dev/config/
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

const isStorybook = process.env.STORYBOOK === '1';

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), visualizer({
    // template: 'network',
    filename: 'dist/stats.html',
    gzipSize: true,
    brotliSize: true
  }),
  !isStorybook && mode === 'production' ? VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['logo/*', 'favicon.ico'],
    manifest: {
      name: '二手交易分析儀表板',
      short_name: 'Dashboard',
      theme_color: '#0f172a',
      icons: [{
        src: '/pwa-192.png',
        sizes: '192x192',
        type: 'image/png'
      }, {
        src: '/pwa-512.png',
        sizes: '512x512',
        type: 'image/png'
      }],
      workbox: {
        // 重要：不要把 /storybook/* 的導覽fallback到 /index.html
        navigateFallbackDenylist: [/^\/storybook\//],
        globIgnores: ['**/storybook/**'],
      },
    }
  }) : undefined
  ],
  optimizeDeps: {
    include: ["lodash-es"],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // 把 '@' 映射到 src/
      lodash: "lodash-es",
    }
  },
  build: {
    target: 'esnext',
    cssCodeSplit: true,
    sourcemap: false,
    modulePreload: false,
    minify:'esbuild',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('react-router-dom') || id.includes('react-router') || id.includes('@remix-run/router') ) {
            return 'router'
          }
          if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'react-vendor'
          if (id.includes('recharts')) return 'recharts'
          if (/(^|\/)d3[-/]/.test(id)) return 'd3'
          if (id.includes('lucide-react')) return 'icons'
          return 'vendor'
        }
      }
    }
  },
  test: {
    projects: [{
      extends: true,
      plugins: [
        // The plugin will run tests for the stories defined in your Storybook config
        // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
        storybookTest({
          configDir: path.join(dirname, '.storybook')
        })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: 'playwright',
          instances: [{
            browser: 'chromium'
          }]
        },
        setupFiles: ['.storybook/vitest.setup.ts']
      }
    }]
  }
}));