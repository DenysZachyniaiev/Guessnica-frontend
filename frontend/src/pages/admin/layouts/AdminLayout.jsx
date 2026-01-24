import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

export default function AdminLayout() {
    const [darkMode, setDarkMode] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const isDark = document.documentElement.classList.contains('dark');
        setDarkMode(isDark);
        const observer = new MutationObserver(() => {
            const isDark = document.documentElement.classList.contains('dark');
            setDarkMode(isDark);
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    const menuItems = [
        { path: '/admin', label: 'Dashboard' },
        { path: '/admin/riddles', label: 'Riddles' },
        { path: '/admin/locations', label: 'Locations' },
        { path: '/admin/users', label: 'Users' },
        { path: '/admin/stats', label: 'Statistics' },
        { path: '/admin/settings', label: 'Settings' }
    ];

    const isActive = (path) => {
        if (path === '/admin') {
            return location.pathname === '/admin';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900' : 'bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50'}`}>
            <div className="flex">
                {/* Sidebar */}
                <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 min-h-screen sticky top-0 ${darkMode ? 'bg-gray-800/50 border-r-2 border-gray-700' : 'bg-white/50 border-r-2 border-gray-200'} backdrop-blur-lg`}>
                    <div className="p-6">
                        {/* Toggle Button */}
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`mb-6 p-3 rounded-xl transition-all duration-300 hover:scale-110 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isSidebarOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                )}
                            </svg>
                        </button>
                        {/* Logo/Title */}
                        {isSidebarOpen && (
                            <div className="mb-8">
                                <h2 className={`text-2xl font-black bg-gradient-to-r ${darkMode ? 'from-blue-400 to-cyan-400' : 'from-sky-600 to-blue-600'} bg-clip-text text-transparent`}> 👑 Admin Panel </h2>
                            </div>
                        )}
                        {/* Menu Items */}
                        <nav className="space-y-2">
                            {menuItems.map((item) => (
                                <button key={item.path} onClick={() => navigate(item.path)} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${isActive(item.path) ? darkMode ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg' : 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-lg' : darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'} ${isSidebarOpen ? '' : 'justify-center'}`}>
                                    <span className="text-xl">{item.icon}</span>
                                    {isSidebarOpen && (
                                        <span className="font-bold text-sm">{item.label}</span>
                                    )}
                                </button>
                            ))}
                        </nav>
                        {/* Back to App */}
                        {isSidebarOpen && (
                            <div className="mt-8 pt-8 border-t-2 border-gray-700">
                                <button onClick={() => navigate('/user-panel')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>
                                    <span className="font-bold text-sm">Back to App</span>
                                </button>
                            </div>
                        )}
                    </div>
                </aside>
                {/* Main Content */}
                <main className={`flex-1 ${isSidebarOpen ? 'ml-0' : 'ml-0'}`}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}