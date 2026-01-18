import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import AdminHeader from '../../components/AdminHeader';
import AdminDashboard from '../pages/AdminDashboard';
import AdminRiddles from '../pages/AdminRiddles';
import AdminLocations from '../pages/AdminLocations';
import AdminUsers from '../pages/AdminUsers';
import AdminStats from '../pages/AdminStats';
import AdminSettings from '../pages/AdminSettings';
import UserDashboard from '../../user/pages/UserDashboard';

export default function AdminLayout() {
    return (
        <div className="min-h-screen bg-slate-100">
            <AdminHeader />
            <main className="p-6">
                <Outlet />
            </main>
        </div>
    );
}
