import React, { useState, useEffect } from 'react';
import Header from './components/common/Header';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import EmailConfirmationPage from './components/auth/EmailConfirmationPage';
import AdminUserCreator from './components/auth/AdminUserCreator';
import NormalUserCreator from './components/auth/NormalUserCreator';
import Guess from "./components/game/Guess";
import Content from './pages/Content';
import Welcome from './pages/Welcome';
import Profile from "./pages/Profile";
import UserPanel from './user/pages/UserPanel';
import UserSettings from './user/pages/UserSettings';
import UserLeaderboard from './user/pages/UserLeaderboard';
import ThemeCustomizer from "./components/common/ThemeCustomizer";
import ResponsiveWrapper from "./components/common/ResponsiveWrapper";
import { Routes, Route, Navigate } from 'react-router-dom';
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
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const { t } = useTranslation();

    const setLang = (lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem("lang", lang);
    };
    useEffect(() => {
        const token = localStorage.getItem('token');
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
            {windowSize => (
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
                        <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} />
                        <Route path="/user-panel" element={isLoggedIn ? <UserPanel /> : <Navigate to="/login" />} />
                        <Route path="/user-settings" element={isLoggedIn ? <UserSettings /> : <Navigate to="/login" />} />
                        <Route path="/leaderboard" element={isLoggedIn ? <UserLeaderboard /> : <Navigate to="/login" />} />
                        <Route path="/create-admin" element={isLoggedIn ? <AdminUserCreator /> : <Navigate to="/login" />} />
                        <Route path="/create-user" element={isLoggedIn ? <NormalUserCreator /> : <Navigate to="/login" />} />

                        {/* Przekierowanie głównej strony */}
                        <Route path="/" element={isLoggedIn ? <Content /> : <Navigate to="/welcome" />} />
                        
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
            )}
        </ResponsiveWrapper>
    );
};

export default App;