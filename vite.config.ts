import { sveltekit } from '@sveltejs/kit/vite'
import tailwindcss from '@tailwindcss/vite'

export default {
  plugins: [tailwindcss(), sveltekit()],
  server: {
    proxy: {
      '/api': {
        target: process.env.PUBLIC_API_URL || 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
}
