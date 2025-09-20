from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.Course import Course
from app.services.utils import admin_required

courses_bp = Blueprint('courses', __name__)

@courses_bp.route('/admin/courses', methods=['POST'])
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
