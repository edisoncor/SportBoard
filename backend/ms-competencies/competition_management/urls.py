from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'catalogues', CatalogueViewSet)
router.register(r'users', UserViewSet)
router.register(r'athletes', AthleteViewSet)
router.register(r'teams', TeamViewSet)
router.register(r'administrations', AdministrationViewSet)
router.register(r'gamestates', GameStateViewSet)
router.register(r'games', GameViewSet)
router.register(r'markers', MarkerViewSet)
router.register(r'phases', PhaseViewSet)
router.register(r'offers', OfferViewSet)
router.register(r'seasons', SeasonViewSet)
router.register(r'competitions', CompetitionViewSet)
router.register(r'rules', RuleViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'positiontables', PositionTableViewSet)
router.register(r'tableratings', TableRatingViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
