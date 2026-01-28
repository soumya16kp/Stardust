import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Rocket, Atom, BrainCircuit } from 'lucide-react';
import './ProgramsPreview.css';

const programs = [
    {
        title: 'Space Fundamentals',
        icon: <Rocket size={40} className="text-gradient" />,
        desc: 'Introduction to rocketry, orbital mechanics, and space history.',
    },
    {
        title: 'Robotics & AI',
        icon: <BrainCircuit size={40} className="text-gradient" />,
        desc: 'Build intelligent rovers and systems for extraterrestrial exploration.',
    },
    {
        title: 'Astro-Physics',
        icon: <Atom size={40} className="text-gradient" />,
        desc: 'Deep dive into black holes, relativity, and the nature of the universe.',
    }
];

const ProgramsPreview = () => {
    return (
        <section className="section-padding programs-section">
            <div className="container">
                <h2 className="section-title text-center">Featured <span className="text-gradient">Programs</span></h2>
                <div className="programs-grid">
                    {programs.map((prog, idx) => (
                        <Card key={idx}>
                            <div className="card-content program-card-content">
                                <div className="program-icon-wrapper">
                                    {prog.icon}
                                </div>
                                <h3>{prog.title}</h3>
                                <p>{prog.desc}</p>
                                <Button variant="ghost" className="mt-auto">Learn More &rarr;</Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProgramsPreview;
