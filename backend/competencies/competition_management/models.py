from django.db import models
from abc import ABC, abstractmethod, ABCMeta
from django.core.exceptions import ValidationError


class User(models.Model):
    ROLE_CHOICES = [
        ('Coach', 'Coach'),
        ('Player', 'Player'),
    ]
    
    firstname = models.CharField(max_length=255)
    lastname = models.CharField(max_length=255)
    email = models.EmailField(max_length=255, unique=True)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES)
    birth_date = models.DateField()
    nationality = models.CharField(max_length=255)
    gender = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.firstname} {self.lastname} ({self.role})"


class Team(models.Model):
    name = models.CharField(max_length=255)
    country = models.CharField(max_length=255)
    logo = models.ImageField(upload_to="logos/")
    squads = models.ManyToManyField('Squad', related_name='teams', blank=True)

    def add_squad(self, squad):
        self.squads.add(squad)
        self.save()
    
    def remove_squad(self, squad):
        self.squads.remove(squad)
        self.save()

    def __str__(self):
        return self.name


class Squad(models.Model):
    season = models.ForeignKey('Planning', on_delete=models.CASCADE, blank=True, null=True)
    team = models.ForeignKey('Team', on_delete=models.CASCADE, related_name='squads_list')
    players = models.ManyToManyField(User, through='PlayerAssignment', related_name='squad_players')
    coaches = models.ManyToManyField(User, through='CoachAssignment', related_name='squad_coaches')
    registrations = models.ManyToManyField('Registration', related_name='squads', blank=True)

    def add_player(self, player):
        self.players.add(player)
        self.save()

    def remove_player(self, player):
        self.players.remove(player)
        self.save()

    def __str__(self):
        return f"{self.team.name} ({self.season.start_date.year})"


class PlayerAssignment(models.Model):
    squad = models.ForeignKey(Squad, on_delete=models.CASCADE)
    player = models.ForeignKey(User, limit_choices_to={'role': 'Player'}, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.player.username} ({self.squad.team.name})"


class CoachAssignment(models.Model):
    squad = models.ForeignKey(Squad, on_delete=models.CASCADE)
    coach = models.ForeignKey(User, limit_choices_to={'role': 'Coach'}, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.coach.username} ({self.squad.team.name})"


class Match(models.Model):
    home_squad = models.ForeignKey(Squad, related_name='home_matches', on_delete=models.CASCADE)
    away_squad = models.ForeignKey(Squad, related_name='away_matches', on_delete=models.CASCADE)
    home_goals = models.PositiveIntegerField(default=0)
    away_goals = models.PositiveIntegerField(default=0)
    time = models.DateTimeField()
    stadium = models.ForeignKey('Locality', on_delete=models.CASCADE)
    stage = models.ForeignKey('Stage', on_delete=models.CASCADE)

    def add_goal(self, squad, player):
        if squad == self.home_squad:
            self.home_goals += 1
        elif squad == self.away_squad:
            self.away_goals += 1
        else:
            raise ValidationError("Squad not found")
        self.save()

    def annul_goal(self, squad, player):
        if squad == self.home_squad:
            self.home_goals -= 1
        elif squad == self.away_squad:
            self.away_goals -= 1
        else:
            raise ValidationError("Squad not found")
        self.save()

    def define_winner(self):
        if self.home_goals > self.away_goals:
            return self.home_squad
        elif self.home_goals < self.away_goals:
            return self.away_squad
        else:
            return None

    def __str__(self):
        return f"{self.home_squad.team.name} vs {self.away_squad.team.name} at {self.stadium} on {self.time}"


class Locality(models.Model):
    stadium_name = models.CharField(max_length=255)
    street_one = models.CharField(max_length=255)
    street_two = models.CharField(max_length=255)
    reference = models.CharField(max_length=255)

    def change_stadium_name(self, new_name):
        self.stadium_name = new_name
        self.save()

    def change_reference(self, new_reference):
        self.reference = new_reference
        self.save()

    def __str__(self):
        return self.stadium_name + " - " + self.reference


class Registration(models.Model):
    squad = models.ForeignKey(Squad, on_delete=models.CASCADE)
    serie = models.CharField(max_length=255)
    competencie = models.ForeignKey(
        'CompetitionEdition', 
        on_delete=models.CASCADE, 
        blank=True, 
        null=True,
        related_name='registrations'
    )

    def __str__(self):
        return f"{self.squad.team.name} - {self.serie}"


class Planning(models.Model):
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()

    def __str__(self):
        return f"{self.start_date} - {self.end_date}"


class Rule(models.Model):
    numeration = models.PositiveIntegerField()
    rule_description = models.TextField()
    actor = models.CharField(max_length=255)
    action = models.CharField(max_length=255)
    type_rule = models.CharField(max_length=255)

    class Meta:
        abstract = True  # Esto hace que la clase sea abstracta

    def change_actor(self, new_actor):
        raise NotImplementedError("Subclasses must implement this method")

    def evaluate_rule(self):
        raise NotImplementedError("Subclasses must implement this method")

    def sanction(self):
        raise NotImplementedError("Subclasses must implement this method")

    def __str__(self):
        return self.rule_description


class Discipline(models.Model):
    name = models.CharField(max_length=255)
    image = models.ImageField(upload_to="disciplines/")
    surface = models.CharField(max_length=255)
    federation = models.CharField(max_length=255)
    description = models.TextField()

    def __str__(self):
        return self.name

class RuleCompetition(Rule):
    competence = models.ForeignKey('Competence', on_delete=models.CASCADE, related_name='rules')

    def __str__(self):
        return f"{self.competence.name} - {self.rule_description}"

class RuleDiscipline(Rule):
    discipline = models.ForeignKey('Discipline', on_delete=models.CASCADE, related_name='rules')

    def __str__(self):
        return f"{self.discipline.name} - {self.rule_description}"


class CompetitionEdition(models.Model):
    competence_admin = models.ForeignKey(User, on_delete=models.CASCADE)
    planning = models.ForeignKey('Planning', on_delete=models.CASCADE)
    inscription_list = models.ManyToManyField('Registration', related_name='competitions', blank=True)
    subdivision_list = models.ManyToManyField('self', symmetrical=False, related_name='subdivisions', blank=True) #Esto es para subdivisiones, esta por ver si se puede hacer
    stage_list = models.ManyToManyField('Stage', related_name='competition_editions', blank=True)
    competence = models.ForeignKey('Competence', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.planning.start_date} - {self.planning.end_date}"


class Stage(models.Model):
    time = models.ForeignKey('Planning', on_delete=models.CASCADE)

    def change_start_date(self, new_date):
        self.time.start_date = new_date
        self.time.save()

    def change_end_date(self, new_date):
        self.time.end_date = new_date
        self.time.save()

class Competence(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    logo = models.ImageField(upload_to="logos/")
    competence_format = models.ForeignKey('Format', on_delete=models.CASCADE, blank=True, null=True)
    rule_discipline_list = models.ManyToManyField('RuleDiscipline', related_name='competences', blank=True)
    rule_list = models.ManyToManyField('RuleCompetition', related_name='competences', blank=True)
    discipline = models.ForeignKey('Discipline', on_delete=models.CASCADE, related_name='competences')
    
    def __str__(self):
        return self.name + " - " + self.description

class Format(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    
    def __str__(self):
        return self.name + " - " + self.description
