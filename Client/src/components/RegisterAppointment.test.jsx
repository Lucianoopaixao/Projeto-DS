import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import RegisterAppointment from "./RegisterAppointment";

describe("Componente RegisterAppointment", () => {
  
  beforeEach(() => {
    // Mock do Alert
    global.alert = vi.fn();

    // Mock do Fetch (Sucesso)
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );

    // Mock do LocalStorage (Usuário Logado padrão)
    localStorage.setItem("user", JSON.stringify({ id: 1, saldo: 100 }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("Deve renderizar o título e o botão de upload desabilitado inicialmente", () => {
    render(<RegisterAppointment onBack={() => {}} />);

    expect(screen.getByText(/Registrar Consulta/i)).toBeInTheDocument();
    
    const btnEnviar = screen.getByRole("button", { name: /Enviar Comprovante/i });
    expect(btnEnviar).toBeDisabled();
  });

  it("Deve permitir selecionar arquivo e enviar com sucesso (Fluxo Completo)", async () => {
    // Desta vez usamos 'container' para achar o input facilmente
    const { container } = render(<RegisterAppointment onBack={() => {}} />);

    //Achar o input de arquivo pelo seletor HTML simples
    const input = container.querySelector('input[type="file"]');
    
    // Criar arquivo falso
    const file = new File(["(imagem_fake)"], "comprovante.png", { type: "image/png" });

    //Simular o upload
    // Usamos waitFor para garantir que o React processe o FileReader
    await waitFor(() => {
        fireEvent.change(input, { target: { files: [file] } });
    });

    //Verificar se o texto do arquivo apareceu (prova que o state atualizou)
    await waitFor(() => {
        expect(screen.getByText(/comprovante.png/i)).toBeInTheDocument();
    });

    // Clicar em Enviar (Agora o botão deve estar habilitado)
    const btnEnviar = screen.getByRole("button", { name: /Enviar Comprovante/i });
    expect(btnEnviar).toBeEnabled();
    fireEvent.click(btnEnviar);

    //Verificar tela de sucesso
    await waitFor(() => {
        expect(screen.getByText(/Consulta Registrada/i)).toBeInTheDocument();
        expect(screen.getByText(/\+10/i)).toBeInTheDocument();
    });
  });

  it("Deve alertar se tentar enviar sem usuário logado", async () => {
    // Remove usuário para simular erro
    localStorage.removeItem("user");
    
    const { container } = render(<RegisterAppointment onBack={() => {}} />);
    
    // Precisamos selecionar uma imagem para o botão habilitar
    // Se não fizermos isso, o botão fica disabled e o clique não funciona
    const input = container.querySelector('input[type="file"]');
    const file = new File(["foo"], "teste.png", { type: "image/png" });
    
    await waitFor(() => {
        fireEvent.change(input, { target: { files: [file] } });
    });

    // Agora o botão destravou, podemos clicar
    const btnEnviar = screen.getByRole("button", { name: /Enviar Comprovante/i });
    await waitFor(() => expect(btnEnviar).toBeEnabled());
    
    fireEvent.click(btnEnviar);

    // Verifica se o alert foi chamado com a mensagem certa
    expect(global.alert).toHaveBeenCalledWith(expect.stringMatching(/nenhum usu.rio/i));
  });
});