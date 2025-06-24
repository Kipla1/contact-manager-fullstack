from flask import Flask
from flask_migrate import Migrate
from flask_cors import CORS
from config import db, Config

app = Flask(__name__)

#Connect to frontend
CORS(app)

#App configuration
app.config.from_object(Config)  

#connect app to db
db.init_app(app)    

#load database
migrate = Migrate(app, db)

if __name__ == '__main__':
    app.run(debug=True)