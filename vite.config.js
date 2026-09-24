import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { assertSupabaseEnv } from './config/validateSupabaseEnv.js'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  if (command === 'build' && mode === 'production') {
    assertSupabaseEnv(loadEnv(mode, process.cwd(), ''), { production: true })
  }

  return {
    plugins: [vue()],
    server: {
      port: 3000,
      host: true,
    },
  }
})
