import React, { useEffect, useState } from "react";

export default function AdminStats() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetch("/admin/stats", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt")}` 
            }
        })
            .then(r => r.json())
            .then(setStats);
    }, []);

    if (!stats) return <div className="p-6">Loading…</div>;

    return (
        <div className="p-6 space-y-8">
            <h1 className="text-2xl font-bold text-sky-700">
                System statistics
            </h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Stat label="Users" value={stats.UsersTotal} />
                <Stat label="Blocked users" value={stats.UsersBlocked} />
                <Stat label="Riddles" value={stats.RiddlesTotal} />
                <Stat label="Submissions" value={stats.SubmissionsTotal} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Stat label="Avg score" value={stats.AvgScore.toFixed(2)} />
                <Stat label="Avg time (s)" value={stats.AvgTime.toFixed(2)} />
                <Stat label="Avg distance (m)" value={stats.AvgDistance.toFixed(2)} />
            </div>

            <div className="bg-slate-50 rounded-xl shadow p-4">
                <h2 className="font-semibold mb-3">
                    Top users
                </h2>

                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th>User ID</th>
                            <th>Total score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.TopUsers.map(u => (
                            <tr key={u.userId} className="border-b">
                                <td className="py-1">{u.userId}</td>
                                <td>{u.totalScore}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function Stat({ label, value }) {
    return (
        <div className="bg-slate-50 rounded-xl shadow p-4 text-center">
            <div className="text-sm text-slate-500">{label}</div>
            <div className="text-2xl font-bold text-sky-700">{value}</div>
        </div>
    );
}
