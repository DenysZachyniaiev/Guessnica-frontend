import React, { useState, useEffect } from 'react';

export default function AdminLocations() {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingLocation, setEditingLocation] = useState(null);

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            const response = await fetch('/admin/locations', {
                headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
            });
            const data = await response.json();
            setLocations(data);
        } catch (error) {
            console.error('Failed to fetch locations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this location?')) return;

        try {
            await fetch(`/admin/locations/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
            });
            fetchLocations();
        } catch (error) {
            console.error('Failed to delete location:', error);
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
                    Manage Locations
                </h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    Add New Location
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {locations.map((location) => (
                    <div key={location.id} className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-slate-700">
                            {location.imageUrl ? (
                                <img 
                                    src={location.imageUrl} 
                                    alt={location.name}
                                    className="w-full h-48 object-cover"
                                />
                            ) : (
                                <div className="w-full h-48 flex items-center justify-center text-gray-400 dark:text-gray-500">
                                    <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        
                        <div className="p-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                {location.name}
                            </h3>
                            
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                {location.description}
                            </p>
                            
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center text-gray-500 dark:text-gray-400">
                                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                                </div>
                                
                                <div className="flex items-center text-gray-500 dark:text-gray-400">
                                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    {location.riddleCount || 0} riddles
                                </div>
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700 flex justify-between">
                                <button
                                    onClick={() => {
                                        setEditingLocation(location);
                                        setShowModal(true);
                                    }}
                                    className="text-sky-600 hover:text-sky-700 text-sm font-medium"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(location.id)}
                                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {locations.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-500 dark:text-gray-400">
                        No locations found. Add your first location to get started!
                    </div>
                </div>
            )}

            {/* Add/Edit Modal would go here - simplified for now */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                            {editingLocation ? 'Edit Location' : 'Add New Location'}
                        </h3>
                        <div className="text-gray-500 dark:text-gray-400">
                            Location form would be implemented here with image upload, coordinates, etc.
                        </div>
                        <div className="mt-4 flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setEditingLocation(null);
                                }}
                                className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setEditingLocation(null);
                                }}
                                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
