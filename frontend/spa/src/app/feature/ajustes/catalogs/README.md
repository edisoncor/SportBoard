# CRUD de Categorías - SportBoard

Este módulo proporciona una interfaz completa para la gestión CRUD (Crear, Leer, Actualizar, Eliminar) de categorías en el sistema SportBoard.

## Características Principales

### ✅ **Funcionalidades Implementadas**

- **Listado de categorías** con tabla interactiva
- **Creación de nuevas categorías** mediante diálogo modal
- **Edición de categorías existentes** con validación
- **Eliminación segura** con confirmación
- **Activar/Desactivar categorías** sin eliminar
- **Filtrado avanzado** por texto, estado y nivel
- **Búsqueda en tiempo real** por nombre, código o descripción
- **Jerarquía de categorías** con soporte para categorías padre
- **Interfaz responsive** que se adapta a móviles

### 🎨 **Componentes**

#### 1. `CategoriesComponent`
- **Ubicación**: `src/app/feature/ajustes/catalogs/categories.component.ts`
- **Responsabilidad**: Componente principal que maneja el listado y operaciones CRUD
- **Características**:
  - Tabla con ordenamiento y filtros
  - Acciones rápidas (editar, activar/desactivar, eliminar)
  - Indicadores visuales de estado y nivel jerárquico
  - Manejo de estados de carga y error

#### 2. `CategoryDialogComponent`
- **Ubicación**: `src/app/feature/ajustes/catalogs/category-dialog.component.ts`
- **Responsabilidad**: Diálogo modal para crear/editar categorías
- **Características**:
  - Formulario reactivo con validaciones
  - Selección de categoría padre basada en nivel
  - Generación automática de códigos
  - Previsualización de cambios

#### 3. `ConfirmDialogComponent`
- **Ubicación**: `src/app/shared/components/confirm-dialog.component.ts`
- **Responsabilidad**: Diálogo de confirmación reutilizable
- **Características**:
  - Diferentes tipos (info, warning, danger)
  - Personalizable según el contexto
  - Responsive y accesible

### 🛣️ **Navegación**

La gestión de categorías está integrada en la sección de ajustes:

```
/ajustes/categorias
```

Accesible desde la pestaña "Administración" en Ajustes → Gestionar Categorías

### 📋 **Campos de Categoría**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `name` | string | ✅ | Nombre descriptivo de la categoría |
| `code` | string | ✅ | Código único (MAYÚSCULAS_CON_GUIONES) |
| `description` | string | ❌ | Descripción detallada |
| `level` | number | ✅ | Nivel jerárquico (0-3) |
| `parentCatalogId` | number | ❌ | ID de categoría padre |
| `isActive` | boolean | ✅ | Estado activo/inactivo |

### 🔍 **Filtros Disponibles**

1. **Búsqueda por texto**: Busca en nombre, código y descripción
2. **Filtro por estado**: Todos, Activos, Inactivos
3. **Filtro por nivel**: Todos los niveles, Nivel 0-3
4. **Limpiar filtros**: Botón para resetear todos los filtros

### 🎯 **Validaciones**

- **Nombre**: Mínimo 2 caracteres
- **Código**: Solo letras mayúsculas, números y guiones bajos
- **Nivel**: Entre 0 y 3
- **Categoría padre**: Solo categorías de nivel inferior y activas

### 🔧 **Acciones Disponibles**

| Acción | Descripción | Icono |
|--------|-------------|-------|
| **Editar** | Abre diálogo de edición | ✏️ |
| **Activar/Desactivar** | Cambia el estado sin eliminar | 🔄 |
| **Eliminar** | Elimina definitivamente con confirmación | 🗑️ |

### 📱 **Responsive Design**

- **Desktop**: Tabla completa con todas las columnas
- **Tablet**: Ajuste de espaciado y botones más grandes
- **Mobile**: Tabla adaptada y filtros en columna

### 🔒 **Manejo de Errores**

- Validación en tiempo real del formulario
- Mensajes de error específicos según el tipo de fallo
- Notificaciones toast para operaciones exitosas/fallidas
- Manejo de errores de red con reintentos automáticos

### 🚀 **Uso del Componente**

```typescript
// En las rutas (ya configurado)
{ 
  path: 'ajustes/categorias', 
  loadComponent: () => import('./feature/ajustes/catalogs/categories.component')
    .then(m => m.CategoriesComponent) 
}

// Navegación programática
this.router.navigate(['/ajustes/categorias']);
```

### 📦 **Dependencias**

- **Angular Material**: Componentes UI
- **RxJS**: Programación reactiva
- **Angular Forms**: Formularios reactivos
- **CatalogService**: Servicio de datos
- **Category Models**: Modelos TypeScript

### 🔄 **Estados del Componente**

1. **Cargando**: Spinner mientras se obtienen datos
2. **Sin datos**: Mensaje cuando no hay categorías
3. **Con datos**: Tabla con categorías y filtros
4. **Error**: Mensaje de error si falla la carga

### 🎨 **Personalización**

Los estilos están organizados en:
- Variables CSS para colores y espaciado
- Clases modulares para fácil personalización
- Temas compatibles con Angular Material
- Iconografía consistente con Material Design

### 🔮 **Futuras Mejoras**

- Drag & drop para reordenar categorías
- Importar/Exportar categorías en CSV/JSON
- Historial de cambios y auditoría
- Categorías favoritas y más utilizadas
- Vista en árbol jerárquico
- Búsqueda avanzada con filtros combinados
