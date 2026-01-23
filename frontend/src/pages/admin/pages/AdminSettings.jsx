import React, { useEffect, useState } from "react";

export default function AdminSettings() {
    const [form, setForm] = useState({
        roundTimeSeconds: 60,
        maxAttempts: 3,
        pointsPerfect: 100,
        pointsWrong: 0
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch("/admin/settings", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` }
                });
                if (!res.ok) {
                    setLoading(false);
                    return;
                }
                const data = await res.json();
                if (data) setForm(prev => ({ ...prev, ...data }));
            } catch (e) {
                console.error('Failed to load settings', e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const update = e =>
        setForm({ ...form, [e.target.name]: Number(e.target.value) });

    const save = async () => {
        setSaving(true);
        try {
            await fetch("/admin/settings", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("jwt")}`
                },
                body: JSON.stringify(form)
            });
            alert('Settings saved');
        } catch (e) {
            console.error('Failed to save settings', e);
            alert('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-500"></div>
        </div>
    );

    const Field = ({ label, name }) => (
        <div>
            <label className="block text-sm text-gray-600 mb-1">
                {label}
            </label>
            <input
                name={name}
                value={form[name] ?? ''}
                onChange={update}
                className="w-full border border-sky-400 rounded-lg p-2"
                type="number"
            />
        </div>
    );

    return (
        <div className="max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-sky-700">
                Game settings
            </h2>

            <div className="space-y-4">
                <Field label="Round time (seconds)" name="roundTimeSeconds" />
                <Field label="Max attempts" name="maxAttempts" />
                <Field label="Perfect score" name="pointsPerfect" />
                <Field label="Wrong answer penalty" name="pointsWrong" />
            </div>

            <button
                onClick={save}
                disabled={saving}
                className="mt-6 bg-sky-600 text-white px-6 py-2 rounded-lg"
            >
                {saving ? 'Saving…' : 'Save'}
            </button>
        </div>
    );
}
