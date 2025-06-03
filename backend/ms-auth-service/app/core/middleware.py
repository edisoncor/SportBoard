# Importa settings para acceder a la configuración global de Django.
from django.conf import settings
# Importa JsonResponse y HttpResponse para retornar respuestas HTTP personalizadas.
from django.http import JsonResponse, HttpResponse

# Importa capture_exception de sentry_sdk para capturar y reportar excepciones a Sentry.
from sentry_sdk import capture_exception


# Middleware personalizado para capturar excepciones y reportarlas a Sentry.
class CaptureExceptionMiddleware:
    def __init__(self, get_response):
        # Almacena la función get_response para procesar las solicitudes.
        self.get_response = get_response

    def __call__(self, request):
        # Procesa la solicitud y retorna la respuesta.
        return self.get_response(request)

    def process_exception(self, request, exception):
        # Si ocurre una excepción, la captura y la reporta a Sentry, retornando una respuesta JSON con el detalle del error.
        if exception:
            capture_exception(exception)
            return JsonResponse(
                {"success": False, "detail": str(exception)}, status=500
            )

