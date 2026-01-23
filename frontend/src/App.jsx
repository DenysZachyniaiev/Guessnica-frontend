import React, { useState, useEffect } from 'react';
import Header from './components/common/Header';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import EmailConfirmationPage from './components/auth/EmailConfirmationPage';
/*import AdminUserCreator from './components/auth/AdminUserCreator';*/

import Guess from "./components/game/Guess";
import Welcome from './pages/Welcome';
import ThemeCustomizer from "./components/common/ThemeCustomizer";
import ResponsiveWrapper from "./components/common/ResponsiveWrapper";
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import i18n from "./i18n";

import UserPanel from './pages/user/UserPanel';
import UserSettings from './pages/user/UserSettings';
import UserLeaderboard from './pages/user/UserLeaderboard';
/*import UserDashboard from './pages/user/UserDashboard';*/

import AdminLayout from './pages/admin/layouts/AdminLayout';
/*import AdminPanel from './pages/admin/AdminPanel';*/
import AdminDashboard from './pages/admin/pages/AdminDashboard';
import AdminRiddles from './pages/admin/pages/AdminRiddles';
import AdminLocations from './pages/admin/pages/AdminLocations';
import AdminUsers from './pages/admin/pages/AdminUsers';
import AdminStats from './pages/admin/pages/AdminStats';
import AdminSettings from './pages/admin/pages/AdminSettings';

const App = () => {
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem('theme') === 'dark'
    );
    const [showThemeCustomizer, setShowThemeCustomizer] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const { t } = useTranslation();

    const setLang = (lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem("lang", lang);
    };
    useEffect(() => {
        const token = localStorage.getItem('jwt');
        setIsLoggedIn(!!token);
    }, []);

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
        <ResponsiveWrapper>
                <>
                    <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

                    <Routes>
                        {/* Publiczne strony */}
                        <Route path="/welcome" element={<Welcome />} />
                        <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/confirm-email" element={<EmailConfirmationPage />} />
                        {/* Chronione strony - tylko dla zalogowanych */}
                        <Route path="/guess" element={isLoggedIn ? <Guess /> : <Navigate to="/login" />} />
                        <Route path="/user-panel" element={isLoggedIn ? <UserPanel /> : <Navigate to="/login" />} />
                        <Route path="/user-settings" element={isLoggedIn ? <UserSettings /> : <Navigate to="/login" />} />
                        <Route path="/leaderboard" element={isLoggedIn ? <UserLeaderboard /> : <Navigate to="/login" />} />

                        {/* Przekierowanie głównej strony */}
                        <Route path="/" element={isLoggedIn ? <Welcome/> : <Navigate to="/welcome" />} />
                        
                        {/* Admin routes */}
                        <Route path="/admin" element={isLoggedIn ? <AdminLayout /> : <Navigate to="/login" />}>
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
        </ResponsiveWrapper>
    );
};

export default App;