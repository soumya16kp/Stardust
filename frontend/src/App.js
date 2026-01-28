import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Starfield from './components/ui/Starfield';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Programs from './pages/Programs';
import ProgramDetail from './pages/ProgramDetail';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import SocialHost from './pages/SocialHost';
import Ambassador from './pages/Ambassador';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ProtectedRoute from './components/layout/ProtectedRoute';

import { EventsProvider } from './context/EventsContext';
import { ProgramsProvider } from './context/ProgramsContext';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadUser } from './store/authSlice';

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadUser());
    }, [dispatch]);

    return (
        <Router>
            <EventsProvider>
                <ProgramsProvider>
                    <div className="app-container">
                        <Starfield />
                        <Navbar />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/programs" element={<Programs />} />
                            <Route path="/programs/:slug" element={<ProgramDetail />} />
                            <Route path="/events" element={<Events />} />
                            <Route path="/events/:slug" element={<EventDetail />} />
                            <Route path="/social" element={<SocialHost />} />
                            <Route path="/ambassador" element={<Ambassador />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route element={<ProtectedRoute />}>
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/profile/:username" element={<Profile />} />
                            </Route>
                        </Routes>
                        <Footer />
                    </div>
                </ProgramsProvider>
            </EventsProvider>
        </Router>
    );
}

export default App;
