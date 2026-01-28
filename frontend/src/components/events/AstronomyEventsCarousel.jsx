import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, ChevronLeft, ChevronRight, Telescope, Hash, Globe, Activity } from 'lucide-react';
import './AstronomyEventsCarousel.css';

const AstronomyEventsCarousel = ({ events, onEventClick }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const duration = 5000; // 5 seconds per slide

    useEffect(() => {
        if (!events || events.length === 0) return;

        const startTime = Date.now();
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const newProgress = (elapsed % duration) / duration * 100;
            setProgress(newProgress);

            if (elapsed >= duration) {
                // This logic is simplified; actually easier to just use a separate interval for index
            }
        }, 50);

        const slideInterval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % events.length);
            setProgress(0); // Reset visual progress
        }, duration);

        return () => {
            clearInterval(interval);
            clearInterval(slideInterval);
        };
    }, [events, currentIndex]); // Reset on index change to sync

    if (!events || events.length === 0) return null;

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % events.length);
        setProgress(0);
    };
    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
        setProgress(0);
    };

    const currentEvent = events[currentIndex];

    // Animation Variants
    const slideVariants = {
        hidden: { opacity: 0, scale: 1.1 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.8 } },
        exit: { opacity: 0, transition: { duration: 0.5 } }
    };

    const contentVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.6 } }
    };

    return (
        <div className="astro-carousel-container">
            <h2 className="astro-carousel-title">
                <Telescope className="mr-2 text-cyan-400" />
                <span className="tracking-wider">ASTRONOMY</span>
                <span className="text-gradient ml-2">INTEL</span>
            </h2>

            <div className="astro-carousel-wrapper">
                {/* HUD Overlay Elements */}
                <div className="hud-corner top-left"></div>
                <div className="hud-corner top-right"></div>
                <div className="hud-corner bottom-left"></div>
                <div className="hud-corner bottom-right"></div>
                <div className="hud-line top"></div>
                <div className="hud-line bottom"></div>

                <div className="hud-data top-right-data">
                    <div className="data-row"><Activity size={12} className="text-cyan-400 animate-pulse" /> SYS.MONITORING</div>
                    <div className="data-row"><Globe size={12} className="text-cyan-400" /> COORDS. {34.05 + currentIndex}N, {118.24 + currentIndex}W</div>
                </div>

                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentIndex}
                        variants={slideVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="astro-slide cursor-pointer" // Added cursor-pointer
                        onClick={() => onEventClick && onEventClick(currentEvent)} // Added Click Handler
                        style={{
                            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%), url(${currentEvent.image || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072'})`
                        }}
                    >
                        <motion.div
                            className="astro-slide-content"
                            variants={contentVariants}
                        >
                            <div className="event-tag">
                                <Hash size={12} /> EVENT_ID: {currentEvent.id.toString().padStart(4, '0')}
                            </div>
                            <h3 className="astro-event-title">{currentEvent.title}</h3>
                            <p className="astro-event-desc">{currentEvent.description?.substring(0, 180)}...</p>

                            <div className="astro-event-meta-grid">
                                <div className="meta-box">
                                    <span className="meta-label">DATE_TIME</span>
                                    <span className="meta-value white"><Calendar size={14} /> {new Date(currentEvent.date_time).toLocaleDateString()}</span>
                                </div>
                                {currentEvent.location && (
                                    <div className="meta-box">
                                        <span className="meta-label">SECTOR</span>
                                        <span className="meta-value cyan"><MapPin size={14} /> {currentEvent.location}</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>

                {/* Controls */}
                <div className="carousel-controls" onClick={(e) => e.stopPropagation()}>
                    <button className="control-btn" onClick={prevSlide}><ChevronLeft size={20} /></button>

                    <div className="progress-container">
                        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                    </div>

                    <div className="slide-counter">
                        {String(currentIndex + 1).padStart(2, '0')} / {String(events.length).padStart(2, '0')}
                    </div>

                    <button className="control-btn" onClick={nextSlide}><ChevronRight size={20} /></button>
                </div>
            </div>
        </div>
    );
};

export default AstronomyEventsCarousel;
