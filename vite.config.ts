import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    proxy: {
      '/__': {
        target: 'https://job-flow-06.firebaseapp.com',
        changeOrigin: true,
      }
    }
  }
});


