import "dotenv/config";
import express from "express";
import cors from "cors";

// importando rotas
import quizRoutes from "./routes/quizRoutes.js";
import consultaRoutes from "./routes/consultaRoutes.js";
import checkInRoutes from "./routes/checkInRoutes.js";
import loginRoutes from "./routes/loginRoutes.js";

// criacao do app
const app = express();

// configuracoes
app.use(cors());
app.use(express.json({ limit: "50mb" })); // Aumentado limite para evitar erros com imagens grandes
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// definindo as rotas
app.use("/api/quiz", quizRoutes);
app.use("/api/consultas", consultaRoutes);
app.use("/api/checkin", checkInRoutes);
app.use("/login", loginRoutes);

// iniciando server
const PORT = process.env.PORT || 3001;

// inicinando sem ser pra testes
if (process.env.NODE_ENV !== "test") {
  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor RODANDO na porta ${PORT}`);
  });

  server.on("error", (e) => {
    if (e.code === "EADDRINUSE") {
      console.error(`Porta ${PORT} j� est� em uso!`);
    } else {
      console.error("Erro no servidor:", e);
    }
  });
}

// exporta app pra testes
export default app;
