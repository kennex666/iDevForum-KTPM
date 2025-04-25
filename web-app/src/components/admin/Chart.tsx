import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register required components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Chart = () => {
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        datasets: [
            {
                label: 'Earnings',
                fill: true,
                data: [0, 10000, 5000, 15000, 10000, 20000, 15000, 25000],
                backgroundColor: 'rgba(78, 115, 223, 0.05)',
                borderColor: 'rgba(78, 115, 223, 1)',
            },
        ],
    };

    const options = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            x: {
                grid: {
                    color: 'rgb(234, 236, 244)',
                    drawBorder: false,
                    drawTicks: false,
                },
                ticks: {
                    color: '#858796',
                    padding: 20,
                },
            },
            y: {
                grid: {
                    color: 'rgb(234, 236, 244)',
                    drawBorder: false,
                    drawTicks: false,
                },
                ticks: {
                    color: '#858796',
                    padding: 20,
                },
            },
        },
    };

    return (
        <div className="chart-area">
            <Line data={data} options={options} />
        </div>
    );
};

export default Chart;