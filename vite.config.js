import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// Relative base so the build works at https://<user>.github.io/<any-repo-name>/
export default defineConfig({
  base: './',
  plugins: [react()],
  // Own port so it doesn't collide with other local projects on Vite's default 5173
  server: { port: 5180 },
})
