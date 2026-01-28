import React from 'react';
import { Clock, Users, ArrowRight, Video, Trophy, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import '../../pages/Programs.css';

const ProgramCard = ({ program }) => {
    const { title, slug, program_type, difficulty, instructor, duration, image_url, is_live } = program;

    const getIcon = () => {
        switch (program_type) {
            case 'webinar': return <Video size={18} />;
            case 'hackathon': return <Trophy size={18} />;
            default: return <BookOpen size={18} />;
        }
    };

    return (
        <div className={`program-card ${program_type}`}>
            <div className="card-image-container">
                {image_url ? (
                    <img src={image_url} alt={title} className="card-image" />
                ) : (
                    <div className={`card-placeholder ${program_type}`} />
                )}
                <div className="card-badges">
                    <span className={`badge type-badge ${program_type}`}>
                        {getIcon()} {program_type}
                    </span>
                    {is_live && <span className="badge live-badge">● LIVE</span>}
                </div>
            </div>

            <div className="card-content">
                <div className="card-meta">
                    <span className={`difficulty ${difficulty}`}>{difficulty}</span>
                    <span className="duration"><Clock size={14} /> {duration}</span>
                </div>

                <h3 className="card-title">{title}</h3>
                <p className="card-instructor">Command: {instructor}</p>

                <div className="card-footer">
                    <Link to={`/programs/${slug}`}>
                        <Button variant="secondary" className="w-full">
                            View Mission <ArrowRight size={16} className="ml-2" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProgramCard;
