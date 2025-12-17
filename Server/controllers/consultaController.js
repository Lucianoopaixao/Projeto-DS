import consultaModel from "../models/consultaModel.js";
import prisma from "../lib/prisma.js"

async function cadastrar(req, res) {
    const { usuario_id, data_consulta, anexo_consulta } = req.body;
    
    try {

       
        if (!anexo_consulta) {
            return res.status(400).json({ erro: "O comprovante e obrigatorio." }); //se nao anexar nenhum arquivo
        }
        
        const anexoPlaceholder = "COMPROVANTE_VALIDADO_COM_SUCESSO"; 
        
        const dadosParaModel = {
            // Reutiliza os IDs e a data
            usuario_id,
            data_consulta,
            // Substitui a string Base64 gigante pelo placeholder simples.
            anexo_consulta: anexoPlaceholder, 
        };

        //chamada ao model
        // O Model envia os dados limpos para o banco.
        const nova = await consultaModel.registrarConsulta(dadosParaModel);

        await prisma.user.update({
      where: { id: usuario_id },
      data: {
        moedas: {
          increment: 10,
        },
      },
    });
        
        // Sucesso! Retorna 201 para o Front-End, acionando a tela de 'Aprovado'.
        res.status(201).json(nova); 

    } catch (erro) {
        // Se houver qualquer falha (conexao com BD, campo nulo, etc.), o erro e capturado aqui.
        console.error("ERRO CRITICO ao registrar consulta:", erro); 
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

