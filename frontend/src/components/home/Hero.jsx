import React from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import './Hero.css';

const Hero = () => {
    return (
        <section className="hero">
            <div className="container hero-content">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="hero-text"
                >
                    <h1 className="hero-title">
                        Explore <span className="text-gradient">Space.</span><br />
                        Build the <span className="text-gradient">Future.</span>
                    </h1>
                    <p className="hero-subtitle">
                        Join the global community of space explorers, engineers, and visionaries.
                        Master the skills to launch your career into the cosmos.
                    </p>
                    <div className="hero-actions">
                        <Button variant="primary">Join Program</Button>
                        <Button variant="secondary">Learn More</Button>
                    </div>
                </motion.div>

                {/* Abstract 3D Element or Graphic */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="hero-visual"
                >
                    <div className="planet-glow"></div>
                    <div className="planet"></div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
