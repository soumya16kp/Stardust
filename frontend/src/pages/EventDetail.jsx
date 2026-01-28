import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEvent, attendEvent } from '../services/contentApi';
import { getGoogleCalendarLink } from '../utils/calendarUtils';
import Button from '../components/ui/Button';
import EventComments from '../components/events/EventComments';
import { Calendar, MapPin, Rocket, Telescope, Users, Building2, Clock, ExternalLink, ArrowLeft, PlayCircle } from 'lucide-react';
import './EventDetail.css';

const EventDetail = () => {
    const { slug } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [attending, setAttending] = useState(false);
    const [attendCount, setAttendCount] = useState(0);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const data = await getEvent(slug);
                setEvent(data);
                setAttending(data.is_attending);
                setAttendCount(data.attendees_count);
            } catch (error) {
                console.error("Failed to load event");
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [slug]);

    const handleAttend = async () => {
        try {
            const res = await attendEvent(slug);
            if (res.status === 'added') {
                setAttending(true);
                setAttendCount(prev => prev + 1);
            } else {
                setAttending(false);
                setAttendCount(prev => prev - 1);
            }
        } catch (error) {
            alert("Please login to track attendance.");
        }
    };

    if (loading) return <div className="text-center py-20">Loading Mission Data...</div>;
    if (!event) return <div className="text-center py-20">Event not found.</div>;

    const startDate = new Date(event.date_time);

    return (
        <div className="event-detail-page">
            {/* Hero Section */}
            <div className="event-hero">
                <div className="hero-overlay" />
                {event.image_url ? (
                    <img src={event.image_url} alt={event.title} className="hero-image" />
                ) : (
                    <div className={`hero-image placeholder-${event.category}`} style={{ background: '#0f1115' }} />
                )}

                <div className="container hero-content">
                    <Link to="/events" className="back-link">
                        <ArrowLeft size={16} /> Back to Events
                    </Link>

                    <div className="hero-badges">
                        <span className="hero-badge category capitalize">{event.category}</span>
                        {event.is_live && (
                            <span className="hero-badge live">
                                <PlayCircle size={14} className="mr-1" /> Live
                            </span>
                        )}
                    </div>

                    <h1 className="hero-title">{event.title}</h1>

                    <div className="hero-meta">
                        <div className="meta-block">
                            <Calendar size={20} className="text-blue-400" />
                            <div>
                                <div className="meta-label">Date</div>
                                <div className="meta-value">{startDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
                            </div>
                        </div>
                        <div className="meta-block">
                            <Clock size={20} className="text-blue-400" />
                            <div>
                                <div className="meta-label">Time</div>
                                <div className="meta-value">{startDate.toLocaleTimeString('en-US', { timeZone: event.timezone })} ({event.timezone})</div>
                            </div>
                        </div>
                        <div className="meta-block">
                            <MapPin size={20} className="text-blue-400" />
                            <div>
                                <div className="meta-label">Visibility</div>
                                <div className="meta-value">{event.region}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container event-content-layout">
                <div className="main-col">
                    <section className="detail-section">
                        <h2>Overview</h2>
                        <p className="text-lg text-gray-300 leading-relaxed">
                            {event.full_description || event.short_description}
                        </p>
                    </section>

                    {event.scientific_explanation && (
                        <section className="detail-section science-box">
                            <h2><Telescope className="section-icon science" /> Scientific Context</h2>
                            <p>{event.scientific_explanation}</p>
                        </section>
                    )}

                    {event.rocket_name && (
                        <section className="detail-section launch-box">
                            <h2><Rocket className="section-icon launch" /> Mission Profile</h2>
                            <div className="mission-grid">
                                <div className="stat-card">
                                    <span>Rocket</span>
                                    <strong>{event.rocket_name}</strong>
                                </div>
                                <div className="stat-card">
                                    <span>Mission</span>
                                    <strong>{event.mission_name}</strong>
                                </div>
                                <div className="stat-card">
                                    <span>Agency</span>
                                    <strong>{event.agency}</strong>
                                </div>
                            </div>
                            {event.launch_details && <p className="mission-details-text">{event.launch_details}</p>}
                        </section>
                    )}

                    {event.viewing_guide && (
                        <section className="detail-section viewing-box">
                            <h2><Users className="section-icon viewing" /> Viewing Guide</h2>
                            <p>{event.viewing_guide}</p>
                            {event.equipment_needed && (
                                <div className="optics-container">
                                    <span className="optics-label">Recommended Optics:</span>
                                    <div className="optics-value">{event.equipment_needed.replace('_', ' ')}</div>
                                </div>
                            )}
                        </section>
                    )}

                    {/* Community Discussion */}
                    <div className="mt-12">
                        <EventComments slug={slug} />
                    </div>
                </div>

                <div className="sidebar-col">
                    <div className="action-card">
                        <div className="attendance-status">
                            <div className="attend-count">{attendCount}</div>
                            <div className="attend-label">Watching</div>
                        </div>

                        <Button
                            variant={attending ? "secondary" : "primary"}
                            className="sidebar-btn"
                            onClick={handleAttend}
                        >
                            {attending ? "Tracking" : "I'm Watching"}
                        </Button>

                        <Button
                            variant="secondary"
                            className="sidebar-btn last"
                            onClick={() => window.open(getGoogleCalendarLink(event), '_blank')}
                        >
                            <Calendar size={18} className="mr-2" /> Add to Calendar
                        </Button>

                        {event.external_link && (
                            <div className="official-link-box">
                                <a href={event.external_link} target="_blank" rel="noopener noreferrer" className="official-link">
                                    Official Live Stream <ExternalLink size={14} className="ml-2" />
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;
