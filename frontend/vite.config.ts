import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
  ],
  optimizeDeps: {
    exclude: ['pdfjs-dist'],
  },
  build: {
    chunkSizeWarningLimit: 2500,
  },
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
      // Work around corrupted framer-motion ESM entry in current environment.
      'framer-motion': path.resolve(__dirname, './node_modules/framer-motion/dist/cjs/index.js'),
    },
  },

  server: {
    proxy: {
      '/storage': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/address-kit-api': {
        target: 'https://production.cas.so',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/address-kit-api/, '/address-kit'),
      },
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
