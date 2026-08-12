import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Netlify serves the app from the domain root. GitHub Pages uses the
  // repository subpath via the dedicated build script in package.json.
  base: '/',
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
  optimizeDeps: {
    include: [
      'three',
      'three/examples/jsm/controls/OrbitControls',
      'three/examples/jsm/loaders/GLTFLoader',
      'three/examples/jsm/libs/stats.module'
    ]
  },
  resolve: {
    alias: {
      'three/examples/js/libs/stats.min': 'three/examples/jsm/libs/stats.module'
    }
  }
})