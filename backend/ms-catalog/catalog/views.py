from django.shortcuts import render
from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from .models import CatalogCategory, CatalogItem
from .serializers import CatalogCategorySerializer, CatalogItemSerializer
from .pagination import StandardResultsSetPagination
from rest_framework.decorators import action
from catalog.services import activate_item, ConflictError

class CatalogCategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar categorías de catálogo.
    Permite operaciones CRUD y acciones personalizadas sobre categorías.
    """
    queryset = CatalogCategory.objects.all()
    serializer_class = CatalogCategorySerializer
    lookup_field = 'code'
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'code']
    ordering_fields = ['name', 'code', 'level']

    def list(self, request, *args, **kwargs):
        """Lista todas las categorías con paginación y filtros."""
        response = super().list(request, *args, **kwargs)
        return response

    def retrieve(self, request, *args, **kwargs):
        """Obtiene el detalle de una categoría por su código."""
        try:
            return super().retrieve(request, *args, **kwargs)
        except CatalogCategory.DoesNotExist:
            raise NotFound("Categoría no encontrada")

    @action(detail=True, methods=['get'], url_path='list-catalogs')
    def list_catalogs(self, request, code=None):
        """Lista los ítems asociados a la categoría."""
        category = self.get_object()
        items = category.listCatalogs()
        serializer = CatalogItemSerializer(items, many=True, context={'request': request})
        return Response({'data': serializer.data, 'message': 'Ítems listados correctamente'})

    @action(detail=True, methods=['get'], url_path='count-catalogs')
    def count_catalogs(self, request, code=None):
        """Devuelve el conteo de ítems en la categoría."""
        category = self.get_object()
        count = category.countCatalogs()
        return Response({'data': count, 'message': 'Conteo de ítems en la categoría'})

    @action(detail=True, methods=['get'], url_path='exists-catalog-by-code/(?P<item_code>[^/.]+)')
    def exists_catalog_by_code(self, request, code=None, item_code=None):
        """Verifica si existe un ítem por código en la categoría."""
        category = self.get_object()
        exists = category.existsCatalogByCode(item_code)
        return Response({'data': exists, 'message': 'Existencia verificada'})

    @action(detail=True, methods=['post'], url_path='add-catalog')
    def add_catalog(self, request, code=None):
        """Agrega un ítem existente a la categoría."""
        category = self.get_object()
        item_code = request.data.get('item_code')
        try:
            item = CatalogItem.objects.get(code=item_code)
            category.addCatalog(item)
            return Response({'message': 'Ítem agregado correctamente'})
        except CatalogItem.DoesNotExist:
            return Response({'message': 'Ítem no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'], url_path='remove-catalog')
    def remove_catalog(self, request, code=None):
        """Elimina un ítem de la categoría."""
        category = self.get_object()
        item_code = request.data.get('item_code')
        category.removeCatalog(item_code)
        return Response({'message': 'Ítem eliminado correctamente'})

class CatalogItemViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar ítems de catálogo.
    Permite operaciones CRUD y acciones personalizadas sobre ítems.
    """
    queryset = CatalogItem.objects.all()
    serializer_class = CatalogItemSerializer
    lookup_field = 'code'
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'code']
    ordering_fields = ['name', 'code']

    def list(self, request, *args, **kwargs):
        """Lista todos los ítems con paginación y filtros."""
        response = super().list(request, *args, **kwargs)
        return response

    def retrieve(self, request, *args, **kwargs):
        """Obtiene el detalle de un ítem por su código."""
        try:
            return super().retrieve(request, *args, **kwargs)
        except CatalogItem.DoesNotExist:
            raise NotFound("Ítem no encontrado")

    @action(detail=True, methods=['post'], url_path='activate')
    def activate(self, request, code=None):
        """Activa el ítem si no está activo."""
        try:
            item = activate_item(code)
            return Response({"message": "Ítem activado correctamente"}, status=status.HTTP_200_OK)
        except ConflictError as e:
            return Response({"message": str(e)}, status=status.HTTP_409_CONFLICT)
        except Exception as e:
            # Si es NotFound de DRF, devolver 404
            from rest_framework.exceptions import NotFound
            if isinstance(e, NotFound):
                return Response({"message": str(e)}, status=status.HTTP_404_NOT_FOUND)
            return Response({"message": "Error inesperado"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['get'], url_path='get-category')
    def get_category(self, request, code=None):
        """Obtiene la categoría asociada al ítem."""
        item = self.get_object()
        category = item.getCategory()
        serializer = CatalogCategorySerializer(category, context={'request': request})
        return Response({'data': serializer.data, 'message': 'Categoría obtenida correctamente'})

    @action(detail=True, methods=['post'], url_path='change-category')
    def change_category(self, request, code=None):
        """Cambia la categoría del ítem a una nueva categoría."""
        item = self.get_object()
        new_cat_code = request.data.get('new_category_code')
        try:
            new_cat = CatalogCategory.objects.get(code=new_cat_code)
            item.changeCategory(new_cat)
            return Response({'message': 'Categoría cambiada correctamente'})
        except CatalogCategory.DoesNotExist:
            return Response({'message': 'Nueva categoría no encontrada'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['get'], url_path='get-path')
    def get_path(self, request, code=None):
        """Obtiene la ruta jerárquica del ítem dentro del catálogo."""
        item = self.get_object()
        path = item.getPath()
        return Response({'data': path, 'message': 'Ruta obtenida correctamente'})
