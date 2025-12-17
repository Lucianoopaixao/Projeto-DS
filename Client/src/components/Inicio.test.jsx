import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Inicio from "./Inicio";

describe("Componente Inicio", () => {
  it("Deve renderizar o título e as imagens corretamente", () => {
    // Renderizamos o componente com funções vazias apenas para ver a tela
    render(<Inicio irParaQuiz={() => {}} irParaAcompanhar={() => {}} />);

    //Verifica o Título
    expect(screen.getByText(/Sa.de em Jogo/i)).toBeInTheDocument();

    // Verifica as Imagens pelo texto alternativo 
    const imgQuiz = screen.getByAltText("quiz");
    const imgTratamento = screen.getByAltText("tratamento");

    expect(imgQuiz).toBeInTheDocument();
    expect(imgTratamento).toBeInTheDocument();
    
    // Verifica se as imagens têm o src correto
    expect(imgQuiz).toHaveAttribute("src");
    expect(imgTratamento).toHaveAttribute("src");
  });

  it("Deve navegar para as telas corretas ao clicar nos botões", () => {
    // Criamos espiões (Mocks) para as funções de navegação
    const mockIrParaQuiz = vi.fn();
    const mockIrParaAcompanhar = vi.fn();

    render(
      <Inicio 
        irParaQuiz={mockIrParaQuiz} 
        irParaAcompanhar={mockIrParaAcompanhar} 
      />
    );

    //TESTE BOTÃO QUIZ
    const btnQuiz = screen.getByText(/Quiz sobre ISTs/i);
    fireEvent.click(btnQuiz);
    // Esperamos que a função de ir para o quiz tenha sido chamada
    expect(mockIrParaQuiz).toHaveBeenCalledTimes(1);

    //TESTE BOTÃO ACOMPANHAR
    const btnAcompanhar = screen.getByText(/Acompanhar tratamento/i);
    fireEvent.click(btnAcompanhar);
    // Esperamos que a função de ir para o acompanhamento tenha sido chamada
    expect(mockIrParaAcompanhar).toHaveBeenCalledTimes(1);
  });
});