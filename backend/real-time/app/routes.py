from flask import Blueprint, jsonify, request
from . import db
from .models import Partido, Evento

api = Blueprint('api', __name__)

# Obtener todos los partidos
@api.route('/api/partidos', methods=['GET'])
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
@api.route('/api/eventos', methods=['GET'])
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
@api.route('/api/eventos', methods=['POST'])
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
    }), 201

# Aquí irán los endpoints de las APIs
"""@api.route('/api/partidos', methods=['GET'])
def get_partidos():
    return jsonify({"message": "Lista de partidos", "data": []})

# Endpoint de ejemplo
@api.route('/api/partidos', methods=['POST'])
def create_partido():
    data = request.json
    if not data:
        return jsonify({"error": "No se enviaron datos"}), 400
    return jsonify({"message": "Partido creado", "data": data}), 201"""