from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.Course import Course
from app.models.User import User
from app.services.utils import admin_required

courses_bp = Blueprint('courses', __name__)

@courses_bp.route('/courses', methods=['GET'])
def get_courses():
    try:
        courses = Course.query.all()
        courses_data = [course.to_dict() for course in courses]
        return jsonify({
            'success': True,
            'courses': courses_data,
            'total': len(courses_data)
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@courses_bp.route('/user/courses/<int:uid>', methods=['GET'])
def get_my_courses(uid):
    user = User.query.get(int(uid))

    if not user:
        return jsonify({
            'success' : False,
            'error' : 'User not found'
        }), 404 # confused about it as user has logged in inside the react application so this would probably not come
    
    courses_data = [course.todict() for course in user.courses]

    if not courses_data:
        return jsonify({
            'success' : False,
            'error' : 'You have not enrolled in any courses'
        }), 404

    return jsonify({
        'success' : True,
        'courses': courses_data,
        'total': len(courses_data)
    }), 200