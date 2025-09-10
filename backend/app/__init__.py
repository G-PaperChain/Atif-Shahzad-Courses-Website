from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import os
from datetime import timedelta
from dotenv import load_dotenv 

load_dotenv() 

db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    
     # Configuration - now reads from .env file
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)
    
    # Validate required environment variables
    if not app.config['SECRET_KEY']:
        raise ValueError("SECRET_KEY environment variable is required")
    if not app.config['JWT_SECRET_KEY']:
        raise ValueError("JWT_SECRET_KEY environment variable is required")
    if not app.config['SQLALCHEMY_DATABASE_URI']:
        raise ValueError("DATABASE_URL environment variable is required")
    
    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    CORS(app, origins=['http://localhost:5173'])  # Update for production
    
    # Register blueprints
    from app.routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    
    # Create tables
    with app.app_context():
        db.create_all()
    
    return app