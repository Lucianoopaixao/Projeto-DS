import { useState } from "react";
import "./RegisterAppointment.css";

export default function RegisterAppointment({ onBack }) {
  const [selectedImage, setSelectedImage] = useState(null);

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
        // Guarda o arquivo original E o texto convertido
        setSelectedImage({ 
            fileObject: file, 
            base64String: base64 
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

    const dadosParaEnviar = {
      usuario_id: user.id, 

      // 2. O Banco exige a data da consulta (Enviando a data de agora)
      data_consulta: new Date(), 

      // 3. O nome do campo tem que ser igual ao do Schema e do Controller
      anexo_consulta: selectedImage.base64String,
    };

    try {
      const response = await fetch("http://localhost:3001/api/consultas/registrar-consulta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosParaEnviar),
      });

      if (response.ok) {
        alert("Comprovante enviado com sucesso!");
        onBack();
      } else {
        const erroDoServidor = await response.json();
        console.error("Erro detalhado:", erroDoServidor);
        alert(`O Servidor recusou: ${erroDoServidor.error || JSON.stringify(erroDoServidor)}`);
      }
    } catch (error) {
      console.error("Erro de conexão:", error);
      // Se cair aqui, é porque a porta está errada ou o servidor está desligado
      alert("Erro: Não foi possível conectar ao servidor (Porta 3001).");
    }
  };

  return (
    <div className="inner-wrapper">
      <h1 className="form-title">Registrar Consulta</h1>
      <p>Envie uma foto do seu comprovante de comparecimento:</p>
      
      <div className="upload-section">
        {/* Visual Simples: O Input nativo visível */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="file-input"
          style={{ marginBottom: '15px' }}
        />

        {selectedImage && (
          <div className="selected-file">
            <p>Arquivo pronto para envio: <strong>{selectedImage.fileObject.name}</strong></p>
          </div>
        )}

        <button className= "btn-primary" onClick={handleSubmit}>
          Enviar Comprovante
        </button>
      </div>
      <hr className="divisor-fino" />

      <div className="actions-footer">
        <button className="btn-secondary" onClick={onBack}> Voltar </button>
      </div>
    </div>
  );
}