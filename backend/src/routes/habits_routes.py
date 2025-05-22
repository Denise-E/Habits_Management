from flask import Blueprint, request, jsonify
from datetime import datetime, date

from flask_cors import cross_origin

from src.services.db_service import DBService
from utils.logger import logger


habits = Blueprint('habits', __name__)


@habits.route('/<user_email>', methods=['GET'])
@cross_origin()
def get_habits(user_email):
    try:
        logger.info("Getting user habits")
        if not user_email:
            return jsonify({"error": "Missing user_email"}), 400

        data = DBService.read_data()
        user_habits = [h for h in data["habits"] if h["user_email"] == user_email]

        return jsonify(user_habits), 200
    except Exception as e:
        logger.error(f"Error while getting habits: {e}")
        return jsonify({"error": "Unable to get the information"}), 400

@habits.route('/<int:habit_id>', methods=['GET'])
@cross_origin()
def get_habit_by_id(habit_id):
    try:
        logger.info("Getting habit by ID")
        data = DBService.read_data()
        habit = next((h for h in data["habits"] if h["id"] == habit_id), None)
        if not habit:
            return jsonify({"error": "Habit not found"}), 404
        return jsonify(habit), 200
    except Exception as e:
        logger.error(f"Error getting habit by ID: {e}")
        return jsonify({"error": "Unable to fetch habit"}), 400


@habits.route('', methods=['POST'])
@cross_origin()
def create_habit():
    try:
        logger.info("Creating habit")
        new_habit = request.get_json()

        if "user_email" not in new_habit:
            return jsonify({"error": "Missing user_email"}), 400

        data = DBService.read_data()
        new_habit['id'] = len(data["habits"]) + 1
        new_habit['created_at'] = date.today().isoformat()

        data["habits"].append(new_habit)
        DBService.save_data(data)

        return jsonify(new_habit), 201
    except Exception as e:
        logger.error(f"Error while creating habit: {e}")
        return jsonify({"error": "Unable to create habit"}), 400


@habits.route('/<int:habit_id>', methods=['PUT'])
@cross_origin()
def update_habit(habit_id):
    try:
        logger.info("Updating habit")
        updated_habit = request.get_json()

        data = DBService.read_data()

        for habit in data["habits"]:
            if habit["id"] == habit_id:
                updated_habit.pop("user_email")
                habit.update(updated_habit)
                DBService.save_data(data)
                return jsonify(habit), 200

        return jsonify({"error": "Habit not found"}), 404
    except Exception as e:
        logger.error(f"Error while updating habit: {e}")
        return jsonify({"error": "Unable to update habit"}), 400


@habits.route('/<int:habit_id>', methods=['DELETE'])
@cross_origin()
def delete_habit(habit_id):
    try:
        logger.info("Deteling habit")
        data = DBService.read_data()
        habit_to_delete = next((habit for habit in data["habits"] if habit["id"] == habit_id), None)

        if not habit_to_delete:
            return jsonify({"error": "Habit not found"}), 404

        data["habits"] = [habit for habit in data["habits"] if habit["id"] != habit_id]
        DBService.save_data(data)

        return jsonify(habit_to_delete), 200
    except Exception as e:
        logger.error(f"Error while deleting habit: {e}")
        return jsonify({"error": "Unable to delete habit"}), 400


@habits.route('/<int:habit_id>/track', methods=['POST'])
@cross_origin()
def track_habit(habit_id):
    try:
        logger.info("Tracking habit")
        req = request.get_json()

        user_email = req.get("user_email")
        tracked_date = req.get(
            "date",
            datetime.today().strftime('%Y-%m-%d')
        )

        if not user_email:
            return jsonify({"error": "Missing user_email"}), 400

        data = DBService.read_data()
        # Validates the habits corresponds to the user received
        habit_exists = any(h for h in data["habits"] if h["id"] == habit_id and h["user_email"] == user_email)

        if not habit_exists:
            return jsonify({"error": "Habit not found for user"}), 404

        data["tracking"].append({"habit_id": habit_id, "user_email": user_email, "date": tracked_date})
        DBService.save_data(data)

        return jsonify(data["tracking"]), 200
    except Exception as e:
        logger.error(f"Error while tracking habit: {e}")
        return jsonify({"error": "Unable to track habit"}), 400


@habits.route('/report', methods=['GET'])
@cross_origin()
def weekly_report():
    try:
        logger.info("Getting habits weekly report")
        user_email = request.args.get('user_email')

        if not user_email:
            return jsonify({"error": "Missing user_email"}), 400

        data = DBService.read_data()
        report = {}
        user_habits = [h for h in data["habits"] if h["user_email"] == user_email]

        for habit in user_habits:
            count = sum(1 for t in data["tracking"] if t["habit_id"] == habit["id"] and t["user_email"] == user_email)
            report[habit["name"]] = count

        return jsonify(report), 200
    except Exception as e:
        logger.error(f"Error while getting habits report: {e}")
        return jsonify({"error": "Unable to get habits report"}), 400
