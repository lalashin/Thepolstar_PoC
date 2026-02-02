import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';

const Sidebar = () => {
    const { widgets, toggleWidgetVisibility } = useDashboard();
    const [hiddenListOpen, setHiddenListOpen] = useState(false);
    const [headerDropdownOpen, setHeaderDropdownOpen] = useState(false);
    const [selectedHeader, setSelectedHeader] = useState('KOVO DATA');
    const headerOptions = ['KOVO DATA', 'KBO DATA', 'KBL DATA', 'K-LEAGUE'];

    const hiddenWidgets = widgets.filter(w => !w.visible);

    return (
        <aside className="md:relative fixed bottom-0 left-0 w-full md:w-24 lg:w-72 h-16 md:h-full bg-slate-900/95 md:bg-slate-900 border-t md:border-t-0 md:border-r border-slate-800 flex flex-row md:flex-col transition-all duration-300 z-50 shrink-0 backdrop-blur-md md:backdrop-blur-none justify-around md:justify-start items-center md:items-stretch shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:shadow-none order-last md:order-first">

            {/* Logo Area (Desktop Only) */}
            <div className="hidden md:flex h-20 items-center justify-center lg:justify-start lg:px-6 border-b border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-accent1 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-accent1/20 shrink-0">
                    K
                </div>
                <div className="hidden lg:block ml-4 relative">
                    <button
                        onClick={() => setHeaderDropdownOpen(!headerDropdownOpen)}
                        className="flex items-center gap-2 font-bold text-lg tracking-wide text-white hover:text-brand-accent1 transition-colors focus:outline-none"
                    >
                        {selectedHeader}
                        <svg className={`w-4 h-4 transition-transform duration-200 text-slate-400 ${headerDropdownOpen ? 'rotate-180 text-brand-accent1' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </button>
                    <p className="text-xs text-brand-muted uppercase tracking-wider mt-0.5">Executive Suite</p>

                    {/* Custom Dropdown */}
                    {headerDropdownOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setHeaderDropdownOpen(false)}></div>
                            <div className="absolute top-full left-0 mt-2 w-48 bg-slate-800/95 backdrop-blur-xl rounded-xl border border-slate-700 shadow-2xl overflow-hidden z-50 flex flex-col animate-in fade-in zoom-in-95 duration-100 origin-top-left">
                                {headerOptions.map(opt => (
                                    <button
                                        key={opt}
                                        onClick={() => {
                                            setSelectedHeader(opt);
                                            setHeaderDropdownOpen(false);
                                        }}
                                        className={`text-left px-4 py-3 text-sm font-medium transition-all hover:bg-slate-700/80 ${selectedHeader === opt ? 'text-brand-accent1 bg-brand-accent1/5' : 'text-slate-300'}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Navigation Area */}
            <div className="flex-1 overflow-x-auto md:overflow-y-auto w-full md:w-auto flex md:block items-center justify-evenly md:justify-start md:py-6 md:px-4 no-scrollbar">

                <div className="flex md:block items-center gap-1 md:gap-0 w-full md:w-auto justify-evenly md:justify-start md:mb-8">
                    <p className="hidden lg:block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-4 px-2">
                        Dashboard Menu
                    </p>

                    {/* Overview Button */}
                    <button className="flex flex-col md:flex-row items-center justify-center md:justify-start p-2 md:p-3 rounded-xl bg-brand-accent1/10 text-brand-accent1 md:mb-2 transition-all group active:scale-95 md:active:scale-100 w-full">
                        <svg className="w-6 h-6 mb-1 md:mb-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                        </svg>
                        <span className="text-[10px] md:text-base md:hidden lg:block md:ml-3 font-medium">Overview</span>
                    </button>

                    {/* Analysis Button */}
                    <button className="flex flex-col md:flex-row items-center justify-center md:justify-start p-2 md:p-3 rounded-xl text-brand-muted hover:bg-slate-800 hover:text-white transition-all group active:scale-95 md:active:scale-100 w-full">
                        <svg className="w-6 h-6 mb-1 md:mb-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                        <span className="text-[10px] md:text-base md:hidden lg:block md:ml-3 font-medium">Analysis</span>
                    </button>

                    {/* Mobile Hamburger / Hidden Widgets Toggle */}
                    <button
                        className="md:hidden flex flex-col items-center justify-center p-2 rounded-xl text-brand-muted hover:text-white active:scale-95"
                        onClick={() => setHiddenListOpen(!hiddenListOpen)}
                    >
                        <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                        </svg>
                        <span className="text-[10px] font-medium">Menu</span>
                    </button>
                </div>

                {/* Hidden Widgets List (Conditionally rendered/visible) */}
                <div className={`${hiddenListOpen ? 'block' : 'hidden'} md:block absolute md:static bottom-16 md:bottom-auto left-0 w-full bg-slate-900/95 md:bg-transparent p-4 md:p-0 border-t border-slate-800 md:border-none backdrop-blur-xl md:backdrop-blur-none rounded-t-2xl md:rounded-none shadow-2xl md:shadow-none z-50`}>
                    <div className="flex justify-between items-center md:hidden mb-4">
                        <span className="text-sm font-bold text-white">Restorable Widgets</span>
                        <button onClick={() => setHiddenListOpen(false)} className="text-brand-muted">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    {hiddenWidgets.length > 0 && (
                        <>
                            <p className="hidden lg:block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-4 px-2">Restorable Widgets</p>
                            <div className="space-y-2 max-h-48 md:max-h-none overflow-y-auto custom-scrollbar">
                                {hiddenWidgets.map(w => (
                                    <button
                                        key={w.id}
                                        onClick={() => toggleWidgetVisibility(w.id)}
                                        className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800 border border-slate-700 text-brand-muted hover:border-brand-accent1 hover:text-white transition-all group"
                                    >
                                        <div className="flex items-center overflow-hidden">
                                            <span className="text-brand-accent1 opacity-50 group-hover:opacity-100 mr-2">+</span>
                                            <span className="truncate text-sm font-medium text-left">{w.title}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Profile (Desktop Only) */}
            <div className="hidden md:block p-4 border-t border-slate-800">
                <div className="flex items-center">
                    <img src="https://ui-avatars.com/api/?name=Admin+User&background=0F172A&color=2DD4BF" alt="User" className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border border-slate-600" />
                    <div className="hidden lg:block ml-3">
                        <p className="text-sm font-semibold text-white">Administrator</p>
                        <p className="text-xs text-brand-muted">KOVO Digital Team</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
