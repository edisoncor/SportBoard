# CRUD de Items - SportBoard

## Descripción
Se ha implementado un sistema CRUD completo para la gestión de items del catálogo en la aplicación SportBoard.

## Características Implementadas

### 🔧 Backend Integration
- ✅ Modelos actualizados para coincidir con la API del backend
- ✅ Servicio CatalogService actualizado con métodos para items
- ✅ Manejo de respuestas paginadas y wrapper ApiResponse
- ✅ Soporte para operaciones con códigos en lugar de IDs numéricos

### 📱 Componente Principal (ItemsComponent)
- ✅ Tabla responsive con datos de items
- ✅ Filtros de búsqueda por nombre, código y descripción
- ✅ Filtro por categoría
- ✅ Operaciones CRUD: Crear, Editar, Eliminar
- ✅ Confirmación de eliminación
- ✅ Indicadores de estado (activo/inactivo)
- ✅ Gestión de estados con Angular Signals
- ✅ Manejo de errores y mensajes de éxito

### 🎛️ Diálogo de Items (ItemDialogComponent)
- ✅ Formulario reactivo con validaciones
- ✅ Modo crear y editar
- ✅ Validación de códigos (solo mayúsculas, números, guiones)
- ✅ Selección de categoría
- ✅ Campo de descripción opcional
- ✅ Control de estado activo/inactivo

### 🎨 UI/UX
- ✅ Diseño Material Design
- ✅ Responsive design para móviles
- ✅ Animaciones suaves
- ✅ Indicadores de carga
- ✅ Mensajes informativos
- ✅ Iconografía consistente

### 🔗 Navegación
- ✅ Ruta `/ajustes/items` configurada
- ✅ Enlace habilitado en el menú de administración
- ✅ Integración con el layout principal

## Estructura de Archivos

```
frontend/spa/src/app/
├── core/
│   ├── models/catalogs/
│   │   ├── Item.ts                 # Modelo actualizado con estructura del backend
│   │   └── index.ts               # Exportaciones
│   └── services/catalogs/
│       └── catalog.service.ts     # Servicio actualizado con métodos de items
├── features/ajustes/catalogs/components/
│   ├── items/
│   │   ├── items.component.ts     # Componente principal
│   │   ├── items.component.html   # Template
│   │   └── items.component.scss   # Estilos
│   └── item-dialog/
│       ├── item-dialog.component.ts   # Diálogo crear/editar
│       ├── item-dialog.component.html # Template del diálogo
│       └── item-dialog.component.scss # Estilos del diálogo
└── app.routes.ts                  # Ruta configurada
```

## API Endpoints Utilizados

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/catalog/items/` | Obtener todos los items (paginado) |
| GET | `/catalog/items/{code}/` | Obtener item por código |
| POST | `/catalog/items/` | Crear nuevo item |
| PUT | `/catalog/items/{code}/` | Actualizar item |
| DELETE | `/catalog/items/{code}/` | Eliminar item |
| GET | `/catalog/categories/` | Obtener categorías (para filtros) |

## Modelos de Datos

### Item Interface
```typescript
interface Item {
  url: string;                 // URL única del item
  category: string;            // Código de categoría
  parent_catalog?: string;     // URL del catálogo padre
  name: string;               // Nombre del item
  code: string;               // Código único
  description?: string;       // Descripción opcional
  version: number;            // Versión
  isActive: boolean;          // Estado activo
  child_catalogs?: Item[];    // Items hijos
}
```

### Request DTOs
```typescript
interface CreateItemRequest {
  name: string;
  code: string;
  description?: string;
  category: string;
  parent_catalog?: string;
}

interface UpdateItemRequest {
  name?: string;
  code?: string;
  description?: string;
  version?: number;
  isActive?: boolean;
}
```

## Funcionalidades

### 🔍 Búsqueda y Filtros
- Búsqueda en tiempo real por nombre, código o descripción
- Filtro por categoría con dropdown
- Botón para limpiar filtros
- Contador de resultados

### ✏️ Gestión de Items
- **Crear**: Formulario con validaciones, selección de categoría
- **Editar**: Formulario pre-rellenado, código no editable
- **Eliminar**: Confirmación antes de eliminar
- **Visualizar**: Tabla con toda la información relevante

### 🎯 Validaciones
- Nombre: Requerido, máximo 100 caracteres
- Código: Requerido, máximo 20 caracteres, solo mayúsculas/números/guiones
- Descripción: Opcional, máximo 500 caracteres
- Categoría: Requerida, selección de lista

### 📱 Responsividad
- Tabla adaptable en móviles
- Formularios optimizados para pantallas pequeñas
- Menús colapsables

## Próximos Pasos Sugeridos

1. **Tests**: Implementar tests unitarios y de integración
2. **Paginación**: Agregar paginación en la tabla de items
3. **Exportación**: Funcionalidad para exportar datos
4. **Jerarquía**: Visualización de items padre-hijo
5. **Búsqueda Avanzada**: Filtros adicionales por fecha, estado, etc.
6. **Drag & Drop**: Reordenamiento de items
7. **Bulk Operations**: Operaciones en lote (activar/desactivar múltiples)

## Notas Técnicas

- Utiliza Angular Signals para gestión de estado reactivo
- Compatible con Angular 17+
- Requiere Angular Material
- Integración completa con el sistema de autenticación
- Manejo de errores centralizado
- Estilos consistentes con el design system de la app
