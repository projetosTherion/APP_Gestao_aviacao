const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const empresaRoutes = require("./routes/empresaRoutes");

// Carrega variáveis de ambiente
dotenv.config();

const app = express();

// ─── Middlewares globais ───────────────────────────────────────────────────────
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());
app.use("/uploads", express.static("uploads")); // serve arquivos de logo

// Conecta ao banco legado (MongoDB/etc via connectDB)
connectDB();

// ─── Rotas ────────────────────────────────────────────────────────────────────

// Auth & Empresa
app.use("/api/auth", authRoutes);     // POST /api/auth/cadastro, /api/auth/login
app.use("/api", empresaRoutes);       // GET/PUT /api/empresa

// Clientes (Dupla 1 - Sprint 2)
const clientesRoutes = require("./src/routes/clientesRoutes");
app.use("/api/clientes", clientesRoutes);

// Pedidos (Dupla 3 - Sprint 2 Groundwork)
const pedidosRoutes = require("./src/routes/pedidosRoutes");
app.use("/api/pedidos", pedidosRoutes);

// Serviços (Sprint 2 — Therion)
const servicosRoutes = require("./src/routes/servicos.routes");
app.use("/api/servicos", servicosRoutes);

// Sprint 3 — adicionar aqui quando necessário:
// const outrasRoutes = require("./src/routes/...");

// Health check
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
