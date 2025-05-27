# Frontend

Este proyecto fue generado con [Angular CLI](https://github.com/angular/angular-cli) versión 18.2.8.

## Estructura del Proyecto

El proyecto sigue la estructura estándar de un proyecto Angular:
- `src/`: Contiene el código fuente de la aplicación.
  - `app/`: Contiene el módulo principal de la aplicación y los componentes.
    - `services/`: Contiene los servicios de la aplicación.
    - `models/`: Contiene las clases y interfaces de modelos de datos.
    - `calendario/`: Módulo de calendario.
      - `calendar/`: Contiene el componente del calendario.
      - `matchtable/`: Contiene el componente de la tabla de partidos.
      - `sorteo/`: Contiene el componente de sorteo.
      - `calendario-routing.module.ts`: Módulo de enrutamiento del calendario.
      - `calendario.module.ts`: Módulo del calendario.
    - `catalogs/`: Módulo de catálogos.
      - `catalogs/`: Contiene el componente de catálogos.
      - `groups/`: Contiene el componente de grupos.
      - `dashboard/`: Contiene el componente del dashboard.
      - `catalog-dialog/`: Contiene el componente del diálogo de catálogos.
      - `catalogs-routing.module.ts`: Módulo de enrutamiento de catálogos.
      - `catalogs.module.ts`: Módulo de catálogos.
    - `shared/`: Contiene componentes y servicios compartidos.
      - `breadcrumb/`: Contiene el componente de breadcrumb.
      - `confirmation-dialog/`: Contiene el componente de diálogo de confirmación.
      - `flash-message/`: Contiene el componente de mensajes flash.
      - `shared.module.ts`: Módulo compartido.
    - `core/`: Contiene componentes y servicios centrales.
      - `header/`: Contiene el componente de encabezado.
      - `footer/`: Contiene el componente de pie de página.
      - `sidebar/`: Contiene el componente de barra lateral.
    - `app.module.ts`: Módulo principal de la aplicación.
    - `app.component.ts`: Componente principal de la aplicación.
    - `app.component.html`: Plantilla del componente principal.
    - `app.component.scss`: Estilos del componente principal.
  - `assets/`: Contiene activos estáticos como imágenes y estilos.
  - `environments/`: Contiene archivos de configuración de entornos.
- `e2e/`: Contiene pruebas end-to-end.
- `node_modules/`: Contiene dependencias de npm.
- `dist/`: Contiene la salida de la compilación.

## Librerías Adicionales

El proyecto utiliza las siguientes librerías adicionales:
- `@angular/material`: Angular Material para componentes de UI.
- `@angular/flex-layout`: Flex Layout para diseño responsivo.
- `ngx-translate/core`: Para internacionalización y localización.
- `rxjs`: Extensiones Reactivas para JavaScript.
- `ngrx/store`: Para gestión de estado.

## Servidor de Desarrollo

Ejecuta `ng serve` para un servidor de desarrollo. Navega a `http://localhost:4200/`. La aplicación se recargará automáticamente si cambias alguno de los archivos fuente.

## Generación de Código

Ejecuta `ng generate component nombre-del-componente` para generar un nuevo componente. También puedes usar `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Compilación

Ejecuta `ng build` para compilar el proyecto. Los artefactos de compilación se almacenarán en el directorio `dist/`.

## Ejecución de Pruebas Unitarias

Ejecuta `ng test` para ejecutar las pruebas unitarias a través de [Karma](https://karma-runner.github.io).

## Ejecución de Pruebas End-to-End

Ejecuta `ng e2e` para ejecutar las pruebas end-to-end a través de una plataforma de tu elección. Para usar este comando, primero necesitas agregar un paquete que implemente capacidades de pruebas end-to-end.

## Más Ayuda

Para obtener más ayuda sobre Angular CLI usa `ng help` o visita la página [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli).
