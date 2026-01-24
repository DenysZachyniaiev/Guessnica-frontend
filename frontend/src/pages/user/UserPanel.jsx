import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserPanel() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082';

    const [userData, setUserData] = useState({
        id: '',
        email: '',
        displayName: '',
        avatarUrl: '',
        roles: [],
        createdAt: '',
        lastLogin: ''
    });

    const [userStats, setUserStats] = useState({
        totalGamesPlayed: 0,
        totalScore: 0,
        averageScore: 0,
        bestScore: 0,
        totalDistance: 0,
        averageTime: 0,
        correctGuesses: 0,
        accuracy: 0
    });

    const [gameHistory, setGameHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('overview');
    const [darkMode, setDarkMode] = useState(false);

    const navigate = useNavigate();

    const daysByRange = {
        daily: 1,
        weekly: 7,
        monthly: 30,
        alltime: 3650,
    };
    
    const avgTimeDays = daysByRange.weekly;
    const avgTimeCategory = 'AverageTime';

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

        const token = localStorage.getItem('jwt');
        if (!token) {
            console.warn('No JWT token found, redirecting to login');
            navigate('/login');
            return;
        }

        fetchUserData();
        fetchUserStats();
        fetchUserAverageTime();
        fetchGameHistory();

        return () => observer.disconnect();
    }, []);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('jwt');
            const url = `${API_BASE_URL}/users/me`;

            if (!token) {
                console.warn('No JWT token found, redirecting to login');
                navigate('/login');
                return;
            }

            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const contentType = response.headers.get('content-type');

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    console.warn('Token expired or invalid, redirecting to login');
                    setError('Authentication failed. Please login again.');
                    localStorage.removeItem('jwt');
                    localStorage.removeItem('jwt_expires');
                    navigate('/login');
                    return;
                }

                if (contentType?.includes('application/json')) {
                    const errorData = await response.json();
                    setError(errorData.message || `Server error: ${response.status}`);
                } else {
                    const errorText = await response.text();
                    console.error('Server error response:', errorText.substring(0, 200));
                    setError(`Server error: ${response.status}`);
                }
                return;
            }

            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('Expected JSON but received:', text.substring(0, 200));
                setError('Server returned invalid response format');
                return;
            }

            const data = await response.json();
            setUserData(data);
        } catch (err) {
            setError('Failed to connect to server. Please check if backend is running.');
            console.error('Fetch error:', err);
        }
    };

    /**
     * /users/me/stats
     * { assigned, answered, correct, incorrect, totalScore, avgScore, currentStreak, bestStreak, accountCreatedAt,
     *   totalDistanceMeters, avgDistanceMeters }
     */
    const fetchUserStats = async () => {
        try {
            const token = localStorage.getItem('jwt');
            if (!token) return;

            const response = await fetch(`${API_BASE_URL}/users/me/stats`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!response.ok) {
                setUserStats((prev) => ({
                    ...prev,
                    totalGamesPlayed: 25,
                    totalScore: 2500,
                    averageScore: 100,
                    bestScore: 500,
                    totalDistance: 15000,
                    averageTime: 180,
                    correctGuesses: 18,
                    accuracy: 72,
                }));
                return;
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) return;

            const data = await response.json();

            const answered = Number(data.answered ?? 0);
            const correct = Number(data.correct ?? 0);

            const totalScore = Number(data.totalScore ?? 0);
            const avgScore = Number(data.avgScore ?? 0);

            const totalDistanceMeters = Number(data.totalDistanceMeters ?? 0);

            const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0;

            setUserStats((prev) => ({
                ...prev,
                totalGamesPlayed: Number.isFinite(answered) ? answered : 0,
                totalScore: Number.isFinite(totalScore) ? totalScore : 0,
                averageScore: Number.isFinite(avgScore) ? avgScore : 0,
                bestScore: Number.isFinite(totalScore) ? totalScore : 0,
                totalDistance: Number.isFinite(totalDistanceMeters) ? totalDistanceMeters : 0,
                correctGuesses: Number.isFinite(correct) ? correct : 0,
                accuracy: Number.isFinite(accuracy) ? accuracy : 0,
            }));
        } catch (err) {
            console.error('Stats fetch error:', err);
        }
    };

    /**
     * GET /leaderboard/rank?days=7&category=AverageTime
     * -> averageTimeSeconds
     */
    const fetchUserAverageTime = async () => {
        try {
            const token = localStorage.getItem('jwt');
            if (!token) return;

            const url = `${API_BASE_URL}/leaderboard/rank?days=${avgTimeDays}&category=${encodeURIComponent(avgTimeCategory)}`;

            const response = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) return;

            const data = await response.json();
            const avgSeconds = Number(data?.averageTimeSeconds ?? 0);

            setUserStats((prev) => ({
                ...prev,
                averageTime: Number.isFinite(avgSeconds) ? avgSeconds : 0,
            }));
        } catch (err) {
            console.error('Avg time fetch error:', err);
        }
    };

    /**
     * GET /users/me/history
     * Backend (po zmianach) np:
     * [{ id, riddleId, answeredAt, isCorrect, points, distanceMeters, timeSeconds, locationName }]
     *
     * Mapujemy to na format UI:
     * { id, date, location, userGuess, distance, score, timeSpent, correct }
     */
    const fetchGameHistory = async () => {
        try {
            const token = localStorage.getItem('jwt');
            if (!token) {
                setLoading(false);
                return;
            }

            const response = await fetch(`${API_BASE_URL}/users/me/history`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const data = await response.json();

                    const mapped = (Array.isArray(data) ? data : []).map((x) => {
                        const distanceKm = Number(x?.distanceMeters ?? 0) / 1000;

                        return {
                            id: x?.id ?? `${x?.riddleId ?? 'r'}-${x?.answeredAt ?? Math.random()}`,
                            date: x?.answeredAt ?? null,
                            location: x?.locationName ?? `Riddle #${x?.riddleId ?? '—'}`,
                            userGuess: '—',
                            distance: Number.isFinite(distanceKm) ? distanceKm.toFixed(2) : '0.00',
                            score: Number(x?.points ?? 0),
                            timeSpent: Number(x?.timeSeconds ?? 0),
                            correct: Boolean(x?.isCorrect),
                        };
                    });

                    setGameHistory(mapped);
                    setLoading(false);
                    return;
                }
            }
            
            setGameHistory([
                {
                    id: 1,
                    date: '2024-01-20T15:30:00Z',
                    location: 'Paris, France',
                    userGuess: 'Berlin, Germany',
                    distance: '878.00',
                    score: 150,
                    timeSpent: 245,
                    correct: false,
                },
            ]);
        } catch (err) {
            console.error('History fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("avatar", file);

        const token = localStorage.getItem("jwt");
        if (!token) {
            setError("No JWT token found. Please login again.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/users/me/avatar`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                await fetchUserData();
                setError("");
                return;
            }

            let msg = `Failed to upload avatar (${response.status})`;
            const ct = response.headers.get("content-type") || "";

            if (ct.includes("application/json")) {
                const data = await response.json();
                if (data?.message) msg = data.message;
                else if (data?.title && data?.errors) {
                    const firstField = Object.keys(data.errors)[0];
                    const firstErr = firstField ? data.errors[firstField]?.[0] : null;
                    msg = firstErr ? `${data.title}: ${firstErr}` : data.title;
                } else if (data?.title) msg = data.title;
            } else {
                const text = await response.text();
                if (text) msg = text.slice(0, 200);
            }

            setError(msg);
        } catch (err) {
            console.error(err);
            setError("Failed to upload avatar (network error)");
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    const formatTime = (seconds) => {
        const s = Math.max(0, Math.round(Number(seconds || 0)));
        const minutes = Math.floor(s / 60);
        const remainingSeconds = s % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const isAdmin = userData.roles && userData.roles.includes('Admin');

    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
                darkMode
                    ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900'
                    : 'bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50'
            }`}>
                <div className={`text-center text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Loading your profile...
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
                    <div className="text-center mb-12">
                        <h1 className={`text-5xl md:text-6xl font-black mb-4 transition-colors duration-300 ${
                            darkMode
                                ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400'
                                : 'text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600'
                        }`}>
                            Your Profile
                        </h1>
                        <p className={`text-lg transition-colors duration-300 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                            Track your progress and view your achievements
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border-2 border-red-500 text-red-600 text-center font-medium">
                            {error}
                        </div>
                    )}

                    <div className={`p-8 rounded-2xl mb-8 transition-all duration-300 ${
                        darkMode
                            ? 'bg-gray-800/50 border-2 border-gray-700'
                            : 'bg-white border-2 border-gray-200 shadow-xl'
                    }`}>
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                            <div className="relative group">
                                {userData.avatarUrl ? (
                                    <img
                                        src={userData.avatarUrl}
                                        alt="Avatar"
                                        className="w-32 h-32 rounded-full object-cover ring-4 ring-offset-4 transition-all duration-300 group-hover:scale-105"
                                        style={{
                                            ringColor: darkMode ? '#3b82f6' : '#0284c7',
                                            ringOffsetColor: darkMode ? '#1f2937' : '#ffffff'
                                        }}
                                    />
                                ) : (
                                    <div className={`w-32 h-32 rounded-full flex items-center justify-center ring-4 ring-offset-4 transition-all duration-300 group-hover:scale-105 ${
                                        darkMode
                                            ? 'bg-gradient-to-br from-blue-600 to-cyan-600 ring-blue-600'
                                            : 'bg-gradient-to-br from-sky-600 to-blue-600 ring-sky-600'
                                    }`}
                                         style={{
                                             ringOffsetColor: darkMode ? '#1f2937' : '#ffffff'
                                         }}>
                                        <span className="text-5xl font-black text-white">
                                            {userData.displayName?.charAt(0)?.toUpperCase() || '?'}
                                        </span>
                                    </div>
                                )}
                                <label className={`absolute bottom-0 right-0 p-3 rounded-full cursor-pointer transition-all duration-300 hover:scale-110 shadow-xl ${
                                    darkMode
                                        ? 'bg-blue-600 hover:bg-blue-500'
                                        : 'bg-sky-600 hover:bg-sky-500'
                                }`}>
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarUpload}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <h2 className={`text-3xl font-black mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {userData.displayName || 'User'}
                                </h2>
                                <p className={`text-lg mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {userData.email || 'No email'}
                                </p>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                    <span className={`inline-flex px-4 py-2 text-sm font-bold rounded-full ${
                                        isAdmin
                                            ? 'bg-purple-500/20 text-purple-400 border-2 border-purple-500'
                                            : 'bg-green-500/20 text-green-400 border-2 border-green-500'
                                    }`}>
                                        {isAdmin ? '👑 Admin' : '🎮 Player'}
                                    </span>
                                    {userData.createdAt && (
                                        <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            📅 Joined {formatDate(userData.createdAt)}
                                        </span>
                                    )}
                                </div>
                                {isAdmin && (
                                    <button
                                        onClick={() => navigate('/admin')}
                                        className={`mt-6 px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                                            darkMode
                                                ? 'bg-purple-600 hover:bg-purple-500 text-white'
                                                : 'bg-purple-600 hover:bg-purple-500 text-white'
                                        }`}
                                    >
                                        Admin Panel →
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={`flex flex-wrap gap-2 mb-8 p-2 rounded-2xl ${
                        darkMode ? 'bg-gray-800/50' : 'bg-white/50'
                    }`}>
                        {['overview', 'statistics', 'history', 'achievements'].map((tab) => (
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
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: 'Games Played', value: userStats.totalGamesPlayed, icon: '🎮', color: darkMode ? 'from-blue-600 to-cyan-600' : 'from-sky-500 to-blue-500' },
                                { label: 'Total Score', value: userStats.totalScore, icon: '⭐', color: darkMode ? 'from-green-600 to-emerald-600' : 'from-green-500 to-emerald-500' },
                                { label: 'Accuracy', value: `${userStats.accuracy}%`, icon: '🎯', color: darkMode ? 'from-purple-600 to-pink-600' : 'from-purple-500 to-pink-500' },
                                { label: 'Best Score', value: userStats.bestScore, icon: '🏆', color: darkMode ? 'from-orange-600 to-red-600' : 'from-orange-500 to-red-500' }
                            ].map((stat, idx) => (
                                <div key={idx} className={`p-6 rounded-xl transition-all duration-300 hover:scale-105 ${
                                    darkMode
                                        ? 'bg-gray-800/50 border-2 border-gray-700 hover:border-blue-600'
                                        : 'bg-white border-2 border-gray-200 hover:border-sky-400 shadow-lg'
                                }`}>
                                    <div className="text-4xl mb-3">{stat.icon}</div>
                                    <div className={`text-3xl font-black mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                                        {stat.value}
                                    </div>
                                    <div className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'statistics' && (
                        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                            <div className={`p-8 rounded-2xl transition-colors duration-300 ${
                                darkMode
                                    ? 'bg-gray-800/50 border-2 border-gray-700'
                                    : 'bg-white border-2 border-gray-200 shadow-xl'
                            }`}>
                                <h3 className={`text-2xl font-black mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    📊 Performance Metrics
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Average Score', value: userStats.averageScore },
                                        { label: 'Average Time', value: formatTime(userStats.averageTime) },
                                        { label: 'Total Distance', value: `${(userStats.totalDistance / 1000).toFixed(2)} km` },
                                        { label: 'Correct Guesses', value: userStats.correctGuesses }
                                    ].map((metric, idx) => (
                                        <div key={idx} className={`flex justify-between items-center p-4 rounded-lg ${
                                            darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                                        }`}>
                                            <span className={`font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {metric.label}
                                            </span>
                                            <span className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {metric.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className={`rounded-2xl overflow-hidden transition-colors duration-300 ${
                            darkMode
                                ? 'bg-gray-800/50 border-2 border-gray-700'
                                : 'bg-white border-2 border-gray-200 shadow-xl'
                        }`}>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className={darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}>
                                    <tr>
                                        {['Date', 'Location', 'Distance', 'Score', 'Time', 'Result'].map((header) => (
                                            <th key={header} className={`px-6 py-4 text-left text-xs font-black uppercase tracking-wider ${
                                                darkMode ? 'text-gray-400' : 'text-gray-600'
                                            }`}>
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                    {gameHistory.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className={`px-6 py-10 text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                                            >
                                                No games yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        gameHistory.map((game) => (
                                            <tr key={game.id} className={`transition-colors ${
                                                darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                                            }`}>
                                                <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    {formatDate(game.date)}
                                                </td>
                                                <td className={`px-6 py-4 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {game.location ?? '—'}
                                                </td>
                                                <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    {game.distance ?? '0.00'} km
                                                </td>
                                                <td className={`px-6 py-4 text-sm font-bold ${darkMode ? 'text-cyan-400' : 'text-sky-600'}`}>
                                                    {Number.isFinite(Number(game.score)) ? game.score : 0}
                                                </td>
                                                <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    {formatTime(game.timeSpent)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                                                        game.correct
                                                            ? 'bg-green-500/20 text-green-400 border-2 border-green-500'
                                                            : 'bg-red-500/20 text-red-400 border-2 border-red-500'
                                                    }`}>
                                                        {game.correct ? '✓ Correct' : '✗ Incorrect'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'achievements' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { title: 'First Win', icon: '🏆', desc: 'Win your first game', color: 'from-yellow-500 to-orange-500' },
                                { title: 'Sharpshooter', icon: '🎯', desc: 'Get 10 correct guesses', color: 'from-blue-500 to-cyan-500' },
                                { title: 'Speed Demon', icon: '⚡', desc: 'Complete a game in under 60 seconds', color: 'from-green-500 to-emerald-500' },
                                { title: 'High Scorer', icon: '🌟', desc: 'Score over 400 points in a single game', color: 'from-purple-500 to-pink-500' },
                                { title: 'On Fire', icon: '🔥', desc: 'Win 3 games in a row', color: 'from-red-500 to-orange-500' },
                                { title: 'World Traveler', icon: '🗺️', desc: 'Play games from 10 different countries', color: 'from-indigo-500 to-purple-500' }
                            ].map((achievement, idx) => (
                                <div key={idx} className={`p-6 rounded-xl text-center transition-all duration-300 hover:scale-105 ${
                                    darkMode
                                        ? 'bg-gray-800/50 border-2 border-gray-700 hover:border-blue-600'
                                        : 'bg-white border-2 border-gray-200 hover:border-sky-400 shadow-lg'
                                }`}>
                                    <div className="text-5xl mb-4">{achievement.icon}</div>
                                    <h3 className={`text-xl font-black mb-2 bg-gradient-to-r ${achievement.color} bg-clip-text text-transparent`}>
                                        {achievement.title}
                                    </h3>
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {achievement.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}