import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Rocket } from 'lucide-react';
import './Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(register(formData));
        if (register.fulfilled.match(result)) {
            navigate('/login');
        }
    };

    return (
        <div className="auth-page section-padding">
            <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
                <Card className="auth-card">
                    <div className="card-content text-center">
                        <Rocket size={40} className="text-gradient mb-4 mx-auto" style={{ display: 'block' }} />
                        <h2 className="mb-4">New Personnel</h2>
                        {error && <p style={{ color: 'var(--error)' }} className="mb-2 text-sm">{error.username?.[0] || 'Registration failed'}</p>}
                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label>Username</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>
                            <div className="input-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    className="input-field"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="input-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    className="input-field"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                            <Button type="submit" variant="primary" style={{ width: '100%' }} disabled={loading}>Sign Up</Button>
                        </form>
                    </div>
                </Card>
            </div>
        </div>
    );
};
export default Register;
