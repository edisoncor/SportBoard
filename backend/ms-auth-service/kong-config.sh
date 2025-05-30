#!/bin/bash

# Script de configuración de Kong para SportBoard Auth Service
# Este script configura automáticamente Kong con los servicios y rutas necesarios

set -e

echo "🚀 Configurando Kong API Gateway para SportBoard Auth Service..."

# Variables de configuración
KONG_ADMIN_URL="http://localhost:8001"
API_UPSTREAM_URL="http://api:8000"

# Función para verificar si Kong está disponible
wait_for_kong() {
    echo "⏳ Esperando que Kong esté disponible..."
    while ! curl -s "$KONG_ADMIN_URL" > /dev/null; do
        echo "Kong no está disponible aún, esperando..."
        sleep 5
    done
    echo "✅ Kong está disponible!"
}

# Función para crear un servicio en Kong
create_service() {
    local service_name=$1
    local service_url=$2
    local service_path=$3
    
    echo "📝 Creando servicio: $service_name"
    
    # Verificar si el servicio ya existe
    if curl -s "$KONG_ADMIN_URL/services/$service_name" | grep -q "name"; then
        echo "⚠️  El servicio $service_name ya existe, actualizando..."
        curl -i -X PATCH "$KONG_ADMIN_URL/services/$service_name" \
            --data "url=$service_url" \
            --data "path=$service_path"
    else
        curl -i -X POST "$KONG_ADMIN_URL/services/" \
            --data "name=$service_name" \
            --data "url=$service_url" \
            --data "path=$service_path"
    fi
    
    echo "✅ Servicio $service_name configurado"
}

# Función para crear una ruta en Kong
create_route() {
    local service_name=$1
    local route_name=$2
    local route_paths=$3
    local route_methods=$4
    
    echo "🛣️  Creando ruta: $route_name para servicio: $service_name"
    
    # Verificar si la ruta ya existe
    if curl -s "$KONG_ADMIN_URL/routes/$route_name" | grep -q "name"; then
        echo "⚠️  La ruta $route_name ya existe, actualizando..."
        curl -i -X PATCH "$KONG_ADMIN_URL/routes/$route_name" \
            --data "paths[]=$route_paths" \
            --data "methods[]=$route_methods"
    else
        curl -i -X POST "$KONG_ADMIN_URL/services/$service_name/routes" \
            --data "name=$route_name" \
            --data "paths[]=$route_paths" \
            --data "methods[]=$route_methods"
    fi
    
    echo "✅ Ruta $route_name configurada"
}

# Función para agregar plugin a un servicio
add_plugin() {
    local service_name=$1
    local plugin_name=$2
    local plugin_config=$3
    
    echo "🔌 Agregando plugin $plugin_name al servicio $service_name"
    
    curl -i -X POST "$KONG_ADMIN_URL/services/$service_name/plugins/" \
        --data "name=$plugin_name" \
        $plugin_config
    
    echo "✅ Plugin $plugin_name agregado"
}

# Esperar a que Kong esté disponible
wait_for_kong

echo "🔧 Configurando servicios y rutas..."

# 1. Servicio principal de autenticación
create_service "sportboard-auth" "$API_UPSTREAM_URL" "/api/auth"
create_route "sportboard-auth" "auth-routes" "/auth" "GET,POST,PUT,DELETE"

# 2. Servicio de usuarios
create_service "sportboard-users" "$API_UPSTREAM_URL" "/api/users"
create_route "sportboard-users" "user-routes" "/users" "GET,POST,PUT,DELETE"

# 3. Servicio de administración
create_service "sportboard-admin" "$API_UPSTREAM_URL" "/api/admin"
create_route "sportboard-admin" "admin-routes" "/admin" "GET,POST,PUT,DELETE"

# 4. Servicio de departamentos
create_service "sportboard-departments" "$API_UPSTREAM_URL" "/api/departments"
create_route "sportboard-departments" "department-routes" "/departments" "GET,POST,PUT,DELETE"

# 5. Servicio de instituciones
create_service "sportboard-institutions" "$API_UPSTREAM_URL" "/api/institutions"
create_route "sportboard-institutions" "institution-routes" "/institutions" "GET,POST,PUT,DELETE"

# 6. Servicio de perfiles deportivos
create_service "sportboard-profiles" "$API_UPSTREAM_URL" "/api/sport-profiles"
create_route "sportboard-profiles" "profile-routes" "/sport-profiles" "GET,POST,PUT,DELETE"

# 7. Servicio de mediciones de salud
create_service "sportboard-health" "$API_UPSTREAM_URL" "/api/measuring-health"
create_route "sportboard-health" "health-routes" "/measuring-health" "GET,POST,PUT,DELETE"

# 8. Servicio de rendimiento
create_service "sportboard-performance" "$API_UPSTREAM_URL" "/api/performance"
create_route "sportboard-performance" "performance-routes" "/performance" "GET,POST,PUT,DELETE"

# 9. Servicio de transacciones
create_service "sportboard-transactions" "$API_UPSTREAM_URL" "/api/transactions"
create_route "sportboard-transactions" "transaction-routes" "/transactions" "GET,POST,PUT,DELETE"

echo "🔐 Configurando plugins de seguridad..."

# Plugin de Rate Limiting para autenticación (más restrictivo)
add_plugin "sportboard-auth" "rate-limiting" "--data config.minute=10 --data config.hour=100"

# Plugin de Rate Limiting general
add_plugin "sportboard-users" "rate-limiting" "--data config.minute=60 --data config.hour=1000"
add_plugin "sportboard-departments" "rate-limiting" "--data config.minute=60 --data config.hour=1000"
add_plugin "sportboard-institutions" "rate-limiting" "--data config.minute=60 --data config.hour=1000"
add_plugin "sportboard-profiles" "rate-limiting" "--data config.minute=60 --data config.hour=1000"
add_plugin "sportboard-health" "rate-limiting" "--data config.minute=60 --data config.hour=1000"
add_plugin "sportboard-performance" "rate-limiting" "--data config.minute=60 --data config.hour=1000"
add_plugin "sportboard-transactions" "rate-limiting" "--data config.minute=60 --data config.hour=1000"

# Plugin de CORS
echo "🌐 Configurando CORS..."
add_plugin "sportboard-auth" "cors" "--data config.origins=http://localhost:3000,http://127.0.0.1:3000 --data config.methods=GET,POST,PUT,DELETE,OPTIONS --data config.headers=Accept,Accept-Version,Content-Length,Content-MD5,Content-Type,Date,X-Auth-Token,Authorization"

# Plugin de logging
echo "📊 Configurando logging..."
add_plugin "sportboard-auth" "file-log" "--data config.path=/tmp/kong-auth.log"

echo "🎉 ¡Configuración de Kong completada!"
echo ""
echo "📋 Resumen de configuración:"
echo "  - Kong Admin API: http://localhost:8001"
echo "  - Kong Proxy: http://localhost:8000"
echo "  - Kong Manager: http://localhost:8002"
echo "  - Konga UI: http://localhost:1337"
echo ""
echo "🔗 Rutas configuradas:"
echo "  - /auth/* -> Servicio de autenticación"
echo "  - /users/* -> Servicio de usuarios"
echo "  - /admin/* -> Servicio de administración"
echo "  - /departments/* -> Servicio de departamentos"
echo "  - /institutions/* -> Servicio de instituciones"
echo "  - /sport-profiles/* -> Servicio de perfiles deportivos"
echo "  - /measuring-health/* -> Servicio de mediciones"
echo "  - /performance/* -> Servicio de rendimiento"
echo "  - /transactions/* -> Servicio de transacciones"
echo ""
echo "🛡️  Plugins configurados:"
echo "  - Rate Limiting (diferentes límites por servicio)"
echo "  - CORS (configurado para desarrollo)"
echo "  - File Logging (logs en /tmp/kong-auth.log)"
echo ""
echo "✅ Kong está listo para usar!"
