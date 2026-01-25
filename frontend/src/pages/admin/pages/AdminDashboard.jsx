import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ totalUsers: 0, totalRiddles: 0, activeUsers: 0, totalSubmissions: 0, avgAnswersPerUser: 0, avgRiddlesAnswered: 0 });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [userStatsRes, riddleStatsRes] = await Promise.all([
                fetch('/admin/users/stats', { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` } }),
                fetch('/admin/riddles/stats', { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` } })
            ]);

            if (!userStatsRes.ok || !riddleStatsRes.ok) {
                throw new Error('Failed to fetch admin stats');
            }

            const userStatsRaw = await userStatsRes.json();
            const riddleStatsRaw = await riddleStatsRes.json();

            // bezpieczeństwo: jeśli backend zwróci obiekt zamiast listy
            const userStats = Array.isArray(userStatsRaw) ? userStatsRaw : [];
            const riddleStats = Array.isArray(riddleStatsRaw) ? riddleStatsRaw : [];

            const totalSubmissions = riddleStats.reduce((sum, r) => sum + (r.timesAnswered ?? 0), 0);
            const usersWhoAnswered = userStats.filter(u => (u.riddlesAnswered ?? 0) > 0).length;
            const avgAnswersPerUser =
                usersWhoAnswered > 0 ? totalSubmissions / usersWhoAnswered : 0;
            const avgRiddlesAnswered =
                usersWhoAnswered > 0
                    ? userStats.reduce((sum, u) => sum + (u.riddlesAnswered ?? 0), 0) / usersWhoAnswered
                    : 0;

            setStats({
                totalUsers: userStats.length,
                totalRiddles: riddleStats.length,
                activeUsers: userStats.length,
                totalSubmissions,
                avgAnswersPerUser,
                avgRiddlesAnswered
            });
        } catch (err) {
            console.error('Failed to fetch stats:', err);
            setStats({
                totalUsers: 0,
                totalRiddles: 0,
                activeUsers: 0,
                totalSubmissions: 0,
                avgAnswersPerUser: 0,
                avgRiddlesAnswered: 0
            });
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{t('admin.adminDashboard.title')}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard icon={<UsersIcon />} title={t('admin.adminDashboard.totalUsers')} value={stats.totalUsers} bgColor="bg-sky-500" />
                <StatCard icon={<CheckIcon />} title={t('admin.adminDashboard.activeUsers')} value={stats.activeUsers} bgColor="bg-green-500" />
                <StatCard icon={<PuzzleIcon />} title={t('admin.adminDashboard.totalRiddles')} value={stats.totalRiddles} bgColor="bg-purple-500" />
                <StatCard icon={<DocumentIcon />} title={t('admin.adminDashboard.totalSubmissions')} value={stats.totalSubmissions} bgColor="bg-yellow-500" />
            </div>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4"> User Engagement </h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-sky-50 dark:bg-sky-900/20 rounded-lg">
                            <span className="text-sm text-gray-600 dark:text-gray-400">{t('admin.adminDashboard.avgAnswersPerUser')}</span>
                            <span className="text-lg font-bold text-gray-900 dark:text-white"> {stats.avgAnswersPerUser.toFixed(1)} </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <span className="text-sm text-gray-600 dark:text-gray-400">{t('admin.adminDashboard.avgRiddlesPerUser')}</span>
                            <span className="text-lg font-bold text-gray-900 dark:text-white"> {stats.avgRiddlesAnswered.toFixed(1)} </span>
                        </div>
                    </div>
                    {stats.avgRiddlesAnswered < stats.totalRiddles * 0.3 && stats.totalRiddles > 0 && (
                        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">{t('admin.adminDashboard.lowEngagementTip')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, title, value, bgColor }) {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
            <div className="flex items-center">
                <div className={`flex-shrink-0 ${bgColor} rounded-md p-3`}>
                    {icon}
                </div>
                <div className="ml-5 w-0 flex-1">
                    <dl>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate"> {title} </dt>
                        <dd className="text-lg font-medium text-gray-900 dark:text-white"> {value} </dd>
                    </dl>
                </div>
            </div>
        </div>
    );
}

// QuickAction removed per UX decision.

function UsersIcon() {
    return (
        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    );
}

function CheckIcon() {
    return (
        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

function PuzzleIcon() {
    return (
        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
    );
}

function DocumentIcon() {
    return (
        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    );
}