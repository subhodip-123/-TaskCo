import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function PriorityChart({ data = [] }) {
  const map = { low: 0, medium: 0, high: 0 };
  data.forEach((d) => {
    if (map[d._id] !== undefined) map[d._id] = d.count;
  });

  const total = map.low + map.medium + map.high;

  const chartData = {
    labels: ['Low', 'Medium', 'High'],
    datasets: [
      {
        data: [map.low, map.medium, map.high],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        hoverBackgroundColor: ['#059669', '#d97706', '#dc2626'],
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  };

  return (
    <div className="card p-5">
      <div className="mb-3">
        <h3 className="font-bold text-sm">Tasks by Priority</h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{total} total tasks</p>
      </div>
      <div className="h-52 flex items-center justify-center">
        <Doughnut
          data={chartData}
          options={{
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  boxWidth: 10,
                  boxHeight: 10,
                  padding: 14,
                  font: { size: 12 },
                },
              },
            },
            cutout: '68%',
          }}
        />
      </div>
    </div>
  );
}
