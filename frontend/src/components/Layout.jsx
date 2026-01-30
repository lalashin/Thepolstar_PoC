import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
    return (
        <div id="app" className="flex flex-col md:flex-row h-screen w-full relative bg-brand-dark overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-brand-accent1/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-brand-accent2/5 rounded-full blur-3xl"></div>
            </div>

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
                <Header />
                <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar mb-16 md:mb-0">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
