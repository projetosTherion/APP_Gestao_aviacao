# Groundwork antecipado de Pedidos (Dupla 3 - Sprint 2)

Este documento descreve a API de **Pedidos** implementada pela **Dupla 3 (Tiago & Pedro)** durante a Sprint 2, antecipando a estrutura de backend para des-riscar a Sprint 3.

---

## Rotas Disponíveis (`/api/pedidos`)

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/pedidos` | Lista todos os pedidos cadastrados |
| `GET` | `/api/pedidos/:id` | Retorna o pedido completo com seus itens |
| `POST` | `/api/pedidos` | Cria um novo pedido com cálculo automático de totais |
| `PATCH` | `/api/pedidos/:id/status` | Atualiza o status (`pendente`, `aprovado`, `concluido`) |
| `DELETE` | `/api/pedidos/:id` | Remove o pedido |

---

## Exemplos de Payload

### 1. Criar Pedido (`POST /api/pedidos`)

**Body (JSON):**
```json
{
  "cliente_id": "c1010101-1111-2222-3333-444444444444",
  "cliente_nome": "AeroTaxi Brasil Ltda",
  "observacoes": "Revisão periódica de 100 horas",
  "itens": [
    {
      "servico_id": "s1000000-0000-0000-0000-000000000001",
      "descricao": "Inspeção de Motor Lycoming",
      "quantidade": 1,
      "valor_unitario": 1500.00
    },
    {
      "servico_id": "s1000000-0000-0000-0000-000000000002",
      "descricao": "Calibração de Avionicos",
      "quantidade": 2,
      "valor_unitario": 500.00
    }
  ]
}
```

**Resposta (201 Created):**
```json
{
  "sucesso": true,
  "mensagem": "Pedido criado com sucesso!",
  "dados": {
    "id": "uuid-gerado",
    "cliente_id": "c1010101-1111-2222-3333-444444444444",
    "cliente_nome": "AeroTaxi Brasil Ltda",
    "status": "pendente",
    "total": 2500.0,
    "observacoes": "Revisão periódica de 100 horas",
    "criado_em": "2026-09-01T21:00:00.000Z",
    "atualizado_em": "2026-09-01T21:00:00.000Z",
    "itens": [
      {
        "id": "uuid-item-1",
        "servico_id": "s1000000-0000-0000-0000-000000000001",
        "descricao": "Inspeção de Motor Lycoming",
        "quantidade": 1,
        "valor_unitario": 1500.0,
        "total_item": 1500.0
      },
      {
        "id": "uuid-item-2",
        "servico_id": "s1000000-0000-0000-0000-000000000002",
        "descricao": "Calibração de Avionicos",
        "quantidade": 2,
        "valor_unitario": 500.0,
        "total_item": 1000.0
      }
    ]
  }
}
```

### 2. Atualizar Status (`PATCH /api/pedidos/:id/status`)

**Body (JSON):**
```json
{
  "status": "aprovado"
}
```

---

## Regras de Negócio Implementadas

1. **Cálculo Automático de Totais**:
   - `total_item = quantidade * valor_unitario`
   - `total = soma(total_item)`
2. **Status Padrão**: Todo pedido é criado inicialmente como `pendente`.
3. **Validação de Status**: Apenas `pendente`, `aprovado` e `concluido` são permitidos.
4. **Sem Peças / Estoque**: O cadastro de itens contempla exclusivamente serviços, conforme a nota de escopo do projeto.
