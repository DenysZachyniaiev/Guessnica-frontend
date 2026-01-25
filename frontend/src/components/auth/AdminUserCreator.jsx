import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function AdminUserCreator() {
    const [formData, setFormData] = useState({
        email: '',
        displayName: '',
        password: '',
        confirmPassword: '',
        isAdmin: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (formData.password !== formData.confirmPassword) {
            setError(t('auth.register.passwordsNotMatch'));
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError(t('auth.register.passwordTooShort'));
            setLoading(false);
            return;
        }

        if (!formData.email.includes('@')) {
            setError(t('auth.register.emailValid'));
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    displayName: formData.displayName,
                    password: formData.password,
                    isAdmin: formData.isAdmin
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(t('auth.adminCreator.adminCreatedSuccess'));
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setError(data.message || t('auth.adminCreator.failedToCreate'));
            }
        } catch (err) {
            setError(t('auth.adminCreator.networkError'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-sky-50 dark:bg-slate-900 flex items-center justify-center py-12">
            <div className="max-w-2xl w-full space-y-8">
                <div className="bg-white dark:bg-slate-800 shadow-xl rounded-lg p-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            {t('auth.adminCreator.createAdminUser')}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            {t('auth.adminCreator.createAdminSubtitle')}
                        </p>
                    </div>

                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-center mb-6">
                            {success}
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center mb-6">
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t('auth.adminCreator.displayName')}
                                </label>
                                <input
                                    id="displayName"
                                    name="displayName"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    value={formData.displayName}
                                    onChange={handleChange}
                                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-sky-500 focus:border-sky-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-gray-400"
                                    placeholder={t('auth.adminCreator.displayNamePlaceholder')}
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t('auth.adminCreator.emailAddress')}
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-sky-500 focus:border-sky-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-gray-400"
                                    placeholder={t('auth.adminCreator.emailPlaceholder')}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t('auth.adminCreator.password')}
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-sky-500 focus:border-sky-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-gray-400"
                                    placeholder={t('auth.adminCreator.passwordPlaceholder')}
                                />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t('auth.adminCreator.confirmPassword')}
                                </label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-sky-500 focus:border-sky-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-gray-400"
                                    placeholder={t('auth.adminCreator.confirmPasswordPlaceholder')}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="isAdmin"
                                    name="isAdmin"
                                    checked={formData.isAdmin}
                                    onChange={(e) => setFormData({...formData, isAdmin: e.target.checked})}
                                    className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                                />
                                <label htmlFor="isAdmin" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Grant Admin Privileges
                                </label>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? t('auth.adminCreator.creating') : t('auth.adminCreator.createAdminButton')} User
                            </button>
                        </div>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="text-sky-600 hover:text-sky-500 text-sm font-medium"
                            >
                                Back to Home
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
