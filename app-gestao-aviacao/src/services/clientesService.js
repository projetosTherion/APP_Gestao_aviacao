/**
 * clientesService.js
 * Camada de serviço de Clientes — consome a API real (/api/clientes).
 * Retorna sempre o campo `dados` da resposta padrão do backend.
 */
import { api } from './api';

const BASE = '/api/clientes';

/**
 * Lista clientes, com filtro opcional por nome, CPF/CNPJ ou e-mail.
 * @param {{ busca?: string }} filtros
 * @returns {Promise<object[]>}
 */
export const listarClientes = async ({ busca } = {}) => {
  const resposta = await api.get(BASE, { busca });
  return resposta.dados;
};

/**
 * @param {string} id
 * @returns {Promise<object>}
 */
export const obterCliente = async (id) => {
  const resposta = await api.get(`${BASE}/${id}`);
  return resposta.dados;
};

/**
 * Histórico de pedidos vinculados ao cliente.
 * @param {string} id
 * @returns {Promise<object[]>}
 */
export const listarPedidosDoCliente = async (id) => {
  const resposta = await api.get(`${BASE}/${id}/pedidos`);
  return resposta.dados;
};

/**
 * @param {{
 *   nome: string, documento: string, email?: string, telefone?: string,
 *   logradouro?: string, numero?: string, cidade?: string, estado?: string
 * }} dados
 * @returns {Promise<object>} cliente criado
 */
export const criarCliente = async (dados) => {
  const resposta = await api.post(BASE, dados);
  return resposta.dados;
};

/**
 * @param {string} id
 * @param {object} dados campos a atualizar
 * @returns {Promise<object>} cliente atualizado
 */
export const atualizarCliente = async (id, dados) => {
  const resposta = await api.put(`${BASE}/${id}`, dados);
  return resposta.dados;
};

/**
 * Remove o cliente. O backend responde 409 se houver pedidos vinculados.
 * @param {string} id
 */
export const excluirCliente = async (id) => {
  const resposta = await api.delete(`${BASE}/${id}`);
  return resposta.dados;
};
