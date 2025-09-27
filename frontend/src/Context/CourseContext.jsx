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

const CoursesContext = createContext();

export const useCourseContext = () => {
    const context = useContext(CoursesContext);
    if (!context) throw new Error("useCourseContext must be used within CourseContextProvider");
    return context;
};

export const CourseContextProvider = ({ children }) => {
    const [courses, setCourses] = useState([])
    const [coursesCount, setCoursesCount] = useState(0)
    const { api } = useAuth()

    const fetchCourses = useCallback(async () => {
        try {
            const response = await api.get("/courses")
            if (response.data.success) {
                setCourses(response.data.courses);
                setCoursesCount(response.data.total)
            } else {
                console.error(response.data.error)
            }
        } catch (err) {
            console.error('Error fetching courses:', err);
        }
    }, [api])

    const value = {
        courses,
        coursesCount,
        fetchCourses,
    };

    return (
        <CoursesContext.Provider value={value}>{children}</CoursesContext.Provider>
    )

}
