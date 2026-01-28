import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEvents } from '../services/contentApi';
import EventCard from '../components/events/EventCard';
import EventFilters from '../components/events/EventFilters';
import AstronomyEventsCarousel from '../components/events/AstronomyEventsCarousel';
import { Clock, Telescope } from 'lucide-react';
import './Events.css';

const Events = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [astronomyEvents, setAstronomyEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        category: 'all',
        time: 'upcoming',
        region: ''
    });

    // Initial Fetch for Astronomy Carousel
    useEffect(() => {
        const fetchAstronomy = async () => {
            try {
                const astroData = await getEvents({ category: 'astronomy', time: 'upcoming' });
                setAstronomyEvents(astroData);
            } catch (error) {
                console.error("Failed to fetch astronomy events", error);
            }
        };
        fetchAstronomy();
    }, []);

    // Debounce search & Main Fetch
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchEvents();
        }, 500);
        return () => clearTimeout(timer);
    }, [filters]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const params = { ...filters };
            if (params.category === 'all') delete params.category;
            if (!params.region) delete params.region;
            if (!params.search) delete params.search;

            const data = await getEvents(params);

            // Filter out astronomy events from the main list so they don't duplicate
            const filteredData = data.filter(e => e.category !== 'astronomy');

            setEvents(filteredData);
        } catch (error) {
            console.error("Failed to fetch events", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handleEventClick = (event) => {
        navigate(`/events/${event.slug || event.id}`);
    };

    return (
        <div className="events-page section-padding">
            {/* Base Header / Status Bar */}
            <div className="events-status-bar">
                <div className="status-item">
                    <span className="status-dot green"></span>
                    <span>SYSTEM ONLINE</span>
                </div>
                <div className="status-item">
                    <Clock size={14} className="mr-2" />
                    <span>GALACTIC TIME: {new Date().toLocaleTimeString()}</span>
                </div>
                <div className="status-item highlight">
                    <Telescope size={14} className="mr-2" />
                    <span>DEEP SPACE NETWORK: ACTIVE</span>
                </div>
            </div>

            <div className="container relative z-10">
                <header className="events-header text-center mb-12">
                    <h1 className="page-title mb-4">Galactic <span className="text-gradient">Events</span></h1>
                    <p className="text-secondary max-w-2xl mx-auto">
                        Global launches, astronomical phenomena, and industry summits.
                    </p>
                </header>

                <AstronomyEventsCarousel events={astronomyEvents} onEventClick={handleEventClick} />

                {/* Sub-Header / Divider */}
                <div className="mission-control-header">
                    <div>
                        <h2 className="control-grid-title">Mission Control Grid</h2>
                        <p className="control-grid-subtitle">Real-time scheduling for launches and conferences</p>
                    </div>
                    <div className="control-grid-status">
                        <div className="status-line primary">LIVE FEED ACQUISITION</div>
                        <div className="status-line secondary">SYNCING...</div>
                    </div>
                </div>

                <EventFilters filters={filters} onFilterChange={handleFilterChange} />

                {loading ? (
                    <div className="text-center py-20">
                        <div className="loading-pulse">Scanning Deep Space Network...</div>
                    </div>
                ) : (
                    <>
                        <div className="events-grid">
                            {events.map(e => (
                                <EventCard key={e.id} event={e} onClick={() => handleEventClick(e)} />
                            ))}
                        </div>
                        {events.length === 0 && (
                            <div className="text-center py-20 text-gray-400">
                                <Telescope size={48} className="mx-auto mb-4 opacity-50" />
                                <p>No events found in this sector. Try adjusting your sensors.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Events;
