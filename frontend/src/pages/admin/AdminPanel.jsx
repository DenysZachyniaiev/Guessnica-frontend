import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function AdminPanel() {
    const [riddleStats, setRiddleStats] = useState([]);
    const [userStats, setUserStats] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const [activeTab, setActiveTab] = useState('riddles');

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082';
    const { t } = useTranslation();

    useEffect(() => {
        const isDark = document.documentElement.classList.contains('dark');
        setDarkMode(isDark);

        const observer = new MutationObserver(() => {
            const isDark = document.documentElement.classList.contains('dark');
            setDarkMode(isDark);
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        fetchAdminData();

        return () => observer.disconnect();
    }, []);

    async function fetchAdminData() {
        try {
            const token = localStorage.getItem('jwt');
            if (!token) {
                setError(t('admin.noAuthTokenFound'));
                setLoading(false);
                return;
            }

            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            // Fetch riddle stats
            try {
                const riddlesRes = await fetch(`${API_BASE_URL}/admin/riddles/stats`, { headers });
                if (riddlesRes.ok) {
                    const contentType = riddlesRes.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        const data = await riddlesRes.json();
                        setRiddleStats(Array.isArray(data) ? data : []);
                    }
                } else {
                    // Mock data if endpoint fails
                    setRiddleStats([
                        {
                            riddleId: 1,
                            description: 'Eiffel Tower Challenge',
                            shortDescription: 'Paris, France',
                            timesAnswered: 145,
                            avgScore: 425,
                            avgDistanceMeters: 1200,
                            avgTimeSeconds: 45
                        },
                        {
                            riddleId: 2,
                            description: 'Statue of Liberty',
                            shortDescription: 'New York, USA',
                            timesAnswered: 132,
                            avgScore: 380,
                            avgDistanceMeters: 1800,
                            avgTimeSeconds: 52
                        }
                    ]);
                }
            } catch (err) {
                console.error('Riddle stats error:', err);
            }

            // Fetch user stats
            try {
                const usersRes = await fetch(`${API_BASE_URL}/admin/users/stats`, { headers });
                if (usersRes.ok) {
                    const contentType = usersRes.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        const data = await usersRes.json();
                        setUserStats(Array.isArray(data) ? data : []);
                    }
                } else {
                    // Mock data if endpoint fails
                    setUserStats([
                        {
                            userId: 1,
                            displayName: 'GeoMaster',
                            riddlesAnswered: 45,
                            totalScore: 18500,
                            averageScore: 411
                        },
                        {
                            userId: 2,
                            displayName: 'WorldExplorer',
                            riddlesAnswered: 38,
                            totalScore: 15200,
                            averageScore: 400
                        }
                    ]);
                }
            } catch (err) {
                console.error('User stats error:', err);
            }

            // Fetch submissions
            try {
                const subsRes = await fetch(`${API_BASE_URL}/admin/submissions`, { headers });
                if (subsRes.ok) {
                    const contentType = subsRes.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        const data = await subsRes.json();
                        setSubmissions(Array.isArray(data) ? data : []);
                    }
                } else {
                    // Mock data if endpoint fails
                    setSubmissions([
                        {
                            displayName: 'GeoMaster',
                            riddleId: 1,
                            submittedLatitude: 48.8584,
                            submittedLongitude: 2.2945,
                            distanceMeters: 850,
                            timeSeconds: 42,
                            score: 450
                        },
                        {
                            displayName: 'WorldExplorer',
                            riddleId: 1,
                            submittedLatitude: 48.8600,
                            submittedLongitude: 2.2900,
                            distanceMeters: 1200,
                            timeSeconds: 55,
                            score: 380
                        }
                    ]);
                }
            } catch (err) {
                console.error('Submissions error:', err);
            }

        } catch (err) {
            console.error('Admin fetch error:', err);
            setError(t('admin.fetchDataFailed'));
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
                darkMode
                    ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900'
                    : 'bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50'
            }`}>
                <div className={`text-center text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('admin.loading')}
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen transition-colors duration-300 ${
            darkMode
                ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900'
                : 'bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50'
        }`}>
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <h1 className={`text-5xl md:text-6xl font-black mb-4 transition-colors duration-300 ${
                            darkMode
                                ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400'
                                : 'text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600'
                        }`}>
                            {t('admin.title')}
                        </h1>
                        <p className={`text-lg transition-colors duration-300 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                            {t('admin.subtitle')}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border-2 border-red-500 text-red-600 text-center font-medium">
                            {error}
                        </div>
                    )}

                    {/* Stats Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className={`p-6 rounded-2xl transition-all duration-300 ${
                            darkMode
                                ? 'bg-gray-800/50 border-2 border-gray-700'
                                : 'bg-white border-2 border-gray-200 shadow-xl'
                        }`}>
                            <div className="text-4xl mb-3">🎯</div>
                            <div className={`text-3xl font-black mb-2 bg-gradient-to-r ${
                                darkMode ? 'from-blue-400 to-cyan-400' : 'from-sky-600 to-blue-600'
                            } bg-clip-text text-transparent`}>
                                {riddleStats.length}
                            </div>
                            <div className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {t('admin.activeRiddles')}
                            </div>
                        </div>

                        <div className={`p-6 rounded-2xl transition-all duration-300 ${
                            darkMode
                                ? 'bg-gray-800/50 border-2 border-gray-700'
                                : 'bg-white border-2 border-gray-200 shadow-xl'
                        }`}>
                            <div className="text-4xl mb-3">👥</div>
                            <div className={`text-3xl font-black mb-2 bg-gradient-to-r ${
                                darkMode ? 'from-green-400 to-emerald-400' : 'from-green-600 to-emerald-600'
                            } bg-clip-text text-transparent`}>
                                {userStats.length}
                            </div>
                            <div className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {t('admin.activeUsers')}
                            </div>
                        </div>

                        <div className={`p-6 rounded-2xl transition-all duration-300 ${
                            darkMode
                                ? 'bg-gray-800/50 border-2 border-gray-700'
                                : 'bg-white border-2 border-gray-200 shadow-xl'
                        }`}>
                            <div className="text-4xl mb-3">📝</div>
                            <div className={`text-3xl font-black mb-2 bg-gradient-to-r ${
                                darkMode ? 'from-purple-400 to-pink-400' : 'from-purple-600 to-pink-600'
                            } bg-clip-text text-transparent`}>
                                {submissions.length}
                            </div>
                            <div className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {t('admin.totalSubmissions')}
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className={`flex flex-wrap gap-2 mb-8 p-2 rounded-2xl ${
                        darkMode ? 'bg-gray-800/50' : 'bg-white/50'
                    }`}>
                        {['riddles', 'users', 'submissions'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 min-w-[140px] py-3 px-6 rounded-xl font-bold text-sm transition-all duration-300 ${
                                    activeTab === tab
                                        ? darkMode
                                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg scale-105'
                                            : 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-lg scale-105'
                                        : darkMode
                                            ? 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                                }`}
                            >
                                {tab === 'riddles' && t('admin.riddleStatsTab')}
                                {tab === 'users' && t('admin.userStatsTab')}
                                {tab === 'submissions' && t('admin.submissionsTab')}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'riddles' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {riddleStats.map((riddle) => (
                                <div
                                    key={riddle.riddleId}
                                    className={`p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                                        darkMode
                                            ? 'bg-gray-800/50 border-2 border-gray-700 hover:border-blue-600'
                                            : 'bg-white border-2 border-gray-200 hover:border-sky-400 shadow-lg'
                                    }`}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className={`text-xl font-black mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {riddle.description}
                                            </h3>
                                            <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                📍 {riddle.shortDescription}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            darkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-sky-100 text-sky-700'
                                        }`}>
                                            #{riddle.riddleId}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                                            <div className={`text-lg font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {riddle.timesAnswered}
                                            </div>
                                            <div className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {t('admin.answers')}
                                            </div>
                                        </div>
                                        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                                            <div className={`text-lg font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {Math.round(riddle.avgScore)}
                                            </div>
                                            <div className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {t('admin.avgScore')}
                                            </div>
                                        </div>
                                        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                                            <div className={`text-lg font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {Math.round(riddle.avgDistanceMeters)}m
                                            </div>
                                            <div className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {t('admin.avgDistance')}
                                            </div>
                                        </div>
                                        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                                            <div className={`text-lg font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {Math.round(riddle.avgTimeSeconds)}s
                                            </div>
                                            <div className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {t('admin.avgTime')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {userStats.map((user) => (
                                <div
                                    key={user.userId}
                                    className={`p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                                        darkMode
                                            ? 'bg-gray-800/50 border-2 border-gray-700 hover:border-blue-600'
                                            : 'bg-white border-2 border-gray-200 hover:border-sky-400 shadow-lg'
                                    }`}
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black bg-gradient-to-br ${
                                            darkMode ? 'from-blue-600 to-cyan-600' : 'from-sky-600 to-blue-600'
                                        } text-white shadow-lg`}>
                                            {user.displayName.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {user.displayName}
                                            </h3>
                                            <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {t('admin.userId')}: {user.userId}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                                            <div className={`text-lg font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {user.riddlesAnswered}
                                            </div>
                                            <div className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {t('admin.riddles')}
                                            </div>
                                        </div>
                                        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                                            <div className={`text-lg font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {user.totalScore}
                                            </div>
                                            <div className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {t('admin.total')}
                                            </div>
                                        </div>
                                        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                                            <div className={`text-lg font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {Math.round(user.averageScore)}
                                            </div>
                                            <div className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {t('admin.average')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'submissions' && (
                        <div className={`rounded-2xl overflow-hidden transition-colors duration-300 ${
                            darkMode
                                ? 'bg-gray-800/50 border-2 border-gray-700'
                                : 'bg-white border-2 border-gray-200 shadow-xl'
                        }`}>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className={darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}>
                                    <tr>
                                        {[t('admin.user'), t('admin.riddle'), t('admin.latitude'), t('admin.longitude'), t('admin.distance'), t('admin.time'), t('admin.score')].map((header) => (
                                            <th key={header} className={`px-6 py-4 text-left text-xs font-black uppercase tracking-wider ${
                                                darkMode ? 'text-gray-400' : 'text-gray-600'
                                            }`}>
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                    {submissions.map((sub, idx) => (
                                        <tr key={idx} className={`transition-colors ${
                                            darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                                        }`}>
                                            <td className={`px-6 py-4 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {sub.displayName}
                                            </td>
                                            <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                #{sub.riddleId}
                                            </td>
                                            <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {sub.submittedLatitude.toFixed(4)}
                                            </td>
                                            <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {sub.submittedLongitude.toFixed(4)}
                                            </td>
                                            <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {Math.round(sub.distanceMeters)}
                                            </td>
                                            <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {Math.round(sub.timeSeconds)}
                                            </td>
                                            <td className={`px-6 py-4 text-sm font-bold ${darkMode ? 'text-cyan-400' : 'text-sky-600'}`}>
                                                {Math.round(sub.score)}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}