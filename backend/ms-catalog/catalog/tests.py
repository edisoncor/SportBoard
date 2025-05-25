from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from catalog.models import CatalogCategory, CatalogItem

class CatalogCategoryAPITestCase(APITestCase):
    def setUp(self):
        self.cat1 = CatalogCategory.objects.create(name="Cat1", code="cat1", level=0)
        self.cat2 = CatalogCategory.objects.create(name="Cat2", code="cat2", level=1, parent_catalog=self.cat1)

    def test_list_categories(self):
        url = reverse('catalogcategory-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('data', response.data)
        self.assertIn('meta', response.data)
        self.assertIn('message', response.data)

    def test_create_category(self):
        url = reverse('catalogcategory-list')
        data = {"name": "Cat3", "code": "cat3", "level": 2}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_retrieve_category(self):
        url = reverse('catalogcategory-detail', args=[self.cat1.code])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], self.cat1.name)

    def test_delete_category(self):
        url = reverse('catalogcategory-detail', args=[self.cat2.code])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_not_found(self):
        url = reverse('catalogcategory-detail', args=["nope"])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_duplicate_code(self):
        url = reverse('catalogcategory-list')
        data = {"name": "CatX", "code": "cat1", "level": 0}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class CatalogItemAPITestCase(APITestCase):
    def setUp(self):
        self.cat = CatalogCategory.objects.create(name="Cat", code="cat", level=0)
        self.item = CatalogItem.objects.create(name="Item1", code="item1", category=self.cat)

    def test_list_items(self):
        url = reverse('catalogitem-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('data', response.data)
        self.assertIn('meta', response.data)
        self.assertIn('message', response.data)

    def test_create_item(self):
        url = reverse('catalogitem-list')
        data = {"name": "Item2", "code": "item2", "category": self.cat.code}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_retrieve_item(self):
        url = reverse('catalogitem-detail', args=[self.item.code])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], self.item.name)

    def test_delete_item(self):
        url = reverse('catalogitem-detail', args=[self.item.code])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_not_found(self):
        url = reverse('catalogitem-detail', args=["nope"])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_duplicate_code(self):
        url = reverse('catalogitem-list')
        data = {"name": "ItemX", "code": "item1", "category": self.cat.code}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_activate_item_endpoint(self):
        # Suponiendo que el endpoint sea /api/v1/catalog/items/{code}/activate/
        url = f"/api/v1/catalog/items/{self.item.code}/activate/"
        response = self.client.post(url)
        self.assertIn(response.status_code, [200, 204, 202, 201])  # Depende de implementación

    def test_activate_item_not_found(self):
        url = f"/api/v1/catalog/items/nope/activate/"
        response = self.client.post(url)
        self.assertEqual(response.status_code, 404)

    def test_activate_item_conflict(self):
        # Activar dos veces para forzar conflicto
        url = f"/api/v1/catalog/items/{self.item.code}/activate/"
        self.client.post(url)  # Primer activación
        response = self.client.post(url)  # Segunda activación
        self.assertIn(response.status_code, [400, 409])
