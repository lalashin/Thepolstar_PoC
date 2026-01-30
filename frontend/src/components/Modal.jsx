import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import MetricWidget from './widgets/MetricWidget';
import ListWidget from './widgets/ListWidget';
import RankingWidget from './widgets/RankingWidget';
import CalendarWidget from './widgets/CalendarWidget';
import ChartWidget from './widgets/ChartWidget';
import MapWidget from './widgets/MapWidget';
import PyramidWidget from './widgets/PyramidWidget';

const Modal = () => {
    const { modalWidget, closeModal } = useDashboard();

    if (!modalWidget) return null;

    const renderContent = () => {
        const props = { data: modalWidget.data, isModal: true };
        switch (modalWidget.type) {
            case 'metric': return <MetricWidget {...props} />;
            case 'list': return <ListWidget {...props} />;
            case 'ranking': return <RankingWidget {...props} />;
            case 'calendar': return <CalendarWidget {...props} />;
            case 'chart': return <ChartWidget {...props} />;
            case 'map': return <MapWidget {...props} />;
            case 'pyramid': return <PyramidWidget {...props} />;
            default: return <div>Unknown</div>;
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in" onClick={closeModal}>
            <div
                className="bg-slate-900 border border-slate-700 rounded-2xl w-11/12 h-[90%] max-w-6xl shadow-2xl transform transition-all duration-300 flex flex-col overflow-hidden relative animate-slide-up"
                onClick={e => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50">
                    <div>
                        <h3 className="text-2xl font-bold text-white">{modalWidget.title} (Detailed Analysis)</h3>
                        <p className="text-brand-muted text-sm">Deep dive analysis</p>
                    </div>
                    <button onClick={closeModal} className="p-2 rounded-lg hover:bg-slate-800 text-brand-muted hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 p-8 overflow-y-auto custom-scrollbar w-full h-full flex flex-col">
                    <div className="w-full flex-1 relative min-h-[300px]">
                        {renderContent()}
                    </div>

                    {/* Fake Deep Dive Data */}
                    <div className="mt-8 pt-8 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4 flex-shrink-0">
                        <div className="bg-slate-800/50 p-4 rounded-xl">
                            <p className="text-xs text-brand-muted uppercase">Data Accuracy</p>
                            <p className="text-xl font-bold text-white">99.9%</p>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-xl">
                            <p className="text-xs text-brand-muted uppercase">Source</p>
                            <p className="text-xl font-bold text-white">Nielsen Korea</p>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-xl">
                            <p className="text-xs text-brand-muted uppercase">Last Update</p>
                            <p className="text-xl font-bold text-white">10 mins ago</p>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-xl">
                            <p className="text-xs text-brand-muted uppercase">Segment</p>
                            <p className="text-xl font-bold text-white">All Ages</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
