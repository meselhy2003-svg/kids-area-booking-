import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: 'https://backend-ados.vercel.app',
        changeOrigin: true,
        secure: false
      },
      '/media': {
        target: 'https://backend-ados.vercel.app',
        changeOrigin: true,
        secure: false
      },
      '/upload-image': {
        target: 'https://backend-ados.vercel.app',
        changeOrigin: true,
        secure: false
      },
      '/delete-image': {
        target: 'https://backend-ados.vercel.app',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
