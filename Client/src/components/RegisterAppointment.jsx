import { useState } from "react";
import "./RegisterAppointment.css";

export default function RegisterAppointment({ onBack }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false); // Para desabilitar o botao durante o envio

  const [successData, setSuccessData] = useState(null);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const base64 = await convertToBase64(file);
        setSelectedImage({
          fileObject: file,
          base64String: base64,
        });
      } catch (error) {
        console.error("Erro ao processar imagem", error);
      }
    }
  };

  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Erro: nenhum usuário logado encontrado.");
      return;
    }

    if (!selectedImage) {
      alert("Por favor, selecione uma imagem primeiro");
      return;
    }

    setLoading(true); // Ativa loading

    const dadosParaEnviar = {
      usuario_id: user.id,
      data_consulta: new Date(),
      anexo_consulta: selectedImage.base64String,
    };

    try {
      const response = await fetch(
        "http://localhost:3001/api/consultas/registrar-consulta",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dadosParaEnviar),
        }
      );

      if (response.ok) {
        // Em caso de sucesso
        const MOEDAS_GANHAS = 10;

        const saldoAtual = user.saldo || 0;
        const novoSaldoTotal = saldoAtual + MOEDAS_GANHAS;

        user.saldo = novoSaldoTotal;
        localStorage.setItem("user", JSON.stringify(user));

        // tela de sucesso com os dados calculados
        setSuccessData({
          ganho: MOEDAS_GANHAS,
          total: novoSaldoTotal,
        });
      } else {
        const erroDoServidor = await response.json();
        alert(
          `O Servidor recusou: ${
            erroDoServidor.error || JSON.stringify(erroDoServidor)
          }`
        );
      }
    } catch (error) {
      console.error("Erro de conexão:", error);
      alert("Erro: Não foi possível conectar ao servidor (Porta 3001).");
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="inner-wrapper container-resultado confirmacao-consulta">
        <h1 className="form-title">Consulta Registrada!</h1>

        <p className="texto-confirmacao">
          Seu comprovante foi enviado com sucesso. Aguarde a validação.
        </p>

        {/* placar estilo Quiz */}
        <div className="destaque-pontuacao">
          <p>Você ganhou</p>
          <span className="exibir-moedas"> +{successData.ganho} 🪙</span>
        </div>

        {/*caixa de saldo*/}
        <div className="acertos-erros">
          <div className="stat-box correto box-saldo-total">
            <span className="stat-label">Saldo Total</span>
            <span className="stat-valor">{successData.total}</span>
          </div>
        </div>

        <button className="btn-primary btn-fim-quiz" onClick={onBack}>
          Voltar ao início
        </button>
      </div>
    );
  }

  return (
    <div className="inner-wrapper">
      <h1 className="form-title">Registrar Consulta</h1>
      <p>Envie uma foto do seu comprovante de comparecimento:</p>

      <div className="upload-section">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="file-input"
          style={{ marginBottom: "15px" }}
          disabled={loading}
        />

        {selectedImage && (
          <div className="selected-file">
            <p>
              Arquivo pronto para envio:{" "}
              <strong>{selectedImage.fileObject.name}</strong>
            </p>
          </div>
        )}

        <button
          className="btn-primary"
          onClick={handleSubmit}
          disabled={loading || !selectedImage}
        >
          {loading ? "Enviando..." : "Enviar Comprovante"}
        </button>
      </div>
      <hr className="divisor-fino" />

      <div className="actions-footer">
        <button className="btn-secondary" onClick={onBack} disabled={loading}>
          {" "}
          Voltar{" "}
        </button>
      </div>
    </div>
  );
}
