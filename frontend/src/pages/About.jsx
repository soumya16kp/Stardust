import React, { useEffect, useRef } from 'react';
import {
    Users, Globe, Heart, Zap, Target, Rocket,
    Sparkles, Star, Compass, Brain, Microscope,
    Award, TrendingUp, Shield, Cpu, Satellite
} from 'lucide-react';
import './About.css';

const team = [
    {
        name: 'Jason Michaud',
        role: 'Founder & CEO',
        bio: 'From a remote Canadian village to leading a global space movement. Empowering dreamers to access the space industry.',
        icon: <Rocket size={20} />,
        color: '#06b6d4',
        stats: ['80+ Microgravity Flights', 'Global Community Leader', 'Space Policy Expert']
    },
    {
        name: 'Shinul Paul',
        role: 'Chief Operating Officer',
        bio: 'Aerospace Engineer & Astrophysicist bridging hard science with human progress.',
        icon: <Satellite size={20} />,
        color: '#8b5cf6',
        stats: ['Space Systems Architect', 'UAV/RPAS Specialist', 'STEM Education Advocate']
    },
    {
        name: 'Dr. Joshua Chou',
        role: 'Chief Science Officer',
        bio: 'Pioneering regenerative medicine and space biotech. Unlocking stem cell potential in microgravity.',
        icon: <Microscope size={20} />,
        color: '#10b981',
        stats: ['Harvard Researcher', 'Cell Journal Author', 'Space Medicine Pioneer']
    },
    {
        name: 'Edward Gonzales',
        role: 'DEIA Lead',
        bio: 'NASA Leader championing diversity and inspiring the next generation.',
        icon: <Users size={20} />,
        color: '#f59e0b',
        stats: ['NASA DEIA Lead', 'Permission to Dream', 'Next-Gen Workforce']
    },
    {
        name: 'Zain Tawana',
        role: 'Global Impact Strategy',
        bio: 'Innovator at the crossroads of psychology, immersive tech, and astronaut training.',
        icon: <Brain size={20} />,
        color: '#ec4899',
        stats: ['Space Psychology', 'Immersive Tech', 'Consciousness Research']
    },
    {
        name: 'Andrea Prazakova',
        role: 'Human-Centered AI',
        bio: 'Future-proofing the space economy through AI upskilling and longevity science.',
        icon: <Cpu size={20} />,
        color: '#3b82f6',
        stats: ['AI Strategist', 'Longevity Science', 'TEDx Speaker']
    }
];

const values = [
    {
        title: 'Democratizing Space',
        description: 'Making space accessible to dreamers everywhere, regardless of background or geography.',
        icon: <Globe className="value-icon" />,
        color: '#06b6d4'
    },
    {
        title: 'Humanity First',
        description: 'Prioritizing human health, diversity, and well-being in our journey to the stars.',
        icon: <Heart className="value-icon" />,
        color: '#ef4444'
    },
    {
        title: 'Innovation Frontier',
        description: 'Pushing boundaries in space technology, medicine, and sustainable exploration.',
        icon: <Zap className="value-icon" />,
        color: '#f59e0b'
    },
    {
        title: 'Global Community',
        description: 'Building a worldwide network of educators, students, and space enthusiasts.',
        icon: <Users className="value-icon" />,
        color: '#10b981'
    }
];

const milestones = [
    { year: '2021', event: 'Stardust Founded', icon: '🚀' },
    { year: '2022', event: 'First 10k Members', icon: '👥' },
    { year: '2023', event: '50+ Countries Reached', icon: '🌍' },
    { year: '2024', event: 'Space Medicine Research', icon: '🧪' },
    { year: '2025', event: '100k+ Community', icon: '🌟' }
];

const About = () => {
    const heroRef = useRef(null);
    const statsRef = useRef(null);

    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <div className="about-container">
            {/* Animated Background Elements */}
            <div className="space-bg">
                <div className="star-field"></div>
                <div className="nebula nebula-1"></div>
                <div className="nebula nebula-2"></div>
            </div>

            {/* Hero Section */}
            <section className="hero-section" ref={heroRef}>
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-badge">
                            <Sparkles size={16} />
                            <span>Stardust Odyssey</span>
                        </div>
                        <h1 className="hero-title">
                            Space Belongs to <span className="gradient-text">All of Us</span>
                        </h1>
                        <p className="hero-subtitle">
                            We are uniting dreamers, educators, and innovators to build a future
                            that belongs to everyone, everywhere.
                        </p>
                        <div className="hero-stats">
                            <div className="stat">
                                <div className="stat-number">100k+</div>
                                <div className="stat-label">Community Members</div>
                            </div>
                            <div className="stat">
                                <div className="stat-number">50+</div>
                                <div className="stat-label">Countries</div>
                            </div>
                            <div className="stat">
                                <div className="stat-number">1k+</div>
                                <div className="stat-label">Global Educators</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Origin Story */}
            <section className="origin-section">
                <div className="container">
                    <div className="section-header animate-on-scroll">
                        <span className="section-subtitle">Our Journey</span>
                        <h2 className="section-title">From a Spark to a Movement</h2>
                    </div>

                    <div className="origin-grid">
                        <div className="origin-content animate-on-scroll">
                            <div className="quote-mark">"</div>
                            <p className="origin-text">
                                Stardust was born from a simple belief: that space should belong to all of us.
                                Our founder, Jason Michaud, grew up in a remote village where opportunities
                                felt distant, yet the stars were always close.
                            </p>
                            <p className="origin-text">
                                He proved that even from the most unlikely places, dreams can launch.
                                Today, we are democratizing the cosmos for everyone.
                            </p>
                            <div className="origin-highlight">
                                <Target size={24} />
                                <div>
                                    <h4>Our Mission</h4>
                                    <p>To create universal access to space exploration and education</p>
                                </div>
                            </div>
                        </div>

                        <div className="origin-visual animate-on-scroll">
                            <div className="milestone-timeline">
                                {milestones.map((milestone, index) => (
                                    <div key={index} className="milestone">
                                        <div className="milestone-icon">{milestone.icon}</div>
                                        <div className="milestone-content">
                                            <div className="milestone-year">{milestone.year}</div>
                                            <div className="milestone-event">{milestone.event}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="values-section">
                <div className="container">
                    <div className="section-header center animate-on-scroll">
                        <span className="section-subtitle">Our Philosophy</span>
                        <h2 className="section-title">The Pillars of Our Vision</h2>
                    </div>

                    <div className="values-grid">
                        {values.map((value, index) => (
                            <div
                                key={index}
                                className="value-card animate-on-scroll"
                                style={{ '--delay': index * 0.1 }}
                            >
                                <div className="value-icon-wrapper" style={{ backgroundColor: `${value.color}20` }}>
                                    <div className="value-icon-inner" style={{ color: value.color }}>
                                        {value.icon}
                                    </div>
                                </div>
                                <h3>{value.title}</h3>
                                <p>{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Visionary Section */}
            <section className="visionary-section">
                <div className="container">
                    <div className="visionary-grid">
                        <div className="visionary-content animate-on-scroll">
                            <div className="section-header">
                                <span className="section-subtitle">The Future We See</span>
                                <h2 className="section-title">A Multi-Planetary Humanity</h2>
                            </div>

                            <div className="visionary-points">
                                <div className="visionary-point">
                                    <div className="point-icon">
                                        <Globe size={24} />
                                    </div>
                                    <div>
                                        <h4>Global Access</h4>
                                        <p>Opening the space industry to dreamers everywhere, breaking down barriers of geography and privilege.</p>
                                    </div>
                                </div>

                                <div className="visionary-point">
                                    <div className="point-icon">
                                        <Heart size={24} />
                                    </div>
                                    <div>
                                        <h4>Space Health</h4>
                                        <p>Pioneering regenerative medicine and biotech solutions for human resilience beyond Earth.</p>
                                    </div>
                                </div>

                                <div className="visionary-point">
                                    <div className="point-icon">
                                        <Users size={24} />
                                    </div>
                                    <div>
                                        <h4>Inclusive Future</h4>
                                        <p>Ensuring the space future reflects the full diversity and potential of all humanity.</p>
                                    </div>
                                </div>

                                <div className="visionary-point">
                                    <div className="point-icon">
                                        <TrendingUp size={24} />
                                    </div>
                                    <div>
                                        <h4>Sustainable Growth</h4>
                                        <p>Building a space economy that benefits both Earth and our extraterrestrial communities.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="visionary-visual animate-on-scroll">
                            <div className="galaxy-sphere">
                                <div className="sphere-inner">
                                    <div className="orbit orbit-1">
                                        <Star size={12} />
                                    </div>
                                    <div className="orbit orbit-2">
                                        <Star size={10} />
                                    </div>
                                    <div className="orbit orbit-3">
                                        <Star size={8} />
                                    </div>
                                    <div className="central-star">
                                        <Sparkles size={32} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="team-section" ref={statsRef}>
                <div className="container">
                    <div className="section-header center animate-on-scroll">
                        <span className="section-subtitle">Meet the Architects</span>
                        <h2 className="section-title">The Visionaries Leading Our Journey</h2>
                    </div>

                    <div className="team-grid">
                        {team.map((member, index) => (
                            <div
                                key={index}
                                className="team-card animate-on-scroll"
                                style={{ '--delay': index * 0.1 }}
                            >
                                <div className="card-glow" style={{ backgroundColor: member.color }}></div>
                                <div className="team-card-header">
                                    <div className="avatar-wrapper">
                                        <div
                                            className="member-avatar"
                                            style={{
                                                background: `linear-gradient(135deg, ${member.color}40, ${member.color}10)`,
                                                borderColor: member.color
                                            }}
                                        >
                                            {member.icon}
                                        </div>
                                        <div className="avatar-ring" style={{ borderColor: member.color }}></div>
                                    </div>
                                    <div className="member-info">
                                        <h3>{member.name}</h3>
                                        <span className="member-role">{member.role}</span>
                                    </div>
                                </div>

                                <p className="member-bio">{member.bio}</p>

                                <div className="member-stats">
                                    {member.stats.map((stat, statIndex) => (
                                        <span key={statIndex} className="stat-tag">
                                            {stat}
                                        </span>
                                    ))}
                                </div>

                                <div className="card-footer">
                                    <button className="connect-btn">
                                        <span>Connect</span>
                                        <Compass size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content animate-on-scroll">
                        <div className="cta-icon">
                            <Rocket size={48} />
                        </div>
                        <h2>Ready to Join the Odyssey?</h2>
                        <p>Be part of the movement that's shaping humanity's future among the stars.</p>
                        <div className="cta-buttons">
                            <button className="cta-btn primary">
                                <span>Start Your Journey</span>
                                <Sparkles size={16} />
                            </button>
                            <button className="cta-btn secondary">
                                <span>Explore Programs</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;