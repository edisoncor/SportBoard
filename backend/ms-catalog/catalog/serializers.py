from rest_framework import serializers
from .models import CatalogCategory, CatalogItem
from rest_framework.validators import UniqueValidator

class CatalogCategorySerializer(serializers.HyperlinkedModelSerializer):
    """Serializer para CatalogCategory con soporte HATEOAS."""
    url = serializers.HyperlinkedIdentityField(view_name='catalogcategory-detail', lookup_field='code')
    code = serializers.CharField(validators=[UniqueValidator(queryset=CatalogCategory.objects.all())])
    description = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    parent_catalog = serializers.HyperlinkedRelatedField(
        view_name='catalogcategory-detail',
        lookup_field='code',
        queryset=CatalogCategory.objects.all(),
        required=False,
        allow_null=True
    )
    child_catalogs = serializers.HyperlinkedRelatedField(
        many=True,
        view_name='catalogcategory-detail',
        lookup_field='code',
        read_only=True
    )
    class Meta:
        model = CatalogCategory
        fields = ['url', 'name', 'code', 'description', 'version', 'isActive', 'level', 'parent_catalog', 'child_catalogs']

class CatalogItemSerializer(serializers.ModelSerializer):
    """Serializer para CatalogItem completamente simplificado."""
    category = serializers.SlugRelatedField(slug_field='code', read_only=True)
    
    class Meta:
        model = CatalogItem
        fields = ['name', 'code', 'description', 'version', 'isActive', 'category']
