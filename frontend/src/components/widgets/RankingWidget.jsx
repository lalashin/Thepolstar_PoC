import React from 'react';

const RankingWidget = ({ data, isModal }) => {
    if (data.viewType === 'ranking_split') {
        return <SplitRankingView data={data} isModal={isModal} />;
    }

    return (
        <div className="flex flex-col gap-3 mt-1 h-full overflow-y-auto custom-scrollbar">
            {data.list && data.list.map((item, idx) => (
                <div key={idx} className="relative pt-1">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-brand-light">{idx + 1}. {item.match}</span>
                        <span className="font-bold text-brand-accent1">{item.rate}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-1.5">
                        <div
                            className="bg-gradient-to-r from-brand-accent1 to-blue-500 h-1.5 rounded-full"
                            style={{ width: `${parseFloat(item.rate) * 20}%` }}
                        ></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const SplitRankingView = ({ data, isModal }) => {
    const [expanded, setExpanded] = React.useState(false);

    const allOthers = data.others || [];
    const displayedOthers = (isModal || expanded) ? allOthers : allOthers.slice(0, 4);

    return (
        <div className="flex w-full h-full gap-4 px-1 py-1">
            {/* Left: Top 1 */}
            <div className="flex-1 flex flex-col justify-center border-r border-slate-700/50 pr-4 pl-2">
                <div className="text-base font-bold text-white mb-2">TOP 1</div>
                <div className="text-brand-light text-sm font-medium mb-1">{data.top1.match}</div>
                <div className="text-brand-muted text-xs mb-4">{data.top1.date}</div>
                <div className="text-5xl font-bold text-white tracking-tighter">{data.top1.rate}</div>
            </div>

            {/* Right: List */}
            <div className="flex-[2] flex flex-col">
                {/* Header / Expand Button */}
                <div className="flex justify-end mb-2 h-6 items-center">
                    {!isModal && (
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="text-[10px] text-brand-light bg-slate-700 hover:bg-slate-600 px-2 py-0.5 rounded flex items-center gap-1 transition-colors"
                        >
                            <span>{expanded ? '▲' : '▼'}</span>
                            <span>{expanded ? '접기' : '전체'}</span>
                        </button>
                    )}
                </div>

                {/* List Rows */}
                <div className="flex flex-col gap-1 w-full">
                    {displayedOthers.map((item, idx) => (
                        <div key={idx} className="grid grid-cols-[3rem_6rem_1fr_4rem] gap-2 text-xs items-center py-2 border-b border-white/5 hover:bg-white/5 transition-colors rounded px-1">
                            <div className="font-bold text-brand-light">TOP{item.rank}</div>
                            <div className="text-brand-muted tabular-nums">{item.date}</div>
                            <div className="text-brand-light truncate text-center font-medium">{item.match}</div>
                            <div className="font-bold text-brand-accent1 text-right">{item.rate}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default RankingWidget;
