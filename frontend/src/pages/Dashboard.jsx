import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import './Dashboard.css';

const myPrograms = [{ title: 'Rocket Science 101', progress: 75 }, { title: 'Mars Survival', progress: 30 }];

const Dashboard = () => {
    return (
        <div className="dashboard-page section-padding">
            <div className="container">
                <h1 className="mb-4">Welcome, <span className="text-gradient">Commander</span></h1>
                <div className="dashboard-stats">
                    <div className="stat-box"><div className="stat-num">2</div><div>Courses</div></div>
                    <div className="stat-box"><div className="stat-num">Rank 4</div><div>Level</div></div>
                </div>
                <section className="progress-section">
                    <h3>Current Mission</h3>
                    <div className="programs-grid">
                        {myPrograms.map((p, i) => (
                            <Card key={i}><div className="card-content"><h3>{p.title}</h3><div className="progress-bar"><div className="progress-fill" style={{ width: `${p.progress}%` }}></div></div></div></Card>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};
export default Dashboard;
