import React from 'react';
import { NavLink } from 'react-router-dom';

export default function AdminHeader() {
    return (
        <header className="w-full bg-sky-600 text-white shadow-md">
            <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

                <div className="text-xl font-bold">
                    Guessnica — Admin
                </div>

                <nav className="flex gap-6">
                    <NavLink 
                        to="/admin" 
                        className={({ isActive }) =>
                            isActive ? 'underline font-semibold' : 'hover:underline opacity-90'
                        }
                    >
                        Dashboard
                    </NavLink>
                    <NavLink 
                        to="/admin/riddles" 
                        className={({ isActive }) =>
                            isActive ? 'underline font-semibold' : 'hover:underline opacity-90'
                        }
                    >
                        Riddles
                    </NavLink>
                    <NavLink 
                        to="/admin/locations" 
                        className={({ isActive }) =>
                            isActive ? 'underline font-semibold' : 'hover:underline opacity-90'
                        }
                    >
                        Locations
                    </NavLink>
                    <NavLink 
                        to="/admin/users" 
                        className={({ isActive }) =>
                            isActive ? 'underline font-semibold' : 'hover:underline opacity-90'
                        }
                    >
                        Users
                    </NavLink>
                    <NavLink 
                        to="/admin/stats" 
                        className={({ isActive }) =>
                            isActive ? 'underline font-semibold' : 'hover:underline opacity-90'
                        }
                    >
                        Stats
                    </NavLink>
                    <NavLink 
                        to="/admin/user-dashboard" 
                        className={({ isActive }) =>
                            isActive ? 'underline font-semibold' : 'hover:underline opacity-90'
                        }
                    >
                        User Dashboard
                    </NavLink>
                    <NavLink 
                        to="/admin/settings" 
                        className={({ isActive }) =>
                            isActive ? 'underline font-semibold' : 'hover:underline opacity-90'
                        }
                    >
                        Settings
                    </NavLink>
                </nav>

                <div className="text-sm">
                    Admin
                </div>

            </div>
        </header>
    );
}
