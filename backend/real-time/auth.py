from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token, jwt_required, get_jwt_identity
)
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta

auth_bp = Blueprint('auth', __name__)

# Ejemplo de base de datos en memoria para usuarios (puedes cambiar a una base de datos real)
USERS_DB = {
    "user1": generate_password_hash("password123"),
    "user2": generate_password_hash("mypassword")
}

# Ruta para registrar usuarios (opcional)
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"msg": "Username and password required"}), 400

    if username in USERS_DB:
        return jsonify({"msg": "User already exists"}), 409

    # Guarda el usuario (en este ejemplo en memoria)
    USERS_DB[username] = generate_password_hash(password)
    return jsonify({"msg": "User registered successfully"}), 201

# Ruta para iniciar sesión y obtener un token
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"msg": "Username and password required"}), 400

    # Verifica si el usuario existe
    user_password_hash = USERS_DB.get(username)
    if not user_password_hash or not check_password_hash(user_password_hash, password):
        return jsonify({"msg": "Invalid username or password"}), 401

    # Crea un token JWT si la autenticación es exitosa
    access_token = create_access_token(identity=username, expires_delta=timedelta(hours=1))
    return jsonify(access_token=access_token), 200

# Ruta protegida, solo accesible con un token válido
@auth_bp.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify({"msg": f"Welcome, {current_user}! This is a protected route."}), 200
