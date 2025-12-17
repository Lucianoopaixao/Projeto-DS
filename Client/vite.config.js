import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  //configuração de teste adicionada
  test: {
    globals: true,          
    environment: 'jsdom',    
    setupFiles: './src/setupTests.js',
    css: false               
  },
})