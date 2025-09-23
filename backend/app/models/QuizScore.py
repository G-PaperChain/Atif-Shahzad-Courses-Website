from app import db
from datetime import datetime
from .associations import enrollments

class QuizScore(db.Model):
    __tablename__ = 'courses'

    quiz_id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.VARCHAR(10), unique=True, nullable=False)
    uid = db.Column(db.String(120), unique=True, nullable=False)
    quiz_score = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now().date())