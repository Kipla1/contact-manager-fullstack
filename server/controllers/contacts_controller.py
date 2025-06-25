from server.config import db
from flask import jsonify, request, Blueprint
from flask_jwt_extended import get_jwt_identity
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
