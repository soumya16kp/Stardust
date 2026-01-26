import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Rocket, Menu, X } from 'lucide-react';
import Button from '../ui/Button';
import NotificationBell from '../social/NotificationBell';
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <nav className="navbar">
            <div className="container navbar-content">
                <Link to="/" className="logo-container" onClick={closeMenu}>
                    <Rocket className="logo-icon" size={32} />
                    <span>GALACTIC</span>
                </Link>

                {/* Desktop Links */}
                <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
                    <li>
                        <Link to="/" className={`nav-link ${isActive('/')}`} onClick={closeMenu}>Home</Link>
                    </li>
                    <li>
                        <Link to="/about" className={`nav-link ${isActive('/about')}`} onClick={closeMenu}>About</Link>
                    </li>
                    <li>
                        <Link to="/programs" className={`nav-link ${isActive('/programs')}`} onClick={closeMenu}>Programs</Link>
                    </li>
                    <li>
                        <Link to="/events" className={`nav-link ${isActive('/events')}`} onClick={closeMenu}>Events</Link>
                    </li>
                    <li>
                        <Link to="/social" className={`nav-link ${isActive('/social')}`} onClick={closeMenu}>Social</Link>
                    </li>
                    {/* Mobile Only CTA if needed, but keeping simple for now */}
                </ul>

                <div className="nav-actions">
                    <NotificationBell />
                    <Link to="/register">
                        <Button variant="primary">Join Mission</Button>
                    </Link> {/* TODO: Might want to hide this on mobile if space is tight */}

                    <button className="mobile-toggle" onClick={toggleMenu}>
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
