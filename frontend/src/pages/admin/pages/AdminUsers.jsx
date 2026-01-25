import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        const isDark = document.documentElement.classList.contains('dark');
        setDarkMode(isDark);
        const observer = new MutationObserver(() => {
            const isDark = document.documentElement.classList.contains('dark');
            setDarkMode(isDark);
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        load();
        return () => observer.disconnect();
    }, []);

    const load = async () => {
        try {
            const response = await fetch('/admin/users/stats', { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` } });
            const data = await response.json();
            setUsers(Array.isArray(data) ? data.map(u => ({ id: u.userId, displayName: u.displayName, lockoutEnd: null, avatarUrl: '', email: 'N/A' })) : []);
        } catch (error) {
            console.error('Failed to load users:', error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-12 flex items-center justify-center">
                <div className="text-center">
                    <div className={`animate-spin rounded-full h-16 w-16 border-b-4 mx-auto mb-4 ${ darkMode ? 'border-blue-500' : 'border-sky-500' }`}></div>
                    <div className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}> {t('adminPages.loadingUsers')} </div>
                </div>
            </div>
        );
    }
    return (
        <div className="p-6 md:p-12">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className={`text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r ${ darkMode ? 'from-blue-400 to-cyan-400' : 'from-sky-600 to-blue-600' } bg-clip-text text-transparent`}> 👥 {t('adminPages.manageUsers')} </h1>
                    <p className="text-red-600">Management actions not available in backend. Showing stats only.</p>
                </div>
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className={`p-6 rounded-2xl ${ darkMode ? 'bg-gray-800/50 border-2 border-gray-700' : 'bg-white border-2 border-gray-200 shadow-xl' }`}>
                        <div className="text-3xl mb-2">👤</div>
                        <div className={`text-3xl font-black mb-1 bg-gradient-to-r ${ darkMode ? 'from-blue-400 to-cyan-400' : 'from-sky-600 to-blue-600' } bg-clip-text text-transparent`}> {users.length} </div>
                        <div className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}> {t('adminPages.totalUsers')} </div>
                    </div>
                    {/* ... other stats ... */}
                </div>
                {/* Users List */}
                <div className="space-y-4">
                    {users.map(u => (
                        <div key={u.id} className={`p-6 rounded-2xl transition-all duration-300 hover:scale-[1.01] ${ darkMode ? 'bg-gray-800/50 border-2 border-gray-700 hover:border-blue-600' : 'bg-white border-2 border-gray-200 hover:border-sky-400 shadow-xl' }`}>
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                                {/* Avatar */}
                                <div className={`w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ${ darkMode ? 'bg-gradient-to-br from-blue-600 to-cyan-600' : 'bg-gradient-to-br from-sky-600 to-blue-600' }`}>
                                    {u.avatarUrl ? (
                                        <img src={u.avatarUrl} className="w-full h-full object-cover" alt={u.displayName} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-2xl font-black text-white">
                                            {u.displayName?.charAt(0)?.toUpperCase() || '?'}
                                        </div>
                                    )}
                                </div>
                                {/* Info */}
                                <div className="flex-1">
                                    <div className={`text-xl font-black mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}> {u.displayName} </div>
                                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}> 📧 {u.email} </div>
                                    {u.lockoutEnd && (
                                        <div className={`mt-2 inline-flex px-3 py-1 rounded-full text-xs font-bold ${ darkMode ? 'bg-red-900/30 text-red-400 border-2 border-red-600' : 'bg-red-100 text-red-800 border-2 border-red-300' }`}> 🚫 {t('adminPages.blocked')} </div>
                                    )}
                                </div>
                                {/* No actions */}
                            </div>
                        </div>
                    ))}
                </div>
                {users.length === 0 && (
                    <div className={`text-center py-16 rounded-2xl ${ darkMode ? 'bg-gray-800/50 border-2 border-gray-700' : 'bg-white border-2 border-gray-200' }`}>
                        <div className="text-6xl mb-4">👥</div>
                        <div className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}> {t('adminPages.noUsersYet')} </div>
                        <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}> {t('adminPages.usersWillAppear')} </div>
                    </div>
                )}
            </div>
        </div>
    );
}