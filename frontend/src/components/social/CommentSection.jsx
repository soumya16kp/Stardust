import React, { useState, useEffect } from 'react';
import { getComments, createComment } from '../../services/socialApi';
import { Send, User } from 'lucide-react';
import './CommentSection.css';

const CommentSection = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const fetchComments = async () => {
        try {
            const data = await getComments(postId);
            setComments(data);
        } catch (error) {
            console.error("Failed to load comments", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            const response = await createComment({ post: postId, content: newComment });
            setComments([...comments, response]);
            setNewComment('');
        } catch (error) {
            console.error("Failed to post comment", error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="comments-loading">Loading transmissions...</div>;

    return (
        <div className="comment-section">
            <h4 className="comments-title">Transmissions ({comments.length})</h4>

            <div className="comments-list custom-scrollbar">
                {comments.length === 0 ? (
                    <div className="no-comments">No transmissions yet. Be the first to respond.</div>
                ) : (
                    comments.map(comment => (
                        <div key={comment.id} className="comment-item">
                            <div className="comment-avatar">
                                <User size={16} />
                            </div>
                            <div className="comment-content-wrapper">
                                <div className="comment-header">
                                    <span className="comment-author">{comment.author_username}</span>
                                    <span className="comment-time">
                                        {new Date(comment.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="comment-text">{comment.content}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <form onSubmit={handleSubmit} className="comment-form">
                <input
                    type="text"
                    className="comment-input"
                    placeholder="Write a response..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    disabled={submitting}
                />
                <button type="submit" className="comment-submit-btn" disabled={submitting || !newComment.trim()}>
                    <Send size={16} />
                </button>
            </form>
        </div>
    );
};

export default CommentSection;
