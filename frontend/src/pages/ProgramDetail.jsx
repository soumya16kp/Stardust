import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePrograms } from '../context/ProgramsContext';
import { getProgramDetail, enrollProgram } from '../services/programsApi';
import Button from '../components/ui/Button';
import { ArrowLeft, Clock, Users, Shield, CheckCircle, PlayCircle, Lock } from 'lucide-react';
import './Programs.css';

const ProgramDetail = () => {
    const { slug } = useParams();
    const { getProgramBySlug } = usePrograms();
    const [program, setProgram] = useState(getProgramBySlug(slug));
    const [loading, setLoading] = useState(!program);
    const [enrolling, setEnrolling] = useState(false);

    useEffect(() => {
        // If not in context (direct link) or to refresh:
        fetchProgram();
    }, [slug]);

    const fetchProgram = async () => {
        try {
            const data = await getProgramDetail(slug);
            setProgram(data);
        } catch (error) {
            console.error("Failed to load program", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async () => {
        setEnrolling(true);
        try {
            const res = await enrollProgram(program.id);
            setProgram({ ...program, is_enrolled: true });
            alert("Welcome to the mission, Cadet!"); // Replace with toast later
        } catch (error) {
            alert("Enrollment failed. Please login.");
        } finally {
            setEnrolling(false);
        }
    };

    if (loading) return <div className="text-center py-20 text-white">decrypting mission files...</div>;
    if (!program) return <div className="text-center py-20 text-white">Mission not found.</div>;

    const isHackathon = program.program_type === 'hackathon';

    return (
        <div className="program-detail-page">
            <div className="container">
                <Link to="/programs" className="back-link">
                    <ArrowLeft size={20} /> Abort Mission (Return)
                </Link>

                {/* Hero Card */}
                <div className="detail-hero">
                    <div className="detail-hero-content">
                        <div className="detail-badges">
                            <span className={`badge type-badge ${program.program_type}`}>
                                {program.program_type}
                            </span>
                            <span className={`badge difficulty ${program.difficulty}`}>
                                {program.difficulty}
                            </span>
                        </div>

                        <h1 className="detail-title">
                            {program.title}
                        </h1>

                        <p className="detail-desc">
                            {program.description}
                        </p>

                        <div className="detail-stats">
                            <div className="stat-item">
                                <Users size={20} className="icon-blue" />
                                <span>Commander: {program.instructor}</span>
                            </div>
                            <div className="stat-item">
                                <Clock size={20} className="icon-blue" />
                                <span>Duration: {program.duration}</span>
                            </div>
                            <div className="stat-item">
                                <Shield size={20} className="icon-purple" />
                                <span>XP Reward: {program.xp_reward}</span>
                            </div>
                        </div>

                        <div className="action-area">
                            {program.is_enrolled ? (
                                <Button variant="secondary" className="btn-active">
                                    <CheckCircle size={20} /> Mission Active
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleEnroll}
                                    disabled={enrolling}
                                    className="btn-enroll"
                                >
                                    {enrolling ? 'Processing...' : isHackathon ? 'Register Team' : 'Enroll Now'}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Layout */}
                <div className="detail-grid">
                    {/* Main Content (Modules) */}
                    <div className="main-col">
                        {program.modules && program.modules.length > 0 ? (
                            <div className="modules-list">
                                <h3 className="modules-title">Mission Syllabi</h3>
                                {program.modules.map((mod, idx) => (
                                    <div key={mod.id} className="module-card">
                                        <div className="module-header">
                                            <h4 className="module-title">
                                                <span className="phase-text">Phase {idx + 1}:</span>
                                                {mod.title}
                                            </h4>
                                            <span className="module-count">{mod.sessions.length} Segments</span>
                                        </div>
                                        <div className="sessions-list">
                                            {mod.sessions.map(ssn => (
                                                <div key={ssn.id} className="session-row">
                                                    {ssn.session_type === 'video' ? <PlayCircle size={18} className="icon-blue" /> : <Lock size={18} className="icon-slate" />}
                                                    <span className="session-title">{ssn.title}</span>
                                                    <span className="session-duration">{ssn.duration}m</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="locked-state">
                                <div className="mb-4">🔒 Restricted Access</div>
                                Encrypted mission data. Enroll to decrypt syllables.
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="sidebar-col">
                        <div className="mission-intel-card">
                            <h4 className="intel-title">Mission Intel</h4>
                            <ul className="intel-list">
                                <li className="intel-item">
                                    <span>Type</span>
                                    <span className="intel-value">{program.program_type}</span>
                                </li>
                                <li className="intel-item">
                                    <span>Level</span>
                                    <span className="intel-value">{program.difficulty}</span>
                                </li>
                                <li className="intel-item">
                                    <span>Prerequisites</span>
                                    <span className="intel-value">None</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgramDetail;
