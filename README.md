# Aula Loja Carro - Estrutura Front + Back

Projeto reorganizado em duas aplicações:

- `front/`: aplicação React (Vite) com interface de gestão da concessionária.
- `back/`: API Node.js + Prisma para integração com PostgreSQL.

## Banco de dados (PostgreSQL com Docker)

Na raiz do projeto:

```bash
docker compose up -d
```

## Backend

```bash
cd back
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run seed
npm run dev
```

API disponível em `http://localhost:3001`.

## Frontend

```bash
cd front
npm install
npm run dev
```

Frontend disponível em `http://localhost:5173`.
