-- AeroGestao - modelo inicial PostgreSQL
-- Roadmap vigente: serviços somente (sem peças/estoque).

create type status_pedido as enum ('pendente', 'aprovado', 'concluido');
create type tipo_documento as enum ('orcamento', 'fatura', 'ordem_servico');

create table empresas (
  id uuid primary key,
  nome varchar(160) not null,
  slogan varchar(255),
  cnpj varchar(14) not null unique,
  email_contato varchar(254) not null,
  telefone varchar(20) not null,
  logradouro varchar(160) not null,
  numero varchar(20) not null,
  cidade varchar(100) not null,
  estado char(2) not null,
  logo_url text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table usuarios (
  id uuid primary key,
  empresa_id uuid references empresas(id) on delete set null,
  nome varchar(120) not null,
  email varchar(254) not null unique,
  senha_hash text not null,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table clientes (
  id uuid primary key,
  nome varchar(160) not null,
  documento varchar(14) not null unique,
  email varchar(254),
  telefone varchar(20),
  logradouro varchar(160),
  numero varchar(20),
  cidade varchar(100),
  estado char(2),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table servicos (
  id uuid primary key,
  nome varchar(160) not null,
  unidade varchar(30) not null default 'unidade',
  preco numeric(12,2) not null check (preco >= 0),
  ativo boolean not null default true,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table pedidos (
  id uuid primary key,
  cliente_id uuid not null references clientes(id),
  status status_pedido not null default 'pendente',
  total numeric(12,2) not null default 0 check (total >= 0),
  observacoes text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table pedido_itens (
  id uuid primary key,
  pedido_id uuid not null references pedidos(id) on delete cascade,
  servico_id uuid references servicos(id) on delete set null,
  descricao varchar(160) not null,
  quantidade numeric(10,2) not null check (quantidade > 0),
  valor_unitario numeric(12,2) not null check (valor_unitario >= 0),
  total_item numeric(12,2) generated always as (quantidade * valor_unitario) stored
);

create table compromissos (
  id uuid primary key,
  pedido_id uuid not null references pedidos(id) on delete cascade,
  inicio_em timestamptz not null,
  fim_em timestamptz,
  observacoes text,
  check (fim_em is null or fim_em >= inicio_em)
);

create table financeiros (
  id uuid primary key,
  pedido_id uuid not null unique references pedidos(id) on delete cascade,
  meio_pagamento varchar(20) not null default 'pix' check (meio_pagamento = 'pix'),
  valor numeric(12,2) not null check (valor >= 0),
  pago_em timestamptz
);

create table documentos (
  id uuid primary key,
  pedido_id uuid not null references pedidos(id) on delete cascade,
  tipo tipo_documento not null,
  arquivo_url text not null,
  gerado_em timestamptz not null default now()
);

create index pedidos_cliente_id_idx on pedidos(cliente_id);
create index pedido_itens_pedido_id_idx on pedido_itens(pedido_id);
create index compromissos_inicio_em_idx on compromissos(inicio_em);
