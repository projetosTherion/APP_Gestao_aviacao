const crypto = require('crypto');
const { clientes } = require('../data/clientesData');
const pedidosService = require('./pedidosService');

/**
 * Service do módulo de Clientes (Dupla 1 - Sprint 2)
 * Regras de negócio, validação e persistência (em memória por enquanto).
 *
 * Erros de negócio carregam `statusCode` para o controller traduzir em HTTP.
 */

const UFS_VALIDAS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function erro(mensagem, statusCode = 400) {
  const e = new Error(mensagem);
  e.statusCode = statusCode;
  return e;
}

const somenteDigitos = (valor = '') => String(valor).replace(/\D/g, '');

const textoOuNulo = (valor) => {
  if (valor === undefined || valor === null) return null;
  const limpo = String(valor).trim();
  return limpo.length ? limpo : null;
};

/**
 * Valida e normaliza os campos de um cliente.
 * Em modo parcial (atualização), campos ausentes são ignorados.
 */
function normalizarCliente(dados = {}, { parcial = false } = {}) {
  const resultado = {};

  if (!parcial || dados.nome !== undefined) {
    const nome = textoOuNulo(dados.nome);
    if (!nome) throw erro('O nome do cliente é obrigatório.');
    if (nome.length > 160) throw erro('O nome deve ter no máximo 160 caracteres.');
    resultado.nome = nome;
  }

  if (!parcial || dados.documento !== undefined) {
    const documento = somenteDigitos(dados.documento);
    if (!documento) throw erro('O CPF/CNPJ do cliente é obrigatório.');
    if (documento.length !== 11 && documento.length !== 14) {
      throw erro('Documento inválido: informe um CPF (11 dígitos) ou CNPJ (14 dígitos).');
    }
    resultado.documento = documento;
  }

  if (!parcial || dados.email !== undefined) {
    const email = textoOuNulo(dados.email);
    if (email && !REGEX_EMAIL.test(email)) throw erro('E-mail inválido.');
    if (email && email.length > 254) throw erro('O e-mail deve ter no máximo 254 caracteres.');
    resultado.email = email ? email.toLowerCase() : null;
  }

  if (!parcial || dados.telefone !== undefined) {
    const telefone = somenteDigitos(dados.telefone);
    if (telefone && (telefone.length < 10 || telefone.length > 11)) {
      throw erro('Telefone inválido: informe DDD + número (10 ou 11 dígitos).');
    }
    resultado.telefone = telefone || null;
  }

  if (!parcial || dados.logradouro !== undefined) {
    const logradouro = textoOuNulo(dados.logradouro);
    if (logradouro && logradouro.length > 160) throw erro('O logradouro deve ter no máximo 160 caracteres.');
    resultado.logradouro = logradouro;
  }

  if (!parcial || dados.numero !== undefined) {
    const numero = textoOuNulo(dados.numero);
    if (numero && numero.length > 20) throw erro('O número deve ter no máximo 20 caracteres.');
    resultado.numero = numero;
  }

  if (!parcial || dados.cidade !== undefined) {
    const cidade = textoOuNulo(dados.cidade);
    if (cidade && cidade.length > 100) throw erro('A cidade deve ter no máximo 100 caracteres.');
    resultado.cidade = cidade;
  }

  if (!parcial || dados.estado !== undefined) {
    const estado = textoOuNulo(dados.estado);
    const uf = estado ? estado.toUpperCase() : null;
    if (uf && !UFS_VALIDAS.includes(uf)) throw erro('Estado inválido: use a sigla da UF (ex: SP).');
    resultado.estado = uf;
  }

  return resultado;
}

function garantirDocumentoUnico(documento, ignorarId = null) {
  const duplicado = clientes.find(
    (c) => c.documento === documento && c.id !== ignorarId
  );
  if (duplicado) {
    throw erro('Já existe um cliente cadastrado com este CPF/CNPJ.', 409);
  }
}

// ─────────────────────────────────────────────
// API pública do service
// ─────────────────────────────────────────────

/**
 * Lista clientes, opcionalmente filtrando por nome, documento ou e-mail.
 * Ordena por nome (pt-BR).
 */
function listarClientes({ busca } = {}) {
  let lista = [...clientes];

  const termo = textoOuNulo(busca);
  if (termo) {
    const termoLower = termo.toLowerCase();
    const termoDigitos = somenteDigitos(termo);
    lista = lista.filter((c) =>
      c.nome.toLowerCase().includes(termoLower) ||
      (c.email && c.email.includes(termoLower)) ||
      (termoDigitos && c.documento.includes(termoDigitos))
    );
  }

  return lista.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
}

function obterClientePorId(id) {
  return clientes.find((c) => c.id === id) || null;
}

function obterClienteOuFalhar(id) {
  const cliente = obterClientePorId(id);
  if (!cliente) throw erro('Cliente não encontrado.', 404);
  return cliente;
}

function criarCliente(dados) {
  const normalizado = normalizarCliente(dados);
  garantirDocumentoUnico(normalizado.documento);

  const agora = new Date().toISOString();
  const novoCliente = {
    id: crypto.randomUUID(),
    ...normalizado,
    criado_em: agora,
    atualizado_em: agora
  };

  clientes.push(novoCliente);
  return novoCliente;
}

function atualizarCliente(id, dados) {
  const cliente = obterClienteOuFalhar(id);
  const normalizado = normalizarCliente(dados, { parcial: true });

  if (Object.keys(normalizado).length === 0) {
    throw erro('Nenhum campo válido informado para atualização.');
  }

  if (normalizado.documento) {
    garantirDocumentoUnico(normalizado.documento, id);
  }

  Object.assign(cliente, normalizado, { atualizado_em: new Date().toISOString() });
  return cliente;
}

/**
 * Histórico de pedidos vinculados ao cliente (item 2 do escopo).
 * Mais recentes primeiro.
 */
function listarPedidosDoCliente(id) {
  obterClienteOuFalhar(id);
  return pedidosService
    .listarPedidos()
    .filter((p) => p.cliente_id === id)
    .sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em));
}

/**
 * Remove o cliente. Bloqueia se houver pedidos vinculados, espelhando a
 * FK `pedidos.cliente_id -> clientes(id)` (sem cascade) do schema.
 */
function deletarCliente(id) {
  const index = clientes.findIndex((c) => c.id === id);
  if (index === -1) throw erro('Cliente não encontrado.', 404);

  const possuiPedidos = pedidosService.listarPedidos().some((p) => p.cliente_id === id);
  if (possuiPedidos) {
    throw erro('Não é possível excluir: o cliente possui pedidos vinculados.', 409);
  }

  const [removido] = clientes.splice(index, 1);
  return removido;
}

module.exports = {
  listarClientes,
  obterClientePorId,
  criarCliente,
  atualizarCliente,
  listarPedidosDoCliente,
  deletarCliente,
  UFS_VALIDAS
};
