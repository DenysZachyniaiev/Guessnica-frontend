import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../assets/logo.png';

export default function Welcome() {
    const [darkMode, setDarkMode] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const isDark = localStorage.getItem('theme') === 'dark';
        setDarkMode(isDark);

        const handleStorageChange = () => {
            const isDark = localStorage.getItem('theme') === 'dark';
            setDarkMode(isDark);
        };

        window.addEventListener('storage', handleStorageChange);

        const interval = setInterval(() => {
            const isDark = localStorage.getItem('theme') === 'dark';
            setDarkMode(isDark);
        }, 100);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, []);

    return (
        <div className={`min-h-screen transition-colors duration-300 ${
            darkMode
                ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900'
                : 'bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50'
        }`}>
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-20">
                <div className="max-w-5xl mx-auto">
                    {/* Main Title */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-3 mb-6">
                            <img
                                src={logoImg}
                                alt="Guessnica"
                                className="h-40 w-auto"
                            />
                        </div>
                        <h1 className={`text-5xl md:text-7xl font-black mb-6 transition-colors duration-300 ${
                            darkMode
                                ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400'
                                : 'text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600'
                        }`}>
                            Welcome to Guessnica
                        </h1>
                        <p className={`text-xl md:text-2xl mb-8 transition-colors duration-300 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                            Test your geography skills with daily location challenges
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button
                                onClick={() => navigate('/login')}
                                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl ${
                                    darkMode
                                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/50'
                                        : 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-900/30'
                                }`}
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 border-2 ${
                                    darkMode
                                        ? 'border-blue-500 text-blue-400 hover:bg-blue-500/10'
                                        : 'border-sky-600 text-sky-700 hover:bg-sky-50'
                                }`}
                            >
                                Create Account
                            </button>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-3 gap-6 mb-16">
                        <div className={`p-6 rounded-xl transition-all duration-300 ${
                            darkMode
                                ? 'bg-gray-800/50 border-2 border-gray-700 hover:border-blue-600'
                                : 'bg-white border-2 border-gray-200 hover:border-sky-400 shadow-lg'
                        }`}>
                            <div className="text-4xl mb-4">🌍</div>
                            <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Daily Challenges
                            </h3>
                            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                New location puzzles every day to test your knowledge
                            </p>
                        </div>

                        <div className={`p-6 rounded-xl transition-all duration-300 ${
                            darkMode
                                ? 'bg-gray-800/50 border-2 border-gray-700 hover:border-blue-600'
                                : 'bg-white border-2 border-gray-200 hover:border-sky-400 shadow-lg'
                        }`}>
                            <div className="text-4xl mb-4">🏆</div>
                            <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Compete & Win
                            </h3>
                            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                Climb the leaderboard and become the top guesser
                            </p>
                        </div>

                        <div className={`p-6 rounded-xl transition-all duration-300 ${
                            darkMode
                                ? 'bg-gray-800/50 border-2 border-gray-700 hover:border-blue-600'
                                : 'bg-white border-2 border-gray-200 hover:border-sky-400 shadow-lg'
                        }`}>
                            <div className="text-4xl mb-4">📍</div>
                            <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Track Progress
                            </h3>
                            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                Monitor your stats and improve your geography skills
                            </p>
                        </div>
                    </div>

                    {/* How It Works */}
                    <div className={`p-8 rounded-2xl transition-colors duration-300 ${
                        darkMode
                            ? 'bg-gray-800/50 border-2 border-gray-700'
                            : 'bg-white border-2 border-gray-200 shadow-xl'
                    }`}>
                        <h2 className={`text-3xl font-black mb-8 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            How It Works
                        </h2>
                        <div className="grid md:grid-cols-4 gap-6">
                            <div className="text-center">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold ${
                                    darkMode
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-sky-500 text-white'
                                }`}>
                                    1
                                </div>
                                <h4 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    View Challenge
                                </h4>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    See the daily location photo
                                </p>
                            </div>

                            <div className="text-center">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold ${
                                    darkMode
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-sky-500 text-white'
                                }`}>
                                    2
                                </div>
                                <h4 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    Make Your Guess
                                </h4>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Click on the map to guess
                                </p>
                            </div>

                            <div className="text-center">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold ${
                                    darkMode
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-sky-500 text-white'
                                }`}>
                                    3
                                </div>
                                <h4 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    Get Your Score
                                </h4>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    See how close you were
                                </p>
                            </div>

                            <div className="text-center">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold ${
                                    darkMode
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-sky-500 text-white'
                                }`}>
                                    4
                                </div>
                                <h4 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    Climb Rankings
                                </h4>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Compete with others
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="text-center mt-16">
                        <p className={`text-lg mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Ready to start your geography adventure?
                        </p>
                        <button
                            onClick={() => navigate('/register')}
                            className={`px-10 py-5 rounded-xl font-black text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl ${
                                darkMode
                                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white'
                                    : 'bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white'
                            }`}
                        >
                            Get Started Now
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className={`border-t py-8 transition-colors duration-300 ${
                darkMode
                    ? 'border-gray-800 bg-gray-900/50'
                    : 'border-gray-200 bg-white/50'
            }`}>
                <div className="container mx-auto px-4 text-center">
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                        © 2026 Guessnica. Test your geography knowledge daily.
                    </p>
                </div>
            </footer>
        </div>
    );
}