import React, { useEffect, useState } from "react";

export default function AdminSettings() {
    const [form, setForm] = useState(null);

    useEffect(() => {
        fetch("/admin/settings", {
            headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` }
        })
            .then(r => r.json())
            .then(setForm);
    }, []);

    const update = e =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const save = () => {
        fetch("/admin/settings", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("jwt")}` 
            },
            body: JSON.stringify(form)
        });
    };

    if (!form) return null;

    const Field = ({ label, name }) => (
        <div>
            <label className="block text-sm text-gray-600 mb-1">
                {label}
            </label>
            <input
                name={name}
                value={form[name]}
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
                className="mt-6 bg-sky-600 text-white px-6 py-2 rounded-lg"
            >
                Save
            </button>
        </div>
    );
}
