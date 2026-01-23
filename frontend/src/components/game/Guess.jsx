import React, { useEffect, useRef, useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents,
    Circle,
} from "react-leaflet";
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
        return <div className="p-10 text-center">⏳ Ładowanie…</div>;
    }

    if (blocked) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-2xl font-black mb-2">🕒 Dzisiejsza zagadka</h2>
                <p>Została już rozwiązana. Wróć jutro po kolejną!</p>
            </div>
        );
    }

    if (error) {
        return <div className="p-10 text-center text-red-600">❌ {error}</div>;
    }
    return (
        <div className="max-w-6xl mx-auto p-4 flex flex-col gap-6">

            <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                slides={[{ src: riddle.imageUrl }]}
            />

            {/* OBRAZ */}
            <div
                onClick={() => setLightboxOpen(true)}
                className="cursor-zoom-in rounded-xl overflow-hidden shadow-lg"
            >
                <img
                    src={riddle.imageUrl}
                    alt="Zagadka"
                    className="w-full h-[400px] object-cover"
                />
            </div>

            {/* MAPA */}
            <div className="relative h-[450px] rounded-xl overflow-hidden border">
                <MapContainer
                    ref={mapRef}
                    center={LEGNICA_CENTER}
                    zoom={13}
                    maxBounds={LEGNICA_BOUNDS}
                    maxBoundsViscosity={1}
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    <LocationMarker
                        position={userGuess}
                        onPick={setUserGuess}
                        disabled={!!result}
                    />

                    {/* OKRĄG ODLEGŁOŚCI */}
                    {result && (
                        <Circle
                            center={userGuess}
                            radius={riddle.maxDistanceMeters}
                            pathOptions={{
                                color: result.isCorrect ? "green" : "red",
                                fillOpacity: 0.15,
                            }}
                        />
                    )}
                </MapContainer>

                {userGuess && (
                    <div className="absolute bottom-3 left-3 bg-black/80 text-white text-xs px-3 py-2 rounded-lg font-mono">
                        LAT {userGuess[0].toFixed(5)} | LNG {userGuess[1].toFixed(5)}
                    </div>
                )}
            </div>

            {/* BUTTON */}
            <button
                onClick={submitAnswer}
                disabled={!userGuess || submitting || result}
                className={`py-4 rounded-xl text-xl font-black uppercase transition
          ${
                    !userGuess || result
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-sky-500 hover:bg-sky-400 text-white"
                }
        `}
            >
                {result ? "Odpowiedź zapisana" : "Zatwierdź wybór"}
            </button>

            {/* WYNIK */}
            {result && (
                <div className="text-center p-6 rounded-xl bg-gray-100 border">
                    <div className="text-2xl font-black mb-2">
                        {result.isCorrect ? "🎉 Trafione!" : "❌ Pudło"}
                    </div>
                    <div>Punkty: <b>{result.points}</b></div>
                    <div>Odległość: <b>{Math.round(result.distanceMeters)} m</b></div>
                    <div>Czas: <b>{result.timeSeconds}s</b></div>
                </div>
            )}
        </div>
    );
}
