#!/bin/bash

# Script de despliegue completo para SportBoard Auth Service
# Este script automatiza todo el proceso de despliegue en producción

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes con colores
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

print_header() {
    echo ""
    print_message $BLUE "=================================================="
    print_message $BLUE "$1"
    print_message $BLUE "=================================================="
    echo ""
}

print_success() {
    print_message $GREEN "✅ $1"
}

print_warning() {
    print_message $YELLOW "⚠️  $1"
}

print_error() {
    print_message $RED "❌ $1"
}

# Verificar si Docker está instalado
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker no está instalado. Por favor instala Docker primero."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose no está instalado. Por favor instala Docker Compose primero."
        exit 1
    fi
    
    print_success "Docker y Docker Compose están disponibles"
}

# Verificar archivos necesarios
check_files() {
    local required_files=(
        "docker-compose.prod.yml"
        ".env.prod"
        "docker/prod/Dockerfile"
        "docker/prod/entrypoint.sh"
        "nginx.conf"
        "kong-config.sh"
    )
    
    for file in "${required_files[@]}"; do
        if [[ ! -f "$file" ]]; then
            print_error "Archivo requerido no encontrado: $file"
            exit 1
        fi
    done
    
    print_success "Todos los archivos necesarios están presentes"
}

# Crear directorios necesarios
create_directories() {
    print_message $BLUE "📁 Creando directorios necesarios..."
    
    mkdir -p app/logs
    mkdir -p app/staticfiles
    mkdir -p app/media
    
    # Dar permisos de ejecución al script de Kong
    chmod +x kong-config.sh
    chmod +x docker/prod/entrypoint.sh
    
    print_success "Directorios creados y permisos configurados"
}

# Construir imágenes Docker
build_images() {
    print_header "🔨 CONSTRUYENDO IMÁGENES DOCKER"
    
    print_message $BLUE "Construyendo imagen de la aplicación..."
    docker-compose -f docker-compose.prod.yml build --no-cache
    
    print_success "Imágenes construidas exitosamente"
}

# Iniciar servicios de base de datos primero
start_databases() {
    print_header "🗄️  INICIANDO SERVICIOS DE BASE DE DATOS"
    
    print_message $BLUE "Iniciando PostgreSQL y Redis..."
    docker-compose -f docker-compose.prod.yml up -d kong-database auth-database redis rabbitmq
    
    print_message $BLUE "Esperando que las bases de datos estén listas..."
    sleep 30
    
    print_success "Servicios de base de datos iniciados"
}

# Ejecutar migraciones de Kong
setup_kong() {
    print_header "🦍 CONFIGURANDO KONG"
    
    print_message $BLUE "Ejecutando migraciones de Kong..."
    docker-compose -f docker-compose.prod.yml up kong-migration
    
    print_message $BLUE "Iniciando Kong Gateway..."
    docker-compose -f docker-compose.prod.yml up -d kong
    
    print_message $BLUE "Esperando que Kong esté disponible..."
    sleep 20
    
    print_message $BLUE "Iniciando Konga (Kong Admin UI)..."
    docker-compose -f docker-compose.prod.yml up -d konga
    
    print_success "Kong configurado exitosamente"
}

# Iniciar aplicación principal
start_application() {
    print_header "🚀 INICIANDO APLICACIÓN PRINCIPAL"
    
    print_message $BLUE "Iniciando aplicación Django..."
    docker-compose -f docker-compose.prod.yml up -d api
    
    print_message $BLUE "Iniciando workers de Celery..."
    docker-compose -f docker-compose.prod.yml up -d celery celery-beat
    
    print_message $BLUE "Iniciando Flower (monitoreo de Celery)..."
    docker-compose -f docker-compose.prod.yml up -d flower
    
    print_message $BLUE "Iniciando Nginx..."
    docker-compose -f docker-compose.prod.yml up -d nginx
    
    print_success "Aplicación principal iniciada"
}

# Configurar Kong con los servicios
configure_kong() {
    print_header "⚙️  CONFIGURANDO SERVICIOS EN KONG"
    
    print_message $BLUE "Esperando que todos los servicios estén listos..."
    sleep 30
    
    print_message $BLUE "Ejecutando configuración automática de Kong..."
    ./kong-config.sh
    
    print_success "Kong configurado con todos los servicios"
}

# Verificar estado de los servicios
check_services() {
    print_header "🔍 VERIFICANDO ESTADO DE SERVICIOS"
    
    print_message $BLUE "Estado de los contenedores:"
    docker-compose -f docker-compose.prod.yml ps
    
    echo ""
    print_message $BLUE "Verificando conectividad de servicios..."
    
    # Verificar Kong Admin API
    if curl -s http://localhost:8001 > /dev/null; then
        print_success "Kong Admin API disponible en http://localhost:8001"
    else
        print_warning "Kong Admin API no responde"
    fi
    
    # Verificar Kong Proxy
    if curl -s http://localhost:8000 > /dev/null; then
        print_success "Kong Proxy disponible en http://localhost:8000"
    else
        print_warning "Kong Proxy no responde"
    fi
    
    # Verificar aplicación Django
    if curl -s http://localhost/health/ > /dev/null; then
        print_success "Aplicación Django disponible en http://localhost"
    else
        print_warning "Aplicación Django no responde"
    fi
    
    # Verificar Konga
    if curl -s http://localhost:1337 > /dev/null; then
        print_success "Konga UI disponible en http://localhost:1337"
    else
        print_warning "Konga UI no responde"
    fi
    
    # Verificar Flower
    if curl -s http://localhost:5555 > /dev/null; then
        print_success "Flower disponible en http://localhost:5555"
    else
        print_warning "Flower no responde"
    fi
}

# Mostrar información de acceso
show_access_info() {
    print_header "🌐 INFORMACIÓN DE ACCESO"
    
    echo ""
    print_message $GREEN "🎉 ¡Despliegue completado exitosamente!"
    echo ""
    print_message $BLUE "📋 URLs de acceso:"
    echo "  🌍 Aplicación principal:     http://localhost"
    echo "  🦍 Kong Admin API:          http://localhost:8001"
    echo "  🚪 Kong Proxy:              http://localhost:8000"
    echo "  🎛️  Kong Manager:            http://localhost:8002"
    echo "  🖥️  Konga UI:                http://localhost:1337"
    echo "  🌸 Flower (Celery):         http://localhost:5555"
    echo "  🐰 RabbitMQ Management:     http://localhost:15672"
    echo ""
    print_message $BLUE "🔑 Credenciales por defecto:"
    echo "  📧 Admin Django:            admin@sportboard.com / admin123"
    echo "  🐰 RabbitMQ:                admin / admin123"
    echo "  🌸 Flower:                  admin / admin123"
    echo ""
    print_message $YELLOW "⚠️  IMPORTANTE:"
    echo "  - Cambia las credenciales por defecto en producción"
    echo "  - Configura las variables de entorno en .env.prod"
    echo "  - Revisa los logs con: docker-compose -f docker-compose.prod.yml logs"
    echo ""
    print_message $BLUE "🔧 Comandos útiles:"
    echo "  - Ver logs:                 docker-compose -f docker-compose.prod.yml logs -f"
    echo "  - Parar servicios:          docker-compose -f docker-compose.prod.yml down"
    echo "  - Reiniciar servicios:      docker-compose -f docker-compose.prod.yml restart"
    echo "  - Ver estado:               docker-compose -f docker-compose.prod.yml ps"
    echo ""
}

# Función principal
main() {
    print_header "🚀 INICIANDO DESPLIEGUE DE SPORTBOARD AUTH SERVICE"
    
    # Verificaciones previas
    check_docker
    check_files
    create_directories
    
    # Proceso de despliegue
    build_images
    start_databases
    setup_kong
    start_application
    configure_kong
    
    # Verificaciones finales
    check_services
    show_access_info
    
    print_message $GREEN "✅ ¡Despliegue completado exitosamente!"
}

# Manejo de errores
trap 'print_error "Error durante el despliegue. Revisa los logs para más detalles."; exit 1' ERR

# Ejecutar función principal
main "$@"
