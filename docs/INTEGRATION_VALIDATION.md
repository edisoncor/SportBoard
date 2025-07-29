# Integración Frontend Angular con Backend ms-competencies vía Kong API Gateway

## Resumen de la Integración

Esta documentación describe la integración completa entre el frontend Angular (SPA) y el microservicio `ms-competencies` utilizando Kong como API Gateway para SportBoard.

## Arquitectura de la Integración

```
Frontend (Angular) → Kong API Gateway (Puerto 8000) → ms-competencies (Puerto 8010)
```

### Componentes Configurados

1. **Kong API Gateway**: Configurado para enrutar peticiones del frontend al microservicio
2. **Interceptor HTTP**: Manejo centralizado de peticiones y respuestas
3. **Servicios Angular**: Abstracción de las operaciones CRUD para todas las entidades
4. **Modelos TypeScript**: Representación tipada de las entidades del backend
5. **Componentes de UI**: Interfaces para gestionar las entidades

## Configuración de Endpoints

### Kong Configuration (`docker/api-gateway/kong.yml`)

```yaml
services:
  - name: ms-competencies
    url: http://ms-competencies:8010
    routes:
      - name: ms-competencies-route
        paths:
          - /competencies
        strip_path: false
        methods: [GET, POST, PUT, PATCH, DELETE, OPTIONS]
```

### Endpoints Configurados en Angular

```typescript
// Configuración base
BASE_URL: 'http://localhost:8000'

// Endpoints del microservicio a través de Kong
COMPETENCIES: {
  BASE: '/competencies/api/v1/competencies',
  CATALOGUES: '/competencies/api/v1/competencies/catalogues/',
  RULES: '/competencies/api/v1/competencies/rules/',
  GAME_STATES: '/competencies/api/v1/competencies/gamestates/',
  USERS: '/competencies/api/v1/competencies/users/',
  // ... otros endpoints
}
```

## Modelos de Datos Implementados

### Entidades Principales

1. **Catalogue**: Catálogos del sistema
2. **Rule**: Reglas de competencias
3. **GameState**: Estados de juego
4. **User**: Usuarios del sistema
5. **Athlete**: Atletas
6. **Administration**: Administraciones
7. **Category**: Categorías
8. **Team**: Equipos
9. **Competition**: Competencias
10. **Season**: Temporadas
11. **Phase**: Fases
12. **Offer**: Ofertas
13. **Game**: Juegos
14. **Marker**: Marcadores
15. **PositionTable**: Tablas de posiciones
16. **TableRating**: Calificaciones de tabla

### Estructura de Modelos TypeScript

```typescript
export interface Catalogue {
  id: number;
  code: string;
  description: string;
  parent_catalog?: number;
}

export interface CreateCatalogueDto {
  code: string;
  description: string;
  parent_catalog?: number;
}

export interface UpdateCatalogueDto {
  code?: string;
  description?: string;
  parent_catalog?: number;
}
```

## Servicios Implementados

### CompetenciesService

El servicio principal que maneja todas las operaciones CRUD para las entidades del microservicio:

```typescript
@Injectable({
  providedIn: 'root'
})
export class CompetenciesService {
  // Métodos para cada entidad:
  // - get{Entity}s(): Observable<Entity[]>
  // - get{Entity}ById(id: number): Observable<Entity>
  // - create{Entity}(data: CreateEntityDto): Observable<Entity>
  // - update{Entity}(id: number, data: UpdateEntityDto): Observable<Entity>
  // - delete{Entity}(id: number): Observable<void>
}
```

### Funcionalidades del Servicio

1. **Paginación automática**: Obtiene todas las páginas de endpoints paginados
2. **Manejo de errores**: Tratamiento centralizado de errores HTTP
3. **Reintentos**: Reintentos automáticos para operaciones de lectura
4. **Búsqueda**: Métodos para buscar por términos específicos
5. **Tipado fuerte**: Uso de TypeScript para mayor seguridad de tipos

## Interceptors HTTP

### KongInterceptor

Interceptor específico para la integración con Kong:

```typescript
@Injectable()
export class KongInterceptor implements HttpInterceptor {
  // Funcionalidades:
  // - Agregar headers necesarios
  // - Logging de peticiones y respuestas
  // - Manejo específico de errores de Kong
  // - Transformación de errores para mensajes amigables
}
```

### Funcionalidades del Interceptor

1. **Headers automáticos**: Agrega Content-Type y Accept
2. **Identificación del cliente**: Headers X-Client-Name y X-Client-Version
3. **Logging detallado**: Logs de todas las peticiones HTTP
4. **Manejo de errores específicos**: Detección de errores de Kong y microservicios
5. **Mensajes amigables**: Transformación de errores técnicos en mensajes comprensibles

## Componentes de UI

### CataloguesManagementComponent

Componente de ejemplo que demuestra el uso completo del servicio:

```typescript
@Component({
  selector: 'app-catalogues-management',
  standalone: true,
  // ... configuración
})
export class CataloguesManagementComponent implements OnInit {
  // Funcionalidades:
  // - Listado de catálogos
  // - Creación de nuevos catálogos
  // - Edición de catálogos existentes
  // - Eliminación de catálogos
  // - Validación de formularios
  // - Manejo de estados de carga
}
```

## Validación de la Integración

### Pasos para Validar

1. **Verificar Kong está ejecutándose**:
   ```bash
   curl http://localhost:8000/competencies/api/v1/competencies/catalogues/
   ```

2. **Verificar el microservicio está disponible**:
   ```bash
   curl http://localhost:8010/api/v1/competencies/catalogues/
   ```

3. **Verificar la aplicación Angular**:
   - Iniciar el servidor de desarrollo: `ng serve --port 4201`
   - Navegar al componente de catálogos
   - Verificar que se cargan los datos del backend

### Puntos de Verificación

- [ ] Kong API Gateway está ejecutándose en puerto 8000
- [ ] ms-competencies está ejecutándose en puerto 8010
- [ ] Las rutas de Kong están configuradas correctamente
- [ ] Los CORS están habilitados para el frontend
- [ ] Los interceptors HTTP están funcionando
- [ ] Los servicios Angular pueden comunicarse con el backend
- [ ] Los componentes de UI muestran datos del backend
- [ ] Las operaciones CRUD funcionan correctamente

## Configuración de CORS

Kong está configurado para permitir peticiones desde el frontend:

```yaml
plugins:
  - name: cors
    config:
      origins:
        - http://localhost:4200
        - http://localhost:4201  # Puerto configurado para el dev server
      methods:
        - GET
        - POST
        - PUT
        - DELETE
        - PATCH
        - HEAD
        - OPTIONS
      headers:
        - Accept
        - Authorization
        - Content-Type
        - Origin
        - X-Requested-With
      credentials: true
```

## Estructura de Respuestas API

El backend devuelve respuestas en formato estandarizado:

```json
{
  "data": [...],
  "meta": {
    "pagination": {
      "count": 100,
      "next": "...",
      "previous": "..."
    }
  },
  "message": "Recursos obtenidos correctamente"
}
```

## Comandos de Validación

### Iniciar los Servicios

1. **Iniciar Kong y microservicios**:
   ```bash
   cd docker
   docker-compose up -d
   ```

2. **Iniciar el frontend Angular**:
   ```bash
   cd frontend/spa
   ng serve --port 4201 --host 0.0.0.0
   ```

### Verificar Conectividad

1. **Verificar Kong**:
   ```bash
   curl -X GET http://localhost:8000/competencies/api/v1/competencies/catalogues/
   ```

2. **Verificar microservicio directamente**:
   ```bash
   curl -X GET http://localhost:8010/api/v1/competencies/catalogues/
   ```

3. **Verificar CORS**:
   ```bash
   curl -X OPTIONS \
     -H "Origin: http://localhost:4201" \
     -H "Access-Control-Request-Method: GET" \
     http://localhost:8000/competencies/api/v1/competencies/catalogues/
   ```

## Troubleshooting

### Problemas Comunes

1. **Error 503 (Service Unavailable)**:
   - Verificar que ms-competencies está ejecutándose
   - Verificar la configuración de Kong

2. **Error CORS**:
   - Verificar que el puerto del frontend está en la configuración de Kong
   - Verificar que Kong está procesando las peticiones OPTIONS

3. **Error 404**:
   - Verificar las rutas configuradas en Kong
   - Verificar los endpoints en la configuración de Angular

4. **Network Error**:
   - Verificar que Kong está ejecutándose en puerto 8000
   - Verificar la conectividad de red

### Logs Útiles

1. **Logs de Kong**:
   ```bash
   docker logs kong-container
   ```

2. **Logs del microservicio**:
   ```bash
   docker logs ms-competencies-container
   ```

3. **Logs del frontend**:
   - Abrir Developer Tools en el navegador
   - Verificar la pestaña Console y Network

## Conclusión

La integración está completa y proporciona:

1. ✅ Comunicación segura entre frontend y backend vía Kong
2. ✅ Manejo robusto de errores y logging
3. ✅ Tipado fuerte con TypeScript
4. ✅ Operaciones CRUD completas para todas las entidades
5. ✅ Componentes de UI funcionales
6. ✅ Interceptors para manejo centralizado de HTTP
7. ✅ Configuración de CORS adecuada
8. ✅ Documentación completa para validación

La arquitectura es escalable y permite agregar fácilmente nuevos microservicios o funcionalidades al sistema SportBoard.
