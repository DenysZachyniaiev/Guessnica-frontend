import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';


export default function AdminPanel() {
    const { t } = useTranslation();

    const [riddleStats, setRiddleStats] = useState([]);
    const [userStats, setUserStats] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAdminData() {
            try {
                const token = localStorage.getItem('jwt');
                const headers = token ? { Authorization: `Bearer ${token}` } : {};

                const [riddlesRes, usersRes, subsRes] = await Promise.all([
                    fetch('/admin/riddles/stats', { headers }),
                    fetch('/admin/users/stats', { headers }),
                    fetch('/admin/submissions', { headers }),
                ]);

                setRiddleStats(await riddlesRes.json() ?? []);
                setUserStats(await usersRes.json() ?? []);
                setSubmissions(await subsRes.json() ?? []);
            } catch (err) {
                console.error('Admin fetch error:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchAdminData();
    }, []);

    if (loading) {
        return (
            <div className="w-full flex justify-center items-center p-10 text-sky-700 dark:text-sky-300">
                Loading admin data...
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-sky-50 dark:bg-slate-900 flex flex-col items-center p-6">
            <h1 className="text-3xl font-bold text-sky-700 dark:text-sky-300 mb-8">
               {t("admin.title")}
            </h1>


            {/* RIDDLE STATS */}
            <section className="w-full max-w-6xl mb-10">
                <h2 className="text-xl font-semibold text-sky-700 dark:text-sky-300 mb-4">
                    {t("admin.riddleStats")}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {riddleStats.map((r) => (
                        <div
                            key={r.riddleId}
                            className="
                                bg-white dark:bg-slate-800
                                border-2 border-sky-500
                                rounded-xl p-5 shadow-md
                            "
                        >
                            <div className="font-semibold text-gray-800 dark:text-sky-100 mb-1">
                                {r.description}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-sky-300">
                                Location: {r.shortDescription}
                            </div>

                            <div className="mt-3 text-sm text-gray-800 dark:text-sky-100">
                                <div>Times answered: {r.timesAnswered}</div>
                                <div>Avg score: {r.avgScore ?? 0}</div>
                                <div>Avg distance (m): {r.avgDistanceMeters ?? 0}</div>
                                <div>Avg time (s): {r.avgTimeSeconds ?? 0}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* USER STATS */}
            <section className="w-full max-w-6xl mb-10">
                <h2 className="text-xl font-semibold text-sky-700 dark:text-sky-300 mb-4">
                    {t("admin.userStats")}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {userStats.map((u) => (
                        <div
                            key={u.userId}
                            className="
                                bg-white dark:bg-slate-800
                                border-2 border-sky-500
                                rounded-xl p-5 shadow-md
                            "
                        >
                            <div className="font-semibold text-gray-800 dark:text-sky-100 mb-2">
                                {u.displayName}
                            </div>

                            <div className="text-sm text-gray-800 dark:text-sky-100">
                                <div>Riddles answered: {u.riddlesAnswered}</div>
                                <div>Total score: {u.totalScore ?? 0}</div>
                                <div>Average score: {u.averageScore ?? 0}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* SUBMISSIONS TABLE */}
            <section className="w-full max-w-6xl mb-10">
                <h2 className="text-xl font-semibold text-sky-700 dark:text-sky-300 mb-4">
                    {t("admin.submissions")}
                </h2>

                <div className="overflow-x-auto bg-white dark:bg-slate-800 border-2 border-sky-500 rounded-xl shadow-md">
                    <table className="w-full table-auto border-collapse">
                        <thead className="bg-sky-500 dark:bg-sky-700 text-white">
                            <tr>
                                <th className="border border-sky-500 p-3">User</th>
                                <th className="border border-sky-500 p-3">Riddle</th>
                                <th className="border border-sky-500 p-3">Lat</th>
                                <th className="border border-sky-500 p-3">Lng</th>
                                <th className="border border-sky-500 p-3">Distance (m)</th>
                                <th className="border border-sky-500 p-3">Time (s)</th>
                                <th className="border border-sky-500 p-3">Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {submissions.map((s, idx) => (
                                <tr
                                    key={idx}
                                    className="
                                        text-center
                                        hover:bg-sky-50 dark:hover:bg-slate-700
                                        transition
                                    "
                                >
                                    <td className="border border-sky-500 p-2">{s.displayName}</td>
                                    <td className="border border-sky-500 p-2">{s.riddleId}</td>
                                    <td className="border border-sky-500 p-2">{s.submittedLatitude}</td>
                                    <td className="border border-sky-500 p-2">{s.submittedLongitude}</td>
                                    <td className="border border-sky-500 p-2">{s.distanceMeters ?? 0}</td>
                                    <td className="border border-sky-500 p-2">{s.timeSeconds ?? 0}</td>
                                    <td className="border border-sky-500 p-2">{s.score ?? 0}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
