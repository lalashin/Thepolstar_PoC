import React from 'react';
import MetricWidget from './widgets/MetricWidget';
import ListWidget from './widgets/ListWidget';
import RankingWidget from './widgets/RankingWidget';
import CalendarWidget from './widgets/CalendarWidget';
import ChartWidget from './widgets/ChartWidget';
import MapWidget from './widgets/MapWidget';

import { useDashboard } from '../context/DashboardContext';

const WidgetCard = ({ widget, onDragStart, onDragOver, onDragEnter, onDragLeave, onDrop }) => {
    const { openModal, toggleWidgetVisibility } = useDashboard();
    const { id, type, title, colSpan, height } = widget;

    // Icon mapping
    const getIcon = (t) => {
        if (t.includes('시청률')) return <svg className="w-5 h-5 text-brand-accent1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>;
        if (t.includes('지표') || t.includes('순위')) return <svg className="w-5 h-5 text-brand-accent2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>;
        if (t.includes('지도') || t.includes('지역')) return <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;

        return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>;
    };

    const renderContent = () => {
        const commonProps = { data: widget.data, widget, openModal };
        switch (type) {
            case 'metric': return <MetricWidget {...commonProps} />;
            case 'list': return <ListWidget {...commonProps} />;
            case 'ranking': return <RankingWidget {...commonProps} />;
            case 'calendar': return <CalendarWidget {...commonProps} />;
            case 'chart': return <ChartWidget {...commonProps} />;
            case 'map': return <MapWidget {...commonProps} />;
            default: return <div>Unknown Widget Type</div>;
        }
    };

    // Resize Handler Logic handled in Grid or here?
    // User wanted re-implementation. I will dispatch an event or use callback prop.
    // For now, let's just emit the mousedown event to the parent or a global handler via context if needed, 
    // but the original code used global window listeners. 
    // I will attach a handler here that calls a context function to start resizing.
    // But I will skip complex resize implementation for this turn unless strictly required?
    // "Native Drag & Drop and Resize logic re-implementation".
    // I'll add the handle and `onMouseDown` prop.

    return (
        <div
            className={`glass-panel rounded-2xl p-6 relative flex flex-col widget-enter ${colSpan} ${(widget.data?.viewType === 'season_trend' || widget.type === 'calendar') ? 'h-auto min-h-[28rem]' : ((widget.data?.isComplex || widget.data?.viewType === 'season_avg' || widget.data?.viewType === 'ranking_split') ? 'h-auto min-h-[16rem]' : (height ? height : 'h-64'))} cursor-move transition-all duration-200 group`}
            draggable={true}
            onDragStart={(e) => onDragStart(e, id)}
            onDragOver={onDragOver}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDrop={(e) => onDrop(e, id)}
        >
            <div className="flex justify-between items-start mb-4 pointer-events-none">
                <h3 className="text-lg font-semibold text-brand-light flex items-center gap-2">
                    {getIcon(title)} {title}
                </h3>
                <div className="flex items-center gap-2 pointer-events-auto transition-opacity">
                    <button onClick={() => openModal(widget)} className="text-brand-muted hover:text-brand-accent1 transition-colors p-1" title="확대 보기" onMouseDown={(e) => e.stopPropagation()}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    </button>
                    {/* Hide Button */}
                    <button onClick={() => toggleWidgetVisibility(id)} className="text-brand-muted hover:text-red-400 transition-colors p-1" title="숨기기" onMouseDown={(e) => e.stopPropagation()}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
            </div>

            {/* Resize Handle */}
            <div
                className="resize-handle opacity-0 group-hover:opacity-100 transition-opacity z-50"
                draggable="false"
                onDragStart={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onMouseDown={(e) => {
                    e.stopPropagation();
                    // Prevent default to stop text selection or standard drag start
                    e.preventDefault();
                    // Dispatch resize start event
                    const event = new CustomEvent('widget-resize-start', { detail: { id, startX: e.clientX, startY: e.clientY } });
                    window.dispatchEvent(event);
                }}
            ></div>

            <div className={`flex-1 w-full relative ${(widget.data?.isComplex || widget.data?.viewType === 'season_avg' || widget.data?.viewType === 'ranking_split' || widget.data?.viewType === 'season_trend' || widget.type === 'calendar') ? '' : 'overflow-hidden'}`}>
                {renderContent()}
            </div>
        </div>
    );
};

export default WidgetCard;
