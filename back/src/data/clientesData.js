/**
 * Repositório em memória para Clientes (Dupla 1 - Sprint 2)
 * Estrutura alinhada à tabela `clientes` do db/schema.sql (PostgreSQL).
 *
 * Os dois primeiros registros usam os mesmos ids referenciados em
 * pedidosData.js, para que o histórico de pedidos por cliente funcione.
 */

const mockClientes = [
  {
    id: 'c1010101-1111-2222-3333-444444444444',
    nome: 'AeroTaxi Brasil Ltda',
    documento: '12345678000190', // CNPJ, somente dígitos
    email: 'contato@aerotaxibrasil.com.br',
    telefone: '11987654321',
    logradouro: 'Av. Santos Dumont',
    numero: '1500',
    cidade: 'São Paulo',
    estado: 'SP',
    criado_em: new Date('2026-08-20T09:00:00Z').toISOString(),
    atualizado_em: new Date('2026-08-20T09:00:00Z').toISOString()
  },
  {
    id: 'c2020202-2222-3333-4444-555555555555',
    nome: 'Helisul Aviação',
    documento: '98765432000110',
    email: 'financeiro@helisul.com.br',
    telefone: '41999887766',
    logradouro: 'Rua dos Pilotos',
    numero: '42',
    cidade: 'Curitiba',
    estado: 'PR',
    criado_em: new Date('2026-08-22T14:30:00Z').toISOString(),
    atualizado_em: new Date('2026-08-22T14:30:00Z').toISOString()
  },
  {
    id: 'c3030303-3333-4444-5555-666666666666',
    nome: 'Carlos Eduardo Menezes',
    documento: '12345678909', // CPF, somente dígitos
    email: 'carlos.menezes@email.com',
    telefone: '21988776655',
    logradouro: 'Rua das Asas',
    numero: '77',
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    criado_em: new Date('2026-08-25T11:15:00Z').toISOString(),
    atualizado_em: new Date('2026-08-25T11:15:00Z').toISOString()
  }
];

module.exports = {
  clientes: mockClientes
};
