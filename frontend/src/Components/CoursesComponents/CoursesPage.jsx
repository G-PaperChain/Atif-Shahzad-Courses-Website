import React from 'react'
import { AuthProvider } from '../AuthComponents/AuthContext.jsx'
import Navbar from '../Navbar.jsx'
import CourseCard from './CourseCard.jsx'

const Courses = () => {
    return (
        <>
            <AuthProvider>
                <Navbar />
                <div className='COURSES text-6xl'>
                    <CourseCard CourseTitle="Hello" />
                </div>
            </AuthProvider>
        </>
    )
}

export default Courses