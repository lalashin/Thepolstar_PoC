import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

// --- Filter Buttons Configuration ---
const FILTERS = [
    { label: '2025-26 시즌', isDropdown: true },
    { label: '여자부', isDropdown: true },
    { label: '경기' },
    { label: '주간' },
    { label: '라운드', active: true }, // 기본 활성화 요청 반영
    { label: '년간' },
    { label: '분기' },
    { label: '월간' },
    { label: '일간' }
];

const MapView = ({ data }) => {
    const map = useMap();

    // Bounds: 한반도 대략적 좌표 포함
    useEffect(() => {
        if (map) {
            // fitBounds logic could go here if points are dynamic
        }
    }, [map]);

    return null;
}

const MapWidget = ({ data, isModal }) => {
    // isModal prop을 통해 확장 모드일 때 UI 변경 (헤더 필터 등)
    const [mapPoints, setMapPoints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMapData = async () => {
            try {
                // Call the backend API we created
                const res = await axios.get('http://localhost:8000/api/map-data');
                setMapPoints(res.data);
            } catch (e) {
                console.error("Map data fetch failed", e);
            } finally {
                setLoading(false);
            }
        };
        fetchMapData();
    }, []);

    // Filter Bar (Only visible in Modal mode as per requirements?)
    // "확대보기했을 때는 상세보기 레이어 팝업... [상단 필터바]" -> Modal Only

    return (
        <div className="w-full h-full flex flex-col relative bg-slate-900 rounded-xl overflow-hidden">

            {/* 상단 필터바 (Modal 모드일 때만 표시) */}
            {isModal && (
                <div className="flex flex-wrap gap-2 p-4 border-b border-slate-800 bg-slate-900 z-10">
                    {FILTERS.map((f, i) => (
                        <button
                            key={i}
                            className={`
                                text-xs md:text-sm px-3 py-1.5 rounded-full border transition-all flex items-center
                                ${f.active
                                    ? 'bg-brand-accent1/20 border-brand-accent1 text-brand-accent1 font-bold shadow-[0_0_10px_rgba(45,212,191,0.2)]'
                                    : 'bg-slate-800 border-slate-700 text-brand-muted hover:border-brand-muted hover:text-white'
                                }
                            `}
                        >
                            {f.label}
                            {f.isDropdown && (
                                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            )}
                        </button>
                    ))}

                    <div className="flex-1"></div>

                    {/* CSV Download Button */}
                    <button className="text-xs flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium px-3 py-1.5 bg-emerald-400/10 rounded-lg border border-emerald-400/20">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        CSV 다운로드
                    </button>
                </div>
            )}

            <div className="flex-1 relative z-0">
                {/* 지도가 들어갈 공간 */}
                {/* Leaflet Map */}
                <MapContainer
                    center={[36.5, 127.8]} // 대한민국 중심 좌표
                    zoom={7}
                    style={{ height: "100%", width: "100%", background: '#1e293b' }}
                    zoomControl={false}
                    attributionControl={false}
                >
                    {/* Dark Mode styled tiles */}
                    <TileLayer
                        url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
                    />

                    {mapPoints.map((point, idx) => {
                        // Logic: 시청률 1.0% 이상은 Red(#F43F5E), 미만은 Teal(#2DD4BF)
                        // Radius: 기본 10 + 시청률 * 10
                        const isHigh = point.value >= 1.0;
                        const color = isHigh ? '#F43F5E' : '#2DD4BF';
                        const fillColor = isHigh ? '#F43F5E' : '#2DD4BF';
                        const radius = 8 + (point.value * 12);

                        return (
                            <CircleMarker
                                key={idx}
                                center={[point.lat, point.lng]}
                                radius={radius}
                                pathOptions={{
                                    color: color,
                                    fillColor: fillColor,
                                    fillOpacity: 0.6,
                                    weight: 1
                                }}
                            >
                                <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                                    <div className="text-center">
                                        <p className="font-bold text-slate-900 text-sm">{point.name}</p>
                                        <p className="text-xs text-slate-600">{point.stadium}</p>
                                    </div>
                                </Tooltip>
                                <Popup className="custom-popup">
                                    <div className="p-2 min-w-[150px]">
                                        <div className="flex justify-between items-center mb-2 border-b border-slate-200 pb-1">
                                            <span className="font-bold text-slate-800">{point.name}</span>
                                            <span className={`text-xs font-bold px-1.5 py-0.5 rounded text-white ${isHigh ? 'bg-rose-500' : 'bg-teal-500'}`}>
                                                Rank {idx + 1}
                                            </span>
                                        </div>
                                        <div className="space-y-1 text-sm text-slate-600">
                                            <div className="flex justify-between">
                                                <span>평균 시청률</span>
                                                <span className="font-bold text-slate-900">{point.value}%</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>최고 시청률</span>
                                                <span className="text-slate-900">{point.max}%</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>총 경기수</span>
                                                <span className="text-slate-900">{point.count}경기</span>
                                            </div>
                                        </div>
                                        <button className="w-full mt-3 py-1 bg-slate-100 hover:bg-slate-200 text-xs text-slate-600 rounded font-medium transition-colors">
                                            상세 분석 보기 &rarr;
                                        </button>
                                    </div>
                                </Popup>
                            </CircleMarker>
                        );
                    })}
                </MapContainer>

                {/* Legend (범례) */}
                <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur px-3 py-2 rounded-lg border border-slate-700 z-[1000] text-xs text-slate-300">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="w-3 h-3 rounded-full bg-rose-500 opacity-80"></span>
                        <span>1.0% 이상 (인기)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-teal-400 opacity-80"></span>
                        <span>1.0% 미만 (일반)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapWidget;
