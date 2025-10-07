from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.NCAAA_Courses.NCAAA_Course import NCAAA_Course
from app.services.utils import admin_required

ncaaa_courses_bp = Blueprint('ncaa_courses', __name__)

@ncaaa_courses_bp.route('/ncaaa', methods=['GET'])
def get_courses():
    try:
        courses = NCAAA_Course.query.all()
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