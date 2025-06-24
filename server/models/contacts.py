from .config import db
from sqlalchemy.exc import IntegrityError
from werkzeug.exceptions import NotFound
from flask_jwt_extended import jwt_required, get_jwt_identity

class Contact(db.Model):
    __tablename__ = 'contacts'
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.String(20), nullable=True)
    isFavorite = db.Column(db.Boolean, default=False)  
    isBlocked = db.Column(db.Boolean, default=False)   
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # Added from table

    def to_dict(self):
        """Convert Contact object to dictionary for JSON response."""
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'phone_number': self.phone_number,
            'isFavorite': self.isFavorite,
            'isBlocked': self.isBlocked
        }

    @jwt_required()
    def edit(self, data):
        """
        Edit the contact's details for the authenticated user.
        Args:
            data (dict): Dictionary containing updated fields (first_name, last_name, phone_number, isFavorite, isBlocked)
        Returns:
            tuple: (json_response, status_code) or raises an exception if unauthorized
        """
        user_id = get_jwt_identity()
        if self.user_id != user_id:
            return jsonify({'error': 'Unauthorized access to this contact'}), 403

        if 'first_name' in data:
            self.first_name = data['first_name']
        if 'last_name' in data:
            self.last_name = data['last_name']
        if 'phone_number' in data:
            self.phone_number = data['phone_number']
        if 'isFavorite' in data:
            self.isFavorite = bool(data['isFavorite'])
        if 'isBlocked' in data:
            self.isBlocked = bool(data['isBlocked'])

        try:
            db.session.commit()
            return self.to_dict(), 200
        except IntegrityError as e:
            db.session.rollback()
            return jsonify({'error': 'Database integrity error: ' + str(e)}), 400
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': 'Server error: ' + str(e)}), 500

  

@jwt_required()
def edit_contact(contact_id, first_name=None, last_name=None, phone_number=None, isFavorite=None, isBlocked=None):
    """
    Edit an existing contact for the authenticated user.
    Args:
        contact_id (int): The ID of the contact to edit
        first_name (str, optional): Updated first name
        last_name (str, optional): Updated last name
        phone_number (str, optional): Updated phone number
        isFavorite (bool, optional): Updated favorite status
        isBlocked (bool, optional): Updated blocked status
    Returns:
        dict: Updated contact data
    Raises:
        NotFound: If contact is not found
        ValueError: If no fields are provided for update
    """
    contact = Contact.get_by_id(contact_id)
    data = {k: v for k, v in {
        'first_name': first_name,
        'last_name': last_name,
        'phone_number': phone_number,
        'isFavorite': isFavorite,
        'isBlocked': isBlocked
    }.items() if v is not None}
    if not data:
        raise ValueError("No fields provided for update")
    return contact.edit(data)

