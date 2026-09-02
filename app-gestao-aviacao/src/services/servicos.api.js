import api from "../lib/api";

// ─── Listar todos os serviços ─────────────────────────────────────────────────
export async function listarServicos({ ativo, busca } = {}) {
  const params = {};
  if (ativo !== undefined) params.ativo = ativo;
  if (busca) params.busca = busca;

  const { data } = await api.get("/servicos", { params });
  return data;
}

// ─── Buscar serviço por ID ────────────────────────────────────────────────────
export async function buscarServico(id) {
  const { data } = await api.get(`/servicos/${id}`);
  return data;
}

// ─── Criar serviço ────────────────────────────────────────────────────────────
export async function criarServico(payload) {
  const { data } = await api.post("/servicos", payload);
  return data;
}

// ─── Atualizar serviço ────────────────────────────────────────────────────────
export async function atualizarServico(id, payload) {
  const { data } = await api.put(`/servicos/${id}`, payload);
  return data;
}

// ─── Alternar status ativo ────────────────────────────────────────────────────
export async function toggleAtivo(id, ativo) {
  const { data } = await api.patch(`/servicos/${id}/ativo`, { ativo });
  return data;
}
