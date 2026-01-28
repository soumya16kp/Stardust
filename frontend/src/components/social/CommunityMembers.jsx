import React, { useState, useEffect } from 'react';
import { getCommunityMembers, banUser } from '../../services/socialApi';
import { Link } from 'react-router-dom';
import { User, Shield, ShieldAlert, MoreVertical } from 'lucide-react';
import './CommunityMembers.css';

const CommunityMembers = ({ community }) => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (community) {
            fetchMembers();
        }
    }, [community]);

    const fetchMembers = async () => {
        setLoading(true);
        try {
            // Get accepted members
            const data = await getCommunityMembers(community.slug);
            setMembers(data);
        } catch (error) {
            console.error("Failed to load members", error);
        } finally {
            setLoading(false);
        }
    };

    const getRoleIcon = (role) => {
        if (role === 'admin') return <Shield size={14} color="#f43f5e" fill="#f43f5e" fillOpacity={0.2} />;
        if (role === 'moderator') return <Shield size={14} color="#22c55e" fill="#22c55e" fillOpacity={0.2} />;
        return null;
    };

    const filteredMembers = members.filter(member =>
        member.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const admins = filteredMembers.filter(m => m.role === 'admin');
    const moderators = filteredMembers.filter(m => m.role === 'moderator');
    const regular = filteredMembers.filter(m => m.role === 'member');

    if (loading) return <div className="members-loading">Scanning personnel...</div>;

    const renderMemberGroup = (title, groupMembers) => {
        if (groupMembers.length === 0) return null;
        return (
            <div className="member-group">
                <h4 className="group-title">{title} — {groupMembers.length}</h4>
                {groupMembers.map(member => (
                    <Link to={`/profile/${member.username}`} key={member.user_id} className="member-item group relative" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="member-avatar-wrapper relative">
                            {member.avatar ? (
                                <img src={`http://localhost:8000${member.avatar}`} alt={member.username} className="member-avatar-img" />
                            ) : (
                                <div className="member-avatar-fallback">
                                    {member.username.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <span className={`status-indicator ${member.is_online ? 'online' : 'offline'}`}
                                title={member.is_online ? 'Online' : 'Offline'} />
                        </div>
                        <div className="member-info">
                            <div className="member-header">
                                <span className={`member-name ${member.role}`}>{member.username}</span>
                                <span className="member-role-icon">{getRoleIcon(member.role)}</span>
                            </div>
                            <div className="member-bio text-xs text-gray-400 truncate w-32">
                                {member.bio || 'No bio available'}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        );
    };

    return (
        <div className="right-sidebar-panel">
            <h3>{community.name} Roster</h3>
            <div className="member-search-container" style={{ marginBottom: '16px' }}>
                <input
                    type="text"
                    placeholder="Search personnel..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="member-search-input"
                    style={{
                        width: '100%',
                        padding: '8px 12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '6px',
                        color: 'white',
                        fontSize: '13px',
                        outline: 'none'
                    }}
                />
            </div>
            <div className="members-list custom-scrollbar">
                {renderMemberGroup('Command', admins)}
                {renderMemberGroup('Officers', moderators)}
                {renderMemberGroup('Crew', regular)}
                {filteredMembers.length === 0 && !loading && (
                    <div style={{ textAlign: 'center', color: '#949ba4', padding: '20px', fontSize: '13px' }}>
                        No personnel found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommunityMembers;
