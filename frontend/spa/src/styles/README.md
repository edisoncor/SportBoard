# Guía de Estilos SCSS - SportBoard SPA

## Estructura de Archivos

La estructura de estilos está organizada siguiendo las mejores prácticas de SCSS:

```
src/styles/
├── variables.scss      # Variables globales (colores, fuentes, espaciado)
├── mixins.scss        # Mixins reutilizables
├── utilities.scss     # Clases de utilidad
└── README.md         # Esta documentación
```

## Archivos Principales

### 1. `variables.scss`
Contiene todas las variables globales del proyecto organizadas por categorías:

- **Colores**: Paleta temática deportiva, estados, grises
- **Tipografía**: Familias de fuentes, tamaños, pesos
- **Layout**: Dimensiones de header, sidebar, footer
- **Breakpoints**: Puntos de quiebre responsive
- **Espaciado**: Sistema de spacing consistente
- **Bordes y sombras**: Valores para border-radius y box-shadow
- **Transiciones**: Duraciones y efectos

### 2. `mixins.scss`
Mixins reutilizables para patrones comunes:

- **Centrado**: `@include mixins.center-flex`
- **Botones**: `@include mixins.button-primary`, `@include mixins.button-secondary`
- **Cards**: `@include mixins.card`
- **Responsive**: `@include mixins.respond-to(md)`
- **Animaciones**: `@include mixins.fade-in`, `@include mixins.slide-in`
- **Formularios**: `@include mixins.input-base`
- **Efectos especiales**: `@include mixins.glass-effect`, `@include mixins.tooltip`

### 3. `utilities.scss`
Clases de utilidad para estilos rápidos:

- **Display**: `.d-flex`, `.d-block`, `.d-none`
- **Flexbox**: `.justify-content-center`, `.align-items-center`
- **Espaciado**: `.m-4`, `.p-2`, `.mt-6`
- **Texto**: `.text-center`, `.font-weight-bold`
- **Colores**: `.text-primary`, `.bg-secondary`
- **Responsive**: `.d-md-block`, `.d-xs-none`

## Uso de Variables

### Importar Variables
```scss
@use '../styles/variables' as vars;

.mi-componente {
    color: vars.$primary-color;
    padding: vars.$spacing-4;
    border-radius: vars.$border-radius-md;
}
```

### Variables más Utilizadas

#### Colores
- `vars.$primary-color`: #1e88e5 (Azul principal)
- `vars.$secondary-color`: #26a69a (Verde azulado)
- `vars.$success-color`: #43a047 (Verde éxito)
- `vars.$error-color`: #e53935 (Rojo error)

#### Espaciado
- `vars.$spacing-1`: 0.25rem (4px)
- `vars.$spacing-2`: 0.5rem (8px)
- `vars.$spacing-4`: 1rem (16px)
- `vars.$spacing-6`: 1.5rem (24px)

#### Tipografía
- `vars.$font-family-primary`: 'Montserrat', 'Roboto', sans-serif
- `vars.$font-size-base`: 1rem (16px)
- `vars.$font-weight-medium`: 500

## Uso de Mixins

```scss
@use '../styles/mixins' as mixins;

.mi-boton {
    @include mixins.button-primary;
}

.mi-card {
    @include mixins.card;
    
    &:hover {
        @include mixins.interactive-hover;
    }
}

.mi-input {
    @include mixins.input-base;
}

// Responsive
.mi-componente {
    @include mixins.respond-to(md) {
        display: flex;
    }
}
```

## Clases de Utilidad

### Espaciado
```html
<div class="p-4 m-2">           <!-- padding: 1rem, margin: 0.5rem -->
<div class="mt-6 mb-4">         <!-- margin-top: 1.5rem, margin-bottom: 1rem -->
```

### Layout
```html
<div class="d-flex justify-content-center align-items-center">
<div class="d-none d-md-block">  <!-- Oculto en móvil, visible en desktop -->
```

### Colores
```html
<span class="text-primary">Texto azul</span>
<div class="bg-success text-white">Fondo verde, texto blanco</div>
```

## Breakpoints Responsive

- **xs**: 0px (móviles pequeños)
- **sm**: 576px (móviles)
- **md**: 768px (tablets)
- **lg**: 992px (laptops)
- **xl**: 1200px (desktops)
- **xxl**: 1400px (desktops grandes)

## Buenas Prácticas

### 1. Usar Variables
❌ **Mal:**
```scss
.mi-componente {
    color: #1e88e5;
    padding: 16px;
}
```

✅ **Bien:**
```scss
.mi-componente {
    color: vars.$primary-color;
    padding: vars.$spacing-4;
}
```

### 2. Usar Mixins para Patrones Repetitivos
❌ **Mal:**
```scss
.boton-1 {
    cursor: pointer;
    border: none;
    border-radius: 8px;
    padding: 0.5rem 1rem;
    background-color: #1e88e5;
    color: white;
}

.boton-2 {
    cursor: pointer;
    border: none;
    border-radius: 8px;
    padding: 0.5rem 1rem;
    background-color: #26a69a;
    color: white;
}
```

✅ **Bien:**
```scss
.boton-1 {
    @include mixins.button-primary;
}

.boton-2 {
    @include mixins.button-secondary;
}
```

### 3. Estructura de Componentes
```scss
@use '../styles/variables' as vars;
@use '../styles/mixins' as mixins;

.mi-componente {
    // Propiedades base
    display: flex;
    padding: vars.$spacing-4;
    
    // Estados
    &:hover {
        @include mixins.interactive-hover;
    }
    
    &.is-active {
        background-color: vars.$primary-color;
    }
    
    // Elementos hijos
    &__titulo {
        font-size: vars.$font-size-lg;
        font-weight: vars.$font-weight-semibold;
    }
    
    &__contenido {
        color: vars.$font-secondary-color;
    }
    
    // Responsive
    @include mixins.respond-to(md) {
        flex-direction: row;
    }
}
```

### 4. Nomenclatura BEM
Usar la metodología BEM para nombrar clases:

```scss
.componente {}           // Bloque
.componente__elemento {} // Elemento
.componente--modificador {} // Modificador
```

### 5. Orden de Propiedades
1. Includes/mixins
2. Propiedades de posicionamiento
3. Propiedades de box model
4. Propiedades visuales
5. Propiedades de tipografía
6. Estados (:hover, :focus, etc.)
7. Pseudo-elementos (::before, ::after)
8. Media queries

## Migración de Estilos Existentes

Para migrar componentes existentes:

1. **Identificar variables hardcodeadas** y reemplazarlas por variables centralizadas
2. **Buscar patrones repetitivos** y crear mixins
3. **Usar clases de utilidad** para estilos simples
4. **Aplicar nomenclatura BEM** consistente

## Recursos Adicionales

- [Documentación de Sass](https://sass-lang.com/documentation)
- [Metodología BEM](http://getbem.com/)
- [SCSS Best Practices](https://sass-guidelin.es/)
