import React, { useEffect, useState } from "react";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);

    const load = () => {
        fetch("/admin/users", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt")}` 
            }
        })
            .then(r => r.json())
            .then(setUsers);
    };

    useEffect(load, []);

    const action = async (url) => {
        await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt")}` 
            }
        });
        load();
    };

    const remove = async (id) => {
        if (!confirm("Delete user permanently?")) return;

        await fetch(`/admin/users/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt")}` 
            }
        });

        load();
    };

    return (
        <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-sky-700">
                Users
            </h2>

            <div className="space-y-4">
                {users.map(u => (
                    <div
                        key={u.id}
                        className="bg-white border-2 border-sky-500 rounded-xl p-4 flex items-center gap-4"
                    >
                        <img
                            src={u.avatarUrl || "/avatar-placeholder.png"}
                            className="w-12 h-12 rounded-full object-cover"
                        />

                        <div className="flex-1">
                            <div className="font-semibold">
                                {u.displayName}
                            </div>
                            <div className="text-sm text-gray-600">
                                {u.email}
                            </div>
                        </div>

                        {u.lockoutEnd
                            ? (
                                <button
                                    onClick={() => action(`/admin/users/${u.id}/unblock`)}
                                    className="text-green-600 text-sm"
                                >
                                    Unblock
                                </button>
                            )
                            : (
                                <button
                                    onClick={() => action(`/admin/users/${u.id}/block`)}
                                    className="text-yellow-600 text-sm"
                                >
                                    Block
                                </button>
                            )
                        }

                        <button
                            onClick={() => remove(u.id)}
                            className="text-red-600 text-sm"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
