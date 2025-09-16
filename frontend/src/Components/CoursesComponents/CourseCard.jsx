import React from 'react'

const CourseCard = (props) => {
  
  return (
    <div className='bg-green-200'>
      <h2>{props.CourseTitle || 'hehe'}</h2>
    </div>
  )
}

export default CourseCard