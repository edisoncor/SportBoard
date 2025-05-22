"""
Pruebas automáticas para el microservicio Catalog usando APITestCase.
Valida códigos HTTP, HATEOAS, paginación, respuestas y errores.
"""
from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from .models import CatalogCategory, CatalogItem

class CatalogAPITestCase(APITestCase):
    def setUp(self):
        self.category = CatalogCategory.objects.create(name="Cat1", code="CAT001", level=1)
        self.item = CatalogItem.objects.create(name="Item1", code="ITEM001", category=self.category)

    def test_list_categories(self):
        url = reverse('catalogcategory-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('data', response.data)
        self.assertIn('url', response.data['data'][0])
        self.assertIn('meta', response.data)
        self.assertIn('message', response.data)

    def test_list_items(self):
        url = reverse('catalogitem-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('data', response.data)
        self.assertIn('url', response.data['data'][0])
        self.assertIn('meta', response.data)
        self.assertIn('message', response.data)

    def test_create_category(self):
        url = reverse('catalogcategory-list')
        data = {"name": "Cat2", "code": "CAT002", "level": 2}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('data', response.data)

    def test_create_item(self):
        url = reverse('catalogitem-list')
        data = {"name": "Item2", "code": "ITEM002", "category": reverse('catalogcategory-detail', args=[self.category.code])}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('data', response.data)

    def test_activate_item(self):
        url = reverse('catalogitem-activate', args=[self.item.code])
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['data']['is_active'])

    def test_deactivate_item(self):
        url = reverse('catalogitem-deactivate', args=[self.item.code])
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data['data']['is_active'])

    def test_not_found(self):
        url = reverse('catalogitem-detail', args=["NOEXISTE"])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error']['code'], 404)

    def test_pagination(self):
        # Crear más items para probar paginación
        for i in range(15):
            CatalogItem.objects.create(name=f"Item{i+3}", code=f"ITEM{i+3:03}", category=self.category)
        url = reverse('catalogitem-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('pagination', response.data['meta'])
        self.assertLessEqual(len(response.data['data']), 10)
