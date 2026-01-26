import React, { useState, useEffect } from 'react';
import CommunityList from '../components/social/CommunityList';
import Feed from '../components/social/Feed';
import { getCommunities } from '../services/socialApi';
import './SocialHost.css';

const SocialHost = () => {
    const [communities, setCommunities] = useState([]);
    const [activeCommunity, setActiveCommunity] = useState(null);

    const fetchCommunities = async () => {
        try {
            const data = await getCommunities();
            setCommunities(data);
        } catch (error) {
            console.error("Failed to load communities", error);
        }
    };

    useEffect(() => {
        fetchCommunities();
    }, []);

    const handleCommunityCreated = (newCommunity) => {
        setCommunities([...communities, newCommunity]);
        setActiveCommunity(newCommunity);
    };

    return (
        <div className="social-layout">
            <CommunityList
                communities={communities}
                activeCommunity={activeCommunity}
                onSelectCommunity={setActiveCommunity}
                onCommunityCreated={handleCommunityCreated}
            />
            <div className="social-main">
                <Feed activeCommunity={activeCommunity} onMembershipChange={fetchCommunities} />
            </div>
            <div className="social-right-sidebar">
                {/* Future: Members list, Trending, etc */}
                <div className="right-sidebar-panel">
                    <h3>Active Users</h3>
                    <div className="user-list-placeholder">
                        Coming soon...
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SocialHost;
