# VAPT Agendamentos

Sistema de agendamentos para o setor de beleza e estética (barbearias, manicures, cabeleireiros).

## Stack

- **Back-end:** Node.js + Express + TypeScript + Prisma + PostgreSQL + Redis + Zod
- **Front-end:** React + Vite + TypeScript + Tailwind CSS + shadcn/ui + Zustand + Framer Motion
- **Infra:** Docker Compose (PostgreSQL + Redis)

## Pré-requisitos

- Node.js >= 20
- Docker e Docker Compose

## Desenvolvimento

```bash
# subir banco e cache
docker compose up -d

# backend
cd backend && npm install && npx prisma migrate dev && npm run dev

# frontend
cd frontend && npm install && npm run dev
```

## Commits

Rodar `lint → typecheck → test` antes de cada commit.
