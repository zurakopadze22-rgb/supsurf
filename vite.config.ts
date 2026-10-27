import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'express-api-server',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          try {
            delete require.cache[require.resolve('./index.js')];
            const expressApp = require('./index.js');
            return expressApp(req, res, next);
          } catch (e) {
            console.error('Failed to dispatch to Express API:', e);
            next();
          }
        });
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
  server: {
    port: 3000,
  },
});

