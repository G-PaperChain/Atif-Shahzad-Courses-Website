from app import db
from datetime import datetime

class Course(db.Model):
    course_id = db.Column(db.Integer, primary_key=True)
    course_code = db.Column(db.VARCHAR(10), unique=True, nullable=False)
    course_name = db.Column(db.String(120), unique=True, nullable=False)
    course_description = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now().date())
    
    def to_dict(self):
        return {
            'course_id': self.course_id,
            'course_code' : self.course_code,
            'course_name': self.course_name,
            'course_description': self.course_description,
            'created_at': self.created_at,
        }