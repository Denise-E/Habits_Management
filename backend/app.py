from flask import Flask
from flask_cors import CORS, cross_origin
from src.routes.habits_routes import habits
from src.routes.users_routes import users

app = Flask(__name__)
CORS(app)

# blueprint config
app.register_blueprint(habits, url_prefix="/api/habits")
app.register_blueprint(users, url_prefix="/api/users")


# Route to verify the backend is running
@app.route("/api/health", methods=['GET'])
@cross_origin()
def health():
    return {"msg": "OK"}, 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
