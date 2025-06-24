from flask import Flask, request, jsonify
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from config import db, Config
from models.user import User
from models.contacts import Contact

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'secret-key'
jwt = JWTManager(app)

#Connect to frontend
CORS(app)

#App configuration
app.config.from_object(Config)  

#connect app to db
db.init_app(app)    

#load database
migrate = Migrate(app, db)

# registration route
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Basic validation
    if not data or not all(key in data for key in ['username', 'email', 'password']):
        return jsonify({'message': 'Missing required fields'}), 400
    
    # Check if user exists (you'll need to implement this)
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'message': 'Username already exists'}), 400
    
    # Create new user
    hashed_password = generate_password_hash(data['password'])
    new_user = User(
        username=data['username'],
        email=data['email'],
        password_hash=hashed_password
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': 'User created successfully'}), 201

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
    app.run(debug=True)