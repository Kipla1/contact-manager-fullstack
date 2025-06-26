from config import db
from sqlalchemy.orm import validates

class Contact(db.Model):
    __tablename__ = 'contacts'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=True)
    phone = db.Column(db.String(20), nullable=True)
    address = db.Column(db.Text, nullable=True)
    is_favorite = db.Column(db.Boolean, default=False)
    is_blocked = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

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

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'address': self.address,
            'is_favorite': self.is_favorite,
            'is_blocked': self.is_blocked,
            'user_id': self.user_id
        }

    @classmethod
    def create_contact(cls, contact_data):
        from sqlalchemy.exc import IntegrityError, DataError
        try:
            is_valid, error = cls.validate_contact_data(contact_data)
            if not is_valid:
                return None, error
            new_contact = cls()
            new_contact.name = contact_data['name'].strip()
            new_contact.user_id = int(contact_data['user_id'])
            if contact_data.get('email'):
                new_contact.email = contact_data['email'].strip()
            if contact_data.get('phone'):
                new_contact.phone = contact_data['phone'].strip()
            if contact_data.get('address'):
                new_contact.address = contact_data['address'].strip()
            new_contact.is_favorite = bool(contact_data.get('is_favorite', False))
            new_contact.is_blocked = bool(contact_data.get('is_blocked', False))
            db.session.add(new_contact)
            db.session.commit()
            return new_contact, None
        except ValueError as ve:
            db.session.rollback()
            return None, str(ve)
        except IntegrityError as ie:
            db.session.rollback()
            if 'FOREIGN KEY constraint failed' in str(ie).lower():
                return None, 'Invalid user ID: User does not exist'
            return None, f'Database constraint error: {str(ie)}'
        except DataError as de:
            db.session.rollback()
            return None, f'Invalid data format: {str(de)}'
        except Exception as e:
            db.session.rollback()
            return None, f'Database error: {str(e)}'

    @staticmethod
    def validate_contact_data(contact_data):
        if not contact_data.get('name'):
            return False, 'Name is required'
        if not contact_data.get('user_id'):
            return False, 'User ID is required'
        name = contact_data['name'].strip()
        if len(name) < 2 or len(name) > 100:
            return False, 'Name must be 2-100 characters long'
        if contact_data.get('email'):
            email = contact_data['email'].strip()
            if '@' not in email or '.' not in email.split('@')[-1]:
                return False, 'Invalid email format'
            if len(email) > 120:
                return False, 'Email too long (max 120 chars)'
        if contact_data.get('phone'):
            phone = contact_data['phone'].strip()
            if len(phone) < 5 or len(phone) > 20:
                return False, 'Phone must be 5-20 characters'
            phone_digits = ''.join(filter(str.isdigit, phone))
            if len(phone_digits) < 5:
                return False, 'Phone must have at least 5 digits'
        try:
            user_id = int(contact_data['user_id'])
            if user_id <= 0:
                return False, 'User ID must be positive integer'
        except:
            return False, 'Invalid user ID format'
        return True, None
