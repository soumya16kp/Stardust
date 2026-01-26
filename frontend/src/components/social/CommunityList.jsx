import React, { useState } from 'react';
import './CommunityList.css';
import { Plus } from 'lucide-react';
import CreateCommunityModal from './CreateCommunityModal';

const CommunityList = ({ communities, activeCommunity, onSelectCommunity, onCommunityCreated }) => {
    const [showCreateModal, setShowCreateModal] = useState(false);

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

            {communities.map(community => (
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
