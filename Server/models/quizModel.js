import prisma from "../lib/prisma.js";

async function retornarquestoes() {
  try {
    return await prisma.questoes.findMany();
  } catch (error) {
    console.error("Não conseguiu achar questões", error);
    throw error;
  }
}

async function buscarQuestaoPorId(id) {
  return prisma.questoes.findUnique({
    where: { id: Number(id) }
  });
}

export default {
  retornarquestoes,
  buscarQuestaoPorId
};
