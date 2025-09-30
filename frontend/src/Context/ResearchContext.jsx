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

const ResearchContext = createContext();

export const useResearchContext = () => {
    const context = useContext(ResearchContext);
    if (!context) throw new Error("useResearchContext must be used within ResearchContextProvider");
    return context;
};

export const ResearchContextProvider = ({ children }) => {
    const [researches, setResearches] = useState([])
    const { api } = useAuth()

    const fetchResearches = useCallback(async () => {
        try {
            const response = await api.get("/orcid/researches")
            if (response.data.success) {
                setResearches(response.data.researches);
            } else {
                console.error(response.data.error)
            }
        } catch (err) {
            console.error('Error fetching courses:', err);
        }
    }, [api])

    const value = {
        researches,
        fetchResearches,
    };

    return (
        <ResearchContext.Provider value={value}>{children}</ResearchContext.Provider>
    )

}