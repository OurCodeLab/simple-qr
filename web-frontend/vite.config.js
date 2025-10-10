import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Optimize chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor libraries
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor';
            }
            if (id.includes('framer-motion')) {
              return 'motion';
            }
            if (id.includes('react-icons')) {
              return 'icons';
            }
            if (id.includes('react-router')) {
              return 'router';
            }
            // Other node_modules
            return 'vendor-misc';
          }
        }
      }
    },
    // Reduce chunk size warnings
    chunkSizeWarningLimit: 500,
    // Enable minification with options
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Disable source maps for production
    sourcemap: false,
    // Optimize assets - inline smaller files
    assetsInlineLimit: 2048,
    // Target modern browsers for smaller bundles
    target: 'es2015'
  },
  // Performance optimizations
  server: {
    // Enable gzip compression in dev
    middlewareMode: false,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'framer-motion',
      'react-router-dom',
      'react-icons/fa',
      'react-icons/md',
      'react-icons/io5'
    ],
    // Exclude large dependencies that should be loaded on demand
    exclude: ['react-lottie']
  },
  // Enable tree shaking
  define: {
    'process.env.NODE_ENV': '"production"'
  }
})
