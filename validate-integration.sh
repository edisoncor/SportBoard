#!/bin/bash

# Script de validación para la integración Frontend-Backend con Kong
# Valida que todos los servicios estén funcionando correctamente

echo "🚀 Iniciando validación de integración SportBoard"
echo "=================================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar resultados
show_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

echo -e "${BLUE}1. Verificando Kong API Gateway...${NC}"
# Verificar Kong
curl -s -f http://localhost:8000 > /dev/null
show_result $? "Kong API Gateway está ejecutándose en puerto 8000"

echo -e "${BLUE}2. Verificando microservicio ms-competencies...${NC}"
# Verificar ms-competencies directamente
curl -s -f http://localhost:8010/api/v1/competencies/catalogues/ > /dev/null
show_result $? "ms-competencies está ejecutándose en puerto 8010"

echo -e "${BLUE}3. Verificando ruteo de Kong a ms-competencies...${NC}"
# Verificar ruteo a través de Kong
response=$(curl -s -w "%{http_code}" http://localhost:8000/competencies/catalogues/ -o /dev/null)
if [ "$response" = "200" ]; then
    show_result 0 "Kong está enrutando correctamente a ms-competencies"
else
    show_result 1 "Kong no está enrutando correctamente (HTTP $response)"
fi

echo -e "${BLUE}4. Verificando CORS para el frontend...${NC}"
# Verificar CORS
cors_response=$(curl -s -w "%{http_code}" \
    -H "Origin: http://localhost:4201" \
    -H "Access-Control-Request-Method: GET" \
    -H "Access-Control-Request-Headers: Content-Type" \
    -X OPTIONS \
    http://localhost:8000/competencies/catalogues/ \
    -o /dev/null)

if [ "$cors_response" = "200" ] || [ "$cors_response" = "204" ]; then
    show_result 0 "CORS está configurado correctamente"
else
    show_result 1 "CORS no está configurado correctamente (HTTP $cors_response)"
fi

echo -e "${BLUE}5. Verificando estructura de respuesta API...${NC}"
# Verificar estructura de respuesta
api_response=$(curl -s http://localhost:8000/competencies/catalogues/)
if echo "$api_response" | jq -e '.data' > /dev/null 2>&1; then
    show_result 0 "La respuesta API tiene la estructura esperada"
    
    # Mostrar información adicional
    count=$(echo "$api_response" | jq '.data | length' 2>/dev/null || echo "0")
    message=$(echo "$api_response" | jq -r '.message' 2>/dev/null || echo "No message")
    echo -e "${YELLOW}   📊 Número de catálogos: $count${NC}"
    echo -e "${YELLOW}   💬 Mensaje: $message${NC}"
else
    show_result 1 "La respuesta API no tiene la estructura esperada"
fi

echo -e "${BLUE}6. Verificando otros endpoints principales...${NC}"

# Lista de endpoints a verificar
endpoints=(
    "rules"
    "gamestates"
    "users"
    "athletes"
    "teams"
    "competitions"
)

for endpoint in "${endpoints[@]}"; do
    response_code=$(curl -s -w "%{http_code}" "http://localhost:8000/competencies/${endpoint}/" -o /dev/null)
    if [ "$response_code" = "200" ]; then
        echo -e "${GREEN}   ✅ /${endpoint}/ (HTTP $response_code)${NC}"
    else
        echo -e "${RED}   ❌ /${endpoint}/ (HTTP $response_code)${NC}"
    fi
done

echo -e "${BLUE}7. Verificando documentación Swagger...${NC}"
# Verificar Swagger del microservicio
swagger_response=$(curl -s -w "%{http_code}" http://localhost:8010/api/v1/docs/ -o /dev/null)
if [ "$swagger_response" = "200" ]; then
    show_result 0 "Documentación Swagger está disponible"
    echo -e "${YELLOW}   📖 Swagger UI: http://localhost:8010/api/v1/docs/${NC}"
else
    show_result 1 "Documentación Swagger no está disponible"
fi

echo
echo "=================================================="
echo -e "${BLUE}📋 Resumen de Validación${NC}"
echo "=================================================="

if command -v node &> /dev/null; then
    echo -e "${GREEN}✅ Node.js está instalado${NC}"
    node_version=$(node --version)
    echo -e "${YELLOW}   📦 Versión: $node_version${NC}"
else
    echo -e "${RED}❌ Node.js no está instalado${NC}"
fi

if command -v ng &> /dev/null; then
    echo -e "${GREEN}✅ Angular CLI está instalado${NC}"
    ng_version=$(ng version --version 2>/dev/null || echo "Unknown")
    echo -e "${YELLOW}   📦 Versión: $ng_version${NC}"
else
    echo -e "${RED}❌ Angular CLI no está instalado${NC}"
fi

if command -v docker &> /dev/null; then
    echo -e "${GREEN}✅ Docker está instalado${NC}"
    docker_version=$(docker --version | cut -d' ' -f3 | cut -d',' -f1)
    echo -e "${YELLOW}   📦 Versión: $docker_version${NC}"
else
    echo -e "${RED}❌ Docker no está instalado${NC}"
fi

# Verificar estado de contenedores Docker
echo
echo -e "${BLUE}🐳 Estado de Contenedores Docker${NC}"
echo "----------------------------------------"

containers=("kong" "ms-competencies")
for container in "${containers[@]}"; do
    if docker ps --format "table {{.Names}}" | grep -q "$container"; then
        echo -e "${GREEN}   ✅ $container está ejecutándose${NC}"
    else
        echo -e "${RED}   ❌ $container no está ejecutándose${NC}"
    fi
done

echo
echo "=================================================="
echo -e "${BLUE}🎯 Próximos Pasos para Validar en el Frontend${NC}"
echo "=================================================="
echo "1. Navegar al directorio del frontend:"
echo -e "${YELLOW}   cd frontend/spa${NC}"
echo
echo "2. Instalar dependencias (si es necesario):"
echo -e "${YELLOW}   npm install${NC}"
echo
echo "3. Iniciar el servidor de desarrollo:"
echo -e "${YELLOW}   ng serve --port 4201 --host 0.0.0.0${NC}"
echo
echo "4. Abrir en el navegador:"
echo -e "${YELLOW}   http://localhost:4201${NC}"
echo
echo "5. Navegar al componente de catálogos para verificar la integración"
echo
echo -e "${GREEN}✨ La validación de backend está completa!${NC}"
