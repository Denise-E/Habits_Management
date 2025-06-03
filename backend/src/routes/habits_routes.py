from src.services.user_service import UserService
from flask import Blueprint, request, jsonify
from datetime import datetime, date

from flask_cors import cross_origin

from src.services.db_service import DBService
from utils.logger import logger


habits = Blueprint('habits', __name__)


@habits.route('/<string:user_email>', methods=['GET'])
@cross_origin()
def get_habits(user_email):
    try:
        logger.info("Getting user habits")

        user_exists = UserService.validate_user_exists(user_email)

        if not user_exists:
            return jsonify({"error": "User not found"}), 404   

        data = DBService.read_data()
        user_habits = [h for h in data["habits"] if h["user_email"] == user_email]

        return jsonify(user_habits), 200
    except Exception as e:
        logger.error(f"Error while getting habits: {e}")
        return jsonify({"error": "Unable to get the information"}), 400


@habits.route('/<string:user_email>/<int:habit_id>', methods=['GET'])
@cross_origin()
def get_habit_by_id(user_email, habit_id):
    try:
        logger.info("Getting habit by ID")

        user_exists = UserService.validate_user_exists(user_email)

        if not user_exists:
            return jsonify({"error": "User not found"}), 404   

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
        
        if "name" not in new_habit or "category" not in new_habit or "goal" not in new_habit:
            return jsonify({"error": "Name, category and goal required"}), 400

        user_exists = UserService.validate_user_exists(new_habit["user_email"])

        if not user_exists:
            return jsonify({"error": "User not found"}), 404       
        
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
        user_email = updated_habit.pop("user_email")

        if not user_email:
            return jsonify({"error": "Missing user_email"}), 400
        
        user_exists = UserService.validate_user_exists(user_email)

        if not user_exists:
            return jsonify({"error": "User not found"}), 404  

        data = DBService.read_data()

        for habit in data["habits"]:
            if habit["id"] == habit_id:
                habit.update(updated_habit)
                DBService.save_data(data)
                return jsonify(habit), 200

        return jsonify({"error": "Habit not found"}), 404
    except Exception as e:
        logger.error(f"Error while updating habit: {e}")
        return jsonify({"error": "Unable to update habit"}), 400


@habits.route('/<string:user_email>/<int:habit_id>', methods=['DELETE'])
@cross_origin()
def delete_habit(user_email, habit_id):
    try:
        logger.info("Deleting habit")

        user_exists = UserService.validate_user_exists(user_email)

        if not user_exists:
            return jsonify({"error": "User not found"}), 404   

        data = DBService.read_data()

        habit_to_delete = next((habit for habit in data["habits"] if habit["id"] == habit_id), None)
        if not habit_to_delete:
            return jsonify({"error": "Habit not found"}), 404

        # Habit deletion
        data["habits"] = [habit for habit in data["habits"] if habit["id"] != habit_id]

        # Habit tracking deletion
        data["tracking"] = [t for t in data["tracking"] if t["habit_id"] != habit_id]

        DBService.save_data(data)
        return jsonify(habit_to_delete), 200
    except Exception as e:
        logger.error(f"Error while deleting habit: {e}")
        return jsonify({"error": "Unable to delete habit"}), 400

# Habits Tracking Endpoints
@habits.route('/tracking/detail/<string:user_email>', methods=['POST'])
@cross_origin()
def get_tracking(user_email):
    try:
        logger.info("Getting habits between given dates")
        user_exists = UserService.validate_user_exists(user_email)

        if not user_exists:
            return jsonify({"error":  "User not found"}), 404   

        data = request.get_json()

        if 'from' not in data or 'to' not in data:
            return jsonify({"error": "From and to date required"}), 400

        from_date = data.get('from')
        to_date = data.get('to')
        db_data = DBService.read_data()

        # 1. Obtener hábitos del usuario
        user_habits = [h for h in db_data["habits"] if h["user_email"] == user_email]
        user_habit_ids = {h["id"] for h in user_habits}

        # 2. Filtrar trackings por rango de fechas Y habit_id del usuario
        user_tracking = [
            t for t in db_data["tracking"]
            if from_date <= t["date"] <= to_date and t["habit_id"] in user_habit_ids
        ]

        response = {
            "habits": user_habits,
            "tracking": user_tracking
        }

        logger.info(f"Trackings found: {response}")
        return jsonify(response), 200

    except Exception as e:
        logger.error(f"Error fetching tracking: {e}")
        return jsonify({"error": "Error fetching tracking data"}), 400

@habits.route('/tracking/<string:user_email>', methods=['POST'])
@cross_origin()
def create_tracking(user_email):
    try:
        logger.info("Creating habit tracking")
        user_exists = UserService.validate_user_exists(user_email)

        if not user_exists:
            return jsonify({"error": "User not found"}), 404 
    
        tracking_data = request.get_json()
        data = DBService.read_data()

        if not "habit_id" in tracking_data or not "date" in tracking_data:
            return jsonify({"error": "Date and habit ID required"}), 400
    
        new_track = {
            "habit_id": tracking_data["habit_id"],
            "date": tracking_data["date"]
        }

        logger.info(f"New track to save: {new_track}")


        new_track['id'] = len(data["tracking"]) + 1

        if new_track not in data["tracking"]:
            data["tracking"].append(new_track)
            DBService.save_data(data)

        return jsonify(new_track), 201
    except Exception as e:
        logger.error(f"Error saving tracking: {e}")
        return jsonify({"error": "Error saving tracking data"}), 400


@habits.route('/tracking/<string:user_email>/<int:habit_id>/<string:habit_date>', methods=['DELETE'])
@cross_origin()
def delete_tracking(user_email, habit_id, habit_date):
    try:
        logger.info("Deleting habit tracking")
        
        if not UserService.validate_user_exists(user_email):
            return jsonify({"error": "User not found"}), 404

        data = DBService.read_data()

        # Verificar si existe un hábito con ese ID
        habit_exists = any(h["id"] == habit_id for h in data["habits"])
        if not habit_exists:
            return jsonify({"error": "Habit not found"}), 404

        original_count = len(data["tracking"])
        data["tracking"] = [
            t for t in data["tracking"]
            if not (t["habit_id"] == habit_id and t["date"] == habit_date)
        ]

        if len(data["tracking"]) == original_count:
            # No se eliminó nada: no existía ese tracking
            return jsonify({"message": "No matching tracking entry found"}), 200

        DBService.save_data(data)

        return jsonify({"message": "Tracking entry deleted"}), 200

    except Exception as e:
        logger.error(f"Error deleting tracking: {e}")
        return jsonify({"error": "Error deleting tracking data"}), 400
