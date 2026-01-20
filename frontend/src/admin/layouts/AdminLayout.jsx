import React from 'react';
import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
    return (
        <div className="min-h-screen bg-slate-100">
            <main className="p-6">
                <Outlet />
            </main>
        </div>
    );
}
