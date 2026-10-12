import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import path from 'path';

export default defineConfig(() => {
  return {
    plugins: [
      TanStackRouterVite(),
      react(),
      tailwindcss()
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    clearScreen: false,
    server: {
      port: 3000,
      strictPort: true,
      host: process.env.TAURI_DEV_HOST || '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      proxy: {
        '/dukcapil': {
          target: 'https://172.16.160.177:8000',
          changeOrigin: true,
          secure: false,
        }
      }
    },
    envPrefix: ['VITE_', 'TAURI_ENV_*'],
    build: {
      target: process.env.TAURI_ENV_PLATFORM === 'windows' ? 'chrome105' : 'safari13',
      minify: !process.env.TAURI_ENV_DEBUG ? ('esbuild' as const) : false,
      sourcemap: !!process.env.TAURI_ENV_DEBUG,
    },
  };
});
