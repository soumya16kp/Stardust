import React, { useState, useEffect } from 'react';
import { getActiveUsers } from '../../services/socialApi';
import { Search } from 'lucide-react';
import './CommunityList.css'; // Reusing styles for consistency or create new one

const ActiveUsersList = () => {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const data = await getActiveUsers(searchQuery);
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch active users", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
        // Poll every 30 seconds
        const interval = setInterval(fetchUsers, 30000);
        return () => clearInterval(interval);
    }, [searchQuery]); // Re-fetch on search change

    return (
        <div className="right-sidebar-panel">
            <h3>Active Personnel</h3>

            <div className="search-box mb-4" style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Search size={16} className="text-secondary mr-2" />
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', outline: 'none', fontSize: '0.9rem' }}
                />
            </div>

            <div className="active-users-list custom-scrollbar" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {loading && <p className="text-sm text-secondary">Scanning...</p>}

                {!loading && users.length === 0 && (
                    <p className="text-sm text-secondary">No active users found.</p>
                )}

                {users.map(user => (
                    <div key={user.id} className="user-item" style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', padding: '6px', borderRadius: '8px', transition: 'background 0.2s' }}>
                        <div className="avatar-wrapper" style={{ position: 'relative', marginRight: '12px' }}>
                            <div className="user-avatar" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                {user.profile?.avatar ? (
                                    <img src={user.profile.avatar} alt={user.username} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                                ) : (
                                    user.username.charAt(0).toUpperCase()
                                )}
                            </div>
                            {user.profile?.is_online && (
                                <span className="online-indicator" style={{ position: 'absolute', bottom: '0', right: '0', width: '10px', height: '10px', background: '#10b981', borderRadius: '50%', border: '2px solid #111827' }}></span>
                            )}
                        </div>
                        <div className="user-info">
                            <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '0' }}>{user.username}</h4>
                            <span className="text-xs text-secondary" style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                                {user.profile?.is_online ? 'Online' : 'Last seen recently'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActiveUsersList;
