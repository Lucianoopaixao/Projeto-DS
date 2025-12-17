import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Question from "./Question";

describe("Componente Question", () => {
  // Dados falsos para usar nos testes
  const perguntaTeste = "Qual a cor do céu?";
  const alternativasTeste = ["Azul", "Verde", "Roxo", "Laranja"];

  it("Deve renderizar a pergunta e as opções de resposta", () => {
    render(
      <Question
        pergunta={perguntaTeste}
        alternativas={alternativasTeste}
        onResposta={() => {}} // Função vazia, pois não vamos clicar agora
      />
    );

    // 1. Verifica se a pergunta está na tela
    expect(screen.getByText(perguntaTeste)).toBeInTheDocument();

    // 2. Verifica se TODAS as alternativas estão na tela
    // O forEach é ótimo para não ter que escrever 4 expects iguais
    alternativasTeste.forEach((opcao) => {
      expect(screen.getByRole("button", { name: opcao })).toBeInTheDocument();
    });
  });

  it("Deve chamar a função onResposta com a opção correta ao clicar", () => {
    const mockOnResposta = vi.fn(); // Nosso espião

    render(
      <Question
        pergunta={perguntaTeste}
        alternativas={alternativasTeste}
        onResposta={mockOnResposta}
      />
    );

    // Vamos simular o usuário escolhendo "Roxo"
    const botaoRoxo = screen.getByRole("button", { name: "Roxo" });
    fireEvent.click(botaoRoxo);

    // Verifica se a função foi chamada
    expect(mockOnResposta).toHaveBeenCalledTimes(1);

    // O MAIS IMPORTANTE, Verifica se ele enviou o texto "Roxo" para a função
    // Se ele enviar "Azul" ou o índice (2), o teste falha
    expect(mockOnResposta).toHaveBeenCalledWith("Roxo");
  });
});