from rest_framework import serializers
from .models import *
from django.conf import settings

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class PlayerAssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayerAssignment
        fields = '__all__'

class CoachAssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoachAssignment
        fields = '__all__'

class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = '__all__'

class PlanningSerializer(serializers.ModelSerializer):
    class Meta:
        model = Planning
        fields = '__all__'

class TeamSerializer(serializers.ModelSerializer):
    logo = serializers.ImageField(required=False, allow_null=True)
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if representation['logo']:
            representation['logo'] = representation['logo'].replace('http://ms2-competencies:8003', 'http://localhost:8000')
        return representation
    
    class Meta:
        model = Team
        fields = '__all__'
        
class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Registration
        fields = '__all__'
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Expandir el objeto squad para incluir información del equipo
        representation['squad'] = {
            'id': instance.squad.id,
            'team': {
                'id': instance.squad.team.id,
                'name': instance.squad.team.name
            }
        }
        return representation

class SquadSerializer(serializers.ModelSerializer):
    players = UserSerializer(many=True, read_only=True)
    coaches = UserSerializer(many=True, read_only=True)
    player_assignments = PlayerAssignmentSerializer(many=True, read_only=True, source='playerassignment_set')
    coach_assignments = CoachAssignmentSerializer(many=True, read_only=True, source='coachassignment_set')
    team = TeamSerializer(read_only=True)  # Añadir esta línea
    registrations = RegistrationSerializer(many=True, read_only=True)  # Añadir esta línea
    
    class Meta:
        model = Squad
        fields = ['id', 'season', 'team', 'players', 'coaches', 
                 'player_assignments', 'coach_assignments', 'registrations']
        read_only_fields = ['players', 'coaches', 'registrations']  # Actualizar read_only_fields

class RuleCompetenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = RuleCompetition
        fields = '__all__'

class RuleDisciplineSerializer(serializers.ModelSerializer):
    class Meta:
        model = RuleDiscipline
        fields = '__all__'

class CompetenceSerializer(serializers.ModelSerializer):
    logo = serializers.ImageField(required=False, allow_null=True)
    rule_list = RuleCompetenceSerializer(many=True, required=False, read_only=True)
    rule_discipline_list = RuleDisciplineSerializer(many=True, required=False, read_only=True)
    competence_format = serializers.PrimaryKeyRelatedField(queryset=Format.objects.all(), required=False, allow_null=True)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if representation['logo']:
            representation['logo'] = representation['logo'].replace('http://ms2-competencies:8003', 'http://localhost:8000')
        
        # Asegurarse de que rule_discipline_list siempre sea una lista
        if representation.get('rule_discipline_list') is None:
            representation['rule_discipline_list'] = []
            
        return representation

    class Meta:
        model = Competence
        fields = '__all__'

class DisciplineSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False, allow_null=True)
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if representation['image']:
            # Solo reemplazar la URL si existe la imagen
            representation['image'] = representation['image'].replace('http://ms2-competencies:8003', 'http://localhost:8000')
        return representation
    
    class Meta:
        model = Discipline
        fields = '__all__'

class CompetenceEditionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompetitionEdition
        fields = '__all__'
        extra_kwargs = {
            'competence': {'required': True},
            'competence_admin': {'required': True},
            'planning': {'required': True},
        }

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        
        # Expandir los objetos relacionados para la respuesta
        competence_data = CompetenceSerializer(instance.competence).data
        # Asegurarse de que la URL de la imagen sea completa
        if competence_data.get('logo') and not competence_data['logo'].startswith('http'):
            competence_data['logo'] = f"http://localhost:8000{competence_data['logo']}"
        representation['competence'] = competence_data

        representation['competence_admin'] = UserSerializer(instance.competence_admin).data
        representation['planning'] = PlanningSerializer(instance.planning).data
        representation['stage_list'] = StageSerializer(instance.stage_list.all(), many=True).data
        
        # Obtener inscripciones y actualizar el campo competencie
        inscriptions = instance.inscription_list.all()
        inscription_data = []
        for inscription in inscriptions:
            inscription_repr = RegistrationSerializer(inscription).data
            inscription_repr['competencie'] = instance.id
            inscription_data.append(inscription_repr)
        
        representation['inscription_list'] = inscription_data
        
        return representation

class StageSerializer(serializers.ModelSerializer):
    time = PlanningSerializer()  # Cambiar para incluir el planning completo
    
    class Meta:
        model = Stage
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if isinstance(instance.time, (int, str)):
            # Si time es un ID, obtener el planning completo
            try:
                planning = Planning.objects.get(id=instance.time)
                representation['time'] = PlanningSerializer(planning).data
            except Planning.DoesNotExist:
                pass
        return representation

class TeamSerializer(serializers.ModelSerializer):
    logo = serializers.ImageField(required=False, allow_null=True)
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if representation['logo']:
            representation['logo'] = representation['logo'].replace('http://ms2-competencies:8003', 'http://localhost:8000')
        return representation
    
    class Meta:
        model = Team
        fields = '__all__'

class LocalitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Locality
        fields = '__all__'

class FormatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Format
        fields = '__all__'