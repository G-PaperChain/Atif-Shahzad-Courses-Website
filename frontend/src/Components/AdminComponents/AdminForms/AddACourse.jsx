import React from 'react'
import { useNcaaCourseContext } from '../../../Context/NcaaCourseContext';
import { useContext, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

const AddACourse = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { addNcaaaCourse, ncaaaCoursesAddError } = useNcaaCourseContext()
    const [ message, setMessage ] = useState('')
    const [ error, setError ] = useState('')

    const onSubmit = async (ncaaaCourseData) => {
        try {
            const result = await addNcaaaCourse(ncaaaCourseData)
            if (result.data.success) {
                setMessage(result.data.message)
            } 
            else {
                setError(result.data.error)
            }
        } catch (error) {
            console.error("Error: ", error)
        }
    };

    return (
        <div>
            <form className='bg-green-200 px-6 py-6 border-1 border-black w-max' onSubmit={handleSubmit(onSubmit)}>
                <div className="card flex flex-col gap-2.5">
                    <h2 className='text-2xl text-center mb-5 font-bold'>Add a Course</h2>
                    <div className="w-max flex flex-col gap-1">
                        <label className='mr-3 text-md w-xs font-semibold'>Course Code</label>
                        <input
                            type="number"
                            className="px-4 py-2 bg-transparent rounded-lg focus:outline-2 outline-green-700 border-1 border-black"
                            placeholder='Enter your Course Code'
                            {...register('courseCode', { required: 'Code is required' })}
                            required />

                        {errors.courseCode && <span>{errors.courseCode.message}</span>}
                    </div>

                    <div className="w-max flex flex-col gap-1">
                        <label className='mr-3 text-md w-xs font-semibold'>Course Name</label>
                        <input
                            type="text"
                            className="px-4 py-2 bg-transparent rounded-lg focus:outline-2 outline-green-700 border-1 border-black"
                            placeholder='Enter your Course Name'
                            {...register('courseName', { required: 'Name is required' })}
                            required />
                        {errors.courseName && <span>{errors.courseName.message}</span>}
                    </div>

                    <div className="w-max flex flex-col gap-1">
                        <label className='mr-3 text-md w-xs font-semibold'>Course Description</label>
                        <input
                            type="text"
                            className="px-4 py-2 bg-transparent rounded-lg focus:outline-2 outline-green-700 border-1 border-black"
                            placeholder='Enter Course Description (optional) '
                            {...register('courseDescription', { required: 'Description is required' })}
                        />
                        {errors.courseDescription && <span>{errors.courseDescription.message}</span>}
                    </div>

                    {
                        message || error ? <div className={`${ message !== '' ? "bg-green-300 w-full rounded-lg h-12 text-gray-400 border-2 border-green-600" : "bg-red-300 w-full rounded-lg h-12 text-gray-400 border-2 border-red-600" }`}>
                            {message !== '' ? message : error}
                        </div>
                        : ''
                    }

                    <button type="submit" className='bg-green-700 text-white px-2 py-2 rounded-lg mt-2.5 cursor-pointer hover:bg-green-800 transition-colors duration-100'>Add a Course</button>

                </div>
            </form>
        </div>
    )
}

export default AddACourse