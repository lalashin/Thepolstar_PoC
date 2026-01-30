import React from 'react';

const ListWidget = ({ data }) => {
    return (
        <div className="space-y-3 mt-2">
            {data.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors border border-slate-700/30">
                    <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded flex items-center justify-center bg-slate-700 font-bold text-xs ${item.rank === 1 ? 'text-brand-accent2' : 'text-brand-muted'}`}>
                            {item.rank}
                        </span>
                        <span className="font-medium">{item.team}</span>
                    </div>
                    <span className="text-brand-accent1 font-medium text-sm">{item.value}</span>
                </div>
            ))}
        </div>
    );
};

export default ListWidget;
