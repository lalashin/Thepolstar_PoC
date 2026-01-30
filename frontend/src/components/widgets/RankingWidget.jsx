import React from 'react';

const RankingWidget = ({ data }) => {
    return (
        <div className="flex flex-col gap-3 mt-1 h-full overflow-y-auto custom-scrollbar">
            {data.list.map((item, idx) => (
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

export default RankingWidget;
