import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom'; // For ReportModal portal if needed, though we moved it inside ReportModal
import { likePost, removePost } from '../../services/socialApi';
import ReportModal from './ReportModal';
import ConfirmationModal from '../ui/ConfirmationModal';
import CommentSection from './CommentSection';
import PollComponent from './PollComponent';
import { Heart, MessageSquare, Share2, MoreHorizontal, Flag, Clock, Trash2, FileText, Download } from 'lucide-react';
import './PostCard.css';

const PostCard = ({ post, onDelete }) => {
    const [liked, setLiked] = useState(post.is_liked);
    const [likesCount, setLikesCount] = useState(post.likes_count);
    const [isLikeLoading, setIsLikeLoading] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

    const handleDelete = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        try {
            await removePost(post.id);
            if (onDelete) onDelete(post.id);
        } catch (error) {
            console.error("Failed to delete post:", error);
            alert("Failed to delete post.");
        } finally {
            setShowDeleteConfirm(false);
        }
    };

    return (
        <div className="post-card">
            <div className="post-header">
                <Link to={`/profile/${post.author_username}`} className="post-author-link">
                    <div className="post-author-avatar">
                        {post.author_profile?.avatar ? (
                            <img src={post.author_profile.avatar} alt={post.author_username} />
                        ) : (
                            <span>{post.author_username?.charAt(0).toUpperCase()}</span>
                        )}
                    </div>
                </Link>
                <div className="post-meta">
                    <Link to={`/profile/${post.author_username}`} className="post-author-link">
                        <span className="post-author">{post.author_username}</span>
                    </Link>
                    <div className="post-sub-meta">
                        <span className="post-community">in {post.community_name}</span>
                        <span className="meta-dot">•</span>
                        <span className="post-time">
                            <Clock size={12} style={{ marginRight: '4px' }} />
                            {(() => {
                                try {
                                    return post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Just now';
                                } catch (e) {
                                    return 'Just now';
                                }
                            })()}
                        </span>
                    </div>
                </div>
                {post.is_author ? (
                    <button className="post-options-btn" onClick={handleDelete} title="Delete Post">
                        <Trash2 size={20} className="text-red-400" />
                    </button>
                ) : (
                    <button className="post-options-btn" onClick={() => setShowReport(true)} title="Report Post">
                        <MoreHorizontal size={20} />
                    </button>
                )}
            </div>

            <div className="post-content">
                {post.content}
            </div>

            {post.image && (
                <div className="post-image-container">
                    <img
                        src={post.image.startsWith('http') ? post.image : `http://localhost:8000${post.image}`}
                        alt="Post content"
                        className="post-image"
                    />
                </div>
            )}
            {post.video && (
                <div className="post-video-container">
                    <video controls className="post-video">
                        <source
                            src={post.video.startsWith('http') ? post.video : `http://localhost:8000${post.video}`}
                            type="video/mp4"
                        />
                        Your browser does not support the video tag.
                    </video>
                </div>
            )}
            {post.document && (
                <div className="post-document-container">
                    <a
                        href={post.document.startsWith('http') ? post.document : `http://localhost:8000${post.document}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="post-document-link"
                    >
                        <div className="doc-icon-wrapper">
                            <FileText size={24} />
                        </div>
                        <div className="doc-info">
                            <span className="doc-name">{post.document.split('/').pop()}</span>
                            <span className="doc-type">Document</span>
                        </div>
                        <Download size={20} className="doc-download-icon" />
                    </a>
                </div>
            )}

            {post.poll && (
                <PollComponent poll={post.poll} postId={post.id} />
            )}

            <div className="post-actions">
                <button className={`action-btn ${liked ? 'liked' : ''}`} onClick={handleLike}>
                    <Heart size={20} className={liked ? 'fill-current' : ''} />
                    <span>{likesCount}</span>
                </button>
                <button className="action-btn" onClick={() => setShowComments(!showComments)}>
                    <MessageSquare size={20} />
                    <span>{post.comments_count}</span>
                </button>
                <button className="action-btn">
                    <Share2 size={20} />
                    <span>Share</span>
                </button>
            </div>

            {showComments && <CommentSection postId={post.id} />}

            {showReport && (
                <ReportModal type="post" id={post.id} onClose={() => setShowReport(false)} />
            )}

            <ConfirmationModal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDelete}
                title="Delete Post"
                message="Are you sure you want to delete this post? This action cannot be undone."
                confirmText="Delete"
                confirmVariant="danger"
            />
        </div>
    );
};

export default PostCard;
