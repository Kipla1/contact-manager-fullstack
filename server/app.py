from flask import Flask, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager

from config import Config, db
from controllers.auth_controllers import auth_bp
from controllers.contacts_controller import contacts_bp

app = Flask(__name__)
app.config.from_object(Config)

# ✅ Enable CORS only for frontend port
CORS(app, origins="http://localhost:5173", supports_credentials=True)

# ✅ Initialize extensions
db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

# ✅ Register blueprints without '/auth' prefix (as requested)
app.register_blueprint(auth_bp)
app.register_blueprint(contacts_bp, url_prefix='/contacts')

@app.route('/')
def index():
    return jsonify({"message": "Backend server running"}), 200

@app.route('/health')
def health_check():
    return jsonify({"status": "ok"}), 200

if __name__ == '__main__':
    app.run(port=5000, debug=True)