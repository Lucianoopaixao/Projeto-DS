import quizModel from "../models/quizModel.js";
import prisma from "../lib/prisma.js";

//receber requisição e puxar do model
async function pegarperguntas(req, res) {
  try {
    //pegamos as questos do banco de dados
    const results = await quizModel.retornarquestoes();

    //enviando
    res.json(results);
  } catch (error) {
    console.error("Nao foi possi�vel pegar as questoes do model", error);
    return res.status(500).json({ erro: "Erro ao buscar questoes" });
  }
}

//receber a resposta do usuario e validar para adicionar moedas
async function responderQuiz(req, res) {
  try {
    //log pra ver oq ta indo de vdd
    console.log("--- DEBUG REQ.BODY ---");
    console.log(req.body);
    console.log("----------------------");

    const { usuario_id, questao_id, resposta } = req.body;

    //vendo mais especifico ainda
    if (!usuario_id) console.log("ERRO: usuario_id esta faltando!");
    if (!questao_id) console.log("ERRO: questao_id esta faltando!");
    if (!resposta) console.log("ERRO: resposta esta faltando!");

    if (!usuario_id || !questao_id || !resposta) {
      return res.status(400).json({ erro: "Dados incompletos" });
    }

    const questao = await quizModel.buscarQuestaoPorId(questao_id);

    if (!questao) {
      return res.status(404).json({ erro: "Questao nao encontrada" });
    }

    const acertou =
      resposta.trim().toLowerCase() === questao.resposta.trim().toLowerCase();

    console.log("Resposta enviada:", resposta);
    console.log("Resposta correta:", questao.resposta);
    console.log("Acertou?", resposta === questao.resposta);

    if (acertou) {
      await prisma.user.update({
        where: { id: Number(usuario_id) },
        data: {
          moedas: { increment: 1 },
        },
      });
    }

    return res.status(200).json({
      acertou,
      moedas_ganhas: acertou ? 1 : 0,
    });
  } catch (error) {
    console.error("Erro ao responder quiz", error);
    return res.status(500).json({ erro: "Erro interno" });
  }
}

export default {
  pegarperguntas,
  responderQuiz,
};
