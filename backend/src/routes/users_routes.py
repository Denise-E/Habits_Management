from flask import Blueprint, request, jsonify
import json
import os

users_bp = Blueprint('users', __name__)
DATA_PATH = os.path.join("src", "database", "data.json")


def load_data():
    if not os.path.exists(DATA_PATH):
        return {"users": [], "habits": [], "tracking": []}
    with open(DATA_PATH, "r") as f:
        return json.load(f)


def save_data(data):
    with open(DATA_PATH, "w") as f:
        json.dump(data, f, indent=4)


@users_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"error": "Nombre, email y contraseña son requeridos"}), 400

    db = load_data()
    if any(user["email"] == email for user in db["users"]):
        return jsonify({"error": "El email ya está registrado"}), 409

    new_user = {
        "name": name,
        "email": email,
        "password": password
    }

    db["users"].append(new_user)
    save_data(db)

    return jsonify(data), 201


@users_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email y contraseña son requeridos"}), 400

    db = load_data()
    user = next((u for u in db["users"] if u["email"] == email and u["password"] == password), None)

    if not user:
        return jsonify({"error": "Credenciales inválidas"}), 401

    return jsonify({"name": user["name"], "email": user["email"]}), 200
