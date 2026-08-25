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

## Qualidade

```bash
cd app-gestao-aviacao
npm run lint
npm run build
```

O GitHub Actions executa essas verificações a cada pull request e push para `main`.

## Documentação da arquitetura

- [Modelo de dados](docs/modelo-de-dados.md)
- [Checklist das diretrizes de PDF](docs/diretrizes-pdf.md)
- [Schema SQL PostgreSQL](db/schema.sql)
