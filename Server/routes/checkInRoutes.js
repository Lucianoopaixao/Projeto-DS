import express from "express";
import checkInController from "../controllers/checkInController.js";

const router = express.Router();

// Rota para SALVAR (POST)
router.post("/", checkInController.criarMedicamento);

//Rota que retorna os medicamentos cadastrados pelo usuario
router.get("/:usuarioId", checkInController.listarMedicamentosPorUsuario);

router.post("/tomar", checkInController.tomarDose);


export default router;
