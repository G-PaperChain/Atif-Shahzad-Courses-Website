from app.services.extenstions import db
from datetime import datetime
from .associations import student_course

class QuizMark(db.Model):
    __tablename__ = "quiz_marks"

    quiz_mark_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.uid"))
    quiz_id = db.Column(db.Integer, db.ForeignKey("quizzes.quiz_id"))
    score = db.Column(db.Float, nullable=False)

    student = db.relationship("User", back_populates="quiz_marks")
    quiz = db.relationship("Quiz", back_populates="marks")

