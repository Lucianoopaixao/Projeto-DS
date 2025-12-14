import "dotenv/config"; // Carrega as variáveis de ambiente primeiro
import express from "express";
import cors from "cors";

// --- IMPORTAÇÃO DAS ROTAS ---
import quizRoutes from "./routes/quizRoutes.js";
import consultaRoutes from "./routes/consultaRoutes.js";
import checkInRoutes from "./routes/checkInRoutes.js";
import loginRoutes from "./routes/loginRoutes.js";

// CRIAÇÃO DO APP
const app = express();

// CONFIGURAÇÕES 
app.use(cors());
app.use(express.json({ limit: "50mb" })); // Aumentado limite para evitar erros com imagens grandes
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// DEFINIÇÃO DAS ROTAS
app.use("/api/quiz", quizRoutes);
app.use("/api/consultas", consultaRoutes);
app.use("/api/checkin", checkInRoutes);
app.use("/login", loginRoutes); // Atenção: Verifique se no front você chama /login ou /api/login

// INICIALIZAÇÃO DO SERVIDOR
const PORT = process.env.PORT || 3001;

// Só inicia o servidor se este arquivo for executado diretamente (não em testes)
if (process.env.NODE_ENV !== 'test') {
    const server = app.listen(PORT, () => {
        console.log(`Servidor RODANDO na porta ${PORT}`);
    });

    server.on("error", (e) => {
        if (e.code === "EADDRINUSE") {
            console.error(`Porta ${PORT} já está em uso!`);
        } else {
            console.error("Erro no servidor:", e);
        }
    });
}

// Exporta o app para ser usado nos testes (se necessário)
export default app;