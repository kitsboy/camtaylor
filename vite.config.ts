import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('framer-motion')) return 'vendor-motion'
          if (id.includes('@formspree')) return 'vendor-forms'
          if (id.includes('node_modules/react') || id.includes('react-router')) return 'vendor-react'
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
})