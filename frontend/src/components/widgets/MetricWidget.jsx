import React from 'react';

const MetricWidget = ({ data, isModal }) => {
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

export default MetricWidget;
