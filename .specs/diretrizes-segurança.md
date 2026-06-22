# 3. Manual de Boas Práticas, Segurança e Clean Code

## 3.1. Padrões de Projeto Adotados (Design Patterns)

1.  **Repository Pattern:** Toda a comunicação direta com o banco através do Prisma será enclausurada em classes repositórias. Os Casos de Uso (`UseCases`) não sabem qual banco está rodando por baixo.
2.  **Controller Pattern:** Camada exclusiva para lidar com transporte HTTP, extração de cookies, validação de esquemas com Zod e direcionamento para a camada de negócios.
3.  **Data Transfer Object (DTO):** Tipagem explícita para dados de entrada e saída das funções internas, evitando vazamento de colunas cruciais do banco (como `passwordHash`).

## 3.2. Tratamento Global de Erros (Back-end)

Nenhum erro de banco ou exceção não tratada deve vazar para o cliente final, prevenindo falhas catastróficas de vazamento de informações internas estruturais (_Information Disclosure_).

```typescript
// src/shared/errors/AppError.ts
export class AppError {
  public readonly message: string;
  public readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
}

// src/shared/infra/http/middlewares/globalErrorHandler.ts
import { Request, Response, NextFunction } from "express";
import { AppError } from "../../errors/AppError";
import { ZodError } from "zod";

export function globalErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      status: "validation_error",
      errors: err.errors.map((z) => ({
        field: z.path.join("."),
        message: z.message,
      })),
    });
  }

  // Log de segurança interno (para o time técnico auditar)
  console.error("[CRITICAL INTERNAL ERROR]:", err);

  return res.status(500).json({
    status: "error",
    message: "Internal server error. Contact the administration.",
  });
}
```
