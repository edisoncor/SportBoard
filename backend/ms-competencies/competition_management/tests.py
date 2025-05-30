from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from .models import Catalogue, User, Team

class CatalogueAPITestCase(APITestCase):
    def setUp(self):
        self.catalogue = Catalogue.objects.create(code="CAT01", description="Test Catalogue")

    def test_get_catalogues(self):
        url = reverse('catalogue-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('data', response.data)
        self.assertIn('meta', response.data)
        self.assertIn('pagination', response.data['meta'])
        self.assertIn('url', response.data['data'][0])

    def test_create_catalogue(self):
        url = reverse('catalogue-list')
        data = {"code": "CAT02", "description": "Another Catalogue"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('data', response.data)

    def test_get_not_found(self):
        url = reverse('catalogue-detail', args=[999])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

class UserAPITestCase(APITestCase):
    def setUp(self):
        self.catalogue = Catalogue.objects.create(code="CITY01", description="City")
        self.user = User.objects.create(
            city=self.catalogue, country=self.catalogue, email="test@example.com",
            first_name="Test", last_name="User", location=self.catalogue,
            is_active=True, phone="123456789", province=self.catalogue, password="pass"
        )

    def test_get_users(self):
        url = reverse('user-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('data', response.data)
        self.assertIn('meta', response.data)
        self.assertIn('pagination', response.data['meta'])
        self.assertIn('url', response.data['data'][0])

    def test_create_user_invalid(self):
        url = reverse('user-list')
        data = {"email": "", "first_name": "", "last_name": ""}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class TeamAPITestCase(APITestCase):
    def setUp(self):
        self.catalogue = Catalogue.objects.create(code="NAT01", description="Nationality")
        self.team = Team.objects.create(name="Team1", nationality=self.catalogue)

    def test_get_teams(self):
        url = reverse('team-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('data', response.data)
        self.assertIn('meta', response.data)
        self.assertIn('pagination', response.data['meta'])
        self.assertIn('url', response.data['data'][0])

    def test_create_team(self):
        url = reverse('team-list')
        data = {"name": "Team2", "nationality": self.catalogue.id}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('data', response.data)

    def test_delete_team(self):
        url = reverse('team-detail', args=[self.team.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
