import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    port: 10000, 
    host: "0.0.0.0",
    allowedHosts: ["ai-chatbot-nutm.onrender.com"], 
  }
})
