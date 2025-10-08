import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useMemo,
    useCallback,
} from "react";
import axios from "axios";
import { useAuth } from "../Components/AuthComponents/AuthContext";

const NcaaaCoursesContext = createContext();

export const useNcaaCourseContext = () => {
    const context = useContext(NcaaaCoursesContext);
    if (!context) throw new Error("useNcaaCourseContext must be used within NcaaaCoursesContextProvider");
    return context;
};

export const NcaaaCoursesContextProvider = ({ children }) => {
    const [ncaaaCourses, setNcaaaCourses] = useState([]);
    const [ncaaaCoursesCount, setNcaaaCoursesCount] = useState(0);
    const [ncaaaCoursesFetchError, setNcaaaCoursesFetchError] = useState('');
    const [ncaaaCoursesAddError, setNcaaaCoursesAddError] = useState('');
    const { api } = useAuth();

    const fetchNcaaaCourses = useCallback(async () => {
        try {
            const response = await api.get("/admin/ncaaa/get-courses")
            if (response.data.success) {
                setNcaaaCourses(response.data.courses);
                setNcaaaCoursesCount(response.data.total)
            } else {
                setNcaaaCoursesFetchError(response.data.error)
                console.error(response.data.error)
            }
        } catch (err) {
            setNcaaaCoursesFetchError('Error fetching courses:', err)
            console.error('Error fetching courses:', err);
        }
    }, [api])

    const addNcaaaCourse = async (ncaaaCourse) => {
        try {
            const response = await api.post("/admin/ncaaa/add-course", {
                ncaaa_course_code: ncaaaCourse.courseCode,
                ncaaa_course_name: ncaaaCourse.courseName,
                ncaaa_course_description: ncaaaCourse.courseDescription
            })
            
            if (response.data.success) {
                fetchNcaaaCourses()
            } else {
                setNcaaaCoursesAddError(response.data.error)
                console.error(response.data.error)
            }
        } catch (err) {
            setNcaaaCoursesAddError('Error fetching courses:', err)
            console.error('Error fetching courses:', err);
        }
    };

    const value = {
        ncaaaCourses,
        ncaaaCoursesCount,
        ncaaaCoursesAddError,
        ncaaaCoursesFetchError,
        fetchNcaaaCourses,
        addNcaaaCourse,
    };

    return (
        <NcaaaCoursesContext.Provider value={value}>{children}</NcaaaCoursesContext.Provider>
    )

}
