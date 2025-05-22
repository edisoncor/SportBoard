"""
Serializadores para los modelos de catálogo, usando HyperlinkedModelSerializer para HATEOAS.
"""
from rest_framework import serializers
from .models import CatalogCategory, CatalogItem

class CatalogItemSerializer(serializers.HyperlinkedModelSerializer):
    """
    Serializador para CatalogItem, incluye hipervínculos HATEOAS.
    """
    category = serializers.HyperlinkedRelatedField(
        view_name='catalogcategory-detail',
        lookup_field='code',
        queryset=CatalogCategory.objects.all()
    )
    class Meta:
        model = CatalogItem
        fields = ['url', 'code', 'name', 'version', 'category', 'is_active']
        extra_kwargs = {
            'url': {'view_name': 'catalogitem-detail', 'lookup_field': 'code'},
        }

class CatalogCategorySerializer(serializers.HyperlinkedModelSerializer):
    """
    Serializador para CatalogCategory, incluye hipervínculos HATEOAS y lista de items.
    """
    catalogs = serializers.HyperlinkedRelatedField(
        many=True,
        read_only=True,
        view_name='catalogitem-detail',
        lookup_field='code'
    )
    parentCatalog = serializers.HyperlinkedRelatedField(
        view_name='catalogcategory-detail',
        lookup_field='code',
        queryset=CatalogCategory.objects.all(),
        allow_null=True,
        required=False
    )
    class Meta:
        model = CatalogCategory
        fields = ['url', 'code', 'name', 'version', 'level', 'parentCatalog', 'catalogs']
        extra_kwargs = {
            'url': {'view_name': 'catalogcategory-detail', 'lookup_field': 'code'},
        }
