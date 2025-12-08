import checkInModel from "../models/checkInModel.js";

function stringParaData(horarioString) {
  

  try {
    const [horas, minutos] = horarioString.split(':');
    const data = new Date();
    data.setHours(parseInt(horas));
    data.setMinutes(parseInt(minutos));
    data.setSeconds(0);
    return data;
  } catch (error) {
    console.log("Erro na convers�o, usando data atual:", error);
    return new Date();
  }
}

async function criarMedicamento(req, res) {
  try {
    const { usuario_id, nome, duracao, horarios } = req.body;

    if (!usuario_id || !nome || !horarios || horarios.length === 0) {
      return res.status(400).json({ error: "Dados incompletos" });
    }

    const dadosParaSalvar = {
      usuario_id: parseInt(usuario_id), 
      nome_medicamento: nome,
      duracao_semanas: parseInt(duracao),
      moedaspcadastro: 5,
      
      horarios: {
        create: horarios.map((horaString) => ({
          dia_semana: "TODOS",
          
          horario: stringParaData(horaString), 
          
          dose: "1 dose"
        }))
      }
    };

    const novoCheckIn = await checkInModel.criarCheckIn(dadosParaSalvar);
    return res.status(201).json(novoCheckIn);

  } catch (error) {
    console.error("Erro ao salvar:", error);
    return res.status(500).json({ error: "Erro ao salvar medicamento" });
  }
}

async function listarMedicamentos(req, res) {
  try {
    const lista = await checkInModel.listarCheckIns();
    return res.status(200).json(lista);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao listar" });
  }
}

export default { criarMedicamento, listarMedicamentos };