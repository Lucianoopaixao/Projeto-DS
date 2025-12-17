import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Login from "./Login";

const renderLogin = () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
};

describe("Componente de Login (UI)", () => {
  it("Deve mostrar os campos de CPF e Senha na tela", () => {
    renderLogin();

    //Usando o texto exato que está no seu placeholder
    expect(screen.getByPlaceholderText("000.000.000-00")).toBeInTheDocument();
    
    //O placeholder da senha são asteriscos
    expect(screen.getByPlaceholderText("********")).toBeInTheDocument();
    
    const botao = screen.getByRole("button", { name: /entrar|login|acessar/i });
    expect(botao).toBeInTheDocument();
  });

  it("Deve permitir que o usuário digite a senha", () => {
    renderLogin();

    // Busca pelo placeholder de asteriscos
    const inputSenha = screen.getByPlaceholderText("********");
    
    fireEvent.change(inputSenha, { target: { value: "senha123" } });

    expect(inputSenha.value).toBe("senha123");
  });
});