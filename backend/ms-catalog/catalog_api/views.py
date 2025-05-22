"""
Vistas para la API de catálogo, usando ModelViewSet, paginación y respuestas estandarizadas.
"""
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import CatalogCategory, CatalogItem
from .serializers import CatalogCategorySerializer, CatalogItemSerializer
from .services import activate_item, deactivate_item
from drf_yasg.utils import swagger_auto_schema
from rest_framework.exceptions import ValidationError, NotAuthenticated, PermissionDenied
from django.db import IntegrityError

class StandardizedResponseMixin:
    """
    Mixin para estandarizar las respuestas de la API y mapear códigos HTTP REST.
    """
    def finalize_response(self, request, response, *args, **kwargs):
        # Mapear errores DRF y Django a códigos HTTP y formato estándar
        if isinstance(response.data, dict) and ('error' in response.data or 'detail' in response.data):
            # Adaptar errores DRF
            if 'detail' in response.data:
                detail = response.data['detail']
                code = response.status_code
                # Mapear errores comunes
                if code == 403 or isinstance(detail, PermissionDenied):
                    code = 403
                elif code == 401 or isinstance(detail, NotAuthenticated):
                    code = 401
                elif code == 404:
                    code = 404
                elif code == 400 or isinstance(detail, ValidationError):
                    code = 400
                elif code == 409 or isinstance(detail, IntegrityError):
                    code = 409
                response.data = {
                    'error': {
                        'code': code,
                        'message': str(detail)
                    }
                }
            # Si ya viene con 'error', mantener formato
            return super().finalize_response(request, response, *args, **kwargs)
        data = response.data
        meta = {}
        # Paginación solo si data es lista y paginada
        if hasattr(response, 'paginator') and response.paginator and isinstance(data, list):
            meta['pagination'] = {
                'count': response.paginator.page.paginator.count,
                'page': response.paginator.page.number,
                'page_size': response.paginator.page.paginator.per_page,
                'num_pages': response.paginator.page.paginator.num_pages,
            }
        # Si data es dict con 'results', es paginación DRF
        if isinstance(data, dict) and 'results' in data:
            meta['pagination'] = {
                'count': data.get('count', 0),
                'page': int(request.GET.get('page', 1)),
                'page_size': int(request.GET.get('page_size', 10)),
                'num_pages': (data.get('count', 0) + int(request.GET.get('page_size', 10)) - 1) // int(request.GET.get('page_size', 10)),
            }
            data = data['results']
        response.data = {
            'data': data,
            'meta': meta,
            'message': 'Operación exitosa'
        }
        return super().finalize_response(request, response, *args, **kwargs)

class CatalogCategoryViewSet(StandardizedResponseMixin, viewsets.ModelViewSet):
    """
    ViewSet para categorías de catálogo.
    Permite listar, crear, actualizar y eliminar categorías, así como exponer operaciones jerárquicas y de conteo sobre los items asociados.
    """
    queryset = CatalogCategory.objects.all()
    serializer_class = CatalogCategorySerializer
    lookup_field = 'code'

    @swagger_auto_schema(operation_description="Devuelve el nivel jerárquico de la categoría.")
    @action(detail=True, methods=['get'])
    def level(self, request, code=None):
        """Devuelve el nivel de la categoría."""
        category = self.get_object()
        return Response({'level': category.getLevel()})

    @swagger_auto_schema(operation_description="Lista los items asociados a la categoría, con paginación y formato HATEOAS.")
    @action(detail=True, methods=['get'])
    def items(self, request, code=None):
        """Lista los items de la categoría."""
        category = self.get_object()
        items = category.listCatalogs()
        page = self.paginate_queryset(items)
        serializer = CatalogItemSerializer(page, many=True, context={'request': request})
        return self.get_paginated_response(serializer.data) if page is not None else Response(serializer.data)

    @swagger_auto_schema(operation_description="Devuelve la cantidad de items asociados a la categoría.")
    @action(detail=True, methods=['get'])
    def count(self, request, code=None):
        """Cuenta los items de la categoría."""
        category = self.get_object()
        return Response({'count': category.countCatalogs()})

    @swagger_auto_schema(operation_description="Verifica si existe un item por código en la categoría. Parámetro: item_code (query param)")
    @action(detail=True, methods=['get'])
    def exists(self, request, code=None):
        """Verifica si existe un item por código en la categoría."""
        category = self.get_object()
        item_code = request.query_params.get('item_code')
        exists = category.existsCatalogByCode(item_code) if item_code else False
        return Response({'exists': exists})

    @swagger_auto_schema(operation_description="Agrega un nuevo item a la categoría. El body debe contener los datos del item (name, code, version, etc.).")
    @action(detail=True, methods=['post'])
    def add_item(self, request, code=None):
        """Agrega un item a la categoría."""
        category = self.get_object()
        item_data = request.data.copy()
        item_data['category'] = category.pk
        serializer = CatalogItemSerializer(data=item_data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @swagger_auto_schema(operation_description="Elimina un item de la categoría por código. El body debe contener el campo 'item_code'.")
    @action(detail=True, methods=['post'])
    def remove_item(self, request, code=None):
        """Elimina un item de la categoría por código."""
        category = self.get_object()
        item_code = request.data.get('item_code')
        category.removeCatalog(item_code)
        return Response(status=status.HTTP_204_NO_CONTENT)

class CatalogItemViewSet(StandardizedResponseMixin, viewsets.ModelViewSet):
    """
    ViewSet para items de catálogo.
    """
    queryset = CatalogItem.objects.all()
    serializer_class = CatalogItemSerializer
    lookup_field = 'code'

    @action(detail=True, methods=['post'])
    def activate(self, request, code=None):
        try:
            item = activate_item(code)
            serializer = self.get_serializer(item)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': {'code': 404, 'message': str(e)}}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'])
    def deactivate(self, request, code=None):
        try:
            item = deactivate_item(code)
            serializer = self.get_serializer(item)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': {'code': 404, 'message': str(e)}}, status=status.HTTP_404_NOT_FOUND)

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        obj = queryset.filter(code=self.kwargs.get('code')).first()
        if obj is None:
            from rest_framework.exceptions import NotFound
            raise NotFound('No CatalogItem matches the given query.')
        self.check_object_permissions(self.request, obj)
        return obj

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError as e:
            return Response({'error': {'code': 409, 'message': 'Conflicto de duplicidad o estado inconsistente'}}, status=409)
        except ValidationError as e:
            return Response({'error': {'code': 400, 'message': str(e)}}, status=400)

    def destroy(self, request, *args, **kwargs):
        response = super().destroy(request, *args, **kwargs)
        response.status_code = 204
        response.data = None
        return response
