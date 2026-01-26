import React from 'react';
import Hero from '../components/home/Hero';
import ProgramsPreview from '../components/home/ProgramsPreview';
import { Users, BookOpen, Globe, Award } from 'lucide-react';
import './Home.css';

const Home = () => {
    return (
        <div className="home-page">
            <Hero />
            <section className="container section-padding vision-section">
                <div className="vision-content">
                    <h2 className="section-title">Our <span className="text-gradient">Vision</span></h2>
                    <p className="vision-text">
                        Humanity's future lies among the stars. At Galactic Academy, we are dedicated to training the
                        next generation of astronauts, engineers, and scientists.
                    </p>
                </div>
            </section>
            <ProgramsPreview />
            <section className="stats-section section-padding">
                <div className="container">
                    <div className="stats-grid">
                        <div className="stat-card"><Users size={40} className="stat-icon" /><h3>10k+</h3><p>Active Learners</p></div>
                        <div className="stat-card"><BookOpen size={40} className="stat-icon" /><h3>50+</h3><p>Space Courses</p></div>
                        <div className="stat-card"><Globe size={40} className="stat-icon" /><h3>120</h3><p>Countries</p></div>
                        <div className="stat-card"><Award size={40} className="stat-icon" /><h3>95%</h3><p>Success Rate</p></div>
                    </div>
                </div>
            </section>
            <section className="container section-padding">
                <h2 className="section-title text-center">Cadet <span className="text-gradient">Stories</span></h2>
                <div className="testimonials-grid">
                    <div className="testimonial-card"><p>"The best decision I ever made."</p><h4>- Alex R.</h4></div>
                    <div className="testimonial-card"><p>"Ready for launch."</p><h4>- Sarah L.</h4></div>
                    <div className="testimonial-card"><p>"Mentors are industry veterans."</p><h4>- James T.</h4></div>
                </div>
            </section>
            <section className="cta-section section-padding text-center">
                <div className="container">
                    <h2 className="mb-4">Ready for <span className="text-gradient">Liftoff?</span></h2>
                    <button className="btn btn-primary">Become a Cadet</button>
                </div>
            </section>
        </div>
    );
};
export default Home;
