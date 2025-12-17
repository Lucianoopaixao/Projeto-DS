import prisma from "../lib/prisma.js";

async function getSaldo(req, res) {
  try {
    const { id } = req.params;
    
    // Converte para Number, pois no banco o ID é numérico
    const usuario = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: { moedas: true },
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario nao encontrado" });
    }

    return res.json(usuario);
  } catch (error) {
    return res.status(500).json({ error: "Erro interno" });
  }
}

export default { getSaldo };