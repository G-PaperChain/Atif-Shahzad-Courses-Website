import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';

const NCAAA_CourseList = () => {
    const [ncaaa_courses, setNcaaa_courses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchNcaaCourses();
    }, []);

    const fetchNcaaCourses = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await axios.get('https://api.dratifshahzad.com/api/ncaaa');
            
            if (response.data.success) {
                setNcaaa_courses(response.data.courses);
            } else {
                setError(response.data.error || 'Failed to fetch courses');
            }

        } catch (err) {
            console.error('Error fetching courses:', err);
            setError(err.response?.data?.error || err.message || 'Failed to fetch courses');
        } finally {
            setLoading(false);
        }
    }

    if (loading) return (
        <div className="flex items-center justify-center gap-2">
            <CircularProgress size={20} />
            <span>Loading courses...</span>
        </div>
    );
    
    if (error) return (
        <div className="text-red-600 text-center">
            Error: Failed to fetch courses
            <button 
                onClick={fetchNcaaCourses}
                className="ml-2 px-3 py-1 bg-red-100 hover:bg-red-200 rounded text-sm"
            >
                Retry
            </button>
        </div>
    );

    if (ncaaa_courses.length === 0) return (
        <div className="text-gray-600 text-center">No courses found</div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
            {
                ncaaa_courses.map((course) => (
                    <div className="card w-96 min-h-max overflow-hidden bg-green-200 flex flex-col p-4 cursor-pointer transition-all duration-200 hover:bg-green-300 rounded-xl" key={course.course_id}>
                        <h1 className="text-xl text-green-800 font-black">{course.course_code}</h1>
                        <h2 className="text-2xl text-green-700 font-medium">{course.course_name}</h2>
                        <h3 className="text-green-700 bg-green-300 w-max px-1.5 rounded-full mt-2.5">
                            {course.course_type || '🌀core'}
                        </h3>
                        <button className="text-lg cursor-pointer text-white font-normal w-1/2 py-1 px-2 rounded-lg hover:bg-green-800 bg-green-700 transition-all duration-200 mt-5">
                            Add Course Data
                        </button>
                    </div>
                ))
            }
        </div>
    )
}

export default NCAAA_CourseList