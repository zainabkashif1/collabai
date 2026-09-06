import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Forwards /api/* to the Express backend during local dev so the
      // frontend can call relative paths without CORS/env juggling.
      '/api': 'http://localhost:5000',
    },
  },
})
