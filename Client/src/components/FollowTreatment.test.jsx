import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import FollowTreatment from "./FollowTreatment";

describe("Componente FollowTreatment", () => {
  it("Deve renderizar o título, botões e imagens corretamente", () => {
    // Renderizamos passando funções vazias, pois só queremos ver a tela
    render(
      <FollowTreatment
        onBack={() => {}}
        onFirstAction={() => {}}
        onSecondAction={() => {}}
      />
    );

    //Verifica Título
    expect(screen.getByText(/Acompanhar Tratamento/i)).toBeInTheDocument();

    //Verifica Botões (pelo texto dentro deles)
    expect(screen.getByRole("button", { name: /fazer check-in/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /registrar consulta/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /voltar/i })).toBeInTheDocument();

    // Verifica Imagens 
    expect(screen.getByAltText(/Fazer Check-in de medicamentos/i)).toBeInTheDocument();
    expect(screen.getByAltText(/Registrar consulta.*/i)).toBeInTheDocument();
  });

  it("Deve chamar as funções corretas ao clicar em cada botão", () => {
    // Criamos "espiões" (Mocks) para vigiar se as funções serão chamadas
    const mockCheckIn = vi.fn();
    const mockRegistrar = vi.fn();
    const mockVoltar = vi.fn();

    render(
      <FollowTreatment
        onSecondAction={mockCheckIn} // Botão Check-in
        onFirstAction={mockRegistrar} // Botão Registrar
        onBack={mockVoltar}          // Botão Voltar
      />
    );

    //TESTE 1 Botão Check-in
    const btnCheckIn = screen.getByRole("button", { name: /fazer check-in/i });
    fireEvent.click(btnCheckIn);
    // Verifica se a função mockCheckIn foi chamada 1 vez
    expect(mockCheckIn).toHaveBeenCalledTimes(1);

    //TESTE 2 Botão Registrar Consulta
    const btnRegistrar = screen.getByRole("button", { name: /registrar consulta/i });
    fireEvent.click(btnRegistrar);
    expect(mockRegistrar).toHaveBeenCalledTimes(1);

    //TESTE 3 Botão Voltar
    const btnVoltar = screen.getByRole("button", { name: /voltar/i });
    fireEvent.click(btnVoltar);
    expect(mockVoltar).toHaveBeenCalledTimes(1);
  });
});