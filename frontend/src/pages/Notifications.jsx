import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle2, Navigation, ArrowLeft } from 'lucide-react';

const Notifications = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        const storedUser = localStorage.getItem('chilli_user');
        if (!storedUser) {
            navigate('/login');
            return;
        }

        const user = JSON.parse(storedUser);

        const fetchNotifications = async () => {
            try {
                const res = await fetch(`/api/users/${user.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setNotifications((data.notifications || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
                }
            } catch (err) {
                console.error('Failed to fetch notifications', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotifications();
    }, [navigate]);

    const handleMarkRead = async () => {
        const storedUser = localStorage.getItem('chilli_user');
        if (!storedUser) return;
        const user = JSON.parse(storedUser);

        try {
            await fetch(`/api/users/${user.id}/notifications/read`, { method: 'PUT' });
            setNotifications(notifications.map(n => ({ ...n, read: true })));

            // Dispatch event to update navbar unread count if we had a global state, but relying on fetch interval in Navbar is fine
        } catch (e) {
            console.error(e);
        }
    };

    const handleNotificationClick = (n) => {
        if (!n.read) {
            // We could optionally mark individual as read here, but mark all read is sufficient
        }
        if (n.link) {
            navigate(n.link);
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-primary-600 mb-6 font-semibold transition-colors w-max"
                >
                    <ArrowLeft className="w-5 h-5" /> Back
                </button>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-slide-up">
                    <div className="p-6 sm:p-8 flex items-center justify-between border-b border-gray-100">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                            <Bell className="w-8 h-8 text-primary-500" />
                            Notifications
                        </h1>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkRead}
                                className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-xl font-bold transition-colors text-sm"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                <span className="hidden sm:inline">Mark all read</span>
                                <span className="sm:hidden">Read all</span>
                            </button>
                        )}
                    </div>

                    <div className="divide-y divide-gray-50">
                        {isLoading ? (
                            <div className="p-12 text-center text-gray-400">Loading notifications...</div>
                        ) : notifications.length > 0 ? (
                            notifications.map(n => (
                                <div
                                    key={n._id}
                                    onClick={() => handleNotificationClick(n)}
                                    className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer group flex gap-4 ${!n.read ? 'bg-primary-50/20' : ''}`}
                                >
                                    <div className="shrink-0 mt-1">
                                        {!n.read ? (
                                            <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                                        ) : (
                                            <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start gap-4">
                                            <p className={`text-base sm:text-lg text-gray-900 leading-tight ${!n.read ? 'font-bold' : 'font-medium'}`}>
                                                {n.message}
                                            </p>
                                            {n.link && <Navigation className="w-4 h-4 text-gray-300 group-hover:text-primary-400 transition-colors shrink-0" />}
                                        </div>

                                        {n.reason && (
                                            <div className="mt-3 p-3 bg-rose-50 border border-rose-100 rounded-xl">
                                                <p className="text-sm text-rose-600 font-medium italic">Reason: {n.reason}</p>
                                            </div>
                                        )}

                                        <p className="text-xs text-gray-400 mt-2 font-semibold uppercase tracking-wider">
                                            {new Date(n.createdAt).toLocaleString(undefined, {
                                                year: 'numeric', month: 'short', day: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-16 text-center text-gray-500 flex flex-col items-center gap-4">
                                <div className="p-4 bg-gray-50 rounded-full">
                                    <Bell className="w-10 h-10 text-gray-300" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">Up to date!</h3>
                                    <p className="text-sm">You have no new notifications.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notifications;
