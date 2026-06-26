import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const base = env.VITE_BASE || '/'

  return {
    base,
    plugins: [
      react(),
      VitePWA({
        strategies: 'injectManifest',
        srcDir: 'src',
        filename: 'sw.ts',
        registerType: 'autoUpdate',
        injectManifest: {
          globPatterns: ['**/*.{js,css,html,svg}']
        },
        devOptions: {
          enabled: true,
          type: 'module'
        },
        includeAssets: ['icon.svg'],
        manifest: {
          name: 'My Little Companion',
          short_name: 'Companion',
          description: 'A gentle daily companion — schedule, cycle, and sassy nudges.',
          theme_color: '#f6c6c0',
          background_color: '#fff8f5',
          display: 'standalone',
          icons: [
            { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }
          ]
        }
      })
    ],
    server: {
      host: true,
      proxy: {
        '/api': 'http://localhost:4000'
      }
    }
  }
})
