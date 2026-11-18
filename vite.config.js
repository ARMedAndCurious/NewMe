import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { rm } from 'node:fs/promises'
import { resolve } from 'node:path'

// Keep the local third-party comparison capture out of public builds.
const privateComparisonCapture = {
  name: 'private-comparison-capture',
  apply: 'build',
  async writeBundle(options) {
    await rm(resolve(options.dir, 'images/case-study/newme-original-desktop.png'), { force: true })
  },
}

export default defineConfig({ plugins: [react(), tailwindcss(), privateComparisonCapture] })
