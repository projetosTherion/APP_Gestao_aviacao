const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Carrega variáveis de ambiente
dotenv.config();

const app = express();

// ─── Middlewares globais ───────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Rotas ────────────────────────────────────────────────────────────────────
const servicosRoutes = require("./src/routes/servicos.routes");
// Sprint 3 — adicionar aqui:
// const clientesRoutes  = require("./src/routes/clientes.routes");
// const pedidosRoutes   = require("./src/routes/pedidos.routes");

app.use("/api/servicos", servicosRoutes);

// Rota de health check
app.get("/", (req, res) => {
  res.json({ status: "✅ Backend rodando com sucesso" });
});

// ─── Middleware global de erros (deve ser o último) ────────────────────────────
const errorHandler = require("./src/middlewares/errorHandler");
app.use(errorHandler);

// ─── Inicia servidor ───────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});