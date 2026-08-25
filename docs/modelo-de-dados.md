# Modelo de dados

O banco sugerido é PostgreSQL. O arquivo [schema.sql](../db/schema.sql) contém a estrutura inicial e pode ser aplicado quando o banco for escolhido/configurado.

## Decisões de modelagem

- O sistema é mono-tenant: há apenas um registro de `empresas`.
- Usuários podem existir desde a Sprint 1, mas multiusuário não faz parte do produto; por isso `usuarios.empresa_id` fica opcional para evolução futura.
- Valores monetários usam `numeric(12,2)`, nunca `float`.
- Itens de pedido guardam descrição e valor unitário no momento da criação, para preservar o histórico mesmo que o catálogo mude depois.
- O projeto segue o roadmap mais recente: trabalha somente com serviços, sem estoque ou peças.

## Relações

```text
empresa 1 --- N usuario
cliente 1 --- N pedido 1 --- N pedido_item N --- 1 servico
pedido  1 --- N compromisso
pedido  1 --- 1 financeiro
pedido  1 --- N documento
```

## Regras para as próximas sprints

- `pedido.total` é recalculado a partir de `pedido_itens` no backend.
- Um compromisso e um registro financeiro são opcionais por pedido.
- PDFs devem armazenar seu tipo, caminho/URL e data de geração; o conteúdo deve ser gerado a partir dos dados congelados do pedido.
