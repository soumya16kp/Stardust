import React, { createContext, useContext, useState, useEffect } from 'react';
import { getEvents } from '../services/contentApi';

const EventsContext = createContext();

export const useEvents = () => {
    const context = useContext(EventsContext);
    if (!context) {
        throw new Error('useEvents must be used within an EventsProvider');
    }
    return context;
};

export const EventsProvider = ({ children }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastFetched, setLastFetched] = useState(0);

    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

    const fetchEvents = async (force = false) => {
        const now = Date.now();
        if (!force && events.length > 0 && (now - lastFetched < CACHE_DURATION)) {
            return; // Use cache
        }

        setLoading(true);
        try {
            const data = await getEvents();
            // Sort by date upcoming
            const sorted = data.sort((a, b) => new Date(a.date_time) - new Date(b.date_time));
            setEvents(sorted);
            setLastFetched(now);
            setError(null);
        } catch (err) {
            console.error("Failed to load events", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch on mount if empty
    useEffect(() => {
        fetchEvents();
    }, []);

    const value = {
        events,
        loading,
        error,
        refreshEvents: () => fetchEvents(true)
    };

    return (
        <EventsContext.Provider value={value}>
            {children}
        </EventsContext.Provider>
    );
};
