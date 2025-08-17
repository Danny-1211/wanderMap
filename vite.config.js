import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  additionalData: `@use "src/assets/utils/color" as *;`,
  plugins: [react()],
})
