from app.services.extenstions import db

student_course = db.Table(
    "student_course",
    db.Column("student_course_id", db.Integer, primary_key=True),
    db.Column("user_id", db.Integer, db.ForeignKey("users.uid")),
    db.Column("course_id", db.Integer, db.ForeignKey("courses.course_id"))
)