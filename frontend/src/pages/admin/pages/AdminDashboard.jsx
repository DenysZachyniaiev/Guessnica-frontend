import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalRiddles: 0,
        activeUsers: 0,
        pendingConfirmations: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/admin/dashboard/stats', {
            headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
        })
            .then(r => r.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch dashboard stats:', err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Admin Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-sky-500 rounded-md p-3">
                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                    Total Users
                                </dt>
                                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                    {stats.totalUsers}
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                    Active Users
                                </dt>
                                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                    {stats.activeUsers}
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                    Total Riddles
                                </dt>
                                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                    {stats.totalRiddles}
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                    Pending Confirmations
                                </dt>
                                <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                    {stats.pendingConfirmations}
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Recent Activity
                    </h2>
                    <div className="text-gray-500 dark:text-gray-400">
                        No recent activity to display.
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Quick Actions
                    </h2>
                    <div className="space-y-3">
                        {/* Use navigate to ensure routing works reliably inside admin layout */}
                        <QuickAction to="/admin/riddles" bg="bg-sky-50 dark:bg-sky-900/20" title="Add New Riddle" subtitle="Upload a new photo riddle" />
                        <QuickAction to="/admin/locations" bg="bg-orange-50 dark:bg-orange-900/20" title="Manage Locations" subtitle="Add and manage game locations" />
                        <QuickAction to="/admin/settings" bg="bg-indigo-50 dark:bg-indigo-900/20" title="Settings" subtitle="Game and system settings" />
                        <QuickAction to="/admin/stats" bg="bg-purple-50 dark:bg-purple-900/20" title="View Statistics" subtitle="Detailed game statistics" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function QuickAction({ to, bg, title, subtitle }) {
    const navigate = useNavigate();
    return (
        <button
            onClick={() => navigate(to)}
            className={`${bg} block w-full text-left px-4 py-3 rounded-lg hover:opacity-95 transition-colors text-left`}
        >
            <div className="font-medium text-gray-800 dark:text-gray-200">{title}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</div>
        </button>
    );
}
