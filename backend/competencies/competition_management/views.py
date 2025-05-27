from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework import status
import json
from django.db import transaction
from .models import *
from .serializers import *

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class PlayerAssignmentViewSet(viewsets.ModelViewSet):
    queryset = PlayerAssignment.objects.all()
    serializer_class = PlayerAssignmentSerializer

class CoachAssignmentViewSet(viewsets.ModelViewSet):
    queryset = CoachAssignment.objects.all()
    serializer_class = CoachAssignmentSerializer

class MatchViewSet(viewsets.ModelViewSet):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer

class PlanningViewSet(viewsets.ModelViewSet):
    queryset = Planning.objects.all()
    serializer_class = PlanningSerializer

class SquadViewSet(viewsets.ModelViewSet):
    queryset = Squad.objects.all()
    serializer_class = SquadSerializer

    def get_queryset(self):
        return Squad.objects.all().select_related('team')
        
    def create(self, request, *args, **kwargs):
        team_id = request.data.get('team')
        players_data = request.data.get('players', [])
        coaches_data = request.data.get('coaches', [])

        try:
            with transaction.atomic():
                team = Team.objects.get(id=team_id)
                squad = Squad.objects.create(team=team)
                
                # Agregar la squad al equipo
                team.squads.add(squad)

                # Procesar jugadores
                for player_data in players_data:
                    if isinstance(player_data, dict):
                        # Nuevo jugador - eliminar ID si existe
                        if 'id' in player_data:
                            del player_data['id']
                        player = User.objects.create(**player_data)
                    else:
                        # Jugador existente
                        player = User.objects.get(id=player_data)
                    PlayerAssignment.objects.create(squad=squad, player=player)

                # Procesar entrenadores
                for coach_data in coaches_data:
                    if isinstance(coach_data, dict):
                        # Nuevo entrenador - eliminar ID si existe
                        if 'id' in coach_data:
                            del coach_data['id']
                        coach = User.objects.create(**coach_data)
                    else:
                        # Entrenador existente
                        coach = User.objects.get(id=coach_data)
                    CoachAssignment.objects.create(squad=squad, coach=coach)

                squad.refresh_from_db()
                serializer = self.get_serializer(squad)
                return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        squad = self.get_object()
        team_id = request.data.get('team')
        players_data = request.data.get('players', [])
        coaches_data = request.data.get('coaches', [])
        new_players = request.data.get('new_players', [])
        new_coaches = request.data.get('new_coaches', [])

        try:
            with transaction.atomic():
                # Si el equipo cambió, actualizar las relaciones
                if team_id and team_id != squad.team.id:
                    # Remover la squad del equipo anterior
                    old_team = squad.team
                    old_team.squads.remove(squad)
                    
                    # Asignar al nuevo equipo
                    new_team = Team.objects.get(id=team_id)
                    squad.team = new_team
                    squad.save()
                    
                    # Agregar la squad al nuevo equipo
                    new_team.squads.add(squad)

                # Limpiar asignaciones existentes
                PlayerAssignment.objects.filter(squad=squad).delete()
                CoachAssignment.objects.filter(squad=squad).delete()

                # Crear nuevos usuarios jugadores
                created_players = []
                for player_data in new_players:
                    player_data['role'] = 'Player'
                    if 'id' in player_data:
                        del player_data['id']
                    player = User.objects.create(**player_data)
                    created_players.append(player.id)

                # Crear nuevos usuarios entrenadores
                created_coaches = []
                for coach_data in new_coaches:
                    coach_data['role'] = 'Coach'
                    if 'id' in coach_data:
                        del coach_data['id']
                    coach = User.objects.create(**coach_data)
                    created_coaches.append(coach.id)

                # Combinar IDs existentes con los nuevos
                all_player_ids = [p for p in players_data if isinstance(p, (int, str))] + created_players
                all_coach_ids = [c for c in coaches_data if isinstance(c, (int, str))] + created_coaches

                # Crear asignaciones
                for player_id in all_player_ids:
                    PlayerAssignment.objects.create(
                        squad=squad, 
                        player=User.objects.get(id=player_id)
                    )

                for coach_id in all_coach_ids:
                    CoachAssignment.objects.create(
                        squad=squad, 
                        coach=User.objects.get(id=coach_id)
                    )

                squad.refresh_from_db()
                serializer = self.get_serializer(squad)
                return Response(serializer.data)

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    def destroy(self, request, *args, **kwargs):
        try:
            squad = self.get_object()
            team = squad.team
            
            with transaction.atomic():
                # Remover la squad del equipo
                team.squads.remove(squad)
                # Eliminar la squad
                squad.delete()
                
            return Response(status=status.HTTP_204_NO_CONTENT)
            
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class RegistrationViewSet(viewsets.ModelViewSet):
    queryset = Registration.objects.all()
    serializer_class = RegistrationSerializer

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        registration = serializer.save()
        
        # Actualizar la relación en Squad
        squad = Squad.objects.get(id=request.data['squad'])
        squad.registrations.add(registration)
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # Guardar el squad anterior
        old_squad = instance.squad
        
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        registration = serializer.save()
        
        # Actualizar las relaciones en Squad
        if old_squad.id != registration.squad.id:
            old_squad.registrations.remove(instance)
            registration.squad.registrations.add(instance)
        
        return Response(serializer.data)

    @transaction.atomic
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        squad = instance.squad
        
        # Eliminar la relación en Squad antes de eliminar el registro
        squad.registrations.remove(instance)
        
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

class CompetenceViewSet(viewsets.ModelViewSet):
    queryset = Competence.objects.all()
    serializer_class = CompetenceSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def perform_create(self, serializer):
        competence = serializer.save()
        rules_data = self.request.data.get('rule_list', [])
        for rule_data in rules_data:
            RuleCompetition.objects.create(competence=competence, **rule_data)

    def perform_update(self, serializer):
        competence = serializer.save()
        rules_data = self.request.data.get('rule_list')
        if rules_data:
            try:
                rules_data = json.loads(rules_data)
                competence.rule_list.clear()
                for rule_data in rules_data:
                    rule_id = rule_data.get('id')
                    if rule_id:
                        rule = RuleCompetition.objects.get(id=rule_id)
                        competence.rule_list.add(rule)
            except Exception as e:
                print(f"Error updating rules: {str(e)}")
        return competence

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Convertir el FormData a un diccionario
        data = request.data.dict() if hasattr(request.data, 'dict') else request.data
        
        # Manejar rule_discipline_list
        rule_discipline_list = data.get('rule_discipline_list')
        if rule_discipline_list:
            try:
                # Convertir de string JSON a lista si es necesario
                if isinstance(rule_discipline_list, str):
                    rule_discipline_list = json.loads(rule_discipline_list)
                
                # Asegurarnos de que tenemos una lista
                if isinstance(rule_discipline_list, list):
                    # Obtener los IDs de las reglas
                    rule_ids = []
                    for rule in rule_discipline_list:
                        if isinstance(rule, dict):
                            rule_ids.append(rule.get('id'))
                        elif isinstance(rule, int):
                            rule_ids.append(rule)
                    
                    # Limpiar las reglas existentes y agregar las nuevas
                    instance.rule_discipline_list.clear()
                    if rule_ids:
                        rules = RuleDiscipline.objects.filter(id__in=rule_ids)
                        instance.rule_discipline_list.add(*rules)
            except Exception as e:
                print(f"Error processing rule_discipline_list: {str(e)}")
                return Response(
                    {"error": f"Error processing rule_discipline_list: {str(e)}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Actualizar otros campos
        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        # Refrescar la instancia para obtener los datos actualizados
        instance.refresh_from_db()
        
        # Serializar y devolver la respuesta actualizada
        response_serializer = self.get_serializer(instance)
        return Response(response_serializer.data)

class RuleCompetenceViewSet(viewsets.ModelViewSet):
    queryset = RuleCompetition.objects.all()
    serializer_class = RuleCompetenceSerializer

    def perform_create(self, serializer):
        rule = serializer.save()
        competence_id = self.request.data.get('competence')
        if competence_id:
            try:
                competence = Competence.objects.get(id=competence_id)
                competence.rule_list.add(rule)
            except Competence.DoesNotExist:
                pass
        return rule

class RuleDisciplineViewSet(viewsets.ModelViewSet):
    queryset = RuleDiscipline.objects.all()
    serializer_class = RuleDisciplineSerializer

class DisciplineViewSet(viewsets.ModelViewSet):
    queryset = Discipline.objects.all()
    serializer_class = DisciplineSerializer

class CompetenceEditionViewSet(viewsets.ModelViewSet):
    queryset = CompetitionEdition.objects.all()
    serializer_class = CompetenceEditionSerializer

    def create(self, request, *args, **kwargs):
        try:
            with transaction.atomic():
                # 1. Crear el Planning principal
                planning_data = request.data.get('planning', {})
                planning = Planning.objects.create(
                    start_date=planning_data.get('start_date'),
                    end_date=planning_data.get('end_date')
                )

                # 2. Crear las Stages con sus respectivos Planning
                stages_data = request.data.get('stage_list', [])
                stage_ids = []
                for stage_data in stages_data:
                    stage_planning = Planning.objects.create(
                        start_date=stage_data['time']['start_date'],
                        end_date=stage_data['time']['end_date']
                    )
                    stage = Stage.objects.create(time=stage_planning)
                    stage_ids.append(stage.id)

                # 3. Preparar los datos para la creación de la edición
                edition_data = {
                    'competence': request.data.get('competence'),  # Debe ser ID
                    'competence_admin': request.data.get('competence_admin'),  # Debe ser ID
                    'planning': planning.id,
                    'stage_list': stage_ids,
                    'inscription_list': request.data.get('inscription_list', [])  # Debe ser lista de IDs
                }

                # 4. Crear la edición
                serializer = self.get_serializer(data=edition_data)
                serializer.is_valid(raise_exception=True)
                edition = serializer.save()

                # 5. Agregar las relaciones many-to-many
                if stage_ids:
                    edition.stage_list.set(stage_ids)
                
                if edition_data['inscription_list']:
                    edition.inscription_list.set(edition_data['inscription_list'])
                    # Actualizar el campo competencie de las inscripciones
                    Registration.objects.filter(
                        id__in=edition_data['inscription_list']
                    ).update(competencie=edition)

                # 6. Obtener la instancia actualizada
                instance = self.get_queryset().get(id=edition.id)
                response_serializer = self.get_serializer(instance)

                return Response(
                    response_serializer.data, 
                    status=status.HTTP_201_CREATED
                )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    def update(self, request, *args, **kwargs):
        try:
            with transaction.atomic():
                instance = self.get_object()

                # 1. Actualizar Planning principal
                planning_data = request.data.get('planning', {})
                if planning_data:
                    Planning.objects.filter(id=instance.planning.id).update(
                        start_date=planning_data.get('start_date'),
                        end_date=planning_data.get('end_date')
                    )

                # 2. Actualizar Stages
                new_stages_data = request.data.get('stage_list', [])
                
                # Eliminar stages antiguos
                old_stages = Stage.objects.filter(competition_editions=instance)
                for stage in old_stages:
                    stage.time.delete()  # Esto eliminará también el Planning asociado
                    stage.delete()

                # Crear nuevos stages
                stage_ids = []
                for stage_data in new_stages_data:
                    stage_planning = Planning.objects.create(
                        start_date=stage_data['time']['start_date'],
                        end_date=stage_data['time']['end_date']
                    )
                    stage = Stage.objects.create(time=stage_planning)
                    stage_ids.append(stage.id)

                # 3. Preparar datos para actualización
                edition_data = {
                    'competence': request.data.get('competence'),
                    'competence_admin': request.data.get('competence_admin'),
                    'stage_list': stage_ids,
                    'inscription_list': request.data.get('inscription_list', [])
                }

                # 4. Actualizar la edición
                serializer = self.get_serializer(instance, data=edition_data, partial=True)
                serializer.is_valid(raise_exception=True)
                self.perform_update(serializer)

                # Actualizar inscripciones
                new_inscription_list = request.data.get('inscription_list', [])
                
                # Limpiar competencie de las inscripciones anteriores
                Registration.objects.filter(competencie=instance).update(competencie=None)
                
                # Actualizar con las nuevas inscripciones
                if new_inscription_list:
                    Registration.objects.filter(
                        id__in=new_inscription_list
                    ).update(competencie=instance)

                # 5. Obtener la instancia actualizada
                instance.refresh_from_db()
                response_serializer = self.get_serializer(instance)
                return Response(response_serializer.data)

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    def destroy(self, request, *args, **kwargs):
        try:
            with transaction.atomic():
                instance = self.get_object()
                
                # Limpiar competencie de las inscripciones
                Registration.objects.filter(competencie=instance).update(competencie=None)
                
                # Eliminar stages y sus plannings
                stages = Stage.objects.filter(competition_editions=instance)
                for stage in stages:
                    stage.time.delete()
                    stage.delete()

                # Eliminar planning principal
                instance.planning.delete()
                
                # Eliminar la edición
                self.perform_destroy(instance)
                
                return Response(status=status.HTTP_204_NO_CONTENT)

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class StageViewSet(viewsets.ModelViewSet):
    queryset = Stage.objects.all()
    serializer_class = StageSerializer

    def get_queryset(self):
        return Stage.objects.all().select_related('time')

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Asegurarse de que time está cargado
        if isinstance(instance.time, (int, str)):
            instance.time = Planning.objects.get(id=instance.time)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer

class LocalityViewSet(viewsets.ModelViewSet):
    queryset = Locality.objects.all()
    serializer_class = LocalitySerializer

class FormatViewSet(viewsets.ModelViewSet):
    queryset = Format.objects.all()
    serializer_class = FormatSerializer
