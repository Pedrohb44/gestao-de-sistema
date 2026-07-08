# Sistema de Gestão

Aplicação full-stack com backend em Spring Boot, PostgreSQL, autenticação JWT, Docker e frontend simples em HTML/CSS/JS.

## Funcionalidades

- Cadastro e login com JWT
- CRUD de produtos
- API REST com Spring Boot
- Banco de dados com PostgreSQL via Docker
- Interface simples para manipular o estoque

## Como executar localmente

### Com Java e Maven

```bash
mvn spring-boot:run
```

A aplicação fica disponível em http://localhost:8080.

### Com Docker Compose

```bash
docker compose up --build
```

## Endpoints principais

- POST /api/auth/register
- POST /api/auth/login
- GET /api/products
- POST /api/products
- PUT /api/products/{id}
- DELETE /api/products/{id}
