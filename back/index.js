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
<<<<<<< HEAD
app.use(express.json()); // permite JSON no body
app.use("/uploads", express.static("uploads")); // serve os arquivos de logo enviados

// Conecta ao banco legado (MongoDB, usado por Auth/Empresa)
=======
app.use(express.json());
app.use("/uploads", express.static("uploads")); // serve arquivos de logo

// Conecta ao banco legado (MongoDB/etc via connectDB)
>>>>>>> 640d4eac854215cabfbaecbed7044e41d6a1ff7f
connectDB();

// ─── Rotas ────────────────────────────────────────────────────────────────────

<<<<<<< HEAD
=======
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

>>>>>>> 640d4eac854215cabfbaecbed7044e41d6a1ff7f
// Health check
app.get("/", (req, res) => {
  res.json({ status: "✅ Backend rodando com sucesso" });
});

<<<<<<< HEAD
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

=======
// ─── Middleware global de erros (deve ser o último) ────────────────────────────
const errorHandler = require("./src/middlewares/errorHandler");
app.use(errorHandler);

>>>>>>> 640d4eac854215cabfbaecbed7044e41d6a1ff7f
// ─── Inicia servidor ───────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
