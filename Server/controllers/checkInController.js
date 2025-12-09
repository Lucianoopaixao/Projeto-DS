import checkInModel from "../models/checkInModel.js";

function stringParaData(horarioString) {
  try {
    const [horas, minutos] = horarioString.split(":");
    const data = new Date();
    data.setHours(parseInt(horas));
    data.setMinutes(parseInt(minutos));
    data.setSeconds(0);
    data.setMilliseconds(0);
    return data;
  } catch (error) {
    console.log("Erro na conversão, usando data atual:", error);
    return new Date();
  }
}

async function criarMedicamento(req, res) {
  try {
    const { nome, duracao, horarios, usuarioId } = req.body;

    if (!nome || !horarios || horarios.length === 0 || !usuarioId) {
      return res.status(400).json({ error: "Dados incompletos ou usuário não informado" });
    }

    const dadosParaSalvar = {
      usuario_id: usuarioId, // usa o ID real do usuário
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
    console.error(error);
    return res.status(500).json({ error: "Erro ao listar medicamentos" });
  }
}

export default { criarMedicamento, listarMedicamentos };
