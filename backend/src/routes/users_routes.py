from flask import Blueprint, request, jsonify
from flask_cors import cross_origin

from src.services.db_service import DBService
from utils.logger import logger

users = Blueprint('users', __name__)


@users.route('/register', methods=['POST'])
@cross_origin()
def register():
    try:
        logger.info("User registration in progress")
        data = request.get_json()

        new_user = {
            "name": data.get("name", None),
            "email": data.get("email", None),
            "password": data.get("password", None)
        }

        if not new_user["name"] or not new_user["email"] or not new_user["password"]:
            return jsonify({"error": "Nombre, email y contraseña son requeridos"}), 400

        db = DBService.load_data()
        if any(user["email"] == new_user["email"] for user in db["users"]):
            return jsonify({"error": "El email ya está registrado"}), 409

        db["users"].append(new_user)
        DBService.save_data(db)

        return jsonify(data), 201
    except Exception as e:
        logger.error(f"Error while registering user: {e}")
        return jsonify({"error": "No se pudo registrar al usuario"}), 400


@users.route('/login', methods=['POST'])
@cross_origin()
def login():
    try:
        logger.info("User login in progress")
        data = request.get_json()

        email = data.get("email", None)
        password = data.get("password", None)

        if not email or not password:
            return jsonify({"error": "Email y contraseña son requeridos"}), 400

        db = DBService.load_data()
        user = next((u for u in db["users"] if u["email"] == email and u["password"] == password), None)

        if not user:
            return jsonify({"error": "Credenciales inválidas"}), 401

        return jsonify({"name": user["name"], "email": user["email"]}), 200
    except Exception as e:
        logger.error(f"Error while loging in: {e}")
        return jsonify({"error": "No se pudo iniciar sesión"}), 400
