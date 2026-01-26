import React, { useEffect, useState } from 'react';
import { getPosts } from '../../services/socialApi';
import PostCard from './PostCard';
import CreatePost from './CreatePost';
import './Feed.css';

const Feed = ({ activeCommunity }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const data = await getPosts(activeCommunity?.slug);
            setPosts(data);
        } catch (error) {
            console.error("Failed to load posts", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [activeCommunity]);

    return (
        <div className="feed-container">
            <div className="feed-header">
                <h2>{activeCommunity ? activeCommunity.name : 'Home'}</h2>
                <div className="feed-header-desc">
                    {activeCommunity ? activeCommunity.description : 'Your custom feed'}
                </div>
            </div>

            {activeCommunity && (
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
                            ? "No posts yet. Be the first to share something!"
                            : "Select a community to start browsing."}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Feed;
