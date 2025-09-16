from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate
import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()
migrate = Migrate()

def create_app():
    app = Flask(__name__)

    # Config
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)

    # Validate env vars
    if not app.config['SECRET_KEY']:
        raise ValueError("SECRET_KEY environment variable is required")
    if not app.config['JWT_SECRET_KEY']:
        raise ValueError("JWT_SECRET_KEY environment variable is required")
    if not app.config['SQLALCHEMY_DATABASE_URI']:
        raise ValueError("DATABASE_URL environment variable is required")

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    
    frontend_url = os.environ.get('FRONTEND_URL', 'https://dratifshahzad.com')
    CORS(app, 
         resources={r"/api/*": {"origins": [frontend_url]}},
         supports_credentials=True,
         allow_headers=["Content-Type", "Authorization"])
    
    migrate.init_app(app, db)

    @app.route('/')
    def health_check():
        return {'status': 'API is running', 'version': '1.0'}, 200

    @app.route('/health')
    def health():
        return {'status': 'healthy'}, 200

    from app.routes.auth import auth_bp
    from app.routes.courses import courses_bp
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(courses_bp, url_prefix='/api')

    return app