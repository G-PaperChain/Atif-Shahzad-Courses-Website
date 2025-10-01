from app.services.extenstions import db
from datetime import datetime
from .associations import student_course

class Quiz(db.Model):
    __tablename__ = "quizzes"
    
    quiz_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey("courses.course_id"))

    course = db.relationship("Course", back_populates="quizzes")
    marks = db.relationship("QuizMark", back_populates="quiz", cascade="all, delete")
