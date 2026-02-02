import React from 'react';

const MetricWidget = ({ data, isModal }) => {
    // Check for Season Avg View (w2)
    if (data.viewType === 'season_avg') {
        return <SeasonAvgView data={data} isModal={isModal} />;
    }

    // Check if it's the complex new widget (w1)
    if (data.isComplex) {
        return <ComplexDailyViewership data={data} isModal={isModal} />;
    }

    // Existing Metric Logic
    const isUp = data.trendUp;
    const color = isUp ? 'text-brand-accent1' : 'text-brand-accent2';
    const trendIcon = isUp ? '▲' : '▼';
    const sizeClass = isModal ? 'text-5xl' : 'text-3xl';

    return (
        <div className="flex flex-col h-full justify-center">
            <div className={`font-bold text-white ${sizeClass} tracking-tight mb-2`}>{data.value}</div>
            <div className={`flex items-center text-sm font-medium ${color} bg-white/5 rounded-lg w-fit px-2 py-1`}>
                <span className="mr-1">{trendIcon}</span>
                <span>{data.trend}</span>
                <span className="text-brand-muted ml-2 font-normal">{data.label}</span>
            </div>
        </div>
    );
};

const ComplexDailyViewership = ({ data, isModal }) => {
    return (
        <div className="w-full text-xs text-brand-light flex flex-col gap-2 pr-1">
            {/* Header Date Filter - Pill Style */}
            <div className="flex justify-center mb-3">
                <div className="flex items-center gap-4 bg-slate-800/80 rounded-full px-5 py-1.5 border border-slate-600/50 shadow-lg backdrop-blur mx-auto">
                    <button className="text-slate-400 hover:text-white transition-colors p-1" title="이전">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                    <span className="font-semibold text-blue-100/90 tracking-wide text-sm">{data.date}</span>
                    <button className="text-slate-400 hover:text-white transition-colors p-1" title="다음">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                </div>
            </div>

            {/* Section 1 */}
            <Section
                title={data.section1.title}
                headers={data.section1.headers}
                rows={data.section1.rows}
                defaultRows={2}
                modalMode={isModal}
                cols="grid-cols-[0.8fr_1fr_1.5fr_0.8fr_0.8fr_0.8fr]"
            />

            {/* Section 2 */}
            <Section
                title={data.section2.title}
                headers={data.section2.headers}
                rows={data.section2.rows}
                defaultRows={4}
                modalMode={isModal}
                cols="grid-cols-[0.8fr_1fr_1.5fr_0.8fr_0.8fr]"
            />
        </div>
    )
}

const SeasonAvgView = ({ data, isModal }) => {
    // Rankings count: Always 5 as per user request
    const hasRankings = data.topRankings && data.topRankings.length > 0;
    const displayRankings = hasRankings ? data.topRankings.slice(0, 5) : [];

    return (
        <div className="w-full h-full flex flex-col text-brand-light">
            {/* Header Filter - Pill Style */}
            <div className="flex justify-center mb-6">
                <div className="flex items-center gap-4 bg-slate-800/80 rounded-full px-5 py-1.5 border border-slate-600/50 shadow-lg backdrop-blur">
                    <span className="text-brand-muted font-semibold text-xs">시즌</span>
                    <div className="h-3 w-px bg-slate-600"></div>
                    <span className="font-semibold text-blue-100/90 tracking-wide text-sm">{data.season}</span>
                    <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>

            <div className={`flex flex-1 items-center justify-center ${isModal ? 'gap-12 px-8' : 'gap-6 px-2'}`}>
                {/* Left Side: Stats */}
                <div className="flex flex-col flex-1 items-center justify-center text-center">
                    <div className={`font-bold text-white ${isModal ? 'text-7xl' : 'text-5xl'} tracking-tighter leading-none mb-3`}>
                        {data.currentRate}
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`flex items-center text-red-400 font-bold ${isModal ? 'text-2xl' : 'text-xl'}`}>
                            {data.trendUp ? '↗' : '↘'} {data.trend}
                        </span>
                    </div>
                    <div className="text-brand-muted text-sm font-medium opacity-80">
                        {data.comparison}
                    </div>
                </div>

                {/* Vertical Divider & Rankings (Conditional) */}
                {hasRankings && (
                    <>
                        <div className="w-px bg-gradient-to-b from-transparent via-slate-600/50 to-transparent self-stretch mx-2"></div>
                        <div className="flex flex-col flex-1 text-sm">
                            {displayRankings.map((item, idx) => (
                                <div key={idx} className={`flex items-center justify-between py-1.5 ${isModal ? 'text-lg border-b border-white/5 py-3' : ''}`}>
                                    <div className="flex items-center gap-3">
                                        <span className={`font-bold ${idx === 0 ? 'text-yellow-400' : (idx < 3 ? 'text-brand-light' : 'text-brand-muted')}`}>TOP{item.rank}</span>
                                        <span className="text-brand-muted">{item.season}</span>
                                    </div>
                                    <span className="font-bold text-brand-accent1 tabular-nums">{item.rate}</span>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const Section = ({ title, headers, rows, defaultRows, modalMode, cols }) => {
    // modalMode typically implies expanded view or full view
    const [localExpanded, setLocalExpanded] = React.useState(false);

    // Logic: if modal, always full. If not, use local toggle state.
    // User said: "Click title -> toggle full list / 2 lines"
    // So even in widget, it is toggleable.
    const isExpanded = localExpanded || modalMode;
    const displayRows = isExpanded ? rows : rows.slice(0, defaultRows);

    return (
        <div className="mb-2">
            <button
                className="w-full text-left font-semibold text-brand-accent1 mb-2 hover:bg-white/5 p-1 rounded transition-colors flex items-center justify-between group"
                onClick={() => setLocalExpanded(!localExpanded)}
            >
                <div className="flex items-center gap-2">
                    <span className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>▶</span>
                    {title}
                </div>
                {!modalMode && (
                    <span className="text-[10px] text-brand-muted opacity-0 group-hover:opacity-100 transition-opacity">
                        {isExpanded ? 'Click to Collapse' : 'Click to Expand'}
                    </span>
                )}
            </button>
            <div className="grid gap-1">
                {/* Header */}
                <div className={`grid ${cols} gap-2 bg-white/10 p-2 rounded font-bold text-center text-brand-light`}>
                    {headers.map((h, i) => <div key={i}>{h}</div>)}
                </div>
                {/* Rows */}
                {displayRows.map((row, idx) => (
                    <div key={idx} className={`grid ${cols} gap-2 border-b border-white/5 p-2 text-center hover:bg-white/5 transition-colors items-center`}>
                        {Object.values(row).map((val, vIdx) => <div key={vIdx} className="truncate" title={val}>{val}</div>)}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MetricWidget;
