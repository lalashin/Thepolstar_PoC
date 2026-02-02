import React from 'react';

const RankingWidget = ({ data, isModal, widget, openModal }) => {
    if (data.viewType === 'ranking_split') {
        return <SplitRankingView data={data} isModal={isModal} widget={widget} openModal={openModal} />;
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

const SplitRankingView = ({ data, isModal, widget, openModal }) => {
    // Fallback for fields
    const allOthers = data.others || data.list || [];
    const displayedOthers = isModal ? allOthers : allOthers.slice(0, 4);
    const topItem = data.top1 || data.topRecord || {};

    return (
        <div className="flex w-full h-full gap-4 px-1 py-1">
            {/* Left: Top 1 */}
            <div className="flex-1 flex flex-col justify-center border-r border-slate-700/50 pr-4 pl-2">
                <div className="text-base font-bold text-white mb-2">TOP 1</div>
                <div className="text-brand-light text-sm font-medium mb-1">{topItem.match}</div>
                <div className="text-brand-muted text-xs mb-4">{topItem.date}</div>
                <div className="text-5xl font-bold text-white tracking-tighter">{topItem.rate}</div>
            </div>

            {/* Right: List */}
            <div className="flex-[2] flex flex-col">
                {/* Header / Expand Button */}
                <div className="flex justify-end mb-2 h-6 items-center">
                    {!isModal && (
                        <button
                            onClick={() => {
                                if (openModal) {
                                    const newTitle = widget.title ? widget.title.replace('TOP5', '전체리스트') : widget.title;
                                    openModal({ ...widget, title: newTitle });
                                }
                            }}
                            className="text-[10px] text-brand-light bg-slate-700 hover:bg-slate-600 px-2 py-0.5 rounded flex items-center gap-1 transition-colors"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
                            <span>전체보기</span>
                        </button>
                    )}
                </div>

                {/* List Rows */}
                <div className="flex-1 min-h-0 flex flex-col gap-1 w-full overflow-y-auto custom-scrollbar pr-1">
                    {displayedOthers.map((item, idx) => (
                        <div key={idx} className="grid grid-cols-[3rem_6rem_1fr_4rem] gap-2 text-xs items-center py-2 border-b border-white/5 hover:bg-white/5 transition-colors rounded px-1">
                            <div className="font-bold text-brand-light">TOP{isModal ? idx + 2 : item.rank.replace('TOP', '')}</div>
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
