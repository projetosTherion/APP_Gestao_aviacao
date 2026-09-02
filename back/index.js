const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const empresaRoutes = require("./routes/empresaRoutes");

// Carrega variáveis de ambiente
dotenv.config();

const app = express();

// Middlewares
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json()); // permite JSON no body
app.use("/uploads", express.static("uploads")); // serve os arquivos de logo enviados

// Conecta ao banco
connectDB();

// Porta configurável via .env
const PORT = process.env.PORT || 4000;

// Rota inicial só para teste de status
app.get("/", (req, res) => {
  res.json({ status: "✅ Backend rodando com sucesso" });
});

// Rotas da aplicação
app.use("/api/auth", authRoutes); // POST /api/auth/cadastro, POST /api/auth/login
app.use("/api", empresaRoutes); // GET/PUT /api/empresa

// Inicia servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
