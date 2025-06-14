import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon-16x16.png',
        'favicon-32x32.png',
        'robots.txt',
        'pwa-192x192.png',
        'pwa-512x512.png',
        'pwa-1024x1024.png'
      ],
      manifest: {
        name: 'Vegas App',
        short_name: 'Vegas',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        description: 'Your offline-ready Vegas trip companion',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/pwa-1024x1024.png',
            sizes: '1024x1024',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        screenshots: [
          {
            src: '/screenshots/screenshot1.png',
            sizes: '540x720',
            type: 'image/png',
            form_factor: 'wide'
          }
        ],
        id: '/'
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,json,ics}'],
        runtimeCaching: [
          {
            urlPattern: /.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'app-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ]
})
