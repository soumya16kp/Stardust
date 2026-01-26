import React from 'react';
import './CommunityList.css';

const CommunityList = ({ communities, activeCommunity, onSelectCommunity }) => {
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
        </div>
    );
};

export default CommunityList;
