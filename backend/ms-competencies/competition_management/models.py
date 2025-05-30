from django.db import models

class Catalogue(models.Model):
    code = models.CharField(max_length=50, unique=True)
    description = models.CharField(max_length=255)
    parent_catalog = models.ForeignKey('self', related_name='child_catalogs', null=True, blank=True, on_delete=models.CASCADE)

    def __str__(self):
        return self.description

class User(models.Model):
    city = models.ForeignKey(Catalogue, related_name='user_city', on_delete=models.PROTECT)
    country = models.ForeignKey(Catalogue, related_name='user_country', on_delete=models.PROTECT)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    location = models.ForeignKey(Catalogue, related_name='user_location', on_delete=models.PROTECT)
    is_active = models.BooleanField(default=True)
    phone = models.CharField(max_length=20)
    province = models.ForeignKey(Catalogue, related_name='user_province', on_delete=models.PROTECT)
    password = models.CharField(max_length=128)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Athlete(models.Model):
    isCoach = models.BooleanField(default=False)
    isCaptain = models.BooleanField(default=False)
    isActive = models.BooleanField(default=True)
    height = models.FloatField()
    position = models.ForeignKey(Catalogue, related_name='athlete_position', on_delete=models.PROTECT)
    weight = models.FloatField()
    user = models.OneToOneField(User, related_name='athlete', on_delete=models.CASCADE)

    def __str__(self):
        return str(self.user)

class Team(models.Model):
    name = models.CharField(max_length=100)
    nationality = models.ForeignKey(Catalogue, related_name='team_nationality', on_delete=models.PROTECT)
    category = models.ForeignKey('Category', related_name='teams', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.name

class Administration(models.Model):
    city = models.ForeignKey(Catalogue, related_name='admin_city', on_delete=models.PROTECT)
    country = models.ForeignKey(Catalogue, related_name='admin_country', on_delete=models.PROTECT)
    location = models.ForeignKey(Catalogue, related_name='admin_location', on_delete=models.PROTECT)
    isActive = models.BooleanField(default=True)
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    province = models.ForeignKey(Catalogue, related_name='admin_province', on_delete=models.PROTECT)

    def __str__(self):
        return self.name

class GameState(models.Model):
    description = models.CharField(max_length=255)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Game(models.Model):
    endTime = models.DateTimeField()
    name = models.CharField(max_length=100)
    startTime = models.DateTimeField()
    gameState = models.ForeignKey(GameState, related_name='games', on_delete=models.PROTECT)

    def __str__(self):
        return self.name

class Marker(models.Model):
    local = models.IntegerField()
    visitor = models.IntegerField()
    game = models.ForeignKey(Game, related_name='markers', on_delete=models.CASCADE)

class Phase(models.Model):
    description = models.CharField(max_length=255)
    modality = models.ForeignKey(Catalogue, related_name='phase_modality', on_delete=models.PROTECT)
    name = models.CharField(max_length=100)
    season = models.ForeignKey('Season', related_name='phases', on_delete=models.CASCADE)
    category = models.ForeignKey('Category', related_name='phases', on_delete=models.PROTECT)
    isActive = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class Offer(models.Model):
    creationDate = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=255)
    name = models.CharField(max_length=100)
    isStatic = models.BooleanField(default=False)
    phase = models.ForeignKey(Phase, related_name='offers', on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class Season(models.Model):
    champion = models.CharField(max_length=100)
    description = models.CharField(max_length=255)
    endTime = models.DateTimeField()
    hasEnd = models.BooleanField(default=False)
    hasChampion = models.BooleanField(default=False)
    name = models.CharField(max_length=100)
    startDate = models.DateTimeField()
    subChampion = models.CharField(max_length=100)
    competition = models.ForeignKey('Competition', related_name='seasons', on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class Competition(models.Model):
    creationDate = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=100)
    administration = models.ForeignKey(Administration, related_name='competitions', on_delete=models.PROTECT)

    def __str__(self):
        return self.name

class Rule(models.Model):
    code = models.CharField(max_length=50, unique=True)
    description = models.CharField(max_length=255)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Category(models.Model):
    age_init = models.IntegerField()
    age_end = models.IntegerField()
    name = models.CharField(max_length=100)
    rule = models.ForeignKey(Rule, related_name='categories', on_delete=models.PROTECT)

    def __str__(self):
        return self.name

class PositionTable(models.Model):
    position = models.IntegerField()
    points = models.IntegerField()
    team = models.ForeignKey(Team, related_name='position_tables', on_delete=models.CASCADE)

class TableRating(models.Model):
    lastUpdate = models.DateTimeField(auto_now=True)
    positionTable = models.ForeignKey(PositionTable, related_name='table_ratings', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.positionTable.team.name} - {self.lastUpdate}"
