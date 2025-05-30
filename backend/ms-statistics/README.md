# Statistic Microservice

## Propósito

El microservicio **Statistic** gestiona, almacena y expone estadísticas deportivas históricas e individuales en tiempo real, permitiendo la consulta, actualización y análisis de datos relevantes para equipos, jugadores, temporadas y competencias.

---

## Arquitectura

-   **Backend:** FastAPI (Python)
-   **Base de datos histórica:** MongoDB
-   **Cache y eventos en tiempo real:** Redis
-   **WebSocket:** Actualizaciones en tiempo real de resultados y eventos
-   **API Gateway:** Kong
-   **Bus de mensajes:** (Tecnología a definir, para eventos y procesamiento asíncrono)
-   **Estructura interna:** Separación en capas (API, Services, Schemas, Models, Repositories)

### Diagramas

-   **C4-L4 y L3:**  
    ![C4-SportBoard - L4 - Estadísticas](C4-SportBoard-L4-Estadísticas-SportBoard-L3-Estadísticas.png)
-   **Modelo de datos (UML):**  
    ![UML Estadísticas](UML-Estadisticas.png)

---

## Modelo de Datos

Las principales entidades incluyen:

-   `StatisticIndividual`: Estadísticas individuales de jugadores (goles, tarjetas, faltas, etc.)
-   `StatisticTeam`: Estadísticas agregadas de equipos (partidos jugados, ganados, puntos, etc.)
-   `StatisticSeason`: Estadísticas de temporada (máximos goleadores, asistencias, etc.)
-   `StatisticCompetence`: Estadísticas por competencia (promedios, récords, etc.)

Ver diagrama UML para relaciones y atributos detallados.

---

## Uso de Swagger/OpenAPI

La documentación interactiva de la API está disponible en:  
**`/api/v1/docs/`**  
Permite probar endpoints, ver modelos y respuestas, y explorar la API de forma visual.

---

## Ejemplo de Respuesta RESTful Estandarizada

```json
{
    "id": "6656e2b2e1b2c2a1f8e4d123",
    "description": "Goles marcados por el jugador",
    "date_generation": "2025-05-29",
    "value": 2,
    "goal": 2,
    "own_goal": 0,
    "foul": 1,
    "red_card": 0,
    "yellow_card": 1,
    "athlete_id": "6656e2b2e1b2c2a1f8e4d456"
}
```

---

## Códigos HTTP Usados y Ejemplos

-   **200 OK:** Respuesta exitosa a consultas GET.
-   **201 Created:** Recurso creado exitosamente (POST).
-   **204 No Content:** Eliminación exitosa (DELETE).
-   **400 Bad Request:** Error de validación de datos.
-   **404 Not Found:** Recurso no encontrado.
-   **500 Internal Server Error:** Error inesperado del servidor.

**Ejemplo de error:**

```json
{
    "detail": "StatisticIndividual not found"
}
```

---

## Endpoints Personalizados Expuestos

-   `/api/v1/statistics/individual/` (GET, POST, PUT, DELETE)
-   `/api/v1/statistics/team/` (GET, POST, PUT, DELETE)
-   `/api/v1/statistics/season/` (GET, POST, PUT, DELETE)
-   `/api/v1/statistics/competence/` (GET, POST, PUT, DELETE)
-   `/ws/statistics` (WebSocket para eventos en tiempo real)
-   `/health` (Verificación de estado del microservicio)

---

## Arquitectura de Contenedores y Orquestación (Docker & Kong)

### Estructura de carpetas relevante:

```
EstadisticasDev/
├── docker-compose.yml
├── api-gateway/
│   ├── docker-compose.override.yml
│   └── kong.yml
└── backend/
    └── ms-statistic/
        └── docker-compose.override.yml
```

### Descripción de los archivos:

-   **docker-compose.yml** (raíz): Orquesta todos los servicios (Kong, ms-statistic, MongoDB, Redis) y define la red de microservicios.
-   **api-gateway/docker-compose.override.yml**: Configuración específica para el contenedor Kong (API Gateway).
-   **api-gateway/kong.yml**: Configuración declarativa de rutas y servicios para Kong.
-   **backend/ms-statistic/docker-compose.override.yml**: Configuración de desarrollo para el microservicio Statistic.

### Ejemplo de despliegue local

```powershell
# Levantar todos los servicios
$ docker-compose up --build
```

-   Acceso a Kong Admin: http://localhost:8001
-   Acceso a la API Statistic: http://localhost:8000/api/v1/docs/

---

## SPA y Microservicios

-   Este microservicio puede ser consumido por una SPA (Single Page Application) o cualquier cliente HTTP.
-   El API Gateway (Kong) permite centralizar la autenticación, rate limiting y logging para todos los microservicios.
-   La arquitectura soporta escalabilidad horizontal y despliegue independiente de cada microservicio.

---

## Extras

### .gitignore para Python y FastAPI

El archivo `.gitignore` ya incluye exclusiones para:

-   Archivos y carpetas de Python (`__pycache__`, `.pyc`, `.egg-info`, etc.)
-   Entornos virtuales (`env/`, `.venv/`, etc.)
-   Configuración de IDEs y logs (`.vscode/`, `.idea/`, `*.log`)
-   Archivos de sistema (`.DS_Store`, `Thumbs.db`)

### Buenas Prácticas

-   **Código limpio y legible:** Todas las clases y métodos incluyen docstrings descriptivos en español.
-   **PEP8 aplicado:** El código sigue la guía de estilo oficial de Python.
-   **Estructura JSON clara:** Los modelos de respuesta utilizan nombres descriptivos y consistentes.
-   **Documentación automática:** La documentación Swagger/OpenAPI está disponible en `/api/v1/docs/`.

# Prompt para GitHub Copilot - Microservicio de Estadísticas con FastAPI

## Contexto del Proyecto

Necesito crear un microservicio de estadísticas deportivas siguiendo una arquitectura hexagonal con FastAPI, MongoDB como base de datos principal, Redis para caché, y WebSockets para comunicación en tiempo real.

## Estructura del Proyecto Requerida

```
statistics_microservice/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── endpoints/
│   │   │   ├── __init__.py
│   │   │   ├── statistics.py
│   │   │   ├── teams.py
│   │   │   ├── players.py
│   │   │   └── matches.py
│   │   └── dependencies.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── statistics_service.py
│   │   ├── team_service.py
│   │   ├── player_service.py
│   │   └── match_service.py
│   ├── repositories/
│   │   ├── __init__.py
│   │   ├── base_repository.py
│   │   ├── statistics_repository.py
│   │   ├── team_repository.py
│   │   ├── player_repository.py
│   │   └── match_repository.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── team.py
│   │   ├── player.py
│   │   ├── match.py
│   │   ├── statistics.py
│   │   └── competition.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── team_schema.py
│   │   ├── player_schema.py
│   │   ├── match_schema.py
│   │   ├── statistics_schema.py
│   │   └── competition_schema.py
│   ├── websocket/
│   │   ├── __init__.py
│   │   ├── connection_manager.py
│   │   ├── handlers.py
│   │   └── events.py
│   ├── database/
│   │   ├── __init__.py
│   │   ├── mongodb.py
│   │   └── redis_client.py
│   └── config/
│       ├── __init__.py
│       └── settings.py
├── requirements.txt
└── README.md
```

## Instalación de Dependencias

Primero, instala las siguientes dependencias ejecutando:

```bash
pip install fastapi uvicorn motor redis websockets pydantic python-multipart python-jose[cryptography] passlib[bcrypt] pymongo beanie
```

## Modelos de Datos Requeridos

### 1. Team Model

-   Atributos: id, name, description, logo, founded_year, stadium, coach
-   Relaciones: Tiene muchos jugadores (players), participa en competiciones
-   Métodos: get_statistics(), get_players(), add_player(), remove_player()

### 2. Player Model

-   Atributos: id, name, position, jersey_number, birth_date, nationality, team_id
-   Relaciones: Pertenece a un equipo, tiene estadísticas
-   Métodos: get_statistics(), update_position(), calculate_age()

### 3. Match Model

-   Atributos: id, home_team_id, away_team_id, date, status, home_score, away_score, competition_id
-   Relaciones: Entre dos equipos, pertenece a una competición, genera estadísticas
-   Métodos: start_match(), end_match(), update_score(), get_result()

### 4. Statistics Model (Clase abstracta)

-   Subclases: StatisticsTeam, StatisticsPlayer, StatisticsMatch, StatisticsCompetition, StatisticsIndividual, StatisticsSeason
-   Atributos comunes: id, match_id, created_at, updated_at
-   Métodos abstractos: calculate(), generate_scoreboard()

### 5. Competition Model

-   Atributos: id, name, description, start_date, end_date, type, status
-   Relaciones: Tiene muchos partidos, muchos equipos participan
-   Métodos: add_team(), start_competition(), generate_fixture()

## Requisitos Específicos de Implementación

### API Layer (FastAPI)

-   Crear endpoints RESTful para cada entidad (CRUD completo)
-   Implementar autenticación JWT
-   Validación de datos con Pydantic
-   Manejo de errores HTTP personalizados
-   Documentación automática con Swagger
-   Endpoints específicos:
    -   GET /api/v1/statistics/team/{team_id}
    -   GET /api/v1/statistics/player/{player_id}
    -   GET /api/v1/statistics/match/{match_id}
    -   POST /api/v1/statistics/calculate
    -   WebSocket endpoint: /ws/statistics

### Services Layer

-   Lógica de negocio para cálculo de estadísticas
-   Servicios para cada entidad con métodos específicos:
    -   StatisticsService: calculate_team_stats(), calculate_player_stats(), generate_reports()
    -   TeamService: create_team(), update_team(), get_team_statistics()
    -   PlayerService: transfer_player(), update_stats(), get_performance()
    -   MatchService: create_match(), update_live_score(), finish_match()

### Repository Layer

-   Patrón Repository para abstracción de datos
-   Operaciones CRUD con MongoDB usando Motor (async)
-   Cache con Redis para consultas frecuentes
-   BaseRepository con métodos comunes (find_by_id, create, update, delete)
-   Implementar paginación y filtros avanzados

### WebSocket Implementation

-   ConnectionManager para manejar conexiones activas
-   Broadcast de estadísticas en tiempo real durante partidos
-   Eventos: match_start, goal_scored, match_end, statistics_update
-   Autenticación de WebSocket connections
-   Rate limiting para conexiones WebSocket

### Database Configuration

-   MongoDB: Configuración con Motor para operaciones asíncronas
-   Redis: Cliente para cache y sesiones
-   Índices optimizados para consultas de estadísticas
-   Configuración de conexión con variables de entorno

### Schemas (Pydantic)

-   Schemas de entrada y salida para cada modelo
-   Validación de tipos de datos
-   Serialización personalizada para MongoDB ObjectId
-   Schemas específicos: CreateTeam, UpdateTeam, TeamResponse, etc.

## Funcionalidades Especiales Requeridas

1. **Sistema de Estadísticas en Tiempo Real**

    - Cálculo automático de estadísticas cuando se actualiza un partido
    - Cache inteligente de estadísticas frecuentemente consultadas
    - Actualización en tiempo real vía WebSocket

2. **API de Consultas Avanzadas**

    - Filtros por temporada, competición, equipo, jugador
    - Agregaciones complejas (promedios, totales, rankings)
    - Exportación de datos en diferentes formatos

3. **Sistema de Cache Inteligente**

    - Cache de estadísticas calculadas en Redis
    - Invalidación automática cuando cambian los datos base
    - TTL configurable por tipo de estadística

4. **Monitoreo y Logging**
    - Logging estructurado con levels apropiados
    - Métricas de performance de consultas
    - Health checks para MongoDB y Redis

## Configuración Inicial

-   Usar variables de entorno para configuración (MONGO_URL, REDIS_URL, etc.)
-   Configurar CORS para frontend
-   Middleware para logging de requests
-   Configuración de timezone UTC para fechas

Por favor, genera el código completo siguiendo esta arquitectura, implementando todas las funcionalidades mencionadas y asegurándote de que el código sea production-ready con manejo de errores, logging apropiado y documentación inline.
