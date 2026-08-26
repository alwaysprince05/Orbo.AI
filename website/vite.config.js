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

      // ── SPA fallback: serve index.html for any unknown path ────────────────
      // Without this, refreshing on /recommend, /about-us, etc. returns 404
      // because the browser asks the dev server for that path directly.
      historyApiFallback: true,

      proxy: {
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
      // Same fix for `vite preview` (production preview mode)
      historyApiFallback: true,
    },
  };
});
