from . import db

class Partido(db.Model):
    __tablename__ = 'Partido'  # Especificar el nombre exacto de la tabla
    id = db.Column(db.Integer, primary_key=True)
    equipo_local = db.Column(db.String(100), nullable=False)
    equipo_visitante = db.Column(db.String(100), nullable=False)
    fecha = db.Column(db.DateTime, nullable=False)
    goles_local = db.Column(db.Integer, nullable=False, default=0)
    goles_visitante = db.Column(db.Integer, nullable=False, default=0)
    eventos = db.relationship('Evento', back_populates='partido')

class Evento(db.Model):
    __tablename__ = 'Evento'  # Especificar el nombre exacto de la tabla si es necesario
    id = db.Column(db.Integer, primary_key=True)
    tipo = db.Column(db.String(50), nullable=False)
    minuto = db.Column(db.Integer, nullable=False)
    partido_id = db.Column(db.Integer, db.ForeignKey('Partido.id'), nullable=False)
    partido = db.relationship('Partido', back_populates='eventos')
