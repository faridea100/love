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
        id: '/',                      // ✅ Add this line
        start_url: '/',
        display: 'standalone',
        background_color: '#071a2e',
        theme_color: '#007aff',
        lang: 'en',
        scope: '/',
        orientation: 'portrait',
        icons: [
         
          {
            src: '/assets/icons/icon-512x512.png',
            sizes: '512x512',
            type: "image/png",
          },
          {
            src: '/assets/icons/icon-512x512.jpg',
            sizes: '512x512',
            type: "image/jpeg",
          },
          {
            src: '/assets/icons/icon-512x512.svg',
            sizes: '512x512',
            type: "image/svg",
          },
           {
            src: '/assets/icons/icon-192x192.png',
            sizes: '192x192',
            type: "image/png",
          },
          {
            src: '/assets/icons/icon-192x192.jpg',
             sizes: '192x192',
            type: "image/jpeg",
          },
           {
            src: '/assets/icons/icon-192x192.svg',
             sizes: '192x192',
            type: "image/svg",
          },
          {
            src: '/assets/icons/icon-144x144.png',
            sizes: '144x144',
            type: "image/png",
          },
          {
            src: '/assets/icons/icon-144x144.jpg',
             sizes: '144x144',
            type: "image/jpeg",
          },
          {
            src: '/assets/icons/icon-144x144.svg',
            sizes: '144x144',
            type: "image/svg",
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
          },
          {
            src: "/assets/screenshots/home.png",
            sizes: "600x849",
            type: "image/png",
            form_factor: "wide",
          },
          {
            src: "/assets/screenshots/mobile-view.png",
            sizes: "600x849",
            type: "image/png",
            form_factor: "narrow"
          }
        ]
      },
    }),
  ],
});
