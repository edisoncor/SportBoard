# 📋 Documentación Completa - SportBoard Auth Service

## 🏗️ Arquitectura General del Proyecto

Este es un **Microservicio de Autenticación** desarrollado en Django con Django REST Framework, diseñado para manejar la autenticación, autorización y gestión de usuarios en un ecosistema de microservicios.

### 🛠️ Stack Tecnológico

- **Backend Framework:** Django 4.0.6 + Django REST Framework 3.13.1
- **Autenticación:** JWT (JSON Web Tokens) con djangorestframework-simplejwt
- **Base de Datos:** PostgreSQL
- **Tareas Asíncronas:** Celery 5.2.7 + RabbitMQ
- **Monitoreo:** Flower Dashboard 1.1.0
- **Containerización:** Docker + Docker Compose
- **Documentación API:** Swagger/OpenAPI con drf-spectacular
- **Manejo de Emails:** SMTP con templates HTML
- **Testing:** pytest + Factory Boy

## 📁 Estructura Detallada del Proyecto

```
sportBoardAuthService/
├── 📄 .env.sample                    # Variables de entorno de ejemplo
├── 📄 .gitignore                     # Archivos ignorados por Git
├── 📄 docker-compose.dev.yml         # Configuración Docker para desarrollo
├── 📄 README.md                      # Documentación básica
├── 📄 Documentacion.md               # Esta documentación completa
├── 🖼️ screenshot1.png               # Capturas de la documentación API
├── 🖼️ screenshot2.png               # Capturas de la documentación API
├── 📁 app/                           # Aplicación Django principal
│   ├── 📄 conftest.py               # Configuración global de pytest
│   ├── 📄 load_transactions.py      # Script para cargar datos de prueba
│   ├── 📄 manage.py                 # Comando principal de Django
│   ├── 📄 pytest.ini               # Configuración de pytest
│   ├── 📁 core/                     # Configuración central del proyecto
│   │   ├── 📄 __init__.py
│   │   ├── 📄 asgi.py              # Configuración ASGI
│   │   ├── 📄 celery.py            # Configuración de Celery
│   │   ├── 📄 middleware.py        # Middlewares personalizados
│   │   ├── 📄 models.py            # Modelo base AuditableModel
│   │   ├── 📄 pagination.py        # Paginación personalizada
│   │   ├── 📄 storage_backends.py  # Backends de almacenamiento
│   │   ├── 📄 urls.py              # URLs principales del proyecto
│   │   ├── 📄 wsgi.py              # Configuración WSGI
│   │   ├── 📁 fixtures/            # Datos iniciales
│   │   │   └── 📄 Permission.json  # Permisos predefinidos
│   │   ├── 📁 settings/            # Configuraciones por ambiente
│   │   │   ├── 📄 __init__.py
│   │   │   ├── 📄 base.py          # Configuración base
│   │   │   └── 📄 dev.py           # Configuración de desarrollo
│   │   └── 📁 utils/               # Utilidades del core
│   │       ├── 📄 __init__.py
│   │       ├── 📄 custom_response.py
│   │       ├── 📄 filters.py
│   │       ├── 📄 reverse_querystring.py
│   │       └── 📄 validators.py
│   ├── 📁 requirements/            # Dependencias por ambiente
│   │   ├── 📄 base.txt             # Dependencias base
│   │   ├── 📄 dev.txt              # Dependencias de desarrollo
│   │   └── 📄 prod.txt             # Dependencias de producción
│   ├── 📁 transaction/             # App de transacciones
│   │   ├── 📄 __init__.py
│   │   ├── 📄 admin.py             # Configuración del admin
│   │   ├── 📄 apps.py              # Configuración de la app
│   │   ├── 📄 models.py            # Modelo Transaction
│   │   ├── 📄 serializers.py       # Serializadores DRF
│   │   ├── 📄 tests.py             # Tests de la app
│   │   ├── 📄 urls.py              # URLs de la app
│   │   ├── 📄 views.py             # Vistas de la app
│   │   └── 📁 migrations/          # Migraciones de BD
│   └── 📁 user/                    # App principal de usuarios
│       ├── 📄 __init__.py
│       ├── 📄 admin.py             # Configuración del admin
│       ├── 📄 apps.py              # Configuración de la app
│       ├── 📄 backends.py          # Backend de autenticación personalizado
│       ├── 📄 enums.py             # Enumeraciones (tipos de tokens, roles)
│       ├── 📄 filters.py           # Filtros para DRF
│       ├── 📄 managers.py          # Manager personalizado para User
│       ├── 📄 models.py            # Modelos: User, Role, Permission, Token
│       ├── 📄 permission_list.py   # Lista de permisos del sistema
│       ├── 📄 permissions.py       # Sistema de permisos personalizado
│       ├── 📄 serializers.py       # Serializadores DRF
│       ├── 📄 tasks.py             # Tareas de Celery
│       ├── 📄 utils.py             # Utilidades de la app
│       ├── 📄 views.py             # Vistas y ViewSets
│       ├── 📁 migrations/          # Migraciones de BD
│       ├── 📁 templates/           # Templates de email
│       │   └── 📁 emails/
│       │       ├── 📄 account_verification_template.html
│       │       ├── 📄 password_reset_template.html
│       │       └── 📁 layout/
│       │           ├── 📄 footer.html
│       │           └── 📄 header.html
│       ├── 📁 tests/               # Tests organizados
│       │   ├── 📄 __init__.py
│       │   ├── 📄 conftest.py      # Configuración de tests
│       │   ├── 📄 factories.py     # Factory Boy factories
│       │   ├── 📄 test_auth.py     # Tests de autenticación
│       │   └── 📄 test_user.py     # Tests de usuarios
│       └── 📁 urls/                # URLs organizadas por funcionalidad
│           ├── 📄 __init__.py
│           ├── 📄 auth.py          # URLs de autenticación
│           ├── 📄 permissions.py   # URLs de permisos
│           ├── 📄 roles.py         # URLs de roles
│           └── 📄 user.py          # URLs de usuarios
├── 📁 docker/                      # Configuraciones Docker
│   ├── 📁 dev/                     # Ambiente de desarrollo
│   │   ├── 📄 Dockerfile           # Imagen Docker para desarrollo
│   │   └── 📄 entrypoint.sh        # Script de entrada
│   └── 📁 prod/                    # Ambiente de producción
│       ├── 📄 Dockerfile           # Imagen Docker para producción
│       └── 📄 entrypoint.sh        # Script de entrada
└── 📁 virtual310/                  # Entorno virtual (si se usa)
```

## 🔧 Configuración del Entorno

### 📋 Variables de Entorno (.env)

Crea un archivo `.env` basado en `.env.sample`:

```bash
# Configuración General
DEBUG=1
SECRET_KEY=tu_clave_secreta_muy_segura
ENVIRONMENT=dev

# Base de Datos PostgreSQL
DATABASE=postgresSQL_ENGINE=django.db.backends.postgresql
DATABASE_URL=postgresql://esteban:password123@localhost:5432/sportboard_auth_db

# Configuración de Email
SMTP_HOST=smtp-relay.sendinblue.com
EMAIL_HOST_USER=tu_email@ejemplo.com
EMAIL_HOST_PASSWORD=tu_password_email
SENDER_EMAIL=noreply@tudominio.com

# RabbitMQ para Celery
RABBITMQ_URL=amqp://mquser:mqpass@rabbitmq:5672

# Flower Dashboard
FLOWER_BASIC_AUTH=admin:password123

# Seguridad
ALLOWED_HOSTS=localhost,127.0.0.1,tu-dominio.com
MAX_LOGIN_ATTEMPT=3
```

## 🐳 Comandos Docker

### 🗄️ Configuración de Base de Datos PostgreSQL

#### 1. Crear contenedor PostgreSQL para desarrollo:

```bash
# Crear y ejecutar contenedor PostgreSQL
docker run --name PSQLFromAuthService \
  -e POSTGRES_USER=esteban \
  -e POSTGRES_PASSWORD=password123 \
  -e POSTGRES_DB=postgres \
  -p 5432:5432 \
  -d postgres:13

# Verificar que el contenedor esté corriendo
docker ps
```
```bash
# Crear y ejecutar contenedor PostgreSQL en Windows
docker run --name PSQLFromAuthService `
  -e POSTGRES_USER=esteban `
  -e POSTGRES_PASSWORD=password123 `
  -e POSTGRES_DB=postgres `
  -p 5432:5432 postgres


# Verificar que el contenedor esté corriendo
docker ps
```
#### 2. Crear base de datos específica:

```bash
# Conectar al contenedor y crear la base de datos
docker exec -it PSQLFromAuthService psql -U esteban -d postgres -c "CREATE DATABASE sportboard_auth_db;"

# Verificar que la base de datos fue creada
docker exec -it PSQLFromAuthService psql -U esteban -d postgres -c "\l"

# Crear base de datos de pruebas
docker exec -it PSQLFromAuthService psql -U esteban -d postgres -c "CREATE DATABASE test_db;"
```

#### 3. Comandos útiles de PostgreSQL:

```bash
# Conectar a la base de datos
docker exec -it PSQLFromAuthService psql -U esteban -d sportboard_auth_db

# Listar todas las bases de datos
docker exec -it PSQLFromAuthService psql -U esteban -d postgres -c "\l"

# Listar tablas en la base de datos
docker exec -it PSQLFromAuthService psql -U esteban -d sportboard_auth_db -c "\dt"

# Hacer backup de la base de datos
docker exec -t PSQLFromAuthService pg_dump -U esteban sportboard_auth_db > backup.sql

# Restaurar backup
docker exec -i PSQLFromAuthService psql -U esteban -d sportboard_auth_db < backup.sql

# Eliminar base de datos (¡CUIDADO!)
docker exec -it PSQLFromAuthService psql -U esteban -d postgres -c "DROP DATABASE IF EXISTS sportboard_auth_db;"
```

### 🚀 Ejecutar el Proyecto con Docker

#### Opción 1: Usando docker-compose (Recomendado)

```bash
# Construir y ejecutar todos los servicios
docker compose -f docker-compose.dev.yml up --build

# Ejecutar en segundo plano
docker compose -f docker-compose.dev.yml up --build -d

# Ver logs en tiempo real
docker compose -f docker-compose.dev.yml logs -f

# Parar todos los servicios
docker compose -f docker-compose.dev.yml down

# Parar y eliminar volúmenes
docker compose -f docker-compose.dev.yml down -v
```

#### Opción 2: Comandos individuales

```bash
# Construir la imagen
docker build -f docker/dev/Dockerfile -t sportboard-auth-dev .

# Ejecutar el contenedor
docker run --name sportboard-auth-api \
  --env-file .env \
  -p 8000:8000 \
  -v $(pwd)/app:/app \
  sportboard-auth-dev
```

### 📊 Servicios Incluidos en Docker Compose

1. **API (Puerto 8000):** Aplicación Django principal
2. **RabbitMQ (Puertos 5672, 15672):** Message broker para Celery
3. **Celery Worker:** Procesamiento de tareas asíncronas
4. **Celery Beat:** Programador de tareas periódicas
5. **Flower Dashboard (Puerto 25559):** Monitoreo de Celery

## 🏃‍♂️ Comandos de Ejecución

### 🐍 Entorno Virtual (Alternativa a Docker)

```bash
# Crear entorno virtual
python -m venv virtual310

# Activar entorno virtual (Windows)
virtual310\Scripts\activate

# Activar entorno virtual (Linux/Mac)
source virtual310/bin/activate

# Instalar dependencias
pip install -r app/requirements/dev.txt

# Navegar al directorio de la app
cd app

# Ejecutar migraciones
python manage.py makemigrations
python manage.py migrate

# Cargar datos iniciales (permisos)
python manage.py loaddata */fixtures/*.json

# Crear superusuario
python manage.py createsuperuser

# Ejecutar servidor de desarrollo
python manage.py runserver

# Ejecutar Celery Worker (en otra terminal)
celery -A core worker --loglevel=info

# Ejecutar Celery Beat (en otra terminal)
celery -A core beat -l info

# Ejecutar Flower Dashboard (en otra terminal)
celery --broker=amqp://mquser:mqpass@localhost:5672 flower --port=5555
```

### 🧪 Comandos de Testing

```bash
# Ejecutar todos los tests
docker compose exec api pytest -rP -vv

# Ejecutar tests específicos
docker compose exec api pytest app/user/tests/test_auth.py -v

# Ejecutar tests con cobertura
docker compose exec api pytest --cov=. --cov-report=html

# Ejecutar tests en entorno virtual
cd app
pytest -rP -vv
```

### 🔧 Comandos de Gestión Django

```bash
# Crear migraciones
docker compose exec api python manage.py makemigrations

# Aplicar migraciones
docker compose exec api python manage.py migrate

# Crear superusuario
docker compose exec api python manage.py createsuperuser

# Cargar fixtures (permisos)
docker compose exec api python manage.py loaddata */fixtures/*.json

# Exportar permisos a fixture
docker compose exec api python manage.py dumpdata --format=json user.Permission -o core/fixtures/Permission.json

# Shell de Django
docker compose exec api python manage.py shell

# Recopilar archivos estáticos
docker compose exec api python manage.py collectstatic --noinput

# Limpiar sesiones expiradas
docker compose exec api python manage.py clearsessions
```

## 📚 Funcionalidades Principales

### 🔐 Sistema de Autenticación

#### Endpoints de Autenticación:
- `POST /api/v1/auth/login/` - Iniciar sesión (obtener JWT)
- `POST /api/v1/auth/refresh/` - Renovar token JWT
- `POST /api/v1/auth/initiate-password-reset/` - Solicitar reset de contraseña
- `POST /api/v1/auth/create-password/` - Crear nueva contraseña con token
- `POST /api/v1/auth/verify-account/` - Verificar cuenta con token
- `POST /api/v1/auth/decode-token/` - Decodificar y validar token JWT

#### Características:
- **JWT Tokens:** Access token (7 días) y Refresh token (14 días)
- **Verificación por Email:** Tokens de verificación con expiración
- **Reset de Contraseñas:** Sistema seguro con tokens temporales
- **Bloqueo de Cuentas:** Después de 3 intentos fallidos
- **Backend Personalizado:** Autenticación con email en lugar de username

### 👥 Gestión de Usuarios

#### Endpoints de Usuarios:
- `GET /api/v1/user/` - Listar usuarios (con filtros y paginación)
- `POST /api/v1/user/` - Crear usuario (solo admins)
- `GET /api/v1/user/{id}/` - Obtener usuario específico
- `PATCH /api/v1/user/{id}/` - Actualizar usuario
- `DELETE /api/v1/user/{id}/` - Eliminar usuario (solo admins)
- `POST /api/v1/user/resend-verification/` - Reenviar email de verificación
- `POST /api/v1/user/change-password/` - Cambiar contraseña

#### Modelo de Usuario:
```python
class User(AbstractBaseUser, PermissionsMixin):
    id = UUIDField(primary_key=True)
    email = EmailField(unique=True)
    firstname = CharField(max_length=255)
    lastname = CharField(max_length=255)
    image = FileField(upload_to="users/")
    phone_number = CharField(max_length=17)
    failed_login_attempts = IntegerField(default=0)
    is_locked = BooleanField(default=False)
    is_staff = BooleanField(default=False)
    is_active = BooleanField(default=False)
    is_admin = BooleanField(default=False)
    verified = BooleanField(default=False)
    roles = ManyToManyField(Role)
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)
```

### 🛡️ Sistema de Roles y Permisos

#### Endpoints de Roles:
- `GET /api/v1/roles/` - Listar roles
- `POST /api/v1/roles/` - Crear rol
- `GET /api/v1/roles/{id}/` - Obtener rol específico
- `PATCH /api/v1/roles/{id}/` - Actualizar rol
- `DELETE /api/v1/roles/{id}/` - Eliminar rol
- `GET /api/v1/roles/{id}/permissions/` - Obtener permisos de un rol

#### Endpoints de Permisos:
- `GET /api/v1/permissions/` - Listar todos los permisos

#### Estructura:
```python
class Permission(AuditableModel):
    name = CharField(max_length=250)

class Role(AuditableModel):
    name = CharField(max_length=100, unique=True)
    permissions = ManyToManyField(Permission)
```

### 💰 Sistema de Transacciones

#### Modelo básico para demostración:
```python
class Transaction(AuditableModel):
    amount = DecimalField(max_digits=8, decimal_places=2)
    date = DateTimeField(auto_now_add=True)
```

## 📧 Sistema de Emails

### 📨 Templates Disponibles:
1. **Verificación de Cuenta:** `account_verification_template.html`
2. **Reset de Contraseña:** `password_reset_template.html`

### 🔄 Tareas Asíncronas (Celery):
- `send_password_reset_email()` - Envío de email para reset de contraseña
- `send_user_creation_email()` - Envío de email de bienvenida

### ⚙️ Configuración SMTP:
```python
# En settings/base.py
EMAIL_FROM = config("SENDER_EMAIL")
SMTP_HOST = config("SMTP_HOST")
EMAIL_HOST_USER = config("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = config("EMAIL_HOST_PASSWORD")
```

## 🌐 URLs y Endpoints

### 📋 Estructura de URLs:

```python
# core/urls.py
urlpatterns = [
    path('api/schema/', SpectacularAPIView.as_view()),
    path('api/v1/doc/', SpectacularSwaggerView.as_view()),
    path('api/v1/redoc/', SpectacularRedocView.as_view()),
    path('admin/', admin.site.urls),
    path('api/v1/auth/', include('user.urls.auth')),
    path('api/v1/user/', include('user.urls.user')),
    path('api/v1/roles/', include('user.urls.roles')),
    path('api/v1/permissions/', include('user.urls.permissions')),
    path('api/v1/transactions/', include('transaction.urls')),
]
```

### 🔗 Endpoints Principales:

#### Documentación:
- `GET /api/v1/doc/` - Swagger UI
- `GET /api/v1/redoc/` - ReDoc
- `GET /api/schema/` - Schema OpenAPI

#### Autenticación:
- `POST /api/v1/auth/login/`
- `POST /api/v1/auth/refresh/`
- `POST /api/v1/auth/initiate-password-reset/`
- `POST /api/v1/auth/create-password/`
- `POST /api/v1/auth/verify-account/`

#### Usuarios:
- `GET|POST /api/v1/user/`
- `GET|PATCH|DELETE /api/v1/user/{id}/`
- `POST /api/v1/user/resend-verification/`
- `POST /api/v1/user/change-password/`

#### Roles y Permisos:
- `GET|POST /api/v1/roles/`
- `GET|PATCH|DELETE /api/v1/roles/{id}/`
- `GET /api/v1/roles/{id}/permissions/`
- `GET /api/v1/permissions/`

## 🧪 Testing

### 🏗️ Estructura de Tests:

```
app/user/tests/
├── __init__.py
├── conftest.py          # Configuración y fixtures
├── factories.py         # Factory Boy factories
├── test_auth.py         # Tests de autenticación
└── test_user.py         # Tests de gestión de usuarios
```

### 🔧 Configuración de Tests:

```python
# conftest.py - Fixtures globales
@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def user_factory():
    return UserFactory

# factories.py - Factory Boy
class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User
    
    email = factory.Faker('email')
    firstname = factory.Faker('first_name')
    lastname = factory.Faker('last_name')
```

### 🚀 Comandos de Testing:

```bash
# Ejecutar todos los tests
pytest -rP -vv

# Tests específicos
pytest app/user/tests/test_auth.py::TestAuthentication::test_login -v

# Con cobertura
pytest --cov=. --cov-report=html

# Tests en paralelo
pytest -n auto
```

## 🔒 Seguridad

### 🛡️ Medidas de Seguridad Implementadas:

1. **JWT Tokens:** Autenticación stateless y segura
2. **Bloqueo de Cuentas:** Después de intentos fallidos
3. **Tokens de Verificación:** Con expiración temporal
4. **Validación de Contraseñas:** Validadores de Django
5. **CORS:** Configurado para dominios específicos
6. **CSRF Protection:** Habilitado
7. **Secure Headers:** X-Frame-Options, etc.

### ⚙️ Configuración de Seguridad:

```python
# settings/base.py
AUTH_PASSWORD_VALIDATORS = [
    'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    'django.contrib.auth.password_validation.MinimumLengthValidator',
    'django.contrib.auth.password_validation.CommonPasswordValidator',
    'django.contrib.auth.password_validation.NumericPasswordValidator',
]

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=7),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=14),
    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY,
}

MAX_LOGIN_ATTEMPT = 3
TOKEN_LIFESPAN = 24  # horas
```

## 🚀 Despliegue

### 🐳 Producción con Docker:

```bash
# Construir imagen de producción
docker build -f docker/prod/Dockerfile -t sportboard-auth-prod .

# Ejecutar en producción
docker run -d \
  --name sportboard-auth-prod \
  --env-file .env.prod \
  -p 80:8000 \
  sportboard-auth-prod
```

### 🌐 Variables de Entorno para Producción:

```bash
DEBUG=0
SECRET_KEY=clave_super_secreta_para_produccion
ENVIRONMENT=prod
DATABASE_URL=postgresql://user:pass@db-host:5432/prod_db
ALLOWED_HOSTS=tu-dominio.com,api.tu-dominio.com
```

## 📊 Monitoreo

### 🌸 Flower Dashboard:
- **URL:** `http://localhost:25559`
- **Autenticación:** Configurada en `FLOWER_BASIC_AUTH`
- **Funciones:** Monitoreo de tareas Celery, workers, estadísticas

### 📈 Logs:
```python
# Configuración en settings/base.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': 'logs/debug.log'
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': True,
        },
    }
}
```

## 🔧 Comandos Útiles de Mantenimiento

### 🗄️ Base de Datos:

```bash
# Backup completo
docker exec -t PSQLFromAuthService pg_dump -U esteban sportboard_auth_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurar backup
docker exec -i PSQLFromAuthService psql -U esteban -d sportboard_auth_db < backup_20240527_123000.sql

# Limpiar datos de prueba
docker exec -it PSQLFromAuthService psql -U esteban -d sportboard_auth_db -c "TRUNCATE TABLE user_user CASCADE;"
```

### 🧹 Limpieza:

```bash
# Limpiar contenedores parados
docker container prune

# Limpiar imágenes no utilizadas
docker image prune

# Limpiar volúmenes no utilizados
docker volume prune

# Limpiar todo el sistema Docker
docker system prune -a
```

### 📦 Gestión de Dependencias:

```bash
# Actualizar requirements
pip freeze > app/requirements/base.txt

# Instalar nueva dependencia
pip install nueva-dependencia
pip freeze > app/requirements/base.txt
```

## 🎯 Casos de Uso Comunes

### 1. 👤 Registro de Usuario:
```bash
curl -X POST http://localhost:8000/api/v1/user/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "email": "nuevo@usuario.com",
    "firstname": "Nuevo",
    "lastname": "Usuario",
    "roles": [1]
  }'
```

### 2. 🔐 Login:
```bash
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "mi_password"
  }'
```

### 3. 🔄 Reset de Contraseña:
```bash
# Solicitar reset
curl -X POST http://localhost:8000/api/v1/auth/initiate-password-reset/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com"
  }'

# Crear nueva contraseña
curl -X POST http://localhost:8000/api/v1/auth/create-password/ \
  -H "Content-Type: application/json" \
  -d '{
    "token": "TOKEN_RECIBIDO_POR_EMAIL",
    "new_password": "nueva_password_segura"
  }'
```

## 🚨 Troubleshooting

### ❌ Problemas Comunes:

#### 1. Error de conexión a PostgreSQL:
```bash
# Verificar que el contenedor esté corriendo
docker ps | grep postgres

# Verificar logs del contenedor
docker logs PSQLFromAuthService

# Reiniciar contenedor
docker restart PSQLFromAuthService
```

#### 2. Error de migraciones:
```bash
# Resetear migraciones (¡CUIDADO EN PRODUCCIÓN!)
docker compose exec api python manage.py migrate --fake-initial

# Aplicar migraciones específicas
docker compose exec api python manage.py migrate user 0001
```

#### 3. Celery no procesa tareas:
```bash
# Verificar worker de Celery
docker compose logs celery

# Reiniciar Celery
docker compose restart celery

# Verificar RabbitMQ
docker compose logs rabbitmq
```

#### 4. Error de permisos:
```bash
# Cargar permisos iniciales
docker compose exec api python manage.py loaddata */fixtures/*.json

# Verificar permisos en la base de datos
docker exec -it PSQLFromAuthService psql -U esteban -d sportboard_auth_db -c "SELECT * FROM user_permission;"
```

## 📞 Soporte y Contacto

- **Autor:** Ridwanray
- **Email:** alabarise@gmail.com
- **Documentación API:** http://localhost:8000/api/v1/doc/
- **Guía Completa:** [Medium Article](https://medium.com/@ridwanray/implement-jwt-authentication-for-communication-between-2-microservices-auth-product-services-in-bc83d1d32844)

---

## 📝 Notas Adicionales

### 🔄 Flujo de Autenticación:
1. Usuario se registra → Recibe email de verificación
2. Usuario verifica cuenta → Cuenta activada
3. Usuario hace login → Recibe JWT tokens
4. Usuario usa access token → Accede a recursos protegidos
5. Access token expira → Usa refresh token para renovar

### 🏗️ Arquitectura de Microservicios:
Este servicio está diseñado para ser parte de un ecosistema de microservicios, proporcionando autenticación centralizada para otros servicios mediante JWT tokens
