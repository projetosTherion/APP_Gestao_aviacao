const servicosService = require("../services/servicos.service");
const {
  criarServicoSchema,
  atualizarServicoSchema,
  toggleAtivoSchema,
} = require("../validators/servico.validator");

// ─── GET /api/servicos ────────────────────────────────────────────────────────
async function listar(req, res, next) {
  try {
    const { ativo, busca } = req.query;
    const servicos = await servicosService.listarServicos({ ativo, busca });
    res.json(servicos);
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/servicos/:id ────────────────────────────────────────────────────
async function buscarPorId(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const servico = await servicosService.buscarServicoPorId(id);
    res.json(servico);
  } catch (err) {
    next(err);
  }
}

// ─── POST /api/servicos ───────────────────────────────────────────────────────
async function criar(req, res, next) {
  try {
    const dados = criarServicoSchema.parse(req.body);
    const novoServico = await servicosService.criarServico(dados);
    res.status(201).json(novoServico);
  } catch (err) {
    next(err);
  }
}

// ─── PUT /api/servicos/:id ────────────────────────────────────────────────────
async function atualizar(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const dados = atualizarServicoSchema.parse(req.body);
    const servicoAtualizado = await servicosService.atualizarServico(id, dados);
    res.json(servicoAtualizado);
  } catch (err) {
    next(err);
  }
}

// ─── PATCH /api/servicos/:id/ativo ───────────────────────────────────────────
async function alternarAtivo(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const { ativo } = toggleAtivoSchema.parse(req.body);
    const servico = await servicosService.toggleAtivo(id, ativo);
    res.json(servico);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizar,
  alternarAtivo,
};
