const clientesService = require('../services/clientesService');

/**
 * Controller HTTP para o recurso de Clientes (Dupla 1 - Sprint 2)
 * Formato de resposta segue o padrão já usado em pedidos:
 *   { sucesso, dados, mensagem?, quantidade? } | { sucesso: false, erro }
 */

function responderErro(res, error) {
  const status = error.statusCode || 500;
  const mensagem = status === 500 ? 'Erro interno ao processar clientes.' : error.message;
  if (status === 500) console.error('[clientes]', error);
  return res.status(status).json({ sucesso: false, erro: mensagem });
}

function listar(req, res) {
  try {
    const lista = clientesService.listarClientes({ busca: req.query.busca });
    return res.json({ sucesso: true, quantidade: lista.length, dados: lista });
  } catch (error) {
    return responderErro(res, error);
  }
}

function buscarPorId(req, res) {
  try {
    const cliente = clientesService.obterClientePorId(req.params.id);
    if (!cliente) {
      return res.status(404).json({ sucesso: false, erro: 'Cliente não encontrado.' });
    }
    return res.json({ sucesso: true, dados: cliente });
  } catch (error) {
    return responderErro(res, error);
  }
}

function criar(req, res) {
  try {
    const novoCliente = clientesService.criarCliente(req.body || {});
    return res.status(201).json({
      sucesso: true,
      mensagem: 'Cliente cadastrado com sucesso!',
      dados: novoCliente
    });
  } catch (error) {
    return responderErro(res, error);
  }
}

function atualizar(req, res) {
  try {
    const atualizado = clientesService.atualizarCliente(req.params.id, req.body || {});
    return res.json({
      sucesso: true,
      mensagem: 'Cliente atualizado com sucesso!',
      dados: atualizado
    });
  } catch (error) {
    return responderErro(res, error);
  }
}

function listarPedidos(req, res) {
  try {
    const pedidos = clientesService.listarPedidosDoCliente(req.params.id);
    return res.json({ sucesso: true, quantidade: pedidos.length, dados: pedidos });
  } catch (error) {
    return responderErro(res, error);
  }
}

function deletar(req, res) {
  try {
    const removido = clientesService.deletarCliente(req.params.id);
    return res.json({
      sucesso: true,
      mensagem: 'Cliente removido com sucesso.',
      dados: removido
    });
  } catch (error) {
    return responderErro(res, error);
  }
}

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizar,
  listarPedidos,
  deletar
};
