from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate
import os
import sys
from datetime import timedelta
from dotenv import load_dotenv
from flask_wtf.csrf import CSRFProtect

load_dotenv()

db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()
migrate = Migrate()
csrf = CSRFProtect()

def create_app():
    app = Flask(__name__)

    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY')

    app.config['JWT_TOKEN_LOCATION'] = ['cookies']
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=15)
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=7)
    app.config['JWT_COOKIE_SECURE'] = True
    app.config['JWT_COOKIE_HTTPONLY'] = True
    app.config['JWT_COOKIE_SAMESITE'] = 'Lax'
    app.config['JWT_ACCESS_COOKIE_NAME'] = 'access_token_cookie'
    app.config['JWT_REFRESH_COOKIE_NAME'] = 'refresh_token_cookie'
    app.config['JWT_CSRF_IN_COOKIES'] = False

    app.config['WTF_CSRF_ENABLED'] = True
    app.config['WTF_CSRF_CHECK_DEFAULT'] = False
    app.config['WTF_CSRF_METHODS'] = ['POST', 'PUT', 'PATCH', 'DELETE']
    app.config['WTF_CSRF_HEADERS'] = ['X-CSRFToken', 'X-CSRF-Token']
    

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
    # csrf.init_app(app)
    
    frontend_url = os.environ.get('FRONTEND_URL', 'https://dratifshahzad.com')
    CORS(app, 
         resources={r"/api/*": {"origins": [frontend_url]}},
         supports_credentials=True,
         allow_headers=["Content-Type", "Authorization"])
    
    migrate.init_app(app, db)

    @app.route('/api/')
    def api_health_check():
        return {'status': 'API is running', 'version': '1.0'}, 200
    
    @app.route('/api/debug')
    def debug_info():
        return {
            'python_version': sys.version,
            'flask_env': os.environ.get('FLASK_ENV', 'not set'),
            'database_url': 'configured' if os.environ.get('DATABASE_URL') else 'not configured',
            'routes': [str(rule) for rule in app.url_map.iter_rules()]
        }, 200

    from app.routes.auth import auth_bp
    from app.routes.courses import courses_bp
    from app.routes.ncaaa_courses import ncaaa_courses_bp
    from app.routes.admin import admin_bp
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(courses_bp, url_prefix='/api')
    app.register_blueprint(ncaaa_courses_bp, url_prefix='/api')
    app.register_blueprint(admin_bp, url_prefix='/api')

    return app