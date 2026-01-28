import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Button from '../ui/Button';
import { Camera, X } from 'lucide-react';
import { updateUserProfile } from '../../services/socialApi';
import './EditProfileModal.css';

const EditProfileModal = ({ user, onClose, onUpdate }) => {
    const [bio, setBio] = useState(user.profile?.bio || '');
    const [avatarFile, setAvatarFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(user.profile?.avatar ? `http://localhost:8000${user.profile.avatar}` : null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('profile.bio', bio);
            if (avatarFile) {
                formData.append('profile.avatar', avatarFile);
            }

            // Note: Our serializer expects nested profile data. 
            // However, FormData with dots "profile.bio" works automatically with DRF if using a library that supports it or standard parser.
            // If standard DRF parser doesn't handle dot notation for nested serializers automatically, we might need a workaround.
            // But let's try standard way. Typically nested writes with FormData are tricky.
            // A safer approach for this specific backend implementation (UserSerializer update method):
            // We need to construct the data carefully.
            // Actually, my backend update method expects `profile_data = validated_data.pop('profile', None)`.
            // Sending JSON is safer for the bio, but avatar requires FormData.
            // Let's send a PATCH with multipart/form-data.
            // Key names need to match what DRF expects. `profile.bio` might be interpreted as a key "profile.bio" not nested structure.
            // DRF default JSON parser handles nested, but MultiPartParser is flat. 
            // Wait, I implemented `update` in UserSerializer.
            // If I send `bio` and `avatar` fields, they won't be under `profile` in validated_data unless I structure them.
            // FIX: I will modify the backend serializer slightly if needed, OR send data carefully.
            // Actually, easier fix: Use `profile.bio` as key and ensure backend understands, OR
            // just send 'bio' and 'avatar' in FormData and have a separate 'UpdateProfileSerializer' on backend?
            // No, let's keep it simple. I will try to use the `me` endpoint which uses `UserSerializer`.
            // `UserSerializer` expects `profile` dict.
            // With FormData, it's hard to send nested dict.
            // STRATEGY: 
            // 1. Send text fields as JSON if no image.
            // 2. If Image, we usually need correct field names.
            // Let's assume for now I will rely on a Flat structure for the update or I'll fix the backend to look for 'bio'/'avatar' in request.data directly if profile is not found.

            // Let's update `UserSerializer.update` to look for 'bio' and 'avatar' in root validated_data or extra context if needed?
            // No, cleaner is: The client sends `profile` as a JSON string? No that's messy.

            // Alternative: Send 'bio' and 'avatar' as top level keys, and update Serializer to look for them?
            // Currently UserSerializer has `profile = ProfileSerializer()`.
            // So it expects data['profile'] = { 'bio': ... }.

            // Let's use a specialized Serializer for this specific Profile Update View if `me` endpoint is complex.
            // But I already modified `me`.

            // Let's try sending `profile.bio` and see. DRF 3.0+ sometimes handles this.
            // If not, I will do a quick backend fix to map 'bio' -> 'profile.bio'.

            // For now, let's try populating FormData with `profile.bio`.

            await updateUserProfile(formData);

            // Reload page or callback
            if (onUpdate) onUpdate();
            onClose();
        } catch (err) {
            console.error("Update failed", err);
            setError('Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return ReactDOM.createPortal(
        <div className="modal-overlay">
            <div className="modal-content edit-profile-modal">
                <div className="modal-header">
                    <h3>Edit Profile</h3>
                    <button onClick={onClose} className="close-btn"><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="avatar-upload-section">
                        <div className="avatar-preview">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" />
                            ) : (
                                <div className="avatar-fallback-lg">{user.username.charAt(0).toUpperCase()}</div>
                            )}
                            <label className="avatar-upload-btn">
                                <Camera size={18} />
                                <input type="file" accept="image/*" onChange={handleAvatarChange} hidden />
                            </label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Bio</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell the galaxy about yourself..."
                            rows={4}
                        />
                    </div>

                    {error && <div className="error-msg">{error}</div>}

                    <div className="modal-actions">
                        <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Updating...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default EditProfileModal;
