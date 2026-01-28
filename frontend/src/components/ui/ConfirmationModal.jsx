import React from 'react';
import ReactDOM from 'react-dom';
import Button from '../ui/Button';
import { AlertTriangle } from 'lucide-react';
import './ConfirmationModal.css';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', confirmVariant = 'danger' }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="confirmation-modal-overlay" onClick={onClose}>
            <div className="confirmation-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <AlertTriangle size={24} className="text-red-500" />
                    <h3>{title}</h3>
                </div>
                <div className="modal-body">
                    <p>{message}</p>
                </div>
                <div className="modal-actions">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button variant={confirmVariant} onClick={onConfirm}>
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ConfirmationModal;
