import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import browserslistToEsbuild from 'browserslist-to-esbuild'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: browserslistToEsbuild(['>0.2%', 'not dead', 'not op_mini all']),
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('@azure/identity') || id.includes('@azure/storage-blob')) return '@azure'
          if (
            id.includes('react-phone-input-2') ||
            id.includes('react-webcam') ||
            id.includes('react-accessible-accordion') ||
            id.includes('react-toastify')
          )
            return '@react-func'
          if (
            id.includes('@tanstack/react-query') ||
            id.includes('@tanstack/react-query-devtools')
          )
            return '@tanstack'
        }
      }
    }
  },
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 3000
  },
  preview: {
    port: 3000
  }

})
