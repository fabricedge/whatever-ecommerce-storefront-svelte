import { defineConfig } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    conditions: ['browser'],
    alias: {
      $lib: path.resolve('./src/lib'),
      '$app/navigation': path.resolve('./src/__mocks__/$app-navigation.ts'),
      '$app/state': path.resolve('./src/__mocks__/$app-state.ts'),
      '$env/static/public': path.resolve('./src/__mocks__/$env-static-public.ts'),
      'svelte-stripe': path.resolve('./src/__mocks__/svelte-stripe.ts'),
    },
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts'],
  },
})
