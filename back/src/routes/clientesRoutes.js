const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientesController');

/**
 * Rotas da API REST de Clientes (Dupla 1 - Sprint 2)
 * Prefixadas por /api/clientes
 */

// Listar clientes (aceita ?busca=termo para filtrar por nome, documento ou e-mail)
router.get('/', clientesController.listar);

// Buscar 1 cliente pelo ID
router.get('/:id', clientesController.buscarPorId);

// Histórico de pedidos vinculados ao cliente
router.get('/:id/pedidos', clientesController.listarPedidos);

// Criar cliente
router.post('/', clientesController.criar);

// Atualizar cliente (parcial ou completo)
router.put('/:id', clientesController.atualizar);
router.patch('/:id', clientesController.atualizar);

// Remover cliente (bloqueado se houver pedidos vinculados)
router.delete('/:id', clientesController.deletar);

module.exports = router;
