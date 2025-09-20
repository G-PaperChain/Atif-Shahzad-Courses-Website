import React from 'react'
import NCAAA_CourseList from './NCAAA_CourseList'

const NCAAA_Page = () => {
    return (
        <div className='w-full flex flex-col items-center gap-14'>
            <h1 className='text-4xl text-green-700 mt-8 font-bold'>NCAAA</h1>
            <NCAAA_CourseList />
        </div>
    )
}

export default NCAAA_Page