import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev: /api is proxied to localhost:4000 — no CORS, no env vars needed locally.
// Production (Vercel): VITE_API_URL env variable points to the Render backend URL.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { '/api': 'http://localhost:4000' },
  },
});
