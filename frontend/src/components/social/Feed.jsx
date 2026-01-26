import React, { useEffect, useState } from 'react';
import { getPosts, joinCommunity, leaveCommunity, approveMember, getCommunityMembers } from '../../services/socialApi';
import PostCard from './PostCard';
import CreatePost from './CreatePost';
import Button from '../ui/Button';
import './Feed.css';

const Feed = ({ activeCommunity, onMembershipChange }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('all'); // 'all' or 'video'
    const [pendingMembers, setPendingMembers] = useState([]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const type = filter === 'video' ? 'video' : null;
            const data = await getPosts(activeCommunity?.slug, type);
            setPosts(data);
        } catch (error) {
            console.error("Failed to load posts", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch pending members if admin
    const fetchPendingMembers = async () => {
        if (activeCommunity && activeCommunity.role === 'admin') {
            try {
                const data = await getCommunityMembers(activeCommunity.slug, 'pending');
                setPendingMembers(data);
            } catch (error) {
                console.error("Failed to load pending members", error);
            }
        } else {
            setPendingMembers([]);
        }
    };

    useEffect(() => {
        fetchPosts();
        fetchPendingMembers();
    }, [activeCommunity, filter]);

    const handleApprove = async (userId) => {
        try {
            await approveMember(activeCommunity.slug, userId);
            // Remove from list
            setPendingMembers(prev => prev.filter(m => m.user_id !== userId));
        } catch (error) {
            console.error("Failed to approve", error);
        }
    };

    const handleJoin = async () => {
        if (!activeCommunity) return;
        try {
            await joinCommunity(activeCommunity.slug);
            if (onMembershipChange) onMembershipChange();
        } catch (error) {
            console.error("Failed to join", error);
        }
    };

    const handleLeave = async () => {
        if (!activeCommunity) return;
        try {
            await leaveCommunity(activeCommunity.slug);
            if (onMembershipChange) onMembershipChange();
        } catch (error) {
            console.error("Failed to leave", error);
        }
    };

    const showCreatePost = activeCommunity && activeCommunity.is_member;
    const showJoinButton = activeCommunity && !activeCommunity.is_member;
    const isAdmin = activeCommunity && activeCommunity.role === 'admin';

    return (
        <div className="feed-container">
            <div className="feed-header">
                <div className="feed-header-top">
                    <div>
                        <h2>{activeCommunity ? activeCommunity.name : 'Home'}</h2>
                        <div className="feed-header-desc">
                            {activeCommunity ? activeCommunity.description : 'Your custom feed'}
                        </div>
                        {activeCommunity && <div className="community-badge">{activeCommunity.privacy}</div>}
                    </div>
                    <div className="header-actions">
                        {showJoinButton && (
                            <Button onClick={handleJoin} variant="primary">Join Community</Button>
                        )}
                        {activeCommunity && activeCommunity.is_member && !isAdmin && (
                            <Button onClick={handleLeave} variant="secondary" style={{ fontSize: '12px', padding: '4px 8px' }}>Leave</Button>
                        )}
                        {isAdmin && (
                            <div className="admin-badge">Admin</div>
                        )}
                    </div>
                </div>

                <div className="feed-tabs">
                    <button
                        className={`feed-tab ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All Posts
                    </button>
                    <button
                        className={`feed-tab ${filter === 'video' ? 'active' : ''}`}
                        onClick={() => setFilter('video')}
                    >
                        Videos
                    </button>
                </div>
            </div>

            {pendingMembers.length > 0 && (
                <div className="pending-requests">
                    <h3>Pending Requests</h3>
                    {pendingMembers.map(member => (
                        <div key={member.user_id} className="pending-item">
                            <span>{member.username}</span>
                            <Button size="sm" onClick={() => handleApprove(member.user_id)}>Approve</Button>
                        </div>
                    ))}
                </div>
            )}

            {showCreatePost && (
                <CreatePost community={activeCommunity} onPostCreated={fetchPosts} />
            )}

            <div className="posts-list">
                {loading ? (
                    <div className="loading-posts">Loading posts...</div>
                ) : posts.length > 0 ? (
                    posts.map(post => (
                        <PostCard key={post.id} post={post} />
                    ))
                ) : (
                    <div className="no-posts">
                        {activeCommunity
                            ? (activeCommunity.is_member ? "No posts yet. Be the first to share something!" : "Join this community to see posts.")
                            : "Select a community to start browsing."}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Feed;
