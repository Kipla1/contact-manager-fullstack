# Contact Manager Fullstack

A fullstack web application for managing your personal contacts. Users can register, log in, add, edit, delete, favorite, and block contacts. The app features JWT authentication, user-specific data, and a modern React frontend.

---

## Features

- User registration and login (JWT authentication)
- Add, edit, and delete contacts
- Mark contacts as favorite or blocked
- Filter and search contacts
- Responsive, modern UI with React
- Secure backend with Flask, SQLAlchemy, and Flask-Migrate
- Only authenticated users can access and modify their contacts

---

## Tech Stack

- **Frontend:** React, Vite, Axios, React Router, React Icons
- **Backend:** Flask, Flask-JWT-Extended, Flask-CORS, SQLAlchemy, Flask-Migrate
- **Database:** SQLite (default, easy to swap for PostgreSQL/MySQL)

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Kipla1/contact-manager-fullstack.git
cd contact-manager-fullstack
```

### 2. Backend Setup

```bash
cd server
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
export FLASK_APP=app.py
flask db upgrade
flask run
```

### 3. Frontend Setup

```bash
cd ../client
npm install
npm run dev
```

### 4. Environment Variables

- **Backend:**  
  Set up your `.env` or export variables for Flask as needed (e.g., `SECRET_KEY`, `JWT_SECRET_KEY`).
- **Frontend:**  
  Edit `client/.env` and set:
  ```
  VITE_API_URL=http://127.0.0.1:5000
  ```

---

## Usage

- Register a new user or log in.
- Add new contacts with name, email, and phone.
- Edit or delete contacts.
- Click the star icon to favorite/unfavorite a contact.
- Click the lock icon to block/unblock a contact.
- Use the search bar and filters to find contacts quickly.

---

## Project Structure

```
contact-manager-fullstack/
├── client/      # React frontend
├── server/      # Flask backend
├── migrations/  # Alembic migration scripts
├── contacts.db  # SQLAlchemy database (default)
└── README.md
```

---

## License

MIT License

---

## Author

## Authors

- [Oscar ](https://github.com/Kipla1)
- [Fabian ](https://github.com/Sqwoze)
- [Jennifer ](https://github.com/JENNIFER754-DEL)
- [Brandon ](https://github.com/Brandon864)