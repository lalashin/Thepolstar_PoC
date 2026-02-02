/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const DashboardContext = createContext();

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider = ({ children }) => {
    const [widgets, setWidgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalWidget, setModalWidget] = useState(null);

    useEffect(() => {
        const fetchWidgets = async () => {
            try {
                const res = await axios.get('http://localhost:8000/api/widgets');
                // Ensure visible: true property exists by default
                const initialWidgets = res.data.map(w => ({ ...w, visible: true }));
                setWidgets(initialWidgets);
            } catch (err) {
                console.error("Failed to fetch widgets", err);
                // Fallback / Initial State (if backend offline) could be handled here
            } finally {
                setLoading(false);
            }
        };

        fetchWidgets();
    }, []);

    const toggleWidgetVisibility = (id) => {
        setWidgets(prev => prev.map(w => w.id === id ? { ...w, visible: !w.visible } : w));
    };

    // Updates size (colSpan, height)
    const updateWidgetLayout = (id, newColSpan, newHeight) => {
        setWidgets(prev => prev.map(w => w.id === id ? { ...w, colSpan: newColSpan, height: newHeight } : w));
    };

    const reorderWidgets = (newOrder) => {
        setWidgets(newOrder);
    };

    const openModal = (widget) => setModalWidget(widget);
    const closeModal = () => setModalWidget(null);

    return (
        <DashboardContext.Provider value={{
            widgets,
            loading,
            toggleWidgetVisibility,
            updateWidgetLayout,
            reorderWidgets,
            modalWidget,
            openModal,
            closeModal
        }}>
            {children}
        </DashboardContext.Provider>
    );
};
