from flask import Flask
from src.routes.habits_routes import habits_bp
from src.routes.users_routes import users_bp

app = Flask(__name__)

# Registro del blueprint para las rutas de hábitos
app.register_blueprint(habits_bp, url_prefix="/api/habits")
app.register_blueprint(users_bp, url_prefix="/api/users")


# Ruta de salud para verificar si la API está activa
@app.route("/api/health", methods=['GET'])
def health():
    return {"msg": "OK"}, 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
