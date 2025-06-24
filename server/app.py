from config import app, db
from models.contacts import Contact
from controllers.add_controller import create_contact

# Import all models here to ensure they're registered
# from models.user import User  # when you create it
# from models.email import Email  # when you create it

# Routes
@app.route('/api/contacts', methods=['POST'])
def add_contact():
    return create_contact()

@app.route('/api/test', methods=['GET'])
def test():
    return {'message': 'SQLAlchemy backend is running!'}

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create tables if they don't exist
    app.run(debug=True)