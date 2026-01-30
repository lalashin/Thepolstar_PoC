import React, { useState, useEffect } from 'react';

const Header = () => {
    const [dateStr, setDateStr] = useState('Loading...');

    useEffect(() => {
        const now = new Date();
        // Korean locale format as per original
        setDateStr(now.toLocaleDateString('ko-KR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    }, []);

    return (
        <header className="h-16 md:h-20 flex items-center justify-between px-4 md:px-8 z-10 shrink-0">
            <div className="flex items-center">
                {/* Mobile Logo */}
                <div className="md:hidden w-8 h-8 mr-3 rounded-lg bg-gradient-to-br from-brand-accent1 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    K
                </div>
                <div>
                    <h2 className="text-lg md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 truncate">
                        Dashboard Overview
                    </h2>
                    <p className="text-xs md:text-sm text-brand-muted">{dateStr}</p>
                </div>
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
                <div className="hidden sm:flex px-3 md:px-4 py-1.5 md:py-2 bg-slate-800/50 rounded-full border border-slate-700/50 items-center text-xs md:text-sm text-brand-muted">
                    <span className="w-2 h-2 rounded-full bg-brand-accent1 mr-2 animate-pulse"></span>
                    <span className="hidden sm:inline">Live Connected</span>
                </div>
                <button className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-brand-muted hover:text-white transition-colors relative">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                    </svg>
                    <span className="absolute top-1 right-1 w-2 h-2 bg-brand-accent2 rounded-full"></span>
                </button>
                {/* Mobile Profile Icon */}
                <img src="https://ui-avatars.com/api/?name=Admin+User&background=0F172A&color=2DD4BF" alt="User" className="md:hidden w-8 h-8 rounded-full border border-slate-600" />
            </div>
        </header>
    );
};

export default Header;
