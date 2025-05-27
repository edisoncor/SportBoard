# ms-catalog

Microservicio RESTful para gestión de catálogos jerárquicos, implementado con Django y Django REST Framework.

## Propósito
Permite gestionar categorías e ítems de catálogos jerárquicos, con versionado de API, HATEOAS, paginación, manejo de errores y documentación Swagger.

## Arquitectura
- Basada en el diagrama C4 (ver imagen adjunta).
- Capas: URLs → Views → Services → Models → Database.

## Modelo de datos
- Basado en el diagrama UML (ver imagen adjunta).
- Relaciones y nombres de roles estrictamente según el diagrama.

## Instalación
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
```

## Ejecución
```bash
python manage.py runserver
```

## Pruebas
```bash
python manage.py test
```

## Documentación Swagger
Disponible en: `/api/v1/docs/`

## Ejemplo de respuesta RESTful estandarizada
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

## Códigos HTTP usados
- 200: GET exitoso
- 201: Recurso creado
- 204: Eliminación exitosa
- 400: Datos inválidos
- 401: Autenticación faltante
- 403: Permisos insuficientes
- 404: Recurso no encontrado
- 409: Conflicto de duplicidad

---

## Endpoints personalizados expuestos

- CatalogCategory:
  - `GET /categories/{code}/list-catalogs/` — Lista los ítems de la categoría
    - **Ejemplo de respuesta:**
      ```json
      {
        "data": [
          {"url": "/api/v1/catalog/items/item1/", "name": "Item1", ...}
        ],
        "message": "Ítems listados correctamente"
      }
      ```
  - `GET /categories/{code}/count-catalogs/` — Cuenta los ítems de la categoría
    - **Ejemplo de respuesta:**
      ```json
      { "data": 3, "message": "Conteo de ítems en la categoría" }
      ```
  - `GET /categories/{code}/exists-catalog-by-code/{item_code}/` — Verifica existencia de ítem por código
    - **Ejemplo de respuesta:**
      ```json
      { "data": true, "message": "Existencia verificada" }
      ```
  - `POST /categories/{code}/add-catalog/` — Agrega un ítem existente a la categoría
    - **Body:** `{ "item_code": "item1" }`
    - **Ejemplo de respuesta:**
      ```json
      { "message": "Ítem agregado correctamente" }
      ```
  - `POST /categories/{code}/remove-catalog/` — Elimina un ítem de la categoría
    - **Body:** `{ "item_code": "item1" }`
    - **Ejemplo de respuesta:**
      ```json
      { "message": "Ítem eliminado correctamente" }
      ```
- CatalogItem:
  - `GET /items/{code}/get-category/` — Obtiene la categoría del ítem
    - **Ejemplo de respuesta:**
      ```json
      { "data": {"url": "/api/v1/catalog/categories/cat1/", "name": "Cat1", ...}, "message": "Categoría obtenida correctamente" }
      ```
  - `POST /items/{code}/change-category/` — Cambia la categoría del ítem
    - **Body:** `{ "new_category_code": "cat2" }`
    - **Ejemplo de respuesta:**
      ```json
      { "message": "Categoría cambiada correctamente" }
      ```
  - `GET /items/{code}/get-path/` — Obtiene la ruta jerárquica del ítem
    - **Ejemplo de respuesta:**
      ```json
      { "data": "Cat1/Item1", "message": "Ruta obtenida correctamente" }
      ```
  - `POST /items/{code}/activate/` — Activa el ítem
    - **Ejemplo de respuesta:**
      ```json
      { "message": "Ítem activado correctamente" }
      ```

---

## Ejemplos de uso para endpoints CRUD estándar

### Categorías (CatalogCategory)

- **Crear categoría**
  - `POST /api/v1/catalog/categories/`
  - **Body:**
    ```json
    {
      "name": "Cat1",
      "code": "cat1",
      "level": 0
    }
    ```
  - **Respuesta:**
    ```json
    {
      "url": "/api/v1/catalog/categories/cat1/",
      "name": "Cat1",
      "code": "cat1",
      "version": 1,
      "isActive": true,
      "level": 0,
      "parent_catalog": null,
      "child_catalogs": []
    }
    ```

- **Listar categorías**
  - `GET /api/v1/catalog/categories/`
  - **Respuesta:**
    ```json
    {
      "data": [
        {"url": "/api/v1/catalog/categories/cat1/", "name": "Cat1", ...}
      ],
      "meta": {"pagination": {"count": 1, "next": null, "previous": null}},
      "message": "Recursos obtenidos correctamente"
    }
    ```

- **Obtener detalle de categoría**
  - `GET /api/v1/catalog/categories/cat1/`
  - **Respuesta:**
    ```json
    {
      "url": "/api/v1/catalog/categories/cat1/",
      "name": "Cat1",
      "code": "cat1",
      "version": 1,
      "isActive": true,
      "level": 0,
      "parent_catalog": null,
      "child_catalogs": []
    }
    ```

- **Eliminar categoría**
  - `DELETE /api/v1/catalog/categories/cat1/`
  - **Respuesta:**
    - Código 204 No Content (sin cuerpo)

### Ítems (CatalogItem)

- **Crear ítem**
  - `POST /api/v1/catalog/items/`
  - **Body:**
    ```json
    {
      "name": "Item1",
      "code": "item1",
      "category": "cat1"
    }
    ```
  - **Respuesta:**
    ```json
    {
      "url": "/api/v1/catalog/items/item1/",
      "name": "Item1",
      "code": "item1",
      "version": 1,
      "isActive": true,
      "category": "cat1",
      "parent_catalog": null,
      "child_catalogs": []
    }
    ```

- **Listar ítems**
  - `GET /api/v1/catalog/items/`
  - **Respuesta:**
    ```json
    {
      "data": [
        {"url": "/api/v1/catalog/items/item1/", "name": "Item1", ...}
      ],
      "meta": {"pagination": {"count": 1, "next": null, "previous": null}},
      "message": "Recursos obtenidos correctamente"
    }
    ```

- **Obtener detalle de ítem**
  - `GET /api/v1/catalog/items/item1/`
  - **Respuesta:**
    ```json
    {
      "url": "/api/v1/catalog/items/item1/",
      "name": "Item1",
      "code": "item1",
      "version": 1,
      "isActive": true,
      "category": "cat1",
      "parent_catalog": null,
      "child_catalogs": []
    }
    ```

- **Eliminar ítem**
  - `DELETE /api/v1/catalog/items/item1/`
  - **Respuesta:**
    - Código 204 No Content (sin cuerpo)

---

## Prompt de desarrollo Copilot

```
Microservicio RESTful con Django + DRF + C4 + UML + HATEOAS + Swagger

Desarrolla un microservicio backend RESTful en Django (usar venv) usando Django REST Framework, siguiendo una arquitectura por capas, versionado de API y cumpliendo estándares REST como HATEOAS, paginación, códigos HTTP adecuados y documentación Swagger.

Objetivo general
A partir de las siguientes dos imágenes:
- El proyecto se llama ms-catalog y la app catalog
- Un diagrama de clases UML que define las entidades del dominio.
- Un diagrama de componentes C4 (Nivel 3) que representa la arquitectura interna del microservicio Catalog.

Genera un microservicio backend usando Django y Django REST Framework, cumpliendo con los principios de diseño RESTful (nivel 3 de Richardson), incluyendo:
- Versionado de la API,
- HATEOAS (HyperlinkedModelSerializer),
- Documentación Swagger/OpenAPI,
- Respuestas estandarizadas,
- Manejo de errores con códigos HTTP (2xx, 4xx, 5xx),
- Paginación.

Instrucciones para procesar las imágenes
Imagen 1: Diagrama de clases UML
- Contiene únicamente las clases, atributos, métodos y relaciones.
- Ignora cualquier título, leyenda o comentario fuera de las clases.
- Interpreta:
  - Los atributos como campos Django.
  - Los métodos como funciones de instancia si se requieren.
  - Las relaciones UML como ForeignKey, ManyToManyField, etc.

Relación y nombre de roles
- Interpreta los nombres de rol en los extremos de las relaciones (por ejemplo: _parentCatalog, _childCatalogs, _category, _catalogs) como nombres obligatorios para los campos en los modelos.
- Si la relación es reflexiva (una clase relacionada consigo misma), respeta los nombres:
  parent_catalog = models.ForeignKey('self', related_name='child_catalogs', on_delete=models.CASCADE)
- No modifiques ni omitas los nombres de rol: deben usarse exactamente como están en el diagrama.

Imagen 2: Diagrama de componentes C4 (Nivel 3)
- Sigue la arquitectura mostrada:
  -  URLs → Views → Services → Models → Database
  -  Serializers como canal entre Views y Models.
- El path base será /api/v1/catalog/ (versión incluida en la URL).

Estructura y funcionalidades del microservicio
1. Modelos (models.py)
- Basados en el diagrama UML.
- Implementa herencias, relaciones uno a muchos, reflexivas, etc.
- Atributo code como identificador lógico si aplica.
- Validaciones opcionales en clean().

2. Serializadores (serializers.py)
- Usar HyperlinkedModelSerializer para exponer URLs (HATEOAS).
- Validaciones (UniqueValidator, campos requeridos).
- Soporte para relaciones anidadas si aplica.
- Incluir docstrings.

3. Vistas (views.py)
- Usar ModelViewSet.
- lookup_field = 'code' si corresponde.
- Implementar filtros, búsqueda, ordenamiento y paginación (PageNumberPagination).
- Las respuestas deben seguir este formato estandarizado:

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

4. Servicios (services.py)
- Encapsular toda la lógica de negocio (jerarquía, validaciones, acciones como activar/desactivar).
- Usar excepciones personalizadas (ValidationError, ConflictError, etc.).
- Documentar cada función.

5. URLs (urls.py)
- usar DefaultRouter con versión: /api/v1/catalog/.
- Seguir convención REST:
  - Colecciones: /categories/, /items/
  - Documentos: /categories/{code}
  - Stores: /categories/{code}/items/
  - Controladores: /items/{code}/activate/

Pruebas (tests.py)
- Usar APITestCase.
- Verificar:
  Código	Verificación
  200	GET exitoso
  201	Recurso creado con POST
  204	Eliminación exitosa sin contenido
  400	Datos inválidos
  401	Autenticación faltante
  403	Permisos insuficientes
  404	Recurso no encontrado
  409	Conflicto de duplicidad u operación ilegal
- Verificar enlaces HATEOAS (url presente).
- Validar paginación y estructura estándar de respuesta.

Documentación (README.md)
Debe incluir:
- Propósito del microservicio Catalog.
- Arquitectura (imagen C4).
- Modelo de datos (imagen UML).
- Instalación, ejecución y pruebas.
- Uso de Swagger/OpenAPI.
- Ejemplo de una respuesta RESTful estandarizada.
- Códigos HTTP usados y ejemplos.
- Endpoints personalizados expuestos.

Extras
- .gitignore para Python y Django.
- Código limpio, legible, con docstrings en todos los métodos y clases (documentación clara y profesional).
- PEP8 aplicado.
- JSON con estructura clara (camelCase opcional si aplica).
- Documentación Swagger disponible en /api/v1/docs/.
```
