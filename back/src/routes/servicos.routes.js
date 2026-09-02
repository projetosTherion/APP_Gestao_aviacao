const { Router } = require("express");
const servicosController = require("../controllers/servicos.controller");

const router = Router();

// GET    /api/servicos          — lista todos (suporta ?ativo=true|false&busca=texto)
router.get("/", servicosController.listar);

// GET    /api/servicos/:id      — busca por ID
router.get("/:id", servicosController.buscarPorId);

// POST   /api/servicos          — cria novo serviço
router.post("/", servicosController.criar);

// PUT    /api/servicos/:id      — atualiza serviço
router.put("/:id", servicosController.atualizar);

// PATCH  /api/servicos/:id/ativo — ativa ou desativa serviço
router.patch("/:id/ativo", servicosController.alternarAtivo);

module.exports = router;
