# Guía de Migración - Actualización de Estilos SCSS

## Lista de Verificación para Migración

### ✅ Paso 1: Actualizar Imports
Reemplazar imports antiguos por la nueva estructura:

**Antes:**
```scss
@use '../../../styles.scss' as *;
```

**Después:**
```scss
@use '../../../styles/variables' as vars;
@use '../../../styles/mixins' as mixins;
```

### ✅ Paso 2: Reemplazar Variables Hardcodeadas

#### Colores
- `#1e88e5` → `vars.$primary-color`
- `#26a69a` → `vars.$secondary-color`
- `#ff5722` → `vars.$accent-color`
- `#43a047` → `vars.$success-color`
- `#ffb300` → `vars.$warning-color`
- `#e53935` → `vars.$error-color`
- `#eceff1` → `vars.$light-gray`
- `#37474f` → `vars.$dark-gray`
- `#2c3e50` → `vars.$font-color`
- `#546e7a` → `vars.$font-secondary-color`
- `#ffffff` → `vars.$white`

#### Espaciado
- `4px` → `vars.$spacing-1`
- `8px` → `vars.$spacing-2`
- `12px` → `vars.$spacing-3`
- `16px` → `vars.$spacing-4`
- `20px` → `vars.$spacing-5`
- `24px` → `vars.$spacing-6`
- `32px` → `vars.$spacing-8`
- `48px` → `vars.$spacing-12`

#### Tipografía
- `16px` → `vars.$font-size-base`
- `14px` → `vars.$font-size-sm`
- `18px` → `vars.$font-size-lg`
- `20px` → `vars.$font-size-xl`
- `24px` → `vars.$font-size-2xl`
- `500` → `vars.$font-weight-medium`
- `600` → `vars.$font-weight-semibold`
- `700` → `vars.$font-weight-bold`

#### Border Radius
- `4px` → `vars.$border-radius-sm`
- `8px` → `vars.$border-radius-md`
- `12px` → `vars.$border-radius-lg`
- `50%` → `vars.$border-radius-full`

#### Breakpoints
- `768px` → `vars.$breakpoint-md`
- `992px` → `vars.$breakpoint-lg`
- `1200px` → `vars.$breakpoint-xl`

### ✅ Paso 3: Usar Mixins para Patrones Comunes

#### Botones
**Antes:**
```scss
.mi-boton {
    cursor: pointer;
    border: none;
    border-radius: 8px;
    padding: 0.5rem 1rem;
    background-color: #1e88e5;
    color: white;
    transition: all 0.3s ease;
    
    &:hover {
        background-color: #1565c0;
    }
}
```

**Después:**
```scss
.mi-boton {
    @include mixins.button-primary;
}
```

#### Cards
**Antes:**
```scss
.mi-card {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    padding: 1.5rem;
    transition: transform 0.3s ease;
    
    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
    }
}
```

**Después:**
```scss
.mi-card {
    @include mixins.card;
}
```

#### Responsive
**Antes:**
```scss
@media (max-width: 768px) {
    .mi-componente {
        flex-direction: column;
    }
}
```

**Después:**
```scss
.mi-componente {
    @include mixins.respond-to(md) {
        flex-direction: column;
    }
}
```

### ✅ Paso 4: Aplicar Clases de Utilidad

#### Spacing
**Antes:**
```scss
.mi-elemento {
    margin-top: 1rem;
    margin-bottom: 2rem;
    padding: 1.5rem;
}
```

**Después:**
```html
<div class="mi-elemento mt-4 mb-8 p-6">
```

#### Flexbox
**Antes:**
```scss
.mi-contenedor {
    display: flex;
    justify-content: center;
    align-items: center;
}
```

**Después:**
```html
<div class="mi-contenedor d-flex justify-content-center align-items-center">
```

### ✅ Paso 5: Reorganizar Estructura del Componente

**Estructura recomendada:**
```scss
@use '../../../styles/variables' as vars;
@use '../../../styles/mixins' as mixins;

.nombre-componente {
    // 1. Includes/mixins
    @include mixins.card;
    
    // 2. Propiedades de layout
    display: flex;
    position: relative;
    
    // 3. Dimensiones
    width: 100%;
    padding: vars.$spacing-4;
    
    // 4. Propiedades visuales
    background-color: vars.$white;
    border-radius: vars.$border-radius-lg;
    
    // 5. Tipografía
    font-size: vars.$font-size-base;
    color: vars.$font-color;
    
    // 6. Estados
    &:hover {
        @include mixins.interactive-hover;
    }
    
    &.is-active {
        background-color: vars.$primary-color;
    }
    
    // 7. Elementos hijos (BEM)
    &__titulo {
        font-size: vars.$font-size-lg;
        font-weight: vars.$font-weight-semibold;
    }
    
    &__contenido {
        color: vars.$font-secondary-color;
    }
    
    // 8. Modificadores (BEM)
    &--grande {
        padding: vars.$spacing-8;
    }
    
    // 9. Media queries
    @include mixins.respond-to(md) {
        flex-direction: column;
    }
}
```

## Archivos Prioritarios para Migrar

### Alta Prioridad
1. `src/app/feature/auth/login/login.scss`
2. `src/app/feature/dashboard/dashboard.scss`
3. `src/app/layouts/main-layout/main-layout.scss`
4. `src/styles.scss` (ya migrado)

### Media Prioridad
1. `src/app/feature/equipos/equipos.scss`
2. `src/app/feature/eventos/eventos.scss`
3. `src/app/feature/notificaciones/notificaciones.scss`

### Baja Prioridad
1. Componentes específicos de features
2. Estilos de páginas de error

## Comandos de Búsqueda y Reemplazo

### VS Code - Buscar y Reemplazar (Regex)

#### Colores
```regex
Buscar: #1e88e5
Reemplazar: vars.$primary-color
```

```regex
Buscar: #26a69a
Reemplazar: vars.$secondary-color
```

#### Padding/Margin con px
```regex
Buscar: padding: (\d+)px
Reemplazar: padding: vars.$spacing-$1
```

#### Media queries
```regex
Buscar: @media \(max-width: 768px\)
Reemplazar: @include mixins.respond-to(md)
```

## Validación Post-Migración

### Lista de Verificación
- [ ] El proyecto compila sin errores SCSS
- [ ] No hay variables CSS hardcodeadas restantes
- [ ] Se usan mixins para patrones repetitivos
- [ ] Se aplican clases de utilidad donde es apropiado
- [ ] La nomenclatura sigue la metodología BEM
- [ ] Los breakpoints responsive funcionan correctamente
- [ ] Los estilos se ven idénticos al diseño original

### Comandos de Testing
```bash
# Compilar estilos
ng build --configuration=production

# Verificar que no hay errores SCSS
ng lint

# Buscar variables hardcodeadas restantes
grep -r "#[0-9a-fA-F]\{6\}" src/app --include="*.scss"
grep -r "px" src/app --include="*.scss" | grep -v "vars\."
```

## Beneficios Esperados

### Mantenibilidad
- ✅ Variables centralizadas
- ✅ Reutilización de código con mixins
- ✅ Consistencia visual
- ✅ Fácil actualización de temas

### Performance
- ✅ Menos código CSS duplicado
- ✅ Mejor compresión gzip
- ✅ Carga más rápida

### Escalabilidad
- ✅ Nuevos componentes más rápidos de crear
- ✅ Sistema de design tokens
- ✅ Fácil implementación de modo oscuro
- ✅ Responsive design consistente
