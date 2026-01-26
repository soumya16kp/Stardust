import React from 'react';
import Card from '../components/ui/Card';
import './About.css';

const team = [
    { name: 'Dr. Sarah Connor', role: 'Mission Director', img: 'https://i.pravatar.cc/150?u=1' },
    { name: 'Major Tom', role: 'Lead Instructor', img: 'https://i.pravatar.cc/150?u=2' },
    { name: 'Ellen Ripley', role: 'Safety Officer', img: 'https://i.pravatar.cc/150?u=3' },
];

const About = () => {
    return (
        <div className="about-page section-padding">
            <div className="container">
                <h1 className="page-title text-center">About <span className="text-gradient">Galactic Academy</span></h1>
                <section className="mission-section">
                    <h2>Our Mission</h2>
                    <p>To democratize space education and prepare the human race for becoming a multi-planetary species.</p>
                </section>
                <section className="timeline-section">
                    <h2 className="text-center mb-5">Our Journey</h2>
                    <div className="timeline">
                        <div className="timeline-item"><div className="year">2023</div><div className="content">Founded.</div></div>
                        <div className="timeline-item"><div className="year">2024</div><div className="content">First Satellite.</div></div>
                        <div className="timeline-item"><div className="year">2025</div><div className="content">Global Partnerships.</div></div>
                    </div>
                </section>
                <section className="team-section">
                    <h2 className="text-center mb-5">Leadership Team</h2>
                    <div className="team-grid">
                        {team.map((m, i) => (
                            <Card key={i}><div className="card-content text-center"><img src={m.img} alt={m.name} className="team-img" /><h3>{m.name}</h3><p className="text-dim">{m.role}</p></div></Card>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};
export default About;
