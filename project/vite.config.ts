import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import { VitePWA } from 'vite-plugin-pwa';

const isExtension = process.env.IS_EXTENSION === 'true';

export default defineConfig({
  plugins: [
    react()
    // Removed VitePWA to prevent Workbox service worker registration
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});