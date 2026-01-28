import React, { useState, useEffect } from 'react';
import CommunityList from '../components/social/CommunityList';
import Feed from '../components/social/Feed';
import { getCommunities } from '../services/socialApi';
import ActiveUsersList from '../components/social/ActiveUsersList';
import CommunityMembers from '../components/social/CommunityMembers';
import './SocialHost.css';

const SocialHost = () => {
    const [communities, setCommunities] = useState([]);
    const [activeCommunity, setActiveCommunity] = useState(null);

    const fetchCommunities = async () => {
        try {
            const data = await getCommunities();
            setCommunities(data);
            if (activeCommunity) {
                const updatedActive = data.find(c => c.id === activeCommunity.id);
                if (updatedActive) {
                    setActiveCommunity(updatedActive);
                }
            }
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
                {activeCommunity ? (
                    <CommunityMembers community={activeCommunity} />
                ) : (
                    <ActiveUsersList />
                )}
            </div>
        </div>
    );
};

export default SocialHost;
