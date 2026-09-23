import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

function appRewritePlugin() {
  return {
    name: 'app-rewrite-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || ''
        if (url === '/app' || url === '/app/' || (url.startsWith('/app/') && !url.includes('.'))) {
          req.url = '/app/index.html'
        }
        next()
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || ''
        if (url === '/app' || url === '/app/' || (url.startsWith('/app/') && !url.includes('.'))) {
          req.url = '/app/index.html'
        }
        next()
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), appRewritePlugin()],
  build: {
    rollupOptions: {
      input: {
        landing: resolve(__dirname, 'index.html'),
        app: resolve(__dirname, 'app/index.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: false,
  },
})
