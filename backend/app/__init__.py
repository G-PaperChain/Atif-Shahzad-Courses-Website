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
from app.services.extenstions import limiter
from app.models.TokenBlackList import TokenBlocklist
from app.services.extenstions import db, bcrypt, jwt

load_dotenv()

# db = SQLAlchemy()
# bcrypt = Bcrypt()
# jwt = JWTManager()
migrate = Migrate()
csrf = CSRFProtect()

def create_app(config_name=None):
    app = Flask(__name__, static_folder=os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static'))

    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY')
    app.config['JWT_TOKEN_LOCATION'] = ['cookies']
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=15)
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=7)
    app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
    app.config['JWT_COOKIE_CSRF_PROTECT'] = True
    app.config["JWT_ACCESS_CSRF_COOKIE_NAME"] = "csrf_access_token"
    app.config["JWT_ACCESS_CSRF_HEADER_NAME"] = "X-CSRF-TOKEN"
    app.config['JWT_COOKIE_SECURE'] = True
    app.config['JWT_COOKIE_HTTPONLY'] = True
    app.config["JWT_COOKIE_DOMAIN"] = os.environ.get('JWT_COOKIE_DOMAIN', None)
    app.config['JWT_COOKIE_SAMESITE'] = 'Lax'
    app.config['JWT_ACCESS_COOKIE_NAME'] = 'access_token_cookie'
    app.config['JWT_REFRESH_COOKIE_NAME'] = 'refresh_token_cookie'
    app.config['JWT_CSRF_IN_COOKIES'] = True
    app.config['WTF_CSRF_ENABLED'] = True
    app.config['WTF_CSRF_CHECK_DEFAULT'] = False
    app.config['WTF_CSRF_METHODS'] = ['POST', 'PUT', 'PATCH', 'DELETE']
    app.config['WTF_CSRF_HEADERS'] = ['X-CSRFToken', 'X-CSRF-Token']
    frontend_url = os.environ.get('FRONTEND_URL', 'https://dratifshahzad.com')
    
    if not app.config['SECRET_KEY']:
        raise ValueError("SECRET_KEY environment variable is required")
    if not app.config['JWT_SECRET_KEY']:
        raise ValueError("JWT_SECRET_KEY environment variable is required")
    if not app.config['SQLALCHEMY_DATABASE_URI']:
        raise ValueError("DATABASE_URL environment variable is required")

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    csrf.init_app(app)
    migrate.init_app(app, db)
    limiter.init_app(app)
    
    # Production cookie/CORS settings for cross-subdomain communication
    app.config.setdefault("SESSION_COOKIE_DOMAIN", ".dratifshahzad.com")
    app.config.setdefault("SESSION_COOKIE_SAMESITE", "None")   # allow cross-site cookies
    app.config.setdefault("SESSION_COOKIE_SECURE", True)       # requires HTTPS in production

    # Allowed origins: list your frontend origins explicitly (no wildcard) and localhost for dev
    allowed_origins = [
        "https://dratifshahzad.com",
        "https://www.dratifshahzad.com",
        "https://api.dratifshahzad.com",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]
    CORS(app, origins=allowed_origins, supports_credentials=True)

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
    
    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload):
        jti = jwt_payload["jti"]
        token = db.session.query(TokenBlocklist.id).filter_by(jti=jti).first()
        return token is not None
    
    from app.routes.auth import auth_bp
    from app.routes.courses import courses_bp
    from app.routes.ncaaa_courses import ncaaa_courses_bp
    # from backend.app.routes.admin.admin import admin_bp
    from app.routes.about import about_bp
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(courses_bp, url_prefix='/api')
    app.register_blueprint(ncaaa_courses_bp, url_prefix='/api')
    app.register_blueprint(about_bp, url_prefix='/api')

    # NCAAA RELATED BLUEPRINTS
    from app.routes.admin import admin_bp
    from app.routes.admin import admin_ncaaa_bp
    app.register_blueprint(admin_bp, url_prefix='/api')
    app.register_blueprint(admin_ncaaa_bp, url_prefix='/api')


    return app