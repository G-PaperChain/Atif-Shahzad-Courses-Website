from app import db
from datetime import date
from .associations import student_course

class User(db.Model):
    __tablename__ = 'users'

    uid = db.Column(db.Integer, primary_key=True)
    kauid = db.Column(db.Integer, unique=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    name = db.Column(db.String(50), nullable=False)
    role = db.Column(db.String(20), default="student")
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.Date, default=date.today)

    courses = db.relationship(
        "Course",
        secondary=student_course,
        back_populates="students"
    )

    quiz_marks = db.relationship("QuizMark", back_populates="student", cascade="all, delete")
    
    def to_dict(self):
        return {
            "id": self.uid,
            "kauid": self.kauid,
            "email": self.email,
            "name": self.name,
            "role": self.role,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "courses_names": [c.course_name for c in self.courses],
            "courses_codes": [c.course_code for c in self.courses],
            "course_ids": [c.course_id for c in self.courses],
        }
