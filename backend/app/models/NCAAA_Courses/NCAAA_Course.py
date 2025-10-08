from app.services.extenstions import db
from datetime import datetime, date

class NCAAA_Course(db.Model):
    course_id = db.Column(db.Integer, primary_key=True)
    course_code = db.Column(db.VARCHAR(6), unique=True, nullable=False)
    course_name = db.Column(db.String(144), unique=True, nullable=False)
    course_description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=date.today)
    
    def to_dict(self):
        return {
            'course_id': self.course_id,
            'course_code' : self.course_code,
            'course_name': self.course_name,
            'course_description': self.course_description,
            'created_at': self.created_at,
        }