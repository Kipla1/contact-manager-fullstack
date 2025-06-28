from server.config import db
from datetime import datetime
from sqlalchemy.orm import validates


class Contact(db.Model):
    __tablename__ = 'contacts'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=True)
    phone = db.Column(db.String(20), nullable=True)
    is_favorite = db.Column(db.Integer, default=1, nullable=False)
    is_blocked = db.Column(db.Integer, default=1, nullable=False)
    
    # Add foreign key to User
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # SQLAlchemy validators
    @validates('email')
    def validate_email(self, key, email):
        if email and '@' not in email:
            raise ValueError('Invalid email format')
        return email
    
    @validates('name')
    def validate_name(self, key, name):
        if not name or len(name.strip()) < 2:
            raise ValueError('Name must be at least 2 characters long')
        return name.strip()
    
    @validates('phone')
    def validate_phone(self, key, phone):
        if phone:
            phone_digits = ''.join(filter(str.isdigit, phone))
            if len(phone_digits) < 5:
                raise ValueError('Phone number must contain at least 5 digits')
        return phone
    
    def __repr__(self):
        return f'<Contact {self.name}>'
    
    def to_dict(self):
        """Convert contact object to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'isFavorite': self.is_favorite == 2,
            'isBlocked': self.is_blocked == 2,
            'is_favorite': self.is_favorite,  # raw value if needed
            'is_blocked': self.is_blocked,    # raw value if needed
            # Add other fields as needed
        }
    
    @classmethod
    def create_contact(cls, contact_data):
        """
        Create a new contact using SQLAlchemy session management
        
        Args:
            contact_data (dict): Dictionary containing contact information
                Required: name, user_id
                Optional: email, phone, address, notes, is_favorite, is_blocked
        
        Returns:
            tuple: (contact_object, error_message)
                - If successful: (Contact object, None)
                - If failed: (None, error message string)
        """
        from sqlalchemy.exc import IntegrityError, DataError
        
        try:
            # Pre-validation using the static method
            is_valid, validation_error = cls.validate_contact_data(contact_data)
            if not is_valid:
                return None, validation_error
            
            # Create new contact object with SQLAlchemy
            new_contact = cls()
            
            # Set attributes (SQLAlchemy validators will run automatically)
            new_contact.name = contact_data['name'].strip()
            new_contact.user_id = int(contact_data['user_id'])
            
            # Optional fields
            if contact_data.get('email'):
                new_contact.email = contact_data['email'].strip()
            if contact_data.get('phone'):
                new_contact.phone = contact_data['phone'].strip()
            if contact_data.get('address'):
                new_contact.address = contact_data['address'].strip()
            if contact_data.get('notes'):
                new_contact.notes = contact_data['notes'].strip()
                
            new_contact.is_favorite = bool(contact_data.get('is_favorite', False))
            new_contact.is_blocked = bool(contact_data.get('is_blocked', False))
            
            # Add to session and commit
            db.session.add(new_contact)
            db.session.commit()
            
            return new_contact, None
            
        except ValueError as ve:
            # SQLAlchemy validator errors
            db.session.rollback()
            return None, str(ve)
        except IntegrityError as ie:
            # Database constraint violations (foreign key, unique constraints)
            db.session.rollback()
            if 'FOREIGN KEY constraint failed' in str(ie) or 'foreign key constraint' in str(ie).lower():
                return None, 'Invalid user ID: User does not exist'
            return None, f'Database constraint error: {str(ie)}'
        except DataError as de:
            # Data type errors
            db.session.rollback()
            return None, f'Invalid data format: {str(de)}'
        except Exception as e:
            # Any other database errors
            db.session.rollback()
            return None, f'Database error: {str(e)}'
    
    @staticmethod
    def validate_contact_data(contact_data):
        """
        Standalone validation function that can be used before creating contact
        
        Args:
            contact_data (dict): Contact data to validate
            
        Returns:
            tuple: (is_valid, error_message)
                - If valid: (True, None)
                - If invalid: (False, error message string)
        """
        # Required fields
        if not contact_data.get('name'):
            return False, 'Name is required'
        
        if not contact_data.get('user_id'):
            return False, 'User ID is required'
        
        # Name validation
        name = contact_data['name'].strip()
        if len(name) < 2:
            return False, 'Name must be at least 2 characters long'
        
        if len(name) > 100:
            return False, 'Name is too long (max 100 characters)'
        
        # Email validation
        if contact_data.get('email'):
            email = contact_data['email'].strip()
            if email:
                if '@' not in email or '.' not in email.split('@')[-1]:
                    return False, 'Invalid email format'
                if len(email) > 120:
                    return False, 'Email is too long (max 120 characters)'
        
        # Phone validation
        if contact_data.get('phone'):
            phone = contact_data['phone'].strip()
            if phone:
                # Check if phone has reasonable length
                if len(phone) < 5 or len(phone) > 20:
                    return False, 'Phone number must be between 5 and 20 characters'
                
                # Remove formatting and check if it contains digits
                phone_digits = ''.join(filter(str.isdigit, phone))
                if len(phone_digits) < 5:
                    return False, 'Phone number must contain at least 5 digits'
        
        # User ID validation
        try:
            user_id = int(contact_data['user_id'])
            if user_id <= 0:
                return False, 'User ID must be a positive integer'
        except (ValueError, TypeError):
            return False, 'Invalid user ID format'
        
        return True, None
    
    @classmethod
    def delete_contact(cls, contact_id):
        """
        Delete a contact by ID.

        Args:
            contact_id (int): ID of the contact to delete.

        Returns:
            tuple: (success, error_message)
                - If successful: (True, None)
                - If failed: (False, error message string)
        """
        try:
            contact = cls.query.get(contact_id)
            if not contact:
                return False, "Contact not found"
            
            db.session.delete(contact)
            db.session.commit()
            return True, None

        except Exception as e:
            db.session.rollback()
            return False, f"Failed to delete contact: {str(e)}"


