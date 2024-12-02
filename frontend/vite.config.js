import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
dotenv.config({path: '../.env'});

const apiUrl = process.env.VITE_API_URL;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(''), '')
  return {
    base: '/',
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000', // Your backend server
          changeOrigin: true,
          secure: false,
        },
      },
      historyApiFallback: true,
    },
    define: {
      __API_URL__: JSON.stringify(apiUrl),
    },
  }
})
