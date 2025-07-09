// vite.config.ts
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  build: {
    target: ['es2020'],
  },
  resolve: {
    mainFields: ['module'],
  },
  plugins: [
    angular({
      inlineStylesExtension: 'scss',
    }),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'FashionLove',
        short_name: 'FashionLove',
        start_url: '/',
        display: 'standalone',
        background_color: '#071a2e',
        theme_color: '#007aff',
        lang: 'en',
        scope: '/',
        orientation: 'portrait',
        icons: [
          {
            src: '/assets/icons/icon-192x192.png',
            sizes: '192x192',
            type: "image/jpeg",
          },
          {
            src: '/assets/icons/icon-512x512.jpg',
            sizes: '512x512',
            type: "image/jpeg",
          },
          {
            src: '/assets/icons/icon-512x512.jpg',
            sizes: '512x512',
            type: "image/jpeg",
            purpose: 'any maskable',
          },
        ],
        screenshots: [
          {
            src: "/assets/screenshots/home.jpg",
            sizes: "600x849",
            type: "image/jpeg",
            form_factor: "wide",
          },
          {
            src: "/assets/screenshots/mobile-view.jpg",
            sizes: "600x849",
            type: "image/jpeg",
            form_factor: "narrow"
          }
        ]
      },
    }),
  ],
});
