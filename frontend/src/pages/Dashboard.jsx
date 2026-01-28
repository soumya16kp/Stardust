import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import EditProfileModal from '../components/social/EditProfileModal';
import { Edit2 } from 'lucide-react';
import { loadUser } from '../store/authSlice';
import './Dashboard.css';

const myPrograms = [{ title: 'Rocket Science 101', progress: 75 }, { title: 'Mars Survival', progress: 30 }];

const Dashboard = () => {
    const { user } = useSelector(state => state.auth);
    const [showEditModal, setShowEditModal] = useState(false);
    const dispatch = useDispatch();

    const handleProfileUpdate = () => {
        dispatch(loadUser());
    };

    return (
        <div className="dashboard-page section-padding">
            <div className="container">
                <h1 className="mb-4">Welcome, <span className="text-gradient">Commander {user?.username}</span></h1>

                <div className="dashboard-grid">
                    {/* Profile Section */}
                    <div className="dashboard-profile-section">
                        <div className="d-profile-card">
                            <div className="d-profile-header">
                                <div className="d-avatar-container">
                                    {user?.profile?.avatar ? (
                                        <img src={user.profile.avatar} alt={user.username} />
                                    ) : (
                                        <div className="d-avatar-fallback">
                                            {user?.username?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div className="d-profile-info">
                                    <h2>{user?.username}</h2>
                                    <span className="d-profile-role">{user?.role || 'Cadet'}</span>
                                    <div className="d-profile-actions">
                                        <button className="d-action-btn edit" onClick={() => setShowEditModal(true)}>
                                            <Edit2 size={14} className="mr-1" /> Edit Profile
                                        </button>
                                        <Link to={`/profile/${user?.username}`} className="d-view-profile-link">
                                            View Identity Log &rarr;
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="d-profile-stats">
                                <div className="d-stat">
                                    <span className="d-stat-val">{user?.profile?.posts_count || 0}</span>
                                    <span className="d-stat-label">Transmissions</span>
                                </div>
                                <div className="d-stat">
                                    <span className="d-stat-val">Rank 4</span>
                                    <span className="d-stat-label">Clearance</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-main-content">
                        <div className="dashboard-stats">
                            <div className="stat-box"><div className="stat-num">2</div><div>Active Missions</div></div>
                            <div className="stat-box"><div className="stat-num">87%</div><div>Sync Rate</div></div>
                        </div>
                        <section className="progress-section">
                            <h3>Mission Status</h3>
                            <div className="programs-grid">
                                {myPrograms.map((p, i) => (
                                    <Card key={i}><div className="card-content"><h3>{p.title}</h3><div className="progress-bar"><div className="progress-fill" style={{ width: `${p.progress}%` }}></div></div></div></Card>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>

                {showEditModal && (
                    <EditProfileModal
                        user={user}
                        onClose={() => setShowEditModal(false)}
                        onUpdate={handleProfileUpdate}
                    />
                )}
            </div>
        </div>
    );
};
export default Dashboard;
