const crypto = require('crypto');
const { pedidos } = require('../data/pedidosData');

const STATUS_VALIDOS = ['pendente', 'aprovado', 'concluido'];

/**
 * Service do módulo de Pedidos (Dupla 3 - Sprint 2 Groundwork)
 * Lógica de negócio, calculo de totais e gestão de status.
 */

function listarPedidos() {
  return pedidos;
}

function obterPedidoPorId(id) {
  return pedidos.find((p) => p.id === id) || null;
}

function criarPedido({ cliente_id, cliente_nome, observacoes, itens }) {
  if (!cliente_id) {
    throw new Error('O id do cliente é obrigatório.');
  }

  if (!itens || !Array.isArray(itens) || itens.length === 0) {
    throw new Error('O pedido deve conter pelo menos um serviço/item.');
  }

  // Processa e calcula subtotais de cada item
  let totalPedido = 0;
  const itensProcessados = itens.map((item) => {
    const qtd = Number(item.quantidade) || 1;
    const valorUnit = Number(item.valor_unitario) || 0;
    const totalItem = Number((qtd * valorUnit).toFixed(2));

    totalPedido += totalItem;

    return {
      id: crypto.randomUUID(),
      servico_id: item.servico_id || null,
      descricao: item.descricao || 'Serviço prestado',
      quantidade: qtd,
      valor_unitario: valorUnit,
      total_item: totalItem
    };
  });

  const agora = new Date().toISOString();

  const novoPedido = {
    id: crypto.randomUUID(),
    cliente_id,
    cliente_nome: cliente_nome || 'Cliente não identificado',
    status: 'pendente',
    total: Number(totalPedido.toFixed(2)),
    observacoes: observacoes || '',
    criado_em: agora,
    atualizado_em: agora,
    itens: itensProcessados
  };

  pedidos.unshift(novoPedido);
  return novoPedido;
}

function atualizarStatusPedido(id, novoStatus) {
  const statusFormatado = String(novoStatus).toLowerCase().trim();

  if (!STATUS_VALIDOS.includes(statusFormatado)) {
    throw new Error(`Status inválido. Status permitidos: ${STATUS_VALIDOS.join(', ')}.`);
  }

  const pedido = obterPedidoPorId(id);
  if (!pedido) {
    throw new Error('Pedido não encontrado.');
  }

  pedido.status = statusFormatado;
  pedido.atualizado_em = new Date().toISOString();

  return pedido;
}

function deletarPedido(id) {
  const index = pedidos.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new Error('Pedido não encontrado para remoção.');
  }

  const [removido] = pedidos.splice(index, 1);
  return removido;
}

module.exports = {
  listarPedidos,
  obterPedidoPorId,
  criarPedido,
  atualizarStatusPedido,
  deletarPedido,
  STATUS_VALIDOS
};
