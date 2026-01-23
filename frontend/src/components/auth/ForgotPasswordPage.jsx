import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForgotPasswordPage() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082';
    const navigate = useNavigate();

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
            setSuccess('If the email exists, a reset code has been sent.');
            setStep(2);
        } catch {
            setError('Cannot connect to server.');
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
            setError(err.message || 'Invalid or expired code.');
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

            setSuccess('Password reset successfully. You can now sign in.');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.message || 'Failed to reset password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
                    Reset Password
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
                            placeholder="you@example.com"
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
                            Send reset code
                        </button>
                    </form>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <form onSubmit={handleVerifyCode} className="space-y-4">
                        <input
                            type="text"
                            placeholder="6-digit code"
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
                            Verify code
                        </button>
                    </form>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                    <form onSubmit={handleSetNewPassword} className="space-y-4">
                        <input
                            type="password"
                            placeholder="New password"
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
                            Set new password
                        </button>
                    </form>
                )}

                <button
                    onClick={() => navigate('/login')}
                    className="mt-6 w-full text-sm text-sky-600 hover:underline"
                >
                    Back to login
                </button>
            </div>
        </div>
    );
}
