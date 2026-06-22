# AGENTS.md — VAPT Agendamentos

Repo vazio — tudo por construir. As especificações estão em `.specs/`. Leia-as antes de implementar.

## Stack

- **Back:** Node + Express + TypeScript, Clean Architecture (Controller → UseCase → Repository)
- **Front:** React + Vite + TypeScript, Tailwind, shadcn/ui, Zustand, Framer Motion
- **DB:** PostgreSQL via Prisma ORM
- **Cache:** Redis (horários disponíveis)
- **Test:** Vitest + Supertest (back), Vitest + React Testing Library + MSW (front)
- **Infra:** Docker Compose (app + PostgreSQL + Redis)

## Comandos (planejados, confirmar após setup)

```sh
npm run dev          # dev server com Docker
npm run build        # build produção front
npx prisma migrate dev  # migrations
npx prisma db seed   # seed com roles ADMIN/PROFESSIONAL
docker compose up --build  # sobe tudo
```

Rodar `lint → typecheck → test` antes de commits.

## Arquitetura

```
src/
  modules/
    appointments/     # domain: agendamentos
    users/            # domain: autenticação, LGPD
    services/         # domain: serviços
    schedules/        # domain: disponibilidade
  shared/
    infra/http/middlewares/  # globalErrorHandler, auth, rbac
    errors/AppError.ts       # erro padronizado
    repositories/            # interfaces + in-memory (testes)
```

- Repository pattern: Prisma encapsulado em repositórios. UseCases não conhecem banco.
- Zod validation na borda HTTP (controllers), antes de chegar aos UseCases.
- DTOs explícitos para entrada/saída — nunca vazar `passwordHash` ou colunas internas.
- AppError para erros de negócio; globalErrorHandler trata AppError, ZodError, e erros não esperados (500 genérico).
- Rotas versionadas: `/api/v1/...`

## Convenções críticas

- **Senhas:** bcryptjs com cost >= 12
- **JWT:** token em cookie HttpOnly, Secure, SameSite=Strict; refresh token separado
- **LGPD:** consentimento explícito (opt-in, checkbox desmarcado); direito ao esquecimento (anonimização, não deleção física); dados mínimos
- **Concorrência:** `prisma.$transaction` para criação de agendamentos — teste com 10 req simultâneas, só 1 deve passar (409 Conflict)
- **Cache Redis:** slots disponíveis; invalidar ao criar/cancelar agendamento na mesma data
- **Mobile-first:** touch targets >= 48dp, layout fluido (rem/em/%), viewport com `user-scalable=no`
- **Acessibilidade:** WCAG 2.1 AA, contraste >= 4.5:1, navegação por teclado, ARIA, erros nunca só por cor
- **Segurança:** TLS 1.3, CSP/HSTS/X-Frame-Options, rate limiting, sanitização de inputs
- **DTOs:** tipagem explícita. Repository devolve DTO, não entidade Prisma direta.

## Testes

- Meta: >= 85% cobertura
- TDD nas áreas críticas (motor de slots + concorrência)
- Repositórios InMemory para testes unitários de UseCases
- Supertest para integração E2E (back); MSW para mock de API (front)
- Teste obrigatório: criação de agendamento concorrente (10 req, 1 success 9 conflict)
- Teste obrigatório: RBAC — rota de profissional não acessível por CUSTOMER
- Teste obrigatório: cadastro sem consentimento LGPD rejeitado

## Modelos Prisma

`User` (CUSTOMER | PROFESSIONAL | ADMIN), `Service`, `Schedule` (dayOfWeek+startTime+endTime+lunch), `Appointment` (PENDING | CONFIRMED | CANCELLED | COMPLETED), `SecurityLog`. UUIDs como IDs padrão.
