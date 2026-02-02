import React, { useState } from 'react';

const CalendarWidget = ({ data, isModal }) => {
    const daysHeader = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const maxRate = data.maxRate || 3.5;
    const currentMonth = data.currentMonth || '2026.01';
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const legends = [
        { label: 'Low (<1.0%)', opacity: 0.2 },
        { label: 'Medium (1.0~1.8%)', opacity: 0.5 },
        { label: 'High (1.8~2.5%)', opacity: 0.8 },
        { label: 'Highest (>2.5%)', opacity: 1.0 },
    ];

    // Helper for color intensity
    const getCellStyle = (rate) => {
        if (!rate) return { background: 'transparent', color: 'transparent' };

        // Opacity 0.2 ~ 1.0
        const opacity = Math.min(1, Math.max(0.2, rate / maxRate));
        return {
            backgroundColor: `rgba(45, 212, 191, ${opacity})`, // Teal Brand Accent
            color: opacity > 0.6 ? '#0f172a' : '#fff'
        };
    };

    return (
        <div className={`flex flex-col h-full w-full ${isModal ? 'p-4' : ''}`}>
            {/* Header Filter Pill */}
            <div className="flex justify-center mb-4">
                <div className="flex items-center gap-4 bg-slate-800/80 rounded-full px-5 py-1.5 border border-slate-600/50 shadow-lg backdrop-blur">
                    <span className="text-brand-muted font-semibold text-xs">월별</span>
                    <div className="h-3 w-px bg-slate-600"></div>
                    <div className="flex items-center gap-3">
                        <button className="text-slate-400 hover:text-white transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                        </button>
                        <span className="font-mono font-bold text-blue-100/90 tracking-wide text-sm">{currentMonth}</span>
                        <button className="text-slate-400 hover:text-white transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 flex flex-col min-h-0">
                {/* Weekday Headers */}
                <div className={`grid grid-cols-7 mb-2 ${isModal ? 'max-w-4xl mx-auto w-full' : ''}`}>
                    {daysHeader.map((d, i) => (
                        <div key={d} className={`text-center text-[10px] font-bold tracking-widest ${i === 0 ? 'text-red-400/70' : (i === 6 ? 'text-blue-400/70' : 'text-slate-500')}`}>
                            {d}
                        </div>
                    ))}
                </div>

                {/* Days Grid */}
                <div className={`grid grid-cols-7 flex-1 overflow-visible pr-1 ${isModal ? 'content-center justify-items-center gap-4 max-w-4xl mx-auto w-full' : 'content-start gap-2'}`}>
                    {data.days && data.days.map((day, idx) => {
                        const style = getCellStyle(day.r);
                        const dayName = daysHeader[idx % 7];
                        const isHovered = hoveredIndex === idx;

                        return (
                            <div
                                key={idx}
                                className={`aspect-square flex items-center justify-center relative ${isModal ? 'max-w-[3.5rem] w-full' : 'w-full'} z-0 hover:z-50`}
                                onMouseEnter={() => setHoveredIndex(idx)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                <div
                                    className={`w-full h-full rounded-full flex items-center justify-center text-sm font-bold shadow-sm transition-all duration-200 ${day.r ? 'cursor-pointer hover:scale-105 hover:ring-2 hover:ring-brand-accent1/50 hover:ring-offset-2 hover:ring-offset-slate-900 shadow-lg z-10' : ''}`}
                                    style={style}
                                >
                                    {day.d}
                                </div>

                                {/* Custom Tooltip - State Driven */}
                                {isHovered && day.d && day.r > 0 && (
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 whitespace-nowrap animate-in fade-in zoom-in-95 duration-100 origin-bottom">
                                        <div className="bg-slate-900/95 backdrop-blur border border-slate-700/80 p-3 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] flex flex-col gap-1 text-xs relative">
                                            <div className="flex items-center gap-2 text-slate-400 border-b border-slate-700/50 pb-2 mb-1">
                                                <span className="font-mono text-slate-300">{currentMonth}.{String(day.d).padStart(2, '0')}</span>
                                                <span className="w-px h-3 bg-slate-700"></span>
                                                <span className="font-bold text-white tracking-wide">{dayName}</span>
                                            </div>
                                            <div className="flex justify-between items-center gap-4">
                                                <span className="text-slate-400 font-medium">시청률</span>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-brand-accent1 font-bold text-base">{day.r}</span>
                                                    <span className="text-[10px] text-brand-muted">%</span>
                                                </div>
                                            </div>

                                            {/* Arrow */}
                                            <div className="w-3 h-3 bg-slate-900 border-r border-b border-slate-700/80 rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1.5"></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            {/* Legend */}
            <div className={`pt-6 border-t border-slate-800/50 flex flex-wrap justify-center gap-6 ${isModal ? 'mt-10' : 'mt-4'}`}>
                {legends.map((l, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full shadow-sm"
                            style={{ backgroundColor: `rgba(45, 212, 191, ${l.opacity})` }}
                        ></div>
                        <span className="text-[11px] text-slate-400 font-medium tracking-wide">{l.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CalendarWidget;
