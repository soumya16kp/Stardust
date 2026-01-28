import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { Rocket, Menu, X } from 'lucide-react';
import Button from '../ui/Button';
import NotificationBell from '../social/NotificationBell';
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const { isAuthenticated } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    const handleLogout = () => {
        if (window.confirm("Confirm Eject sequence?")) {
            dispatch(logout());
            closeMenu();
        }
    };

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
                    {isAuthenticated && (
                        <li className="mobile-only-link">
                            <button onClick={handleLogout} className="nav-link" style={{ color: '#f43f5e', textAlign: 'left', background: 'none', border: 'none', font: 'inherit', cursor: 'pointer' }}>Eject</button>
                        </li>
                    )}
                </ul>

                <div className="nav-actions">
                    <NotificationBell />

                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard">
                                <Button variant="primary">Dashboard</Button>
                            </Link>
                            <Button variant="secondary" onClick={handleLogout} style={{ marginLeft: '8px', color: '#f43f5e', borderColor: 'rgba(244, 63, 94, 0.3)' }} className="desktop-eject">
                                Eject
                            </Button>
                        </>
                    ) : (
                        <Link to="/login">
                            <Button variant="primary">Join Mission</Button>
                        </Link>
                    )}

                    <button className="mobile-toggle" onClick={toggleMenu}>
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
