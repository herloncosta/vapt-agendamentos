# 4. Plano Geral de Testes e Engenharia de Performance

## 4.1. Estrutura e Cobertura de Testes

O projeto adotará a metodologia TDD (Test-Driven Development) nas áreas críticas da regra de negócio (especialmente no motor de cálculo de janelas de horários e concorrência). A meta global do projeto é obter no mínimo **85% de cobertura de código (code coverage)**.

### Ferramental:

- **Back-end:** Vitest (alternativa mais rápida ao Jest nativa para TypeScript) + Supertest (para testes de integração E2E).
- **Front-end:** Vitest + React Testing Library + MSW (Mock Service Worker) para simular chamadas de API sem onerar o servidor de desenvolvimento.

### Exemplo de Teste Unitário Crítico (Vitest):

```typescript
import { describe, it, expect, beforeEach, vi } from "vitest";
import { CreateAppointmentUseCase } from "./CreateAppointmentUseCase";
import { InMemoryAppointmentsRepository } from "../repositories/in-memory/InMemoryAppointmentsRepository";
import { AppError } from "../../shared/errors/AppError";

describe("Caso de Uso - Criar Agendamento", () => {
  let appointmentsRepository: InMemoryAppointmentsRepository;
  let createAppointment: CreateAppointmentUseCase;

  beforeEach(() => {
    appointmentsRepository = new InMemoryAppointmentsRepository();
    createAppointment = new CreateAppointmentUseCase(appointmentsRepository);
  });

  it("nao deve permitir agendamento em horario retroativo", async () => {
    await expect(
      createAppointment.execute({
        customerId: "customer-1",
        professionalId: "professional-1",
        serviceId: "service-1",
        startTime: new Date(2020, 1, 1, 10, 0), // Data passada fixa
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
```
