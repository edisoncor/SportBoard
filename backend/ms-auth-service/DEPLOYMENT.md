# 🚀 Guía de Despliegue - SportBoard Auth Service

Esta guía te ayudará a desplegar el servicio de autenticación SportBoard con Docker y Kong API Gateway en un entorno de producción.

## 📋 Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Configuración Inicial](#configuración-inicial)
- [Despliegue Automático](#despliegue-automático)
- [Despliegue Manual](#despliegue-manual)
- [Configuración de Kong](#configuración-de-kong)
- [Verificación del Despliegue](#verificación-del-despliegue)
- [Monitoreo y Logs](#monitoreo-y-logs)
- [Comandos Útiles](#comandos-útiles)
- [Solución de Problemas](#solución-de-problemas)
- [Seguridad](#seguridad)

## 🔧 Requisitos Previos

### Software Necesario
- **Docker** >= 20.10
- **Docker Compose** >= 2.0
- **Git**
- **curl** (para verificaciones)

### Recursos del Sistema
- **RAM**: Mínimo 4GB, recomendado 8GB
- **CPU**: Mínimo 2 cores, recomendado 4 cores
- **Almacenamiento**: Mínimo 10GB libres
- **Puertos**: 80, 1337, 5555, 8000, 8001, 8002, 15672

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

### Componentes del Sistema

1. **Kong API Gateway**: Gestión de APIs, rate limiting, autenticación
2. **Nginx**: Servidor web, proxy reverso, archivos estáticos
3. **Django API**: Aplicación principal de autenticación
4. **PostgreSQL**: Base de datos principal
5. **Redis**: Cache y sesiones
6. **RabbitMQ**: Cola de mensajes para Celery
7. **Celery**: Procesamiento de tareas asíncronas
8. **Flower**: Monitoreo de Celery
9. **Konga**: Interfaz de administración para Kong

## ⚙️ Configuración Inicial

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd sportBoardAuthService
```

### 2. Configurar Variables de Entorno

Copia y edita el archivo de configuración de producción:

```bash
cp .env.prod .env.production
```

Edita `.env.production` con tus valores específicos:

```bash
# Configuración crítica que DEBES cambiar
SECRET_KEY=tu-clave-secreta-super-segura-aqui
DATABASE_PASSWORD=tu-password-seguro-de-db
RABBITMQ_PASS=tu-password-seguro-rabbitmq

# Configuración de email (opcional pero recomendado)
EMAIL_HOST_USER=tu-email@gmail.com
EMAIL_HOST_PASSWORD=tu-app-password

# Dominios permitidos (agregar tu dominio)
ALLOWED_HOSTS=localhost,127.0.0.1,tu-dominio.com
CORS_ORIGINS=https://tu-frontend.com
```

### 3. Verificar Archivos de Configuración

Asegúrate de que todos los archivos necesarios estén presentes:

```bash
ls -la docker-compose.prod.yml
ls -la .env.prod
ls -la docker/prod/
ls -la nginx.conf
ls -la kong-config.sh
ls -la deploy.sh
```

## 🚀 Despliegue Automático

### Opción 1: Script de Despliegue Completo (Recomendado)

```bash
# Dar permisos de ejecución
chmod +x deploy.sh

# Ejecutar despliegue completo
./deploy.sh
```

Este script automatiza todo el proceso:
- ✅ Verificación de requisitos
- ✅ Construcción de imágenes Docker
- ✅ Inicio de servicios en orden correcto
- ✅ Configuración automática de Kong
- ✅ Verificación de servicios
- ✅ Información de acceso

## 🔧 Despliegue Manual

Si prefieres control total sobre el proceso:

### 1. Construir Imágenes

```bash
docker-compose -f docker-compose.prod.yml build --no-cache
```

### 2. Iniciar Bases de Datos

```bash
# Iniciar PostgreSQL, Redis y RabbitMQ
docker-compose -f docker-compose.prod.yml up -d kong-database db redis rabbitmq

# Esperar que estén listos
sleep 30
```

### 3. Configurar Kong

```bash
# Ejecutar migraciones de Kong
docker-compose -f docker-compose.prod.yml up kong-migration

# Iniciar Kong Gateway
docker-compose -f docker-compose.prod.yml up -d kong

# Iniciar Konga (UI de Kong)
docker-compose -f docker-compose.prod.yml up -d konga
```

### 4. Iniciar Aplicación

```bash
# Iniciar aplicación Django
docker-compose -f docker-compose.prod.yml up -d api

# Iniciar workers de Celery
docker-compose -f docker-compose.prod.yml up -d celery celery-beat

# Iniciar Flower y Nginx
docker-compose -f docker-compose.prod.yml up -d flower nginx
```

### 5. Configurar Servicios en Kong

```bash
chmod +x kong-config.sh
./kong-config.sh
```

## 🦍 Configuración de Kong

### Servicios Configurados Automáticamente

El script `kong-config.sh` configura los siguientes servicios:

| Servicio | Ruta | Descripción |
|----------|------|-------------|
| `sportboard-auth` | `/auth/*` | Autenticación y autorización |
| `sportboard-users` | `/users/*` | Gestión de usuarios |
| `sportboard-admin` | `/admin/*` | Panel de administración |
| `sportboard-departments` | `/departments/*` | Gestión de departamentos |
| `sportboard-institutions` | `/institutions/*` | Gestión de instituciones |
| `sportboard-profiles` | `/sport-profiles/*` | Perfiles deportivos |
| `sportboard-health` | `/measuring-health/*` | Mediciones de salud |
| `sportboard-performance` | `/performance/*` | Datos de rendimiento |
| `sportboard-transactions` | `/transactions/*` | Transacciones |

### Plugins Configurados

- **Rate Limiting**: Límites de peticiones por minuto/hora
- **CORS**: Configuración de CORS para frontend
- **File Logging**: Logs de acceso y errores

### Configuración Manual de Kong (Opcional)

Si necesitas configurar Kong manualmente:

```bash
# Crear un servicio
curl -i -X POST http://localhost:8001/services/ \
  --data "name=mi-servicio" \
  --data "url=http://api:8000/api/mi-endpoint"

# Crear una ruta
curl -i -X POST http://localhost:8001/services/mi-servicio/routes \
  --data "paths[]=/mi-ruta" \
  --data "methods[]=GET,POST"

# Agregar plugin de rate limiting
curl -i -X POST http://localhost:8001/services/mi-servicio/plugins/ \
  --data "name=rate-limiting" \
  --data "config.minute=60" \
  --data "config.hour=1000"
```

## ✅ Verificación del Despliegue

### 1. Verificar Estado de Contenedores

```bash
docker-compose -f docker-compose.prod.yml ps
```

Todos los servicios deben mostrar estado "Up".

### 2. Verificar Conectividad

```bash
# Kong Admin API
curl http://localhost:8001

# Kong Proxy
curl http://localhost:8000

# Aplicación Django
curl http://localhost/health/

# Konga UI
curl http://localhost:1337

# Flower
curl http://localhost:5555
```

### 3. Verificar Logs

```bash
# Ver logs de todos los servicios
docker-compose -f docker-compose.prod.yml logs

# Ver logs de un servicio específico
docker-compose -f docker-compose.prod.yml logs api
docker-compose -f docker-compose.prod.yml logs kong
```

## 📊 Monitoreo y Logs

### URLs de Monitoreo

| Servicio | URL | Credenciales |
|----------|-----|--------------|
| Kong Manager | http://localhost:8002 | - |
| Konga UI | http://localhost:1337 | Configurar en primer acceso |
| Flower (Celery) | http://localhost:5555 | admin:admin123 |
| RabbitMQ Management | http://localhost:15672 | admin:admin123 |

### Logs Importantes

```bash
# Logs de la aplicación Django
docker-compose -f docker-compose.prod.yml logs -f api

# Logs de Kong
docker-compose -f docker-compose.prod.yml logs -f kong

# Logs de Nginx
docker-compose -f docker-compose.prod.yml logs -f nginx

# Logs de Celery
docker-compose -f docker-compose.prod.yml logs -f celery

# Logs de base de datos
docker-compose -f docker-compose.prod.yml logs -f db
```

### Archivos de Log

Los logs también se guardan en:
- Django: `app/logs/django.log`
- Kong: `/tmp/kong-auth.log` (dentro del contenedor)
- Nginx: Logs estándar de Docker

## 🛠️ Comandos Útiles

### Gestión de Servicios

```bash
# Ver estado
docker-compose -f docker-compose.prod.yml ps

# Parar todos los servicios
docker-compose -f docker-compose.prod.yml down

# Parar y eliminar volúmenes
docker-compose -f docker-compose.prod.yml down -v

# Reiniciar un servicio específico
docker-compose -f docker-compose.prod.yml restart api

# Reconstruir y reiniciar
docker-compose -f docker-compose.prod.yml up -d --build api
```

### Gestión de Base de Datos

```bash
# Ejecutar migraciones
docker-compose -f docker-compose.prod.yml exec api python manage.py migrate

# Crear superusuario
docker-compose -f docker-compose.prod.yml exec api python manage.py createsuperuser

# Cargar fixtures
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

# Ver plugins configurados
curl http://localhost:8001/plugins

# Reconfigurar Kong
./kong-config.sh
```

## 🔧 Solución de Problemas

### Problema: Kong no inicia

**Síntomas**: Kong no responde en puerto 8001

**Solución**:
```bash
# Verificar logs de Kong
docker-compose -f docker-compose.prod.yml logs kong

# Verificar que la base de datos de Kong esté lista
docker-compose -f docker-compose.prod.yml logs kong-database

# Reiniciar migraciones de Kong
docker-compose -f docker-compose.prod.yml up kong-migration
docker-compose -f docker-compose.prod.yml restart kong
```

### Problema: Aplicación Django no responde

**Síntomas**: Error 502 o timeout

**Solución**:
```bash
# Verificar logs de la aplicación
docker-compose -f docker-compose.prod.yml logs api

# Verificar conectividad a base de datos
docker-compose -f docker-compose.prod.yml exec api python manage.py dbshell

# Reiniciar aplicación
docker-compose -f docker-compose.prod.yml restart api
```

### Problema: Error de permisos

**Síntomas**: Errores de escritura en logs o media

**Solución**:
```bash
# Verificar permisos de directorios
ls -la app/logs app/media app/staticfiles

# Corregir permisos
sudo chown -R $USER:$USER app/logs app/media app/staticfiles
chmod -R 755 app/logs app/media app/staticfiles
```

### Problema: Servicios no se comunican

**Síntomas**: Errores de conexión entre servicios

**Solución**:
```bash
# Verificar redes de Docker
docker network ls
docker network inspect sportboardauthservice_kong-net
docker network inspect sportboardauthservice_app-network

# Verificar conectividad entre contenedores
docker-compose -f docker-compose.prod.yml exec api ping db
docker-compose -f docker-compose.prod.yml exec kong ping api
```

## 🔒 Seguridad

### Configuración de Seguridad Esencial

1. **Cambiar credenciales por defecto**:
   ```bash
   # En .env.prod
   SECRET_KEY=clave-super-secreta-unica
   DATABASE_PASSWORD=password-seguro-db
   RABBITMQ_PASS=password-seguro-rabbitmq
   ```

2. **Configurar HTTPS** (recomendado para producción):
   ```bash
   # En .env.prod
   USE_TLS=True
   ```

3. **Configurar firewall**:
   ```bash
   # Permitir solo puertos necesarios
   sudo ufw allow 80
   sudo ufw allow 443
   sudo ufw deny 8001  # Kong Admin API (solo acceso interno)
   ```

4. **Configurar dominios permitidos**:
   ```bash
   # En .env.prod
   ALLOWED_HOSTS=tu-dominio.com,www.tu-dominio.com
   ```

### Recomendaciones de Seguridad

- 🔐 Usar certificados SSL/TLS en producción
- 🛡️ Configurar firewall para limitar acceso a puertos administrativos
- 🔑 Rotar credenciales regularmente
- 📊 Monitorear logs de acceso y errores
- 🚫 Deshabilitar Kong Admin API en producción externa
- 🔒 Usar autenticación JWT para APIs
- 📝 Implementar auditoría de accesos

## 📞 Soporte

Si encuentras problemas durante el despliegue:

1. **Revisa los logs**: `docker-compose -f docker-compose.prod.yml logs`
2. **Verifica la configuración**: Asegúrate de que todas las variables de entorno estén configuradas
3. **Consulta la documentación**: Revisa este archivo y `DOCUMENTATION.md`
4. **Reporta issues**: Crea un issue en el repositorio con logs y detalles del error

---

## 🎉 ¡Felicidades!

Si has llegado hasta aquí, tu SportBoard Auth Service debería estar funcionando correctamente con Kong API Gateway. 

**URLs importantes**:
- 🌍 Aplicación: http://localhost
- 🦍 Kong Admin: http://localhost:8001
- 🎛️ Kong Manager: http://localhost:8002
- 🖥️ Konga UI: http://localhost:1337
- 🌸 Flower: http://localhost:5555

¡Tu API está lista para recibir peticiones a través de Kong! 🚀
