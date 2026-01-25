import React, { useState, useEffect } from 'react';

export default function AdminRiddles() {
    const [riddleStats, setRiddleStats] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRiddle, setSelectedRiddle] = useState(null);
    const [showStatsModal, setShowStatsModal] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);
    const [editingRiddle, setEditingRiddle] = useState(null);
    const [formData, setFormData] = useState({
        Description: '',
        Difficulty: 1,
        LocationId: 0,
        TimeLimitSeconds: 3600,
        MaxDistanceMeters: 100
    });

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (editingRiddle) {
            setFormData({
                Description: editingRiddle.description,
                Difficulty: editingRiddle.difficulty,
                LocationId: editingRiddle.locationId,
                TimeLimitSeconds: editingRiddle.timeLimitSeconds,
                MaxDistanceMeters: editingRiddle.maxDistanceMeters
            });
        } else {
            setFormData({
                Description: '',
                Difficulty: 1,
                LocationId: 0,
                TimeLimitSeconds: 3600,
                MaxDistanceMeters: 100
            });
        }
    }, [editingRiddle]);

    const fetchData = async () => {
        try {
            const [statsRes, submissionsRes, locationsRes] = await Promise.all([
                fetch('/admin/riddles/stats', { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` } }),
                fetch('/admin/submissions', { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` } }),
                fetch('/locations', { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` } })
            ]);
            const statsData = await statsRes.json();
            const submissionsData = await submissionsRes.json();
            const locationsData = await locationsRes.json();
            setRiddleStats(Array.isArray(statsData) ? statsData : []);
            setSubmissions(Array.isArray(submissionsData) ? submissionsData : []);
            setLocations(Array.isArray(locationsData) ? locationsData : []);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            setRiddleStats([]);
            setSubmissions([]);
            setLocations([]);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        const url = editingRiddle ? `/riddles/${editingRiddle.id}` : '/riddles';
        const method = editingRiddle ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                fetchData();
                setShowFormModal(false);
                setEditingRiddle(null);
            } else {
                console.error('Failed to save riddle');
            }
        } catch (error) {
            console.error('Error saving riddle:', error);
        }
    };

    const viewRiddleStats = (riddleId) => {
        const stats = riddleStats.find(s => s.riddleId === riddleId);
        const riddleSubmissions = submissions.filter(s => s.riddleId === riddleId);
        setSelectedRiddle({ ...stats, submissions: riddleSubmissions });
        setShowStatsModal(true);
    };

    const handleEdit = (riddle) => {
        setEditingRiddle(riddle);
        setShowFormModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this riddle?')) return;
        try {
            await fetch(`/riddles/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` } });
            fetchData();
        } catch (error) {
            console.error('Failed to delete riddle:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
            </div>
        );
    }

    const totalSubmissions = riddleStats.reduce((sum, r) => sum + (r.timesAnswered || 0), 0);

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white"> Manage Riddles </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2"> Total riddles: {riddleStats.length} | Total submissions: {totalSubmissions} </p>
                </div>
                <button onClick={() => { setEditingRiddle(null); setShowFormModal(true); }} className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg transition-colors">
                    Add New Riddle
                </button>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                        <thead className="bg-gray-50 dark:bg-slate-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"> Image </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"> Location </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"> Description </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"> Answers </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"> Avg Score </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"> Avg Time </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"> Avg Distance </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"> Actions </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                        {riddleStats.map((riddle) => (
                            <tr key={riddle.riddleId} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <img src={riddle.imageUrl} alt="Riddle" className="h-12 w-12 rounded-lg object-cover" />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"> {riddle.shortDescription} </td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate"> {riddle.description || 'N/A'} </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white"> {riddle.timesAnswered || 0} </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"> {riddle.avgScore != null ? riddle.avgScore.toFixed(1) : 'N/A'} </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"> {riddle.avgTimeSeconds != null ? `${riddle.avgTimeSeconds.toFixed(1)}s` : 'N/A'} </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"> {riddle.avgDistanceMeters != null ? `${riddle.avgDistanceMeters.toFixed(0)}m` : 'N/A'} </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <button onClick={() => viewRiddleStats(riddle.riddleId)} className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300">
                                        Stats
                                    </button>
                                    <button onClick={() => handleEdit(riddle)} className="text-sky-600 hover:text-sky-900 dark:text-sky-400 dark:hover:text-sky-300">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(riddle.riddleId)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                {riddleStats.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-500 dark:text-gray-400"> No riddles found. Add your first riddle to get started! </div>
                    </div>
                )}
            </div>
            {showStatsModal && selectedRiddle && (
                // ... (keep the existing stats modal code)
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        {/* ... existing content ... */}
                    </div>
                </div>
            )}
            {showFormModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999]">
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4"> {editingRiddle ? 'Edit Riddle' : 'Add New Riddle'} </h3>
                        <div className="space-y-4">
                            <input name="Description" value={formData.Description} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded" />
                            <select name="Difficulty" value={formData.Difficulty} onChange={handleChange} className="w-full p-2 border rounded">
                                <option value={1}>Easy (1)</option>
                                <option value={2}>Medium (2)</option>
                                <option value={3}>Hard (3)</option>
                            </select>
                            <select name="LocationId" value={formData.LocationId} onChange={handleChange} className="w-full p-2 border rounded">
                                <option value={0}>Select Location</option>
                                {locations.map(loc => (
                                    <option key={loc.id} value={loc.id}>{loc.shortDescription}</option>
                                ))}
                            </select>
                            <input name="TimeLimitSeconds" value={formData.TimeLimitSeconds} onChange={handleChange} placeholder="Time Limit Seconds" type="number" className="w-full p-2 border rounded" />
                            <input name="MaxDistanceMeters" value={formData.MaxDistanceMeters} onChange={handleChange} placeholder="Max Distance Meters" type="number" className="w-full p-2 border rounded" />
                        </div>
                        <div className="mt-4 flex justify-end space-x-3">
                            <button onClick={() => { setShowFormModal(false); setEditingRiddle(null); }} className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700">
                                Cancel
                            </button>
                            <button onClick={handleSubmit} className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}