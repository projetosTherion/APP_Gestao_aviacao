const test = require('node:test');
const assert = require('node:assert/strict');

const clientesService = require('../src/services/clientesService');
const pedidosService = require('../src/services/pedidosService');

const novoClienteValido = (extra = {}) => ({
  nome: 'Cliente Teste',
  documento: '111.444.777-35',
  email: 'TESTE@Email.com',
  telefone: '(11) 91234-5678',
  logradouro: 'Rua A',
  numero: '10',
  cidade: 'Campinas',
  estado: 'sp',
  ...extra
});

test('listarClientes retorna ordenado por nome e filtra por busca', () => {
  const todos = clientesService.listarClientes();
  const nomes = todos.map((c) => c.nome);
  assert.deepEqual(nomes, [...nomes].sort((a, b) => a.localeCompare(b, 'pt-BR')));

  const porNome = clientesService.listarClientes({ busca: 'helisul' });
  assert.equal(porNome.length, 1);
  assert.equal(porNome[0].nome, 'Helisul Aviação');

  const porDocumento = clientesService.listarClientes({ busca: '123.456.789-09' });
  assert.equal(porDocumento.length, 1);
  assert.equal(porDocumento[0].documento, '12345678909');
});

test('criarCliente normaliza documento, e-mail, telefone e UF', () => {
  const criado = clientesService.criarCliente(novoClienteValido());

  assert.ok(criado.id);
  assert.equal(criado.documento, '11144477735');
  assert.equal(criado.email, 'teste@email.com');
  assert.equal(criado.telefone, '11912345678');
  assert.equal(criado.estado, 'SP');
  assert.equal(criado.criado_em, criado.atualizado_em);
  assert.equal(clientesService.obterClientePorId(criado.id), criado);

  clientesService.deletarCliente(criado.id);
});

test('criarCliente rejeita dados inválidos com statusCode 400', () => {
  assert.throws(
    () => clientesService.criarCliente(novoClienteValido({ nome: '  ' })),
    (e) => e.statusCode === 400 && /nome/i.test(e.message)
  );
  assert.throws(
    () => clientesService.criarCliente(novoClienteValido({ documento: '123' })),
    (e) => e.statusCode === 400 && /CPF|CNPJ/.test(e.message)
  );
  assert.throws(
    () => clientesService.criarCliente(novoClienteValido({ email: 'invalido' })),
    (e) => e.statusCode === 400 && /e-mail/i.test(e.message)
  );
  assert.throws(
    () => clientesService.criarCliente(novoClienteValido({ estado: 'XX' })),
    (e) => e.statusCode === 400 && /estado/i.test(e.message)
  );
});

test('criarCliente rejeita documento duplicado com statusCode 409', () => {
  assert.throws(
    () => clientesService.criarCliente(novoClienteValido({ documento: '12.345.678/0001-90' })),
    (e) => e.statusCode === 409
  );
});

test('atualizarCliente aplica atualização parcial e mantém unicidade', () => {
  const criado = clientesService.criarCliente(novoClienteValido({ documento: '52998224725' }));

  const atualizado = clientesService.atualizarCliente(criado.id, { cidade: 'Sorocaba', email: '' });
  assert.equal(atualizado.cidade, 'Sorocaba');
  assert.equal(atualizado.email, null);
  assert.equal(atualizado.nome, 'Cliente Teste');

  assert.throws(
    () => clientesService.atualizarCliente(criado.id, { documento: '12345678000190' }),
    (e) => e.statusCode === 409
  );
  assert.throws(
    () => clientesService.atualizarCliente(criado.id, {}),
    (e) => e.statusCode === 400
  );
  assert.throws(
    () => clientesService.atualizarCliente('nao-existe', { nome: 'X' }),
    (e) => e.statusCode === 404
  );

  clientesService.deletarCliente(criado.id);
});

test('listarPedidosDoCliente retorna histórico do cliente', () => {
  const pedidos = clientesService.listarPedidosDoCliente('c1010101-1111-2222-3333-444444444444');
  assert.ok(pedidos.length >= 1);
  assert.ok(pedidos.every((p) => p.cliente_id === 'c1010101-1111-2222-3333-444444444444'));

  assert.throws(
    () => clientesService.listarPedidosDoCliente('nao-existe'),
    (e) => e.statusCode === 404
  );
});

test('deletarCliente bloqueia exclusão com pedidos vinculados', () => {
  const criado = clientesService.criarCliente(novoClienteValido({ documento: '39053344705' }));
  const pedido = pedidosService.criarPedido({
    cliente_id: criado.id,
    cliente_nome: criado.nome,
    itens: [{ descricao: 'Serviço', quantidade: 1, valor_unitario: 100 }]
  });

  assert.throws(
    () => clientesService.deletarCliente(criado.id),
    (e) => e.statusCode === 409
  );

  pedidosService.deletarPedido(pedido.id);
  const removido = clientesService.deletarCliente(criado.id);
  assert.equal(removido.id, criado.id);
  assert.equal(clientesService.obterClientePorId(criado.id), null);

  assert.throws(
    () => clientesService.deletarCliente(criado.id),
    (e) => e.statusCode === 404
  );
});
