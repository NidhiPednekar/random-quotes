import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon.png', 'icons/icon2.png', 'offline.html'],
      manifest: {
        name: 'Random Quotes Machine',
        short_name: 'Quotes',
        start_url: '.',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
          {
            src: 'icons/icon.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon2.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'document',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages',
              expiration: { maxEntries: 10 }
            }
          }
        ],
        navigateFallback: '/offline.html'
      }
    })
  ],
  base: '/random-quotes/' // Important for GitHub Pages
})
