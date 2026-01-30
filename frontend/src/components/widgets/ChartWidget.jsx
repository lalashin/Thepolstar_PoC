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

export default ChartWidget;
