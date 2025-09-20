from app import db
from datetime import datetime
from .associations import enrollments

class User(db.Model):
    __tablename__ = 'users'

    uid = db.Column(db.Integer, primary_key=True)
    kau_id = db.Column(db.Integer)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    name = db.Column(db.String(50), nullable=False)
    role = db.Column(db.String(20), default='student')
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.now)

    courses = db.relationship(
        "Course",
        secondary=enrollments,
        back_populates="students"
    )
    
    def to_dict(self):
        return {
            'id': self.uid,
            'kau_id': self.kau_id,
            'email': self.email,
            'name': self.name,
            'role': self.role,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            "courses_names": [c.course_name for c in self.courses],
            "courses_codes": [c.course_code for c in self.courses]
        }