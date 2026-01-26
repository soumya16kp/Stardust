import React from 'react';
import Button from '../components/ui/Button';

const Ambassador = () => {
    return (
        <div className="section-padding container text-center">
            <h1 className="page-title mb-4">Become an <span className="text-gradient">Ambassador</span></h1>
            <p className="mb-5" style={{ color: 'var(--text-dim)' }}>Lead the space revolution in your community.</p>
            <Button variant="primary">Apply Now</Button>
        </div>
    );
};
export default Ambassador;
