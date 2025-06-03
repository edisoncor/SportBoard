# Importa el módulo math para operaciones matemáticas, como el redondeo de páginas.
import math

# Importa la paginación por número de página de DRF.
from rest_framework.pagination import PageNumberPagination
# Importa Response para construir respuestas personalizadas de paginación.
from rest_framework.response import Response

# Valor por defecto para la página inicial.
DEFAULT_PAGE = 1

# Paginador personalizado que permite controlar el tamaño de página y la estructura de la respuesta.
class CustomPagination(PageNumberPagination):
    page_size_query_param = "page_size"  # Permite especificar el tamaño de página vía query param.

    def get_paginated_response(self, data):
        # Calcula el total de resultados y páginas.
        total_results = self.page.paginator.count
        total_pages = math.ceil(total_results / self.page_size)
        current_page = int(self.request.GET.get("page", DEFAULT_PAGE))
        page_size = int(self.request.GET.get("page_size", self.page_size))

        # Calcula el número de resultados restantes en la última página.
        remaining_results = total_results % page_size

        # Retorna la respuesta paginada con metadatos y resultados.
        return Response(
            {
                "links": {
                    "next": self.get_next_link(),
                    "previous": self.get_previous_link(),
                },
                "total": total_results,
                "total_pages": total_pages,
                "current_page": current_page,
                "page_size": page_size
                if current_page < total_pages
                else remaining_results,
                "results": data,
            }
        )

# Paginador estándar con tamaño de página por defecto y máximo configurables.
class StandardResultsPagination(PageNumberPagination):
    page_size = 100  # Tamaño de página por defecto.
    page_size_query_param = "page_size"  # Permite modificar el tamaño de página vía query param.
    max_page_size = 1000  # Tamaño máximo permitido para una página.
