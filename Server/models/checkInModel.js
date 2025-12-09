import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function criarCheckIn(dadosCheckIn) {
  const novoCheckIn = await prisma.check_in.create({
    data: dadosCheckIn,
    include: {
      horarios: true,
    },
  });
  return novoCheckIn;
}

async function listarCheckIns() {
  const lista = await prisma.check_in.findMany({
    include: {
      horarios: true,
    },
    orderBy: {
      id: "desc",
    },
  });
  return lista;
}

async function listarCheckInsPorUsuario(usuario_id) {
  return prisma.check_in.findMany({
    where: { usuario_id: Number(usuario_id) },
    include: {
      horarios: true,
    },
    orderBy: {
      id: "desc",
    },
  });
}

export default {
  criarCheckIn,
  listarCheckIns,
  listarCheckInsPorUsuario,
};
