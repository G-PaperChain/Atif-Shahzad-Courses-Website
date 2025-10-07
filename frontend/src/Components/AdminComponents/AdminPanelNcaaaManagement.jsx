import React, { useState, useEffect, useContext } from 'react'
import { useAuth } from '../AuthComponents/AuthContext'
import { useForm } from 'react-hook-form';
import AddACourse from './AdminForms/AddACourse';

const AdminPanelNcaaaManagement = () => {
    const [isAddaCourseOpen, SetisAddaCourseOpen] = useState(false)
    const { api } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm();

    // Add a Course <
    // Delete a course

    // Add CLOS for a particular course
    // get CLOS for a particular course
    // remove CLOS
    // update CLOS


    return (
        <div className='sm:ml-64 border-t-4 border-green-700'>
            <AddACourse />
        </div>
    )
}

export default AdminPanelNcaaaManagement