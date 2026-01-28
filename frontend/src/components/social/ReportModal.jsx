import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { createReport } from '../../services/socialApi';
import Button from '../ui/Button';
import './ReportModal.css';

const ReportModal = ({ type, id, onClose }) => {
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = { reason };
            if (type === 'post') payload.post = id;
            if (type === 'comment') payload.comment = id;
            if (type === 'user') payload.reported_user = id;

            await createReport(payload);
            setSuccess(true);
            setTimeout(onClose, 2000);
        } catch (error) {
            console.error("Failed to report");
        } finally {
            setIsSubmitting(false);
        }
    };

    return ReactDOM.createPortal(
        <div className="report-modal-overlay" onClick={onClose}>
            <div className="report-modal-content" onClick={(e) => e.stopPropagation()}>
                {success ? (
                    <div className="success-msg">Report submitted. Thank you for keeping us safe. 🛡️</div>
                ) : (
                    <>
                        <h3>Report Content</h3>
                        <form onSubmit={handleSubmit}>
                            <textarea
                                placeholder="Why are you reporting this? (Spam, Abuse, Harassment...)"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                required
                            />
                            <div className="modal-actions">
                                <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                                <Button type="submit" variant="primary" disabled={isSubmitting}>Submit Report</Button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>,
        document.body
    );
};

export default ReportModal;
