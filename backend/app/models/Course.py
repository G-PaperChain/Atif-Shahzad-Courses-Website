from app import db
from datetime import datetime
from .associations import enrollments

class Course(db.Model):
    __tablename__ = 'courses'

    course_id = db.Column(db.Integer, primary_key=True)
    course_code = db.Column(db.VARCHAR(10), unique=True, nullable=False)
    course_name = db.Column(db.String(120), unique=True, nullable=False)
    course_description = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now().date())


    students = db.relationship(
        "User",
        secondary=enrollments,
        back_populates="courses"
    )
    
    def to_dict(self):
        return {
            'course_id': self.course_id,
            'course_code' : self.course_code,
            'course_name': self.course_name,
            'course_description': self.course_description,
            'created_at': self.created_at,
            "students_names": [u.name for u in self.students],
            "students_kauId": [u.kau_id for u in self.students]
        }