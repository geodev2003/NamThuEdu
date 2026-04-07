import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
  ],
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

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
