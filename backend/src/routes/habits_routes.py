from flask import Blueprint, request, jsonify
import json
import os
from datetime import datetime, date

habits_bp = Blueprint('habits_bp', __name__)

DATA_FILE = os.path.join(os.path.dirname(__file__), '..', 'database', 'data.json')


# Funciones auxiliares para leer y escribir en data.json
def read_data():
    if not os.path.exists(DATA_FILE):
        return {"habits": [], "tracking": []}
    with open(DATA_FILE, 'r') as f:
        return json.load(f)


def write_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=4)


# Endpoint para obtener todos los hábitos
@habits_bp.route('/', methods=['GET'])
def get_habits():
    user_email = request.args.get('user_email')
    if not user_email:
        return jsonify({"error": "Missing user_email"}), 400
    data = read_data()
    print("user email", user_email)
    user_habits = [h for h in data["habits"] if h["user_email"] == user_email]
    return jsonify(user_habits), 200


# Endpoint para crear un nuevo hábito
@habits_bp.route('/', methods=['POST'])
def create_habit():
    new_habit = request.get_json()
    if "user_email" not in new_habit:
        return jsonify({"error": "Missing user_email"}), 400
    data = read_data()
    new_habit['id'] = len(data["habits"]) + 1
    new_habit['created_at'] = date.today().isoformat()
    data["habits"].append(new_habit)
    write_data(data)
    return jsonify(new_habit), 201


# Endpoint para actualizar un hábito existente
@habits_bp.route('/<int:habit_id>', methods=['PUT'])
def update_habit(habit_id):
    updated_habit = request.get_json()
    data = read_data()
    for habit in data["habits"]:
        if habit["id"] == habit_id:
            updated_habit.pop("user_email")
            habit.update(updated_habit)
            write_data(data)
            return jsonify(habit), 200
    return jsonify({"error": "Habit not found"}), 404


# Endpoint para eliminar un hábito
@habits_bp.route('/<int:habit_id>', methods=['DELETE'])
def delete_habit(habit_id):
    data = read_data()
    habit_to_delete = next((habit for habit in data["habits"] if habit["id"] == habit_id), None)

    if not habit_to_delete:
        return jsonify({"error": "Habit not found"}), 404

    data["habits"] = [habit for habit in data["habits"] if habit["id"] != habit_id]
    write_data(data)
    return jsonify(habit_to_delete), 200


# Endpoint para marcar un hábito como completado en una fecha específica
@habits_bp.route('/<int:habit_id>/track', methods=['POST'])
def track_habit(habit_id):
    req = request.get_json()
    user_email = req.get("user_email")
    tracked_date = req.get("date", datetime.today().strftime('%Y-%m-%d'))  # Opcional, si no se envía toma la fecha actual

    if not user_email:
        return jsonify({"error": "Missing user_email"}), 400

    data = read_data()
    # Verificamos si el hábito pertenece a ese usuario
    habit_exists = any(h for h in data["habits"] if h["id"] == habit_id and h["user_email"] == user_email)
    if not habit_exists:
        return jsonify({"error": "Habit not found for user"}), 404

    data["tracking"].append({"habit_id": habit_id, "user_email": user_email, "date": tracked_date})
    write_data(data)
    return jsonify(data["tracking"]), 200


# Endpoint para obtener el reporte semanal de hábitos
@habits_bp.route('/report', methods=['GET'])
def weekly_report():
    user_email = request.args.get('user_email')
    if not user_email:
        return jsonify({"error": "Missing user_email"}), 400

    data = read_data()
    report = {}
    user_habits = [h for h in data["habits"] if h["user_email"] == user_email]

    for habit in user_habits:
        count = sum(1 for t in data["tracking"] if t["habit_id"] == habit["id"] and t["user_email"] == user_email)
        report[habit["name"]] = count

    return jsonify(report), 200
