import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Für GitHub Pages wird BASE_PATH (z. B. /lernito/) im Workflow gesetzt; lokal bleibt es '/'.
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  base,
  plugins: [
    react(),
    // Sprachen-App und MathLens nutzen ihr eigenes Manifest, nicht das von Lernito.
    {
      name: 'sprachen-eigenes-manifest',
      enforce: 'post',
      generateBundle: {
        order: 'post',
        handler(_opts, bundle) {
          for (const name of ['sprachen/index.html', 'mathlens/index.html']) {
            const page = bundle[name];
            if (page && page.type === 'asset') {
              page.source = String(page.source).replace(/<link rel="manifest" href="[^"]*?\/manifest\.webmanifest"[^>]*>/g, (m) => (m.includes('./manifest') ? m : ''));
            }
          }
        }
      }
    },
    VitePWA({
      // Im relativen Vorschau-Build ohne festen Pfad gibt es keinen Service Worker.
      disable: base === './',
      registerType: 'prompt',
      includeAssets: ['favicon.png', 'apple-touch-icon.png', 'icons/*.png', 'puppy/*'],
      manifest: {
        name: 'Lernito',
        short_name: 'Lernito',
        description: 'Lernito School (Kids und Teen) und Lernito Adult: lernen mit Puppy, auf Deutsch und Italienisch.',
        lang: 'de-DE',
        start_url: base,
        scope: base,
        display: 'standalone',
        orientation: 'any',
        background_color: '#FFF8E7',
        theme_color: '#FFB627',
        categories: ['education', 'kids'],
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2,webmanifest}'],
        // Texterkennung (~7 MB) nicht vorab laden, sondern erst bei der ersten Nutzung zwischenspeichern
        globIgnores: ['ocr/**'],
        runtimeCaching: [{
          urlPattern: ({ url }) => url.pathname.includes('/ocr/'),
          handler: 'CacheFirst',
          options: { cacheName: 'lernito-ocr', expiration: { maxEntries: 10 } }
        }],
        navigateFallback: `${base}index.html`,
        // Die Sprachen-App hat ihre eigene Startseite
        navigateFallbackDenylist: [new RegExp(`^${base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(sprachen|mathlens)/`)],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024
      },
      devOptions: { enabled: false }
    })
  ],
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      // Drei Apps: Lernito (index.html), Lernito Sprachen (sprachen/index.html) und MathLens (mathlens/index.html)
      input: { main: 'index.html', sprachen: 'sprachen/index.html', mathlens: 'mathlens/index.html' },
      output: {
        manualChunks: {
          three: ['three', '@react-three/fiber'],
          react: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion']
        }
      }
    }
  }
});
