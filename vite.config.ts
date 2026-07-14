/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/** Stable vendor groups — app-level changes shouldn't invalidate these chunks. */
function vendorChunk(id: string): string | undefined {
  if (!id.includes('node_modules')) return undefined
  if (/[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(id)) {
    return 'vendor-react'
  }
  if (/[\\/](@tanstack|axios)[\\/]/.test(id)) return 'vendor-query'
  if (/[\\/](react-hook-form|@hookform|zod)[\\/]/.test(id)) return 'vendor-forms'
  return undefined
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    // Unit/integration tests only — e2e/ belongs to Playwright (npm run test:e2e).
    include: ['src/**/*.test.{ts,tsx}'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: vendorChunk,
      },
    },
  },
})
