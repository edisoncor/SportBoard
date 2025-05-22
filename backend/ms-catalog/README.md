# Microservicio Catalog

## Propósito
Backend RESTful para gestión de catálogos jerárquicos, siguiendo arquitectura por capas, versionado, HATEOAS, paginación, manejo de errores y documentación Swagger.

## Diagramas
- **UML**: Ver imágenes adjuntas para entidades y relaciones.
- **C4 Nivel 3**: Arquitectura de componentes (URLs, Views, Service, Model, Serializers).

## Instalación y entorno
```sh
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt  # (o pip install django djangorestframework drf-yasg)
python manage.py migrate
python manage.py runserver
```

## Ejecución
- Acceso API: http://localhost:8000/api/v1/catalog/
- Swagger: http://localhost:8000/api/v1/docs/

## Convenciones REST implementadas
- Versionado: `/api/v1/`
- HATEOAS: URLs en respuestas (HyperlinkedModelSerializer)
- Paginación: activada por defecto
- Códigos HTTP: 200, 201, 204, 400, 401, 403, 404, 409
- Manejo de errores estandarizado

## Ejemplo de respuesta estándar
```json
{
  "data": [
    {
      "url": "http://localhost:8000/api/v1/catalog/items/ITEM001/",
      "code": "ITEM001",
      "name": "Item ejemplo",
      "version": 1,
      "category": "http://localhost:8000/api/v1/catalog/categories/CAT001/",
      "is_active": true
    }
  ],
  "meta": {
    "pagination": {
      "count": 1,
      "page": 1,
      "page_size": 10,
      "num_pages": 1
    }
  },
  "message": "Operación exitosa"
}
```

## Formato de error
```json
{
  "error": {
    "code": 404,
    "message": "Recurso no encontrado"
  }
}
```

---

- Para más detalles, ver los diagramas UML y C4 adjuntos.
- El microservicio está listo para integrarse con API Gateway (Kong) bajo el prefijo `/catalog/`.

## Prompt de generación

```
Objetivo
A partir de las siguientes dos imágenes:
- Diagrama de clases UML con las entidades del dominio.
- Diagrama C4 Nivel 3 que define la arquitectura del microservicio Catalog.
- Las buenas prácticas REST: códigos HTTP, versionado, manejo de errores, HATEOAS, Swagger.

Desarrolla un microservicio backend RESTful en Django (usar venv)usando Django REST Framework, siguiendo una arquitectura por capas, versionado de API y cumpliendo estándares REST como HATEOAS, paginación, códigos HTTP adecuados y documentación Swagger.

Arquitectura (según diagrama C4)
Usar los siguientes componentes:

Componente:  Rol
URLs:  Enrutamiento REST (/api/v1/catalog/...) usando DefaultRouter.
Views: Manejo de solicitudes y delegación a servicios.
Service: Lógica de negocio desacoplada.
Model: Entidades con relaciones basadas en el UML.
Serializers: Incluyen hipervínculos para HATEOAS usando HyperlinkedModelSerializer.
SQLite:  Base de datos relacional.
API Gateway (Kong):  Redirige hacia el prefijo /catalog/.

Componentes del microservicio
1. Modelos (models.py)
- Generar a partir del diagrama UML.
- Relación entre entidades (ForeignKey, reflexivas, etc.).
- Atributo code como identificador lógico si se define.

2. Serializadores (serializers.py)
- Usar serializers.HyperlinkedModelSerializer para exponer URLs en lugar de IDs (cumplimiento HATEOAS).
- Incluir campos como:
ejemplo
class CatalogItemSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = CatalogItem
        fields = ['url', 'code', 'name', 'category']

- Definir view_name en campos relacionados si es necesario.
- Validaciones y docstrings.

3. Vistas (views.py)
- Usar ModelViewSet.
- Definir lookup_field = 'code' si aplica.
- Configurar paginación y filtros.

Las respuestas deben estar estandarizadas:
ejemplo:
{
  "data": [...],
  "meta": {
    "pagination": {...}
  },
  "message": "Operación exitosa"
}

4. Servicios (services.py)
- Encapsular lógica de negocio (jerarquía, validación, etc.).
- Reutilizable desde múltiples vistas.

5. URLs (urls.py)
- Prefijo versionado: /api/v1/catalog/.
- Usar DefaultRouter.
- Convenciones REST para:
  - Colecciones: /categories/
  - Documentos: /categories/{code}
  - Stores: /categories/{code}/items/
  - Acciones: /items/{code}/activate/
- Incluir documentación Swagger: /api/v1/docs/

Buenas prácticas REST (según imagen)
Códigos HTTP esperados
Código  Uso
200 OK  GET /categories/ → respuesta exitosa
201 Created POST /categories/ → recurso creado
204 No Content  DELETE /items/{code} sin contenido en respuesta
400 Bad Request JSON malformado, validación fallida
401 Unauthorized  Token faltante o inválido
403 Forbidden Usuario sin permisos
404 Not Found Recurso no existe
409 Conflict  Conflicto por duplicidad o estado inconsistente

Versionado
En la URL: /api/v1/...

Swagger documenta bajo versión v1.

Manejo de errores
Estandarizar errores:
{
  "error": {
    "code": 404,
    "message": "Recurso no encontrado"
  }
}

6. Documentación Swagger/OpenAPI
- Instalar y configurar drf-yasg.
- Documentar vistas, modelos y respuestas.

7. Pruebas (tests.py)
- Usar APITestCase.
- Validar:
  - Códigos de respuesta HTTP (2xx, 4xx, 5xx).
  - Navegación HATEOAS (verificar existencia de campos url).
  - Paginación y respuestas estandarizadas.
  - Formato de errores

8. README.md
Debe incluir:
- Propósito del microservicio.
- Diagrama UML y C4.
- Instalación, entorno, ejecución.
- Swagger: cómo acceder a /api/v1/docs/
- Convenciones REST implementadas.
- Ejemplo de una respuesta completa (HATEOAS + paginación + meta + mensaje).

9. Extras
- .gitignore para Django.
- Buenas prácticas de codificación (PEP8).
- Todo debe estar documentado con docstrings.

Instrucciones finales
Usa:
- El diagrama UML para modelos, atributos, relaciones.
- El diagrama C4 Nivel 3 para estructurar el microservicio.
- Asegúrate de incluir:
  - Versionado REST en la URL (/api/v1/)
  - Soporte para HATEOAS (HyperlinkedModelSerializer)
  - Swagger para documentación
  - Paginación y respuestas estandarizadas
```
