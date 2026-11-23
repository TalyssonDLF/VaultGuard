# VaultGuard

> Protótipo de backend para estudo de **autenticação, persistência de usuários e segurança de aplicações**.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)

## Contexto

Este repositório contém um backend construído com **NestJS + TypeScript**, **Prisma** e **PostgreSQL**. O foco atual é o fluxo de cadastro e login, estudando separação de responsabilidades entre controllers, serviços e persistência.

**Estado atual:** protótipo de aprendizagem. A presença de JWT e hash de senha **não significa** que a aplicação esteja pronta para produção. Consulte a [seção de segurança](#segurança-e-limitações-conhecidas).

## Funcionalidades encontradas no código

- Cadastro de usuário em `POST /auth/register`.
- Login em `POST /auth/login`, com retorno de token JWT.
- Hash e verificação de senha com **Argon2**.
- Acesso aos dados com **Prisma**.
- Modelo `User` no PostgreSQL, com ID UUID, e-mail único, hash da senha, campo `masterKey` e datas de criação/atualização.

Não há, na versão atual, interface web, rotas de cofre de senhas ou operações completas de gerenciamento de segredos.

## Arquitetura

```text
backend/
  src/
    auth/
      auth.controller.ts      # rotas /auth/register e /auth/login
      auth.service.ts         # hash de senha, persistência e emissão de JWT
      dto/                    # objetos de entrada
    prisma/
      prisma.module.ts        # integração do serviço Prisma
      prisma.service.ts
    user/                     # estrutura inicial do módulo de usuários
    app.module.ts             # composição dos módulos
    main.ts                   # inicialização HTTP
  prisma/
    schema.prisma             # definição da entidade User
    migrations/               # histórico de migrações
  package.json
docker-compose.yml            # PostgreSQL para desenvolvimento local
```

### Fluxo de autenticação

```text
Cliente -> POST /auth/register -> AuthService -> Argon2 -> Prisma -> PostgreSQL
Cliente -> POST /auth/login    -> AuthService -> Argon2.verify -> JWT
```

## Executando localmente

**Pré-requisitos:** Node.js, npm, Docker com Compose e uma instância local do PostgreSQL.

1. Suba o banco de testes (as credenciais do `docker-compose.yml` são apenas para ambiente local):

   ```bash
   docker compose up -d
   ```

2. No terminal do backend, configure `DATABASE_URL` para o banco local:

   ```bash
   cd backend
   # Exemplo para shell bash/zsh:
   export DATABASE_URL="postgresql://admin:admin@localhost:5432/vaultguard?schema=public"
   npm install
   npx prisma generate
   npx prisma migrate deploy
   npm run start:dev
   ```

   No PowerShell, use `$env:DATABASE_URL="postgresql://admin:admin@localhost:5432/vaultguard?schema=public"` no lugar de `export`.

3. A API é iniciada na porta `3000` por padrão.

### Rotas de exemplo

`POST http://localhost:3000/auth/register`

```json
{
  "email": "teste@example.com",
  "password": "senha-apenas-para-teste"
}
```

`POST http://localhost:3000/auth/login`

```json
{
  "email": "teste@example.com",
  "password": "senha-apenas-para-teste"
}
```

O login retorna um campo `access_token` quando as credenciais são válidas. **Esses exemplos são somente para teste local.**

### Comandos disponíveis

No diretório `backend/`:

```bash
npm run build
npm run test
npm run test:e2e
```

Os scripts de testes estão configurados, mas a existência deles **não é evidência de cobertura ou testes aprovados**. Nenhum resultado de execução automatizada está declarado aqui.

## Segurança e limitações conhecidas

> ⚠️ **Não exponha esta versão à internet nem utilize credenciais/dados reais sem corrigir as questões abaixo.**

| Ponto | Situação observada | Melhoria necessária |
|:--|:--|:--|
| Segredo JWT | Definido diretamente no código em `auth.module.ts` | Segredo forte vindo de variável de ambiente e rotação |
| Credenciais PostgreSQL | `admin/admin` no Compose | Configuração segura, sem senhas fixas em repositório |
| Validação | DTOs possuem decorators, mas `main.ts` não registra `ValidationPipe` | Ativar validação global, limites e transformação apropriada |
| `masterKey` | Gerada e armazenada em texto no banco | Revisar modelo de proteção/gerenciamento de chave antes de guardar dados sensíveis |
| Proteção da API | Sem controles de rate limiting e endurecimento visíveis na inicialização | Rate limiting, headers, logs apropriados e política de erros |
| Testes | Alguns arquivos de especificação vazios | Testes reais de registro, login, falhas e casos adversariais |

Hash de senhas e tokens JWT são partes de um projeto seguro, **não substituem uma análise completa de ameaças**.

## Próximos passos

- Extrair segredos para variáveis de ambiente e configurar validadores globais.
- Adicionar testes automatizados relevantes e pipeline de CI.
- Implementar proteção de rotas e documentação OpenAPI/Swagger.
- Definir o modelo de armazenamento seguro e finalidade do `masterKey`.

---

Projeto de estudo em desenvolvimento por [Talysson Decol](https://github.com/TalyssonDLF). Documentação do código em [`backend/`](backend/).
