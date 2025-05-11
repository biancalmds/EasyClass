from flask_sqlalchemy import SQLAlchemy
import os

db = SQLAlchemy()

class Config:
    HOST = '0.0.0.0'
    PORT = 5000
    DEBUG = True

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///school-db.db')
