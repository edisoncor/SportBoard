# PowerShell script para reconstruir y reiniciar el servicio de autenticación

Write-Host "Deteniendo contenedores..." -ForegroundColor Yellow
docker-compose -f docker-compose.prod.yml down

Write-Host "Eliminando imagen anterior..." -ForegroundColor Yellow
$imageId = docker images -q sportboard-api
if ($imageId) {
    docker rmi $imageId
}

Write-Host "Reconstruyendo imagen con nuevas migraciones..." -ForegroundColor Yellow
docker-compose -f docker-compose.prod.yml build --no-cache api

Write-Host "Iniciando servicios..." -ForegroundColor Yellow
docker-compose -f docker-compose.prod.yml up -d

Write-Host "Mostrando logs del servicio API..." -ForegroundColor Green
docker-compose -f docker-compose.prod.yml logs -f api
