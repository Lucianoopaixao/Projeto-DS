import consultaModel from "../models/consultaModel.js";
import prisma from "../lib/prisma.js"
// Não precisamos importar 'fs' ou 'path' porque não vamos salvar o arquivo.

async function cadastrar(req, res) {
    // Desestrutura os dados, incluindo a string Base64 que vem no campo anexo_consulta.
    const { usuario_id, data_consulta, anexo_consulta } = req.body;
    
    try {
        // --- 1. Validação Mínima e Preparação dos Dados ---

        // Se o Front-End enviou a string Base64, o campo anexo_consulta estará preenchido.
        if (!anexo_consulta) {
            return res.status(400).json({ erro: "O comprovante é obrigatório." });
        }
        
        // Define um valor placeholder para o anexo, já que o arquivo NÃO será salvo.
        // Isso satisfaz a exigência do seu Schema do Prisma (campo String obrigatório).
        const anexoPlaceholder = "COMPROVANTE_VALIDADO_COM_SUCESSO"; 
        
        const dadosParaModel = {
            // Reutiliza os IDs e a data
            usuario_id,
            data_consulta,
            // Substitui a string Base64 gigante pelo placeholder simples.
            anexo_consulta: anexoPlaceholder, 
        };

        // --- 2. Chamada ao Model ---
        // O Model envia os dados limpos (com o placeholder) para o banco.
        const nova = await consultaModel.registrarConsulta(dadosParaModel);

        await prisma.user.update({
      where: { id: usuario_id },
      data: {
        moedas: {
          increment: 10,
        },
      },
    });
        
        // Sucesso! Retorna 201 para o Front-End (acionando a tela de 'Aprovado').
        res.status(201).json(nova); 

    } catch (erro) {
        // Se houver qualquer falha (conexão com BD, campo nulo, etc.), o erro é capturado aqui.
        console.error("ERRO CRÍTICO ao registrar consulta:", erro); 
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

