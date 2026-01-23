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
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('jwt');

        if (!token) {
            console.warn('No JWT token found, redirecting to login');
            navigate('/login');
            return;
        }

        fetchUserData();
        fetchUserStats();
        fetchGameHistory();
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
                headers: {
                    'Authorization': `Bearer ${token}`
                }
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

    const fetchUserStats = async () => {
        try {
            const token = localStorage.getItem('jwt');

            if (!token) {
                return;
            }

            const response = await fetch(`${API_BASE_URL}/users/me/stats`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const data = await response.json();
                    setUserStats(data);
                    return;
                }
            }

            setUserStats({
                totalGamesPlayed: 25,
                totalScore: 2500,
                averageScore: 100,
                bestScore: 500,
                totalDistance: 15000,
                averageTime: 180,
                correctGuesses: 18,
                accuracy: 72,
            });
        } catch (err) {
            console.error('Stats fetch error:', err);
            // Use mock data on error
            setUserStats({
                totalGamesPlayed: 25,
                totalScore: 2500,
                averageScore: 100,
                bestScore: 500,
                totalDistance: 15000,
                averageTime: 180,
                correctGuesses: 18,
                accuracy: 72,
            });
        }
    };

    const fetchGameHistory = async () => {
        try {
            const token = localStorage.getItem('jwt');

            if (!token) {
                setLoading(false);
                return;
            }

            const response = await fetch(`${API_BASE_URL}/users/me/history`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const data = await response.json();
                    setGameHistory(data);
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
                    distance: 878,
                    score: 150,
                    timeSpent: 245,
                    correct: false,
                },
                {
                    id: 2,
                    date: '2024-01-19T14:20:00Z',
                    location: 'Tokyo, Japan',
                    userGuess: 'Tokyo, Japan',
                    distance: 0,
                    score: 500,
                    timeSpent: 120,
                    correct: true,
                },
                {
                    id: 3,
                    date: '2024-01-18T16:45:00Z',
                    location: 'New York, USA',
                    userGuess: 'Boston, USA',
                    distance: 306,
                    score: 200,
                    timeSpent: 180,
                    correct: false,
                },
            ]);
        } catch (err) {
            console.error('History fetch error:', err);
            setGameHistory([
                {
                    id: 1,
                    date: '2024-01-20T15:30:00Z',
                    location: 'Paris, France',
                    userGuess: 'Berlin, Germany',
                    distance: 878,
                    score: 150,
                    timeSpent: 245,
                    correct: false,
                },
                {
                    id: 2,
                    date: '2024-01-19T14:20:00Z',
                    location: 'Tokyo, Japan',
                    userGuess: 'Tokyo, Japan',
                    distance: 0,
                    score: 500,
                    timeSpent: 120,
                    correct: true,
                },
                {
                    id: 3,
                    date: '2024-01-18T16:45:00Z',
                    location: 'New York, USA',
                    userGuess: 'Boston, USA',
                    distance: 306,
                    score: 200,
                    timeSpent: 180,
                    correct: false,
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const token = localStorage.getItem('jwt');
            const response = await fetch(`${API_BASE_URL}/users/me/avatar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                fetchUserData();
            } else {
                setError('Failed to upload avatar');
            }
        } catch (err) {
            setError('Failed to upload avatar');
            console.error(err);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const isAdmin = userData.roles && userData.roles.includes('Admin');

    if (loading) {
        return (
            <div className="min-h-screen bg-sky-50 dark:bg-slate-900 flex items-center justify-center">
                <div className="text-center text-gray-500">Loading user panel...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-sky-50 dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white dark:bg-slate-800 shadow-lg rounded-lg">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    User Panel
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                    Manage your profile and view your game statistics
                                </p>
                            </div>
                            {isAdmin && (
                                <button
                                    onClick={() => navigate('/admin')}
                                    className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors"
                                >
                                    Admin Panel
                                </button>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center m-6">
                            {error}
                        </div>
                    )}

                    {/* User Profile Section */}
                    <div className="p-6 border-b border-gray-200 dark:border-slate-700">
                        <div className="flex items-center space-x-6">
                            <div className="relative">
                                {userData.avatarUrl ? (
                                    <img
                                        src={userData.avatarUrl}
                                        alt="Avatar"
                                        className="w-24 h-24 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-24 h-24 bg-gray-200 dark:bg-slate-600 rounded-full flex items-center justify-center">
                                        <span className="text-2xl font-medium text-gray-600 dark:text-gray-300">
                                            {userData.displayName?.charAt(0)?.toUpperCase() || '?'}
                                        </span>
                                    </div>
                                )}
                                <label className="absolute bottom-0 right-0 bg-sky-600 text-white p-2 rounded-full cursor-pointer hover:bg-sky-700 transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                            <div className="flex-1">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {userData.displayName || 'User'}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {userData.email || 'No email'}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                        isAdmin
                                            ? 'bg-purple-100 text-purple-800'
                                            : 'bg-green-100 text-green-800'
                                    }`}>
                                        {isAdmin ? 'Admin' : 'User'}
                                    </span>
                                    {userData.createdAt && (
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            Joined {formatDate(userData.createdAt)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="border-b border-gray-200 dark:border-slate-700">
                        <nav className="flex space-x-8 px-6">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'overview'
                                        ? 'border-sky-500 text-sky-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('statistics')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'statistics'
                                        ? 'border-sky-500 text-sky-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Statistics
                            </button>
                            <button
                                onClick={() => setActiveTab('history')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'history'
                                        ? 'border-sky-500 text-sky-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Game History
                            </button>
                            <button
                                onClick={() => setActiveTab('achievements')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'achievements'
                                        ? 'border-sky-500 text-sky-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Achievements
                            </button>
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-sky-50 dark:bg-slate-700 p-6 rounded-lg">
                                    <div className="text-2xl font-bold text-sky-600 dark:text-sky-400">
                                        {userStats.totalGamesPlayed}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        Games Played
                                    </div>
                                </div>
                                <div className="bg-green-50 dark:bg-slate-700 p-6 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                        {userStats.totalScore}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        Total Score
                                    </div>
                                </div>
                                <div className="bg-purple-50 dark:bg-slate-700 p-6 rounded-lg">
                                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                        {userStats.accuracy}%
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        Accuracy
                                    </div>
                                </div>
                                <div className="bg-orange-50 dark:bg-slate-700 p-6 rounded-lg">
                                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                        {userStats.bestScore}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        Best Score
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'statistics' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gray-50 dark:bg-slate-700 p-6 rounded-lg">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            Performance Metrics
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Average Score</span>
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {userStats.averageScore}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Average Time</span>
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {formatTime(userStats.averageTime)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Total Distance</span>
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {(userStats.totalDistance / 1000).toFixed(1)} km
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Correct Guesses</span>
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {userStats.correctGuesses}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-slate-700 p-6 rounded-lg">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            Quick Actions
                                        </h3>
                                        <div className="space-y-3">
                                            <button
                                                onClick={() => navigate('/guess')}
                                                className="w-full bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors"
                                            >
                                                Play New Game
                                            </button>
                                            <button
                                                onClick={() => navigate('/profile')}
                                                className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                                            >
                                                Edit Profile
                                            </button>
                                            <button
                                                onClick={() => navigate('/')}
                                                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                            >
                                                View Today's Riddle
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'history' && (
                            <div className="bg-white dark:bg-slate-700 rounded-lg shadow overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 dark:bg-slate-800">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Location
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Your Guess
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Distance
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Score
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Time
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Result
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                        {gameHistory.map((game) => (
                                            <tr key={game.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {formatDate(game.date)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    {game.location}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    {game.userGuess}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {game.distance} km
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    {game.score}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {formatTime(game.timeSpent)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                            game.correct
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {game.correct ? 'Correct' : 'Incorrect'}
                                                        </span>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'achievements' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="bg-yellow-50 dark:bg-slate-700 p-6 rounded-lg text-center">
                                    <div className="text-4xl mb-4">🏆</div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        First Win
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Win your first game
                                    </p>
                                </div>
                                <div className="bg-blue-50 dark:bg-slate-700 p-6 rounded-lg text-center">
                                    <div className="text-4xl mb-4">🎯</div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        Sharpshooter
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Get 10 correct guesses
                                    </p>
                                </div>
                                <div className="bg-green-50 dark:bg-slate-700 p-6 rounded-lg text-center">
                                    <div className="text-4xl mb-4">⚡</div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        Speed Demon
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Complete a game in under 60 seconds
                                    </p>
                                </div>
                                <div className="bg-purple-50 dark:bg-slate-700 p-6 rounded-lg text-center">
                                    <div className="text-4xl mb-4">🌟</div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        High Scorer
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Score over 400 points in a single game
                                    </p>
                                </div>
                                <div className="bg-red-50 dark:bg-slate-700 p-6 rounded-lg text-center">
                                    <div className="text-4xl mb-4">🔥</div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        On Fire
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Win 3 games in a row
                                    </p>
                                </div>
                                <div className="bg-indigo-50 dark:bg-slate-700 p-6 rounded-lg text-center">
                                    <div className="text-4xl mb-4">🗺️</div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        World Traveler
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Play games from 10 different countries
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}