import checkInModel from "../models/checkInModel.js";
import prisma from "../prisma.js";

function stringParaData(horarioString) {
  try {
    const [horas, minutos] = horarioString.split(":");
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

          dose: "1 dose",
        })),
      },
    };

    const novoCheckIn = await checkInModel.criarCheckIn(dadosParaSalvar);

    await prisma.user.update({
      where: { id: parseInt(usuario_id) },
      data: {
        moedas: {
          increment: 5,
        },
      },
    });
    
    return res.status(201).json(novoCheckIn);
  } catch (error) {
    console.error("Erro ao salvar:", error);
    return res.status(500).json({ error: "Erro ao salvar medicamento" });
  }
}

//funcao que retorna os medicamentos do usuario de cara
async function listarMedicamentosPorUsuario(req, res) {
  try {
    const { usuarioId } = req.params;

    const lista = await checkInModel.listarCheckInsPorUsuario(usuarioId);

    return res.status(200).json(lista);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao buscar medicamentos" });
  }
}

export default {
  criarMedicamento,
  listarMedicamentos: listarMedicamentosPorUsuario,
  listarMedicamentosPorUsuario,
};
