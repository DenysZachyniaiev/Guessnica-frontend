import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function UserSettings() {
    const [settings, setSettings] = useState({
        notifications: {
            emailNotifications: true,
            gameReminders: true,
            weeklyStats: false,
            newFeatures: true
        },
        privacy: {
            showProfilePublicly: true,
            showStatisticsPublicly: true,
            allowFriendRequests: true
        },
        preferences: {
            autoPlayNextRiddle: false,
            showDistanceInKm: true,
            showTimer: true,
            soundEffects: true
        }
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        fetchUserSettings();
    }, []);

    const fetchUserSettings = async () => {
        try {
            const token = localStorage.getItem('jwt');
            const response = await fetch('/users/me/settings', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setSettings(data);
            }
        } catch (err) {
            console.error('Failed to fetch user settings');
        }
    };

    const handleSaveSettings = async () => {
        setLoading(true);
        setMessage('');

        try {
            const token = localStorage.getItem('jwt');
            const response = await fetch('/users/me/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(settings)
            });

            if (response.ok) {
                setMessage(t('userSettings.settingsSaved'));
            } else {
                setMessage(t('userSettings.settingsError'));
            }
        } catch (err) {
            setMessage('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [key]: value
            }
        }));
    };

    const handlePrivacyChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            privacy: {
                ...prev.privacy,
                [key]: value
            }
        }));
    };

    const handlePreferenceChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                [key]: value
            }
        }));
    };

    return (
        <div className="min-h-screen bg-sky-50 dark:bg-slate-900">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white dark:bg-slate-800 shadow-lg rounded-lg">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {t('userSettings.title')}
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                    {t('userSettings.subtitle')}
                                </p>
                            </div>
                            <button
                                onClick={() => navigate('/user-panel')}
                                className="text-sky-600 hover:text-sky-500 font-medium"
                            >
                                {t('userSettings.backToPanel')}
                            </button>
                        </div>
                    </div>

                    {message && (
                        <div className={`px-6 py-4 text-center ${
                            message.includes('success') 
                                ? 'bg-green-50 text-green-700' 
                                : 'bg-red-50 text-red-700'
                        }`}>
                            {message}
                        </div>
                    )}

                    <div className="p-6 space-y-8">
                        {/* Notifications */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                {t('userSettings.notifications')}
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {t('userSettings.emailNotifications')}
                                        </label>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Receive email updates about your account
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={settings.notifications.emailNotifications}
                                        onChange={(e) => handleNotificationChange('emailNotifications', e.target.checked)}
                                        className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {t('userSettings.gameReminders')}
                                        </label>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Get reminded to play daily riddles
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={settings.notifications.gameReminders}
                                        onChange={(e) => handleNotificationChange('gameReminders', e.target.checked)}
                                        className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {t('userSettings.weeklyStats')}
                                        </label>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Receive weekly performance summary
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={settings.notifications.weeklyStats}
                                        onChange={(e) => handleNotificationChange('weeklyStats', e.target.checked)}
                                        className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {t('userSettings.newFeatures')}
                                        </label>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Be notified about new game features
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={settings.notifications.newFeatures}
                                        onChange={(e) => handleNotificationChange('newFeatures', e.target.checked)}
                                        className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Privacy */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                {t('userSettings.privacy')}
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {t('userSettings.publicProfile')}
                                        </label>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Allow others to see your profile
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={settings.privacy.showProfilePublicly}
                                        onChange={(e) => handlePrivacyChange('showProfilePublicly', e.target.checked)}
                                        className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {t('userSettings.publicStatistics')}
                                        </label>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {t('userSettings.showYourGameStatisticsPublicly')}
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={settings.privacy.showStatisticsPublicly}
                                        onChange={(e) => handlePrivacyChange('showStatisticsPublicly', e.target.checked)}
                                        className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {t('userSettings.friendRequests')}
                                        </label>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {t('userSettings.allowOtherUsersToSendFriendRequests')}
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={settings.privacy.allowFriendRequests}
                                        onChange={(e) => handlePrivacyChange('allowFriendRequests', e.target.checked)}
                                        className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Game Preferences */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                {t('userSettings.preferences')}
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {t('userSettings.autoPlayNextRiddle')}
                                        </label>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {t('userSettings.automaticallyStartNextRiddleAfterCompletingOne')}
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={settings.preferences.autoPlayNextRiddle}
                                        onChange={(e) => handlePreferenceChange('autoPlayNextRiddle', e.target.checked)}
                                        className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {t('userSettings.distanceInKilometers')}
                                        </label>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {t('userSettings.showDistancesInKilometersInsteadOfMiles')}
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={settings.preferences.showDistanceInKm}
                                        onChange={(e) => handlePreferenceChange('showDistanceInKm', e.target.checked)}
                                        className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {t('userSettings.showTimer')}
                                        </label>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Display timer during gameplay
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={settings.preferences.showTimer}
                                        onChange={(e) => handlePreferenceChange('showTimer', e.target.checked)}
                                        className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {t('userSettings.soundEffects')}
                                        </label>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Enable sound effects in the game
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={settings.preferences.soundEffects}
                                        onChange={(e) => handlePreferenceChange('soundEffects', e.target.checked)}
                                        className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end">
                            <button
                                onClick={handleSaveSettings}
                                disabled={loading}
                                className="bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? t('userSettings.saving') : t('userSettings.saveSettings')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
