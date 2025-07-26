import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://127.0.0.1:8000/',
      '^/ws/.*': {
        target: 'ws://127.0.0.1:8000',
        ws: true,  // Enable WebSocket proxying
        changeOrigin: true,
      }
    }
  },
})
