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

# Habits Tracking Endpoints
@habits.route('/tracking/detail', methods=['POST'])
@cross_origin()
def get_tracking():
    try:
        data = request.get_json()
        from_date = data.get('from')
        to_date = data.get('to')
        data = DBService.read_data()

        tracking = [t for t in data["tracking"] if from_date <= t["date"] <= to_date]

        return jsonify({
            "habits": data["habits"],
            "tracking": tracking
        })

    except Exception as e:
        logger.error(f"Error fetching tracking: {e}")
        return jsonify({"error": "Error fetching tracking data"}), 500

@habits.route('/tracking', methods=['POST'])
@cross_origin()
def post_tracking():
    try:
        tracking_data = request.get_json()
        data = DBService.read_data()

        new_track = {
            "habit_id": tracking_data["habit_id"],
            "date": tracking_data["date"]
        }

        if new_track not in data["tracking"]:
            data["tracking"].append(new_track)
            DBService.save_data(data)

        return jsonify(new_track), 201

    except Exception as e:
        logger.error(f"Error saving tracking: {e}")
        return jsonify({"error": "Error saving tracking data"}), 500


@habits.route('/tracking', methods=['DELETE'])
@cross_origin()
def delete_tracking():
    try:
        input_data = request.get_json()
        habit_id = input_data['habit_id']
        date = input_data['date']
        data = DBService.read_data()

        data["tracking"] = [t for t in data["tracking"] if not (t["habit_id"] == habit_id and t["date"] == date)]
        DBService.save_data(data)

        return jsonify({"message": "Tracking entry deleted"}), 200

    except Exception as e:
        logger.error(f"Error deleting tracking: {e}")
        return jsonify({"error": "Error deleting tracking data"}), 500
