import { defineConfig } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({ template:'network', filename: 'dist/stats.html', gzipSize: true, brotliSize: true }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo/*', 'favicon.ico'],
      manifest: {
        name: '二手交易分析儀表板',
        short_name: 'Dashboard',
        theme_color: '#0f172a',
        icons: [
          {
            src: '/pwa-192.png',
            sizes: '192x192',
            type: 'image/png',
          }, 
          {
            src: '/pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),  // 把 '@' 映射到 src/
    },
  },
  build: {
    target: 'esnext',
    cssCodeSplit: true,
    sourcemap: false,
    modulePreload: false,
    rollupOptions: {
      output:{
        manualChunks(id) {
            if (!id.includes('node_modules')) return
            if (id.includes('recharts')) return 'recharts'
            if (id.includes('lucide-react')) return 'icons'
            if (id.includes('react') || id.includes('react-dom')) return 'react-vendor'
            return 'vendor'
        },
      }
    }
  }
})
