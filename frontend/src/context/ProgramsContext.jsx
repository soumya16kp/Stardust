import React, { createContext, useContext, useState, useEffect } from 'react';
import { getPrograms } from '../services/programsApi';

const ProgramsContext = createContext();

export const usePrograms = () => useContext(ProgramsContext);

export const ProgramsProvider = ({ children }) => {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastFetched, setLastFetched] = useState(0);

    const fetchPrograms = async (force = false) => {
        // Cache for 5 minutes
        if (!force && programs.length > 0 && Date.now() - lastFetched < 300000) {
            return;
        }

        setLoading(true);
        try {
            const data = await getPrograms();
            setPrograms(data);
            setLastFetched(Date.now());
            setError(null);
        } catch (err) {
            console.error("Error fetching programs:", err);
            setError("Failed to initialize mission data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrograms();
    }, []);

    const getProgramBySlug = (slug) => {
        return programs.find(p => p.slug === slug);
    };

    const updateProgramEnrollment = (programId) => {
        setPrograms(prev => prev.map(p =>
            p.id === parseInt(programId) ? { ...p, is_enrolled: true } : p
        ));
    };

    return (
        <ProgramsContext.Provider value={{
            programs,
            loading,
            error,
            fetchPrograms,
            getProgramBySlug,
            updateProgramEnrollment
        }}>
            {children}
        </ProgramsContext.Provider>
    );
};
