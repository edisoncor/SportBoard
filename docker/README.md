# SportBoard Docker Setup

# Configuración Docker para SportBoard

## Comandos Básicos
- **Construir Imágenes:** `make build`
- **Levantar Contenedores:** `make up`
- **Detener Contenedores:** `make down`
- **Ver Logs de Contenedores:** `docker-compose logs -f`
- **Reiniciar Contenedores:** `docker-compose restart`

## Estructura del Directorio
- **`Dockerfile`:** Definición de la imagen Docker para cada servicio.
- **`docker-compose.yml`:** Configuración global para los servicios del proyecto.
- **`.dockerignore`:** Lista de archivos y directorios que deben ser ignorados por Docker al construir las imágenes.
- **`Makefile`:** Archivo que contiene comandos automatizados para construir y gestionar los contenedores.
- **`docker-compose.override.yml`:** Archivo opcional para sobrescribir configuraciones del `docker-compose.yml` para entornos específicos.

## Estructura de Directorios y Archivos
```
/docker
    /api-gateway
        kong.yml
        docker-compose.override.yml
    /backend
        /ms6-catalog
            Dockerfile
            docker-compose.override.yml
    /bff
        Dockerfile
        docker-compose.override.yml
    Dockerfile
    docker-compose.yml
    .dockerignore
    Makefile
```

## Buenas Prácticas
- Usar nombres consistentes: `sportboard-<servicio>`.
- Mantener el archivo `.dockerignore` actualizado.
- Evitar incluir archivos innecesarios en las imágenes.
- Utilizar variables de entorno para configuraciones sensibles.

## Explicación de Conceptos
- **Dockerfile:** Se utiliza para definir la imagen Docker de cada servicio, especificando el sistema operativo base, las dependencias y las configuraciones necesarias.
- **docker-compose.yml:** Se utiliza para definir y ejecutar aplicaciones Docker de múltiples contenedores, especificando cómo deben interactuar los servicios entre sí.
- **.dockerignore:** Se utiliza para excluir archivos y directorios del contexto de construcción de Docker, mejorando la eficiencia y seguridad del proceso.
- **Makefile:** Se utiliza para automatizar tareas comunes relacionadas con Docker, como construir imágenes y gestionar contenedores, mediante comandos definidos.
- **docker-compose.override.yml:** Se utiliza para sobrescribir configuraciones del `docker-compose.yml` en entornos específicos, permitiendo ajustes personalizados sin modificar el archivo principal.

## Solución de Problemas
- **Contenedor no inicia:** Verificar los logs con `docker-compose logs <nombre_del_contenedor>`.
- **Cambios no reflejados:** Asegurarse de reconstruir la imagen con `make build`.
- **Problemas de red:** Verificar la configuración de redes en `docker-compose.yml` y `docker-compose.override.yml`.
