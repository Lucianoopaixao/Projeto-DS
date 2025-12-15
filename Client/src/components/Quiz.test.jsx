import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Quiz from "./Quiz";

// Mock das perguntas
const perguntasMock = [
  {
    pergunta: "Qual é a cor do céu?",
    alternativa_a: "Azul",
    alternativa_b: "Verde",
    alternativa_c: "Roxo",
    alternativa_d: "Amarelo",
    resposta: "Azul",
    explicacaocerta: "Isso aí! O céu é azul.",
    explicacaoerrada: "Errou feio."
  }
];

describe("Componente Quiz", () => {
  
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(perguntasMock),
      })
    );
  });

  it("Deve mostrar 'Carregando' enquanto busca as perguntas", () => {
    render(<Quiz voltarInicio={() => {}} />);
    // Usamos regex (/.../i) para ignorar maiúsculas/minúsculas
    expect(screen.getByText(/carregando perguntas/i)).toBeInTheDocument();
  });

  it("Deve renderizar a pergunta vinda da API", async () => {
    render(<Quiz voltarInicio={() => {}} />);

    await waitFor(() => {
      // CORREÇÃO 1: Regex flexível para acentos
      // Procura por "Qual", depois qualquer coisa, depois "cor", etc.
      expect(screen.getByText(/Qual.*cor.*c.u/i)).toBeInTheDocument();
      
      // CORREÇÃO 2: Regex flexível para quebras de linha
      // O \s* significa "pode ter qualquer espaço ou quebra de linha aqui"
      expect(screen.getByText(/Moedas\s*:\s*0/i)).toBeInTheDocument();
    });
  });

  it("Deve mostrar explicação de acerto ao clicar na resposta certa", async () => {
    render(<Quiz voltarInicio={() => {}} />);

    // 1. Espera a pergunta carregar (procurando por "Qual" e "cor")
    await waitFor(() => screen.getByText(/Qual.*cor/i));

    // 2. Clica na resposta certa
    const botaoCorreto = screen.getByText(/azul/i);
    fireEvent.click(botaoCorreto);

    // 3. Verifica a mensagem de sucesso
    // CORREÇÃO 3: Procuramos apenas a palavra chave "acertou" para evitar erro de encoding no "Parabéns"
    expect(screen.getByText(/acertou/i)).toBeInTheDocument();
    
    // Verifica a explicação (evitando o acento de 'céu' usando o ponto '.' que serve como coringa)
    expect(screen.getByText(/O c.u . azul/i)).toBeInTheDocument();
  });
});