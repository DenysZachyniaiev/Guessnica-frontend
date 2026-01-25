import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function UserLeaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [timeRange, setTimeRange] = useState('weekly');
    const [category, setCategory] = useState('score');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userRank, setUserRank] = useState(null);

    const navigate = useNavigate();
    const { t } = useTranslation();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const daysByRange = {
        daily: 1,
        weekly: 7,
        monthly: 30,
        alltime: 3650,
    };

    const categoryToBackend = {
        score: 'TotalScore',
        accuracy: 'Accuracy',
        games: 'GamesPlayed',
        averageTime: 'AverageTime',
    };

    const days = daysByRange[timeRange] ?? 7;
    const backendCategory = categoryToBackend[category] ?? 'TotalScore';
    const count = 100;

    useEffect(() => {
        fetchLeaderboard();
        fetchUserRank();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeRange, category]);

    const fetchLeaderboard = async () => {
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('jwt');

            const url = `${API_BASE_URL}/leaderboard/?days=${days}&count=${count}&category=${encodeURIComponent(
                backendCategory
            )}`;

            const response = await fetch(url, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });

            if (!response.ok) {
                setError(`{t('leaderboard.fetchFailed')} (HTTP ${response.status})`);
                setLeaderboard([]);
                return;
            }

            const data = await response.json();
            setLeaderboard(Array.isArray(data) ? data : []);
        } catch {
            setError(t('leaderboard.fetchFailed'));
            setLeaderboard([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserRank = async () => {
        try {
            const token = localStorage.getItem('jwt');

            const url = `${API_BASE_URL}/leaderboard/rank?days=${days}&category=${encodeURIComponent(
                backendCategory
            )}`;

            const response = await fetch(url, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });

            if (!response.ok) {
                setUserRank(null);
                return;
            }

            const data = await response.json();
            setUserRank(data);
        } catch {
            setUserRank(null);
        }
    };

    const getRankBadge = (rank) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return rank ?? '—';
    };

    const getRankColor = (rank) => {
        if (rank === 1) return 'text-yellow-600 dark:text-yellow-400';
        if (rank === 2) return 'text-gray-600 dark:text-gray-400';
        if (rank === 3) return 'text-orange-600 dark:text-orange-400';
        return 'text-gray-900 dark:text-white';
    };

    const formatSeconds = (seconds) => {
        if (seconds === null || seconds === undefined) return '—';
        const s = Math.round(Number(seconds));
        if (!Number.isFinite(s)) return '—';
        const m = Math.floor(s / 60);
        const r = s % 60;
        return `${m}:${String(r).padStart(2, '0')}`;
    };

    const formatAccuracy = (value) => {
        if (value === null || value === undefined) return '—';
        const num = Number(value);
        if (!Number.isFinite(num)) return '—';
        if (num <= 1) return `${Math.round(num * 100)}%`;
        return `${Math.round(num)}%`;
    };

    const metricLabel = (() => {
        switch (category) {
            case 'score':
                return t('leaderboard.totalPoints');
            case 'accuracy':
                return t('leaderboard.accuracy');
            case 'games':
                return t('leaderboard.gamesPlayed');
            case 'averageTime':
                return t('leaderboard.averageTime');
            default:
                return t('leaderboard.totalPoints');
        }
    })();

    const getMetricValue = (row) => {
        switch (category) {
            case 'score':
                return row.totalPoints ?? 0;
            case 'accuracy':
                return formatAccuracy(row.accuracy);
            case 'games':
                return row.gamesPlayed ?? 0;
            case 'averageTime':
                return formatSeconds(row.averageTimeSeconds);
            default:
                return row.totalPoints ?? 0;
        }
    };

    const rankSummaryMetric = (() => {
        switch (category) {
            case 'score':
                return { label: t('leaderboard.yourPoints'), value: userRank?.totalPoints ?? '—' };
            case 'accuracy':
                return { label: t('leaderboard.yourAccuracy'), value: formatAccuracy(userRank?.accuracy) };
            case 'games':
                return { label: t('leaderboard.yourGames'), value: userRank?.gamesPlayed ?? '—' };
            case 'averageTime':
                return {
                    label: t('leaderboard.yourAvgTime'),
                    value: userRank?.averageTimeSeconds != null ? formatSeconds(userRank.averageTimeSeconds) : '—',
                };
            default:
                return { label: t('leaderboard.yourPoints'), value: userRank?.totalPoints ?? '—' };
        }
    })();

    if (loading) {
        return (
            <div className="min-h-screen bg-sky-50 dark:bg-slate-900 flex items-center justify-center">
                <div className="text-center text-gray-500">{t('leaderboard.loading')}</div>
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
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('leaderboard.title')}</h1>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">{t('leaderboard.subtitle')}</p>
                            </div>
                            <button
                                onClick={() => navigate('/user-panel')}
                                className="text-sky-600 hover:text-sky-500 font-medium"
                            >
                                {t('leaderboard.backToPanel')}
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
                                    {t('leaderboard.timeRange')}
                                </label>
                                <select
                                    value={timeRange}
                                    onChange={(e) => setTimeRange(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-sky-500 focus:border-sky-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                >
                                    <option value="daily">{t('leaderboard.daily')}</option>
                                    <option value="weekly">{t('leaderboard.weekly')}</option>
                                    <option value="monthly">{t('leaderboard.monthly')}</option>
                                    <option value="alltime">{t('leaderboard.alltime')}</option>
                                </select>
                            </div>

                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t('leaderboard.category')}
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-sky-500 focus:border-sky-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                >
                                    <option value="score">{t('leaderboard.totalScore')}</option>
                                    <option value="accuracy">{t('leaderboard.accuracy')}</option>
                                    <option value="games">{t('leaderboard.gamesPlayed')}</option>
                                    <option value="averageTime">{t('leaderboard.averageTime')}</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                <span className="font-semibold">{t('leaderboard.yourRank')}</span> {userRank?.rank ?? '—'}
                            </div>
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                <span className="font-semibold">{t('leaderboard.totalUsers')}</span> {userRank?.totalUsers ?? '—'}
                            </div>
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                <span className="font-semibold">{rankSummaryMetric.label}:</span> {rankSummaryMetric.value}
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        {leaderboard.length === 0 ? (
                            <div className="text-center text-gray-500">{t('leaderboard.noResults')}</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead>
                                        <tr className="text-left border-b border-gray-200 dark:border-slate-700">
                                            <th className="py-2 pr-4">{t('leaderboard.rank')}</th>
                                            <th className="py-2 pr-4">{t('leaderboard.player')}</th>
                                            <th className="py-2 pr-4">{metricLabel}</th>
                                            <th className="py-2 pr-4">{t('leaderboard.correctAnswers')}</th>
                                            <th className="py-2 pr-4">{t('leaderboard.totalPoints')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {leaderboard.map((row) => (
                                            <tr
                                                key={row.userId ?? `${row.rank}-${row.displayName}`}
                                                className="border-b border-gray-100 dark:border-slate-700"
                                            >
                                                <td className={`py-2 pr-4 font-semibold ${getRankColor(row.rank)}`}>
                                                    {getRankBadge(row.rank)}
                                                </td>
                                                <td className="py-2 pr-4 text-gray-900 dark:text-white">
                                                    {row.displayName ?? '—'}
                                                </td>
                                                <td className="py-2 pr-4 text-gray-900 dark:text-white">
                                                    {getMetricValue(row)}
                                                </td>
                                                <td className="py-2 pr-4 text-gray-900 dark:text-white">
                                                    {row.correctAnswers ?? 0}
                                                </td>
                                                <td className="py-2 pr-4 text-gray-900 dark:text-white">
                                                    {row.totalPoints ?? 0}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
