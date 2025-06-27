from server.config import db
from flask import jsonify, request, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.models.contacts import Contact

create_bp = Blueprint('create_bp', __name__)

@create_bp.route('/add')
def create_contact():
    data = request.get_json()
    current_user_id = get_jwt_identity()
    if not data or not all(key in data for key in ['name', 'email', 'phone']):
        return jsonify({'message': 'Missing required fields'}), 400

    new_contact = Contact(
        name=data['name'],
        email=data['email'],
        phone=data['phone'],
        user_id=current_user_id
    )
    db.session.add(new_contact)
    db.session.commit()
    return jsonify(new_contact.to_dict()), 201

@create_bp.route('/contacts', methods=['GET'])
@jwt_required()
def get_contacts():
    user_id = get_jwt_identity()
    contacts = Contact.query.filter_by(user_id=user_id).all()
    return jsonify([contact.to_dict() for contact in contacts])

@create_bp.route('/contacts/<int:id>', methods=['PATCH'])
@jwt_required()
def patch_contact(id):
    data = request.get_json()
    contact = Contact.query.get_or_404(id)
    # Only update fields that are present in the request
    if 'isBlocked' in data:
        contact.isBlocked = bool(data['isBlocked'])
    if 'isFavorite' in data:
        contact.isFavorite = bool(data['isFavorite'])
    # ...handle other fields as needed...
    db.session.commit()
    return jsonify(contact.to_dict()), 200
