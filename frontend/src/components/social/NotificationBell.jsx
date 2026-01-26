import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { getNotifications, markNotificationRead } from '../../services/socialApi';
import './NotificationBell.css';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            const data = await getNotifications();
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.is_read).length);
        } catch (error) {
            console.error("Failed to fetch notifications");
        }
    };

    useEffect(() => {
        // Poll every 30 seconds for simplicity in MVP
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const toggleOpen = () => {
        if (!isOpen) fetchNotifications();
        setIsOpen(!isOpen);
    };

    const handleRead = async (id) => {
        try {
            await markNotificationRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="notification-bell-container">
            <button className="bell-btn" onClick={toggleOpen}>
                <Bell size={20} />
                {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="dropdown-header">Notifications</div>
                    <div className="notification-list">
                        {notifications.length === 0 ? (
                            <div className="no-notifs">No notifications</div>
                        ) : (
                            notifications.map(notif => (
                                <div
                                    key={notif.id}
                                    className={`notification-item ${!notif.is_read ? 'unread' : ''}`}
                                    onClick={() => handleRead(notif.id)}
                                >
                                    <div className="notif-content">{notif.content}</div>
                                    <div className="notif-time">{new Date(notif.created_at).toLocaleTimeString()}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
