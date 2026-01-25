import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function LoginPage({ setIsLoggedIn }) {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082';

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        if (localStorage.getItem('jwt')) {
            navigate('/welcome');
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const contentType = response.headers.get('content-type');

            if (!contentType || !contentType.includes('application/json')) {
                const textResponse = await response.text();
                throw new Error('Server returned invalid response. Please check if the API is running.');
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `Login failed with status: ${response.status}`);
            }

            if (data.token) {
                localStorage.setItem('jwt', data.token);
                localStorage.setItem('jwt_expires', data.expiresAt);

                setIsLoggedIn(true);

                navigate('/user-panel');
            } else {
                throw new Error('No token received from server');
            }
        } catch (err) {
            if (err.name === 'TypeError' && err.message.includes('fetch')) {
                setError(t('auth.login.cannotConnect'));
            } else {
                setError(err.message || t('auth.login.loginFailed'));
            }
        } finally {
            setLoading(false);
        }
    };

    const [fbLoaded, setFbLoaded] = useState(false);

    useEffect(() => {
        const checkFB = setInterval(() => {
            if (window.FB) {
                setFbLoaded(true);
                clearInterval(checkFB);
            }
        }, 100);
    }, []);

    const handleFacebookLogin = () => {
        if (!fbLoaded) {
            console.warn("FB SDK not loaded yet");
            return;
        }

        window.FB.login(function(response) {
            if (!response.authResponse) return;

            const accessToken = response.authResponse.accessToken;
            console.log("Facebook Access Token:", accessToken);
            
            fetch(`${API_BASE_URL}/auth/facebook`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accessToken }),
            })
                .then(res => res.json())
                .then(jwt => {
                    localStorage.setItem("jwt", jwt.accessToken);
                    window.location.href = "/";
                });
        }, { scope: "email,public_profile" });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        {t('auth.login.welcomeBack')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {t('auth.login.signInToAccount')}
                    </p>
                </div>

                {/* Login Form */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            >
                                {t('auth.login.emailAddress')}
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 
                                         bg-white dark:bg-slate-700 text-gray-900 dark:text-white
                                         focus:ring-2 focus:ring-sky-500 focus:border-transparent
                                         transition-colors"
                                placeholder="you@example.com"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            >
                                {t('auth.login.password')}
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 
                                         bg-white dark:bg-slate-700 text-gray-900 dark:text-white
                                         focus:ring-2 focus:ring-sky-500 focus:border-transparent
                                         transition-colors"
                                placeholder="••••••••"
                                disabled={loading}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                                />
                                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                    {t('auth.login.rememberMe')}
                                </span>
                            </label>
                            <button
                                type="button"
                                className="text-sm text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
                                onClick={() => navigate('/forgot-password')}
                            >
                                {t('auth.login.forgotPassword')}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-sky-600 text-white py-3 rounded-lg font-medium
                                     hover:bg-sky-700 focus:ring-4 focus:ring-sky-300
                                     transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="none"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    {t('auth.login.signingIn')}
                                </span>
                            ) : (
                                <span>{t('auth.login.signInButton')}</span>
                            )}
                        </button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300 dark:border-slate-600"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleFacebookLogin}
                            className="mt-6 w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-slate-600 
                                     rounded-lg shadow-sm bg-white dark:bg-slate-700 text-sm font-medium 
                                     text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600
                                     transition-colors"
                        >
                            <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                            Continue with Facebook
                        </button>
                    </div>

                    <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                        Don't have an account?{' '}
                        <button
                            onClick={() => navigate('/register')}
                            className="font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
                        >
                            Sign up
                        </button>
                    </p>
                </div>

                {/* Footer */}
                <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
                    By signing in, you agree to our{' '}
                    <button className="text-sky-600 hover:text-sky-700 dark:text-sky-400">
                        Terms of Service
                    </button>{' '}
                    and{' '}
                    <button className="text-sky-600 hover:text-sky-700 dark:text-sky-400">
                        Privacy Policy
                    </button>
                </p>
            </div>
        </div>
    );
}