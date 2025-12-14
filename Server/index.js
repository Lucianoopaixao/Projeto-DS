import "dotenv/config";
import express from "express";
import cors from "cors";
import app from "./app.js";

//IMPORTANDO ROTAS
import quizRoutes from "./routes/quizRoutes.js";
import consultaRoutes from "./routes/consultaRoutes.js";
import checkInRoutes from "./routes/checkInRoutes.js";
import loginRoutes from "./routes/loginRoutes.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

//DEFININDO AS ROTAS
app.use("/api/quiz", quizRoutes);
app.use("/api/consultas", consultaRoutes);
app.use("/api/checkin", checkInRoutes);
app.use("/login", loginRoutes);

const PORT = 3001;

const server = app.listen(PORT, () => {
  console.log(`Servidor RODANDO ${PORT}`);
});

server.on("error", (e) => {
  if (e.code === "EADDRINUSE") {
    console.error(`Porta ${PORT} em uso`);
  } else {
    console.error("Erro no servidor:", e);
  }
});

export default app;
