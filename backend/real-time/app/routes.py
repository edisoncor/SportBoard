from flask import Blueprint, jsonify, request, send_from_directory
from . import db
from .models import *
from datetime import datetime
import os

real_time = Blueprint('real_time', __name__, static_url_path='/static', url_prefix='/real-time')

#@real_time.route('/static/teams/<path:filename>')
#def static_files(filename):
#    return send_from_directory(os.path.join(real_time.root_path, 'static/teams'), filename)

###############################
# Usuarios
###############################
@real_time.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

@real_time.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict())

@real_time.route('/users', methods=['POST'])
def create_user():
    data = request.get_json() or {}
    # Validar que se envíen los campos necesarios
    if 'username' not in data or 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Faltan campos requeridos'}), 400

    new_user = User(
        username=data['username'],
        email=data['email'],
        role=data.get('role', 'normal')  # Asumir 'normal' si no se indica
    )
    new_user.set_password(data['password'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.to_dict()), 201

@real_time.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json() or {}
    user.username = data.get('username', user.username)
    user.email = data.get('email', user.email)
    if 'password' in data:
        user.set_password(data['password'])
    # Puedes actualizar otros campos si es necesario
    db.session.commit()
    return jsonify(user.to_dict())

@real_time.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'Usuario eliminado'}), 200

###############################
# Equipos
###############################
@real_time.route('/teams', methods=['GET'])
def get_teams():
    teams = Team.query.all()
    return jsonify([team.to_dict() for team in teams])

@real_time.route('/teams/<int:team_id>', methods=['GET'])
def get_team(team_id):
    team = Team.query.get_or_404(team_id)
    return jsonify(team.to_dict())

@real_time.route('/teams', methods=['POST'])
def create_team():
    data = request.get_json() or {}
    if 'name' not in data or 'city' not in data:
        return jsonify({'error': 'Faltan campos requeridos'}), 400
    team = Team(
        name=data['name'],
        city=data['city'],
        photo=data.get('photo')
    )
    db.session.add(team)
    db.session.commit()
    return jsonify(team.to_dict()), 201

@real_time.route('/teams/<int:team_id>', methods=['PUT'])
def update_team(team_id):
    team = Team.query.get_or_404(team_id)
    data = request.get_json() or {}
    team.name = data.get('name', team.name)
    team.city = data.get('city', team.city)
    team.photo = data.get('photo', team.photo)
    db.session.commit()
    return jsonify(team.to_dict())

@real_time.route('/teams/<int:team_id>', methods=['DELETE'])
def delete_team(team_id):
    team = Team.query.get_or_404(team_id)
    db.session.delete(team)
    db.session.commit()
    return jsonify({'message': 'Equipo eliminado'}), 200

###############################
# Jugadores
###############################
@real_time.route('/players', methods=['GET'])
def get_players():
    players = Player.query.all()
    return jsonify([player.to_dict() for player in players])

@real_time.route('/players/<int:player_id>', methods=['GET'])
def get_player(player_id):
    player = Player.query.get_or_404(player_id)
    return jsonify(player.to_dict())

@real_time.route('/players', methods=['POST'])
def create_player():
    data = request.get_json() or {}
    if 'name' not in data or 'position' not in data:
        return jsonify({'error': 'Faltan campos requeridos'}), 400
    player = Player(
        name=data['name'],
        position=data['position'],  # Asume que envías el valor correcto del Enum
        photo=data.get('photo'),
        current_team_id=data.get('current_team_id')
    )
    db.session.add(player)
    db.session.commit()
    return jsonify(player.to_dict()), 201

@real_time.route('/players/<int:player_id>', methods=['PUT'])
def update_player(player_id):
    player = Player.query.get_or_404(player_id)
    data = request.get_json() or {}
    player.name = data.get('name', player.name)
    player.position = data.get('position', player.position)
    player.photo = data.get('photo', player.photo)
    player.current_team_id = data.get('current_team_id', player.current_team_id)
    db.session.commit()
    return jsonify(player.to_dict())

@real_time.route('/players/<int:player_id>', methods=['DELETE'])
def delete_player(player_id):
    player = Player.query.get_or_404(player_id)
    db.session.delete(player)
    db.session.commit()
    return jsonify({'message': 'Jugador eliminado'}), 200

###############################
# Entrenadores
###############################
@real_time.route('/coaches', methods=['GET'])
def get_coaches():
    coaches = Coach.query.all()
    return jsonify([coach.to_dict() for coach in coaches])

@real_time.route('/coaches/<int:coach_id>', methods=['GET'])
def get_coach(coach_id):
    coach = Coach.query.get_or_404(coach_id)
    return jsonify(coach.to_dict())

@real_time.route('/coaches', methods=['POST'])
def create_coach():
    data = request.get_json() or {}
    if 'name' not in data or 'start_date' not in data:
        return jsonify({'error': 'Faltan campos requeridos'}), 400
    try:
        start_date = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'error': 'Formato de fecha inválido, use YYYY-MM-DD'}), 400
    coach = Coach(
        name=data['name'],
        start_date=start_date,
        current_team_id=data.get('current_team_id')
    )
    db.session.add(coach)
    db.session.commit()
    return jsonify(coach.to_dict()), 201

@real_time.route('/coaches/<int:coach_id>', methods=['PUT'])
def update_coach(coach_id):
    coach = Coach.query.get_or_404(coach_id)
    data = request.get_json() or {}
    coach.name = data.get('name', coach.name)
    if 'start_date' in data:
        try:
            coach.start_date = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'error': 'Formato de fecha inválido, use YYYY-MM-DD'}), 400
    coach.current_team_id = data.get('current_team_id', coach.current_team_id)
    db.session.commit()
    return jsonify(coach.to_dict())

@real_time.route('/coaches/<int:coach_id>', methods=['DELETE'])
def delete_coach(coach_id):
    coach = Coach.query.get_or_404(coach_id)
    db.session.delete(coach)
    db.session.commit()
    return jsonify({'message': 'Entrenador eliminado'}), 200

###############################
# Temporadas
###############################
@real_time.route('/seasons', methods=['GET'])
def get_seasons():
    seasons = Season.query.all()
    return jsonify([season.to_dict() for season in seasons])

@real_time.route('/seasons/<int:season_id>', methods=['GET'])
def get_season(season_id):
    season = Season.query.get_or_404(season_id)
    return jsonify(season.to_dict())

@real_time.route('/seasons', methods=['POST'])
def create_season():
    data = request.get_json() or {}
    if 'start_date' not in data or 'end_date' not in data or 'competition_id' not in data:
        return jsonify({'error': 'Faltan campos requeridos'}), 400
    try:
        start_date = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
        end_date = datetime.strptime(data['end_date'], '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'error': 'Formato de fecha inválido, use YYYY-MM-DD'}), 400

    season = Season(
        start_date=start_date,
        end_date=end_date,
        competition_id=data['competition_id']
    )
    db.session.add(season)
    db.session.commit()
    return jsonify(season.to_dict()), 201

@real_time.route('/seasons/<int:season_id>', methods=['PUT'])
def update_season(season_id):
    season = Season.query.get_or_404(season_id)
    data = request.get_json() or {}
    if 'start_date' in data:
        try:
            season.start_date = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'error': 'Formato de fecha inválido, use YYYY-MM-DD'}), 400
    if 'end_date' in data:
        try:
            season.end_date = datetime.strptime(data['end_date'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'error': 'Formato de fecha inválido, use YYYY-MM-DD'}), 400
    season.competition_id = data.get('competition_id', season.competition_id)
    # Puedes actualizar current_phase, current_phase_int, etc.
    db.session.commit()
    return jsonify(season.to_dict())

@real_time.route('/seasons/<int:season_id>', methods=['DELETE'])
def delete_season(season_id):
    season = Season.query.get_or_404(season_id)
    db.session.delete(season)
    db.session.commit()
    return jsonify({'message': 'Temporada eliminada'}), 200

###############################
# Competiciones
###############################
@real_time.route('/competitions', methods=['GET'])
def get_competitions():
    competitions = Competition.query.all()
    return jsonify([comp.to_dict() for comp in competitions])

@real_time.route('/competitions/<int:competition_id>', methods=['GET'])
def get_competition(competition_id):
    competition = Competition.query.get_or_404(competition_id)
    return jsonify(competition.to_dict())

@real_time.route('/competitions', methods=['POST'])
def create_competition():
    data = request.get_json() or {}
    if 'name' not in data or 'type' not in data:
        return jsonify({'error': 'Faltan campos requeridos'}), 400
    competition = Competition(
        name=data['name'],
        type=data['type'],  # Se espera que se envíe el valor correcto del Enum
        team_limit=data.get('team_limit')
    )
    db.session.add(competition)
    db.session.commit()
    return jsonify(competition.to_dict()), 201

@real_time.route('/competitions/<int:competition_id>', methods=['PUT'])
def update_competition(competition_id):
    competition = Competition.query.get_or_404(competition_id)
    data = request.get_json() or {}
    competition.name = data.get('name', competition.name)
    competition.type = data.get('type', competition.type)
    competition.team_limit = data.get('team_limit', competition.team_limit)
    db.session.commit()
    return jsonify(competition.to_dict())

@real_time.route('/competitions/<int:competition_id>', methods=['DELETE'])
def delete_competition(competition_id):
    competition = Competition.query.get_or_404(competition_id)
    db.session.delete(competition)
    db.session.commit()
    return jsonify({'message': 'Competición eliminada'}), 200

###############################
# Partidos
###############################
@real_time.route('/matches', methods=['GET'])
def get_matches():
    # Opcional: filtrar por fecha, temporada, etc.
    fecha_str = request.args.get('fecha')
    query = Match.query
    if fecha_str:
        try:
            fecha = datetime.strptime(fecha_str, '%Y-%m-%d').date()
            query = query.filter(Match.date == fecha)
        except ValueError:
            return jsonify({'error': 'Formato de fecha inválido, use YYYY-MM-DD'}), 400
    matches = query.all()
    return jsonify([m.to_dict() for m in matches])

@real_time.route('/matches/<int:match_id>', methods=['GET'])
def get_match(match_id):
    match = Match.query.get_or_404(match_id)
    return jsonify(match.to_dict())

@real_time.route('/matches', methods=['POST'])
def create_match():
    data = request.get_json() or {}
    # Se espera que se envíen home_team_id, away_team_id, season_id y date (en formato YYYY-MM-DD o YYYY-MM-DDTHH:MM:SS)
    try:
        match_date = datetime.fromisoformat(data['date'])
    except (KeyError, ValueError):
        return jsonify({'error': 'Campo date inválido o ausente'}), 400

    match = Match(
        status=data.get('status', 'to_be_played'),
        home_team_id=data['home_team_id'],
        away_team_id=data['away_team_id'],
        season_id=data.get('season_id'),
        date=match_date
    )
    db.session.add(match)
    db.session.commit()

    from .statistics_service import inicializar_estadisticas_partido
    inicializar_estadisticas_partido(match)
    return jsonify(match.to_dict()), 201

@real_time.route('/matches/<int:match_id>', methods=['PUT'])
def update_match(match_id):
    match = Match.query.get_or_404(match_id)
    data = request.get_json() or {}
    if 'date' in data:
        try:
            match.date = datetime.fromisoformat(data['date'])
        except ValueError:
            return jsonify({'error': 'Formato de date inválido'}), 400
    match.status = data.get('status', match.status)
    # Actualizar otros campos si es necesario
    db.session.commit()
    return jsonify(match.to_dict())

@real_time.route('/matches/<int:match_id>', methods=['DELETE'])
def delete_match(match_id):
    match = Match.query.get_or_404(match_id)
    db.session.delete(match)
    db.session.commit()
    return jsonify({'message': 'Partido eliminado'}), 200

###############################
# Eventos
###############################
@real_time.route('/events', methods=['GET'])
def get_events():
    match_id = request.args.get('match_id', type=int)
    if match_id:
        events = Event.query.filter_by(match_id=match_id).order_by(Event.minute).all()
    else:
        events = Event.query.all()
    return jsonify([event.to_dict() for event in events])

@real_time.route('/events/<int:event_id>', methods=['GET'])
def get_event(event_id):
    event = Event.query.get_or_404(event_id)
    return jsonify(event.to_dict())

@real_time.route('/events', methods=['POST'])
def create_event():
    data = request.get_json() or {}
    if 'match_id' not in data or 'event_type' not in data or 'minute' not in data:
        return jsonify({'error': 'Faltan campos requeridos'}), 400
    event = Event(
        match_id=data['match_id'],
        event_type=data['event_type'],
        minute=data['minute'],
        team_id=data.get('team_id'),
        player_id=data.get('player_id'),
        related_player_id=data.get('related_player_id')
    )
    db.session.add(event)
    db.session.commit()

    from .statistics_service import actualizar_estadisticas_por_evento
    actualizar_estadisticas_por_evento(event)
    return jsonify(event.to_dict()), 201

@real_time.route('/events/<int:event_id>', methods=['PUT'])
def update_event(event_id):
    event = Event.query.get_or_404(event_id)
    data = request.get_json() or {}
    event.event_type = data.get('event_type', event.event_type)
    event.minute = data.get('minute', event.minute)
    event.team_id = data.get('team_id', event.team_id)
    event.player_id = data.get('player_id', event.player_id)
    event.related_player_id = data.get('related_player_id', event.related_player_id)
    db.session.commit()
    return jsonify(event.to_dict())

@real_time.route('/events/<int:event_id>', methods=['DELETE'])
def delete_event(event_id):
    event = Event.query.get_or_404(event_id)
    db.session.delete(event)
    db.session.commit()
    return jsonify({'message': 'Evento eliminado'}), 200

###############################
# Estadísticas (Ejemplos)
###############################
""" Se las comenta porque dan problemas con rutas de más abajo
# Devuelve TODOS los objetos PlayerStatistic (estadisticas de jugadores en temporadas)
@real_time.route('/player-statistics', methods=['GET'])
def get_player_statistics():
    stats = PlayerStatistic.query.all()
    return jsonify([s.to_dict() for s in stats])

#Obtener estadísticas de jugador en determinada temporada
@real_time.route('/player-statistics/<int:stat_id>', methods=['GET'])
def get_player_statistic(stat_id):
    stat = PlayerStatistic.query.get_or_404(stat_id)
    return jsonify(stat.to_dict())

# Devuelve TODOS los objetos de tipo PlayerMatchStatistic (estadísticas de jugadores en partidos)
@real_time.route('/player-match-statistics', methods=['GET'])
def get_player_match_statistics():
    stats = PlayerMatchStatistic.query.all()
    return jsonify([s.to_dict() for s in stats])

# Devuelve TODOS los objetos de tipo TeamStatistic (estadísticas de equipos en temporadas)
@real_time.route('/team-statistics', methods=['GET'])
def get_team_statistics():
    stats = TeamStatistic.query.all()
    return jsonify([s.to_dict() for s in stats])

# Devuelve TODOS los objetos de tipo TeamMatchStatistic (estadísticas de equipos en partidos)
@real_time.route('/team-match-statistics', methods=['GET'])
def get_team_match_statistics():
    stats = TeamMatchStatistic.query.all()
    return jsonify([s.to_dict() for s in stats])

# Devuelve TODOS los objetos de tipo MatchStatistic (estadísticas de todos los partidos)
@real_time.route('/match-statistics', methods=['GET'])
def get_match_statistics():
    stats = MatchStatistic.query.all()
    return jsonify([s.to_dict() for s in stats])
"""
###################################
#ENDPOINTS PARA USUARIOS NORMALES
# Obtener partidos de cualquier día para cada competencia
@real_time.route('/matches/by-day', methods=['GET'])
def matches_by_day():
    """
    Devuelve, para cada competencia, la temporada actual y los partidos
    que se juegan en la fecha indicada (por defecto, hoy).
    """
    # Se obtiene la fecha desde los parámetros de la query; por defecto, hoy
    fecha_str = request.args.get('date', datetime.today().strftime('%Y-%m-%d'))  # Cambiar a YYYY-MM-DD

    try:
        day = datetime.strptime(fecha_str, '%Y-%m-%d').date()  # ✅ Usar el formato correcto
    except ValueError:
        return jsonify({'error': 'Formato de fecha inválido. Use YYYY-MM-DD.'}), 400


    # Se obtienen todas las competencias (podrías filtrarlas según tus necesidades)
    competitions = Competition.query.all()
    result = []
    for comp in competitions:
        # Se asume que Competition tiene una relación o propiedad current_season.
        current_season = comp.current_season  # O bien: comp.current_season si lo definiste en el modelo
        if current_season:
            # Filtrar los partidos cuyo Match.date (convertido a date) sea igual al día indicado
            matches = Match.query.filter(
                Match.season_id == current_season.id,
                db.func.date(Match.date) == day
            ).all()
            result.append({
                'competition': comp.to_dict(),
                'season': current_season.to_dict(),
                'matches': [m.to_dict() for m in matches]
            })
    return jsonify(result)

# Obtener partidos de cualquier día para cada competencia, filtrados por estado partido
@real_time.route('/matches/filter', methods=['GET'])
def matches_filtered():
    # Se requiere enviar el parámetro 'date'
    # Se obtiene la fecha desde los parámetros de la query; por defecto, hoy
    fecha_str = request.args.get('date', datetime.today().strftime('%Y-%m-%d'))  # Cambiar a YYYY-MM-DD

    try:
        day = datetime.strptime(fecha_str, '%Y-%m-%d').date()  # ✅ Usar el formato correcto
    except ValueError:
        return jsonify({'error': 'Formato de fecha inválido. Use YYYY-MM-DD.'}), 400

    # Se pueden recibir múltiples estados separados por comas: e.g., "playing,to_be_played,finished"
    statuses = request.args.get('status')

    competitions = Competition.query.all()
    result = []

    for comp in competitions:
        # Se asume que Competition tiene una relación o propiedad current_season.
        current_season = comp.current_season  # O bien: comp.current_season si lo definiste en el modelo
        if current_season:
            # Filtrar los partidos cuyo Match.date (convertido a date) sea igual al día indicado
            query = Match.query.filter(
                Match.season_id == current_season.id,
                db.func.date(Match.date) == day)
            if statuses:
                status_list = statuses.split(',')
                query = query.filter(Match.status.in_(status_list))

                        

            matches = query.all()
            result.append({
                'competition': comp.to_dict(),
                'season': current_season.to_dict(),
                'matches': [m.to_dict() for m in matches]
            })
    return jsonify(result)

    query = Match.query.filter(db.func.date(Match.date) == day)
    if statuses:
        status_list = statuses.split(',')
        query = query.filter(Match.status.in_(status_list))

    matches = query.all()
    return jsonify([m.to_dict() for m in matches])

    # Por defecto la fecha de hoy
    fecha_str = request.args.get('fecha', datetime.today().strftime('%Y-%m-%d'))
    try:
        fecha = datetime.strptime(fecha_str, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'error': 'Fecha inválida. Use formato YYYY-MM-DD.'}), 400

    # Se pueden recibir múltiples estados separados por coma: e.g., "playing,to_be_played"
    statuses = request.args.get('status', None)
    query = Match.query.filter(db.func.date(Match.date) == fecha)
    if statuses:
        status_list = statuses.split(',')
        query = query.filter(Match.status.in_(status_list))

    matches = query.all()
    return jsonify([m.to_dict() for m in matches])

#Obtener estadísticas de jugadores en el partido para cada equipo
@real_time.route('/matches/<int:match_id>/player-stats', methods=['GET'])
def players_stats_by_match(match_id):
    team_id = request.args.get('team_id', type=int)
    if not team_id:
        return jsonify({'error': 'Debe enviar team_id'}), 400

    # Obtener los jugadores del equipo
    players = Player.query.filter_by(current_team_id=team_id).all()
    player_ids = [player.id for player in players]

    # Obtener las estadísticas de los jugadores en el partido
    stats = PlayerMatchStatistic.query.filter(
        PlayerMatchStatistic.match_id == match_id,
        PlayerMatchStatistic.player_id.in_(player_ids)
    ).all()

    return jsonify([s.to_dict() for s in stats])

#Obtener estadísticas de jugador en la temporada
@real_time.route('/player-statistics/<int:player_id>', methods=['GET'])
def get_player_season_stats(player_id):
    season = request.args.get('season_id', type=int)

    if season is None:
        return jsonify({'error': 'Parámetro season_id es requerido'}), 400

    # 🚨 Verificar qué se está consultando antes de hacer .first()
    stats_query = PlayerStatistic.query.filter(
        PlayerStatistic.player_id == player_id,
        PlayerStatistic.season_id == season
    )

    print("🔍 Consulta SQL generada:", stats_query)  # 🚀 Agregar este log

    stat = stats_query.first()  # Obtener solo un resultado

    if not stat:
        return jsonify({'error': 'Estadísticas no encontradas'}), 404

    return jsonify(stat.to_dict())


# Obtener estadísticas de cada equipo en el partido (TeamMatchStatistic)
@real_time.route('/matches/<int:match_id>/team-stats', methods=['GET'])
def team_match_stats(match_id):
    # Se asume que se reciben estadísticas de ambos equipos
    stats = TeamMatchStatistic.query.filter_by(match_id=match_id).all()
    return jsonify([s.to_dict() for s in stats])

# Obtener estadísticas agrupadas del partido (MatchStatistic)
@real_time.route('/matches/<int:match_id>/stats', methods=['GET'])
def match_stats(match_id):
    # Como se busca la estadística de un objeto partido, solo retorna UN OBJETO
    #stat = MatchStatistic.query.get_or_404(match_id) // Busca en la bd donde el id = match_id (no me sirve)
    stat = MatchStatistic.query.filter_by(match_id=match_id).first()
    return jsonify(stat.to_dict() if stat else {})
    #stats = MatchStatistic.query.filter_by(match_id=match_id).all()
    #return jsonify([s.to_dict() for s in stats])

#Obtener estadísticas de equipo en la temporada (TeamStatistic)
@real_time.route('/team-statistics', methods=['GET'])
def get_team_season_stats():
    season_id = request.args.get('season_id', type=int)
    if not season_id:
        return jsonify({'error': 'Debe enviar season_id'}), 400
    stats = TeamStatistic.query.filter_by(season_id=season_id).all()
    return jsonify([s.to_dict() for s in stats])

#Obtener todos los eventos asociados al partido
@real_time.route('/matches/<int:match_id>/events', methods=['GET'])
def get_match_events(match_id):
    events = Event.query.filter_by(match_id=match_id).all()
    return jsonify([e.to_dict() for e in events])

# (tabla de clasificación)
@real_time.route('/team-statistics/classification', methods=['GET'])
def team_classification():
    season_id = request.args.get('season_id', type=int)
    if not season_id:
        return jsonify({'error': 'Debe enviar season_id'}), 400
    stats = TeamStatistic.query.filter_by(season_id=season_id).order_by(TeamStatistic.points.desc(), TeamStatistic.goal_difference.desc()).all()
    result = []
    for stat in stats:
        team = Team.query.get(stat.team_id)
        stat_dict = stat.to_dict()
        stat_dict['team_id'] = team.to_dict()
        result.append(stat_dict)
    return result
    #return jsonify([s.to_dict() for s in stats])

#ENDPOINTS PARA ÁRBITROS

# Anteriores
"""
# Obtener todos los partidos
@api.route('/partidos', methods=['GET'])
def get_partidos():
    partidos = Partido.query.all()
    result = [
        {
            "id": partido.id,
            "equipo_local": partido.equipo_local,
            "equipo_visitante": partido.equipo_visitante,
            "fecha": partido.fecha.isoformat(),  # Convertir fecha a string en formato ISO
            "eventos": [{"id": evento.id, "tipo": evento.tipo, "minuto": evento.minuto} for evento in partido.eventos]
        }
        for partido in partidos
    ]
    return jsonify({"message": "Lista de partidos", "data": result}), 200
    #return jsonify(result), 200

# Obtener todos los eventos
@api.route('/eventos', methods=['GET'])
def get_eventos():
    eventos = Evento.query.all()
    result = [
        {
            "id": evento.id,
            "tipo": evento.tipo,
            "minuto": evento.minuto,
            "partido_id": evento.partido_id
        }
        for evento in eventos
    ]
    return jsonify({"message": "Lista de eventos", "data": result}), 200

# Crear un nuevo evento
@api.route('/eventos', methods=['POST'])
def create_evento():
    data = request.json

    # Validar datos
    if not data or "tipo" not in data or "minuto" not in data or "partido_id" not in data:
        return jsonify({"error": "Faltan datos obligatorios"}), 400

    # Validar partido asociado
    partido = Partido.query.get(data["partido_id"])
    if not partido:
        return jsonify({"error": "El partido asociado no existe"}), 404

    # Crear nuevo evento
    nuevo_evento = Evento(
        tipo=data["tipo"],
        minuto=data["minuto"],
        partido_id=data["partido_id"]
    )
    db.session.add(nuevo_evento)
    db.session.commit()

    return jsonify({
        "message": "Evento creado con éxito",
        "data": {
            "id": nuevo_evento.id,
            "tipo": nuevo_evento.tipo,
            "minuto": nuevo_evento.minuto,
            "partido_id": nuevo_evento.partido_id
        }
    }), 201"""

# Aquí irán los endpoints de las APIs
"""@api.route('/partidos', methods=['GET'])
def get_partidos():
    return jsonify({"message": "Lista de partidos", "data": []})

# Endpoint de ejemplo
@api.route('/partidos', methods=['POST'])
def create_partido():
    data = request.json
    if not data:
        return jsonify({"error": "No se enviaron datos"}), 400
    return jsonify({"message": "Partido creado", "data": data}), 201"""