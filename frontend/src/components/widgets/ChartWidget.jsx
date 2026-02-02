import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const CHART_COLORS = {
    teal: '#2DD4BF',
    tealAlpha: 'rgba(45, 212, 191, 0.1)',
    brand: '#0F172A',
    amber: '#F59E0B'
};

const ChartWidget = ({ data }) => {
    if (data.viewType === 'season_trend') {
        return <SeasonTrendChart data={data} />;
    }

    const chartData = {
        labels: data.labels,
        datasets: [
            {
                label: 'Current Season',
                data: data.values,
                borderColor: CHART_COLORS.teal,
                backgroundColor: CHART_COLORS.tealAlpha,
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: CHART_COLORS.brand,
                pointBorderColor: CHART_COLORS.teal,
                pointBorderWidth: 2
            },
            {
                label: 'Previous Season',
                data: data.prevValues,
                borderColor: CHART_COLORS.amber,
                borderDash: [5, 5],
                borderWidth: 2,
                tension: 0.4,
                pointRadius: 0
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                labels: { color: '#94A3B8', font: { family: 'Outfit' } }
            }
        },
        scales: {
            y: {
                grid: { color: 'rgba(51, 65, 85, 0.3)' },
                ticks: { color: '#94A3B8' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#94A3B8' }
            }
        },
        animation: {
            duration: 2000,
            easing: 'easeOutQuart'
        }
    };

    return (
        <div className="w-full h-full p-2">
            <Line data={chartData} options={options} />
        </div>
    );
};

const SeasonTrendChart = ({ data }) => {
    const chartData = {
        labels: data.labels,
        datasets: data.datasets.map(ds => ({
            label: ds.label,
            data: ds.data,
            borderColor: ds.color,
            backgroundColor: ds.color,
            borderWidth: 2,
            tension: 0.4,
            pointBackgroundColor: '#0F172A',
            pointBorderColor: ds.color,
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
        }))
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
                align: 'end',
                labels: {
                    color: '#94A3B8',
                    usePointStyle: true,
                    boxWidth: 8,
                    font: { size: 10 }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                titleColor: '#fff',
                bodyColor: '#e2e8f0',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                padding: 12,
                titleFont: { size: 14, weight: 'bold' },
                bodyFont: { size: 12 },
                callbacks: {
                    label: (context) => {
                        return `${context.dataset.label} : ${context.parsed.y}`;
                    }
                }
            }
        },
        scales: {
            y: {
                grid: { color: 'rgba(51, 65, 85, 0.3)' },
                ticks: { color: '#94A3B8' }
            },
            x: {
                grid: { color: 'rgba(51, 65, 85, 0.1)' },
                ticks: { color: '#94A3B8' }
            }
        }
    };

    return (
        <div className="w-full h-full flex flex-col">
            {/* Header Filter */}
            <div className="flex justify-center mb-2">
                <div className="flex items-center gap-4 bg-slate-800/80 rounded-full px-5 py-1.5 border border-slate-600/50 shadow-lg backdrop-blur">
                    <span className="text-brand-muted font-semibold text-xs">시즌</span>
                    <div className="h-3 w-px bg-slate-600"></div>
                    <span className="font-semibold text-blue-100/90 tracking-wide text-sm">{data.season}</span>
                    <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>
            <div className="flex-1 min-h-0">
                <Line data={chartData} options={options} />
            </div>
        </div>
    );
};

export default ChartWidget;
