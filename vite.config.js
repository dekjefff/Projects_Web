import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // เมื่อเรียก /api/อะไรก็ตาม จะถูกส่งไปที่ http://localhost:3030/api/อะไรก็ตาม
      '/api': 'http://localhost:3030' 
    }
  }
})
