@echo off
REM Script de validación para la integración Frontend-Backend con Kong (Windows)
REM Valida que todos los servicios estén funcionando correctamente

echo 🚀 Iniciando validación de integración SportBoard
echo ==================================================

echo 1. Verificando Kong API Gateway...
curl -s -f http://localhost:8000 >nul 2>&1
if %errorlevel%==0 (
    echo ✅ Kong API Gateway está ejecutándose en puerto 8000
) else (
    echo ❌ Kong API Gateway no está ejecutándose en puerto 8000
)

echo 2. Verificando microservicio ms-competencies...
curl -s -f http://localhost:8010/api/v1/competencies/catalogues/ >nul 2>&1
if %errorlevel%==0 (
    echo ✅ ms-competencies está ejecutándose en puerto 8010
) else (
    echo ❌ ms-competencies no está ejecutándose en puerto 8010
)

echo 3. Verificando ruteo de Kong a ms-competencies...
for /f %%i in ('curl -s -w "%%{http_code}" http://localhost:8000/competencies/api/v1/competencies/catalogues/ -o nul') do set response=%%i
if "%response%"=="200" (
    echo ✅ Kong está enrutando correctamente a ms-competencies
) else (
    echo ❌ Kong no está enrutando correctamente (HTTP %response%)
)

echo 4. Verificando CORS para el frontend...
for /f %%i in ('curl -s -w "%%{http_code}" -H "Origin: http://localhost:4201" -H "Access-Control-Request-Method: GET" -X OPTIONS http://localhost:8000/competencies/api/v1/competencies/catalogues/ -o nul') do set cors_response=%%i
if "%cors_response%"=="200" (
    echo ✅ CORS está configurado correctamente
) else if "%cors_response%"=="204" (
    echo ✅ CORS está configurado correctamente
) else (
    echo ❌ CORS no está configurado correctamente (HTTP %cors_response%)
)

echo 5. Verificando endpoints principales...
set endpoints=rules gamestates users athletes teams competitions

for %%e in (%endpoints%) do (
    for /f %%i in ('curl -s -w "%%{http_code}" "http://localhost:8000/competencies/api/v1/competencies/%%e/" -o nul') do (
        if "%%i"=="200" (
            echo    ✅ /%%e/ (HTTP %%i)
        ) else (
            echo    ❌ /%%e/ (HTTP %%i)
        )
    )
)

echo.
echo ==================================================
echo 📋 Resumen de Validación
echo ==================================================

where node >nul 2>&1
if %errorlevel%==0 (
    echo ✅ Node.js está instalado
    for /f "tokens=*" %%i in ('node --version') do echo    📦 Versión: %%i
) else (
    echo ❌ Node.js no está instalado
)

where ng >nul 2>&1
if %errorlevel%==0 (
    echo ✅ Angular CLI está instalado
) else (
    echo ❌ Angular CLI no está instalado
)

where docker >nul 2>&1
if %errorlevel%==0 (
    echo ✅ Docker está instalado
    for /f "tokens=3" %%i in ('docker --version') do echo    📦 Versión: %%i
) else (
    echo ❌ Docker no está instalado
)

echo.
echo ==================================================
echo 🎯 Próximos Pasos para Validar en el Frontend
echo ==================================================
echo 1. Navegar al directorio del frontend:
echo    cd frontend\spa
echo.
echo 2. Instalar dependencias (si es necesario):
echo    npm install
echo.
echo 3. Iniciar el servidor de desarrollo:
echo    ng serve --port 4201 --host 0.0.0.0
echo.
echo 4. Abrir en el navegador:
echo    http://localhost:4201
echo.
echo 5. Navegar al componente de catálogos para verificar la integración
echo.
echo ✨ La validación de backend está completa!

pause
