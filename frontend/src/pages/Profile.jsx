import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getUserProfile } from '../services/socialApi';
import EditProfileModal from '../components/social/EditProfileModal';
import { User, MapPin, Calendar, Link as LinkIcon, Shield, MessageSquare, Edit2, Activity } from 'lucide-react';
import './Profile.css';

const Profile = () => {
    const { username } = useParams();
    const { user: currentUser } = useSelector(state => state.auth);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    // Check if the viewed profile belongs to the logged-in user
    // We need to compare usernames nicely.
    const isOwnProfile = currentUser && profile && currentUser.username === profile.username;

    const fetchProfile = async () => {
        setLoading(true);
        try {
            console.log("Fetching profile for:", username);
            const data = await getUserProfile(username);
            console.log("Profile data received:", data);
            setProfile(data);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch profile", err);
            setError('User not found or signal lost in the void.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (username) {
            fetchProfile();
        }
    }, [username]);

    if (loading) return <div className="profile-loading">Scanning deep space for lifeform...</div>;
    if (error) return <div className="profile-error">{error}</div>;
    if (!profile) return <div className="profile-not-found">User not found in this galaxy.</div>;

    // profile object structure from backend might be { username, email, profile: { avatar, bio, ... } }
    // Let's destructure safely.
    const userProfile = profile.profile || {};

    return (
        <div className="profile-page-container">
            <div className="profile-header-card">
                <div className="profile-cover"></div>
                <div className="profile-main-info">
                    <div className="profile-avatar-xl">
                        {userProfile.avatar ? (
                            <img
                                src={userProfile.avatar.startsWith('http') ? userProfile.avatar : `http://localhost:8000${userProfile.avatar}`}
                                alt={profile.username}
                            />
                        ) : (
                            <div className="avatar-fallback-xl">{profile.username.charAt(0).toUpperCase()}</div>
                        )}
                    </div>
                    <div className="profile-names">
                        <h1>{profile.username}</h1>
                        <div className="profile-badges">
                            <span className="profile-role">Cadet</span>
                            {userProfile.is_online && (
                                <span className="online-badge">
                                    <Activity size={12} className="mr-1" /> Online
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="profile-actions">
                        {isOwnProfile ? (
                            <button className="profile-action-btn secondary" onClick={() => setShowEditModal(true)}>
                                <Edit2 size={16} style={{ marginRight: '8px' }} /> Edit Profile
                            </button>
                        ) : (
                            <button className="profile-action-btn primary">
                                <MessageSquare size={16} style={{ marginRight: '8px' }} /> Message
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="profile-content-grid">
                <div className="profile-bio-card">
                    <h3>Transmission Log (Bio)</h3>
                    <p className="bio-text">
                        {userProfile.bio || "No bio transmission received."}
                    </p>

                    <div className="profile-stats">
                        <div className="stat-item">
                            <span className="stat-value">{userProfile.posts_count || 0}</span>
                            <span className="stat-label">Posts</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">{userProfile.communities_count || 0}</span>
                            <span className="stat-label">Communities</span>
                        </div>
                    </div>
                </div>

                <div className="profile-details-card">
                    <h3>Service Record</h3>
                    <div className="detail-row">
                        <Calendar size={18} />
                        <span>Joined {profile.date_joined ? new Date(profile.date_joined).toLocaleDateString() : 'Unknown Stardate'}</span>
                    </div>
                    <div className="detail-row">
                        <Shield size={18} />
                        <span>Rank: {profile.id <= 5 ? 'Founder' : 'Member'}</span>
                    </div>
                </div>
            </div>

            {showEditModal && (
                <EditProfileModal
                    user={profile}
                    onClose={() => setShowEditModal(false)}
                    onUpdate={fetchProfile}
                />
            )}
        </div>
    );
};

export default Profile;
