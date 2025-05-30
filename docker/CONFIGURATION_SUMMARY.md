# Configuración de Servicios SportBoard

## Servicios Configurados

### 1. Kong API Gateway
- **Puerto**: 8000 (proxy), 8001 (admin), 8002 (GUI)
- **Base de datos**: PostgreSQL (kong-database)
- **Configuración**: kong.yml
- **Servicios registrados**:
  - ms-catalog-categories: `/catalog/categories` → `http://ms-catalog:8009/api/v1/catalog/categories`
  - ms-catalog-items: `/catalog/items` → `http://ms-catalog:8009/api/v1/catalog/items`
  - ms-auth-service: `/auth` → `http://ms-auth-service:8000/api/v1`

### 2. RabbitMQ
- **Puerto**: 5672 (aplicaciones), 15672 (admin web)
- **Credenciales**: user:password
- **Imagen**: rabbitmq:3-management

### 3. ms-catalog
- **Puerto**: 8009
- **Base de datos**: SQLite (local)
- **Endpoints**: `/api/v1/catalog/categories`, `/api/v1/catalog/items`
- **Estado**: ✅ Configurado correctamente

### 4. ms-auth-service
- **Puerto**: 8010 (externo) → 8000 (interno)
- **Base de datos**: PostgreSQL (auth-database)
- **Credenciales DB**: auth_user:auth_password@auth-database:5432/auth_db
- **RabbitMQ**: amqp://user:password@rabbitmq:5672
- **Endpoints**: `/api/v1/auth/`, `/api/v1/user/`, `/api/v1/catalog/`, etc.
- **Dependencias**: auth-database, rabbitmq

### 5. auth-database
- **Puerto**: 5433 (externo) → 5432 (interno)
- **Credenciales**: auth_user:auth_password
- **Base de datos**: auth_db

## Red
- **Nombre**: sportboard-network
- **Tipo**: bridge
- **Externa**: true

## Volúmenes
- kong-db-data: Datos de PostgreSQL para Kong
- auth-db-data: Datos de PostgreSQL para ms-auth-service

## Orden de Inicio Recomendado
1. kong-database
2. auth-database
3. rabbitmq
4. kong-migrations
5. ms-catalog
6. ms-auth-service
7. kong

## Verificaciones de Conectividad

### Kong → Servicios
- ✅ Kong puede acceder a ms-catalog:8009
- ✅ Kong puede acceder a ms-auth-service:8000

### ms-auth-service → Dependencias
- ✅ ms-auth-service puede acceder a auth-database:5432
- ✅ ms-auth-service puede acceder a rabbitmq:5672

### Puertos Externos
- 8000: Kong Proxy
- 8001: Kong Admin
- 8002: Kong GUI
- 8009: ms-catalog (directo)
- 8010: ms-auth-service (directo)
- 5433: auth-database (directo)
- 5672: RabbitMQ (directo)
- 15672: RabbitMQ Admin Web

## URLs de Acceso
- Kong Proxy: http://localhost:8000
- Kong Admin: http://localhost:8001
- Kong GUI: http://localhost:8002
- ms-catalog directo: http://localhost:8009
- ms-auth-service directo: http://localhost:8010
- RabbitMQ Admin: http://localhost:15672

## APIs a través de Kong
- Catálogo categorías: http://localhost:8000/catalog/categories
- Catálogo items: http://localhost:8000/catalog/items
- Autenticación: http://localhost:8000/auth
