import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Rocket, Telescope, Users, Building2, Clock, PlayCircle, Plus } from 'lucide-react';
import Button from '../ui/Button';
import { getGoogleCalendarLink, downloadICS } from '../../utils/calendarUtils';
import './EventCard.css';

const EventCard = ({ event, onClick }) => {
    const startDate = new Date(event.date_time);

    // Formatters
    const dateStr = startDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    const timeStr = startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const fullDate = startDate.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' });

    const getIcon = () => {
        switch (event.category) {
            case 'astronomy': return <Telescope size={14} />;
            case 'launch': return <Rocket size={14} />;
            case 'industry': return <Building2 size={14} />;
            case 'community': return <Users size={14} />;
            default: return <Calendar size={14} />;
        }
    };

    const handleCalendarClick = (e) => {
        e.stopPropagation();
        const link = getGoogleCalendarLink(event);
        window.open(link, '_blank');
    };

    return (
        <div className="event-card-v2 group" onClick={onClick}>
            {/* Header Image */}
            <div className="event-header">
                <div className="event-overlay" />
                {event.image_url ? (
                    <img src={event.image_url} alt={event.title} className="event-image" />
                ) : (
                    <div className={`event-image placeholder-${event.category}`} style={{ background: '#1a1d24', width: '100%', height: '100%' }} />
                )}

                <div className="category-tag">
                    {getIcon()}
                    <span>{event.category}</span>
                </div>

                {event.is_live && (
                    <div className="live-badge">
                        <PlayCircle size={10} strokeWidth={3} />
                        <span>Live</span>
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="event-body">
                <div className="event-date-row">
                    <div className="date-box">
                        <Calendar size={14} />
                        <span>{dateStr} • {timeStr}</span>
                    </div>
                    {event.region && (
                        <div className="region-badge" title={event.region}>
                            {event.region}
                        </div>
                    )}
                </div>

                <h3 className="event-title">{event.title}</h3>
                <p className="event-desc">{event.short_description}</p>

                {/* Industrial Stats Grid */}
                <div className="event-stats-grid">
                    {event.category === 'launch' && event.rocket_name && (
                        <div className="stat-item">
                            <span className="stat-label">Vehicle</span>
                            <span className="stat-value">{event.rocket_name}</span>
                        </div>
                    )}
                    {event.category === 'launch' && event.agency && (
                        <div className="stat-item">
                            <span className="stat-label">Agency</span>
                            <span className="stat-value">{event.agency}</span>
                        </div>
                    )}
                    {event.category === 'astronomy' && event.equipment_needed && (
                        <div className="stat-item">
                            <span className="stat-label">Optics</span>
                            <span className="stat-value capitalize">{event.equipment_needed.replace('_', ' ')}</span>
                        </div>
                    )}
                    <div className="stat-item">
                        <span className="stat-label">Status</span>
                        <span className="stat-value text-green-400">Confirmed</span>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="event-footer">
                    <Link
                        to={`/events/${event.slug || event.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="action-btn btn-explore"
                        style={{ textDecoration: 'none' }}
                    >
                        Explore Mission
                    </Link>
                    <button
                        className="action-btn btn-calendar"
                        onClick={handleCalendarClick}
                        title="Add to Google Calendar"
                    >
                        <Plus size={18} />
                    </button>
                </div>

                {event.attendees_count > 0 && (
                    <div className="attendee-preview" style={{ marginTop: '12px' }}>
                        <Users size={12} className="mr-1" />
                        <span>{event.attendees_count} watching</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventCard;
