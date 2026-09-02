# AeroGestão

Sistema web interno para gestão de prestadores de serviços. Este repositório contém o frontend em React e o backend em Express.

## Rodar localmente

Em dois terminais:

```bash
cd app-gestao-aviacao
npm install
npm run dev
```

```bash
cd back
cp .env.example .env
npm install
npm run dev
```

O frontend abre em `http://localhost:5173` e o backend responde em `http://localhost:4000`.

O frontend lê a URL do backend em `VITE_API_URL` (veja `app-gestao-aviacao/.env.example`); sem a variável, usa `http://localhost:4000`.

## Qualidade

```bash
cd app-gestao-aviacao
npm run lint
npm run build
```

```bash
cd back
npm test
```

O GitHub Actions executa essas verificações a cada pull request e push para `main`.

## Documentação da arquitetura

- [Modelo de dados](docs/modelo-de-dados.md)
- [Checklist das diretrizes de PDF](docs/diretrizes-pdf.md)
- [API de Clientes](docs/api-clientes.md)
- [Groundwork de Pedidos](docs/groundwork-pedidos.md)
- [Schema SQL PostgreSQL](db/schema.sql)
