import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ThemeCustomizer from './ThemeCustomizer';
import logoImg from '../../assets/logo.png';

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
        localStorage.removeItem('token');
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
        <header>
            <nav className="bg-sky-600 text-white shadow-lg">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between w-full">
                        {/* Logo */}
                        <Link to="/welcome" className="py-4 px-2 flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <span className="text-xl font-bold tracking-wide">Guessnica</span>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex flex-row items-center justify-end navigation-menu-bar gap-2">
                            {isLoggedIn ? (
                                <>
                                    <Link to="/welcome" className="py-2 px-4 text-sm font-medium transition-all duration-200 hover:bg-white/10 rounded-lg">Home</Link>
                                    <Link to="/guess" className="py-2 px-4 text-sm font-medium transition-all duration-200 hover:bg-white/10 rounded-lg">Guess</Link>
                                    <Link to="/profile" className="py-2 px-4 text-sm font-medium transition-all duration-200 hover:bg-white/10 rounded-lg">Profile</Link>
                                    <Link to="/user-panel" className="py-2 px-4 text-sm font-medium transition-all duration-200 hover:bg-white/10 rounded-lg">User Panel</Link>
                                    <Link to="/leaderboard" className="py-2 px-4 text-sm font-medium transition-all duration-200 hover:bg-white/10 rounded-lg">Leaderboard</Link>
                                    <Link to="/create-user" className="py-2 px-4 text-sm font-medium transition-all duration-200 hover:bg-white/10 rounded-lg">Create User</Link>
                                    <Link to="/create-admin" className="py-2 px-4 text-sm font-medium transition-all duration-200 hover:bg-white/10 rounded-lg">Create Admin</Link>
                                </>
                            ) : (
                                <Link to="/login" className="py-2.5 px-6 text-sm font-bold bg-white text-sky-600 rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-md">
                                    Sign In
                                </Link>
                            )}

                            {/* Settings Dropdown */}
                            <div className="relative ml-2">
                                <button type="button" className="dropdown-toggle py-2 px-4 text-sm font-medium transition-all duration-200 flex items-center gap-2 hover:bg-white/10 rounded-lg" onClick={toggleDropdown}>
                                    <span>⚙️</span><span>Settings</span>
                                </button>
                                <div className={`dropdown-menu absolute right-0 top-full mt-3 ${dropdownVisibilityClass} bg-sky-600 text-white rounded-xl w-72 shadow-2xl overflow-hidden z-50`}>
                                    {isLoggedIn && (
                                        <Link to="/settings" className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 transition-all duration-200 text-sm">
                                            <span>⚙️</span><span>General Settings</span>
                                        </Link>
                                    )}

                                    {/* Language Switcher */}
                                    <div className="px-5 py-4 bg-white/5">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-semibold">Language</span>
                                            <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full">{i18n.language.toUpperCase()}</span>
                                        </div>
                                        <div className="relative bg-white/10 rounded-full p-1 flex items-center">
                                            <div className={`absolute top-1 left-1 w-[calc(50%-0.25rem)] h-[calc(100%-0.5rem)] bg-white rounded-full transition-transform duration-300 ${i18n.language === 'pl' ? 'translate-x-full' : 'translate-x-0'}`}></div>
                                            <button onClick={() => changeLanguage('en')} className={`flex-1 py-2 z-10 text-sm font-medium ${i18n.language === 'en' ? 'text-sky-600' : 'text-white'}`}>🇬🇧 EN</button>
                                            <button onClick={() => changeLanguage('pl')} className={`flex-1 py-2 z-10 text-sm font-medium ${i18n.language === 'pl' ? 'text-sky-600' : 'text-white'}`}>🇵🇱 PL</button>
                                        </div>
                                    </div>

                                    {/* Theme Switcher */}
                                    <div className="px-5 py-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-semibold">Theme</span>
                                            <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full">{darkMode ? 'Dark' : 'Light'}</span>
                                        </div>
                                        <div className="relative bg-white/10 rounded-full p-1 flex items-center">
                                            <div className={`absolute top-1 left-1 w-[calc(50%-0.25rem)] h-[calc(100%-0.5rem)] bg-white rounded-full transition-transform duration-300 ${darkMode ? 'translate-x-full' : 'translate-x-0'}`}></div>
                                            <button onClick={() => darkMode && toggleDarkMode()} className={`flex-1 py-2 z-10 text-sm font-medium ${!darkMode ? 'text-sky-600' : 'text-white'}`}>☀️ Light</button>
                                            <button onClick={() => !darkMode && toggleDarkMode()} className={`flex-1 py-2 z-10 text-sm font-medium ${darkMode ? 'text-sky-600' : 'text-white'}`}>🌙 Dark</button>
                                        </div>
                                        <button onClick={() => { setShowThemeCustomizer(true); setIsDropdownOpen(false); }} className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm">
                                            <span>🎨</span><span>Customize Theme</span>
                                        </button>
                                    </div>

                                    {isLoggedIn && (
                                        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-5 py-4 hover:bg-red-500/90 text-sm font-medium mt-1">
                                            <span>🚪</span><span>Logout</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Hamburger Button */}
                        <div className="md:hidden flex items-center">
                            <button type="button" className="p-4 hover:bg-white/10 rounded-lg transition-all" onClick={toggleMobileMenu}>
                                <div className="flex flex-col justify-between w-5 h-4">
                                    <div className={`bg-current h-0.5 w-full rounded transition-all ${topBarClass}`}></div>
                                    <div className={`bg-current h-0.5 w-full rounded transition-all ${middleBarClass}`}></div>
                                    <div className={`bg-current h-0.5 w-full rounded transition-all ${bottomBarClass}`}></div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div className={`${mobileMenuHeightClass} overflow-hidden transition-all duration-500 flex flex-col items-center bg-sky-600 md:hidden shadow-lg`}>
                {isLoggedIn ? (
                    <>
                        <Link to="/" className="py-2.5 px-4 m-1 text-sm font-medium block text-center w-11/12 hover:bg-white/10 rounded-lg">Home</Link>
                        <Link to="/guess" className="py-2.5 px-4 m-1 text-sm font-medium block text-center w-11/12 hover:bg-white/10 rounded-lg">Guess</Link>
                        <Link to="/profile" className="py-2.5 px-4 m-1 text-sm font-medium block text-center w-11/12 hover:bg-white/10 rounded-lg">Profile</Link>
                        <Link to="/user-panel" className="py-2.5 px-4 m-1 text-sm font-medium block text-center w-11/12 hover:bg-white/10 rounded-lg">User Panel</Link>
                        <Link to="/leaderboard" className="py-2.5 px-4 m-1 text-sm font-medium block text-center w-11/12 hover:bg-white/10 rounded-lg">Leaderboard</Link>
                        <Link to="/create-user" className="py-2.5 px-4 m-1 text-sm font-medium block text-center w-11/12 hover:bg-white/10 rounded-lg">Create User</Link>
                        <Link to="/create-admin" className="py-2.5 px-4 m-1 text-sm font-medium block text-center w-11/12 hover:bg-white/10 rounded-lg">Create Admin</Link>
                    </>
                ) : (
                    <Link to="/login" className="py-2.5 px-6 m-2 text-sm font-bold bg-white text-sky-600 rounded-lg block text-center w-11/12">Sign In</Link>
                )}

                {/* Mobile Settings Toggle */}
                <button onClick={toggleDropdown} className="py-2.5 px-4 m-1 text-sm font-medium flex items-center justify-center gap-2 w-11/12 hover:bg-white/10 rounded-lg">
                    <span>⚙️</span><span>Settings</span>
                </button>

                {isDropdownOpen && (
                    <div className="w-11/12 bg-white/5 rounded-lg mb-2">
                        {isLoggedIn && (
                            <Link to="/settings" className="flex items-center gap-3 px-5 py-3 hover:bg-white/10 transition-all duration-200 text-sm rounded-t-lg">
                                <span>⚙️</span><span>General Settings</span>
                            </Link>
                        )}

                        {/* Language Switcher */}
                        <div className="px-5 py-4">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-semibold">Language</span>
                                <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full">{i18n.language.toUpperCase()}</span>
                            </div>
                            <div className="relative bg-white/10 rounded-full p-1 flex items-center">
                                <div className={`absolute top-1 left-1 w-[calc(50%-0.25rem)] h-[calc(100%-0.5rem)] bg-white rounded-full transition-transform duration-300 ${i18n.language === 'pl' ? 'translate-x-full' : 'translate-x-0'}`}></div>
                                <button onClick={() => changeLanguage('en')} className={`flex-1 py-2 z-10 text-sm font-medium ${i18n.language === 'en' ? 'text-sky-600' : 'text-white'}`}>🇬🇧 EN</button>
                                <button onClick={() => changeLanguage('pl')} className={`flex-1 py-2 z-10 text-sm font-medium ${i18n.language === 'pl' ? 'text-sky-600' : 'text-white'}`}>🇵🇱 PL</button>
                            </div>
                        </div>

                        {/* Theme Switcher */}
                        <div className="px-5 py-4">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-semibold">Theme</span>
                                <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full">{darkMode ? 'Dark' : 'Light'}</span>
                            </div>
                            <div className="relative bg-white/10 rounded-full p-1 flex items-center">
                                <div className={`absolute top-1 left-1 w-[calc(50%-0.25rem)] h-[calc(100%-0.5rem)] bg-white rounded-full transition-transform duration-300 ${darkMode ? 'translate-x-full' : 'translate-x-0'}`}></div>
                                <button onClick={() => darkMode && toggleDarkMode()} className={`flex-1 py-2 z-10 text-sm font-medium ${!darkMode ? 'text-sky-600' : 'text-white'}`}>☀️ Light</button>
                                <button onClick={() => !darkMode && toggleDarkMode()} className={`flex-1 py-2 z-10 text-sm font-medium ${darkMode ? 'text-sky-600' : 'text-white'}`}>🌙 Dark</button>
                            </div>
                            <button onClick={() => { setShowThemeCustomizer(true); setIsDropdownOpen(false); setIsMobileMenuOpen(false); }} className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm">
                                <span>🎨</span><span>Customize Theme</span>
                            </button>
                        </div>

                        {isLoggedIn && (
                            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-5 py-4 hover:bg-red-500/90 text-sm font-medium rounded-b-lg">
                                <span>🚪</span><span>Logout</span>
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