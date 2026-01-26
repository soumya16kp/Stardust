import React from 'react';
import { Rocket, Facebook, Twitter, Instagram } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-col brand-col">
                        <div className="logo-container">
                            <Rocket className="logo-icon" size={24} />
                            <span>GALACTIC</span>
                        </div>
                        <p className="mt-4 text-dim">
                            Empowering the next generation of space explorers and engineers.
                        </p>
                    </div>

                    <div className="footer-col">
                        <h3>Programs</h3>
                        <ul>
                            <li><a href="#fundamentals">Space Fundamentals</a></li>
                            <li><a href="#robotics">Robotics & AI</a></li>
                            <li><a href="#astrophysics">Astro-Physics</a></li>
                            <li><a href="#bootcamps">Career Bootcamps</a></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h3>Company</h3>
                        <ul>
                            <li><a href="/about">About Us</a></li>
                            <li><a href="/careers">Careers</a></li>
                            <li><a href="/blog">Blog</a></li>
                            <li><a href="/privacy">Privacy Policy</a></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h3>Connect</h3>
                        <div className="social-links">
                            <a href="#" className="social-link"><Twitter size={20} /></a>
                            <a href="#" className="social-link"><Instagram size={20} /></a>
                            <a href="#" className="social-link"><Facebook size={20} /></a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Space Academy. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
