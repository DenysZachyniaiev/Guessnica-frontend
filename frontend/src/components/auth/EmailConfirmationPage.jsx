import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function EmailConfirmationPage() {
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const confirmEmail = async () => {
            const userId = searchParams.get('userId');
            const token = searchParams.get('token');

            if (!userId || !token) {
                setStatus('error');
                setMessage('Invalid confirmation link. Please try again.');
                return;
            }

            try {
                const response = await fetch(`/auth/confirm-email?userId=${userId}&token=${encodeURIComponent(token)}`);
                const data = await response.json();

                if (response.ok) {
                    setStatus('success');
                    setMessage(data.message || 'Email confirmed successfully!');
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000);
                } else {
                    setStatus('error');
                    setMessage(data.message || 'Email confirmation failed.');
                }
            } catch (err) {
                setStatus('error');
                setMessage('Network error. Please try again later.');
            }
        };

        confirmEmail();
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen bg-sky-50 dark:bg-slate-900 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-sky-500 rounded-full flex items-center justify-center mb-4">
                        {status === 'loading' && (
                            <svg className="animate-spin h-8 w-8 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {status === 'success' && (
                            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                        {status === 'error' && (
                            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        {status === 'loading' && 'Confirming your email...'}
                        {status === 'success' && 'Email Confirmed!'}
                        {status === 'error' && 'Confirmation Failed'}
                    </h2>

                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        {message}
                    </p>

                    {status === 'success' && (
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                            Redirecting to login page...
                        </p>
                    )}

                    {status === 'error' && (
                        <button
                            onClick={() => navigate('/login')}
                            className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
                        >
                            Go to Login
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}