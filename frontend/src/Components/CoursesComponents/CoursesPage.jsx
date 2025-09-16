import React from 'react'
import { AuthProvider } from '../AuthComponents/AuthContext.jsx'
import CourseCard from './CourseCard.jsx'

const Courses = () => {

    const categories = ['Coding', 'AI', 'Finance']

    return (
        <>
            <AuthProvider>
                <div className='COURSES'>
                    <div className="category-container flex w-1/2 justify-center gap-1">
                        {
                            categories.map((cat) => {
                                return <div
                                    className="category bg-green-200 h-116 w-24 hover:w-96 transition-all duration-500 hover: hover:cursor-pointer flex items-center justify-center text-2xl text-green-800"
                                >
                                    {cat}
                                </div>
                            })
                        }
                    </div>
                </div>
            </AuthProvider>
        </>
    )
}

export default Courses