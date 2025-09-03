# Guia de Desenvolvimento

## Configuração do Ambiente

### Pré-requisitos
- Node.js 20+ e npm 10+
- Docker e Docker Compose
- Git
- VSCode (recomendado)

### Extensões VSCode Recomendadas
- ESLint
- Prettier
- Prisma
- Tailwind CSS IntelliSense
- GitLens

## Setup Inicial

### 1. Clone o Repositório
```bash
git clone https://github.com/seu-usuario/hsm-stellar-demo.git
cd hsm-stellar-demo
```

### 2. Instale as Dependências
```bash
make install
```

### 3. Configure o Ambiente
```bash
# Backend
cp backend/_env.example backend/.env
# Edite backend/.env com suas configurações

# Frontend
cp frontend/_env.example frontend/.env
# Edite frontend/.env se necessário
```

### 4. Inicie o Banco de Dados
```bash
make dev
```

### 5. Execute as Migrações
```bash
cd backend
npm run prisma:migrate
```

## Desenvolvimento

### Backend (NestJS)

#### Estrutura
```
backend/src/
├── hsm/
│   ├── hsm.controller.ts
│   ├── hsm.service.ts
│   ├── hsm.module.ts
│   └── dto/
├── stellar/
│   ├── stellar.controller.ts
│   ├── stellar.service.ts
│   ├── stellar.module.ts
│   └── dto/
└── prisma/
    ├── prisma.service.ts
    └── prisma.module.ts
```

#### Comandos Úteis
```bash
# Desenvolvimento
npm run start:dev

# Gerar Prisma Client
npm run prisma:generate

# Criar nova migração
npm run prisma:migrate

# Abrir Prisma Studio
npm run prisma:studio

# Testes
npm test
npm run test:watch
npm run test:cov
```

### Frontend (React + Vite)

#### Estrutura
```
frontend/src/
├── components/
│   ├── ui/           # Componentes shadcn/ui
│   └── Layout.tsx    # Layout principal
├── pages/
│   ├── HsmAdmin.tsx
│   └── StellarSigner.tsx
├── services/
│   ├── api.ts
│   ├── hsm.service.ts
│   └── stellar.service.ts
├── hooks/
│   ├── useHsm.ts
│   ├── useStellar.ts
│   └── useToast.ts
└── config/
    └── api.ts
```

#### Comandos Úteis
```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Preview build
npm run preview

# Type check
npm run type-check
```

## Fluxo de Trabalho

### 1. Criar Feature Branch
```bash
git checkout -b feature/nome-da-feature
```

### 2. Desenvolvimento
- Escreva código limpo e documentado
- Siga os padrões do projeto
- Adicione tipos TypeScript
- Teste manualmente

### 3. Commit
```bash
git add .
git commit -m "feat: descrição da feature"
```

#### Convenção de Commits
- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração
- `test:` Testes
- `chore:` Tarefas

### 4. Push e PR
```bash
git push origin feature/nome-da-feature
```

## Debugging

### Backend
```bash
# Debug mode
npm run start:debug

# Attach debugger no VSCode
# Porta: 9229
```

### Frontend
- Use React DevTools
- Console do navegador
- Network tab para APIs

### Prisma
```bash
# Ver queries SQL
DEBUG=prisma:query npm run start:dev

# Explorar banco
npm run prisma:studio
```

## Testes

### Backend
```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

### Frontend
```bash
# Por implementar
npm test
```

## Performance

### Backend
- Use índices no Prisma Schema
- Implemente cache (Redis futuro)
- Otimize queries N+1

### Frontend
- Use React.memo quando apropriado
- Lazy loading de páginas
- Otimize bundle size

## Segurança

### Checklist
- [ ] Validar todas entradas
- [ ] Sanitizar outputs
- [ ] Usar HTTPS em produção
- [ ] Implementar rate limiting
- [ ] Auditar dependências
- [ ] Não commitar secrets

### Comandos de Segurança
```bash
# Auditar dependências
npm audit

# Atualizar dependências
npm update
```

## Troubleshooting

### Erro: "Cannot connect to HSM"
- Verifique IP/porta do HSM
- Confirme credenciais
- Teste conectividade de rede

### Erro: "Database connection failed"
- Verifique se PostgreSQL está rodando
- Confirme DATABASE_URL
- Execute migrações

### Erro: "Module not found"
- Delete node_modules
- Execute `npm install`
- Verifique imports

## Deploy Local

### Build Completo
```bash
make build
make up
```

### Logs
```bash
make logs
# ou
docker-compose logs -f [service]
```

### Parar Serviços
```bash
make down
```

## Recursos

- [NestJS Docs](https://docs.nestjs.com)
- [Prisma Docs](https://www.prisma.io/docs)
- [Stellar Docs](https://developers.stellar.org)
- [TailwindCSS v4](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
