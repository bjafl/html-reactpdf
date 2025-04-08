import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'HtmlToReactPdf',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@react-pdf/renderer'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@react-pdf/renderer': 'ReactPDF'
        }
      }
    }
  }
})
