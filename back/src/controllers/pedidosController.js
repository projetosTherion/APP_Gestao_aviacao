const pedidosService = require('../services/pedidosService');

/**
 * Controller HTTP para o recurso de Pedidos (Dupla 3 - Sprint 2)
 */

function listar(req, res) {
  try {
    const lista = pedidosService.listarPedidos();
    return res.json({
      sucesso: true,
      quantidade: lista.length,
      dados: lista
    });
  } catch (error) {
    return res.status(500).json({ sucesso: false, erro: error.message });
  }
}

function buscarPorId(req, res) {
  try {
    const { id } = req.params;
    const pedido = pedidosService.obterPedidoPorId(id);

    if (!pedido) {
      return res.status(404).json({ sucesso: false, erro: 'Pedido não encontrado.' });
    }

    return res.json({ sucesso: true, dados: pedido });
  } catch (error) {
    return res.status(500).json({ sucesso: false, erro: error.message });
  }
}

function criar(req, res) {
  try {
    const { cliente_id, cliente_nome, observacoes, itens } = req.body;
    const novoPedido = pedidosService.criarPedido({
      cliente_id,
      cliente_nome,
      observacoes,
      itens
    });

    return res.status(201).json({
      sucesso: true,
      mensagem: 'Pedido criado com sucesso!',
      dados: novoPedido
    });
  } catch (error) {
    return res.status(400).json({ sucesso: false, erro: error.message });
  }
}

function atualizarStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        sucesso: false,
        erro: 'O campo "status" é obrigatório.'
      });
    }

    const pedidoAtualizado = pedidosService.atualizarStatusPedido(id, status);

    return res.json({
      sucesso: true,
      mensagem: `Status do pedido atualizado para "${pedidoAtualizado.status}".`,
      dados: pedidoAtualizado
    });
  } catch (error) {
    const statusHttp = error.message.includes('não encontrado') ? 404 : 400;
    return res.status(statusHttp).json({ sucesso: false, erro: error.message });
  }
}

function deletar(req, res) {
  try {
    const { id } = req.params;
    const removido = pedidosService.deletarPedido(id);

    return res.json({
      sucesso: true,
      mensagem: 'Pedido removido com sucesso.',
      dados: removido
    });
  } catch (error) {
    const statusHttp = error.message.includes('não encontrado') ? 404 : 400;
    return res.status(statusHttp).json({ sucesso: false, erro: error.message });
  }
}

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizarStatus,
  deletar
};
