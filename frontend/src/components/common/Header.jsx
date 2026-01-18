import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ThemeCustomizer from './ThemeCustomizer';

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [showThemeCustomizer, setShowThemeCustomizer] = useState(false);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const isDark = localStorage.getItem('theme') === 'dark';
        setDarkMode(isDark);
    }, []);

    const toggleMobileMenu = () => { setIsMobileMenuOpen(!isMobileMenuOpen); };
    const toggleDropdown = () => { setIsDropdownOpen(!isDropdownOpen); };
    
    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem('theme', newMode ? 'dark' : 'light');
        
        const root = document.documentElement;
        if (newMode) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    };

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('lang', lang);
    };

    const mobileMenuHeightClass = isMobileMenuOpen ? 'max-h-screen' : 'max-h-0';
    const dropdownVisibilityClass = isDropdownOpen ? 'block' : 'hidden';
    const topBarClass = isMobileMenuOpen ? 'rotate-45 translate-y-0' : '';
    const middleBarClass = isMobileMenuOpen ? 'opacity-0' : '';
    const bottomBarClass = isMobileMenuOpen ? '-rotate-45 -translate-y-0' : '';

    return (
        <header>
            <nav className="bg-sky-800 text-white border-b-2 border-gray-600">
                <div className="container mx-auto px-4 md:flex items-center gap-6">
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                            <div className="md:hidden flex items-center order-first">
                                <button
                                    type="button"
                                    className="mobile-menu-button p-6"
                                    onClick={toggleMobileMenu}
                                >
                                    <div className="flex flex-col justify-between w-5 h-4 transform transition-all duration-300 origin-center">
                                        <div className={`bg-current h-0.5 w-full rounded transform transition-all duration-300 origin-left ${topBarClass}`}></div>
                                        <div className={`bg-current h-0.5 w-full rounded transform transition-all duration-300 ${middleBarClass}`}></div>
                                        <div className={`bg-current h-0.5 w-full rounded transform transition-all duration-300 origin-left ${bottomBarClass}`}></div>
                                    </div>
                                </button>
                            </div>

                            <div className="hidden flex-row items-center justify-start navigation-menu-bar md:flex">
                                <Link to="/" className="py-2 px-3 block rounded transition-all duration-300 ease-in-out hover:bg-amber-300">Home (Content)</Link>
                                <Link to="/guess" className="py-2 px-3 block rounded transition-all duration-300 ease-in-out hover:bg-amber-300">Guess</Link>
                                <Link to="/profile" className="py-2 px-3 block rounded transition-all duration-300 ease-in-out hover:bg-amber-300">Profile</Link>
                                <Link to="/user-panel" className="py-2 px-3 block rounded transition-all duration-300 ease-in-out hover:bg-amber-300">User Panel</Link>
                                <Link to="/leaderboard" className="py-2 px-3 block rounded transition-all duration-300 ease-in-out hover:bg-amber-300">Leaderboard</Link>
                                <Link to="/create-user" className="py-2 px-3 block rounded transition-all duration-300 ease-in-out hover:bg-amber-300">Create User</Link>
                                <Link to="/create-admin" className="py-2 px-3 block rounded transition-all duration-300 ease-in-out hover:bg-amber-300">Create Admin</Link>

                                <div className=" hidden lg:flex relative text-center">
                                    <button
                                        type="button"
                                        onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                                        className="py-2 px-3 transition-all duration-300 ease-in-out hover:bg-amber-300 rounded flex items-center gap-2"
                                    >
                                        🌐 {i18n.language.toUpperCase()}
                                    </button>
                                    <div className={`absolute top-full left-0 mt-1 bg-white text-gray-800 rounded-lg shadow-lg overflow-hidden z-50 ${isLanguageDropdownOpen ? 'block' : 'hidden'}`}>
                                        <button
                                            onClick={() => {
                                                changeLanguage('en');
                                                setIsLanguageDropdownOpen(false);
                                            }}
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                                        >
                                            🇬🇧 English
                                        </button>
                                        <button
                                            onClick={() => {
                                                changeLanguage('pl');
                                                setIsLanguageDropdownOpen(false);
                                            }}
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                                        >
                                            🇵🇱 Polski
                                        </button>
                                    </div>
                                </div>

                                <div className="hidden lg:flex  items-center gap-2 ">
                                    <button
                                        onClick={toggleDarkMode}
                                        className="py-2 px-3 transition-all duration-300 ease-in-out hover:bg-amber-300 rounded flex items-center gap-2"
                                        title={darkMode ? t("ui.light") : t("ui.dark")}
                                    >
                                        {darkMode ? '☀️' : '🌙'}
                                    </button>
                                    <button
                                        onClick={() => setShowThemeCustomizer(true)}
                                        className="py-2 px-3 transition-all duration-300 ease-in-out hover:bg-amber-300 rounded"
                                        title="Customize Theme"
                                    >
                                        🎨
                                    </button>
                                </div>

                         

                    
                            </div>
                        </div>

                        <Link to="/" className="py-5 px-2 flex items-center">
                            <img
                                src="../../assets/logo_2.png"
                                alt="Guessnica" 
                                className="h-8 w-auto"
                            />
                        </Link>

                    </div>
                </div>
            </nav>

            <div
                id="mobile-menu-dropdown"
                className={`${mobileMenuHeightClass} overflow-hidden transition-all duration-500 ease-in-out flex-col items-center justify-center bg-sky-800 to-blue-600 navigation-menu md:hidden`}
            >
      
                <Link to="/" className="py-2 px-3 transition-all duration-300 ease-in-out hover:bg-amber-300 block rounded text-center">Home (Content)</Link>
                <Link to="/guess" className="py-2 px-3 transition-all duration-300 ease-in-out hover:bg-amber-300 block rounded text-center">Guess</Link>
                <Link to="/profile" className="py-2 px-3 transition-all duration-300 ease-in-out hover:bg-amber-300 block rounded text-center">Profile</Link>
                <Link to="/user-panel" className="py-2 px-3 transition-all duration-300 ease-in-out hover:bg-amber-300 block rounded text-center">User Panel</Link>
                <Link to="/leaderboard" className="py-2 px-3 transition-all duration-300 ease-in-out hover:bg-amber-300 block rounded text-center">Leaderboard</Link>
                <Link to="/create-user" className="py-2 px-3 transition-all duration-300 ease-in-out hover:bg-amber-300 block rounded text-center">Create User</Link>
                <Link to="/create-admin" className="py-2 px-3 transition-all duration-300 ease-in-out hover:bg-amber-300 block rounded text-center">Create Admin</Link>

               

              
                
            </div>
            
            <ThemeCustomizer 
                isOpen={showThemeCustomizer} 
                onClose={() => setShowThemeCustomizer(false)} 
            />
        </header>
    );
};

export default Header;