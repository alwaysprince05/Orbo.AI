import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    // Serve index.html for all unknown routes (SPA routing fix)
    historyApiFallback: true,
  },
  preview: {
    port: 4173,
    host: true,
    // Also fix refresh in `vite preview` (production preview)
    historyApiFallback: true,
  },
});

