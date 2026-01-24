import React, { useEffect, useState } from "react";
import { loadSettings, saveSettings } from '../../../lib/settings';

export default function AdminSettingsImproved() {
    const [settings, setSettings] = useState({ timeLimitSeconds: 3600, maxDistanceMeters: 100, basePoints: 500, allowHints: true });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        let mounted = true;
        loadSettings().then((s) => {
            if (mounted) setSettings((st) => ({ ...st, ...s }));
        }).finally(() => { if (mounted) setLoading(false); });
        return () => { mounted = false; };
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings({ ...settings, [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value) });
    };

    const handleSave = async () => {
        setSaving(true);
        setError('');
        try {
            await saveSettings(settings);
            setMessage('Settings saved');
        } catch (e) {
            setMessage('Settings saved locally (server failed)');
        } finally {
            setSaving(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    if (loading) return <div className="p-6">Loading settings...</div>;

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2"> Game Settings </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8"> Configure global game rules (fallbacks to localStorage if backend missing) </p>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 space-y-4">
                {error && <div className="text-red-600">{error}</div>}
                <label className="block">
                    <div className="text-sm text-gray-600 dark:text-gray-300">Default Time Limit (seconds)</div>
                    <input type="number" name="timeLimitSeconds" value={settings.timeLimitSeconds} onChange={handleChange} className="mt-1 p-2 border rounded w-48" />
                </label>
                <label className="block">
                    <div className="text-sm text-gray-600 dark:text-gray-300">Default Max Distance (meters)</div>
                    <input type="number" name="maxDistanceMeters" value={settings.maxDistanceMeters} onChange={handleChange} className="mt-1 p-2 border rounded w-48" />
                </label>
                <label className="block">
                    <div className="text-sm text-gray-600 dark:text-gray-300">Default Base Points</div>
                    <input type="number" name="basePoints" value={settings.basePoints} onChange={handleChange} className="mt-1 p-2 border rounded w-48" />
                </label>
                <label className="flex items-center gap-2">
                    <input type="checkbox" name="allowHints" checked={!!settings.allowHints} onChange={handleChange} />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Allow Hints By Default</span>
                </label>

                <div className="flex justify-end">
                    <button onClick={handleSave} disabled={saving} className="bg-sky-600 text-white px-4 py-2 rounded disabled:opacity-50">
                        {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </div>
        </div>
    );
}