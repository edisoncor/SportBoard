# SportBoard - Microservicios

Este repositorio contiene los microservicios y componentes principales del ecosistema SportBoard.

## Descripción de los microservicios
- **ms-catalog**: Gestión de catálogos jerárquicos, categorías e ítems. Permite operaciones CRUD, relaciones jerárquicas y expone endpoints RESTful. [Ver documentación técnica](docs/components/backend/microservices/ms-catalogs.qmd)
- **competencies**: Administración de competencias y autenticación de usuarios para competencias deportivas.
- **Estadisticas**: Microservicio para el manejo y consulta de estadísticas deportivas.
- **real-time**: Procesamiento y entrega de datos en tiempo real para eventos deportivos.
- **users**: Gestión de usuarios, perfiles y autenticación general del sistema.
- **calendarioModule**: Administración de calendarios y eventos deportivos.

Próximamente se integrarán más microservicios y módulos.

## Ejecución general
Cada microservicio cuenta con su propio README y guía de despliegue. Consulta la documentación específica en el directorio correspondiente.

## Ejecución con Docker Compose
Para levantar los microservicios definidos en este repositorio, ejecuta desde la raíz del proyecto:

```bash
# Levanta todos los servicios en segundo plano
docker compose -f docker/docker-compose.yml up -d

# Para ver los logs de todos los servicios
docker compose -f docker/docker-compose.yml logs -f

# Para detener todos los servicios
docker compose -f docker/docker-compose.yml down
```

## ms-catalog
Microservicio RESTful desarrollado en Django y Django REST Framework para la gestión de catálogos jerárquicos. Permite crear, consultar, actualizar y eliminar categorías e ítems, así como gestionar relaciones jerárquicas entre ellos. Incluye endpoints personalizados para operaciones avanzadas, paginación, manejo de errores, versionado de API y documentación Swagger.

- Soporta operaciones CRUD sobre categorías e ítems.
- Permite relaciones jerárquicas y operaciones sobre la jerarquía.
- Respuestas estandarizadas y paginadas.
- Documentación interactiva disponible vía Swagger.

[Ver documentación técnica de ms-catalog (Quarto)](docs/components/microservices/ms-catalogs.qmd)

