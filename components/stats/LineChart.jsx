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
  Filler
} from 'chart.js';

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

export default function LineChart({ data }) {
  const chartData = {
    labels: data.map(item => item._id),
    datasets: [
      {
        label: 'Visitors',
        data: data.map(item => item.count),
        borderColor: '#7e22ce',
        backgroundColor: 'rgba(126, 34, 206, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#7e22ce',
        pointBorderColor: '#fff',
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#7e22ce',
        pointHoverBorderColor: '#fff',
        pointHitRadius: 10,
        pointBorderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  return <Line data={chartData} options={options} />;
}