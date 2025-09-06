.PHONY: help install dev build up down logs clean test

# Default target
help:
	@echo "HSM Stellar Demo - Comandos disponíveis:"
	@echo ""
	@echo "  make install      - Instala dependências do backend e frontend"
	@echo "  make dev         - Inicia ambiente de desenvolvimento"
	@echo "  make build       - Build das imagens Docker"
	@echo "  make up          - Inicia todos os serviços com Docker"
	@echo "  make down        - Para todos os serviços"
	@echo "  make logs        - Exibe logs dos containers"
	@echo "  make clean       - Remove containers, volumes e imagens"
	@echo "  make test        - Executa testes"
	@echo ""

# Instalar dependências
install:
	@echo "📦 Instalando dependências do backend..."
	cd backend && npm install
	@echo "📦 Instalando dependências do frontend..."
	cd frontend && npm install
	@echo "✅ Dependências instaladas!"

# Desenvolvimento local
dev:
	@echo "🚀 Iniciando banco de dados..."
	docker-compose -f docker-compose.dev.yml up -d
	@echo "⏳ Aguardando PostgreSQL..."
	sleep 5
	@echo "🔄 Executando migrações..."
	cd backend && npx prisma migrate dev
	@echo "✅ Ambiente de desenvolvimento pronto!"
	@echo ""
	@echo "Execute em terminais separados:"
	@echo "  Backend:  cd backend && npm run start:dev"
	@echo "  Frontend: cd frontend && npm run dev"

# Build das imagens Docker
build:
	@echo "🔨 Building Docker images..."
	docker-compose build --no-cache
	@echo "✅ Build concluído!"

# Iniciar serviços
up:
	@echo "🚀 Iniciando serviços..."
	docker-compose up -d
	@echo "✅ Serviços iniciados!"
	@echo ""
	@echo "🌐 URLs:"
	@echo "  Frontend: http://localhost"
	@echo "  Backend:  http://localhost:3000"
	@echo "  Swagger:  http://localhost:3000/api"

# Parar serviços
down:
	@echo "🛑 Parando serviços..."
	docker-compose down
	docker-compose -f docker-compose.dev.yml down
	@echo "✅ Serviços parados!"

# Ver logs
logs:
	docker-compose logs -f

# Limpar tudo
clean:
	@echo "🧹 Limpando ambiente..."
	docker-compose down -v --rmi all
	docker-compose -f docker-compose.dev.yml down -v
	rm -rf backend/node_modules backend/dist backend/generated
	rm -rf frontend/node_modules frontend/dist
	@echo "✅ Limpeza concluída!"

# Executar testes
test:
	@echo "🧪 Executando testes do backend..."
	cd backend && npm test
	@echo "🧪 Executando testes do frontend..."
	cd frontend && npm test

# Comandos do Prisma
prisma-migrate:
	cd backend && npx prisma migrate dev

prisma-studio:
	cd backend && npx prisma studio

prisma-generate:
	cd backend && npx prisma generate
