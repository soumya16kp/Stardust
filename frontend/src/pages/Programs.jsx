import React from 'react';
import { Link } from 'react-router-dom';
import { usePrograms } from '../context/ProgramsContext';
import ProgramCard from '../components/programs/ProgramCard';
import { Rocket, Radio, Trophy, Users, Calendar } from 'lucide-react';
import Button from '../components/ui/Button';
import './Programs.css';

const Programs = () => {
    const { programs, loading } = usePrograms();

    // Split data by type
    const missions = programs.filter(p => p.program_type === 'mission');
    const webinars = programs.filter(p => p.program_type === 'webinar');
    const hackathons = programs.filter(p => p.program_type === 'hackathon');

    if (loading) return <div className="text-center py-20 text-white">Initializing Launch Systems...</div>;

    return (
        <div className="programs-page">
            <div className="container">
                {/* Hero */}
                <div className="programs-hero">
                    <h1 className="hero-title">
                        Space Career <span className="gradient-text">Launchpad</span>
                    </h1>
                    <p className="hero-subtitle">
                        Join missions, compete in hackathons, and attend live briefings to earn your astronaut wings.
                    </p>
                </div>

                {/* 1. ACADEMY SECTOR (Missions) */}
                <section className="academy-section">
                    <div className="section-header">
                        <h2 className="section-title"><Rocket size={32} className="icon-blue" /> Starfleet Academy</h2>
                        <div className="section-subtitle">Structured Learning Paths</div>
                    </div>

                    {missions.length > 0 ? (
                        <div className="programs-grid">
                            {missions.map(p => <ProgramCard key={p.id} program={p} />)}
                        </div>
                    ) : (
                        <div className="empty-state">No active missions. Check back soon.</div>
                    )}
                </section>
            </div>

            {/* 2. HACKATHON ARENA */}
            <section className="hackathon-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title"><Trophy size={32} className="icon-purple" /> Hackathon Arena</h2>
                        <div className="section-subtitle">Solve Real Problems</div>
                    </div>

                    {hackathons.length > 0 ? (
                        <div className="hackathon-grid">
                            {hackathons.map(h => (
                                <Link to={`/programs/${h.slug}`} key={h.id} className="hackathon-link">
                                    <div className="hackathon-banner">
                                        <div className="hackathon-content">
                                            <div className="hackathon-prize">XP Reward: {h.xp_reward}</div>
                                            <h3 className="hackathon-title">{h.title}</h3>
                                            <p className="hackathon-desc">{h.description}</p>
                                            <div className="hackathon-actions">
                                                <Button variant="primary">Join Team</Button>
                                                <Button variant="secondary">View Leaderboard</Button>
                                            </div>
                                        </div>
                                        <div className="hackathon-visual">
                                            <Trophy size={180} />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">No active hackathons. Pre-registration open soon.</div>
                    )}
                </div>
            </section>

            {/* 3. LIVE OPS (Webinars) */}
            <section className="live-ops-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title"><Radio size={32} className="icon-green" /> Mission Control Live</h2>
                        <div className="section-subtitle">Upcoming Briefings</div>
                    </div>

                    <div className="webinar-list">
                        {webinars.length > 0 ? (
                            webinars.map(w => (
                                <Link to={`/programs/${w.slug}`} key={w.id} className="webinar-row-link">
                                    <div className="webinar-row">
                                        <div className="webinar-time">
                                            <span className="webinar-date">{new Date(w.start_date).toLocaleDateString()}</span>
                                            <span className="webinar-hour">{new Date(w.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div className="webinar-info flex-1">
                                            <div className="webinar-badge-row">
                                                {w.is_live && <span className="badge live-badge text-xs">● LIVE NOW</span>}
                                                <span className="webinar-type">Briefing</span>
                                            </div>
                                            <h3>{w.title}</h3>
                                            <p className="webinar-speakers">Speaker: {w.instructor}</p>
                                        </div>
                                        <div className="webinar-action">
                                            <Button size="sm" variant={w.is_live ? "primary" : "secondary"}>
                                                {w.is_live ? "Join Stream" : "Set Reminder"}
                                            </Button>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="empty-state">No upcoming transmissions.</div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Programs;
