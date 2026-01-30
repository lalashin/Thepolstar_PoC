import React, { useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext';
import WidgetCard from './WidgetCard';

const WidgetGrid = () => {
    const { widgets, reorderWidgets, updateWidgetLayout } = useDashboard();

    // Drag & Drop Handlers
    const handleDragStart = (e, id) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', id);
        e.target.classList.add('opacity-50');
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDragEnter = (e) => {
        e.currentTarget.classList.add('border-brand-accent1', 'border-dashed', 'border-2');
    };

    const handleDragLeave = (e) => {
        e.currentTarget.classList.remove('border-brand-accent1', 'border-dashed', 'border-2');
    };

    const handleDrop = (e, targetId) => {
        e.stopPropagation();
        e.currentTarget.classList.remove('border-brand-accent1', 'border-dashed', 'border-2');
        document.querySelectorAll('.glass-panel').forEach(el => el.classList.remove('opacity-50'));

        const draggedId = e.dataTransfer.getData('text/plain');
        if (draggedId && draggedId !== targetId) {
            const newWidgets = [...widgets];
            const fromIndex = newWidgets.findIndex(w => w.id === draggedId);
            const toIndex = newWidgets.findIndex(w => w.id === targetId);

            if (fromIndex > -1 && toIndex > -1) {
                const [movedItem] = newWidgets.splice(fromIndex, 1);
                // To keep visualization consistent (dropping ONTO something pushes it)
                // We'll use insert.
                newWidgets.splice(toIndex, 0, movedItem);
                reorderWidgets(newWidgets);
            }
        }
    };

    // Resize Handler Logic
    useEffect(() => {
        let isResizing = false;
        let resizeWidgetId = null;
        let resizeStartX = 0;
        let resizeStartY = 0;
        let initialColSpan = 1;
        let currentWidget = null;

        const handleResizeStart = (e) => {
            const { id, startX, startY } = e.detail;
            isResizing = true;
            resizeWidgetId = id;
            resizeStartX = startX;
            resizeStartY = startY;
            document.body.classList.add('resizing-active'); // CSS class from original

            currentWidget = widgets.find(w => w.id === id);
            if (!currentWidget) return;

            // Parse initial colspan
            // Defaults to 1 if not found
            let span = 1;
            const lgMatch = currentWidget.colSpan.match(/lg:col-span-(\d+)/);
            if (lgMatch) span = parseInt(lgMatch[1]);
            else {
                const colMatch = currentWidget.colSpan.match(/col-span-(\d+)/);
                if (colMatch) span = parseInt(colMatch[1]);
            }
            initialColSpan = span;
        };

        const handleResizeMove = (e) => {
            if (!isResizing || !resizeWidgetId || !currentWidget) return;

            const dx = e.clientX - resizeStartX;
            const dy = e.clientY - resizeStartY;

            const gridEl = document.getElementById('dashboard-grid');
            if (!gridEl) return;
            // Approx column width
            const gridWidth = gridEl.offsetWidth;
            const colWidth = gridWidth / 4;

            const addedCols = Math.round(dx / colWidth);
            const newSpan = Math.max(1, Math.min(4, initialColSpan + addedCols));

            const newClass = `lg:col-span-${newSpan} md:col-span-${Math.min(2, newSpan)}`;

            // Height Logic
            const rowHeight = 250;
            const addedRows = Math.round(dy / rowHeight);

            let newHeight = 'h-64';
            let baseIndex = 0;
            // Helper to get index
            const h = currentWidget.height || 'h-64';
            if (h === 'h-96') baseIndex = 1;
            if (h === 'h-[32rem]') baseIndex = 2;

            let newIndex = Math.max(0, Math.min(2, baseIndex + addedRows));
            if (newIndex === 1) newHeight = 'h-96';
            if (newIndex === 2) newHeight = 'h-[32rem]';

            // Update
            updateWidgetLayout(resizeWidgetId, newClass, newHeight);
        };

        const handleResizeEnd = () => {
            isResizing = false;
            resizeWidgetId = null;
            currentWidget = null;
            document.body.classList.remove('resizing-active');
        };

        window.addEventListener('widget-resize-start', handleResizeStart);
        window.addEventListener('mousemove', handleResizeMove);
        window.addEventListener('mouseup', handleResizeEnd);

        return () => {
            window.removeEventListener('widget-resize-start', handleResizeStart);
            window.removeEventListener('mousemove', handleResizeMove);
            window.removeEventListener('mouseup', handleResizeEnd);
        };
    }, [widgets, updateWidgetLayout]);

    return (
        <div id="dashboard-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-min pb-20">
            {widgets.filter(w => w.visible).map(widget => (
                <WidgetCard
                    key={widget.id}
                    widget={widget}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                />
            ))}
        </div>
    );
};

export default WidgetGrid;
