from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, date
from app.services.extenstions import db

class TokenBlocklist(db.Model):
    __tablename__ = "token_blocklist"
    
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, index=True)
    created_at = db.Column(db.DateTime, default=date.today)