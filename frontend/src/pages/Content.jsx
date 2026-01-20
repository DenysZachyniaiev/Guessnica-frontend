import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Content() {
    const [user, setUser] = useState(null);
    const [todayRiddle, setTodayRiddle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const token = localStorage.getItem('jwt');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const headers = {
                    'Authorization': `Bearer ${token}`,
                };

                const userResponse = await fetch('/users/me', { headers });
                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    setUser(userData);
                }

                const riddleResponse = await fetch('/game/today-riddle', { headers });
                if (riddleResponse.ok) {
                    const riddleData = await riddleResponse.json();
                    setTodayRiddle(riddleData);
                } else if (riddleResponse.status === 404) {
                    setError('No riddle available today. Check back later!');
                } else {
                    setError('Failed to load today\'s riddle');
                }
            } catch (err) {
                setError('Network error. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isAuthenticated, navigate]);

    const handlePlayRiddle = () => {
        if (todayRiddle) {
            navigate('/guess', { state: { riddle: todayRiddle } });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('roles');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-sky-50 dark:bg-slate-900 flex items-center justify-center">
                <div className="text-sky-700 dark:text-sky-300 text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-sky-50 dark:bg-slate-900">
            <div className="bg-white dark:bg-slate-800 shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <img
                            src={user?.avatarUrl || '/default-avatar.png'}
                            alt="Avatar"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                                {user?.displayName || 'User'}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                {user?.email}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => navigate('/profile')}
                            className="text-sky-600 hover:text-sky-500 font-medium"
                        >
                            Profile
                        </button>
                        <button
                            onClick={() => navigate('/leaderboard')}
                            className="text-sky-600 hover:text-sky-500 font-medium"
                        >
                            Leaderboard
                        </button>
                        {user?.roles?.includes('Admin') && (
                            <button
                                onClick={() => navigate('/admin')}
                                className="bg-sky-600 text-white px-3 py-1 rounded text-sm hover:bg-sky-700"
                            >
                                Admin Panel
                            </button>
                        )}
                        <button
                            onClick={handleLogout}
                            className="text-red-600 hover:text-red-500 font-medium"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-sky-700 dark:text-sky-300 mb-8 text-center">
                    Welcome to Guessnica
                </h1>

                {error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
                        {error}
                    </div>
                ) : todayRiddle ? (
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                Today's Riddle
                            </h2>
                            
                            <div className="mb-6">
                                <img
                                    src={todayRiddle.imageUrl}
                                    alt="Riddle"
                                    className="w-full h-64 object-cover rounded-lg"
                                />
                            </div>

                            <div className="space-y-2 mb-6">
                                <p className="text-gray-700 dark:text-gray-300">
                                    <span className="font-medium">Difficulty:</span>{' '}
                                    <span className={`px-2 py-1 rounded text-sm ${
                                        todayRiddle.difficulty === 1 ? 'bg-green-100 text-green-800' :
                                        todayRiddle.difficulty === 2 ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {todayRiddle.difficulty === 1 ? 'Easy (1 point)' :
                                         todayRiddle.difficulty === 2 ? 'Medium (2 points)' :
                                         'Hard (3 points)'}
                                    </span>
                                </p>
                                <p className="text-gray-700 dark:text-gray-300">
                                    <span className="font-medium">Description:</span> {todayRiddle.description}
                                </p>
                            </div>

                            <button
                                onClick={handlePlayRiddle}
                                className="w-full bg-sky-600 text-white py-3 px-6 rounded-lg hover:bg-sky-700 transition-colors font-medium"
                            >
                                Start Guessing
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 text-center">
                        <div className="text-gray-500 dark:text-gray-400">
                            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-lg">No riddle available today</p>
                            <p className="text-sm mt-2">Check back later for a new challenge!</p>
                        </div>
                    </div>
                )}

                {user && (
                    <div className="mt-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            Your Statistics
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-sky-600">
                                    {user.totalScore || 0}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Total Score</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-sky-600">
                                    {user.riddlesAnswered || 0}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Riddles Answered</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-sky-600">
                                    {user.averageScore || 0}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Average Score</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}