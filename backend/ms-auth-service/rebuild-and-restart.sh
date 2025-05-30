#!/bin/bash

echo "Deteniendo contenedores..."
docker-compose -f docker-compose.prod.yml down

echo "Eliminando imagen anterior..."
docker rmi $(docker images -q sportboard-api) 2>/dev/null || true

echo "Reconstruyendo imagen con nuevas migraciones..."
docker-compose -f docker-compose.prod.yml build --no-cache api

echo "Iniciando servicios..."
docker-compose -f docker-compose.prod.yml up -d

echo "Mostrando logs del servicio API..."
docker-compose -f docker-compose.prod.yml logs -f api
