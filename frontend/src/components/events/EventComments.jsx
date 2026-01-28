import React, { useState, useEffect } from 'react';
import { getEventComments, addEventComment } from '../../services/contentApi';
import { MessageSquare, Send, User } from 'lucide-react';
import './EventComments.css';

const EventComments = ({ slug }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchComments();
    }, [slug]);

    const fetchComments = async () => {
        try {
            const data = await getEventComments(slug);
            setComments(data);
        } catch (error) {
            console.error("Failed to load comments");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const comment = await addEventComment(slug, newComment);
            setComments([comment, ...comments]);
            setNewComment('');
        } catch (error) {
            alert("Failed to post comment. Please login.");
        }
    };

    return (
        <div className="event-comments-section">
            <h3 className="section-title">
                <MessageSquare className="icon" size={20} />
                Mission Control Chat <span className="count">{comments.length}</span>
            </h3>

            <form onSubmit={handleSubmit} className="comment-form">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Transmission to Mission Control..."
                    className="comment-input"
                    rows={2}
                />
                <button type="submit" className="send-btn" disabled={!newComment.trim()}>
                    <Send size={18} />
                </button>
            </form>

            <div className="comments-feed">
                {loading ? (
                    <div className="loading-text">Establishing connection...</div>
                ) : comments.length > 0 ? (
                    comments.map(comment => (
                        <div key={comment.id} className="comment-item">
                            <div className="comment-avatar">
                                {comment.author_avatar ? (
                                    <img src={`http://localhost:8000${comment.author_avatar}`} alt={comment.author_username} />
                                ) : (
                                    <div className="avatar-placeholder">
                                        <User size={16} />
                                    </div>
                                )}
                            </div>
                            <div className="comment-content">
                                <div className="comment-header">
                                    <span className="username">{comment.author_username}</span>
                                    <span className="timestamp">{new Date(comment.created_at).toLocaleDateString()}</span>
                                </div>
                                <p className="text">{comment.content}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">No transmissions yet. Be the first to report in.</div>
                )}
            </div>
        </div>
    );
};

export default EventComments;
