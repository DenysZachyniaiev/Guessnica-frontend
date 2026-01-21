import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { Icon } from "leaflet";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import 'leaflet/dist/leaflet.css';

import ObrazekIkonki from './assets/location.png';
import RiddleImage from './assets/riddle-sample.jpg';

const targetPosition = [51.2024305556, 16.2123805556];
const ikonka = new Icon({ iconUrl: ObrazekIkonki, iconSize: [34, 34], iconAnchor: [17, 34] });

function LocationMarker({ setUserGuess, userGuess, setMarkerVisible, markerVisible }) {
    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setUserGuess([lat, lng]);
            setMarkerVisible(true);
        },
    });
    if (!markerVisible) return null;
    return <Marker position={userGuess} icon={ikonka} />;
}

export default function Guess() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [mapExpanded, setMapExpanded] = useState(false);
    const [mobileShowMap, setMobileShowMap] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [openLightbox, setOpenLightbox] = useState(false);
    const [userGuess, setUserGuess] = useState(targetPosition);
    const [markerVisible, setMarkerVisible] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const mapRef = useRef(null);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const isDark = localStorage.getItem('theme') === 'dark';
        setDarkMode(isDark);

        const handleStorageChange = () => {
            const isDark = localStorage.getItem('theme') === 'dark';
            setDarkMode(isDark);
        };

        window.addEventListener('storage', handleStorageChange);

        const interval = setInterval(() => {
            const isDark = localStorage.getItem('theme') === 'dark';
            setDarkMode(isDark);
        }, 100);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        if (mapRef.current) {
            const timer = setTimeout(() => {
                mapRef.current.invalidateSize();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [mapExpanded, mobileShowMap, isMobile]);

    return (
        <div className={`w-full flex flex-col items-center min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
            <Lightbox
                open={openLightbox}
                close={() => setOpenLightbox(false)}
                slides={[{ src: RiddleImage }]}
            />

            {/* Main Content */}
            <div className={`w-[95%] max-w-6xl mt-6 min-h-[750px] p-4 md:p-6 flex flex-col items-center mb-10 rounded-xl shadow-2xl transition-colors duration-300 ${
                darkMode
                    ? 'bg-gray-800 border-2 border-gray-700'
                    : 'bg-white border-2 border-gray-200'
            }`}>

                {/* Header Section */}
                <div className="w-full mb-6">
                    <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 rounded-lg transition-colors duration-300 ${
                        darkMode
                            ? 'bg-gradient-to-r from-blue-900/50 to-blue-800/50 border border-blue-700/50'
                            : 'bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200'
                    }`}>
                        <div className="flex flex-col gap-1">
                            <h1 className={`text-2xl md:text-3xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Daily Challenge
                            </h1>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Guess the location and earn points
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className={`px-4 py-2 rounded-lg ${
                                darkMode
                                    ? 'bg-gray-800/50 border border-gray-700'
                                    : 'bg-white border border-gray-300'
                            }`}>
                                <div className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Next in
                                </div>
                                <div className={`font-mono text-xl font-bold flex items-center gap-2 ${darkMode ? 'text-green-400' : 'text-sky-600'}`}>
                                    <span className={`w-2 h-2 rounded-full animate-pulse ${darkMode ? 'bg-green-400' : 'bg-sky-500'}`}></span>
                                    09:00:00
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RESPONSIVE MENU SECTION */}
                <div className="w-full mb-6 flex flex-col lg:flex-row items-start gap-0 relative">
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className={`z-[60] px-6 py-2 border-3 rounded-lg font-black transition-all duration-300 uppercase text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                            menuOpen
                                ? darkMode
                                    ? 'bg-yellow-500 text-black border-yellow-600'
                                    : 'bg-yellow-400 text-black border-yellow-500'
                                : darkMode
                                    ? 'bg-gray-700 text-white border-gray-600 hover:bg-yellow-500 hover:text-black'
                                    : 'bg-white text-black border-gray-300 hover:bg-yellow-400'
                        }`}
                    >
                        MENU
                    </button>

                    {/* Desktop Horizontal Menu */}
                    <div className={`
                        hidden lg:flex flex-row items-center rounded-r-lg border-3 z-50 transition-all duration-300 overflow-hidden shadow-lg
                        ${menuOpen ? 'max-w-xl opacity-100' : 'max-w-0 opacity-0 pointer-events-none'}
                        ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}
                    `}>
                        <div className="flex flex-row whitespace-nowrap py-1">
                            <button className={`px-4 py-1 border-r-2 font-bold text-xs uppercase italic transition-colors ${
                                darkMode
                                    ? 'hover:bg-gray-600 border-gray-600 text-gray-200'
                                    : 'hover:bg-gray-100 border-gray-200 text-black'
                            }`}>Zagadka 1</button>
                            <button className={`px-4 py-1 border-r-2 font-bold text-xs uppercase italic transition-colors ${
                                darkMode
                                    ? 'hover:bg-gray-600 border-gray-600 text-gray-200'
                                    : 'hover:bg-gray-100 border-gray-200 text-black'
                            }`}>Zagadka 2</button>
                            <button className={`px-4 py-1 font-bold text-xs uppercase italic transition-colors ${
                                darkMode
                                    ? 'hover:bg-gray-600 text-gray-200'
                                    : 'hover:bg-gray-100 text-black'
                            }`}>Zagadka 3</button>
                        </div>
                    </div>

                    {/* Mobile Vertical Dropdown */}
                    {menuOpen && (
                        <div className={`lg:hidden absolute top-full left-0 mt-2 w-48 rounded-lg border-2 z-[2000] shadow-xl overflow-hidden ${
                            darkMode
                                ? 'bg-gray-700 border-gray-600'
                                : 'bg-white border-gray-200'
                        }`}>
                            <button className={`w-full text-left p-3 border-b-2 font-bold uppercase text-xs italic transition-colors ${
                                darkMode
                                    ? 'border-gray-600 hover:bg-gray-600 text-gray-200'
                                    : 'border-gray-200 hover:bg-gray-50 text-black'
                            }`}>Zagadka 1</button>
                            <button className={`w-full text-left p-3 border-b-2 font-bold uppercase text-xs italic transition-colors ${
                                darkMode
                                    ? 'border-gray-600 hover:bg-gray-600 text-gray-200'
                                    : 'border-gray-200 hover:bg-gray-50 text-black'
                            }`}>Zagadka 2</button>
                            <button className={`w-full text-left p-3 font-bold uppercase text-xs italic transition-colors ${
                                darkMode
                                    ? 'hover:bg-gray-600 text-gray-200'
                                    : 'hover:bg-gray-50 text-black'
                            }`}>Zagadka 3</button>
                        </div>
                    )}
                </div>

                {/* THE CHALLENGE CONTAINER */}
                <div className="w-full flex flex-col lg:flex-row gap-4 h-auto lg:h-[500px] mb-8">
                    <div
                        onClick={() => setOpenLightbox(true)}
                        className={`
                            relative rounded-xl overflow-hidden transition-all duration-500 cursor-zoom-in group shadow-xl hover:shadow-2xl
                            ${mapExpanded ? 'lg:flex-[1.2]' : 'lg:flex-[2.5]'} 
                            w-full aspect-[4/3] lg:aspect-auto lg:h-full
                            ${darkMode ? 'border-2 border-gray-700 bg-gray-900' : 'border-2 border-gray-200 bg-black'}
                        `}
                    >
                        <img
                            src={RiddleImage}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            alt="Guess this location"
                        />
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    </div>

                    <div className={`
                        relative flex flex-col transition-all duration-500 rounded-xl shadow-xl
                        ${mapExpanded ? 'lg:flex-[1.2]' : 'lg:flex-[1]'} 
                        ${mobileShowMap ? 'h-[350px]' : 'h-[60px] lg:h-full'}
                        w-full lg:max-w-[600px]
                        ${darkMode ? 'bg-gray-700 border-2 border-gray-600' : 'bg-white border-2 border-gray-200'}
                    `}>
                        <div className={`w-full h-12 border-b-2 flex items-center justify-between px-4 flex-shrink-0 transition-colors duration-300 ${
                            darkMode
                                ? 'bg-gray-800 border-gray-600'
                                : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
                        }`}>
                            <span className={`font-black text-sm uppercase ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Minimap</span>
                            <button
                                onClick={() => isMobile ? setMobileShowMap(!mobileShowMap) : setMapExpanded(!mapExpanded)}
                                className={`border-2 px-3 py-1 text-xs font-black rounded-lg uppercase transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md ${
                                    darkMode
                                        ? 'bg-yellow-500 hover:bg-yellow-400 border-yellow-600 text-black'
                                        : 'bg-yellow-400 hover:bg-yellow-500 border-yellow-500 text-black'
                                }`}
                            >
                                {isMobile ? (mobileShowMap ? "Hide" : "Show") : (mapExpanded ? "Shrink" : "Expand")}
                            </button>
                        </div>

                        <div className={`
                            relative flex-grow w-full overflow-hidden transition-all duration-500 rounded-b-xl
                            ${isMobile && !mobileShowMap ? 'opacity-0 invisible' : 'opacity-100 visible'}
                        `}>
                            <MapContainer
                                center={targetPosition}
                                zoom={14}
                                style={{ height: '100%', width: '100%' }}
                                ref={mapRef}
                            >
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <LocationMarker
                                    setUserGuess={setUserGuess}
                                    userGuess={userGuess}
                                    setMarkerVisible={setMarkerVisible}
                                    markerVisible={markerVisible}
                                />
                            </MapContainer>

                            {markerVisible && (
                                <div className={`absolute bottom-2 left-2 text-[10px] p-2 font-mono z-[1000] pointer-events-none rounded-lg shadow-lg backdrop-blur-sm ${
                                    darkMode
                                        ? 'bg-gray-900/90 text-green-400 border border-green-500/30'
                                        : 'bg-black/80 text-white border border-white/20'
                                }`}>
                                    LAT: {userGuess[0].toFixed(6)} | LNG: {userGuess[1].toFixed(6)}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <button
                    disabled={!markerVisible}
                    className={`w-full max-w-md py-5 border-3 rounded-xl font-black text-2xl uppercase mt-auto transition-all duration-300 transform ${
                        !markerVisible
                            ? darkMode
                                ? 'bg-gray-600 cursor-not-allowed opacity-50 text-gray-400 border-gray-700'
                                : 'bg-gray-400 cursor-not-allowed opacity-50 text-white border-gray-500'
                            : darkMode
                                ? 'bg-blue-600 text-white border-blue-700 shadow-[6px_6px_0px_0px_rgba(30,58,138,1)] hover:bg-blue-500 active:shadow-none active:translate-x-[6px] active:translate-y-[6px]'
                                : 'bg-sky-500 text-white border-sky-600 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-sky-400 active:shadow-none active:translate-x-[6px] active:translate-y-[6px]'
                    }`}
                >
                    {markerVisible ? "Confirm Guess" : "Select location on map"}
                </button>
            </div>
        </div>
    );
}