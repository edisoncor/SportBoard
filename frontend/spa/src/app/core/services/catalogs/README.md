# Servicio de Catálogos - SportBoard

Este módulo proporciona la funcionalidad completa para gestionar catálogos en la aplicación SportBoard, incluyendo categorías e items.

## Estructura de Archivos

```
src/app/core/
├── config/
│   └── api-endpoints.ts          # Configuración centralizada de endpoints
├── models/catalogs/
│   ├── Category.ts               # Modelo TypeScript para categorías
│   ├── Item.ts                   # Modelo TypeScript para items
│   └── index.ts                  # Exportaciones de modelos
└── services/catalogs/
    ├── catalog.service.ts        # Servicio principal de catálogos
    └── index.ts                  # Exportaciones de servicios
```

## Modelos

### Category
Representa una categoría de catálogo con los siguientes campos:
- `id`: Identificador único
- `name`: Nombre de la categoría
- `code`: Código único
- `description`: Descripción opcional
- `level`: Nivel jerárquico
- `version`: Versión
- `isActive`: Estado activo/inactivo
- `parentCatalogId`: ID de categoría padre (opcional)

### Item
Representa un item de catálogo con los siguientes campos:
- `id`: Identificador único
- `name`: Nombre del item
- `code`: Código único
- `description`: Descripción opcional
- `price`: Precio opcional
- `categoryId`: ID de la categoría a la que pertenece
- `version`: Versión
- `isActive`: Estado activo/inactivo
- `parentCatalogId`: ID de item padre (opcional)

## Servicio CatalogService

El servicio proporciona métodos completos para CRUD de categorías e items:

### Métodos para Categorías
- `getCategories()`: Obtiene todas las categorías
- `getCategoryById(id)`: Obtiene una categoría por ID
- `createCategory(data)`: Crea una nueva categoría
- `updateCategory(id, data)`: Actualiza una categoría
- `deleteCategory(id)`: Elimina una categoría

### Métodos para Items
- `getItems()`: Obtiene todos los items
- `getItemById(id)`: Obtiene un item por ID
- `getItemsByCategory(categoryId)`: Obtiene items de una categoría
- `createItem(data)`: Crea un nuevo item
- `updateItem(id, data)`: Actualiza un item
- `deleteItem(id)`: Elimina un item

## Uso del Servicio

### Ejemplo básico en un componente:

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { CatalogService } from '../core/services/catalogs';
import { Category, Item } from '../core/models/catalogs';

@Component({
  selector: 'app-my-component',
  template: `...`
})
export class MyComponent implements OnInit {
  private catalogService = inject(CatalogService);

  ngOnInit(): void {
    // Cargar categorías
    this.catalogService.getCategories().subscribe({
      next: (categories) => {
        console.log('Categorías:', categories);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });

    // Cargar items
    this.catalogService.getItems().subscribe({
      next: (items) => {
        console.log('Items:', items);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }
}
```

### Crear una nueva categoría:

```typescript
const newCategory = {
  name: 'Deportes',
  code: 'SPORTS_001',
  description: 'Categoría para artículos deportivos',
  level: 1
};

this.catalogService.createCategory(newCategory).subscribe({
  next: (category) => console.log('Categoría creada:', category),
  error: (error) => console.error('Error:', error)
});
```

### Crear un nuevo item:

```typescript
const newItem = {
  name: 'Balón de Fútbol',
  code: 'BALL_001',
  description: 'Balón profesional de fútbol',
  price: 29.99,
  categoryId: 1
};

this.catalogService.createItem(newItem).subscribe({
  next: (item) => console.log('Item creado:', item),
  error: (error) => console.error('Error:', error)
});
```

## Configuración de Endpoints

Los endpoints están centralizados en `api-endpoints.ts`:

```typescript
export const API_ENDPOINTS = {
  BASE_URL: 'http://localhost:8000',
  CATALOG: {
    CATEGORIES: '/catalog/categories',
    ITEMS: '/catalog/items'
  }
};
```

Para cambiar la URL base o los endpoints, simplemente modifica este archivo.

## Manejo de Errores

El servicio incluye manejo robusto de errores que:
- Proporciona mensajes de error específicos según el código HTTP
- Registra errores en la consola para debugging
- Incluye reintentos automáticos para operaciones de lectura
- Devuelve errores en formato Observable para manejo reactivo

## Características Adicionales

- **Tipado fuerte**: Todos los métodos utilizan TypeScript para garantizar type safety
- **Reactive Programming**: Utiliza RxJS Observables para programación reactiva
- **Error Handling**: Manejo centralizado de errores HTTP
- **Retry Logic**: Reintentos automáticos en caso de fallos de red
- **Modular**: Estructura modular que facilita el mantenimiento

## Integración con el Backend

El servicio está diseñado para integrarse con los endpoints del backend Django:
- `GET /catalog/categories` - Lista categorías
- `GET /catalog/items` - Lista items
- `POST /catalog/categories` - Crea categoría
- `PUT /catalog/categories/{id}` - Actualiza categoría
- `DELETE /catalog/categories/{id}` - Elimina categoría
- Y equivalentes para items

Asegúrate de que el backend esté ejecutándose en `http://localhost:8000` o actualiza la configuración en `api-endpoints.ts`.
