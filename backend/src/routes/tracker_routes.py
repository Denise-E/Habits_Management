from flask import Blueprint, request, jsonify
from datetime import datetime, date

from flask_cors import cross_origin

from src.services.db_service import DBService
from utils.logger import logger


tracker = Blueprint('tracker', __name__)

@tracker.route('/detail', methods=['POST'])
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

@tracker.route('', methods=['POST'])
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


@tracker.route('', methods=['DELETE'])
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
