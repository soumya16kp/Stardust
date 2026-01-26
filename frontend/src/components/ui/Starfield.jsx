import React, { useEffect, useState } from 'react';
import './Starfield.css';

const Starfield = () => {
    const [stars, setStars] = useState([]);

    useEffect(() => {
        const generateStars = () => {
            const newStars = [];
            for (let i = 0; i < 50; i++) {
                newStars.push({
                    id: i,
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    size: Math.random() * 2 + 1,
                    delay: Math.random() * 5,
                    duration: Math.random() * 3 + 2,
                });
            }
            setStars(newStars);
        };
        generateStars();
    }, []);

    return (
        <div className="starfield-container">
            <div className="glowing-orb"></div>
            {stars.map(star => (
                <div
                    key={star.id}
                    className="star"
                    style={{
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        animationDelay: `${star.delay}s`,
                        animationDuration: `${star.duration}s`
                    }}
                ></div>
            ))}
        </div>
    );
};

export default Starfield;
