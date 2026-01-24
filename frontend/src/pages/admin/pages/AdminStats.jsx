import React, { useEffect, useState } from "react";

export default function AdminStats() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

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
            const [userRes, riddleRes, settingsRes] = await Promise.all([
                fetch('/admin/users/stats', { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` } }),
                fetch('/admin/riddles/stats', { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` } }),
                fetch('/admin/settings', { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` } }).catch(() => null)
            ]);
            const userData = userRes ? await userRes.json() : [];
            const riddleData = riddleRes ? await riddleRes.json() : [];
            const settingsData = settingsRes && settingsRes.ok ? await settingsRes.json() : null;

            const totalSubmissions = (riddleData || []).reduce((sum, r) => sum + (r.timesAnswered || 0), 0);
            const totalScores = (riddleData || []).reduce((sum, r) => sum + ((r.avgScore || 0) * (r.timesAnswered || 0)), 0);
            const avgScore = totalSubmissions > 0 ? totalScores / totalSubmissions : 0;
            const totalTimes = (riddleData || []).reduce((sum, r) => sum + ((r.avgTimeSeconds || 0) * (r.timesAnswered || 0)), 0);
            const avgTime = totalSubmissions > 0 ? totalTimes / totalSubmissions : 0;
            const totalDistances = (riddleData || []).reduce((sum, r) => sum + ((r.avgDistanceMeters || 0) * (r.timesAnswered || 0)), 0);
            const avgDistance = totalSubmissions > 0 ? totalDistances / totalSubmissions : 0;

            const topUsers = (userData || []).sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0)).slice(0, 5).map(u => ({ userId: u.displayName || u.userId || 'User', totalScore: u.totalScore || 0 }));

            setStats({
                UsersTotal: (userData || []).length,
                UsersBlocked: 0, // No info
                RiddlesTotal: (riddleData || []).length,
                SubmissionsTotal: totalSubmissions,
                AvgScore: avgScore,
                AvgTime: avgTime,
                AvgDistance: avgDistance,
                TopUsers: topUsers,
                Settings: settingsData
            });
        } catch (e) {
            console.error(e);
            setStats(null);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className={`text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r ${
                        darkMode ? 'from-blue-400 to-cyan-400' : 'from-sky-600 to-blue-600'
                    } bg-clip-text text-transparent`}>
                        📈 System Statistics
                    </h1>
                    <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Comprehensive overview of platform performance
                    </p>
                </div>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className={`p-6 rounded-2xl transition-all duration-300 hover:scale-105 ${
                        darkMode
                            ? 'bg-gray-800/50 border-2 border-gray-700 hover:border-blue-600'
                            : 'bg-white border-2 border-gray-200 hover:border-sky-400 shadow-xl'
                    }`}>
                        <div className="text-4xl mb-3">👥</div>
                        <div className={`text-3xl font-black mb-1 bg-gradient-to-r ${
                            darkMode ? 'from-blue-400 to-cyan-400' : 'from-sky-600 to-blue-600'
                        } bg-clip-text text-transparent`}>
                            {stats.UsersTotal}
                        </div>
                        <div className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Total Users
                        </div>
                    </div>

                    <div className={`p-6 rounded-2xl transition-all duration-300 hover:scale-105 ${
                        darkMode
                            ? 'bg-gray-800/50 border-2 border-gray-700 hover:border-red-600'
                            : 'bg-white border-2 border-gray-200 hover:border-red-400 shadow-xl'
                    }`}>
                        <div className="text-4xl mb-3">🚫</div>
                        <div className={`text-3xl font-black mb-1 bg-gradient-to-r ${
                            darkMode ? 'from-red-400 to-orange-400' : 'from-red-600 to-orange-600'
                        } bg-clip-text text-transparent`}>
                            {stats.UsersBlocked}
                        </div>
                        <div className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Blocked Users
                        </div>
                    </div>

                    <div className={`p-6 rounded-2xl transition-all duration-300 hover:scale-105 ${
                        darkMode
                            ? 'bg-gray-800/50 border-2 border-gray-700 hover:border-purple-600'
                            : 'bg-white border-2 border-gray-200 hover:border-purple-400 shadow-xl'
                    }`}>
                        <div className="text-4xl mb-3">🎯</div>
                        <div className={`text-3xl font-black mb-1 bg-gradient-to-r ${
                            darkMode ? 'from-purple-400 to-pink-400' : 'from-purple-600 to-pink-600'
                        } bg-clip-text text-transparent`}>
                            {stats.RiddlesTotal}
                        </div>
                        <div className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Total Riddles
                        </div>
                    </div>

                    <div className={`p-6 rounded-2xl transition-all duration-300 hover:scale-105 ${
                        darkMode
                            ? 'bg-gray-800/50 border-2 border-gray-700 hover:border-green-600'
                            : 'bg-white border-2 border-gray-200 hover:border-green-400 shadow-xl'
                    }`}>
                        <div className="text-4xl mb-3">📝</div>
                        <div className={`text-3xl font-black mb-1 bg-gradient-to-r ${
                            darkMode ? 'from-green-400 to-emerald-400' : 'from-green-600 to-emerald-600'
                        } bg-clip-text text-transparent`}>
                            {stats.SubmissionsTotal}
                        </div>
                        <div className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Total Submissions
                        </div>
                    </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className={`p-6 rounded-2xl ${
                        darkMode
                            ? 'bg-gray-800/50 border-2 border-gray-700'
                            : 'bg-white border-2 border-gray-200 shadow-xl'
                    }`}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${
                                darkMode ? 'from-blue-600 to-cyan-600' : 'from-sky-600 to-blue-600'
                            }`}>
                                <span className="text-2xl">⭐</span>
                            </div>
                            <div className={`text-sm font-bold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Average Score
                            </div>
                        </div>
                        <div className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {(stats.AvgScore ?? 0).toFixed(2)}
                        </div>
                    </div>

                    <div className={`p-6 rounded-2xl ${
                        darkMode
                            ? 'bg-gray-800/50 border-2 border-gray-700'
                            : 'bg-white border-2 border-gray-200 shadow-xl'
                    }`}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${
                                darkMode ? 'from-purple-600 to-pink-600' : 'from-purple-600 to-pink-600'
                            }`}>
                                <span className="text-2xl">⏱️</span>
                            </div>
                            <div className={`text-sm font-bold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Avg Time (seconds)
                            </div>
                        </div>
                        <div className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {(stats.AvgTime ?? 0).toFixed(2)}s
                        </div>
                    </div>

                    <div className={`p-6 rounded-2xl ${
                        darkMode
                            ? 'bg-gray-800/50 border-2 border-gray-700'
                            : 'bg-white border-2 border-gray-200 shadow-xl'
                    }`}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${
                                darkMode ? 'from-orange-600 to-red-600' : 'from-orange-600 to-red-600'
                            }`}>
                                <span className="text-2xl">📏</span>
                            </div>
                            <div className={`text-sm font-bold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Avg Distance (meters)
                            </div>
                        </div>
                        <div className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {(stats.AvgDistance ?? 0).toFixed(2)}m
                        </div>
                    </div>
                </div>

                {/* Game Settings (if available) */}
                {stats && stats.Settings && (
                    <div className="mb-8 p-6 rounded-2xl bg-white border-2 border-gray-200 shadow-xl">
                        <h2 className={`text-2xl font-black mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>⚙️ Current Game Settings</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded">
                                <div className="text-sm text-gray-500">Base Points</div>
                                <div className="font-semibold text-lg">{stats.Settings.basePoints ?? stats.Settings.BasePoints ?? '—'}</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded">
                                <div className="text-sm text-gray-500">Default Time Limit (s)</div>
                                <div className="font-semibold text-lg">{stats.Settings.timeLimitSeconds ?? stats.Settings.TimeLimitSeconds ?? '—'}</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded">
                                <div className="text-sm text-gray-500">Max Distance (m)</div>
                                <div className="font-semibold text-lg">{stats.Settings.maxDistanceMeters ?? stats.Settings.MaxDistanceMeters ?? '—'}</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded">
                                <div className="text-sm text-gray-500">Allow Hints</div>
                                <div className="font-semibold text-lg">{stats.Settings.allowHints != null ? String(stats.Settings.allowHints) : (stats.Settings.AllowHints != null ? String(stats.Settings.AllowHints) : '—')}</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Top Users */}
                <div className={`p-8 rounded-2xl ${
                    darkMode
                        ? 'bg-gray-800/50 border-2 border-gray-700'
                        : 'bg-white border-2 border-gray-200 shadow-xl'
                }`}>
                    <h2 className={`text-2xl font-black mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        🏆 Top Users by Score
                    </h2>

                    <div className="space-y-3">
                        {(stats.TopUsers || []).map((u, index) => (
                            <div
                                key={index}
                                className={`p-4 rounded-xl flex items-center gap-4 transition-all duration-300 hover:scale-[1.01] ${
                                    darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                                }`}
                            >
                                {/* Rank Badge */}
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl ${
                                    index === 0
                                        ? 'bg-gradient-to-br from-yellow-400 to-orange-400 text-white'
                                        : index === 1
                                            ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white'
                                            : index === 2
                                                ? 'bg-gradient-to-br from-orange-400 to-red-400 text-white'
                                                : darkMode
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-sky-600 text-white'
                                }`}>
                                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                                </div>

                                {/* User Info */}
                                <div className="flex-1">
                                    <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {u.userId}
                                    </div>
                                </div>

                                {/* Score */}
                                <div className={`text-2xl font-black bg-gradient-to-r ${
                                    darkMode ? 'from-blue-400 to-cyan-400' : 'from-sky-600 to-blue-600'
                                } bg-clip-text text-transparent`}>
                                    {u.totalScore.toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>

                    {(!stats.TopUsers || stats.TopUsers.length === 0) && (
                        <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            No user data available yet
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}