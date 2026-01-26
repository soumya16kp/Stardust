import React, { useState } from 'react';
import { createPost } from '../../services/socialApi';
import './CreatePost.css';

const CreatePost = ({ community, onPostCreated }) => {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim() || !community) return;

        setIsSubmitting(true);
        try {
            // Need to pass community slug or ID
            // For now assume backend takes ID, but our serializer might need tweaking or we pass ID in `community` if needed.
            // Wait, Post model has community FK. Serializer defaults. 
            // In API we should probably pass community ID.
            // Let's pass community ID.
            await createPost({
                content,
                community: community.id
            });
            setContent('');
            if (onPostCreated) onPostCreated();
        } catch (error) {
            console.error("Failed to create post:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!community) return <div className="create-post-placeholder">Select a community to post</div>;

    return (
        <div className="create-post">
            <form onSubmit={handleSubmit}>
                <textarea
                    className="post-input"
                    placeholder={`What's happening in ${community.name}?`}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={isSubmitting}
                />
                <div className="create-post-footer">
                    <button
                        type="submit"
                        className="post-submit-btn"
                        disabled={isSubmitting || !content.trim()}
                    >
                        {isSubmitting ? 'Posting...' : 'Post'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;
