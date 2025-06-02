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
            "password": data.get("password", None),
            "phone": data.get("phone", None),
            "birthday_date": data.get("birthday_date", None)
        }

        if not new_user["name"] or not new_user["email"] or not new_user["password"] or not new_user["phone"] or not new_user["birthday_date"]:
            return jsonify({"error": "Nombre, teléfono, fecha de cumpleaños, email y contraseña son requeridos"}), 400

        db = DBService.load_data()
        if any(user["email"] == new_user["email"] for user in db["users"]):
            return jsonify({"error": "El email ya está registrado"}), 409

        new_user["id"] = len(db["users"]) + 1
        data["id"] = new_user["id"]
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

        return jsonify({"id": user["id"], "name": user["name"], "email": user["email"]}), 200
    except Exception as e:
        logger.error(f"Error while loging in: {e}")
        return jsonify({"error": "No se pudo iniciar sesión"}), 400

@users.route('/detail/<string:user_email>', methods=['GET'])
@cross_origin()
def get_user(user_email):
    try:
        db = DBService.load_data()
        user = next((u for u in db["users"] if u["email"] == user_email), None)

        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404

        return jsonify({"id": user["id"], "name": user["name"], "email": user["email"], "phone": user["phone"], "birthday_date": user["birthday_date"]}), 200
    except Exception as e:
        logger.error(f"Error al obtener usuario: {e}")
        return jsonify({"error": "No se pudo obtener el usuario"}), 400

@users.route('/<string:user_email>', methods=['PUT'])
@cross_origin()
def update_user(user_email):
    try:
        data = request.get_json()
        name = data.get("name", None)
        phone = data.get("phone", None)
        birthday_date = data.get("birthday_date", None)


        if not user_email:
            return jsonify({"error": "Email requerido"}), 400

        db = DBService.load_data()
        user = next((u for u in db["users"] if u["email"] == user_email), None)

        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404

        if name is not None:
            user["name"] = name
        if phone is not None:
            user["phone"] = phone
        if birthday_date is not None:
            user["birthday_date"] = phone

        DBService.save_data(db)
        return jsonify(user), 200
    except Exception as e:
        logger.error(f"Error al actualizar usuario: {e}")
        return jsonify({"error": "No se pudo actualizar el usuario"}), 400

@users.route('/<string:user_email>', methods=['DELETE'])
@cross_origin()
def delete_user(user_email):
    try:
        db = DBService.load_data()
        user_index = next((i for i, u in enumerate(db["users"]) if u["email"] == user_email), None)

        if user_index is None:
            return jsonify({"error": "Usuario no encontrado"}), 404

        deleted_user = db["users"].pop(user_index)
        
        DBService.save_data(db)
        return jsonify(deleted_user), 200
    except Exception as e:
        logger.error(f"Error al eliminar usuario: {e}")
        return jsonify({"error": "No se pudo eliminar el usuario"}), 400
