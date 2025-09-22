import React from 'react'
import { Link } from 'react-router-dom';

const Courses = () => {

    const courses = [
        {
            id: 1,
            name: 'Computer Application'
        },
        {
            id: 2,
            name: 'Simulation'
        },
        {
            id: 3,
            name: 'Product Management'
        },
    ]

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
                            <Link to='/course'><button className="text-md cursor-pointer text-white font-normal py-1 px-2 rounded-lg hover:bg-green-800 bg-green-700 transition-all duration-200 mt-3">
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