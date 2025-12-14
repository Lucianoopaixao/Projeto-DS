import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Check from "./Check";

describe("Componente Check (Check-in de Tratamento)", () => {
  
  beforeEach(() => {
    global.alert = vi.fn();
    localStorage.setItem("user", JSON.stringify({ id: 123, name: "Teste" }));

    // --- MOCK MAIS INTELIGENTE ---
    // Agora ele olha os 'options' para saber se é POST ou GET
    global.fetch = vi.fn((url, options) => {
      
      // Se tiver method: "POST", retorna sucesso genérico
      if (options && options.method === "POST") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        });
      }

      // Se não tiver options ou method for GET, retorna lista vazia
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      });
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  // --- CENÁRIO 1: Upload de Documento ---
  it("Deve mostrar tela de upload se documento não foi aceito", async () => {
    const mockSetDocumentAccepted = vi.fn();

    const { container } = render(
      <Check 
        onBack={() => {}} 
        documentAccepted={false} 
        setDocumentAccepted={mockSetDocumentAccepted} 
      />
    );

    // Espera o fetch inicial (mesmo que não seja usado nessa tela, o componente pode chamar)
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    expect(screen.getByText(/Check-in de Tratamento/i)).toBeInTheDocument();
    
    const input = container.querySelector('input[type="file"]');
    const file = new File(["dummy"], "receita.pdf", { type: "application/pdf" });

    await waitFor(() => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    const btnEnviar = screen.getByRole("button", { name: /Enviar Documento/i });
    fireEvent.click(btnEnviar);

    expect(mockSetDocumentAccepted).toHaveBeenCalledWith(true);
  });

  // --- CENÁRIO 2: Cadastro de Remédios ---
  it("Deve permitir cadastrar um novo medicamento", async () => {
    const { container } = render(
      <Check 
        onBack={() => {}} 
        documentAccepted={true} 
        setDocumentAccepted={() => {}} 
      />
    );

    // [CORREÇÃO CRUCIAL] 
    // Esperamos o primeiro fetch (GET do useEffect) terminar antes de interagir.
    // Isso evita que o carregamento inicial sobrescreva o remédio que vamos adicionar.
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    // Verifica se está na tela certa
    expect(screen.getByText(/Cadastro de Medicamentos/i)).toBeInTheDocument();

    // Preenche o formulário
    const inputNome = screen.getByPlaceholderText(/Nome do medicamento/i);
    const inputDuracao = screen.getByPlaceholderText(/Dura..o/i); // Regex para ignorar acentos
    const inputTime = container.querySelector('input[type="time"]');

    fireEvent.change(inputNome, { target: { value: "Amoxicilina" } });
    fireEvent.change(inputDuracao, { target: { value: "7" } });
    fireEvent.change(inputTime, { target: { value: "08:00" } });

    // Clica em adicionar
    const btnAdicionar = screen.getByRole("button", { name: /Adicionar Medicamento/i });
    fireEvent.click(btnAdicionar);

    // Verifica chamada API (POST)
    await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining("/api/checkin"),
            expect.objectContaining({
                method: "POST",
                body: expect.stringContaining("Amoxicilina")
            })
        );
    });

    // Verifica atualização da tela
    await waitFor(() => {
        expect(screen.getByText("Amoxicilina")).toBeInTheDocument();
        expect(screen.getByText(/7 dias/i)).toBeInTheDocument();
    });
  });
});