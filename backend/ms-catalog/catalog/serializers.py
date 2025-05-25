from rest_framework import serializers
from .models import CatalogCategory, CatalogItem
from rest_framework.validators import UniqueValidator

class CatalogCategorySerializer(serializers.HyperlinkedModelSerializer):
    """Serializer para CatalogCategory con soporte HATEOAS."""
    url = serializers.HyperlinkedIdentityField(view_name='catalogcategory-detail', lookup_field='code')
    code = serializers.CharField(validators=[UniqueValidator(queryset=CatalogCategory.objects.all())])
    class Meta:
        model = CatalogCategory
        fields = ['url', 'name', 'code', 'version', 'isActive', 'level', 'parent_catalog', 'child_catalogs']
        extra_kwargs = {
            'parent_catalog': {'lookup_field': 'code', 'required': False, 'allow_null': True},
            'child_catalogs': {'read_only': True},
        }

class CatalogItemSerializer(serializers.HyperlinkedModelSerializer):
    """Serializer para CatalogItem con soporte HATEOAS."""
    url = serializers.HyperlinkedIdentityField(view_name='catalogitem-detail', lookup_field='code')
    code = serializers.CharField(validators=[UniqueValidator(queryset=CatalogItem.objects.all())])
    category = serializers.SlugRelatedField(slug_field='code', queryset=CatalogCategory.objects.all())
    class Meta:
        model = CatalogItem
        fields = ['url', 'name', 'code', 'version', 'isActive', 'category', 'parent_catalog', 'child_catalogs']
        extra_kwargs = {
            'parent_catalog': {'lookup_field': 'code', 'required': False, 'allow_null': True},
            'child_catalogs': {'read_only': True},
        }
