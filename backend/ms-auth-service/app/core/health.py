"""
Health check endpoints para SportBoard Auth Service

Este módulo define los endpoints de verificación de salud (health checks) para el microservicio de autenticación de SportBoard.
Incluye comprobaciones de:
- Estado de la aplicación Django
- Conectividad a la base de datos
- Conectividad a Redis
- Conectividad a RabbitMQ
"""

# Importa JsonResponse para retornar respuestas JSON en los endpoints.
from django.http import JsonResponse
# Importa connection para interactuar con la base de datos.
from django.db import connection
# Importa cache para verificar la conectividad con el sistema de caché (Redis).
from django.core.cache import cache
# Importa settings para acceder a la configuración global de Django.
from django.conf import settings
# Importa redis para la verificación directa de la conectividad con Redis.
import redis
# Importa pika para la verificación de la conectividad con RabbitMQ.
import pika
# Importa logging para registrar eventos y errores.
import logging

# Inicializa el logger para el módulo actual.
logger = logging.getLogger(__name__)


def health_check(request):
    """
    Endpoint de health check completo que verifica:
    - Estado de la aplicación Django
    - Conectividad a la base de datos
    - Conectividad a Redis
    - Conectividad a RabbitMQ
    """
    health_status = {
        'status': 'healthy',
        'timestamp': request.META.get('HTTP_DATE', ''),
        'version': '1.0.0',
        'services': {}
    }
    
    overall_status = True
    
    # 1. Verificar base de datos
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()
        health_status['services']['database'] = {
            'status': 'healthy',
            'message': 'Database connection successful'
        }
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        health_status['services']['database'] = {
            'status': 'unhealthy',
            'message': f'Database connection failed: {str(e)}'
        }
        overall_status = False
    
    # 2. Verificar Redis
    try:
        cache.set('health_check', 'ok', 30)
        cache_value = cache.get('health_check')
        if cache_value == 'ok':
            health_status['services']['redis'] = {
                'status': 'healthy',
                'message': 'Redis connection successful'
            }
        else:
            raise Exception("Cache test failed")
    except Exception as e:
        logger.error(f"Redis health check failed: {e}")
        health_status['services']['redis'] = {
            'status': 'unhealthy',
            'message': f'Redis connection failed: {str(e)}'
        }
        overall_status = False
    
    # 3. Verificar RabbitMQ (solo si está configurado)
    try:
        if hasattr(settings, 'CELERY_BROKER_URL'):
            # Intentar conectar a RabbitMQ
            connection_params = pika.URLParameters(settings.CELERY_BROKER_URL)
            connection_rabbit = pika.BlockingConnection(connection_params)
            connection_rabbit.close()
            
            health_status['services']['rabbitmq'] = {
                'status': 'healthy',
                'message': 'RabbitMQ connection successful'
            }
        else:
            health_status['services']['rabbitmq'] = {
                'status': 'not_configured',
                'message': 'RabbitMQ not configured'
            }
    except Exception as e:
        logger.error(f"RabbitMQ health check failed: {e}")
        health_status['services']['rabbitmq'] = {
            'status': 'unhealthy',
            'message': f'RabbitMQ connection failed: {str(e)}'
        }
        overall_status = False
    
    # 4. Verificar aplicación Django
    health_status['services']['django'] = {
        'status': 'healthy',
        'message': 'Django application running',
        'debug': settings.DEBUG,
        'environment': getattr(settings, 'ENVIRONMENT', 'unknown')
    }
    
    # Establecer estado general
    if not overall_status:
        health_status['status'] = 'unhealthy'
    
    # Código de respuesta HTTP basado en el estado
    status_code = 200 if overall_status else 503
    
    return JsonResponse(health_status, status=status_code)


def simple_health_check(request):
    """
    Endpoint de health check simple para verificaciones rápidas
    """
    return JsonResponse({
        'status': 'healthy',
        'message': 'Service is running'
    })


def readiness_check(request):
    """
    Endpoint de readiness check para Kubernetes/Docker
    Verifica si la aplicación está lista para recibir tráfico
    """
    try:
        # Verificar que la base de datos esté disponible
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()
        
        return JsonResponse({
            'status': 'ready',
            'message': 'Service is ready to receive traffic'
        })
    except Exception as e:
        logger.error(f"Readiness check failed: {e}")
        return JsonResponse({
            'status': 'not_ready',
            'message': f'Service not ready: {str(e)}'
        }, status=503)


def liveness_check(request):
    """
    Endpoint de liveness check para Kubernetes/Docker
    Verifica si la aplicación está viva y funcionando
    """
    return JsonResponse({
        'status': 'alive',
        'message': 'Service is alive'
    })
