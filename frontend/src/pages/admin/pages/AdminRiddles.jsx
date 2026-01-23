import React, { useState, useEffect } from 'react';

export default function AdminRiddles() {
    const [riddles, setRiddles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingRiddle, setEditingRiddle] = useState(null);

    useEffect(() => {
        fetchRiddles();
    }, []);

    const fetchRiddles = async () => {
        try {
            const response = await fetch('/admin/riddles', {
                headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
            });
            const data = await response.json();
            setRiddles(data);
        } catch (error) {
            console.error('Failed to fetch riddles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this riddle?')) return;

        try {
            await fetch(`/admin/riddles/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
            });
            fetchRiddles();
        } catch (error) {
            console.error('Failed to delete riddle:', error);
        }
    };

    const handleSave = async (ev) => {
        ev.preventDefault();
        const form = ev.target.elements;
        const payload = {
            imageUrl: form.imageUrl.value || null,
            locationId: form.locationId.value || null,
            difficulty: form.difficulty.value || 'Medium',
            points: Number(form.points.value) || 0,
            maxDistanceMeters: Number(form.maxDistanceMeters.value) || 100
        };

        try {
            if (editingRiddle && editingRiddle.id) {
                await fetch(`/admin/riddles/${editingRiddle.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('jwt')}` },
                    body: JSON.stringify(payload)
                });
            } else {
                await fetch('/admin/riddles', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('jwt')}` },
                    body: JSON.stringify(payload)
                });
            }
            setShowModal(false);
            setEditingRiddle(null);
            fetchRiddles();
        } catch (e) {
            console.error('Failed to save riddle', e);
            alert('Failed to save riddle');
        }
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Easy': return 'bg-green-100 text-green-800';
            case 'Medium': return 'bg-yellow-100 text-yellow-800';
            case 'Hard': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Manage Riddles
                </h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    Add New Riddle
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                        <thead className="bg-gray-50 dark:bg-slate-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Image
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Location
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Difficulty
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Points
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Times Answered
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Success Rate
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                            {riddles.map((riddle) => (
                                <tr key={riddle.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <img 
                                            src={riddle.imageUrl} 
                                            alt="Riddle" 
                                            className="h-12 w-12 rounded-lg object-cover"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        {riddle.locationName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(riddle.difficulty)}`}>
                                            {riddle.difficulty}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        {riddle.points}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        {riddle.timesAnswered || 0}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        {riddle.successRate ? `${Math.round(riddle.successRate * 100)}%` : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => {
                                                setEditingRiddle(riddle);
                                                setShowModal(true);
                                            }}
                                            className="text-sky-600 hover:text-sky-900 mr-3"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(riddle.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {riddles.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-500 dark:text-gray-400">
                            No riddles found. Add your first riddle to get started!
                        </div>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal would go here - simplified for now */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999]">
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                            {editingRiddle ? 'Edit Riddle' : 'Add New Riddle'}
                        </h3>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                <input name="imageUrl" defaultValue={editingRiddle?.imageUrl || ''} className="w-full px-3 py-2 border rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location ID</label>
                                <input name="locationId" defaultValue={editingRiddle?.locationId || ''} className="w-full px-3 py-2 border rounded" />
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                                    <select name="difficulty" defaultValue={editingRiddle?.difficulty || 'Medium'} className="w-full px-2 py-2 border rounded">
                                        <option>Easy</option>
                                        <option>Medium</option>
                                        <option>Hard</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
                                    <input name="points" defaultValue={editingRiddle?.points ?? 0} className="w-full px-3 py-2 border rounded" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Max distance (m)</label>
                                    <input name="maxDistanceMeters" defaultValue={editingRiddle?.maxDistanceMeters ?? 100} className="w-full px-3 py-2 border rounded" />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button type="button" onClick={() => { setShowModal(false); setEditingRiddle(null); }} className="px-4 py-2 border rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
