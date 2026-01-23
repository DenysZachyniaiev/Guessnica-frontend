import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ThemeCustomizer from './ThemeCustomizer';

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [showThemeCustomizer, setShowThemeCustomizer] = useState(false);
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        const isDark = localStorage.getItem('theme') === 'dark';
        setDarkMode(isDark);

        const observer = new MutationObserver(() => {
            const isDark = document.documentElement.classList.contains('dark');
            setDarkMode(isDark);
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        return () => observer.disconnect();
    }, []);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem('theme', newMode ? 'dark' : 'light');
        const root = document.documentElement;
        newMode ? root.classList.add('dark') : root.classList.remove('dark');
    };

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('lang', lang);
    };

    const handleLogout = () => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('jwt_expires');
        setIsLoggedIn(false);
        setIsMobileMenuOpen(false);
        setIsDropdownOpen(false);
        navigate('/welcome');
    };

    const mobileMenuHeightClass = isMobileMenuOpen ? 'max-h-screen' : 'max-h-0';
    const dropdownVisibilityClass = isDropdownOpen ? 'block' : 'hidden';
    const topBarClass = isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : '';
    const middleBarClass = isMobileMenuOpen ? 'opacity-0' : '';
    const bottomBarClass = isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : '';

    return (
        <header className="relative z-50">
            <nav className={`shadow-xl backdrop-blur-lg border-b transition-colors duration-300 ${
                darkMode
                    ? 'bg-gray-900/95 border-gray-800'
                    : 'bg-white/95 border-gray-200'
            }`}>
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between w-full">
                        {/* Logo */}
                        <Link
                            to="/welcome"
                            className={`py-4 px-2 flex items-center gap-2 transition-all duration-200 hover:scale-105 ${
                                darkMode ? 'text-white' : 'text-gray-900'
                            }`}
                        >
                            <svg className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-sky-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-2xl font-black tracking-tight">Guessnica</span>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex flex-row items-center justify-end gap-2">
                            {isLoggedIn ? (
                                <>
                                    <Link
                                        to="/guess"
                                        className={`py-2 px-4 text-sm font-semibold transition-all duration-200 rounded-lg ${
                                            darkMode
                                                ? 'hover:bg-gray-800 text-gray-300 hover:text-white'
                                                : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                                        }`}
                                    >
                                        Guess
                                    </Link>
                                    <Link
                                        to="/user-panel"
                                        className={`py-2 px-4 text-sm font-semibold transition-all duration-200 rounded-lg ${
                                            darkMode
                                                ? 'hover:bg-gray-800 text-gray-300 hover:text-white'
                                                : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                                        }`}
                                    >
                                        User Panel
                                    </Link>
                                    <Link
                                        to="/leaderboard"
                                        className={`py-2 px-4 text-sm font-semibold transition-all duration-200 rounded-lg ${
                                            darkMode
                                                ? 'hover:bg-gray-800 text-gray-300 hover:text-white'
                                                : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                                        }`}
                                    >
                                        Leaderboard
                                    </Link>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    className={`py-2.5 px-6 text-sm font-bold rounded-lg transition-all duration-200 shadow-md hover:scale-105 ${
                                        darkMode
                                            ? 'bg-blue-600 hover:bg-blue-500 text-white'
                                            : 'bg-sky-600 hover:bg-sky-500 text-white'
                                    }`}
                                >
                                    Sign In
                                </Link>
                            )}

                            {/* Settings Dropdown */}
                            <div className="relative ml-2">
                                <button
                                    type="button"
                                    className={`py-2 px-4 text-sm font-semibold transition-all duration-200 flex items-center gap-2 rounded-lg ${
                                        darkMode
                                            ? 'hover:bg-gray-800 text-gray-300'
                                            : 'hover:bg-gray-100 text-gray-700'
                                    }`}
                                    onClick={toggleDropdown}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>Settings</span>
                                </button>
                                <div className={`dropdown-menu absolute right-0 top-full mt-3 ${dropdownVisibilityClass} rounded-2xl w-72 shadow-2xl overflow-hidden z-50 transition-colors duration-300 ${
                                    darkMode
                                        ? 'bg-gray-800 border-2 border-gray-700'
                                        : 'bg-white border-2 border-gray-200'
                                }`}>
                                    {isLoggedIn && (
                                        <Link
                                            to="/user-settings"
                                            className={`flex items-center gap-3 px-5 py-3 transition-all duration-200 text-sm ${
                                                darkMode
                                                    ? 'hover:bg-gray-700 text-gray-300'
                                                    : 'hover:bg-gray-50 text-gray-700'
                                            }`}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                            </svg>
                                            <span>General Settings</span>
                                        </Link>
                                    )}

                                    {/* Language Switcher */}
                                    <div className={`px-5 py-4 ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Language</span>
                                            <span className={`text-xs px-2.5 py-1 rounded-full ${darkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-sky-100 text-sky-700'}`}>
                                                {i18n.language.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className={`relative rounded-full p-1 flex items-center ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                                            <div className={`absolute top-1 left-1 w-[calc(50%-0.25rem)] h-[calc(100%-0.5rem)] rounded-full transition-transform duration-300 ${
                                                darkMode ? 'bg-blue-600' : 'bg-white'
                                            } ${i18n.language === 'pl' ? 'translate-x-full' : 'translate-x-0'}`}></div>
                                            <button
                                                onClick={() => changeLanguage('en')}
                                                className={`flex-1 py-2 z-10 text-sm font-medium transition-colors ${
                                                    i18n.language === 'en'
                                                        ? 'text-white'
                                                        : darkMode ? 'text-gray-400' : 'text-gray-600'
                                                }`}
                                            >
                                                🇬🇧 EN
                                            </button>
                                            <button
                                                onClick={() => changeLanguage('pl')}
                                                className={`flex-1 py-2 z-10 text-sm font-medium transition-colors ${
                                                    i18n.language === 'pl'
                                                        ? 'text-white'
                                                        : darkMode ? 'text-gray-400' : 'text-gray-600'
                                                }`}
                                            >
                                                🇵🇱 PL
                                            </button>
                                        </div>
                                    </div>

                                    {/* Theme Switcher */}
                                    <div className="px-5 py-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Theme</span>
                                            <span className={`text-xs px-2.5 py-1 rounded-full ${darkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-sky-100 text-sky-700'}`}>
                                                {darkMode ? 'Dark' : 'Light'}
                                            </span>
                                        </div>
                                        <div className={`relative rounded-full p-1 flex items-center ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                                            <div className={`absolute top-1 left-1 w-[calc(50%-0.25rem)] h-[calc(100%-0.5rem)] rounded-full transition-transform duration-300 ${
                                                darkMode ? 'bg-blue-600' : 'bg-white'
                                            } ${darkMode ? 'translate-x-full' : 'translate-x-0'}`}></div>
                                            <button
                                                onClick={() => darkMode && toggleDarkMode()}
                                                className={`flex-1 py-2 z-10 text-sm font-medium transition-colors ${
                                                    !darkMode
                                                        ? darkMode ? 'text-gray-900' : 'text-gray-900'
                                                        : darkMode ? 'text-gray-400' : 'text-gray-600'
                                                }`}
                                            >
                                                Light
                                            </button>
                                            <button
                                                onClick={() => !darkMode && toggleDarkMode()}
                                                className={`flex-1 py-2 z-10 text-sm font-medium transition-colors ${
                                                    darkMode
                                                        ? 'text-white'
                                                        : darkMode ? 'text-gray-400' : 'text-gray-600'
                                                }`}
                                            >
                                                Dark
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => { setShowThemeCustomizer(true); setIsDropdownOpen(false); }}
                                            className={`w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                                darkMode
                                                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                            }`}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                            </svg>
                                            <span>Customize Theme</span>
                                        </button>
                                    </div>

                                    {isLoggedIn && (
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center justify-center gap-2 px-5 py-4 hover:bg-red-500 text-sm font-medium mt-1 text-red-600 hover:text-white transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            <span>Logout</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Hamburger Button */}
                        <div className="md:hidden flex items-center">
                            <button
                                type="button"
                                className={`p-4 rounded-lg transition-all ${
                                    darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                                }`}
                                onClick={toggleMobileMenu}
                            >
                                <div className="flex flex-col justify-between w-5 h-4">
                                    <div className={`h-0.5 w-full rounded transition-all ${
                                        darkMode ? 'bg-white' : 'bg-gray-900'
                                    } ${topBarClass}`}></div>
                                    <div className={`h-0.5 w-full rounded transition-all ${
                                        darkMode ? 'bg-white' : 'bg-gray-900'
                                    } ${middleBarClass}`}></div>
                                    <div className={`h-0.5 w-full rounded transition-all ${
                                        darkMode ? 'bg-white' : 'bg-gray-900'
                                    } ${bottomBarClass}`}></div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div className={`${mobileMenuHeightClass} overflow-hidden transition-all duration-500 flex flex-col items-center md:hidden shadow-lg ${
                darkMode ? 'bg-gray-900' : 'bg-white'
            }`}>
                {isLoggedIn ? (
                    <>
                        <Link
                            to="/"
                            className={`py-2.5 px-4 m-1 text-sm font-medium block text-center w-11/12 rounded-lg transition-colors ${
                                darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                            }`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/guess"
                            className={`py-2.5 px-4 m-1 text-sm font-medium block text-center w-11/12 rounded-lg transition-colors ${
                                darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                            }`}
                        >
                            Guess
                        </Link>
                        <Link
                            to="/user-panel"
                            className={`py-2.5 px-4 m-1 text-sm font-medium block text-center w-11/12 rounded-lg transition-colors ${
                                darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                            }`}
                        >
                            User Panel
                        </Link>
                        <Link
                            to="/leaderboard"
                            className={`py-2.5 px-4 m-1 text-sm font-medium block text-center w-11/12 rounded-lg transition-colors ${
                                darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                            }`}
                        >
                            Leaderboard
                        </Link>
                    </>
                ) : (
                    <Link
                        to="/login"
                        className={`py-2.5 px-6 m-2 text-sm font-bold rounded-lg block text-center w-11/12 ${
                            darkMode ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-sky-600 hover:bg-sky-500 text-white'
                        }`}
                    >
                        Sign In
                    </Link>
                )}

                {/* Mobile Settings Toggle */}
                <button
                    onClick={toggleDropdown}
                    className={`py-2.5 px-4 m-1 text-sm font-medium flex items-center justify-center gap-2 w-11/12 rounded-lg transition-colors ${
                        darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                    }`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Settings</span>
                </button>

                {isDropdownOpen && (
                    <div className={`w-11/12 rounded-lg mb-2 ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                        {isLoggedIn && (
                            <Link
                                to="/user-settings"
                                className={`flex items-center gap-3 px-5 py-3 transition-all duration-200 text-sm rounded-t-lg ${
                                    darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                                }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                </svg>
                                <span>General Settings</span>
                            </Link>
                        )}

                        {/* Language Switcher */}
                        <div className="px-5 py-4">
                            <div className="flex items-center justify-between mb-3">
                                <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Language</span>
                                <span className={`text-xs px-2.5 py-1 rounded-full ${darkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-sky-100 text-sky-700'}`}>
                                    {i18n.language.toUpperCase()}
                                </span>
                            </div>
                            <div className={`relative rounded-full p-1 flex items-center ${darkMode ? 'bg-gray-900' : 'bg-gray-200'}`}>
                                <div className={`absolute top-1 left-1 w-[calc(50%-0.25rem)] h-[calc(100%-0.5rem)] rounded-full transition-transform duration-300 ${
                                    darkMode ? 'bg-blue-600' : 'bg-white'
                                } ${i18n.language === 'pl' ? 'translate-x-full' : 'translate-x-0'}`}></div>
                                <button
                                    onClick={() => changeLanguage('en')}
                                    className={`flex-1 py-2 z-10 text-sm font-medium ${
                                        i18n.language === 'en'
                                            ? 'text-white'
                                            : darkMode ? 'text-gray-400' : 'text-gray-600'
                                    }`}
                                >
                                    🇬🇧 EN
                                </button>
                                <button
                                    onClick={() => changeLanguage('pl')}
                                    className={`flex-1 py-2 z-10 text-sm font-medium ${
                                        i18n.language === 'pl'
                                            ? 'text-white'
                                            : darkMode ? 'text-gray-400' : 'text-gray-600'
                                    }`}
                                >
                                    🇵🇱 PL
                                </button>
                            </div>
                        </div>

                        {/* Theme Switcher */}
                        <div className="px-5 py-4">
                            <div className="flex items-center justify-between mb-3">
                                <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Theme</span>
                                <span className={`text-xs px-2.5 py-1 rounded-full ${darkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-sky-100 text-sky-700'}`}>
                                    {darkMode ? 'Dark' : 'Light'}
                                </span>
                            </div>
                            <div className={`relative rounded-full p-1 flex items-center ${darkMode ? 'bg-gray-900' : 'bg-gray-200'}`}>
                                <div className={`absolute top-1 left-1 w-[calc(50%-0.25rem)] h-[calc(100%-0.5rem)] rounded-full transition-transform duration-300 ${
                                    darkMode ? 'bg-blue-600' : 'bg-white'
                                } ${darkMode ? 'translate-x-full' : 'translate-x-0'}`}></div>
                                <button
                                    onClick={() => darkMode && toggleDarkMode()}
                                    className={`flex-1 py-2 z-10 text-sm font-medium ${
                                        !darkMode ? 'text-gray-900' : darkMode ? 'text-gray-400' : 'text-gray-600'
                                    }`}
                                >
                                    Light
                                </button>
                                <button
                                    onClick={() => !darkMode && toggleDarkMode()}
                                    className={`flex-1 py-2 z-10 text-sm font-medium ${
                                        darkMode ? 'text-white' : darkMode ? 'text-gray-400' : 'text-gray-600'
                                    }`}
                                >
                                    Dark
                                </button>
                            </div>
                            <button
                                onClick={() => { setShowThemeCustomizer(true); setIsDropdownOpen(false); setIsMobileMenuOpen(false); }}
                                className={`w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm ${
                                    darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                }`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                </svg>
                                <span>Customize Theme</span>
                            </button>
                        </div>

                        {isLoggedIn && (
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 px-5 py-4 text-sm font-medium rounded-b-lg text-red-600 hover:bg-red-500 hover:text-white transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span>Logout</span>
                            </button>
                        )}
                    </div>
                )}
            </div>

            <ThemeCustomizer isOpen={showThemeCustomizer} onClose={() => setShowThemeCustomizer(false)} />
        </header>
    );
};

export default Header;