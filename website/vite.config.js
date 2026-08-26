import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiTarget = env.VITE_API_BASE_URL || 'http://localhost:8000';

  return {
    plugins: [react()],
    server: {
      port: 3000,
      host: true,
      proxy: {
        // In dev, /api/* is proxied to the FastAPI backend.
        // In production the React app uses VITE_API_BASE_URL directly.
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    preview: {
      port: 4173,
      host: true,
    },
  };
});
