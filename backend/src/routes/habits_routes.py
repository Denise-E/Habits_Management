from flask import Blueprint, request, jsonify
import json
import os
from datetime import datetime

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
    data = read_data()
    return jsonify(data["habits"]), 200


# Endpoint para crear un nuevo hábito
@habits_bp.route('/', methods=['POST'])
def create_habit():
    new_habit = request.get_json()
    data = read_data()
    new_habit['id'] = len(data["habits"]) + 1
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
            habit.update(updated_habit)
            write_data(data)
            return jsonify(habit), 200
    return jsonify({"error": "Habit not found"}), 404


# Endpoint para eliminar un hábito
@habits_bp.route('/<int:habit_id>', methods=['DELETE'])
def delete_habit(habit_id):
    data = read_data()
    data["habits"] = [habit for habit in data["habits"] if habit["id"] != habit_id]
    write_data(data)
    return jsonify({"message": "Habit deleted"}), 200


# Endpoint para marcar un hábito como completado en una fecha específica
@habits_bp.route('/<int:habit_id>/track', methods=['POST'])
def track_habit(habit_id):
    date = request.get_json().get("date", datetime.today().strftime('%Y-%m-%d'))
    data = read_data()
    data["tracking"].append({"habit_id": habit_id, "date": date})
    write_data(data)
    return jsonify({"message": "Habit tracked"}), 200


# Endpoint para obtener el reporte semanal de hábitos
@habits_bp.route('/report', methods=['GET'])
def weekly_report():
    data = read_data()
    report = {}
    for habit in data["habits"]:
        count = sum(1 for t in data["tracking"] if t["habit_id"] == habit["id"])
        report[habit["name"]] = count
    return jsonify(report), 200
