from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.NCAAA_Courses.NCAAA_Course import NCAAA_Course
from app.services.utils import admin_required

admin_ncaaa_bp = Blueprint('admin_ncaaa', __name__)

@admin_ncaaa_bp.route('/admin/ncaaa/get-courses', methods=['GET'])
@admin_required
def get_nccaa_courses():
    try:
        nccaa_courses = NCAAA_Course.query.all()
        ncaaa_courses_data = [course.to_dict() for course in nccaa_courses]
        return jsonify({
            'success': True,
            'courses': ncaaa_courses_data,
            'total': len(ncaaa_courses_data)
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@admin_ncaaa_bp.route('/admin/ncaaa/add-course', methods=['POST'])
@admin_required 
def add_ncaaa_course():
    try:
        data = request.get_json()
        required_fields = ['ncaaa_course_name', 'ncaaa_course_description', 'ncaaa_course_code']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    'success': False,
                    'error': f'{field} is required'
                    }), 400

        if NCAAA_Course.query.filter_by(course_code=data['ncaaa_course_code']).first():
            return jsonify({
                'success': False,
                'error': 'Course already registered'
                }), 409

        course = NCAAA_Course(
            course_code=data['ncaaa_course_code'],
            course_name=data['ncaaa_course_name'],
            course_description=data['ncaaa_course_description']
        )

        db.session.add(course)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Course added successfully',
            'course': course.to_dict()
              }), 201
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
             }), 500

@admin_ncaaa_bp.route('/admin/ncaaa/delete-course/<int:ncaaa_course_code>')
def delete_ncaaa_course(ncaaa_course_code):
    ncaaa_course = NCAAA_Course.query.get(ncaaa_course_code)
    if ncaaa_course is None:
        return jsonify({'error': 'NCAAA_course not found'}), 404
    try:
        db.session.delete(ncaaa_course)
        db.session.commit()
        return jsonify({
            'success': True,
            'message': 'NCAAA_course deleted successfully'
            })
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e),
            }), 500
