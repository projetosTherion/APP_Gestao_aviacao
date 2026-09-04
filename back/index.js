const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const empresaRoutes = require("./routes/empresaRoutes");
const clientesRoutes = require("./src/routes/clientesRoutes");
const pedidosRoutes = require("./src/routes/pedidosRoutes");
const servicosRoutes = require("./src/routes/servicos.routes");
const errorHandler = require("./src/middlewares/errorHandler");

// Carrega variáveis de ambiente
dotenv.config();

const app = express();

// ─── Middlewares globais ───────────────────────────────────────────────────────
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json()); // permite JSON no body
app.use("/uploads", express.static("uploads")); // serve os arquivos de logo enviados

// Conecta ao banco legado (MongoDB, usado por Auth/Empresa)
connectDB();

// ─── Rotas ────────────────────────────────────────────────────────────────────

// Health check
app.get("/", (req, res) => {
  res.json({ status: "✅ Backend rodando com sucesso" });
});

// Auth & Empresa
app.use("/api/auth", authRoutes);     // POST /api/auth/cadastro, /api/auth/login
app.use("/api", empresaRoutes);       // GET/PUT /api/empresa

// Clientes (Dupla 1 - Sprint 2)
app.use("/api/clientes", clientesRoutes);

// Pedidos (Dupla 3 - Sprint 2 Groundwork)
app.use("/api/pedidos", pedidosRoutes);

// Serviços (Sprint 2 — Therion)
app.use("/api/servicos", servicosRoutes);

// Sprint 3 — adicionar aqui quando necessário:
// const outrasRoutes = require("./src/routes/...");

// ─── Middleware global de erros (deve ser o último) ────────────────────────────
app.use(errorHandler);

// ─── Inicia servidor ───────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
