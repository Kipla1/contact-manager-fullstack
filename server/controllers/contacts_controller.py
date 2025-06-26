from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.contacts import Contact
from config import db


contacts_bp = Blueprint('contacts_bp', __name__)

@contacts_bp.route('', methods=['GET'])
@jwt_required()
def get_contacts():
    user_id = get_jwt_identity()
    contacts = Contact.query.filter_by(user_id=user_id).all()
    return jsonify([c.to_dict() for c in contacts])

@contacts_bp.route('/<int:contact_id>', methods=['GET'])
@jwt_required()
def get_contact(contact_id):
    user_id = get_jwt_identity()
    contact = Contact.query.filter_by(id=contact_id, user_id=user_id).first()
    if not contact:
        return jsonify({'message': 'Contact not found'}), 404
    return jsonify(contact.to_dict())

@contacts_bp.route('', methods=['POST'])
@jwt_required()
def add_contact():
    user_id = get_jwt_identity()
    data = request.get_json()
    data['user_id'] = user_id
    contact, error = Contact.create_contact(data)
    if error:
        return jsonify({'message': error}), 400
    return jsonify(contact.to_dict()), 201

@contacts_bp.route('/<int:contact_id>', methods=['PUT'])
@jwt_required()
def update_contact(contact_id):
    user_id = get_jwt_identity()
    contact = Contact.query.filter_by(id=contact_id, user_id=user_id).first()
    if not contact:
        return jsonify({'message': 'Contact not found'}), 404
    data = request.get_json()
    try:
        if 'name' in data:
            contact.name = data['name']
        if 'email' in data:
            contact.email = data['email']
        if 'phone' in data:
            contact.phone = data['phone']
        if 'address' in data:
            contact.address = data['address']
        if 'is_favorite' in data:
            contact.is_favorite = data['is_favorite']
        if 'is_blocked' in data:
            contact.is_blocked = data['is_blocked']
        db.session.commit()
        return jsonify(contact.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Update failed: {str(e)}'}), 400

@contacts_bp.route('/<int:contact_id>', methods=['PATCH'])
@jwt_required()
def patch_contact(contact_id):
    user_id = get_jwt_identity()
    contact = Contact.query.filter_by(id=contact_id, user_id=user_id).first()
    if not contact:
        return jsonify({'message': 'Contact not found'}), 404
    data = request.get_json()
    try:
        if 'is_favorite' in data:
            contact.is_favorite = data['is_favorite']
        if 'is_blocked' in data:
            contact.is_blocked = data['is_blocked']
        db.session.commit()
        return jsonify(contact.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Update failed: {str(e)}'}), 400

@contacts_bp.route('/<int:contact_id>', methods=['DELETE'])
@jwt_required()
def delete_contact(contact_id):
    user_id = get_jwt_identity()
    contact = Contact.query.filter_by(id=contact_id, user_id=user_id).first()
    if not contact:
        return jsonify({'message': 'Contact not found'}), 404
    try:
        db.session.delete(contact)
        db.session.commit()
        return jsonify({'message': 'Contact deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Delete failed: {str(e)}'}), 400
