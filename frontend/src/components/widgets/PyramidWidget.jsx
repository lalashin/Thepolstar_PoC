import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const PyramidWidget = ({ isModal }) => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:8000/api/gender-distribution');
                setChartData(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    if (!chartData) return <div className="text-brand-muted text-sm p-4">Loading Distribution Data...</div>;

    const maxAbs = chartData.maxVal || 10;

    // Chart Option Configuration
    const options = {
        indexAxis: 'y', // Horizontal Bar
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                stacked: true,
                min: -maxAbs * 1.1, // 여유 공간 확보
                max: maxAbs * 1.1,
                grid: {
                    color: 'rgba(148, 163, 184, 0.1)',
                    drawBorder: false,
                },
                ticks: {
                    color: '#94A3B8',
                    callback: (value) => Math.abs(value) // 음수를 양수로 표시
                }
            },
            y: {
                stacked: true, // 중앙 정렬 효과
                grid: { display: false },
                ticks: { color: '#E2E8F0', font: { size: 11 } }
            }
        },
        plugins: {
            legend: {
                position: 'top',
                labels: { color: '#E2E8F0', font: { family: 'Outfit' } }
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleColor: '#F8FAFC',
                bodyColor: '#CBD5E1',
                padding: 10,
                borderColor: 'rgba(148, 163, 184, 0.2)',
                borderWidth: 1,
                callbacks: {
                    label: (context) => {
                        const label = context.dataset.label || '';
                        const value = Math.abs(context.raw); // 절대값 표시
                        return `${label}: ${value} 경기`;
                    }
                }
            }
        }
    };

    const data = {
        labels: chartData.labels,
        datasets: [
            {
                label: '남자부 (Men)',
                data: chartData.men,
                backgroundColor: 'rgba(56, 189, 248, 0.6)', // Sky Blue
                borderColor: '#38BDF8',
                borderWidth: 1,
                barPercentage: 0.8,
            },
            {
                label: '여자부 (Women)',
                data: chartData.women,
                backgroundColor: 'rgba(244, 63, 94, 0.6)', // Rose
                borderColor: '#F43F5E',
                borderWidth: 1,
                barPercentage: 0.8,
            }
        ]
    };

    return (
        <div className="w-full h-full p-2 flex flex-col">
            {isModal && (
                <div className="mb-4 flex gap-2">
                    {/* City Filter Placeholder - can be connected to API later */}
                    <select className="bg-slate-800 text-white text-sm p-2 rounded border border-slate-700 outline-none focus:border-brand-accent1">
                        <option value="">전체 도시 (All Cities)</option>
                        <option value="인천">인천 (Incheon)</option>
                        <option value="천안">천안 (Cheonan)</option>
                        <option value="서울">서울 (Seoul)</option>
                    </select>
                </div>
            )}
            <div className="flex-1 relative min-h-0">
                <Bar data={data} options={options} />
            </div>
            {!isModal && (
                <div className="mt-2 text-center text-xs text-brand-muted">
                    * 시청률 구간별 경기 수 분포 (좌: 남자 / 우: 여자)
                </div>
            )}
        </div>
    );
};

export default PyramidWidget;
