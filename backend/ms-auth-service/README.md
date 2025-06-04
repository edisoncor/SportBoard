# 🏆 SportBoard Auth Service

Servicio de autenticación y autorización para la plataforma SportBoard, construido con Django REST Framework y desplegado con Docker y Kong API Gateway.

## 🚀 Características Principales

- ✅ **Autenticación JWT** completa con refresh tokens
- ✅ **Sistema de roles y permisos** granular
- ✅ **API Gateway Kong** para gestión de APIs
- ✅ **Dockerización completa** para desarrollo y producción
- ✅ **Monitoreo integrado** con Flower y health checks
- ✅ **Cache Redis** para optimización de rendimiento
- ✅ **Procesamiento asíncrono** con Celery y RabbitMQ
- ✅ **Documentación automática** con Swagger/OpenAPI
- ✅ **Configuración de seguridad** robusta

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    KONG API GATEWAY                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Proxy     │  │ Admin API   │  │    Kong Manager     │ │
│  │   :8000     │  │   :8001     │  │       :8002         │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      NGINX                                  │
│                     :80                                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 DJANGO APPLICATION                         │
│                     :8000                                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐
│ PostgreSQL  │  │    Redis    │  │  RabbitMQ   │  │ Celery  │
│    :5432    │  │    :6379    │  │   :5672     │  │ Workers │
└─────────────┘  └─────────────┘  └─────────────┘  └─────────┘
```

## 📋 Requisitos del Sistema

### Software Necesario
- **Docker** >= 20.10
- **Docker Compose** >= 2.0
- **Git**
- **curl** (para verificaciones)

### Recursos Recomendados
- **RAM**: 8GB
- **CPU**: 4 cores
- **Almacenamiento**: 20GB libres
- **Puertos**: 80, 1337, 5555, 8000, 8001, 8002, 15672

## 🚀 Inicio Rápido

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd sportBoardAuthService
```

### 2. Despliegue de Desarrollo

```bash
# Copiar variables de entorno
cp .env.sample .env

# Iniciar servicios de desarrollo
docker-compose -f docker-compose.dev.yml up -d

# Ver logs
docker-compose -f docker-compose.dev.yml logs -f
```

### 3. Despliegue de Producción

```bash
# Configurar variables de entorno
cp .env.prod .env.production
# Editar .env.production con tus valores

# Ejecutar despliegue automático
chmod +x deploy.sh
./deploy.sh
```

## 🔧 Configuración

### Variables de Entorno Principales

```bash
# Seguridad
SECRET_KEY=tu-clave-secreta-super-segura
DEBUG=0
ALLOWED_HOSTS=localhost,127.0.0.1,tu-dominio.com

# Base de Datos
DATABASE_NAME=sportboard_db
DATABASE_USER=sportboard_user
DATABASE_PASSWORD=tu-password-seguro

# Cache y Mensajería
REDIS_URL=redis://redis:6379/0
RABBITMQ_URL=amqp://admin:admin123@rabbitmq:5672

# Email (opcional)
EMAIL_HOST=smtp.gmail.com
EMAIL_HOST_USER=tu-email@gmail.com
EMAIL_HOST_PASSWORD=tu-app-password
```

## 📚 Documentación de la API

Una vez desplegado, puedes acceder a la documentación interactiva:

- **Swagger UI**: http://localhost/api/v1/doc/
- **ReDoc**: http://localhost/api/v1/redoc/
- **Schema OpenAPI**: http://localhost/api/schema/

### Endpoints Principales

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/v1/auth/login/` | POST | Iniciar sesión |
| `/api/v1/auth/register/` | POST | Registrar usuario |
| `/api/v1/auth/refresh/` | POST | Renovar token |
| `/api/v1/user/profile/` | GET/PUT | Perfil de usuario |
| `/api/v1/roles/` | GET/POST | Gestión de roles |
| `/api/v1/permissions/` | GET | Lista de permisos |
| `/health/` | GET | Health check completo |

## 🦍 Kong API Gateway

Kong está configurado automáticamente con:

### Servicios Configurados

| Servicio | Ruta Kong | Upstream |
|----------|-----------|----------|
| Autenticación | `/auth/*` | `/api/v1/auth/*` |
| Usuarios | `/users/*` | `/api/v1/user/*` |
| Administración | `/admin/*` | `/api/v1/administrations/*` |
| Departamentos | `/departments/*` | `/api/v1/departments/*` |
| Instituciones | `/institutions/*` | `/api/v1/institutions/*` |
| Perfiles Deportivos | `/sport-profiles/*` | `/api/v1/sport-profile/*` |
| Mediciones | `/measuring-health/*` | `/api/v1/measuring-heald/*` |
| Rendimiento | `/performance/*` | `/api/v1/performance/*` |
| Transacciones | `/transactions/*` | `/api/v1/transactions/*` |

### Plugins Activos

- **Rate Limiting**: Límites de peticiones por servicio
- **CORS**: Configuración para frontend
- **File Logging**: Logs de acceso

### URLs de Administración

- **Kong Admin API**: http://localhost:8001
- **Kong Manager**: http://localhost:8002
- **Konga UI**: http://localhost:1337

## 📊 Monitoreo y Observabilidad

### Health Checks

```bash
# Health check completo
curl http://localhost/health/

# Health check simple
curl http://localhost/health/simple/

# Readiness check
curl http://localhost/health/ready/

# Liveness check
curl http://localhost/health/live/
```

### URLs de Monitoreo

| Servicio | URL | Credenciales |
|----------|-----|--------------|
| Flower (Celery) | http://localhost:5555 | admin:admin123 |
| RabbitMQ Management | http://localhost:15672 | admin:admin123 |
| Kong Manager | http://localhost:8002 | - |
| Konga UI | http://localhost:1337 | Configurar en primer acceso |

### Logs

```bash
# Ver todos los logs
docker-compose -f docker-compose.prod.yml logs

# Logs específicos
docker-compose -f docker-compose.prod.yml logs api
docker-compose -f docker-compose.prod.yml logs kong
docker-compose -f docker-compose.prod.yml logs nginx
```

## 🛠️ Comandos Útiles

### Gestión de Servicios

```bash
# Ver estado de servicios
docker-compose -f docker-compose.prod.yml ps

# Reiniciar un servicio
docker-compose -f docker-compose.prod.yml restart api

# Parar todos los servicios
docker-compose -f docker-compose.prod.yml down

# Reconstruir y reiniciar
docker-compose -f docker-compose.prod.yml up -d --build
```

### Gestión de Base de Datos

```bash
# Ejecutar migraciones
docker-compose -f docker-compose.prod.yml exec api python manage.py migrate

# Crear superusuario
docker-compose -f docker-compose.prod.yml exec api python manage.py createsuperuser

# Cargar datos iniciales
docker-compose -f docker-compose.prod.yml exec api python manage.py loaddata */fixtures/*.json

# Backup de base de datos
docker-compose -f docker-compose.prod.yml exec db pg_dump -U sportboard_user sportboard_db > backup.sql
```

### Gestión de Kong

```bash
# Ver servicios configurados
curl http://localhost:8001/services

# Ver rutas configuradas
curl http://localhost:8001/routes

# Reconfigurar Kong
./kong-config.sh
```

## 🔒 Seguridad

### Configuración de Seguridad

- ✅ **HTTPS** configurado (opcional)
- ✅ **Headers de seguridad** implementados
- ✅ **Rate limiting** por servicio
- ✅ **CORS** configurado
- ✅ **Validación de entrada** robusta
- ✅ **Autenticación JWT** con refresh tokens

### Recomendaciones para Producción

1. **Cambiar credenciales por defecto**
2. **Configurar certificados SSL/TLS**
3. **Configurar firewall**
4. **Monitorear logs regularmente**
5. **Implementar backups automáticos**
6. **Rotar secrets periódicamente**

## 🧪 Testing

```bash
# Ejecutar tests
docker-compose -f docker-compose.dev.yml exec api python manage.py test

# Tests con coverage
docker-compose -f docker-compose.dev.yml exec api coverage run --source='.' manage.py test
docker-compose -f docker-compose.dev.yml exec api coverage report
```

## 📁 Estructura del Proyecto

```
sportBoardAuthService/
├── app/                          # Aplicación Django
│   ├── core/                     # Configuración principal
│   │   ├── settings/             # Configuraciones por ambiente
│   │   ├── health.py             # Health checks
│   │   └── urls.py               # URLs principales
│   ├── user/                     # Módulo de usuarios
│   ├── administration/           # Módulo de administración
│   ├── department/               # Módulo de departamentos
│   ├── institution/              # Módulo de instituciones
│   ├── sport_profile/            # Módulo de perfiles deportivos
│   ├── measuring_heald/          # Módulo de mediciones
│   ├── performance/              # Módulo de rendimiento
│   ├── transaction/              # Módulo de transacciones
│   └── requirements/             # Dependencias
├── docker/                       # Configuraciones Docker
│   ├── dev/                      # Desarrollo
│   └── prod/                     # Producción
├── docker-compose.dev.yml        # Docker Compose desarrollo
├── docker-compose.prod.yml       # Docker Compose producción
├── nginx.conf                    # Configuración Nginx
├── kong-config.sh               # Script configuración Kong
├── deploy.sh                    # Script despliegue automático
├── .env.sample                  # Variables de entorno ejemplo
├── .env.prod                    # Variables de entorno producción
├── DEPLOYMENT.md                # Guía de despliegue detallada
└── README.md                    # Este archivo
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

- 📧 **Email**: soporte@sportboard.com
- 📚 **Documentación**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- 🐛 **Issues**: [GitHub Issues](https://github.com/tu-repo/issues)

## 🎯 Roadmap

- [ ] Implementar autenticación OAuth2
- [ ] Agregar métricas con Prometheus
- [ ] Implementar notificaciones push
- [ ] Agregar tests de integración
- [ ] Implementar CI/CD con GitHub Actions
- [ ] Agregar soporte para múltiples idiomas

---

## 🎉 ¡Listo para Usar!

Tu SportBoard Auth Service está configurado y listo para recibir peticiones. 

**URLs importantes**:
- 🌍 **Aplicación**: http://localhost
- 🦍 **Kong Proxy**: http://localhost:8000
- 📚 **Documentación API**: http://localhost/api/v1/doc/
- 🎛️ **Kong Manager**: http://localhost:8002
- 🖥️ **Konga UI**: http://localhost:1337

¡Feliz desarrollo! 🚀
