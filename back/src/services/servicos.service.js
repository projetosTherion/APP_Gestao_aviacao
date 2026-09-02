const prisma = require("../lib/prisma");

// ─── Listar todos os serviços ─────────────────────────────────────────────────
async function listarServicos({ ativo, busca } = {}) {
  const where = {};

  // Filtro por status ativo
  if (ativo !== undefined) {
    where.ativo = ativo === "true" || ativo === true;
  }

  // Busca por nome (case-insensitive)
  if (busca) {
    where.nome = { contains: busca, mode: "insensitive" };
  }

  return prisma.servico.findMany({
    where,
    orderBy: { nome: "asc" },
  });
}

// ─── Buscar serviço por ID ────────────────────────────────────────────────────
async function buscarServicoPorId(id) {
  const servico = await prisma.servico.findUnique({ where: { id } });

  if (!servico) {
    const err = new Error("Serviço não encontrado");
    err.statusCode = 404;
    throw err;
  }

  return servico;
}

// ─── Criar serviço ────────────────────────────────────────────────────────────
async function criarServico(dados) {
  return prisma.servico.create({ data: dados });
}

// ─── Atualizar serviço ────────────────────────────────────────────────────────
async function atualizarServico(id, dados) {
  // findUnique primeiro para garantir 404 explícito
  await buscarServicoPorId(id);

  return prisma.servico.update({
    where: { id },
    data: dados,
  });
}

// ─── Alternar status ativo ────────────────────────────────────────────────────
async function toggleAtivo(id, ativo) {
  await buscarServicoPorId(id);

  return prisma.servico.update({
    where: { id },
    data: { ativo },
  });
}

module.exports = {
  listarServicos,
  buscarServicoPorId,
  criarServico,
  atualizarServico,
  toggleAtivo,
};
