import React, { useState } from 'react';
import './CommunityList.css';
import { Plus } from 'lucide-react';
import CreateCommunityModal from './CreateCommunityModal';

const CommunityList = ({ communities, activeCommunity, onSelectCommunity, onCommunityCreated }) => {
    const [showCreateModal, setShowCreateModal] = useState(false);

    const joinedCommunities = communities.filter(c => c.membership_status === 'accepted');
    const otherCommunities = communities.filter(c => c.membership_status !== 'accepted');

    return (
        <div className="community-list">
            <div
                className={`community-item ${!activeCommunity ? 'active' : ''}`}
                onClick={() => onSelectCommunity(null)}
            >
                <div className="community-icon">🏠</div>
                <span className="community-tooltip">Home</span>
            </div>

            <div className="separator"></div>

            {/* Joined Communities */}
            {joinedCommunities.map(community => (
                <div
                    key={community.id}
                    className={`community-item ${activeCommunity?.id === community.id ? 'active' : ''}`}
                    onClick={() => onSelectCommunity(community)}
                >
                    {community.icon ? (
                        <img src={community.icon} alt={community.name} className="community-img" />
                    ) : (
                        <div className="community-icon">{community.name.charAt(0)}</div>
                    )}
                    <span className="community-tooltip">{community.name}</span>
                </div>
            ))}

            {joinedCommunities.length > 0 && otherCommunities.length > 0 && (
                <div className="separator"></div>
            )}

            {/* Other Communities (Discover) */}
            {otherCommunities.map(community => (
                <div
                    key={community.id}
                    className={`community-item ${activeCommunity?.id === community.id ? 'active' : ''}`}
                    onClick={() => onSelectCommunity(community)}
                >
                    {community.icon ? (
                        <img src={community.icon} alt={community.name} className="community-img" style={{ opacity: community.membership_status === 'pending' ? 0.5 : 0.7 }} />
                    ) : (
                        <div className="community-icon" style={{ opacity: community.membership_status === 'pending' ? 0.5 : 0.7 }}>{community.name.charAt(0)}</div>
                    )}

                    {community.membership_status === 'pending' && (
                        <div className="pending-badge-icon" style={{ position: 'absolute', bottom: -2, right: -2, fontSize: '10px' }}>⏳</div>
                    )}

                    <span className="community-tooltip">
                        {community.name}
                        {community.membership_status === 'pending' ? ' (Pending)' : ' (Join)'}
                    </span>
                </div>
            ))}

            <div className="separator"></div>

            <div
                className="community-item create-community-btn"
                onClick={() => setShowCreateModal(true)}
            >
                <Plus size={24} className="available-icon" style={{ color: '#23a559' }} />
                <span className="community-tooltip">Create Community</span>
            </div>

            {showCreateModal && (
                <CreateCommunityModal
                    onClose={() => setShowCreateModal(false)}
                    onCreated={(newCommunity) => {
                        onCommunityCreated(newCommunity);
                        setShowCreateModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default CommunityList;
