import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserLeaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [timeRange, setTimeRange] = useState('weekly');
    const [category, setCategory] = useState('score');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userRank, setUserRank] = useState(null);
    const navigate = useNavigate();

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


    useEffect(() => {
        fetchLeaderboard();
        fetchUserRank();
    }, [timeRange, category]);

    const fetchLeaderboard = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('jwt');
            const response = await fetch(`${API_BASE_URL}/leaderboard?timeRange=${timeRange}&category=${category}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setLeaderboard(data);
            } else {
                setLeaderboard([
                    {
                        rank: 1,
                        displayName: 'GeoMaster',
                        avatarUrl: '',
                        score: 2500,
                        gamesPlayed: 45,
                        accuracy: 85,
                        averageTime: 120
                    },
                    {
                        rank: 2,
                        displayName: 'WorldTraveler',
                        avatarUrl: '',
                        score: 2300,
                        gamesPlayed: 42,
                        accuracy: 82,
                        averageTime: 135
                    },
                    {
                        rank: 3,
                        displayName: 'MapNinja',
                        avatarUrl: '',
                        score: 2100,
                        gamesPlayed: 38,
                        accuracy: 78,
                        averageTime: 145
                    },
                    {
                        rank: 4,
                        displayName: 'LocationExpert',
                        avatarUrl: '',
                        score: 1900,
                        gamesPlayed: 35,
                        accuracy: 75,
                        averageTime: 160
                    },
                    {
                        rank: 5,
                        displayName: 'GeoChampion',
                        avatarUrl: '',
                        score: 1750,
                        gamesPlayed: 32,
                        accuracy: 72,
                        averageTime: 170
                    }
                ]);
            }
        } catch (err) {
            setError('Failed to fetch leaderboard');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserRank = async () => {
        try {
            const token = localStorage.getItem('jwt');
            const response = await fetch(`${API_BASE_URL}/users/me/rank`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUserRank(data);
            } else {
                setUserRank({
                    rank: 12,
                    displayName: 'Current User',
                    score: 1200,
                    gamesPlayed: 25,
                    accuracy: 68,
                    averageTime: 180
                });
            }
        } catch (err) {
            console.error('Failed to fetch user rank');
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const getRankBadge = (rank) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return rank;
    };

    const getRankColor = (rank) => {
        if (rank === 1) return 'text-yellow-600 dark:text-yellow-400';
        if (rank === 2) return 'text-gray-600 dark:text-gray-400';
        if (rank === 3) return 'text-orange-600 dark:text-orange-400';
        return 'text-gray-900 dark:text-white';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-sky-50 dark:bg-slate-900 flex items-center justify-center">
                <div className="text-center text-gray-500">Loading leaderboard...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-sky-50 dark:bg-slate-900">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="bg-white dark:bg-slate-800 shadow-lg rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Leaderboard
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                    Compete with players worldwide
                                </p>
                            </div>
                            <button
                                onClick={() => navigate('/user-panel')}
                                className="text-sky-600 hover:text-sky-500 font-medium"
                            >
                                Back to User Panel
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center m-6">
                            {error}
                        </div>
                    )}

                    <div className="p-6 border-b border-gray-200 dark:border-slate-700">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Time Range
                                </label>
                                <select
                                    value={timeRange}
                                    onChange={(e) => setTimeRange(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-sky-500 focus:border-sky-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                >
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="alltime">All Time</option>
                                </select>
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Category
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-sky-500 focus:border-sky-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                >
                                    <option value="score">Total Score</option>
                                    <option value="accuracy">Accuracy</option>
                                    <option value="games">Games Played</option>
                                    <option value="averageTime">Average Time</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}