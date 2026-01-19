import React, { useState, useEffect } from 'react';
import Header from './components/common/Header'; 
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import EmailConfirmationPage from './components/auth/EmailConfirmationPage';
import AdminUserCreator from './components/auth/AdminUserCreator';
import NormalUserCreator from './components/auth/NormalUserCreator';
import Guess from "./components/game/Guess";
import Content from './pages/Content';
import Profile from "./pages/Profile";
import UserPanel from './user/pages/UserPanel';
import UserSettings from './user/pages/UserSettings';
import UserLeaderboard from './user/pages/UserLeaderboard';
import ThemeCustomizer from "./components/common/ThemeCustomizer";
import ResponsiveWrapper from "./components/common/ResponsiveWrapper";
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import i18n from "./i18n";

import AdminLayout from './admin/layouts/AdminLayout';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminRiddles from './admin/pages/AdminRiddles';
import AdminLocations from './admin/pages/AdminLocations';
import AdminUsers from './admin/pages/AdminUsers';
import AdminStats from './admin/pages/AdminStats';
import AdminSettings from './admin/pages/AdminSettings';
import UserDashboard from './user/pages/UserDashboard';

const App = () => {
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem('theme') === 'dark'
    );
    const [showThemeCustomizer, setShowThemeCustomizer] = useState(false);

    const { t } = useTranslation();

    const setLang = (lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem("lang", lang);
    };

    useEffect(() => {
        const root = document.documentElement;
        if (darkMode) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    useEffect(() => {
        const savedTheme = localStorage.getItem('selectedTheme');
        if (savedTheme && savedTheme !== 'default') {
            const customColors = localStorage.getItem('customColors');
            if (customColors && savedTheme === 'custom') {
                const colors = JSON.parse(customColors);
                const root = document.documentElement;
                root.style.setProperty('--color-primary', colors.primary);
                root.style.setProperty('--color-background', colors.background);
                root.style.setProperty('--color-surface', colors.surface);
                root.style.setProperty('--color-text', colors.text);
            }
        }
    }, []);

    return (
        <AuthProvider>
            <ResponsiveWrapper>
                {windowSize => (
                    <>
                        <Header />
                    <div className="w-full grid grid-cols-2 items-center dark:bg-slate-900 px-6 py-4 lg:hidden">

                        <div className="flex justify-start">
                            <div className="flex items-center gap-2 border border-sky-500 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-sky-200">
                                <span className="font-semibold">{t("ui.language")}:</span>
                                <button onClick={() => setLang("en")} className="hover:underline">EN</button>
                                <span className="opacity-30">|</span>
                                <button onClick={() => setLang("pl")} className="hover:underline">PL</button>
                            </div>
                        </div>


                        <div className="flex justify-end items-center gap-6">
                            <button
                                onClick={() => setShowThemeCustomizer(true)}
                                className="px-4 py-2 rounded-lg text-sm font-semibold bg-purple-500 hover:bg-purple-600 text-white transition-colors"
                            >
                                🎨 Themes
                            </button>


                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className={`
                relative h-8 w-14 flex-shrink-0 items-center rounded-full 
                transition-colors duration-300 focus:outline-none
                flex lg:hidden 
                ${darkMode ? 'bg-blue-600' : 'bg-slate-200 border border-slate-300'}
            `}
                            >
            <span
                className={`
                    flex h-6 w-6 transform items-center justify-center rounded-full bg-white 
                    transition-transform duration-300 shadow-sm
                    ${darkMode ? 'translate-x-7' : 'translate-x-1'}
                `}
            >
                {darkMode ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                )}
            </span>
                            </button>
                        </div>
                    </div>

                        <Routes>
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/confirm-email" element={<EmailConfirmationPage />} />
                            <Route path="/create-admin" element={<AdminUserCreator />} />
                            <Route path="/create-user" element={<NormalUserCreator />} />
                            
                        <Route path="/" element={<Content />} />
                        <Route path="/guess" element={<Guess />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/user-panel" element={<UserPanel />} />
                        <Route path="/user-settings" element={<UserSettings />} />
                        <Route path="/leaderboard" element={<UserLeaderboard />} />

                            <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminLayout /></ProtectedRoute>}>
                                <Route index element={<AdminDashboard />} />
                                <Route path="riddles" element={<AdminRiddles />} />
                                <Route path="locations" element={<AdminLocations />} />
                                <Route path="users" element={<AdminUsers />} />
                                <Route path="stats" element={<AdminStats />} />
                                <Route path="settings" element={<AdminSettings />} />
                            </Route>

                            <Route
                                path="*"
                                element={
                                    <main className="container mx-auto p-8 text-center text-red-500 text-2xl">
                                        404 - Page Not Found
                                    </main>
                                }
                            />
                        </Routes>

                        <ThemeCustomizer 
                            isOpen={showThemeCustomizer} 
                            onClose={() => setShowThemeCustomizer(false)} 
                        />
                    </>
                )}
            </ResponsiveWrapper>
        </AuthProvider>
    );
};

export default App;
