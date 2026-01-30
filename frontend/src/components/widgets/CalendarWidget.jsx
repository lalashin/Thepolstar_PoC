import React from 'react';

const CalendarWidget = ({ data }) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const maxRate = data.maxRate || 3.5;

    return (
        <div className="flex flex-col h-full">
            {/* Nav Header */}
            <div className="flex items-center justify-center mb-3">
                <button className="p-1 hover:bg-slate-700/50 rounded-full text-brand-muted hover:text-white transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <span className="mx-3 font-mono font-bold text-lg tracking-wider text-brand-light">2026.01</span>
                <button className="p-1 hover:bg-slate-700/50 rounded-full text-brand-muted hover:text-white transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </button>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 mb-2 text-center">
                {days.map((d, i) => (
                    <span
                        key={d}
                        className={`text-[10px] md:text-xs font-medium uppercase tracking-wider ${i === 0 ? 'text-red-400/80' : (i === 6 ? 'text-blue-400/80' : 'text-slate-500')}`}
                    >
                        {d}
                    </span>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-1.5 flex-1 content-start">
                {data.days.map((item, idx) => {
                    const rValue = item.r ? parseFloat(item.r) : 0;
                    const opacity = rValue ? Math.max(0.15, (rValue / maxRate)).toFixed(2) : 0;
                    const bgColor = item.d ? `rgba(45, 212, 191, ${opacity})` : 'transparent';
                    const textColor = opacity > 0.6 ? 'text-brand-dark font-bold' : 'text-white font-medium';
                    const hasData = item.d && item.r;

                    return (
                        <div
                            key={idx}
                            className="aspect-square rounded-md flex items-center justify-center relative group transition-all duration-300 hover:scale-105"
                            style={{ backgroundColor: bgColor, boxShadow: item.d ? '0 1px 2px 0 rgba(0,0,0,0.1)' : 'none' }}
                        >
                            {item.d && (
                                <>
                                    <span className={`text-xs ${textColor}`}>{item.d}</span>
                                    {hasData && (
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                                            {item.r}%
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarWidget;
