from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.Course import Course
from app.models.User import User
from app.models.Quiz import Quiz
from app.models.QuizMark import QuizMark
from app.services.utils import admin_required
import csv

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/admin/add-course', methods=['POST'])
@admin_required 
def add_course():
    try:
        data = request.get_json()
        required_fields = ['course_name', 'course_description', 'course_code']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400

        if Course.query.filter_by(course_code=data['course_code']).first():
            return jsonify({'error': 'Course already registered'}), 409

        course = Course(
            course_code=data['course_code'],
            course_name=data['course_name'],
            course_description=data['course_description']
        )
        db.session.add(course)
        db.session.commit()

        return jsonify({'message': 'Course added successfully', 'course': course.to_dict()}), 201
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@admin_bp.route("/admin/select-data", methods=['POST'])
@admin_required
def receive_select_data():
    if request.is_json():
        data = request.get_json()
        selected_option = data.get('selected_value')

        if selected_option:
            return jsonify({'selected_option': {selected_option}}), 200
        else:
            return jsonify({'error': 'No selected_value provided'}), 400
    else:
        return jsonify({'error': 'Request must be JSON'}), 400

@admin_bp.route('/admin/<int:course_id>/upload_csv', methods=['POST'])
@admin_required
def upload_csv(course_id):

    csvfile = request.files["file"]
    course = Course.query.get_or_404(course_id)

    quizzes = {q.title: q for q in course.quizzes}

    reader = csv.DictReader(csvfile.stream.read().decode("utf-8").splitlines())

    for row in reader:
        user = User.query.filter_by(kauid=row["KAUID"]).first()
        if not user:
            continue

        for quiz_title, score in row.items():
            if quiz_title == "KAUID":
                continue
            quiz = quizzes.get(quiz_title)
            if not quiz:
                quiz = Quiz(title=quiz_title, course=course)
                db.session.add(quiz)
                db.session.flush()
                quizzes[quiz_title] = quiz

            mark = QuizMark(student=user, quiz=quiz, score=float(score))
            db.session.add(mark)

    db.session.commit()
    return {"message": "CSV uploaded successfully"}

