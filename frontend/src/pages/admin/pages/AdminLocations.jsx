import React, { useState, useEffect } from 'react';

export default function AdminLocations() {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingLocation, setEditingLocation] = useState(null);
    const [formData, setFormData] = useState({
        Latitude: 0,
        Longitude: 0,
        ShortDescription: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchLocations();
    }, []);

    useEffect(() => {
        if (editingLocation) {
            setFormData({
                Latitude: editingLocation.latitude,
                Longitude: editingLocation.longitude,
                ShortDescription: editingLocation.shortDescription || ''
            });
            setImageFile(null);
        } else {
            setFormData({
                Latitude: 0,
                Longitude: 0,
                ShortDescription: ''
            });
            setImageFile(null);
        }
    }, [editingLocation]);

    const fetchLocations = async () => {
        try {
            const response = await fetch('/locations', { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` } });
            const data = await response.json();
            setLocations(data);
        } catch (error) {
            console.error('Failed to fetch locations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async () => {
        // validate
        const err = {};
        const lat = Number(formData.Latitude);
        const lon = Number(formData.Longitude);
        if (isNaN(lat) || lat < -90 || lat > 90) err.Latitude = 'Latitude must be between -90 and 90';
        if (isNaN(lon) || lon < -180 || lon > 180) err.Longitude = 'Longitude must be between -180 and 180';
        if (!formData.ShortDescription || String(formData.ShortDescription).trim().length < 3) err.ShortDescription = 'Short description is required';
        setErrors(err);
        if (Object.keys(err).length > 0) return;
        setSaving(true);
        const data = new FormData();
        data.append('Latitude', formData.Latitude);
        data.append('Longitude', formData.Longitude);
        data.append('ShortDescription', formData.ShortDescription);
        if (imageFile) {
            data.append('Image', imageFile);
        }

        const url = editingLocation ? `/locations/${editingLocation.id}` : '/locations';
        const method = editingLocation ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
                body: data
            });
            if (response.ok) {
                fetchLocations();
                setShowModal(false);
                setEditingLocation(null);
            } else {
                console.error('Failed to save location');
            }
        } catch (error) {
            console.error('Error saving location:', error);
        }
        setSaving(false);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this location?')) return;
        try {
            await fetch(`/locations/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` } });
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
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white"> Manage Locations </h1>
                <button onClick={() => { setEditingLocation(null); setShowModal(true); }} className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg transition-colors">
                    Add New Location
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {locations.map((location) => (
                    <div key={location.id} className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-slate-700">
                            {location.imageUrl ? (
                                <img src={location.imageUrl} alt={location.shortDescription} className="w-full h-48 object-cover" />
                            ) : (
                                <div className="w-full h-48 flex items-center justify-center text-gray-400 dark:text-gray-500">
                                    <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2"> {location.shortDescription || 'Unnamed'} </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center text-gray-500 dark:text-gray-400">
                                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {location.latitude != null && location.longitude != null ? `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}` : '—'}
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700 flex justify-between">
                                <button onClick={() => { setEditingLocation(location); setShowModal(true); }} className="text-sky-600 hover:text-sky-700 text-sm font-medium">
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(location.id)} className="text-red-600 hover:text-red-700 text-sm font-medium">
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {locations.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-500 dark:text-gray-400"> No locations found. Add your first location to get started! </div>
                </div>
            )}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999]">
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4"> {editingLocation ? 'Edit Location' : 'Add New Location'} </h3>
                        <div className="space-y-4">
                            <input name="Latitude" value={formData.Latitude} onChange={handleChange} placeholder="Latitude" type="number" className="w-full p-2 border rounded" />
                            {errors.Latitude && <div className="text-red-600 text-sm">{errors.Latitude}</div>}
                            <input name="Longitude" value={formData.Longitude} onChange={handleChange} placeholder="Longitude" type="number" className="w-full p-2 border rounded" />
                            {errors.Longitude && <div className="text-red-600 text-sm">{errors.Longitude}</div>}
                            <input name="ShortDescription" value={formData.ShortDescription} onChange={handleChange} placeholder="Short Description" className="w-full p-2 border rounded" />
                            {errors.ShortDescription && <div className="text-red-600 text-sm">{errors.ShortDescription}</div>}
                            <input type="file" onChange={handleImageChange} className="w-full p-2 border rounded" accept="image/*" />
                        </div>
                        <div className="mt-4 flex justify-end space-x-3">
                            <button onClick={() => { setShowModal(false); setEditingLocation(null); }} className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700">
                                Cancel
                            </button>
                            <button onClick={handleSubmit} disabled={saving} className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:opacity-60">
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}