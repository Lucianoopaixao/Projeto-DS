import prisma from "../lib/prisma.js";

async function criarCheckIn(dadosCheckIn) {
  return prisma.check_in.create({
    data: dadosCheckIn,
    include: {
      horarios: true,
    },
  });
}

async function listarCheckIns() {
  return prisma.check_in.findMany({
    include: { horarios: true },
    orderBy: { id: "desc" },
  });
}

async function listarCheckInsPorUsuario(usuario_id) {
  return prisma.check_in.findMany({
    where: { usuario_id: Number(usuario_id) },
    include: { horarios: true },
    orderBy: { id: "desc" },
  });
}

export default {
  criarCheckIn,
  listarCheckIns,
  listarCheckInsPorUsuario,
};
