import consultaModel from "../models/consultaModel.js";
import prisma from "../lib/prisma.js";

async function cadastrar(req, res) {
  const { usuario_id, data_consulta, anexo_consulta } = req.body;

  try {
    const idNumerico = Number(usuario_id);

    if (!idNumerico || isNaN(idNumerico)) {
      return res.status(400).json({ erro: "ID do usuario invalido." });
    }

    if (!anexo_consulta) {
      return res.status(400).json({ erro: "O comprovante e obrigatorio." });
    }

    const anexoPlaceholder = "COMPROVANTE_VALIDADO_COM_SUCESSO";

    const dadosParaModel = {
      usuario_id: idNumerico,
      data_consulta,
      anexo_consulta: anexoPlaceholder,
    };

    // Salva a consulta
    const nova = await consultaModel.registrarConsulta(dadosParaModel);

    // Atualiza as MOEDAS (Nome confirmado no Schema)
    await prisma.user.update({
      where: { id: idNumerico },
      data: {
        moedas: {
          increment: 10,
        },
      },
    });

    res.status(201).json(nova);

  } catch (erro) {
    console.error("ERRO CRÍTICO NO SERVIDOR:", erro);
    res.status(500).json({ erro: "Falha ao registrar consulta" });
  }
}

async function listar(req, res) {
  try {
    const consultas = await consultaModel.listarConsultas();
    res.status(200).json(consultas);
  } catch (erro) {
    res.status(500).json({ erro: "Falha ao listar consultas" });
  }
}

export { cadastrar as registrarConsulta, listar };