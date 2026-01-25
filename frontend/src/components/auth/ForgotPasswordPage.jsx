import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function ForgotPasswordPage() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082';
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [step, setStep] = useState(1); // 1=email, 2=code, 3=new password
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [resetSessionId, setResetSessionId] = useState(null);
    const [newPassword, setNewPassword] = useState('');

    const handleRequestReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const res = await fetch(`${API_BASE_URL}/auth/password/request-reset`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            await res.json();
            setSuccess(t('auth.forgotPassword.resetCodeSent'));
            setStep(2);
        } catch {
            setError(t('auth.forgotPassword.cannotConnect'));
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${API_BASE_URL}/auth/password/verify-reset-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data);

            setResetSessionId(data.resetSessionId);
            setStep(3);
        } catch (err) {
            setError(err.message || t('auth.forgotPassword.invalidCode'));
        } finally {
            setLoading(false);
        }
    };

    const handleSetNewPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${API_BASE_URL}/auth/password/set-new-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    resetSessionId,
                    newPassword
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data);

            setSuccess(t('auth.forgotPassword.passwordResetSuccess'));
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.message || t('auth.forgotPassword.resetFailed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
                    {t('auth.forgotPassword.resetPassword')}
                </h1>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
                        {success}
                    </div>
                )}

                {/* STEP 1 */}
                {step === 1 && (
                    <form onSubmit={handleRequestReset} className="space-y-4">
                        <input
                            type="email"
                            placeholder={t('auth.forgotPassword.emailPlaceholder')}
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 
                                     bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                        />
                        <button
                            disabled={loading}
                            className="w-full bg-sky-600 text-white py-3 rounded-lg font-medium hover:bg-sky-700"
                        >
                            {t('auth.forgotPassword.sendResetCode')}
                        </button>
                    </form>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <form onSubmit={handleVerifyCode} className="space-y-4">
                        <input
                            type="text"
                            placeholder={t('auth.forgotPassword.codePlaceholder')}
                            value={code}
                            onChange={e => setCode(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 
                                     bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                        />
                        <button
                            disabled={loading}
                            className="w-full bg-sky-600 text-white py-3 rounded-lg font-medium hover:bg-sky-700"
                        >
                            {t('auth.forgotPassword.verifyCode')}
                        </button>
                    </form>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                    <form onSubmit={handleSetNewPassword} className="space-y-4">
                        <input
                            type="password"
                            placeholder={t('auth.forgotPassword.newPasswordPlaceholder')}
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 
                                     bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                        />
                        <button
                            disabled={loading}
                            className="w-full bg-sky-600 text-white py-3 rounded-lg font-medium hover:bg-sky-700"
                        >
                            {t('auth.forgotPassword.setNewPassword')}
                        </button>
                    </form>
                )}

                <button
                    onClick={() => navigate('/login')}
                    className="mt-6 w-full text-sm text-sky-600 hover:underline"
                >
                    {t('auth.forgotPassword.backToLogin')}
                </button>
            </div>
        </div>
    );
}
