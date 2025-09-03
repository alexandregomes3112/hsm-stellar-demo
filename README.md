# HSM Stellar Demo

Integração completa entre HSM DINAMO e Stellar Network para assinatura segura de transações.

## 🚀 Tecnologias

### Backend
- **NestJS** (Framework Node.js)
- **Prisma** (ORM)
- **PostgreSQL** (Banco de dados)
- **@dinamonetworks/hsm-dinamo** (SDK HSM)
- **@stellar/stellar-sdk** (SDK Stellar)

### Frontend
- **React** + **Vite** + **TypeScript**
- **TailwindCSS v4** (Estilização)
- **shadcn/ui** (Componentes)
- **Axios** (HTTP Client)

### DevOps
- **Docker** & **Docker Compose**
- **Nginx** (Servidor web)

## 📋 Pré-requisitos

- Node.js 20+
- Docker e Docker Compose
- Acesso ao HSM DINAMO
- Conta na Stellar Testnet

## 🔧 Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/guilhermejansen/hsm-stellar-demo.git
cd hsm-stellar-demo
```

### 2. Configure as variáveis de ambiente

#### Backend
```bash
cp backend/.env.example backend/.env
```

Edite o arquivo `backend/.env` com suas configurações:

```env
# Servidor
PORT=3000

# Banco de Dados
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hsm_stellar_db?schema=public"

# HSM
HSM_HOST=10.0.0.10
HSM_USER=alex
HSM_PASS=12345678

# Stellar
HORIZON_URL=https://horizon-testnet.stellar.org
NETWORK_PASSPHRASE=Test SDF Network ; September 2015
```

#### Frontend
```bash
cp frontend/.env.example frontend/.env
```

## 🚀 Executando o Projeto

### Com Docker Compose (Recomendado)

```bash
# Desenvolvimento (apenas PostgreSQL)
docker-compose -f docker-compose.dev.yml up -d

# Produção (todos os serviços)
docker-compose up -d
```

### Desenvolvimento Local

#### Backend
```bash
cd backend

# Instalar dependências
npm install

# Executar migrações do banco
npx prisma migrate dev

# Iniciar servidor de desenvolvimento
npm run start:dev
```

#### Frontend
```bash
cd frontend

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

## 📱 Funcionalidades

### HSM Admin
- ✅ Criar usuário/partição no HSM
- ✅ Gerar chaves ED25519
- ✅ Obter chave pública no formato Stellar

### Stellar Signer
- ✅ Validar contas Stellar
- ✅ Construir transações de pagamento
- ✅ Assinar transações com HSM
- ✅ Submeter transações ao Horizon

## 🏗️ Arquitetura

```
hsm-stellar-demo/
├── backend/               # API NestJS
│   ├── src/
│   │   ├── hsm/          # Módulo HSM
│   │   ├── stellar/      # Módulo Stellar
│   │   └── prisma/       # Módulo Prisma
│   └── prisma/           # Schema e migrações
├── frontend/             # App React
│   ├── src/
│   │   ├── components/   # Componentes UI
│   │   ├── hooks/        # Custom hooks
│   │   ├── pages/        # Páginas
│   │   └── services/     # Serviços API
│   └── public/
└── docker-compose.yml    # Orquestração
```

## 🔒 Segurança

- **HSM**: Chaves privadas nunca saem do HSM
- **API**: Autenticação e autorização (a implementar)
- **CORS**: Configurado para produção
- **HTTPS**: Recomendado em produção

## 📝 API Endpoints

### HSM
- `POST /hsm/user` - Criar usuário
- `POST /hsm/keys` - Criar chave
- `GET /hsm/keys/:id/public` - Obter chave pública

### Stellar
- `POST /stellar/sign` - Assinar transação

## 🧪 Testes

```bash
# Backend
cd backend
npm run test

# Frontend
cd frontend
npm run test
```

## 📚 Documentação

- API Swagger: http://localhost:3000/api
- Stellar Docs: https://developers.stellar.org
- HSM DINAMO: Consulte a documentação do fabricante

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- Alexandre Gomes - Gerente de Produto
- Guilherme Jansen - Desenvolvedor

## 🙏 Agradecimentos

- Time Stellar pelo excelente SDK
- DINAMO Networks pelo suporte ao HSM
- Comunidade open source
