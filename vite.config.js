import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': 'https://23e2-119-161-98-68.ngrok-free.app'
    }
  },
  plugins: [react()],
})
