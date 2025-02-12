from datetime import datetime
from enum import Enum
from werkzeug.security import generate_password_hash, check_password_hash
from . import db

# Cualquier cambio aquí tambien debe estar en models/real-time del frontend

class UserRole(Enum):
    NORMAL = "normal"
    ADMIN = "admin"
    REFEREE = "árbitro"

class Position(Enum):
    FORWARD = "Delantero"
    MIDFIELDER = "Centrocampista"
    DEFENDER = "Defensa"
    GOALKEEPER = "Portero"

class EventType(Enum):
    # Eventos de jugadores
    GOAL = "Gol" # Al generar un gol, se debe controlar quien dió la asistencia
    FOUL = "Falta"
    YELLOW_CARD = "Tarjeta Amarilla"
    RED_CARD = "Tarjeta Roja"
    SUBSTITUTION = "Sustitución"
    # Eventos de equipos
    SHOT = "Tiro"
    SHOT_TO_GOAL = "Tiro a gol"
    PASS = "Pase"
    CORNER = "Corner"
    OFFSIDE = "Offside"

class CompetitionType(Enum):
    LEAGUE = "Liga"
    CLASSIC = "Clásico"
 
class MatchPhase(Enum):
    ROUND = 'Jornada' # Jornada o Fecha de Liga
    #(for classic tournaments)
    GROUP_STAGE = "Fase de grupos"
    ROUND_OF_16 = "Octavos de final"
    QUARTER_FINALS = "Cuartos de final"
    SEMI_FINALS = "Semifinales"
    THIRD_PLACE_PLAYOFF = 'Partido por 3er lugar'
    FINAL = "Final"

class MatchStatus(Enum):
    PLAYING = "En juego"
    FINISHED = "Finalizado"
    SUSPENDED = "Suspendido"
    TO_BE_PLAYED = "Próximo"

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    # Importante para detectar los arbitros que gestionen un partido
    role = db.Column(db.Enum(UserRole), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role.value
        }

    def __str__(self):
        return self.username

class Team(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    photo = db.Column(db.String(255))
    players = db.relationship('Player', backref='team', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'city': self.city,
            'photo': self.photo
        }

    def __str__(self):
        return self.name

# Tabla intermedia para historial de jugadores en equipos
player_teams = db.Table('player_teams',
    db.Column('player_id', db.Integer, db.ForeignKey('player.id'), primary_key=True),
    db.Column('team_id', db.Integer, db.ForeignKey('team.id'), primary_key=True),
    db.Column('start_date', db.Date, nullable=False),
    db.Column('end_date', db.Date)
)

class Player(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    position = db.Column(db.Enum(Position), nullable=False)
    photo = db.Column(db.String(255))
    historical_teams = db.relationship('Team', secondary=player_teams, backref='historical_players')
    current_team_id = db.Column(db.Integer, db.ForeignKey('team.id'))  # Equipo actual
    current_team = db.relationship('Team', foreign_keys=[current_team_id])

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'position': self.position.value,
            'photo': self.photo,
            'current_team': self.current_team.to_dict() if self.current_team else None
        }

    def __str__(self):
        return self.name

# Tabla intermedia para historial de entrenadores en equipos
coach_teams = db.Table('coach_teams',
    db.Column('coach_id', db.Integer, db.ForeignKey('coach.id'), primary_key=True),
    db.Column('team_id', db.Integer, db.ForeignKey('team.id'), primary_key=True),
    db.Column('start_date', db.Date, nullable=False),
    db.Column('end_date', db.Date)
)

class Coach(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    start_date = db.Column(db.Date, nullable=False) # Cuando inicio como DT en general
    #user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    historical_teams = db.relationship('Team', secondary=coach_teams, backref='historical_coaches')
    current_team_id = db.Column(db.Integer, db.ForeignKey('team.id'))  # Equipo actual
    current_team = db.relationship('Team', foreign_keys=[current_team_id])

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'start_date': self.start_date.strftime("%Y-%m-%d"),
            'current_team': self.current_team.to_dict() if self.current_team else None
        }

    def __str__(self):
        return self.name

season_teams = db.Table('season_teams',
    db.Column('season_id', db.Integer, db.ForeignKey('season.id'), primary_key=True),
    db.Column('team_id', db.Integer, db.ForeignKey('team.id'), primary_key=True)
)

class Season(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    # si es un torneo tipo liga, fase por defecto es Round, si es torneo tipo clasico, fase por defecto es Group Stage
    competition_id = db.Column(db.Integer, db.ForeignKey('competition.id'), nullable=False)
    current_phase_int = db.Column(db.Integer, default=1)
    current_phase = db.Column(db.Enum(MatchPhase))
    total_rounds = db.Column(db.Integer, nullable=True)
    teams = db.relationship('Team', secondary='season_teams', backref='seasons')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Establecer fase actual inicial dependiendo del tipo de competición
        if self.competition:
            if self.competition.type == CompetitionType.LEAGUE:
                self.current_phase = MatchPhase.ROUND
            else:
                self.current_phase = MatchPhase.GROUP_STAGE

        # Establecer el valor de total_rounds en función de los equipos relacionados
        # Se borra xq es muy probable que no haya teams al crear la season
        """if len(self.teams) > 1:
            if self.competition.type == CompetitionType.LEAGUE:
                # En ligas: total de partidos es (n_equipos * n_equipos - 1) / 2  * 2(ida y vuelta)
                # total_rounds = totalpartidos / partidos a jugarse por jornada
                total_matches = ((len(self.teams) * (len(self.teams) - 1)) // 2) * 2
                self.total_rounds = total_matches // (len(self.teams) // 2)"""

    # Funcion para validar si los equipos no exceden el limite de equipos permitidos en la competition
    def validate_teams(self):
        if len(self.teams) > self.competition.team_limit:
            raise ValueError(f"La cantidad de equipos no puede exceder {self.competition.team_limit}")

    def update_total_rounds(self):
        if len(self.teams) > 1:
            if self.competition.type == CompetitionType.LEAGUE:
                # En ligas: total de partidos es (n_equipos * n_equipos - 1) / 2  * 2(ida y vuelta)
                # total_rounds = totalpartidos / partidos a jugarse por jornada
                total_matches = ((len(self.teams) * (len(self.teams) - 1)) // 2) * 2
                self.total_rounds = total_matches // (len(self.teams) // 2)
          
    def get_current_phase(self):
        if self.competition.type == CompetitionType.LEAGUE:
            """# Contamos la cantidad de partidos jugados en la temporada
            matches_played = Match.query.filter_by(season_id=self.id).count()
            # Calculamos la jornada actual (suponiendo que cada ronda tiene un número fijo de partidos)
            current_round = (matches_played // (len(self.teams) // 2)) + 1
            return min(current_round, self.total_rounds)  # No debe exceder el total de rondas"""
            # Si es una liga, la fase es la jornada: "Round 1", "Round 2", etc.
            return f"{self.current_phase.value} {self.current_phase_int}"
        else:
            return self.current_phase.value
    
    def update_current_phase(self):
        MATCH_PHASES = [
            MatchPhase.GROUP_STAGE,
            MatchPhase.ROUND_OF_16,
            MatchPhase.QUARTER_FINALS,
            MatchPhase.SEMI_FINALS,
            MatchPhase.THIRD_PLACE_PLAYOFF,
            MatchPhase.FINAL
        ]
        if self.competition.type == CompetitionType.LEAGUE:
            # Se aumenta el contador de jornadas
            self.current_phase_int += 1
        else:
            try:
                index = MATCH_PHASES.index(self.current_phase)
                # Verifica que exista una siguiente fase
                if index < len(MATCH_PHASES) - 1:
                    self.current_phase = MATCH_PHASES[index + 1]
            except ValueError:
                pass  # O manejar el error de otra forma

    def to_dict(self):
        return {
            'id': self.id,
            'start_date': self.start_date.strftime("%Y-%m-%d"),
            'end_date': self.end_date.strftime("%Y-%m-%d"),
            'competition': self.competition.name,
            'current_phase': self.get_current_phase()
        }

    def __str__(self):
        if self.start_date.year == self.end_date.year:
            return str(self.start_date.year)
        return f"{self.start_date.year}-{self.end_date.year}"

class Competition(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.Enum(CompetitionType), nullable=False)
    #season_id = db.Column(db.Integer, db.ForeignKey('season.id'), nullable=False)
    team_limit = db.Column(db.Integer, nullable=False)

    seasons = db.relationship('Season', backref='competition', lazy=True,foreign_keys=[Season.competition_id])
    # Relación con la temporada actual
    current_season_id = db.Column(db.Integer, db.ForeignKey('season.id'), nullable=True)
    current_season = db.relationship('Season', foreign_keys=[current_season_id])


    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        # Asignar el valor de team_limit dependiendo del tipo de competición
        if self.team_limit is None:
            if self.type == CompetitionType.LEAGUE:
                self.team_limit = 20
            else:
                self.team_limit = 32

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'type': self.type.value,
            'team_limit': self.team_limit,
            'current_season_id': self.current_season_id 
        }

    def __str__(self):
        return self.name
    
class Match(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.Enum(MatchStatus), nullable=False)
    home_team_id = db.Column(db.Integer, db.ForeignKey('team.id'), nullable=False)
    away_team_id = db.Column(db.Integer, db.ForeignKey('team.id'), nullable=False)
    season_id = db.Column(db.Integer, db.ForeignKey('season.id'))
    season = db.relationship('Season', foreign_keys=[season_id])
    home_team = db.relationship('Team', foreign_keys=[home_team_id])
    away_team = db.relationship('Team', foreign_keys=[away_team_id])
    date = db.Column(db.DateTime, nullable=False)
    goals_home = db.Column(db.Integer, default=0)
    goals_away = db.Column(db.Integer, default=0)
    events = db.relationship('Event', backref='match', lazy=True)

    #Metodos para definir ganador, perdedor o empate

    def to_dict(self):
        return {
            'id': self.id,
            'season_id': self.season_id,
            'status': self.status.value,
            "home_team": self.home_team.to_dict() if self.home_team else None,
            "away_team": self.away_team.to_dict() if self.away_team else None,
            'date': self.date.strftime("%Y-%m-%d %H:%M"),
            'goals_home': self.goals_home,
            'goals_away': self.goals_away
        }

    def __str__(self):
        return f"{self.home_team.name if self.home_team else 'TBD'} vs {self.away_team.name if self.away_team else 'TBD'}"

class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    match_id = db.Column(db.Integer, db.ForeignKey('match.id'), nullable=False)
    team_id = db.Column(db.Integer, db.ForeignKey('team.id'), nullable=True)
    player_id = db.Column(db.Integer, db.ForeignKey('player.id'), nullable=True)
    related_player_id = db.Column(db.Integer, db.ForeignKey('player.id'), nullable=True)  # For substitutions
    event_type = db.Column(db.Enum(EventType), nullable=False)
    minute = db.Column(db.Integer, nullable=False)

    # Relaciones para acceder a los objetos relacionados de forma directa
    team = db.relationship('Team', backref=db.backref('events', lazy=True), foreign_keys=[team_id])
    player = db.relationship('Player', backref=db.backref('events', lazy=True), foreign_keys=[player_id])
    related_player = db.relationship('Player', foreign_keys=[related_player_id])

    def to_dict(self):
        return {
            'id': self.id,
            'event_type': self.event_type.value,
            'minute': self.minute,
            'team': self.team.to_dict() if self.team else None,
            'team_id': self.team_id,
            'player': self.player.to_dict() if self.player else None,
            'related_player': self.related_player.to_dict() if self.related_player else None
        }
    
class PlayerStatistic(db.Model):
    # Son las estadisticas del jugador en la temporada de determinada competencia
    id = db.Column(db.Integer, primary_key=True)
    player_id = db.Column(db.Integer, db.ForeignKey('player.id'), nullable=False)
    season_id = db.Column(db.Integer, db.ForeignKey('season.id'), nullable=False)
    goals = db.Column(db.Integer, default=0)
    assists = db.Column(db.Integer, default=0)
    minutes_played = db.Column(db.Integer, default=0)
    # assists, si es por partido, minutos, despues se suman en la temporada
    fouls = db.Column(db.Integer, default=0)
    yellow_cards = db.Column(db.Integer, default=0)
    red_cards = db.Column(db.Integer, default=0)

    def get_player(self):
        return Player.query.get(self.player_id)

    def to_dict(self):
        return {
            'id': self.id,
            'player_id': self.get_player().to_dict(),
            'season_id': self.season_id,
            'goals': self.goals,
            'assists': self.assists,
            'minutes_played': self.minutes_played,
            'fouls': self.fouls,
            'yellow_cards': self.yellow_cards,
            'red_cards': self.red_cards
        }

class PlayerMatchStatistic(db.Model):
    # Son las estadisticas del jugador en determinado partido
    id = db.Column(db.Integer, primary_key=True)
    player_id = db.Column(db.Integer, db.ForeignKey('player.id'), nullable=False)
    match_id = db.Column(db.Integer, db.ForeignKey('match.id'), nullable=False)
    # Todas las estadísticas se suman en PlayerStatistic que es la de temporada
    minutes_played = db.Column(db.Integer, default=0)
    goals = db.Column(db.Integer, default=0)
    assists = db.Column(db.Integer, default=0)
    fouls = db.Column(db.Integer, default=0)
    yellow_cards = db.Column(db.Integer, default=0)
    red_cards = db.Column(db.Integer, default=0)

    def get_player(self):
        return Player.query.get(self.player_id)

    def to_dict(self):
        return {
            'id': self.id,
            'player_id': self.get_player().to_dict(),
            'match_id': self.match_id,
            'minutes_played': self.minutes_played,
            'goals': self.goals,
            'assists': self.assists,
            'fouls': self.fouls,
            'yellow_cards': self.yellow_cards,
            'red_cards': self.red_cards
        }


class TeamStatistic(db.Model):
    # Son las estadisticas del equipo en la temporada de determinada competencia
    id = db.Column(db.Integer, primary_key=True)
    team_id = db.Column(db.Integer, db.ForeignKey('team.id'), nullable=False)
    season_id = db.Column(db.Integer, db.ForeignKey('season.id'))
    matches_played = db.Column(db.Integer, default=0)
    wins = db.Column(db.Integer, default=0)
    losses = db.Column(db.Integer, default=0)
    draws = db.Column(db.Integer, default=0)
    goals_scored = db.Column(db.Integer, default=0)
    goals_conceded = db.Column(db.Integer, default=0)
    goal_difference = db.Column(db.Integer, default=0)
    points = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {
            'id': self.id,
            'team_id': self.team_id,
            'season_id': self.season_id,
            'matches_played': self.matches_played,
            'wins': self.wins,
            'losses': self.losses,
            'draws': self.draws,
            'goals_scored': self.goals_scored,
            'goals_conceded': self.goals_conceded,
            'goal_difference': self.goal_difference,
            'points': self.points
        }

class TeamMatchStatistic(db.Model):
    # Son las estadisticas del equipo en el partido
    id = db.Column(db.Integer, primary_key=True)
    team_id = db.Column(db.Integer, db.ForeignKey('team.id'), nullable=False)
    match_id = db.Column(db.Integer, db.ForeignKey('match.id'), nullable=False)
    shots = db.Column(db.Integer, default=0)
    shots_to_goal = db.Column(db.Integer, default=0)
    possession = db.Column(db.Float, default=50.0)
    passes = db.Column(db.Integer, default=0)
    fouls = db.Column(db.Integer, default=0)
    yellow_cards = db.Column(db.Integer, default=0)
    red_cards = db.Column(db.Integer, default=0)
    offsides = db.Column(db.Integer, default=0)
    corners = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {
            'id': self.id,
            'team': self.team_id,
            'match_id': self.match_id,
            'shots': self.shots,
            'shots_to_goal': self.shots_to_goal,
            'possession': self.possession,
            'passes': self.passes,
            'fouls': self.fouls,
            'yellow_cards': self.yellow_cards,
            'red_cards': self.red_cards,
            'offsides': self.offsides,
            'corners': self.corners
        }


class MatchStatistic(db.Model): 
    # Agrupa las estadísticas de los equipos en un partido
    """En el resumen, solo se reflejan estos eventos:
    GOAL, FOUL, YELLOW_CARD, RED_CARD, SUBSTITUTION"""
    id = db.Column(db.Integer, primary_key=True)
    match_id = db.Column(db.Integer, db.ForeignKey('match.id'), nullable=False)
    home_team_stats_id = db.Column(db.Integer, db.ForeignKey('team_match_statistic.id'), nullable=False)
    away_team_stats_id = db.Column(db.Integer, db.ForeignKey('team_match_statistic.id'), nullable=False)
    home_team_stats = db.relationship('TeamMatchStatistic', foreign_keys=[home_team_stats_id])
    away_team_stats = db.relationship('TeamMatchStatistic', foreign_keys=[away_team_stats_id])

    def to_dict(self):
        return {
            'id': self.id,
            'match_id': self.match_id,
            'home_team_stats': self.home_team_stats.to_dict() if self.home_team_stats else None,
            'away_team_stats': self.away_team_stats.to_dict() if self.away_team_stats else None
        }
