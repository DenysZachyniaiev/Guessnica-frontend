import React, { useState, useEffect } from 'react';

export default function UserLeaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [timeRange, setTimeRange] = useState('weekly');
    const [category, setCategory] = useState('score');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userRank, setUserRank] = useState(null);
    const [darkMode, setDarkMode] = useState(false);

    const API_BASE_URL = 'http://localhost:8082';

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

        fetchLeaderboard();
        fetchUserRank();

        return () => observer.disconnect();
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
                    },
                    {
                        rank: 6,
                        displayName: 'AtlasKing',
                        avatarUrl: '',
                        score: 1650,
                        gamesPlayed: 30,
                        accuracy: 70,
                        averageTime: 175
                    },
                    {
                        rank: 7,
                        displayName: 'PinPointer',
                        avatarUrl: '',
                        score: 1550,
                        gamesPlayed: 28,
                        accuracy: 68,
                        averageTime: 180
                    },
                    {
                        rank: 8,
                        displayName: 'GlobeHunter',
                        avatarUrl: '',
                        score: 1450,
                        gamesPlayed: 26,
                        accuracy: 66,
                        averageTime: 185
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
        return `#${rank}`;
    };

    const getRankColor = (rank) => {
        if (rank === 1) return darkMode ? 'from-yellow-400 to-orange-400' : 'from-yellow-500 to-orange-500';
        if (rank === 2) return darkMode ? 'from-gray-300 to-gray-400' : 'from-gray-400 to-gray-500';
        if (rank === 3) return darkMode ? 'from-orange-400 to-red-400' : 'from-orange-500 to-red-500';
        return darkMode ? 'from-blue-400 to-cyan-400' : 'from-sky-600 to-blue-600';
    };

    const getRankBackground = (rank, isUserRank = false) => {
        if (isUserRank) {
            return darkMode
                ? 'bg-blue-900/30 border-2 border-blue-500'
                : 'bg-sky-100 border-2 border-sky-500';
        }
        if (rank === 1) return darkMode ? 'bg-yellow-900/20 border-2 border-yellow-600' : 'bg-yellow-50 border-2 border-yellow-400';
        if (rank === 2) return darkMode ? 'bg-gray-800/50 border-2 border-gray-600' : 'bg-gray-50 border-2 border-gray-400';
        if (rank === 3) return darkMode ? 'bg-orange-900/20 border-2 border-orange-600' : 'bg-orange-50 border-2 border-orange-400';
        return darkMode
            ? 'bg-gray-800/50 border-2 border-gray-700 hover:border-blue-600'
            : 'bg-white border-2 border-gray-200 hover:border-sky-400';
    };

    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
                darkMode
                    ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900'
                    : 'bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50'
            }`}>
                <div className={`text-center text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Loading leaderboard...
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
                <div className="max-w-6xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <h1 className={`text-5xl md:text-6xl font-black mb-4 transition-colors duration-300 ${
                            darkMode
                                ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400'
                                : 'text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600'
                        }`}>
                            🏆 Leaderboard
                        </h1>
                        <p className={`text-lg transition-colors duration-300 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                            Compete with the best geography masters worldwide
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border-2 border-red-500 text-red-600 text-center font-medium">
                            {error}
                        </div>
                    )}

                    {/* Filters */}
                    <div className={`p-6 rounded-2xl mb-8 transition-all duration-300 ${
                        darkMode
                            ? 'bg-gray-800/50 border-2 border-gray-700'
                            : 'bg-white border-2 border-gray-200 shadow-xl'
                    }`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={`block text-sm font-bold mb-3 ${
                                    darkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                    ⏱️ Time Range
                                </label>
                                <select
                                    value={timeRange}
                                    onChange={(e) => setTimeRange(e.target.value)}
                                    className={`w-full px-4 py-3 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 ${
                                        darkMode
                                            ? 'bg-gray-700 border-2 border-gray-600 text-white focus:ring-blue-500/50 focus:border-blue-500'
                                            : 'bg-white border-2 border-gray-300 text-gray-900 focus:ring-sky-500/50 focus:border-sky-500'
                                    }`}
                                >
                                    <option value="daily">📅 Daily</option>
                                    <option value="weekly">📊 Weekly</option>
                                    <option value="monthly">📈 Monthly</option>
                                    <option value="alltime">♾️ All Time</option>
                                </select>
                            </div>
                            <div>
                                <label className={`block text-sm font-bold mb-3 ${
                                    darkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                    📊 Category
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className={`w-full px-4 py-3 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 ${
                                        darkMode
                                            ? 'bg-gray-700 border-2 border-gray-600 text-white focus:ring-blue-500/50 focus:border-blue-500'
                                            : 'bg-white border-2 border-gray-300 text-gray-900 focus:ring-sky-500/50 focus:border-sky-500'
                                    }`}
                                >
                                    <option value="score">⭐ Total Score</option>
                                    <option value="accuracy">🎯 Accuracy</option>
                                    <option value="games">🎮 Games Played</option>
                                    <option value="averageTime">⚡ Average Time</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* User Rank Card */}
                    {userRank && (
                        <div className={`p-6 rounded-2xl mb-8 transition-all duration-300 ${
                            darkMode
                                ? 'bg-blue-900/30 border-2 border-blue-500 shadow-xl shadow-blue-900/50'
                                : 'bg-sky-100 border-2 border-sky-500 shadow-xl'
                        }`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black bg-gradient-to-br ${
                                        darkMode ? 'from-blue-600 to-cyan-600' : 'from-sky-600 to-blue-600'
                                    } text-white shadow-lg`}>
                                        {getRankBadge(userRank.rank)}
                                    </div>
                                    <div>
                                        <div className={`text-sm font-bold ${darkMode ? 'text-blue-400' : 'text-sky-700'}`}>
                                            YOUR RANK
                                        </div>
                                        <div className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {userRank.displayName}
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center">
                                        <div className={`text-2xl font-black bg-gradient-to-r ${getRankColor(userRank.rank)} bg-clip-text text-transparent`}>
                                            {userRank.score}
                                        </div>
                                        <div className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Score
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {userRank.gamesPlayed}
                                        </div>
                                        <div className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Games
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {userRank.accuracy}%
                                        </div>
                                        <div className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Accuracy
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {formatTime(userRank.averageTime)}
                                        </div>
                                        <div className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Avg Time
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Top 3 Podium */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* 2nd Place */}
                        {leaderboard[1] && (
                            <div className={`p-6 rounded-2xl transition-all duration-300 hover:scale-105 ${getRankBackground(2)} shadow-lg order-2 md:order-1`}>
                                <div className="text-center">
                                    <div className="text-5xl mb-3">🥈</div>
                                    <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl font-black bg-gradient-to-br ${
                                        darkMode ? 'from-gray-600 to-gray-700' : 'from-gray-400 to-gray-500'
                                    } text-white shadow-lg`}>
                                        {leaderboard[1].displayName.charAt(0).toUpperCase()}
                                    </div>
                                    <h3 className={`text-xl font-black mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {leaderboard[1].displayName}
                                    </h3>
                                    <div className={`text-3xl font-black bg-gradient-to-r ${getRankColor(2)} bg-clip-text text-transparent mb-4`}>
                                        {leaderboard[1].score}
                                    </div>
                                    <div className={`grid grid-cols-3 gap-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        <div>
                                            <div className="font-bold">{leaderboard[1].gamesPlayed}</div>
                                            <div>Games</div>
                                        </div>
                                        <div>
                                            <div className="font-bold">{leaderboard[1].accuracy}%</div>
                                            <div>Accuracy</div>
                                        </div>
                                        <div>
                                            <div className="font-bold">{formatTime(leaderboard[1].averageTime)}</div>
                                            <div>Time</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 1st Place */}
                        {leaderboard[0] && (
                            <div className={`p-6 rounded-2xl transition-all duration-300 hover:scale-105 transform md:scale-110 ${getRankBackground(1)} shadow-2xl order-1 md:order-2`}>
                                <div className="text-center">
                                    <div className="text-6xl mb-3">🥇</div>
                                    <div className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center text-4xl font-black bg-gradient-to-br ${
                                        darkMode ? 'from-yellow-500 to-orange-500' : 'from-yellow-400 to-orange-400'
                                    } text-white shadow-2xl ring-4 ${darkMode ? 'ring-yellow-600' : 'ring-yellow-400'}`}>
                                        {leaderboard[0].displayName.charAt(0).toUpperCase()}
                                    </div>
                                    <h3 className={`text-2xl font-black mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {leaderboard[0].displayName}
                                    </h3>
                                    <div className={`text-4xl font-black bg-gradient-to-r ${getRankColor(1)} bg-clip-text text-transparent mb-4`}>
                                        {leaderboard[0].score}
                                    </div>
                                    <div className={`grid grid-cols-3 gap-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        <div>
                                            <div className="font-bold">{leaderboard[0].gamesPlayed}</div>
                                            <div>Games</div>
                                        </div>
                                        <div>
                                            <div className="font-bold">{leaderboard[0].accuracy}%</div>
                                            <div>Accuracy</div>
                                        </div>
                                        <div>
                                            <div className="font-bold">{formatTime(leaderboard[0].averageTime)}</div>
                                            <div>Time</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 3rd Place */}
                        {leaderboard[2] && (
                            <div className={`p-6 rounded-2xl transition-all duration-300 hover:scale-105 ${getRankBackground(3)} shadow-lg order-3`}>
                                <div className="text-center">
                                    <div className="text-5xl mb-3">🥉</div>
                                    <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl font-black bg-gradient-to-br ${
                                        darkMode ? 'from-orange-600 to-red-600' : 'from-orange-500 to-red-500'
                                    } text-white shadow-lg`}>
                                        {leaderboard[2].displayName.charAt(0).toUpperCase()}
                                    </div>
                                    <h3 className={`text-xl font-black mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {leaderboard[2].displayName}
                                    </h3>
                                    <div className={`text-3xl font-black bg-gradient-to-r ${getRankColor(3)} bg-clip-text text-transparent mb-4`}>
                                        {leaderboard[2].score}
                                    </div>
                                    <div className={`grid grid-cols-3 gap-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        <div>
                                            <div className="font-bold">{leaderboard[2].gamesPlayed}</div>
                                            <div>Games</div>
                                        </div>
                                        <div>
                                            <div className="font-bold">{leaderboard[2].accuracy}%</div>
                                            <div>Accuracy</div>
                                        </div>
                                        <div>
                                            <div className="font-bold">{formatTime(leaderboard[2].averageTime)}</div>
                                            <div>Time</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Rest of Leaderboard */}
                    <div className="space-y-3">
                        {leaderboard.slice(3).map((player) => (
                            <div
                                key={player.rank}
                                className={`p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${getRankBackground(player.rank)} shadow-lg`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-black bg-gradient-to-br ${
                                            darkMode ? 'from-blue-600 to-cyan-600' : 'from-sky-600 to-blue-600'
                                        } text-white shadow-lg`}>
                                            #{player.rank}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className={`text-lg font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {player.displayName}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                        <div className="text-center">
                                            <div className={`text-xl font-black bg-gradient-to-r ${getRankColor(player.rank)} bg-clip-text text-transparent`}>
                                                {player.score}
                                            </div>
                                            <div className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Score
                                            </div>
                                        </div>
                                        <div className="text-center hidden md:block">
                                            <div className={`text-xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {player.gamesPlayed}
                                            </div>
                                            <div className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Games
                                            </div>
                                        </div>
                                        <div className="text-center hidden md:block">
                                            <div className={`text-xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {player.accuracy}%
                                            </div>
                                            <div className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Accuracy
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className={`text-xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {formatTime(player.averageTime)}
                                            </div>
                                            <div className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Avg Time
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}