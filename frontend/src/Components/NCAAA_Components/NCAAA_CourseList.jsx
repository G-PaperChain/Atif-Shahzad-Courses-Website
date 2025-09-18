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
            const response = await axios.get('https://api.dratifshahzad.com/api/ncaaa')
                .catch(error => {
                    console.error('Error fetching data:', error);
                });

            if (!response.ok) {
                throw new Error('Failed to fetch courses');
            }

            const data = await response.json();

            if (data.success) {
                setNcaaa_courses(data.courses);
            } else {
                setError(data.error);
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <div className="loading"><CircularProgress />Loading courses...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div>
            {
                courses.map((course) => (
                    <div className="card w-96 min-h-max overflow-hidden bg-green-200 flex flex-col p-4 cursor-pointer transition-all duration-200 hover:bg-green- rounded-xl" key={course.course_id}>
                        <h1 className="text-xl text-green-800 font-black">{course.course_code}</h1>
                        <h2 className="text-3xl text-green-700 font-medium">{course.course_name}</h2>
                        <h3 className="text-green-700 bg-green-300 w-max px-1.5 rounded-full mt-2.5">{course.course_type || '🌀core'}</h3>
                        <button className="text-lg cursor-pointer text-white font-normal w-1/2 py-1 px-2 rounded-lg hover:bg-green-800 bg-green-700 transition-all duration-200 mt-5">Add Course Data</button>
                    </div>
                ))
            }
        </div>
    )
}

export default NCAAA_CourseList
