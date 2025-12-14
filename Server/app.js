import express from "express";
import cors from "cors";

import quizRoutes from "./routes/quizRoutes.js";
import checkInRoutes from "./routes/checkInRoutes.js";
import consultaRoutes from "./routes/consultaRoutes.js";
import loginRoutes from "./routes/loginRoutes.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/quiz", quizRoutes);
app.use("/api/checkin", checkInRoutes);
app.use("/api/consulta", consultaRoutes);
app.use("/api/login", loginRoutes);

export default app;
