# ms-competencies

Microservicio RESTful para la gestión de competencias deportivas.

## Arquitectura
- Basado en Django + Django REST Framework
- Arquitectura por capas (ver diagrama C4)
- Versionado de API, HATEOAS, paginación, manejo de errores, respuestas estandarizadas y documentación Swagger

## Instalación y ejecución

1. Crear y activar entorno virtual:
   ```powershell
   python -m venv venv
   .\venv\Scripts\activate
   ```
2. Instalar dependencias:
   ```powershell
   pip install -r requirements.txt
   ```
3. Migrar base de datos:
   ```powershell
   python manage.py migrate
   ```
4. Ejecutar servidor:
   ```powershell
   python manage.py runserver
   ```

## Pruebas
```powershell
python manage.py test
```

## Documentación Swagger
Disponible en `/api/v1/docs/` una vez iniciado el servidor.

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
- 200: Éxito
- 201: Creado
- 204: Sin contenido
- 400: Datos inválidos
- 401: No autenticado
- 403: Sin permisos
- 404: No encontrado
- 409: Conflicto

## Endpoints personalizados
- `/categories/{code}/items/`
- `/items/{code}/activate/`

## Diagramas
- Ver carpeta `/docs` para los diagramas UML y C4.
