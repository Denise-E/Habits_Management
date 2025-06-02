
from src.services.db_service import DBService


class UserService:

    @classmethod 
    def validate_user_exists(cls, user_email: str) -> bool:
        db = DBService.load_data()
        user = next((u for u in db["users"] if u["email"] == user_email), None)

        if not user:
            return False
        
        return True
    