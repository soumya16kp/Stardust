import React, { useState } from 'react';
import { createPost } from '../../services/socialApi';
import './CreatePost.css';

const CreatePost = ({ community, onPostCreated }) => {
    const [content, setContent] = useState('');
    const [video, setVideo] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if ((!content.trim() && !video) || !community) return;

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('content', content);
            formData.append('community', community.id);
            if (video) {
                formData.append('video', video);
            }

            await createPost(formData);
            setContent('');
            setVideo(null);
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
                <div className="create-post-footer" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setVideo(e.target.files[0])}
                        style={{ color: '#b5bac1', fontSize: '12px' }}
                    />
                    <button
                        type="submit"
                        className="post-submit-btn"
                        disabled={isSubmitting || (!content.trim() && !video)}
                    >
                        {isSubmitting ? 'Posting...' : 'Post'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;
