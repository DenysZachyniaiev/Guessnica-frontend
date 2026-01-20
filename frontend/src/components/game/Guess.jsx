import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { Icon } from "leaflet";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import 'leaflet/dist/leaflet.css';

import ObrazekIkonki from './assets/location.png';

// Updated for your local environment
const API_BASE_URL = "";

const ikonka = new Icon({
    iconUrl: ObrazekIkonki,
    iconSize: [34, 34],
    iconAnchor: [17, 34]
});

function LocationMarker({ setUserGuess, setMarkerVisible, markerVisible, userGuess }) {
    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setUserGuess([lat, lng]);
            setMarkerVisible(true);
        },
    });
    return markerVisible ? <Marker position={userGuess} icon={ikonka} /> : null;
}

export default function Guess() {
    // UI States
    const [menuOpen, setMenuOpen] = useState(false);
    const [mapExpanded, setMapExpanded] = useState(false);
    const [mobileShowMap, setMobileShowMap] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [openLightbox, setOpenLightbox] = useState(false);

    // Logic States
    const [userGuess, setUserGuess] = useState([0, 0]);
    const [markerVisible, setMarkerVisible] = useState(false);
    const [dailyRiddle, setDailyRiddle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState({ type: '', msg: '' });

    const mapRef = useRef(null);

    // 1. Fetch Daily Riddle from Localhost
    useEffect(() => {
        const fetchRiddle = async () => {
            try {
                // Endpoint from your Swagger: /game/daily
                const response = await fetch(`${API_BASE_URL}/game/daily`);
                if (!response.ok) throw new Error("Failed to fetch");
                const data = await response.json();
                setDailyRiddle(data);
            } catch (err) {
                console.error("Fetch error:", err);
                setStatus({ type: 'error', msg: "Cannot connect to local backend ." });
            } finally {
                setLoading(false);
            }
        };

        fetchRiddle();

        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', checkMobile);
        checkMobile();
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Map Resize Helper
    useEffect(() => {
        if (mapRef.current) {
            const timer = setTimeout(() => {
                mapRef.current.invalidateSize();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [mapExpanded, mobileShowMap, isMobile]);

    // 2. Submit Guess to Localhost
    const handleConfirmGuess = async () => {
        if (!markerVisible) return;
        setSubmitting(true);
        setStatus({ type: '', msg: '' });

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/game/answer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    latitude: userGuess[0],
                    longitude: userGuess[1]
                })
            });

            if (response.ok) {
                setStatus({ type: 'success', msg: "Guess submitted! Check your score." });
            } else {
                const errData = await response.json();
                setStatus({ type: 'error', msg: errData.message || "Unauthorized or invalid guess." });
            }
        } catch (error) {
            setStatus({ type: 'error', msg: "Backend unreachable at port 8080." });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center font-black italic text-sky-500 text-2xl">LOADING...</div>;

    return (
        <div className="w-full flex flex-col items-center bg-gray-100 min-h-screen">
            <Lightbox
                open={openLightbox}
                close={() => setOpenLightbox(false)}
                slides={[{ src: dailyRiddle?.imageUrl || './assets/riddle-sample.jpg' }]}
            />

            <div className="w-full bg-sky-500 text-white p-4 flex justify-between items-center shadow-lg z-30">
                <div className="font-mono text-sm tracking-widest uppercase font-bold">Next: 09:00:00</div>
                <div className="font-black text-xl italic tracking-tighter uppercase">Riddle Game</div>
                <div className="w-10"></div>
            </div>

            <div className="w-[95%] max-w-6xl bg-white border-b-yellow-100 border-black mt-6 min-h-[750px] p-4 md:p-6 flex flex-col items-center mb-10">

                {status.msg && (
                    <div className={`w-full p-3 mb-4 border-2 border-black font-bold uppercase text-xs ${status.type === 'error' ? 'bg-red-200' : 'bg-green-200'}`}>
                        {status.msg}
                    </div>
                )}

                {/* ORIGINAL MENU SECTION */}
                <div className="w-full mb-6 flex flex-col lg:flex-row items-start gap-0 relative">
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className={`z-[60] px-6 py-2 border-4 border-black font-black transition-colors uppercase text-sm
                            ${menuOpen ? 'bg-yellow-300' : 'bg-white hover:bg-yellow-300'}`}
                    >
                        MENU
                    </button>

                    <div className={`
                        hidden lg:flex flex-row items-center bg-white border-y-4 border-r-4 border-black z-50 transition-all duration-300 overflow-hidden
                        ${menuOpen ? 'max-w-xl opacity-100' : 'max-w-0 opacity-0 pointer-events-none'}
                    `}>
                        <div className="flex flex-row whitespace-nowrap py-1">
                            <button className="px-4 py-1 hover:bg-gray-100 border-r-2 border-black font-bold text-xs uppercase italic text-black">Zagadka 1</button>
                            <button className="px-4 py-1 hover:bg-gray-100 border-r-2 border-black font-bold text-xs uppercase italic text-black">Zagadka 2</button>
                            <button className="px-4 py-1 hover:bg-gray-100 font-bold text-xs uppercase italic text-black">Zagadka 3</button>
                        </div>
                    </div>

                    {menuOpen && (
                        <div className="lg:hidden absolute top-full left-0 mt-1 w-48 bg-white border-2 border-black z-[2000]">
                            <button className="w-full text-left p-2 border-b-2 border-black hover:bg-gray-100 font-bold uppercase text-xs italic">Zagadka 1</button>
                            <button className="w-full text-left p-2 border-b-2 border-black hover:bg-gray-100 font-bold uppercase text-xs italic">Zagadka 2</button>
                            <button className="w-full text-left p-2 hover:bg-gray-100 font-bold uppercase text-xs italic">Zagadka 3</button>
                        </div>
                    )}
                </div>

                <div className="w-full flex flex-col lg:flex-row gap-4 h-auto lg:h-[500px] mb-8">
                    <div
                        onClick={() => setOpenLightbox(true)}
                        className={`relative border-2 border-black rounded-lg overflow-hidden bg-black transition-all duration-500 cursor-zoom-in group ${mapExpanded ? 'lg:flex-[1.2]' : 'lg:flex-[2.5]'} w-full aspect-[4/3] lg:aspect-auto lg:h-full`}
                    >
                        <img
                            src={dailyRiddle?.imageUrl || './assets/riddle-sample.jpg'}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            alt="Riddle"
                        />
                    </div>

                    <div className={`relative flex flex-col transition-all duration-500 border-2 border-black rounded-lg bg-white ${mapExpanded ? 'lg:flex-[1.2]' : 'lg:flex-[1]'} ${mobileShowMap ? 'h-[350px]' : 'h-[60px] lg:h-full'} w-full lg:max-w-[600px]`}>
                        <div className="w-full h-12 border-b-2 border-black flex items-center justify-between px-4 bg-gray-50 flex-shrink-0">
                            <span className="font-black text-sm uppercase">Minimap</span>
                            <button onClick={() => isMobile ? setMobileShowMap(!mobileShowMap) : setMapExpanded(!mapExpanded)} className="bg-yellow-400 hover:bg-yellow-500 border-2 border-black px-3 py-1 text-xs font-black rounded uppercase transition-transform active:scale-90">
                                {isMobile ? (mobileShowMap ? "Hide" : "Show") : (mapExpanded ? "Shrink" : "Expand")}
                            </button>
                        </div>

                        <div className={`relative flex-grow w-full overflow-hidden transition-all duration-500 ${isMobile && !mobileShowMap ? 'opacity-0 invisible' : 'opacity-100 visible'}`}>
                            <MapContainer center={[51.207, 16.15]} zoom={14} style={{ height: '100%', width: '100%' }} ref={mapRef}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <LocationMarker
                                    setUserGuess={setUserGuess}
                                    userGuess={userGuess}
                                    setMarkerVisible={setMarkerVisible}
                                    markerVisible={markerVisible}
                                />
                            </MapContainer>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleConfirmGuess}
                    disabled={!markerVisible || submitting}
                    className={`w-full max-w-md py-5 border-4 border-black font-black text-2xl uppercase mt-auto transition-all
                        ${(!markerVisible || submitting)
                        ? 'bg-gray-400 cursor-not-allowed opacity-50 text-white'
                        : 'bg-sky-500 text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-sky-400 active:shadow-none active:translate-x-[6px] active:translate-y-[6px]'
                    }`}
                >
                    {submitting ? "Submitting..." : (markerVisible ? "Confirm Guess" : "Select location on map")}
                </button>
            </div>
        </div>
    );
}