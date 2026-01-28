import React, { useState, useRef } from 'react';
import { createPost } from '../../services/socialApi';
import { Image, Video, Send, X, FileText, Smile, CheckSquare } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import './CreatePost.css';

const CreatePost = ({ community, onPostCreated }) => {
    const [content, setContent] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileType, setFileType] = useState(null); // 'image', 'video', 'document'
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showEmoji, setShowEmoji] = useState(false);
    const [showPoll, setShowPoll] = useState(false);

    // Poll state
    const [pollQuestion, setPollQuestion] = useState('');
    const [pollOptions, setPollOptions] = useState(['', '']);

    // Hidden file inputs
    const imageInputRef = useRef(null);
    const videoInputRef = useRef(null);
    const docInputRef = useRef(null);

    const handleFileSelect = (e, type) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            setFileType(type);
        }
    };

    const clearFile = () => {
        setSelectedFile(null);
        setFileType(null);
        if (imageInputRef.current) imageInputRef.current.value = '';
        if (videoInputRef.current) videoInputRef.current.value = '';
        if (docInputRef.current) docInputRef.current.value = '';
    };

    const onEmojiClick = (emojiObject) => {
        setContent(prev => prev + emojiObject.emoji);
        setShowEmoji(false);
    };

    const handlePollOptionChange = (index, value) => {
        const newOptions = [...pollOptions];
        newOptions[index] = value;
        setPollOptions(newOptions);
    };

    const addPollOption = () => {
        if (pollOptions.length < 5) {
            setPollOptions([...pollOptions, '']);
        }
    };

    const removePollOption = (index) => {
        if (pollOptions.length > 2) {
            const newOptions = pollOptions.filter((_, i) => i !== index);
            setPollOptions(newOptions);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if ((!content.trim() && !selectedFile && !pollQuestion) || !community) return;

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('content', content);
            formData.append('community', community.id);

            if (selectedFile) {
                // Determine field name based on type
                const fieldName = fileType === 'image' ? 'image' : (fileType === 'video' ? 'video' : 'document');
                formData.append(fieldName, selectedFile);
            }

            if (showPoll && pollQuestion.trim()) {
                formData.append('poll_question', pollQuestion);
                pollOptions.forEach(opt => {
                    if (opt.trim()) {
                        formData.append('poll_options[]', opt);
                    }
                });
            }

            await createPost(formData);
            setContent('');
            clearFile();
            setPollQuestion('');
            setPollOptions(['', '']);
            setShowPoll(false);
            if (onPostCreated) onPostCreated();
        } catch (error) {
            console.error("Failed to create post:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!community) return <div className="create-post-placeholder">Select a community to transmit...</div>;

    return (
        <div className="create-post">
            <form onSubmit={handleSubmit}>
                <div className="input-wrapper relative">
                    <textarea
                        className="post-input"
                        placeholder={`Transmit to ${community.name}...`}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        disabled={isSubmitting}
                    />
                    {showEmoji && (
                        <div className="emoji-picker-container">
                            <EmojiPicker onEmojiClick={onEmojiClick} theme="dark" width={300} height={400} />
                            <div className="emoji-overlay" onClick={() => setShowEmoji(false)} />
                        </div>
                    )}
                </div>

                {selectedFile && (
                    <div className="file-preview">
                        <span className="file-name">
                            {fileType === 'image' && <Image size={14} />}
                            {fileType === 'video' && <Video size={14} />}
                            {fileType === 'document' && <FileText size={14} />}
                            {selectedFile.name}
                        </span>
                        <button type="button" onClick={clearFile} className="remove-file-btn">
                            <X size={14} />
                        </button>
                    </div>
                )}

                {showPoll && (
                    <div className="poll-creator">
                        <input
                            type="text"
                            className="poll-question-input"
                            placeholder="Ask a question..."
                            value={pollQuestion}
                            onChange={(e) => setPollQuestion(e.target.value)}
                        />
                        {pollOptions.map((opt, idx) => (
                            <div key={idx} className="poll-option-row">
                                <input
                                    type="text"
                                    className="poll-option-input"
                                    placeholder={`Option ${idx + 1}`}
                                    value={opt}
                                    onChange={(e) => handlePollOptionChange(idx, e.target.value)}
                                />
                                {pollOptions.length > 2 && (
                                    <button type="button" onClick={() => removePollOption(idx)} className="text-red-400">
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                        ))}
                        {pollOptions.length < 5 && (
                            <button type="button" onClick={addPollOption} className="add-option-btn">
                                + Add Option
                            </button>
                        )}
                    </div>
                )}

                <div className="create-post-footer">
                    <div className="media-actions">
                        <button type="button" className="media-btn" onClick={() => imageInputRef.current.click()} title="Image">
                            <Image size={20} />
                        </button>
                        <button type="button" className="media-btn" onClick={() => videoInputRef.current.click()} title="Video">
                            <Video size={20} />
                        </button>
                        <button type="button" className="media-btn" onClick={() => docInputRef.current.click()} title="Document">
                            <FileText size={20} />
                        </button>
                        <button type="button" className="media-btn" onClick={() => setShowPoll(!showPoll)} title="Poll">
                            <CheckSquare size={20} className={showPoll ? 'text-blue-400' : ''} />
                        </button>
                        <button type="button" className="media-btn" onClick={() => setShowEmoji(!showEmoji)} title="Emoji">
                            <Smile size={20} className={showEmoji ? 'text-yellow-400' : ''} />
                        </button>

                        <input type="file" ref={imageInputRef} accept="image/*" hidden onChange={(e) => handleFileSelect(e, 'image')} />
                        <input type="file" ref={videoInputRef} accept="video/*" hidden onChange={(e) => handleFileSelect(e, 'video')} />
                        <input type="file" ref={docInputRef} accept=".pdf,.doc,.docx,.txt" hidden onChange={(e) => handleFileSelect(e, 'document')} />
                    </div>

                    <button
                        type="submit"
                        className="post-submit-btn"
                        disabled={isSubmitting || (!content.trim() && !selectedFile && !pollQuestion)}
                    >
                        {isSubmitting ? 'Transmitting...' : (
                            <>
                                <span>Send</span>
                                <Send size={16} />
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;
