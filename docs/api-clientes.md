# API de Clientes (Dupla 1 - Sprint 2)

Módulo de **Clientes** implementado pela **Dupla 1 (Raul & Thiago)** na Sprint 2: CRUD completo (back + front) e histórico de pedidos vinculados a cada cliente.

Persistência atual: em memória (`back/src/data/clientesData.js`), com a mesma estrutura da tabela `clientes` do [schema.sql](../db/schema.sql). Quando o PostgreSQL for ligado, apenas o service muda.

---

## Rotas (`/api/clientes`)

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/clientes` | Lista clientes ordenados por nome. Aceita `?busca=` (nome, CPF/CNPJ ou e-mail) |
| `GET` | `/api/clientes/:id` | Retorna um cliente |
| `GET` | `/api/clientes/:id/pedidos` | Histórico de pedidos do cliente (mais recentes primeiro) |
| `POST` | `/api/clientes` | Cria um cliente |
| `PUT` / `PATCH` | `/api/clientes/:id` | Atualiza um cliente (parcial: só os campos enviados) |
| `DELETE` | `/api/clientes/:id` | Remove um cliente |

Formato de resposta (mesmo padrão de pedidos):

```json
{ "sucesso": true, "dados": { ... }, "mensagem": "opcional", "quantidade": 3 }
{ "sucesso": false, "erro": "Mensagem legível para o usuário." }
```

---

## Campos do cliente

| Campo | Tipo | Obrigatório | Regras |
|---|---|---|---|
| `nome` | string (≤160) | sim | |
| `documento` | string | sim | CPF (11 dígitos) ou CNPJ (14 dígitos). Máscara é removida; **único** |
| `email` | string (≤254) | não | Validado e salvo em minúsculas |
| `telefone` | string | não | 10 ou 11 dígitos (DDD + número). Máscara é removida |
| `logradouro` | string (≤160) | não | |
| `numero` | string (≤20) | não | |
| `cidade` | string (≤100) | não | |
| `estado` | char(2) | não | UF válida, salva em maiúsculas |
| `criado_em` / `atualizado_em` | ISO 8601 | gerados | |

---

## Exemplos

### Criar (`POST /api/clientes`)

```json
{
  "nome": "AeroTaxi Brasil Ltda",
  "documento": "12.345.678/0001-90",
  "email": "contato@aerotaxibrasil.com.br",
  "telefone": "(11) 98765-4321",
  "logradouro": "Av. Santos Dumont",
  "numero": "1500",
  "cidade": "São Paulo",
  "estado": "SP"
}
```

Resposta `201 Created`:

```json
{
  "sucesso": true,
  "mensagem": "Cliente cadastrado com sucesso!",
  "dados": {
    "id": "uuid-gerado",
    "nome": "AeroTaxi Brasil Ltda",
    "documento": "12345678000190",
    "email": "contato@aerotaxibrasil.com.br",
    "telefone": "11987654321",
    "logradouro": "Av. Santos Dumont",
    "numero": "1500",
    "cidade": "São Paulo",
    "estado": "SP",
    "criado_em": "2026-09-02T12:00:00.000Z",
    "atualizado_em": "2026-09-02T12:00:00.000Z"
  }
}
```

### Atualizar (`PUT /api/clientes/:id`)

```json
{ "cidade": "Campinas", "email": "" }
```

Campos vazios em `email`, `telefone`, endereço e `estado` são salvos como `null`.

---

## Códigos de erro

| HTTP | Quando |
|---|---|
| `400` | Validação (nome vazio, documento com tamanho inválido, e-mail/telefone/UF inválidos, atualização sem campos) |
| `404` | Cliente não encontrado |
| `409` | CPF/CNPJ já cadastrado em outro cliente **ou** exclusão de cliente com pedidos vinculados |

A exclusão bloqueada espelha a FK `pedidos.cliente_id -> clientes(id)` (sem `on delete cascade`) do schema.

---

## Frontend

| Rota | Tela |
|---|---|
| `/clientes` | Listagem com busca (debounce), tabela no desktop e cards no mobile, exclusão com confirmação |
| `/clientes/novo` | Cadastro (máscara automática CPF/CNPJ e telefone, seleção de UF) |
| `/clientes/:id` | Detalhe + histórico de pedidos com status e totais |
| `/clientes/:id/editar` | Edição (mesmo formulário do cadastro) |

Arquivos principais:

- `app-gestao-aviacao/src/services/api.js` — cliente HTTP (`VITE_API_URL`, envia `Authorization: Bearer` quando houver token)
- `app-gestao-aviacao/src/services/clientesService.js`
- `app-gestao-aviacao/src/pages/Clientes/*`
- `app-gestao-aviacao/src/components/layout/AppLayout.jsx` — sidebar/topbar compartilhados por toda a área autenticada (novos módulos entram em `SECOES_MENU`)
- `app-gestao-aviacao/src/utils/mascaras.js` — máscaras e formatadores pt-BR

## Testes

```bash
cd back
npm test
```

Cobertura em `back/test/clientesService.test.js`: ordenação/busca, normalização, validações (400), duplicidade (409), atualização parcial, histórico e bloqueio de exclusão.
