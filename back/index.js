const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Carrega variáveis de ambiente
dotenv.config();

const app = express();

// Middlewares
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json()); // permite JSON no body

// Porta configurável via .env
const PORT = process.env.PORT || 4000;

// Rota inicial só para teste de status
app.get("/", (req, res) => {
  res.json({ status: "✅ Backend rodando com sucesso" });
});

// Inicia servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
