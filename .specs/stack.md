## 1.2. Stack Tecnológica e Justificativa

- **Back-end:**
  - **Node.js & Express:** Ambiente de execução assíncrono e microframework minimalista de alta performance.
  - **TypeScript:** Tipagem estática para mitigar erros em tempo de compilação e melhorar a manutenibilidade.
  - **Prisma ORM:** Abstração de banco de dados fortemente tipada que previne inconsistências em tempo de execução.
  - **PostgreSQL:** Banco relacional robusto, ideal para consistência ACID em transações e agendamentos.
  - **Zod:** Validação e parsing de esquemas de dados em tempo de execução na borda da aplicação (HTTP Requests).
  - **Docker & Docker Compose:** Conteinerização para garantir paridade estrita entre os ambientes de desenvolvimento, homologação e produção.
- **Front-end:**
  - **React:** Biblioteca de componentização declarativa para interfaces altamente interativas.
  - **Tailwind CSS:** Framework utilitário utilitário para estilização rápida e responsividade focada em Mobile-First.
  - **Zustand:** Gerenciador de estado global atômico, de baixo overhead e sem necessidade de boilerplate massivo (como Redux).
  - **Shadcn/ui (Radix Primitives):** Biblioteca de componentes headless com acessibilidade nativa (cumprindo WCAG 2.1 AA) e customização via Tailwind.
  - **Framer Motion:** Animações fluidas para otimizar a percepção de performance (perceived performance) nas transações de telas em dispositivos móveis.
  - **Lucide React:** Pacote de ícones otimizados para interface visual uniforme.

## 1.3. Modelagem de Dados Base (Entidades Prisma)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  CUSTOMER
  PROFESSIONAL
  ADMIN
}

enum AppointmentStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
}

model User {
  id           String        @id @default(uuid())
  name         String
  email        String        @unique
  passwordHash String
  phone        String        @unique
  role         Role          @default(CUSTOMER)
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  appointments Appointment[] @relation("CustomerAppointments")
  schedules    Schedule[]    @relation("ProfessionalSchedules")
  logs         SecurityLog[]

  @@index([email])
}

model Service {
  id           String        @id @default(uuid())
  name         String
  description  String?
  durationMin  Int
  price        Decimal       @db.Decimal(10, 2)
  isActive     Boolean       @default(true)
  appointments Appointment[]
}

model Schedule {
  id             String   @id @default(uuid())
  professionalId String
  professional   User     @relation("ProfessionalSchedules", fields: [professionalId], references: [id])
  dayOfWeek      Int      // 0 (Domingo) a 6 (Sábado)
  startTime      String   // Formato "HH:MM"
  endTime        String   // Formato "HH:MM"
  lunchStart     String?  // Formato "HH:MM"
  lunchEnd       String?  // Formato "HH:MM"

  @@unique([professionalId, dayOfWeek])
}

model Appointment {
  id             String            @id @default(uuid())
  customerId     String
  customer       User              @relation("CustomerAppointments", fields: [customerId], references: [id])
  professionalId String
  serviceId      String
  service        Service           @relation(fields: [serviceId], references: [id])
  startTime      DateTime
  endTime        DateTime
  status         AppointmentStatus @default(PENDING)
  createdAt      DateTime          @default(now())
  updatedAt      DateTime          @updatedAt

  @@index([startTime, professionalId])
  @@index([customerId])
}

model SecurityLog {
  id        String   @id @default(uuid())
  userId    String?
  user      User?    @relation(fields: [userId], references: [id])
  action    String
  ipAddress String
  userAgent String
  createdAt DateTime @default(now())
}
```
