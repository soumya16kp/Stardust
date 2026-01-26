import React, { useEffect, useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import './Events.css';
import { getEvents } from '../services/contentApi';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await getEvents();
                setEvents(data);
            } catch (error) {
                console.error("Failed to load events");
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    if (loading) return <div className="text-center section-padding">Loading events...</div>;

    return (
        <div className="events-page section-padding">
            <div className="container">
                <h1 className="page-title text-center">Upcoming <span className="text-gradient">Missions</span></h1>
                <div className="events-list">
                    {events.map(e => (
                        <Card key={e.id} className="mb-4">
                            <div className="card-content event-card-content">
                                <div className="event-date"><span className="event-day">{new Date(e.date).getDate()}</span><span className="event-month">{new Date(e.date).toLocaleString('default', { month: 'short' }).toUpperCase()}</span></div>
                                <div className="event-info"><h3>{e.title}</h3><p className="event-loc">{e.location}</p><Button variant="secondary">RSVP</Button></div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default Events;
