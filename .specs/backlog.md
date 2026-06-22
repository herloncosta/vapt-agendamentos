# 2. Backlog Técnico de Desenvolvimento (Jira/DevOps Pattern)

## ÉPICO 1: Infraestrutura Básica, DevOps e Segurança Inicial

### Task 1.1: Inicialização do Ambiente Back-end e Dockerização

- **Descrição:** Configurar o ambiente inicial da API Node.js utilizando TypeScript, Express e criar o ecossistema multi-container com Docker Compose contendo a aplicação e o banco PostgreSQL.
- **Critérios de Aceite:**
  - `tsconfig.json` configurado com regras estritas (`strict: true`, `noImplicitAny: true`).
  - `docker-compose.yml` instanciando PostgreSQL e Redis com volumes persistentes.
  - Script `npm run dev` executando em ambiente de desenvolvimento assistido pelo Docker.
- **Definição de Pronto (DoR/DoD):** Código passa pelo Linter sem erros e os containers sobem via comando único `docker compose up --build`.

### Task 1.2: Setup do Prisma ORM e Migrations Iniciais

- **Descrição:** Configurar o Prisma ORM, mapear as entidades base (`User`, `Service`, `Schedule`, `Appointment`, `SecurityLog`) e rodar a migration inicial.
- **Critérios de Aceite:**
  - Arquivo `schema.prisma` gerado com os índices e restrições corretas.
  - Script de Seed populando o banco com as Roles padrões (`ADMIN`, `PROFESSIONAL`).
- **Definição de Pronto:** Execução do comando `npx prisma migrate dev` sem falhas e banco populado com dados de teste.

### Task 1.3: Setup do Front-end Mobile-First com Radix/Shadcn

- **Descrição:** Inicializar a aplicação React com Vite + TypeScript, configurar Tailwind CSS e instalar as dependências visuais primárias (`shadcn/ui`, `lucide-react`, `framer-motion`).
- **Critérios de Aceite:**
  - Configuração do viewport no `index.html` travando zoom acidental em dispositivos móveis.
  - Tema de cores configurado com alto contraste (conforme WCAG 2.1 AA).
- **Definição de Pronto:** Execução limpa do build de produção (`npm run build`) gerando assets otimizados.

---

## ÉPICO 2: Autenticação, LGPD e Gestão de Usuários

### Task 2.1: Endpoint de Cadastro de Usuário com Validação Zod e Consentimento LGPD

- **Descrição:** Desenvolver o fluxo de registro de clientes coletando apenas os dados mínimos (`name`, `email`, `password`, `phone`), exigindo a confirmação ativa dos termos de uso (LGPD).
- **Critérios de Aceite:**
  - Senha criptografada usando `bcryptjs` com fator de custo mínimo de 12 saltos.
  - Validação estrita de entrada via Zod lançando erro padronizado `400 Bad Request`.
  - Armazenamento do aceite do usuário documentando versão dos termos aceitos.
- **Definição de Pronto:** Teste unitário cobrindo criação válida, e teste bloqueando criação com e-mail duplicado ou sem aceite da LGPD.

### Task 2.2: Autenticação Segura via JWT e Cookie HttpOnly

- **Descrição:** Desenvolver o endpoint `/api/v1/auth/login` gerando tokens JWT e implementando a estratégia de gerenciamento seguro através de cookies.
- **Critérios de Aceite:**
  - Token de acesso enviado em cookie seguro (`HttpOnly`, `Secure`, `SameSite=Strict`).
  - Criação de Middleware do Express para verificação e validação de Roles (`Role-Based Access Control - RBAC`).
- **Definição de Pronto:** Teste de integração garantindo que rotas restritas de profissionais não possam ser acessadas por usuários com role `CUSTOMER`.

### Task 2.3: Funcionalidade Exclusão de Conta (Direito ao Esquecimento LGPD)

- **Descrição:** Criar endpoint para deleção lógica/anonimização de dados a pedido do usuário.
- **Critérios de Aceite:**
  - Remoção total de dados identificadores do usuário (`name` vira "Usuário Removido", `email` e `phone` sofrem hash aleatório).
  - Manutenção dos IDs e valores nas tabelas de faturamento/agendamento para consistência estatística histórica.

---

## ÉPICO 3: Motor de Agendamento e Regras de Negócio Core

### Task 3.1: Cadastro de Horários de Trabalho e Bloqueios (Profissionais)

- **Descrição:** Interface e API para definição da matriz de disponibilidade dos profissionais de beleza (Dias da semana, horários de início, fim e intervalo).
- **Critérios de Aceite:**
  - Zod validando integridade temporal (Ex: `startTime` obrigatoriamente anterior ao `endTime`).
- **Definição de Pronto:** Teste cobrindo rejeição de cadastro onde o horário de término seja menor que o de almoço.

### Task 3.2: Endpoint de Consulta de Janelas Disponíveis com Cache Redis

- **Descrição:** Motor algoritmo que cruza a agenda padrão do profissional, os agendamentos já existentes e retorna as frações de tempo livres para o cliente final.
- **Critérios de Aceite:**
  - A requisição consome primeiramente a chave estruturada no Redis.
  - Invalidação de cache automatizada sempre que um agendamento for concluído na mesma data do profissional.
- **Definição de Pronto:** Testes de integração garantindo que se o profissional X tem agendamento das 14:00 às 14:30, o horário de 14:00 não apareça disponível.

### Task 3.3: Criação de Agendamentos Concorrentes (Garantia ACID)

- **Descrição:** Endpoint de criação de agendamento que impede que dois clientes reservem simultaneamente a mesma fração de tempo com o mesmo profissional.
- **Critérios de Aceite:**
  - Uso de transações isoladas do Prisma ORM (`prisma.$transaction`).
- **Definição de Pronto:** Teste de estresse disparando 10 requisições idênticas simultâneas para a mesma vaga: apenas 1 deve ter sucesso (201 Created), as outras 9 devem falhar com erro de conflito (409 Conflict).

---

## ÉPICO 4: Interface do Usuário (Front-end Mobile-First)

### Task 4.1: Tela de Agendamento em Etapas (Wizard Mobile UX)

- **Descrição:** Desenvolver o fluxo unificado de agendamento em passos: 1. Escolha do Serviço -> 2. Escolha do Profissional -> 3. Escolha do Horário -> 4. Confirmação.
- **Critérios de Aceite:**
  - Estado da aplicação mantido temporariamente em store global do Zustand.
  - Uso de `framer-motion` para animações deslizantes entre as etapas.
- **Definição de Pronto:** Performance avaliada em emulador móvel acusando zero lentidão na troca de etapas.

### Task 4.2: Painel do Administrador / Visão Multicolunas da Agenda

- **Descrição:** Visualização em formato de grade/calendário contendo as agendas dos profissionais lado a lado para controle interno da recepção.
- **Critérios de Aceite:**
