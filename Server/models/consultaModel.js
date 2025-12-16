import prisma from "../lib/prisma.js";

async function registrarConsulta(data) {
  try {
    return await prisma.registro_consulta.create({
      data: {
        ...data,
        data_consulta: new Date(data.data_consulta),
      },
    });
  } catch (erro) {
    console.error("Erro ao registrar consulta:", erro);
    throw erro;
  }
}

async function listarConsultas() {
  try {
    return await prisma.registro_consulta.findMany();
  } catch (erro) {
    console.error("Erro ao listar consultas:", erro);
    throw erro;
  }
}

export default {
  registrarConsulta,
  listarConsultas,
};
