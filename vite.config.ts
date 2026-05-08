import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/rs-react-2026/',               
  build: {
    outDir: 'dist'
  }
})
