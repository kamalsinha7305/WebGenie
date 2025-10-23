
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // This proxies requests from /api to your backend server
      '/api': {
        target: 'http://localhost:3001', // Your backend server URL
        changeOrigin: true,
      },
    }
  }
})