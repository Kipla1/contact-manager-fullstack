from flask import Flask, request, jsonify
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from config import db, Config
from server.models.user import User
from server.models.contacts import Contact
from server.controllers.contacts_controller import create_contact

app = Flask(__name__)
jwt = JWTManager(app)
CORS(app, origins="*", methods=["GET", "POST", "PUT", "DELETE"])
app.config.from_object(Config)
#connect app to db
db.init_app(app)    

migrate = Migrate(app, db)  


# Import all models here to ensure they're registered
# from models.user import User  # when you create it
# from models.email import Email  # when you create it

# Routes

@app.route('/')
def index():
    return "<h1 style='color: red; margin-left: 60px;'>Backend server running</h1>"

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response


@app.route('/api/contacts', methods=['POST'])
def add_contact():
    return create_contact()


@app.route('/api/test', methods=['GET'])
def test():
    return {'message': 'SQLAlchemy backend is running!'}

# registration route
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Basic validation
    if not data or not all(key in data for key in ['username', 'email', 'password']):
        return jsonify({'message': 'Missing required fields'}), 400
    
    # Check if user exists
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'message': 'Username already exists'}), 400
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already exists'}), 400
    
    try:
        # Create new user
        hashed_password = generate_password_hash(data['password'])
        new_user = User(
            username=data['username'],
            email=data['email'],
            password_hash=hashed_password
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({
            'message': 'User created successfully',
            'user': {
                'id': new_user.id,
                'username': new_user.username,
                'email': new_user.email
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Registration failed: {str(e)}'}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    
    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401 
    
    access_token = create_access_token(identity=user.id)
    return jsonify({'access_token': access_token}), 200

# protection for existing routes
@app.route('/contacts', methods=['GET'])
@jwt_required
def get_contacts():
    current_user_id = get_jwt_identity()   
    contacts = Contact.query.filter_by(user_id=current_user_id).all()
    return jsonify([contact.to_dict()] for contact in contacts)
    
if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create tables if they don't exist
    app.run(debug=True)