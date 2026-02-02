import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

// Load all SVG logos dynamically from assets
const LOGO_IMAGES = import.meta.glob('../../assets/logo/*.svg', { eager: true, as: 'url' });

// --- Filter Buttons Configuration ---
const FILTERS = [
    { label: '시즌 : 2025~2026', isDropdown: true }
];

const MapWidget = ({ isModal }) => {
    const [mapPoints, setMapPoints] = useState([]);

    useEffect(() => {
        const fetchMapData = async () => {
            try {
                const res = await axios.get('http://localhost:8000/api/map-data');
                if (Array.isArray(res.data)) {
                    setMapPoints(res.data);
                } else {
                    console.warn("Map data is not an array:", res.data);
                    setMapPoints([]);
                }
            } catch (e) {
                console.error("Map data fetch failed", e);
                setMapPoints([]);
            }
        };
        fetchMapData();
    }, []);

    // Helper to find logo URL from the imported glob
    const getLogoUrl = (filename) => {
        if (!filename) return null;
        // Match the filename within the full path keys
        const key = Object.keys(LOGO_IMAGES).find(k => k.includes(filename));
        return key ? LOGO_IMAGES[key] : null;
    };

    return (
        <div className="w-full h-full flex flex-col relative bg-slate-900 rounded-xl overflow-hidden">

            {/* Modal Filter Bar */}
            {/* Modal Filter Overlay (Floating) */}
            {isModal && (
                <div className="absolute top-0 left-0 w-full p-4 z-[1100] flex justify-between items-start pointer-events-none">
                    {/* Left: Filters */}
                    <div className="flex flex-wrap gap-2 pointer-events-auto">
                        {FILTERS.map((f, i) => (
                            <button
                                key={i}
                                className={`
                                    text-xs font-medium px-3 py-1.5 rounded-full border transition-all flex items-center shadow-lg backdrop-blur
                                    ${f.active
                                        ? 'bg-brand-accent1/20 border-brand-accent1 text-brand-accent1 font-bold shadow-[0_0_10px_rgba(45,212,191,0.2)]'
                                        : 'bg-slate-900/90 border-slate-700 text-slate-200 hover:bg-slate-800'
                                    }
                                `}
                            >
                                {f.label}
                                {f.isDropdown && (
                                    <svg className="w-3 h-3 ml-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Right: CSV Download */}
                    <div className="pointer-events-auto">
                        <button className="text-xs font-medium flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 backdrop-blur rounded-full border border-slate-700 shadow-lg transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                            CSV 다운로드
                        </button>
                    </div>
                </div>
            )}

            {/* Main Widget Badge (Non-Modal) */}
            {!isModal && (
                <div className="absolute top-3 left-3 z-10">
                    <button className="text-xs font-medium text-slate-200 bg-slate-900/90 backdrop-blur border border-slate-700 px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 hover:bg-slate-800 transition-colors">
                        <span>시즌 : 2025~2026</span>
                        <svg className="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                </div>
            )}

            <div className="flex-1 relative z-0">
                <MapContainer
                    center={[36.5, 127.8]}
                    zoom={7}
                    style={{ height: "100%", width: "100%", background: '#1e293b' }}
                    zoomControl={false}
                    attributionControl={false}
                >
                    <TileLayer
                        url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
                    />

                    {mapPoints.filter((v, i, a) => a.findIndex(t => (t.lat === v.lat && t.lng === v.lng)) === i).map((point, idx) => {
                        const logoUrl = getLogoUrl(point.logo);

                        // Custom DivIcon with SVG Image
                        // If logo not found, fallback to a circle div
                        const htmlContent = logoUrl
                            ? `<div class="w-12 h-12 relative flex items-center justify-center drop-shadow-lg hover:scale-110 transition-transform duration-200 cursor-pointer">
                                 <img src="${logoUrl}" class="w-full h-full object-contain filter drop-shadow-md" alt="${point.name}" />
                               </div>`
                            : `<div class="w-4 h-4 rounded-full bg-brand-accent1 border-2 border-white shadow-lg"></div>`;

                        const customIcon = L.divIcon({
                            className: 'bg-transparent border-none',
                            html: htmlContent,
                            iconSize: [48, 48],
                            iconAnchor: [24, 24],
                            popupAnchor: [0, -24]
                        });

                        return (
                            <Marker
                                key={idx}
                                position={[point.lat, point.lng]}
                                icon={customIcon}
                            >
                                <Tooltip direction="auto" offset={[0, -20]} opacity={1} className="!bg-slate-950 !opacity-100 !border !border-slate-700 !text-slate-200 !p-0 !rounded-lg !overflow-hidden !shadow-xl custom-leaflet-tooltip font-sans !z-[9999]">
                                    <div className="p-4 min-w-[220px] bg-slate-950">
                                        {/* Header: Home Stadium Name */}
                                        <div className="border-b border-slate-700/80 pb-2 mb-3">
                                            <h3 className="font-bold text-white text-base tracking-tight">{point.stadium}</h3>
                                        </div>

                                        {/* Content List */}
                                        <div className="space-y-2.5">
                                            {/* Date */}
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-slate-400">일자</span>
                                                <span className="text-sm text-slate-200 font-mono">{point.match_date}</span>
                                            </div>
                                            {/* Matchup */}
                                            <div className="flex justify-between items-start">
                                                <span className="text-xs text-slate-400 shrink-0 mt-0.5">대전</span>
                                                <span className="text-sm text-slate-200 text-right break-keep leading-tight pl-2">
                                                    {point.match_up}
                                                </span>
                                            </div>
                                            {/* Rate */}
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-slate-400">시청률</span>
                                                <span className="text-base font-bold text-brand-accent1">{point.rate}%</span>
                                            </div>
                                            {/* Trend */}
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-slate-400">시즌대비</span>
                                                <span className="text-base font-bold !text-rose-500">
                                                    {point.trend_val}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Tooltip>
                            </Marker>
                        );
                    })}
                </MapContainer>

                {/* Legend */}
                <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur px-3 py-2 rounded-lg border border-slate-700 z-[1000] text-xs text-slate-300 shadow-lg">
                    <div className="font-bold text-white mb-1">범례</div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        <span>시청률 상승 (시즌 평균 대비)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        <span>시청률 하락 (시즌 평균 대비)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapWidget;
