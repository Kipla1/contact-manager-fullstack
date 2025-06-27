from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
import os
from datetime import timedelta



# Configuration
class Config:
 SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///contacts.db'
 SQLALCHEMY_TRACK_MODIFICATIONS = False
 SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-secret-key-here'
 JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=2)
 

# Initialize extensions
db = SQLAlchemy()

