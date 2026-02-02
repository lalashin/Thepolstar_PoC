import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import MetricWidget from './widgets/MetricWidget';
import ListWidget from './widgets/ListWidget';
import RankingWidget from './widgets/RankingWidget';
import CalendarWidget from './widgets/CalendarWidget';
import ChartWidget from './widgets/ChartWidget';
import MapWidget from './widgets/MapWidget';


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
                    <div className="flex flex-col">
                        <h3 className="text-2xl font-bold text-white">{modalWidget.title}</h3>
                        <p className="text-brand-muted text-sm">Deep dive analysis</p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* CSV Download Button */}
                        {modalWidget.type !== 'map' && (
                            <button
                                onClick={() => {
                                    const data = modalWidget.data;
                                    let csvContent = "";
                                    const fileName = `${modalWidget.title.replace(/\s+/g, '_')}_data.csv`;

                                    // Simple CSV conversion logic based on widget data structure
                                    if (modalWidget.type === 'ranking') {
                                        csvContent = "Rank,Date,Match,Rate\n" +
                                            (data.topRecord ? `TOP1,${data.topRecord.date},${data.topRecord.match},${data.topRecord.rate}\n` : "") +
                                            (data.list || []).map(item => `${item.rank},${item.date},${item.match},${item.rate}`).join("\n");
                                    } else if (modalWidget.type === 'metric' && data.section1) {
                                        // Specific for Yesterday's Viewer (w1)
                                        csvContent = "Section,Category,Channel,Match,Rate,Viewers\n" +
                                            data.section1.rows.map(r => `Section1,${r.category},${r.channel},${r.match},${r.total},${r.viewers}`).join("\n") + "\n" +
                                            (data.section2 ? data.section2.rows.map(r => `Section2,${r.category},${r.channel},${r.match},${r.total},""`).join("\n") : "");
                                    } else if (modalWidget.type === 'metric' && data.topRankings) {
                                        // Specific for Season Avg (w2)
                                        csvContent = "Rank,Season,Rate\n" +
                                            data.topRankings.map(r => `${r.rank},${r.season},${r.rate}`).join("\n");
                                    } else if (modalWidget.type === 'chart') {
                                        csvContent = "Label," + data.datasets.map(ds => ds.label).join(",") + "\n" +
                                            data.labels.map((label, i) => label + "," + data.datasets.map(ds => ds.data[i]).join(",")).join("\n");
                                    } else if (modalWidget.type === 'calendar') {
                                        csvContent = "Day,Rate\n" +
                                            data.days.filter(d => d.d).map(d => `${d.d},${d.r}`).join("\n");
                                    } else {
                                        csvContent = JSON.stringify(data);
                                    }

                                    // Download trigger
                                    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
                                    const link = document.createElement("a");
                                    const url = URL.createObjectURL(blob);
                                    link.setAttribute("href", url);
                                    link.setAttribute("download", fileName);
                                    link.style.visibility = 'hidden';
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                }}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10 transition-all text-sm font-medium group"
                            >
                                <svg className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M7 10l5 5m0 0l5-5m-5 5V3"></path>
                                </svg>
                                CSV 다운로드
                            </button>
                        )}

                        <button onClick={closeModal} className="p-2 rounded-lg hover:bg-slate-800 text-brand-muted hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="flex-1 p-8 overflow-y-auto custom-scrollbar w-full h-full flex flex-col">
                    <div className="w-full flex-1 relative min-h-[300px]">
                        {renderContent()}
                    </div>

                    {/* Fake Deep Dive Data - Hide for Calendar to give more space */}
                    {modalWidget.type !== 'calendar' && (
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
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;
