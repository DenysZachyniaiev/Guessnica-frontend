import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from 'react-leaflet';
import { useTranslation } from 'react-i18next';
import { Icon } from "leaflet";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "leaflet/dist/leaflet.css";
import MarkerIconImg from "./assets/location.png";

const LEGNICA_CENTER = [51.2070, 16.1550];

const LEGNICA_BOUNDS = [
    [51.14, 16.05],
    [51.28, 16.30],
];

const markerIcon = new Icon({
    iconUrl: MarkerIconImg,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
});


function LocationMarker({ position, onPick, disabled }) {
    useMapEvents({
        click(e) {
            if (disabled) return;
            onPick([e.latlng.lat, e.latlng.lng]);
        },
    });

    if (!position) return null;
    return <Marker position={position} icon={markerIcon} />;
}

export default function Guess() {
    const mapRef = useRef(null);

    const [riddle, setRiddle] = useState(null);
    const [userGuess, setUserGuess] = useState(null);
    const [result, setResult] = useState(null);

    const [loading, setLoading] = useState(true);
    const [blocked, setBlocked] = useState(false);
    const [error, setError] = useState(null);

    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        const isDark = localStorage.getItem('theme') === 'dark' || document.documentElement.classList.contains('dark');
        setDarkMode(isDark);

        const observer = new MutationObserver(() => {
            const isDark = document.documentElement.classList.contains('dark');
            setDarkMode(isDark);
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const loadDaily = async () => {
            try {
                const res = await fetch("/game/daily", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                    },
                });

                if (res.status === 409) {
                    setBlocked(true);
                    return;
                }

                if (!res.ok) {
                    throw new Error("Nie udało się pobrać zagadki");
                }

                const data = await res.json();

                if (data.isAnswered) {
                    setBlocked(true);
                } else {
                    setRiddle(data);
                }
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        loadDaily();
    }, []);

    useEffect(() => {
        if (mapRef.current) {
            setTimeout(() => mapRef.current.invalidateSize(), 300);
        }
    }, []);

    const submitAnswer = async () => {
        if (!userGuess || submitting) return;

        setSubmitting(true);

        try {
            const res = await fetch("/game/answer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                },
                body: JSON.stringify({
                    latitude: userGuess[0],
                    longitude: userGuess[1],
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message);
            }

            const data = await res.json();
            setResult(data);
        } catch (e) {
            alert(e.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
                darkMode
                    ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900'
                    : 'bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50'
            }`}>
                <div className="text-center">
                    <div className={`w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4 ${
                        darkMode ? 'border-blue-400' : 'border-sky-600'
                    }`}></div>
                    <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {t('game.loadingGame')}
                    </p>
                </div>
            </div>
        );
    }

    if (blocked) {
        return (
            <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
                darkMode
                    ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900'
                    : 'bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50'
            }`}>
                <div className={`max-w-md w-full mx-4 p-8 rounded-2xl shadow-xl text-center transition-colors duration-300 ${
                    darkMode
                        ? 'bg-gray-800/50 border-2 border-gray-700'
                        : 'bg-white border-2 border-gray-200'
                }`}>
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl ${
                        darkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-sky-100 text-sky-600'
                    }`}>
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className={`text-3xl font-black mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Today's Challenge Complete
                    </h2>
                    <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        You've already solved today's puzzle. Come back tomorrow for a new challenge!
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
                darkMode
                    ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900'
                    : 'bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50'
            }`}>
                <div className="max-w-md w-full mx-4 p-8 rounded-2xl shadow-xl text-center bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800">
                    <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-3 text-red-600 dark:text-red-400">Error</h2>
                    <p className="text-lg text-red-600 dark:text-red-400">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen py-8 px-4 transition-colors duration-300 ${
            darkMode
                ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900'
                : 'bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50'
        }`}>
            <div className="max-w-7xl mx-auto">
                <Lightbox
                    open={lightboxOpen}
                    close={() => setLightboxOpen(false)}
                    slides={[{ src: riddle.imageUrl }]}
                />

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className={`text-4xl md:text-5xl font-black mb-3 transition-colors duration-300 ${
                        darkMode
                            ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400'
                            : 'text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600'
                    }`}>
                        {t('game.dailyChallenge')}
                    </h1>
                    <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {t('game.clickToGuess')}
                    </p>
                </div>

                {/* Riddle Description Card */}
                <div className={`mb-6 p-6 rounded-2xl shadow-xl transition-colors duration-300 ${
                    darkMode
                        ? 'bg-gray-800/50 border-2 border-gray-700'
                        : 'bg-white border-2 border-gray-200'
                }`}>
                    <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                            darkMode ? 'bg-blue-600/20' : 'bg-sky-100'
                        }`}>
                            <svg className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-sky-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                Riddle Clue
                            </h3>
                            <p className={`text-xl font-medium italic ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                "{riddle.description}"
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Image */}
                    <div
                        onClick={() => setLightboxOpen(true)}
                        className={`cursor-zoom-in rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:scale-[1.02] ${
                            darkMode
                                ? 'bg-gray-800/50 border-2 border-gray-700'
                                : 'bg-white border-2 border-gray-200'
                        }`}
                    >
                        <img
                            src={riddle.imageUrl}
                            alt="Challenge"
                            className="w-full h-[500px] object-cover"
                        />
                        <div className={`p-4 text-center transition-colors duration-300 ${
                            darkMode ? 'bg-gray-800/50 text-gray-300' : 'bg-white text-gray-600'
                        }`}>
                            <p className="text-sm font-medium flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                </svg>
                                {t('game.clickToEnlarge')}
                            </p>
                        </div>
                    </div>

                    {/* Map */}
                    <div className={`rounded-2xl overflow-hidden shadow-xl transition-colors duration-300 ${
                        darkMode
                            ? 'bg-gray-800/50 border-2 border-gray-700'
                            : 'bg-white border-2 border-gray-200'
                    }`}>
                        <div className="relative h-[500px]">
                            <MapContainer
                                ref={mapRef}
                                center={LEGNICA_CENTER}
                                zoom={13}
                                maxBounds={LEGNICA_BOUNDS}
                                maxBoundsViscosity={1}
                                style={{ height: "100%", width: "100%" }}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />

                                <LocationMarker
                                    position={userGuess}
                                    onPick={setUserGuess}
                                    disabled={!!result}
                                />

                                {result && (
                                    <Circle
                                        center={userGuess}
                                        radius={riddle.maxDistanceMeters}
                                        pathOptions={{
                                            color: result.isCorrect ? "#10b981" : "#ef4444",
                                            fillOpacity: 0.15,
                                            weight: 3,
                                        }}
                                    />
                                )}
                            </MapContainer>

                            {userGuess && (
                                <div className={`absolute bottom-4 left-4 backdrop-blur-sm px-4 py-3 rounded-xl font-mono text-sm shadow-lg transition-colors duration-300 ${
                                    darkMode
                                        ? 'bg-gray-900/95 text-white border border-gray-700'
                                        : 'bg-white/95 text-gray-900 border border-gray-200'
                                }`}>
                                    <div className="flex items-center gap-2">
                                        <svg className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-sky-600'}`} fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                        <span>{t('game.latitude')} {userGuess[0].toFixed(5)}</span>
                                        <span className={darkMode ? 'text-gray-600' : 'text-gray-400'}>|</span>
                                        <span>{t('game.longitude')} {userGuess[1].toFixed(5)}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    onClick={submitAnswer}
                    disabled={!userGuess || submitting || result}
                    className={`w-full py-5 rounded-2xl text-xl font-black uppercase transition-all duration-300 shadow-xl transform ${
                        !userGuess || result
                            ? `${darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-300 text-gray-500'} cursor-not-allowed`
                            : `${darkMode
                                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500'
                                : 'bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500'
                            } text-white hover:scale-[1.02] active:scale-[0.98]`
                    }`}
                >
                    {submitting && t('game.submitting')}
                    {!submitting && result && t('game.answerRecorded')}
                    {!submitting && !result && (userGuess ? t('game.submitGuess') : t('game.selectLocationFirst'))}
                </button>

                {/* Result */}
                {result && (
                    <div className={`mt-6 p-8 rounded-2xl shadow-xl transition-all duration-300 ${
                        result.isCorrect
                            ? darkMode
                                ? 'bg-green-900/30 border-2 border-green-500'
                                : 'bg-green-50 border-2 border-green-400'
                            : darkMode
                                ? 'bg-red-900/30 border-2 border-red-500'
                                : 'bg-red-50 border-2 border-red-400'
                    }`}>
                        <div className="text-center">
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                                result.isCorrect
                                    ? darkMode ? 'bg-green-500/20' : 'bg-green-100'
                                    : darkMode ? 'bg-red-500/20' : 'bg-red-100'
                            }`}>
                                {result.isCorrect ? (
                                    <svg className={`w-12 h-12 ${darkMode ? 'text-green-400' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg className={`w-12 h-12 ${darkMode ? 'text-red-400' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                            </div>
                            <h3 className={`text-3xl font-black mb-6 ${
                                result.isCorrect
                                    ? darkMode ? 'text-green-400' : 'text-green-700'
                                    : darkMode ? 'text-red-400' : 'text-red-700'
                            }`}>
                                {result.isCorrect ? "Correct!" : "Try Again Tomorrow!"}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                                <div className={`p-6 rounded-xl shadow-lg transition-colors duration-300 ${
                                    darkMode ? 'bg-gray-800/50 border-2 border-gray-700' : 'bg-white border-2 border-gray-200'
                                }`}>
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                                        darkMode ? 'bg-blue-600/20' : 'bg-sky-100'
                                    }`}>
                                        <svg className={`w-7 h-7 ${darkMode ? 'text-blue-400' : 'text-sky-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                        </svg>
                                    </div>
                                    <div className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Points</div>
                                    <div className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>{result.points}</div>
                                </div>

                                <div className={`p-6 rounded-xl shadow-lg transition-colors duration-300 ${
                                    darkMode ? 'bg-gray-800/50 border-2 border-gray-700' : 'bg-white border-2 border-gray-200'
                                }`}>
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                                        darkMode ? 'bg-blue-600/20' : 'bg-sky-100'
                                    }`}>
                                        <svg className={`w-7 h-7 ${darkMode ? 'text-blue-400' : 'text-sky-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Distance</div>
                                    <div className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>{Math.round(result.distanceMeters)}m</div>
                                </div>

                                <div className={`p-6 rounded-xl shadow-lg transition-colors duration-300 ${
                                    darkMode ? 'bg-gray-800/50 border-2 border-gray-700' : 'bg-white border-2 border-gray-200'
                                }`}>
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                                        darkMode ? 'bg-blue-600/20' : 'bg-sky-100'
                                    }`}>
                                        <svg className={`w-7 h-7 ${darkMode ? 'text-blue-400' : 'text-sky-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Time</div>
                                    <div className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>{result.timeSeconds}s</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}