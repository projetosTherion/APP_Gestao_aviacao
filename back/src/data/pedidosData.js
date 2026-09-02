const crypto = require('crypto');

/**
 * Repositório em memória para Pedidos (Groundwork Sprint 2 - Dupla 3)
 * Estrutura 100% alinhada ao db/schema.sql (PostgreSQL).
 */

const mockPedidos = [
  {
    id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    cliente_id: 'c1010101-1111-2222-3333-444444444444',
    cliente_nome: 'AeroTaxi Brasil Ltda',
    status: 'pendente', // 'pendente' | 'aprovado' | 'concluido'
    total: 2500.00,
    observacoes: 'Inspeção periódica de 100 horas da aeronave.',
    criado_em: new Date('2026-09-01T10:00:00Z').toISOString(),
    atualizado_em: new Date('2026-09-01T10:00:00Z').toISOString(),
    itens: [
      {
        id: crypto.randomUUID(),
        servico_id: 's1000000-0000-0000-0000-000000000001',
        descricao: 'Inspeção de Motor Lycoming',
        quantidade: 1,
        valor_unitario: 1500.00,
        total_item: 1500.00
      },
      {
        id: crypto.randomUUID(),
        servico_id: 's1000000-0000-0000-0000-000000000002',
        descricao: 'Calibração de Avionicos',
        quantidade: 2,
        valor_unitario: 500.00,
        total_item: 1000.00
      }
    ]
  },
  {
    id: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    cliente_id: 'c2020202-2222-3333-4444-555555555555',
    cliente_nome: 'Helisul Aviação',
    status: 'aprovado',
    total: 1200.00,
    observacoes: 'Troca de óleo e filtro de motor.',
    criado_em: new Date('2026-09-01T14:30:00Z').toISOString(),
    atualizado_em: new Date('2026-09-01T14:30:00Z').toISOString(),
    itens: [
      {
        id: crypto.randomUUID(),
        servico_id: 's1000000-0000-0000-0000-000000000003',
        descricao: 'Serviço de Manutenção Preventiva',
        quantidade: 1,
        valor_unitario: 1200.00,
        total_item: 1200.00
      }
    ]
  }
];

module.exports = {
  pedidos: mockPedidos
};
