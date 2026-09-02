const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController');

/**
 * Rotas da API REST de Pedidos (Dupla 3 - Sprint 2 Groundwork)
 * Prefixadas por /api/pedidos
 */

// Listar todos os pedidos
router.get('/', pedidosController.listar);

// Buscar detalhes de 1 pedido pelo ID
router.get('/:id', pedidosController.buscarPorId);

// Criar um novo pedido (com cálculo automático de totais)
router.post('/', pedidosController.criar);

// Atualizar status do pedido ('pendente' | 'aprovado' | 'concluido')
router.patch('/:id/status', pedidosController.atualizarStatus);

// Deletar um pedido
router.delete('/:id', pedidosController.deletar);

module.exports = router;
