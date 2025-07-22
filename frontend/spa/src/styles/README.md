# Guía de Estilos SCSS - SportBoard SPA

## Estructura de Archivos

La estructura de estilos está organizada siguiendo las mejores prácticas de SCSS:

```
src/styles/
├── index.scss            # Archivo principal de estilos
├── variables.scss        # Variables globales (colores, fuentes, espaciado)
├── mixins.scss          # Mixins reutilizables
├── utilities.scss       # Clases de utilidad
├── dialog-styles.scss   # Estilos específicos para diálogos
├── paginator-styles.scss # Estilos para paginadores
├── examples/            # Ejemplos de implementación
│   └── equipos-improved.scss
└── README.md           # Esta documentación
```

## Archivos Principales

### 1. `index.scss`
Archivo principal que importa todos los módulos de estilos y configura:

- **Reset CSS**: Normalización de estilos base
- **Fuentes**: Importación de Google Fonts (Montserrat, Roboto, Material Icons)
- **Configuración global**: HTML, body y elementos base
- **Importaciones**: Todos los archivos de variables, mixins y utilidades

### 2. `variables.scss`
Contiene todas las variables globales del proyecto organizadas por categorías:

- **Colores**: Paleta temática deportiva, estados, grises, backgrounds
- **Tipografía**: Familias de fuentes, tamaños, pesos, alturas de línea
- **Layout**: Dimensiones de header, sidebar, footer, contenedores
- **Breakpoints**: Puntos de quiebre responsive (xs, sm, md, lg, xl, xxl)
- **Z-index**: Capas de superposición organizadas
- **Espaciado**: Sistema de spacing consistente (0-20)
- **Bordes y sombras**: Border-radius y box-shadow variables
- **Transiciones**: Duraciones y efectos de transición
- **Componentes**: Variables específicas para botones, formularios, cards, modales

### 3. `mixins.scss`
Mixins reutilizables para patrones comunes:

- **Layout**: `@include mixins.center-flex`
- **Botones**: `@include mixins.button-primary`, `@include mixins.button-secondary`, `@include mixins.button-base`
- **Cards**: `@include mixins.card`
- **Responsive**: `@include mixins.respond-to(md)`
- **Animaciones**: `@include mixins.fade-in`, `@include mixins.slide-in(up|down|left|right)`
- **Formularios**: `@include mixins.input-base`
- **Estados**: `@include mixins.interactive-hover`, `@include mixins.focus-outline`, `@include mixins.disabled-state`
- **Efectos especiales**: `@include mixins.glass-effect`, `@include mixins.tooltip(top|bottom|left|right)`
- **Utilidades**: `@include mixins.text-truncate`, `@include mixins.hide-scrollbar`, `@include mixins.loading-spinner`
- **Layout avanzado**: `@include mixins.gradient`, `@include mixins.aspect-ratio`, `@include mixins.overlay`

### 4. `utilities.scss`
Clases de utilidad para estilos rápidos:

- **Display**: `.d-flex`, `.d-block`, `.d-none`, `.d-grid`, `.d-inline-flex`
- **Flexbox**: `.justify-content-center`, `.align-items-center`, `.flex-column`, `.flex-wrap`
- **Position**: `.position-relative`, `.position-absolute`, `.position-fixed`, `.position-sticky`
- **Espaciado**: `.m-4`, `.p-2`, `.mt-6`, `.mb-auto`, `.ml-4`, `.mr-2`
- **Texto**: `.text-center`, `.font-weight-bold`, `.text-uppercase`, `.text-decoration-none`
- **Colores**: `.text-primary`, `.bg-secondary`, `.text-muted`, `.bg-transparent`
- **Bordes**: `.border`, `.rounded`, `.rounded-full`, `.border-0`
- **Sombras**: `.shadow-md`, `.shadow-lg`, `.shadow-none`
- **Dimensiones**: `.w-100`, `.h-50`, `.min-h-100vh`
- **Overflow**: `.overflow-hidden`, `.overflow-auto`
- **Responsive**: `.d-md-block`, `.d-xs-none`, `.d-lg-flex`
- **Interacción**: `.cursor-pointer`, `.user-select-none`, `.pointer-events-none`

### 5. `dialog-styles.scss`
Estilos específicos para componentes de diálogo de Angular Material:

- **Contenedor**: Personalización del `.mat-mdc-dialog-container`
- **Animaciones**: Entrada suave con `dialogSlideIn`
- **Backdrop**: Efecto de desenfoque y transparencia
- **Contenido**: Padding, scroll y tipografía optimizada

### 6. `paginator-styles.scss`
Archivo reservado para estilos de paginadores (actualmente vacío).

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

#### Colores principales
- `vars.$primary-color`: #1e88e5 (Azul principal)
- `vars.$secondary-color`: #26a69a (Verde azulado)
- `vars.$accent-color`: #ff5722 (Naranja energético)
- `vars.$info-color`: #2196f3 (Azul información)

#### Estados
- `vars.$success-color`: #43a047 (Verde éxito)
- `vars.$warning-color`: #ffb300 (Amarillo advertencia)
- `vars.$error-color`: #e53935 (Rojo error)
- `vars.$danger-color`: #e53935 (Alias para error)

#### Grises y neutros
- `vars.$white`: #ffffff
- `vars.$black`: #000000
- `vars.$light-gray`: #eceff1
- `vars.$medium-gray`: #90a4ae
- `vars.$dark-gray`: #37474f
- `vars.$darker-gray`: #263238

#### Backgrounds
- `vars.$background-color`: #f8f9fa (Fondo principal)
- `vars.$background-light`: #ffffff (Fondo claro)
- `vars.$background-dark`: #1a1a1a (Fondo oscuro)
- `vars.$background-gradient`: linear-gradient(135deg, #667eea 0%, #764ba2 100%)

#### Texto
- `vars.$font-color`: #2c3e50 (Color principal)
- `vars.$font-secondary-color`: #546e7a (Color secundario)
- `vars.$font-tertiary-color`: #90a4ae (Color terciario)
- `vars.$font-muted`: #a0aec0 (Color atenuado)

#### Espaciado (sistema de 0-20)
- `vars.$spacing-0`: 0
- `vars.$spacing-1`: 0.25rem (4px)
- `vars.$spacing-2`: 0.5rem (8px)
- `vars.$spacing-3`: 0.75rem (12px)
- `vars.$spacing-4`: 1rem (16px)
- `vars.$spacing-5`: 1.25rem (20px)
- `vars.$spacing-6`: 1.5rem (24px)
- `vars.$spacing-8`: 2rem (32px)
- `vars.$spacing-10`: 2.5rem (40px)
- `vars.$spacing-12`: 3rem (48px)
- `vars.$spacing-16`: 4rem (64px)
- `vars.$spacing-20`: 5rem (80px)

#### Tipografía
- `vars.$font-family-primary`: 'Montserrat', 'Roboto', sans-serif
- `vars.$font-family-secondary`: 'Roboto', sans-serif
- `vars.$font-family-monospace`: 'Monaco', 'Consolas', 'Courier New', monospace

#### Tamaños de fuente
- `vars.$font-size-xs`: 0.75rem (12px)
- `vars.$font-size-sm`: 0.875rem (14px)
- `vars.$font-size-base`: 1rem (16px)
- `vars.$font-size-md`: 1.125rem (18px)
- `vars.$font-size-lg`: 1.25rem (20px)
- `vars.$font-size-xl`: 1.5rem (24px)
- `vars.$font-size-2xl`: 1.875rem (30px)
- `vars.$font-size-3xl`: 2.25rem (36px)
- `vars.$font-size-4xl`: 3rem (48px)

#### Peso de fuente
- `vars.$font-weight-light`: 300
- `vars.$font-weight-normal`: 400
- `vars.$font-weight-medium`: 500
- `vars.$font-weight-semibold`: 600
- `vars.$font-weight-bold`: 700
- `vars.$font-weight-extrabold`: 800

#### Layout
- `vars.$header-height`: 64px
- `vars.$sidebar-width`: 250px
- `vars.$sidebar-width-collapsed`: 70px
- `vars.$footer-height`: 50px
- `vars.$bottom-nav-height`: 56px

#### Contenedores
- `vars.$container-max-width`: 1400px
- `vars.$container-lg`: 1200px
- `vars.$container-md`: 992px
- `vars.$container-sm`: 768px

#### Border Radius
- `vars.$border-radius-none`: 0
- `vars.$border-radius-sm`: 0.25rem (4px)
- `vars.$border-radius-md`: 0.5rem (8px)
- `vars.$border-radius-lg`: 0.75rem (12px)
- `vars.$border-radius-xl`: 1rem (16px)
- `vars.$border-radius-2xl`: 1.25rem (20px)
- `vars.$border-radius-full`: 50%

#### Sombras
- `vars.$shadow-none`: none
- `vars.$shadow-xs`: 0 1px 2px rgba(0, 0, 0, 0.05)
- `vars.$shadow-sm`: 0 2px 4px rgba(0, 0, 0, 0.05)
- `vars.$shadow-md`: 0 4px 12px rgba(0, 0, 0, 0.05)
- `vars.$shadow-lg`: 0 8px 16px rgba(0, 0, 0, 0.1)
- `vars.$shadow-xl`: 0 12px 24px rgba(0, 0, 0, 0.15)
- `vars.$shadow-2xl`: 0 25px 50px rgba(0, 0, 0, 0.25)

#### Z-index
- `vars.$z-index-dropdown`: 1000
- `vars.$z-index-sticky`: 1020
- `vars.$z-index-fixed`: 1030
- `vars.$z-index-modal-backdrop`: 1040
- `vars.$z-index-modal`: 1050
- `vars.$z-index-popover`: 1060
- `vars.$z-index-tooltip`: 1070
- `vars.$z-index-notification`: 1080

#### Transiciones
- `vars.$transition-duration-fast`: 0.15s
- `vars.$transition-duration-normal`: 0.3s
- `vars.$transition-duration-slow`: 0.5s
- `vars.$transition-fast`: 0.15s ease
- `vars.$transition-normal`: 0.3s ease
- `vars.$transition-all`: all 0.3s ease
- `vars.$transition-colors`: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease

## Uso de Mixins

```scss
@use '../styles/mixins' as mixins;

// Botones
.mi-boton-primario {
    @include mixins.button-primary;
}

.mi-boton-secundario {
    @include mixins.button-secondary;
}

.mi-boton-personalizado {
    @include mixins.button-base;
    background-color: vars.$accent-color;
}

// Cards y containers
.mi-card {
    @include mixins.card;
    
    &:hover {
        @include mixins.interactive-hover;
    }
}

// Formularios
.mi-input {
    @include mixins.input-base;
    
    &:focus {
        @include mixins.focus-outline;
    }
}

// Layout y centrado
.contenedor-centrado {
    @include mixins.center-flex;
}

// Responsive
.mi-componente {
    @include mixins.respond-to(md) {
        display: flex;
        flex-direction: row;
    }
    
    @include mixins.respond-to(lg) {
        padding: vars.$spacing-8;
    }
}

// Animaciones
.elemento-animado {
    @include mixins.fade-in(0.5s);
    
    &.slide-up {
        @include mixins.slide-in(0.3s, up);
    }
}

// Efectos especiales
.efecto-vidrio {
    @include mixins.glass-effect;
}

.con-tooltip {
    @include mixins.tooltip(top);
}

.con-gradiente {
    @include mixins.gradient(to right, vars.$primary-color, vars.$secondary-color);
}

// Loading y estados
.cargando {
    @include mixins.loading-spinner(24px, vars.$primary-color);
}

.deshabilitado {
    @include mixins.disabled-state;
}

// Utilidades de texto
.texto-truncado {
    @include mixins.text-truncate;
}

.sin-scrollbar {
    @include mixins.hide-scrollbar;
}
```

## Clases de Utilidad

### Display y Layout
```html
<!-- Display básico -->
<div class="d-flex justify-content-center align-items-center">
<div class="d-grid">
<div class="d-none d-md-block">  <!-- Oculto en móvil, visible en desktop -->

<!-- Flexbox avanzado -->
<div class="d-flex flex-column flex-wrap">
<div class="d-flex justify-content-between align-items-start">
<div class="flex-fill">  <!-- Toma todo el espacio disponible -->

<!-- Position -->
<div class="position-relative">
<div class="position-absolute">
<div class="position-fixed">
<div class="position-sticky">
```

### Espaciado Completo
```html
<!-- Margin -->
<div class="m-0">           <!-- margin: 0 -->
<div class="m-4">           <!-- margin: 1rem -->
<div class="mt-6 mb-4">     <!-- margin-top: 1.5rem, margin-bottom: 1rem -->
<div class="ml-auto mr-2">  <!-- margin-left: auto, margin-right: 0.5rem -->

<!-- Padding -->
<div class="p-4">           <!-- padding: 1rem -->
<div class="pt-8 pb-6">     <!-- padding-top: 2rem, padding-bottom: 1.5rem -->
<div class="pl-0 pr-12">    <!-- padding-left: 0, padding-right: 3rem -->
```

### Tipografía y Texto
```html
<!-- Alineación -->
<span class="text-center">Texto centrado</span>
<span class="text-right">Texto a la derecha</span>
<span class="text-justify">Texto justificado</span>

<!-- Transformación -->
<span class="text-uppercase">MAYÚSCULAS</span>
<span class="text-lowercase">minúsculas</span>
<span class="text-capitalize">Primera Letra</span>

<!-- Peso y tamaño -->
<span class="font-weight-bold font-size-lg">Texto grande y bold</span>
<span class="font-weight-light font-size-sm">Texto pequeño y ligero</span>

<!-- Decoración -->
<a class="text-decoration-none">Sin subrayado</a>
<span class="text-decoration-underline">Con subrayado</span>
```

### Colores Completos
```html
<!-- Colores de texto -->
<span class="text-primary">Texto azul principal</span>
<span class="text-secondary">Texto verde azulado</span>
<span class="text-accent">Texto naranja</span>
<span class="text-success">Texto verde éxito</span>
<span class="text-warning">Texto amarillo advertencia</span>
<span class="text-error">Texto rojo error</span>
<span class="text-muted">Texto atenuado</span>
<span class="text-white">Texto blanco</span>
<span class="text-dark">Texto oscuro</span>

<!-- Colores de fondo -->
<div class="bg-primary text-white">Fondo azul, texto blanco</div>
<div class="bg-success text-white">Fondo verde, texto blanco</div>
<div class="bg-light">Fondo gris claro</div>
<div class="bg-transparent">Fondo transparente</div>
```

### Bordes y Sombras
```html
<!-- Bordes -->
<div class="border">Borde completo</div>
<div class="border-top border-bottom">Solo borde superior e inferior</div>
<div class="border-0">Sin borde</div>

<!-- Border radius -->
<div class="rounded">Border radius medio</div>
<div class="rounded-sm">Border radius pequeño</div>
<div class="rounded-lg">Border radius grande</div>
<div class="rounded-full">Border radius circular</div>
<div class="rounded-0">Sin border radius</div>

<!-- Sombras -->
<div class="shadow-sm">Sombra pequeña</div>
<div class="shadow-md">Sombra media</div>
<div class="shadow-lg">Sombra grande</div>
<div class="shadow-xl">Sombra extra grande</div>
<div class="shadow-none">Sin sombra</div>
```

### Dimensiones
```html
<!-- Ancho -->
<div class="w-25">25% de ancho</div>
<div class="w-50">50% de ancho</div>
<div class="w-75">75% de ancho</div>
<div class="w-100">100% de ancho</div>
<div class="w-auto">Ancho automático</div>

<!-- Alto -->
<div class="h-25">25% de alto</div>
<div class="h-50">50% de alto</div>
<div class="h-100">100% de alto</div>
<div class="min-h-100vh">Altura mínima de viewport</div>
```

### Overflow
```html
<div class="overflow-hidden">Overflow oculto</div>
<div class="overflow-auto">Overflow automático</div>
<div class="overflow-x-hidden">Overflow horizontal oculto</div>
<div class="overflow-y-scroll">Overflow vertical con scroll</div>
```

### Responsive
```html
<!-- Display responsive -->
<div class="d-none d-sm-block d-md-flex d-lg-grid">
<div class="d-xs-none d-md-block">  <!-- Oculto en extra small, visible desde medium -->

<!-- Comportamiento por breakpoint -->
<div class="d-block d-md-flex d-xl-grid">
```

### Interacción y Cursor
```html
<div class="cursor-pointer">Cursor de puntero</div>
<div class="cursor-not-allowed">Cursor no permitido</div>
<div class="user-select-none">Texto no seleccionable</div>
<div class="pointer-events-none">Sin eventos de puntero</div>
```

## Breakpoints Responsive

El sistema responsive utiliza los siguientes breakpoints:

- **xs**: 0px (móviles extra pequeños) - `max-width: 575px`
- **sm**: 576px (móviles) - `min-width: 576px`
- **md**: 768px (tablets) - `min-width: 768px`
- **lg**: 992px (laptops) - `min-width: 992px`
- **xl**: 1200px (desktops) - `min-width: 1200px`
- **xxl**: 1400px (desktops grandes) - `min-width: 1400px`

### Uso con Mixins
```scss
.mi-componente {
    // Móviles (xs)
    padding: vars.$spacing-2;
    
    // Tablets y arriba (md+)
    @include mixins.respond-to(md) {
        padding: vars.$spacing-4;
        display: flex;
    }
    
    // Laptops y arriba (lg+)
    @include mixins.respond-to(lg) {
        padding: vars.$spacing-6;
        flex-direction: row;
    }
}
```

### Uso con Clases de Utilidad
```html
<!-- Visible solo en móviles -->
<div class="d-block d-sm-none">Solo móviles</div>

<!-- Oculto en móviles, visible desde tablets -->
<div class="d-none d-md-block">Tablets en adelante</div>

<!-- Flexible según el tamaño -->
<div class="d-block d-md-flex d-lg-grid">
    <!-- Block en móviles, flex en tablets, grid en laptops -->
</div>
```

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
.componente {}              // Bloque
.componente__elemento {}    // Elemento
.componente--modificador {} // Modificador
```

**Ejemplos prácticos:**
```scss
// Bloque principal
.tarjeta-equipo {
    @include mixins.card;
    
    // Elementos
    &__imagen {
        width: 100%;
        border-radius: vars.$border-radius-md;
    }
    
    &__titulo {
        font-size: vars.$font-size-lg;
        font-weight: vars.$font-weight-bold;
    }
    
    &__descripcion {
        color: vars.$font-secondary-color;
    }
    
    &__acciones {
        display: flex;
        gap: vars.$spacing-2;
        margin-top: vars.$spacing-4;
    }
    
    // Modificadores
    &--destacada {
        border: 2px solid vars.$primary-color;
        box-shadow: vars.$shadow-lg;
    }
    
    &--compacta {
        padding: vars.$spacing-4;
        
        .tarjeta-equipo__titulo {
            font-size: vars.$font-size-base;
        }
    }
}
```

### 5. Estructura de Componentes Completa
```scss
@use '../styles/variables' as vars;
@use '../styles/mixins' as mixins;

.mi-componente {
    // 1. Includes/mixins
    @include mixins.card;
    
    // 2. Propiedades de posicionamiento
    position: relative;
    z-index: vars.$z-index-dropdown;
    
    // 3. Propiedades de box model
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: vars.$spacing-4;
    margin-bottom: vars.$spacing-4;
    
    // 4. Propiedades visuales
    background-color: vars.$white;
    border: 1px solid vars.$border-color;
    border-radius: vars.$border-radius-lg;
    box-shadow: vars.$shadow-md;
    
    // 5. Propiedades de tipografía
    font-family: vars.$font-family-primary;
    color: vars.$font-color;
    
    // 6. Estados (:hover, :focus, etc.)
    &:hover {
        @include mixins.interactive-hover;
        border-color: vars.$primary-color;
    }
    
    &:focus {
        @include mixins.focus-outline;
    }
    
    &.is-active {
        background-color: vars.$primary-color;
        color: vars.$white;
        border-color: vars.$primary-color;
    }
    
    &.is-disabled {
        @include mixins.disabled-state;
    }
    
    &.is-loading {
        position: relative;
        
        &::after {
            content: '';
            @include mixins.loading-spinner(20px, vars.$primary-color);
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }
    
    // 7. Pseudo-elementos (::before, ::after)
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
        background-color: vars.$primary-color;
        border-radius: vars.$border-radius-sm 0 0 vars.$border-radius-sm;
        opacity: 0;
        transition: vars.$transition-opacity;
    }
    
    &.is-featured::before {
        opacity: 1;
    }
    
    // 8. Elementos hijos (metodología BEM)
    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: vars.$spacing-4;
        padding-bottom: vars.$spacing-2;
        border-bottom: 1px solid vars.$border-color-light;
    }
    
    &__titulo {
        font-size: vars.$font-size-lg;
        font-weight: vars.$font-weight-semibold;
        color: vars.$dark-gray;
        margin: 0;
        
        @include mixins.text-truncate;
    }
    
    &__subtitulo {
        font-size: vars.$font-size-sm;
        color: vars.$font-tertiary-color;
        margin-top: vars.$spacing-1;
    }
    
    &__contenido {
        flex: 1;
        color: vars.$font-secondary-color;
        line-height: vars.$line-height-relaxed;
        margin-bottom: vars.$spacing-4;
    }
    
    &__acciones {
        display: flex;
        gap: vars.$spacing-2;
        justify-content: flex-end;
        align-items: center;
    }
    
    &__boton {
        @include mixins.button-base;
        
        &--primario {
            @include mixins.button-primary;
        }
        
        &--secundario {
            @include mixins.button-secondary;
        }
    }
    
    &__icono {
        width: 24px;
        height: 24px;
        color: vars.$font-tertiary-color;
        transition: vars.$transition-colors;
        
        &:hover {
            color: vars.$primary-color;
        }
    }
    
    // 9. Variantes (modificadores BEM)
    &--destacado {
        @include mixins.gradient(to right, vars.$primary-color, vars.$accent-color);
        color: vars.$white;
        border: none;
        
        .mi-componente__titulo,
        .mi-componente__contenido {
            color: vars.$white;
        }
    }
    
    &--compacto {
        padding: vars.$spacing-3;
        
        .mi-componente__titulo {
            font-size: vars.$font-size-base;
        }
        
        .mi-componente__header {
            margin-bottom: vars.$spacing-2;
        }
    }
    
    &--con-imagen {
        .mi-componente__header {
            background-size: cover;
            background-position: center;
            border-radius: vars.$border-radius-md;
            min-height: 120px;
            position: relative;
            
            &::after {
                @include mixins.overlay(rgba(vars.$black, 0.3));
                border-radius: vars.$border-radius-md;
            }
        }
        
        .mi-componente__titulo {
            position: relative;
            z-index: 2;
            color: vars.$white;
        }
    }
    
    // 10. Media queries responsive
    @include mixins.respond-to(xs) {
        padding: vars.$spacing-2;
        margin-bottom: vars.$spacing-2;
        
        .mi-componente__acciones {
            flex-direction: column;
            gap: vars.$spacing-1;
        }
        
        .mi-componente__boton {
            width: 100%;
        }
    }
    
    @include mixins.respond-to(md) {
        padding: vars.$spacing-6;
        
        .mi-componente__header {
            margin-bottom: vars.$spacing-6;
        }
        
        .mi-componente__acciones {
            flex-direction: row;
        }
    }
    
    @include mixins.respond-to(lg) {
        max-width: 500px;
        
        &--destacado {
            @include mixins.glass-effect;
        }
    }
}
```

### 6. Orden de Propiedades
1. **Includes/mixins** - `@include mixins.card;`
2. **Propiedades de posicionamiento** - `position`, `top`, `z-index`
3. **Propiedades de box model** - `display`, `width`, `padding`, `margin`
4. **Propiedades visuales** - `background`, `border`, `box-shadow`
5. **Propiedades de tipografía** - `font-family`, `font-size`, `color`
6. **Estados** - `:hover`, `:focus`, `:active`, `.is-active`
7. **Pseudo-elementos** - `::before`, `::after`
8. **Elementos hijos** - `&__elemento`
9. **Modificadores** - `&--modificador`
10. **Media queries** - `@include mixins.respond-to()`

## Componentes Específicos

### Diálogos y Modales

Los estilos para diálogos se encuentran en `dialog-styles.scss` y incluyen:

```scss
// Uso básico para diálogos personalizados
.mi-dialogo {
    @include mixins.card;
    border-radius: vars.$border-radius-lg;
    box-shadow: vars.$modal-shadow;
    padding: vars.$modal-padding;
    max-width: vars.$modal-max-width;
    
    // Animación de entrada
    animation: dialogSlideIn 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    
    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: vars.$spacing-4;
        padding-bottom: vars.$spacing-3;
        border-bottom: 1px solid vars.$border-color-light;
    }
    
    &__titulo {
        font-size: vars.$font-size-xl;
        font-weight: vars.$font-weight-semibold;
        color: vars.$dark-gray;
    }
    
    &__cerrar {
        @include mixins.button-base;
        width: 32px;
        height: 32px;
        border-radius: vars.$border-radius-full;
        background-color: transparent;
        
        &:hover {
            background-color: vars.$light-gray;
        }
    }
    
    &__contenido {
        margin-bottom: vars.$spacing-6;
        max-height: 70vh;
        overflow-y: auto;
    }
    
    &__acciones {
        display: flex;
        gap: vars.$spacing-3;
        justify-content: flex-end;
    }
}

@keyframes dialogSlideIn {
    from {
        opacity: 0;
        transform: translateY(-30px) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}
```

### Cards Deportivas

```scss
.tarjeta-deportiva {
    @include mixins.card;
    position: relative;
    overflow: hidden;
    
    &__imagen {
        width: 100%;
        height: 200px;
        object-fit: cover;
        border-radius: vars.$border-radius-md vars.$border-radius-md 0 0;
    }
    
    &__contenido {
        padding: vars.$spacing-4;
    }
    
    &__categoria {
        display: inline-block;
        padding: vars.$spacing-1 vars.$spacing-2;
        background-color: vars.$primary-color;
        color: vars.$white;
        font-size: vars.$font-size-xs;
        font-weight: vars.$font-weight-medium;
        border-radius: vars.$border-radius-sm;
        text-transform: uppercase;
        margin-bottom: vars.$spacing-2;
    }
    
    &__titulo {
        font-size: vars.$font-size-lg;
        font-weight: vars.$font-weight-semibold;
        color: vars.$dark-gray;
        margin-bottom: vars.$spacing-2;
        
        @include mixins.text-truncate;
    }
    
    &__estadisticas {
        display: flex;
        gap: vars.$spacing-4;
        margin-top: vars.$spacing-3;
    }
    
    &__estadistica {
        text-align: center;
        
        &-numero {
            display: block;
            font-size: vars.$font-size-xl;
            font-weight: vars.$font-weight-bold;
            color: vars.$primary-color;
        }
        
        &-label {
            font-size: vars.$font-size-xs;
            color: vars.$font-tertiary-color;
            text-transform: uppercase;
        }
    }
    
    // Estados
    &:hover {
        transform: translateY(-4px);
        box-shadow: vars.$shadow-xl;
        
        .tarjeta-deportiva__imagen {
            transform: scale(1.05);
        }
    }
    
    // Variantes
    &--ganador {
        border-top: 4px solid vars.$success-color;
        
        .tarjeta-deportiva__categoria {
            background-color: vars.$success-color;
        }
    }
    
    &--perdedor {
        border-top: 4px solid vars.$error-color;
        
        .tarjeta-deportiva__categoria {
            background-color: vars.$error-color;
        }
    }
}
```

### Formularios Deportivos

```scss
.formulario-deportivo {
    @include mixins.card;
    max-width: 600px;
    
    &__grupo {
        margin-bottom: vars.$spacing-4;
    }
    
    &__label {
        display: block;
        font-weight: vars.$font-weight-medium;
        color: vars.$dark-gray;
        margin-bottom: vars.$spacing-1;
    }
    
    &__input {
        @include mixins.input-base;
        width: 100%;
        
        &--error {
            border-color: vars.$error-color;
            box-shadow: 0 0 0 3px rgba(vars.$error-color, 0.1);
        }
        
        &--success {
            border-color: vars.$success-color;
            box-shadow: 0 0 0 3px rgba(vars.$success-color, 0.1);
        }
    }
    
    &__select {
        @include mixins.input-base;
        width: 100%;
        cursor: pointer;
    }
    
    &__textarea {
        @include mixins.input-base;
        width: 100%;
        min-height: 100px;
        resize: vertical;
    }
    
    &__mensaje {
        margin-top: vars.$spacing-1;
        font-size: vars.$font-size-sm;
        
        &--error {
            color: vars.$error-color;
        }
        
        &--success {
            color: vars.$success-color;
        }
        
        &--info {
            color: vars.$info-color;
        }
    }
    
    &__acciones {
        display: flex;
        gap: vars.$spacing-3;
        justify-content: flex-end;
        margin-top: vars.$spacing-6;
        padding-top: vars.$spacing-4;
        border-top: 1px solid vars.$border-color-light;
    }
}
```

## Migración de Estilos Existentes

### Pasos para Migrar Componentes

1. **Identificar variables hardcodeadas** y reemplazarlas por variables centralizadas:
   ```scss
   // ❌ Antes
   .mi-componente {
       color: #1e88e5;
       padding: 16px;
       border-radius: 8px;
   }
   
   // ✅ Después
   .mi-componente {
       color: vars.$primary-color;
       padding: vars.$spacing-4;
       border-radius: vars.$border-radius-md;
   }
   ```

2. **Buscar patrones repetitivos** y crear mixins:
   ```scss
   // ❌ Antes (repetitivo)
   .boton-1, .boton-2, .boton-3 {
       cursor: pointer;
       border: none;
       border-radius: 8px;
       padding: 8px 16px;
       transition: all 0.3s ease;
   }
   
   // ✅ Después (usando mixin)
   .boton-1, .boton-2, .boton-3 {
       @include mixins.button-base;
   }
   ```

3. **Usar clases de utilidad** para estilos simples:
   ```html
   <!-- ❌ Antes (CSS personalizado para cada caso) -->
   <div class="mi-contenedor-centrado"></div>
   
   <!-- ✅ Después (clases de utilidad) -->
   <div class="d-flex justify-content-center align-items-center"></div>
   ```

4. **Aplicar nomenclatura BEM** consistente:
   ```scss
   // ❌ Antes
   .card-title { }
   .cardContent { }
   .card_button { }
   
   // ✅ Después (BEM consistente)
   .card__titulo { }
   .card__contenido { }
   .card__boton { }
   ```

### Lista de Verificación para Migración

- [ ] Reemplazar valores hardcodeados por variables
- [ ] Identificar patrones repetitivos para crear mixins
- [ ] Aplicar nomenclatura BEM consistente
- [ ] Usar clases de utilidad donde sea apropiado
- [ ] Implementar responsive design con mixins
- [ ] Añadir estados de hover, focus y active
- [ ] Optimizar para accesibilidad
- [ ] Probar en diferentes tamaños de pantalla

## Herramientas y Extensiones Recomendadas

### Extensiones de VS Code
- **SCSS IntelliSense**: Autocompletado para variables y mixins
- **Live Sass Compiler**: Compilación automática de SCSS
- **Prettier**: Formateo automático de código
- **Bracket Pair Colorizer**: Mejor visualización de anidamiento

### Comandos Útiles

```bash
# Compilar SCSS manualmente
npx sass src/styles/index.scss dist/styles.css

# Watch mode para desarrollo
npx sass --watch src/styles:dist/styles

# Minificar para producción
npx sass src/styles/index.scss dist/styles.min.css --style=compressed
```

## Troubleshooting

### Problemas Comunes

1. **Error de importación de variables**:
   ```scss
   // ❌ Error
   @import 'variables';
   
   // ✅ Correcto
   @use '../styles/variables' as vars;
   ```

2. **Variables no definidas**:
   ```scss
   // Verificar que la variable existe en variables.scss
   // y que está siendo importada correctamente
   @use '../styles/variables' as vars;
   
   .mi-clase {
       color: vars.$primary-color; // Verificar el nombre exacto
   }
   ```

3. **Especificidad de CSS**:
   ```scss
   // Si los estilos no se aplican, aumentar especificidad
   .mi-componente.mi-componente {
       color: vars.$primary-color !important;
   }
   ```

4. **Orden de importación**:
   ```scss
   // Importar en el orden correcto
   @use './variables';   // Primero las variables
   @use './mixins';      // Luego los mixins
   @use './utilities';   // Finalmente las utilidades
   ```

## Performance y Optimización

### Mejores Prácticas para Performance

1. **Usar variables CSS para propiedades dinámicas**:
   ```scss
   .mi-componente {
       --color-dinamico: #{vars.$primary-color};
       color: var(--color-dinamico);
   }
   ```

2. **Minimizar la anidación** (máximo 3 niveles):
   ```scss
   // ❌ Demasiado anidado
   .componente {
       .header {
           .title {
               .icon {
                   color: red; // 4 niveles
               }
           }
       }
   }
   
   // ✅ Mejor estructura
   .componente { }
   .componente__header { }
   .componente__titulo { }
   .componente__icono { }
   ```

3. **Usar !default en variables** para permitir personalización:
   ```scss
   $primary-color: #1e88e5 !default;
   ```

4. **Optimizar selectores** para mejor rendimiento:
   ```scss
   // ❌ Selector complejo
   .container .sidebar .menu li a:hover
   
   // ✅ Selector optimizado
   .menu__enlace:hover
   ```

## Recursos Adicionales

### Documentación Oficial
- [Documentación de Sass](https://sass-lang.com/documentation)
- [Guía de Sass](https://sass-guidelin.es/)
- [Metodología BEM](http://getbem.com/)

### Herramientas Online
- [Sass Playground](https://www.sassmeister.com/) - Probar código SCSS online
- [CSS Grid Generator](https://cssgrid-generator.netlify.app/) - Generar layouts con Grid
- [Flexbox Froggy](https://flexboxfroggy.com/) - Aprender Flexbox jugando

### Librerías Complementarias
- [Normalize.css](https://necolas.github.io/normalize.css/) - Reset CSS moderno
- [Animate.css](https://animate.style/) - Animaciones CSS predefinidas
- [Material Design](https://material.io/design) - Guía de diseño para componentes

### Validación y Testing
- [W3C CSS Validator](https://jigsaw.w3.org/css-validator/) - Validar CSS
- [Can I Use](https://caniuse.com/) - Compatibilidad de navegadores
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) - Verificar contraste para accesibilidad

### Comunidad y Soporte
- [Stack Overflow - SCSS](https://stackoverflow.com/questions/tagged/scss)
- [Reddit - r/scss](https://www.reddit.com/r/scss/)
- [Sass Community GitHub](https://github.com/sass)

---

## Contribución

Para contribuir a esta guía de estilos:

1. Seguir las convenciones establecidas
2. Documentar nuevos mixins y variables
3. Añadir ejemplos de uso
4. Mantener la compatibilidad hacia atrás
5. Probar en múltiples navegadores

## Changelog

### v1.0.0 (Enero 2025)
- Estructura inicial de variables, mixins y utilidades
- Implementación de tema deportivo
- Sistema de espaciado consistente
- Metodología BEM implementada
- Soporte responsive completo
- Documentación completa
