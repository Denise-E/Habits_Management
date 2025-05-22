import json
import os

from utils.logger import logger

DATA_PATH = os.path.join("src", "database", "data.json")


class DBService:

    @staticmethod
    def load_data():
        logger.info("Loading saved data")
        if not os.path.exists(DATA_PATH):
            return {"users": [], "habits": [], "tracking": []}
        with open(DATA_PATH, "r") as f:
            return json.load(f)

    @staticmethod
    def save_data(data):
        logger.info("Saving new data")
        with open(DATA_PATH, "w") as f:
            json.dump(data, f, indent=4)

    @staticmethod
    def read_data():
        try:
            with open(DATA_PATH, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error reading data file: {e}")
            return {"users": [], "habits": [], "tracking": []}