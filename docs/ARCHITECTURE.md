# Arquitetura do Sistema

## Visão Geral

O HSM Stellar Demo é uma aplicação full-stack que integra um Hardware Security Module (HSM) DINAMO com a rede Stellar para assinatura segura de transações.

## Componentes Principais

### 1. Frontend (React + Vite)
- **Tecnologia**: React com TypeScript, Vite como bundler
- **UI**: TailwindCSS v4 + shadcn/ui para componentes
- **Responsividade**: Mobile-first design
- **Estado**: Hooks customizados para gerenciamento local

### 2. Backend (NestJS)
- **Framework**: NestJS com arquitetura modular
- **ORM**: Prisma com PostgreSQL
- **Módulos**:
  - HSM Module: Gerencia comunicação com HSM DINAMO
  - Stellar Module: Operações Stellar
  - Prisma Module: Camada de dados

### 3. Banco de Dados (PostgreSQL)
- **Modelos**:
  - User: Usuários/partições do HSM
  - Key: Chaves ED25519 geradas
  - Transaction: Histórico de transações assinadas

### 4. HSM DINAMO
- **Função**: Armazenamento seguro de chaves privadas
- **Operações**: Geração de chaves e assinatura de transações

## Fluxo de Dados

### Criação de Usuário/Partição
1. Frontend → POST /hsm/user
2. Backend → HSM.createUser()
3. HSM → Cria partição
4. Backend → Salva no PostgreSQL
5. Backend → Retorna sucesso ao Frontend

### Geração de Chave
1. Frontend → POST /hsm/keys
2. Backend → HSM.generateKey(ED25519)
3. HSM → Gera par de chaves
4. Backend → Salva metadata no PostgreSQL
5. Backend → Retorna keyId ao Frontend

### Assinatura de Transação
1. Frontend → Constrói transação Stellar
2. Frontend → Calcula hash da transação
3. Frontend → POST /stellar/sign com hash
4. Backend → HSM.sign(keyId, hash)
5. HSM → Assina com chave privada
6. Backend → Retorna assinatura
7. Frontend → Adiciona assinatura à transação
8. Frontend → Submete ao Horizon

## Segurança

### Princípios
- **Zero Trust**: Nenhuma chave privada sai do HSM
- **Autenticação**: Por implementar (JWT/OAuth2)
- **Autorização**: RBAC baseado em permissões HSM
- **Auditoria**: Todas operações são registradas

### Boas Práticas
- Variáveis sensíveis em `.env`
- CORS configurado restritivamente
- Validação de entrada em todos endpoints
- Rate limiting (por implementar)
- HTTPS obrigatório em produção

## Escalabilidade

### Horizontal
- Backend stateless permite múltiplas instâncias
- PostgreSQL com read replicas
- Cache Redis (futuro)

### Vertical
- HSM suporta múltiplas conexões
- Pool de conexões otimizado

## Monitoramento

### Métricas (Futuro)
- Prometheus + Grafana
- Health checks
- Alertas

### Logs
- Estruturados em JSON
- Níveis: ERROR, WARN, INFO, DEBUG
- Correlação por requestId

## Deployment

### Docker
- Multi-stage builds
- Imagens Alpine Linux
- Non-root users

### Kubernetes (Futuro)
- Helm charts
- Horizontal Pod Autoscaler
- Ingress com TLS

## Integração Contínua

### Pipeline (Sugestão)
1. Lint + Type Check
2. Unit Tests
3. Build
4. Integration Tests
5. Security Scan
6. Deploy to Staging
7. E2E Tests
8. Deploy to Production
