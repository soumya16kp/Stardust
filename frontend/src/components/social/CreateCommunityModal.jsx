import React, { useState } from 'react';
import { createCommunity } from '../../services/socialApi';
import Button from '../ui/Button';
import './CreateCommunityModal.css';

const CreateCommunityModal = ({ onClose, onCreated }) => {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [privacy, setPrivacy] = useState('public');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const newCommunity = await createCommunity({
                name,
                slug,
                description,
                privacy,
            });
            onCreated(newCommunity);
            onClose();
        } catch (err) {
            console.error(err);
            setError('Failed to create community. Slug might be taken.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Create Community</h2>
                {error && <div className="error-msg">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                            }}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Slug (URL identifier)</label>
                        <input value={slug} onChange={(e) => setSlug(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Privacy</label>
                        <select value={privacy} onChange={(e) => setPrivacy(e.target.value)}>
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                        </select>
                    </div>
                    <div className="modal-actions">
                        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="primary" disabled={isSubmitting}>Create</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCommunityModal;
