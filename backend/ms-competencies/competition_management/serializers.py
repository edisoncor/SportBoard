from rest_framework import serializers
from .models import Catalogue, User, Athlete, Team, Administration, GameState, Game, Marker, Phase, Offer, Season, Competition, Rule, Category, PositionTable, TableRating

class CatalogueSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Catalogue
        fields = ['url', 'id', 'code', 'description', 'parent_catalog']
        extra_kwargs = {
            'url': {'view_name': 'catalogue-detail', 'lookup_field': 'pk'}
        }

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'id', 'city', 'country', 'email', 'first_name', 'last_name', 'location', 'is_active', 'phone', 'province', 'password']
        extra_kwargs = {
            'url': {'view_name': 'user-detail', 'lookup_field': 'pk'},
            'password': {'write_only': True}
        }

class AthleteSerializer(serializers.HyperlinkedModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Athlete
        fields = ['url', 'id', 'isCoach', 'isCaptain', 'isActive', 'height', 'position', 'weight', 'user']
        extra_kwargs = {
            'url': {'view_name': 'athlete-detail', 'lookup_field': 'pk'}
        }

class TeamSerializer(serializers.HyperlinkedModelSerializer):
    nationality = serializers.PrimaryKeyRelatedField(queryset=Catalogue.objects.all())
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), required=False, allow_null=True)
    class Meta:
        model = Team
        fields = ['url', 'id', 'name', 'nationality', 'category']
        extra_kwargs = {
            'url': {'view_name': 'team-detail', 'lookup_field': 'pk'}
        }

class AdministrationSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Administration
        fields = ['url', 'id', 'city', 'country', 'location', 'isActive', 'name', 'phone', 'province']
        extra_kwargs = {
            'url': {'view_name': 'administration-detail', 'lookup_field': 'pk'}
        }

class GameStateSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = GameState
        fields = ['url', 'id', 'description', 'name']
        extra_kwargs = {
            'url': {'view_name': 'gamestate-detail', 'lookup_field': 'pk'}
        }

class GameSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Game
        fields = ['url', 'id', 'endTime', 'name', 'startTime', 'gameState']
        extra_kwargs = {
            'url': {'view_name': 'game-detail', 'lookup_field': 'pk'}
        }

class MarkerSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Marker
        fields = ['url', 'id', 'local', 'visitor', 'game']
        extra_kwargs = {
            'url': {'view_name': 'marker-detail', 'lookup_field': 'pk'}
        }

class PhaseSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Phase
        fields = ['url', 'id', 'description', 'modality', 'name', 'season', 'category', 'isActive']
        extra_kwargs = {
            'url': {'view_name': 'phase-detail', 'lookup_field': 'pk'}
        }

class OfferSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Offer
        fields = ['url', 'id', 'creationDate', 'description', 'name', 'isStatic', 'phase']
        extra_kwargs = {
            'url': {'view_name': 'offer-detail', 'lookup_field': 'pk'}
        }

class SeasonSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Season
        fields = ['url', 'id', 'champion', 'description', 'endTime', 'hasEnd', 'hasChampion', 'name', 'startDate', 'subChampion', 'competition']
        extra_kwargs = {
            'url': {'view_name': 'season-detail', 'lookup_field': 'pk'}
        }

class CompetitionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Competition
        fields = ['url', 'id', 'creationDate', 'name', 'administration']
        extra_kwargs = {
            'url': {'view_name': 'competition-detail', 'lookup_field': 'pk'}
        }

class RuleSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Rule
        fields = ['url', 'id', 'code', 'description', 'name']
        extra_kwargs = {
            'url': {'view_name': 'rule-detail', 'lookup_field': 'pk'}
        }

class CategorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Category
        fields = ['url', 'id', 'age_init', 'age_end', 'name', 'rule']
        extra_kwargs = {
            'url': {'view_name': 'category-detail', 'lookup_field': 'pk'}
        }

class PositionTableSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = PositionTable
        fields = ['url', 'id', 'position', 'points', 'team']
        extra_kwargs = {
            'url': {'view_name': 'positiontable-detail', 'lookup_field': 'pk'}
        }

class TableRatingSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = TableRating
        fields = ['url', 'id', 'lastUpdate', 'positionTable']
        extra_kwargs = {
            'url': {'view_name': 'tablerating-detail', 'lookup_field': 'pk'}
        }
