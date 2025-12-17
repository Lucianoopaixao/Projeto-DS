import { useState, useEffect } from "react";
import "./Check.css";

export default function Check({
  onBack,
  documentAccepted,
  setDocumentAccepted,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [medicines, setMedicines] = useState([]);


  const [newMedicine, setNewMedicine] = useState({
    name: "",
    times: [""],
    duration: "",
  });
  const [takenDoses, setTakenDoses] = useState({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    async function fetchMedicines() {
      try {
        const response = await fetch(`http://localhost:3001/api/checkin/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          const formatted = data.map((med) => ({
             name: med.nome_medicamento,
             duration: med.duracao_semanas,
             times: med.horarios.map((h) =>
               new Date(h.horario).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
             ),
          }));
          setMedicines(formatted);
        }
      } catch (error) {
        console.error("Erro ao buscar medicamentos:", error);
      }
    }

    fetchMedicines();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleSendDocument = () => {
    if (!selectedFile) {
      alert("Por favor, selecione um documento antes de enviar.");
      return;
    }
    alert("Documento aceito com sucesso!");
    setDocumentAccepted(true);
  };

  const handleAddTime = () => {
    setNewMedicine({ ...newMedicine, times: [...newMedicine.times, ""] });
  };

  const handleTimeChange = (index, value) => {
    const updatedTimes = [...newMedicine.times];
    updatedTimes[index] = value;
    setNewMedicine({ ...newMedicine, times: updatedTimes });
  };

  const handleAddMedicine = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Usuário não encontrado. Faça login novamente.");
      return;
    }

    if (
      !newMedicine.name ||
      !newMedicine.duration ||
      newMedicine.times.some((t) => !t)
    ) {
      alert("Preencha todos os campos e horários antes de adicionar!");
      return;
    }

    const dadosParaEnviar = {
      usuario_id: user.id,
      nome: newMedicine.name,
      duracao: newMedicine.duration,
      horarios: newMedicine.times,
    };

    try {
      const response = await fetch("http://localhost:3001/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosParaEnviar),
      });
      if (response.ok) {
        const medToAdd = {
          ...newMedicine,
          duration: parseInt(newMedicine.duration),
        };
        setMedicines([...medicines, medToAdd]);
        setNewMedicine({ name: "", times: [""], duration: "" });
        alert("Medicamento salvo com sucesso!");
      } else {
        const erroDoServidor = await response.json();
        alert(`O Servidor recusou: ${erroDoServidor.error || JSON.stringify(erroDoServidor)}`);
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro de conexão com o servidor.");
    }
  };

  const handleTakeDose = async (medName, time) => {
    const key = `${medName}-${time}`;
    
    if (takenDoses[key]) return;

    const updatedTakenDoses = { ...takenDoses, [key]: true };
    setTakenDoses(updatedTakenDoses);

    const med = medicines.find((m) => m.name === medName);
    if (med) {
      const allTaken = med.times.every(
        (t) => updatedTakenDoses[`${medName}-${t}`] 
      );
      if (allTaken) {
        setMedicines((prevMeds) =>
          prevMeds
            .map((m) =>
              m.name === medName ? { ...m, duration: m.duration - 1 } : m
            )
            .filter((m) => m.duration > 0)
        );
      }
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
        try {
            await fetch(`http://localhost:3001/api/usuarios/${user.id}/saldo`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ valor: 1 })
            });
            
            window.dispatchEvent(new Event("balanceUpdated"));
            
            alert(`Dose de ${medName} (${time}) confirmada! +1 moeda`);
        } catch (error) {
            console.error("Erro ao salvar moedas", error);
        }
    }
  };

  if (!documentAccepted) {
    return (
      <div className="form-wrapper">
        <h1 className="form-title">Check-in de Tratamento</h1>
        <p>Envie o documento de comprovação para continuar:</p>
        <div className="upload-section">
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="file-input"
          />
          {selectedFile && (
            <div className="selected-file">
              <p>Arquivo selecionado: {selectedFile.name}</p>
            </div>
          )}
          <button className="btn btn-primary" onClick={handleSendDocument}>
            Enviar Documento
          </button>
        </div>
        <div className="actions-footer">
          <button className="btn btn-secondary" onClick={onBack}>
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-wrapper">
      <div className="page-header">Cadastro de Medicamentos</div>

      <h1 className="form-title">Gerencie seus horários e ganhe moedas!</h1>
      

      {medicines.length > 0 && (
        <div className="medicines-list">
          <h3>Medicamentos Cadastrados:</h3>
          <ul>
            {medicines.map((med, index) => (
              <li key={index}>
                <div className="medicine-header">
                  <strong>{med.name}</strong>
                  <span className="duration">{med.duration} dias</span>
                </div>
                <ul>
                  {med.times.map((time, i) => {
                    const key = `${med.name}-${time}`;
                    return (
                      <li key={i}>
                        {time}
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleTakeDose(med.name, time)}
                          disabled={takenDoses[key]}
                        >
                          {takenDoses[key] ? "Tomado" : "Tomar"}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="form-body">
        {medicines.length > 0 && (
          <p>
            <strong>Cadastre um novo medicamento</strong>
          </p>
        )}
        <input
          type="text"
          placeholder="Nome do medicamento"
          value={newMedicine.name}
          onChange={(e) =>
            setNewMedicine({ ...newMedicine, name: e.target.value })
          }
          className="text-input"
        />
        {newMedicine.times.map((time, index) => (
          <input
            key={index}
            type="time"
            value={time}
            onChange={(e) => handleTimeChange(index, e.target.value)}
            className="text-input"
          />
        ))}
        <button className="btn btn-secondary" onClick={handleAddTime}>
          + Adicionar outro horário
        </button>
        <input
          type="text"
          placeholder="Duração (em dias)"
          value={newMedicine.duration}
          onChange={(e) =>
            setNewMedicine({ ...newMedicine, duration: e.target.value })
          }
          className="text-input"
        />
        <button className="btn btn-primary" onClick={handleAddMedicine}>
          Adicionar Medicamento
        </button>
      </div>

      <div className="actions-footer">
        <button className="btn btn-secondary" onClick={onBack}>
          Voltar
        </button>
      </div>
    </div>
  );
}