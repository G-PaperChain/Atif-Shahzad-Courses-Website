from app import db

enrollments = db.Table(
    "enrollments",
    db.Column("user_id", db.Integer, db.ForeignKey("users.uid"), primary_key=True),
    db.Column("course_id", db.Integer, db.ForeignKey("courses.course_id"), primary_key=True)
)