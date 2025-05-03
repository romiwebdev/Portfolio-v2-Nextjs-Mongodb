import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

export default function PieChart({ data }) {
  const colors = [
    '#7e22ce',
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#ef4444'
  ];

  const chartData = {
    labels: data.map(item => {
      if (item._id === '/') return 'Home';
      return item._id.charAt(1).toUpperCase() + item._id.slice(2);
    }),
    datasets: [
      {
        data: data.map(item => item.count),
        backgroundColor: colors,
        borderColor: '#fff',
        borderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right'
      }
    }
  };

  return <Pie data={chartData} options={options} />;
}