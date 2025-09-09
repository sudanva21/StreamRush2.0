import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true, // Enable external access (required for ngrok)
    strictPort: true, // Use exact port specified
    cors: true, // Enable CORS for external access
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'https://stream-rush.vercel.app/' // 👈 add your ngrok domain here
    ]
  },
  preview: {
    port: 4173,
    host: true, // Enable external access for preview mode
    strictPort: true,
    cors: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})