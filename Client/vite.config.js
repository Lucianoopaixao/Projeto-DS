import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // --- CONFIGURAÇÃO DE TESTES ADICIONADA ---
  test: {
    globals: true,           // Permite usar describe, test, expect sem importar sempre
    environment: 'jsdom',    // Simula um navegador (essencial para React)
    setupFiles: './src/setupTests.js', // Arquivo que vamos criar no passo 2
    css: false               // Ignora CSS para processar os testes mais rápido
  },
})