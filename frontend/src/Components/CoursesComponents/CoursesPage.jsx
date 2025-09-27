import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthComponents/AuthContext'

const Courses = () => {
    const [courses, setCourses] = useState()
    const [error, setError] = useState()
    const [api, fetchCurrentUser, user] = useAuth()

    useEffect(() => {
        fetchUserCourses();
    }, []);

    const fetchUserCourses = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get(`/user/courses/${user.uid}`)

            if (response.data.success) {
                setCourses(response.data.courses);
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

    return (
        <>
            <div className='COURSES w-full flex flex-col gap-15.5 items-center'>
                <h1 className='text-green-700 text-5xl font-semibold mt-8.5'>
                    Your Courses
                </h1>
                <div className='flex gap-1'>
                    {courses.map((course) => (
                        <div className="card w-full h-full bg-green-200 flex flex-col p-3 cursor-pointer rounded-xl" key={courses.id}>
                            <h2 className="text-2xl text-green-700 font-medium">{course.name}</h2>
                            <h3 className="text-green-700 bg-green-300 w-max px-1.5 rounded-full mt-3">
                                {course.course_type || '🌀core'}
                            </h3>
                            <Link to={`/course/${course.course_code}`}><button className="text-md cursor-pointer text-white font-normal py-1 px-2 rounded-lg hover:bg-green-800 bg-green-700 transition-all duration-200 mt-3">
                                View performance
                            </button>
                            </Link>
                        </div>
                    ))
                    }
                </div>
            </div>
        </>
    )
}

export default Courses