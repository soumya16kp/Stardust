import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import './Programs.css';
import { getPrograms } from '../services/contentApi';

const Programs = () => {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const data = await getPrograms();
                setPrograms(data);
            } catch (error) {
                console.error("Failed to load programs");
            } finally {
                setLoading(false);
            }
        };
        fetchPrograms();
    }, []);

    const categories = ['All', 'Fundamentals', 'Robotics', 'Physics', 'Career'];
    const filtered = filter === 'All' ? programs : programs.filter(p => p.category === filter);

    return (
        <div className="programs-page section-padding">
            <div className="container">
                <h1 className="page-title text-center">Academic <span className="text-gradient">Programs</span></h1>
                <div className="filters">
                    {categories.map(cat => (
                        <button key={cat} className={`filter-btn ${filter === cat ? 'active' : ''}`} onClick={() => setFilter(cat)}>{cat}</button>
                    ))}
                </div>
                <div className="programs-grid">
                    {filtered.map(p => (
                        <Card key={p.id}><div className="card-content"><div className="program-badge">{p.category}</div><h3>{p.title}</h3><p className="text-dim mt-2">Level: {p.level}</p><div className="program-actions mt-auto"><Button variant="secondary" style={{ width: '100%' }}>Enroll</Button></div></div></Card>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default Programs;
