import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        if (!token) {
            setLoading(false);
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await fetch('/users/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                } else {
                    localStorage.removeItem('jwt');
                }
            } catch (error) {
                console.error('Failed to fetch user:', error);
                localStorage.removeItem('jwt');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const logout = () => {
        localStorage.removeItem('jwt');
        setUser(null);
    };

    const isAdmin = user?.roles?.includes('Admin') || user?.role === 'Admin';
    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ user, loading, isAuthenticated, isAdmin, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
