from datetime import datetime
from . import db
from .models import (
    Match,
    Player,
    PlayerMatchStatistic,
    PlayerStatistic,
    Team,
    TeamMatchStatistic,
    TeamStatistic,
    Event,
    Competition,
    Season
)

# Al crear un partido, se generan las estadisticas-partido para cada jugador y equipo
def inicializar_estadisticas_partido(match):
    """
    Inicializa las estadísticas de partido para cada jugador y equipo involucrado en el partido.
    Se asume que 'match' tiene definidas las relaciones a los equipos y que cada equipo tiene sus jugadores.
    """
    # Inicializar estadísticas para el equipo de casa y el equipo visitante
    equipos = []
    if match.home_team:
        equipos.append(match.home_team)
    if match.away_team:
        equipos.append(match.away_team)
    
    for team in equipos:
        # Estadísticas de equipo en el partido
        team_match_stat = TeamMatchStatistic(
            team_id=team.id,
            match_id=match.id,
            shots=0,
            shots_to_goal=0,
            possession=0.0,  # Valor inicial (50), se puede calcular dinámicamente
            passes=0,
            fouls=0,
            yellow_cards=0,
            red_cards=0,
            offsides=0,
            corners=0
        )
        db.session.add(team_match_stat)
        
        # Estadísticas de cada jugador del equipo en el partido
        # Se asume que 'team.players' es la lista de jugadores actuales del equipo.
        for player in team.players:
            player_match_stat = PlayerMatchStatistic(
                player_id=player.id,
                match_id=match.id,
                minutes_played=0,
                goals=0,
                assists=0,
                fouls=0,
                yellow_cards=0,
                red_cards=0
            )
            db.session.add(player_match_stat)
    
    db.session.commit()

# Al completar equipos en una temporada, se generan estadisticas-temporada para equipos y jugadores
# VER DONDE SE LLAMA A ESTA FUNCION
def inicializar_estadisticas_temporada(season):
    """
    Inicializa las estadísticas de temporada para cada equipo y jugador asociado a la temporada.
    Se asume que 'season.teams' contiene los equipos participantes en la temporada.
    """
    for team in season.teams:
        # Estadísticas de equipo en la temporada
        team_stat = TeamStatistic(
            team_id=team.id,
            season_id=season.id,
            matches_played=0,
            wins=0,
            losses=0,
            draws=0,
            goals_scored=0,
            goals_conceded=0,
            goal_difference=0,
            points=0
        )
        db.session.add(team_stat)
        
        # Estadísticas de temporada para cada jugador del equipo
        for player in team.players:
            player_stat = PlayerStatistic(
                player_id=player.id,
                season_id=season.id,
                goals=0,
                assists=0,
                minutes_played=0,
                fouls=0,
                yellow_cards=0,
                red_cards=0
            )
            db.session.add(player_stat)
    
    db.session.commit()
 
# Actualizar estadística de partido y temporada para jugador y equipo
def actualizar_estadisticas_por_evento(event):
    """
    Actualiza las estadísticas del partido (y, consecuentemente, las de temporada)
    en función del tipo de evento.

    - Para eventos de jugador: se actualizan PlayerMatchStatistic y PlayerStatistic.
    - Para eventos de equipo: se actualizan TeamMatchStatistic y TeamStatistic.
    """
    # Extraer valores y relaciones necesarias
    match_id = event.match_id
    event_type = event.event_type.value if hasattr(event.event_type, 'value') else event.event_type

    # Actualización para eventos asociados a un jugador (por ejemplo, GOAL, FOUL, YELLOW_CARD, RED_CARD, SUBSTITUTION)
    if event.player_id:
        p_match_stat = (
            db.session.query(PlayerMatchStatistic)
            .filter_by(match_id=match_id, player_id=event.player_id)
            .first()
        )
        # Para las estadísticas de temporada, se asume que hay una única entrada para el jugador en la temporada actual.
        p_season_stat = (
            db.session.query(PlayerStatistic)
            .filter_by(player_id=event.player_id)
            .first()
        )
        
        t_match_stat = (
            db.session.query(TeamMatchStatistic)
            .filter_by(match_id=match_id, team_id=event.team_id)
            .first()
        )
        t_season_stat = (
            db.session.query(TeamStatistic)
            .filter_by(team_id=event.team_id)
            .first()
        )
        
        if event_type == "Goal":
            if p_match_stat:
                p_match_stat.goals += 1
            if p_season_stat:
                p_season_stat.goals += 1
        elif event_type == "Foul":
            if p_match_stat:
                p_match_stat.fouls += 1
            if p_season_stat:
                p_season_stat.fouls += 1
            if t_match_stat:
                t_match_stat.fouls += 1
        elif event_type == "Yellow Card":
            if p_match_stat:
                p_match_stat.yellow_cards += 1
            if p_season_stat:
                p_season_stat.yellow_cards += 1
            if t_match_stat:
                t_match_stat.fouls += 1
        elif event_type == "Red Card":
            if p_match_stat:
                p_match_stat.red_cards += 1
            if p_season_stat:
                p_season_stat.red_cards += 1
            if t_match_stat:
                t_match_stat.fouls += 1
        elif event_type == "Substitution":
            # Dependiendo de la lógica, podrías no actualizar contadores o registrar minutos jugados, etc.
            if p_match_stat:
                p_match_stat.minutes_played += event.minute
            if p_season_stat:
                p_season_stat.minutes_played += event.minute

        if p_match_stat:
            db.session.add(p_match_stat)
        if p_season_stat:
            db.session.add(p_season_stat)
        if t_match_stat:
            db.session.add(t_match_stat)
        if t_season_stat:
            db.session.add(t_season_stat)

    # Si existe jugador relacionado, actualizar su tiempo de juego en el partido
    if event.related_player_id:
        p_match_stat = (
            db.session.query(PlayerMatchStatistic)
            .filter_by(match_id=match_id, player_id=event.related_player_id)
            .first()
        )
        p_season_stat = (
            db.session.query(PlayerStatistic)
            .filter_by(player_id=event.related_player_id)
            .first()
        )

        if event_type == "Substitution":
            if p_match_stat:
                p_match_stat.minutes_played += (90 - event.minute)
            if p_season_stat:
                p_season_stat.minutes_played += (90 - event.minute)

    # Actualización para eventos asociados a un equipo (por ejemplo, SHOT, SHOT_TO_GOAL, PASS, CORNER, OFFSIDE)
    if event.team_id:
        t_match_stat = (
            db.session.query(TeamMatchStatistic)
            .filter_by(match_id=match_id, team_id=event.team_id)
            .first()
        )
        t_season_stat = (
            db.session.query(TeamStatistic)
            .filter_by(team_id=event.team_id)
            .first()
        )
        
        if event_type == "Shot":
            if t_match_stat:
                t_match_stat.shots += 1
        elif event_type == "Shot to Goal":
            if t_match_stat:
                t_match_stat.shots_to_goal += 1
        elif event_type == "Pass":
            if t_match_stat:
                t_match_stat.passes += 1
        elif event_type == "Corner":
            if t_match_stat:
                t_match_stat.corners += 1
        elif event_type == "Offside":
            if t_match_stat:
                t_match_stat.offsides += 1

        if t_match_stat:
            db.session.add(t_match_stat)
        if t_season_stat:
            # Si lo deseas, puedes actualizar estadísticas de temporada para el equipo.
            db.session.add(t_season_stat)
    
    db.session.commit()
