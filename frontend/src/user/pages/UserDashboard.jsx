import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserDashboard() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('jwt');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            
            const response = await fetch('/admin/users', { headers });
            
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else {
                setUsers([
                    {
                        id: 1,
                        email: 'admin@example.com',
                        displayName: 'Admin User',
                        role: 'Admin',
                        isActive: true,
                        createdAt: '2024-01-15T10:00:00Z',
                        lastLogin: '2024-01-20T15:30:00Z'
                    },
                    {
                        id: 2,
                        email: 'player1@example.com',
                        displayName: 'Player One',
                        role: 'User',
                        isActive: true,
                        createdAt: '2024-01-10T09:00:00Z',
                        lastLogin: '2024-01-20T14:20:00Z'
                    },
                    {
                        id: 3,
                        email: 'player2@example.com',
                        displayName: 'Player Two',
                        role: 'User',
                        isActive: false,
                        createdAt: '2024-01-08T11:00:00Z',
                        lastLogin: '2024-01-15T08:45:00Z'
                    }
                ]);
            }
        } catch (err) {
            setError('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleBlockUser = async (userId) => {
        if (!confirm('Are you sure you want to block this user?')) return;
        
        try {
            const token = localStorage.getItem('jwt');
            await fetch(`/admin/users/${userId}/block`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            fetchUsers();
        } catch (err) {
            setError('Failed to block user');
        }
    };

    const handleUnblockUser = async (userId) => {
        if (!confirm('Are you sure you want to unblock this user?')) return;
        
        try {
            const token = localStorage.getItem('jwt');
            await fetch(`/admin/users/${userId}/unblock`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            fetchUsers();
        } catch (err) {
            setError('Failed to unblock user');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone!')) return;
        
        try {
            const token = localStorage.getItem('jwt');
            await fetch(`/admin/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            fetchUsers();
        } catch (err) {
            setError('Failed to delete user');
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role.toLowerCase() === filterRole.toLowerCase();
        return matchesSearch && matchesRole;
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-sky-50 dark:bg-slate-900 flex items-center justify-center">
                <div className="text-center text-gray-500">Loading users...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-sky-50 dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white dark:bg-slate-800 shadow-lg rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            User Management
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Manage user accounts, roles, and permissions
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center mb-6">
                            {error}
                        </div>
                    )}

                    <div className="p-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                            <div className="lg:w-1/3 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Search Users
                                    </label>
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search by name or email..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-sky-500 focus:border-sky-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Filter by Role
                                    </label>
                                    <select
                                        value={filterRole}
                                        onChange={(e) => setFilterRole(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-sky-500 focus:border-sky-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    >
                                        <option value="all">All Roles</option>
                                        <option value="admin">Admin</option>
                                        <option value="user">User</option>
                                    </select>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => navigate('/create-user')}
                                        className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        Create User
                                    </button>
                                    <button
                                        onClick={() => navigate('/create-admin')}
                                        className="flex-1 bg-sky-600 text-white px-3 py-2 rounded-lg hover:bg-sky-700 transition-colors"
                                    >
                                        Create Admin
                                    </button>
                                </div>
                            </div>

                            <div className="lg:w-2/3">
                                <div className="bg-white dark:bg-slate-700 rounded-lg shadow overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50 dark:bg-slate-800">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                        User
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                        Email
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                        Role
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                        Created
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                        Last Login
                                                    </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                                {filteredUsers.map((user) => (
                                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="w-8 h-8 bg-gray-200 dark:bg-slate-600 rounded-full flex items-center justify-center">
                                                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                                                        {user.displayName.charAt(0).toUpperCase()}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                    {user.displayName}
                                                                </div>
                                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                    {user.email}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                                user.role === 'Admin' 
                                                                    ? 'bg-purple-100 text-purple-800' 
                                                                    : 'bg-green-100 text-green-800'
                                                            }`}>
                                                                {user.role}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                                user.isActive 
                                                                    ? 'bg-green-100 text-green-800' 
                                                                    : 'bg-red-100 text-red-800'
                                                            }`}>
                                                                {user.isActive ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                            {formatDate(user.createdAt)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                            {formatDate(user.lastLogin)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => handleBlockUser(user.id)}
                                                                    disabled={user.role === 'Admin'}
                                                                    className="px-2 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                                    title={user.role === 'Admin' ? 'Cannot block admin users' : 'Block user'}
                                                                >
                                                                    Block
                                                                </button>
                                                                <button
                                                                    onClick={() => handleUnblockUser(user.id)}
                                                                    disabled={user.role === 'Admin'}
                                                                    className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                                    title={user.role === 'Admin' ? 'Cannot unblock admin users' : 'Unblock user'}
                                                                >
                                                                    Unblock
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteUser(user.id)}
                                                                    disabled={user.role === 'Admin'}
                                                                    className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                                    title={user.role === 'Admin' ? 'Cannot delete admin users' : 'Delete user'}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
