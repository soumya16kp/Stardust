import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Rocket } from 'lucide-react';
import './Auth.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(login({ username, password }));
        if (login.fulfilled.match(result)) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="auth-page section-padding">
            <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
                <Card className="auth-card">
                    <div className="card-content text-center">
                        <Rocket size={40} className="text-gradient mb-4 mx-auto" style={{ display: 'block' }} />
                        <h2 className="mb-4">Internal Access</h2>
                        {error && <p className="text-red-500 mb-2">{error.detail || 'Login failed'}</p>}
                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label>Username</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    className="input-field"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" variant="primary" style={{ width: '100%' }} disabled={loading}>
                                {loading ? 'Initializing...' : 'Initiate Sequence'}
                            </Button>
                        </form>
                    </div>
                </Card>
            </div>
        </div>
    );
};
export default Login;
