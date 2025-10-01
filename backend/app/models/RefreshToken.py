from app.services.extenstions import db
from datetime import datetime

class RefreshToken(db.Model):
    __tablename__ = "refresh_tokens"

    refresh_token_id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, unique=True, index=True)
    uid = db.Column(db.Integer, db.ForeignKey("users.uid"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.today)
    revoked = db.Column(db.Boolean, default=False)

    user = db.relationship("User", back_populates="refresh_tokens")