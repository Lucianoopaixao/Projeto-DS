import express from "express";
import usuarioController from "../controllers/usuarioController.js";

const router = express.Router();

router.get("/:id/saldo", usuarioController.getSaldo);

export default router;