import React, { useState } from 'react';
import { likePost } from '../../services/socialApi';
import ReportModal from './ReportModal';
import './PostCard.css';

const PostCard = ({ post }) => {
    const [liked, setLiked] = useState(post.is_liked);
    const [likesCount, setLikesCount] = useState(post.likes_count);
    const [isLikeLoading, setIsLikeLoading] = useState(false);
    const [showReport, setShowReport] = useState(false);

    const handleLike = async () => {
        if (isLikeLoading) return;
        setIsLikeLoading(true);
        try {
            const response = await likePost(post.id);
            if (response.status === 'liked') {
                setLiked(true);
                setLikesCount(prev => prev + 1);
            } else {
                setLiked(false);
                setLikesCount(prev => prev - 1);
            }
        } catch (error) {
            console.error("Error liking post:", error);
        } finally {
            setIsLikeLoading(false);
        }
    };

    return (
        <div className="post-card">
            <div className="post-header">
                <div className="post-author-avatar">
                    {post.author_username?.charAt(0).toUpperCase()}
                </div>
                <div className="post-meta">
                    <span className="post-author">{post.author_username}</span>
                    <span className="post-community">in {post.community_name}</span>
                    <span className="post-date">{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
            </div>

            <div className="post-content">
                {post.content}
            </div>

            {post.image && (
                <div className="post-image-container">
                    <img src={post.image} alt="Post content" className="post-image" />
                </div>
            )}
            {post.video && (
                <div className="post-video-container">
                    <video controls className="post-video">
                        <source src={post.video} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            )}

            <div className="post-actions">
                <button className={`action-btn ${liked ? 'liked' : ''}`} onClick={handleLike}>
                    ❤️ {likesCount}
                </button>
                <button className="action-btn">
                    💬 {post.comments_count} Comments
                </button>
                <button
                    className="action-btn"
                    onClick={() => setShowReport(true)}
                    style={{ marginLeft: 'auto', color: '#949ba4' }}
                >
                    🚩 Report
                </button>
            </div>

            {showReport && (
                <ReportModal type="post" id={post.id} onClose={() => setShowReport(false)} />
            )}
        </div>
    );
};

export default PostCard;
