import React from 'react'


// has problems will fix in future

const AdminDashboard = () => {
    const { courses, courseCount, fetchCourses } = useCourseContext()
    const { api } = useAuth()
    const [file, setFile] = useState(null);
    const [quizzes, setQuizzes] = useState([]);
    const [error, setError] = useState([])
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [visible, setVisible] = useState(false);
    const [courseFormData, setCourseFormData] = useState({
        course_code: '',
        course_name: '',
        course_description: ''
    });

    useEffect(() => {
        fetchCourses()
    }, []);

    const handleAddCourseSubmit = async (e) => {
        e.preventDefault()
        try {
            await api.post("/admin/add-course", courseFormData)
            await fetchCourses()
            setVisible(false)
        } catch (e) {
            console.error("Error: " + e)
            setError("Failed to add course: " + (e.response?.data?.error || e.message))
        }
    }

    const handleCourseInputChange = (e) => {
        setCourseFormData({ ...courseFormData, [e.target.name]: e.target.value });
    }

    const handleChange = (e) => {
        setSelectedCourseId(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedCourseId) {
            setError("Please select a course first.")
            return;
        }

        try {
            const formData = new FormData();
            formData.append("file", file);

            await axios.post(`/admin/${selectedCourseId}/upload_csv`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setError("");
        } catch (e) {
            setError("Upload Failed")
            console.error(e);
        };
    };
  return (


    <>
            <div className="p-4 sm:ml-64 border-t-4 border-green-700">

                <div className="">

                    {/* TOP 3 BOXES */}
                    <div className="grid grid-cols-3 gap-4 mb-4">

                        <div className="flex items-center justify-center h-24 rounded-sm dark:bg-green-200">
                            <select
                                name="courses"
                                id="course_select"
                                value={selectedCourseId || ''}
                                onChange={handleChange}
                                className='px-2 py-1 bg-green-700 hover:bg-green-800 cursor-pointer rounded-md text-white'>
                                <option value="">-- Select Course --</option>
                                {courses.map((course) => (
                                    <option key={course.course_id} value={course.course_id}>
                                        {course.course_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center justify-center h-24 rounded-sm  dark:bg-green-200">

                            <form onSubmit={handleSubmit} className="flex gap-2 flex-col">
                                <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} className='bg-green-300 flex justify-center items-center' />
                                <button type="submit" className='px-3 py-2 bg-green-700 hover:bg-green-800 cursor-pointer rounded-md text-white w-max'>Upload</button>
                            </form>

                        </div>

                        <div className="flex items-center justify-center h-24 rounded-sm dark:bg-green-200">
                            <div className={error ? `text-red-500` : `text-green-500`}>
                                {error ? error : 'Ready'}
                            </div>
                        </div>

                    </div>

                    {/* MID BIG DIV BOX */}
                    <div className="courses-form flex items-center justify-center h-48 mb-4 rounded-sm dark:bg-green-200 ">

                    </div>

                    {/* SMALL 4 BOTTOM DIV BOXES */}
                    <div className="grid grid-cols-2 gap-4 mb-4">

                        <div className="flex items-center justify-center rounded-sm h-28 dark:bg-green-200">
                            <Button label="Add a Course" icon="pi pi-external-link" onClick={() => setVisible(true)} className='px-3 py-2 bg-green-700 hover:bg-green-800 cursor-pointer rounded-md text-white' />
                            <Dialog visible={visible} onHide={() => { if (!visible) return; setVisible(false); }}
                                style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                                <form onSubmit={handleAddCourseSubmit} className='bg-blue-300 px-4 py-3 flex flex-col gap-2.5'>

                                    <h1 className='self-center text-2xl mb-1.5'>Add a Course</h1>

                                    <div className='flex gap-2 items-center'>
                                        <label>Course Code</label>
                                        <input className='bg-white px-1 py-2' name="course_code" type="text" onChange={handleCourseInputChange} value={courseFormData.course_code} required />
                                    </div>

                                    <div className='flex gap-2 items-center '>
                                        <label>Course Name</label>
                                        <input className='bg-white px-1 py-2' name="course_name" type="text" onChange={handleCourseInputChange} value={courseFormData.course_name} required />
                                    </div>

                                    <div className='flex gap-2 items-center '>
                                        <label>Course Description <span className='text-gray-400'>(optional)</span></label>
                                        <input className='bg-white px-1 py-2' name="course_description" type="text" onChange={handleCourseInputChange} value={courseFormData.course_description} />
                                    </div>

                                    <button type='submit' className='px-3 py-2 bg-green-600 hover:bg-green-700 cursor-pointer w-max text-white'>Add Course</button>
                                </form>
                            </Dialog>
                        </div>

                        <div className="flex items-center justify-center rounded-sm h-28 dark:bg-green-200">
                            <p className="text-2xl text-gray-400 dark:text-gray-500">
                                <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16" />
                                </svg>
                            </p>
                        </div>

                        <div className="flex items-center justify-center rounded-sm h-28 dark:bg-green-200">
                            <p className="text-2xl text-gray-400 dark:text-gray-500">
                                <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16" />
                                </svg>
                            </p>
                        </div>
                        <div className="flex items-center justify-center rounded-sm h-28 dark:bg-green-200">
                            <p className="text-2xl text-gray-400 dark:text-gray-500">
                                <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16" />
                                </svg>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
    </>
  )
}

export default AdminDashboard