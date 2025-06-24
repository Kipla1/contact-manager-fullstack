<<<<<<< HEAD
from flask import Flask, request, jsonify
from flask_migrate import Migrate
from flask_cors import CORS
from .config import db, Config
from .contacts import Contact, add_contact, edit_contact, delete_contact
from werkzeug.exceptions import NotFound
=======
from config import app, db
from models.contacts import Contact
from controllers.add_controller import create_contact
>>>>>>> 4fd95dff8ef250ea63809762a9de09bfbd667576

# Import all models here to ensure they're registered
# from models.user import User  # when you create it
# from models.email import Email  # when you create it

<<<<<<< HEAD
# Connect to frontend
CORS(app)

# Connect app to db
db.init_app(app)

# App configuration
app.config.from_object(Config)

# Load database migrations
migrate = Migrate(app, db)
=======
# Routes
@app.route('/api/contacts', methods=['POST'])
def add_contact():
    return create_contact()

@app.route('/api/test', methods=['GET'])
def test():
    return {'message': 'SQLAlchemy backend is running!'}
>>>>>>> 4fd95dff8ef250ea63809762a9de09bfbd667576

# Create database tables
with app.app_context():
    db.create_all()

# POST: Add a new contact
@app.route('/api/contacts', methods=['POST'])
def create_contact():
    try:
        data = request.get_json()
        contact = add_contact(
            first_name=data['first_name'],
            last_name=data['last_name'],
            phone_number=data.get('phone_number')
        )
        return jsonify(contact), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Server error'}), 500

# GET: Fetch a contact by ID
@app.route('/api/contacts/<int:id>', methods=['GET'])
def get_contact(id):
    try:                        
        contact = Contact.query.get_or_404(id)
        return jsonify(contact.to_dict())
    except NotFound:
        return jsonify({'error': 'Contact not found'}), 404

# PUT: Edit a contact by ID
@app.route('/api/contacts/<int:id>', methods=['PUT'])
def update_contact(id):
    try:
        data = request.get_json()
        contact = edit_contact(
            contact_id=id,
            first_name=data.get('first_name'),
            last_name=data.get('last_name'),
            phone_number=data.get('phone_number')
        )
        return jsonify(contact)
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except NotFound:
        return jsonify({'error': 'Contact not found'}), 404

# DELETE: Delete a contact by ID
@app.route('/api/contacts/<int:id>', methods=['DELETE'])
def delete_contact_route(id):
    try:
        result = delete_contact(id)
        return jsonify(result)
    except NotFound:
        return jsonify({'error': 'Contact not found'}), 404

# GET: Fetch all contacts
@app.route('/api/contacts', methods=['GET'])
def get_all_contacts():
    try:
        contacts = Contact.query.all()
        return jsonify([contact.to_dict() for contact in contacts])
    except Exception as e:
        return jsonify({'error': 'Server error'}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create tables if they don't exist
    app.run(debug=True)