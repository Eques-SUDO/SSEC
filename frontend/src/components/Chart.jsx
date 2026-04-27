import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale,
  PointElement, LineElement, BarElement, ArcElement,
  Title, Tooltip, Legend, Filler
);

const PALETTE = {
  primary: '#1d4ed8',
  primarySoft: 'rgba(29, 78, 216, 0.12)',
  success: '#059669',
  warning: '#b45309',
  danger:  '#b91c1c',
  info:    '#0369a1',
  muted:   '#94a3b8',
};

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { font: { family: 'Inter', size: 12 }, color: '#64748b' } },
    tooltip: {
      backgroundColor: '#0f172a',
      padding: 10,
      titleFont: { family: 'Inter', weight: '600' },
      bodyFont:  { family: 'Inter' },
      borderColor: 'rgba(255,255,255,.06)',
      borderWidth: 1,
    },
  },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } } },
    y: { grid: { color: '#e2e8f0' },  ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } } },
  },
};

export function ChartCard({ title, sub, children, action }) {
  return (
    <div className="chart-card">
      <div className="chart-card-head">
        <div>
          <div className="chart-card-title">{title}</div>
          {sub && <div className="chart-card-sub">{sub}</div>}
        </div>
        {action}
      </div>
      <div className="chart-card-body">{children}</div>
    </div>
  );
}

export function RevenueLineChart({ labels, values }) {
  const data = {
    labels,
    datasets: [{
      label: 'CA (k MAD)',
      data: values,
      borderColor: PALETTE.primary,
      backgroundColor: PALETTE.primarySoft,
      pointBackgroundColor: PALETTE.primary,
      pointRadius: 3,
      tension: 0.35,
      fill: true,
    }],
  };
  return <Line data={data} options={baseOptions} />;
}

export function OrdersBarChart({ labels, values }) {
  const data = {
    labels,
    datasets: [{
      label: 'Commandes',
      data: values,
      backgroundColor: PALETTE.primary,
      borderRadius: 6,
      maxBarThickness: 28,
    }],
  };
  return <Bar data={data} options={baseOptions} />;
}

export function StatusDoughnut({ labels, values }) {
  const data = {
    labels,
    datasets: [{
      data: values,
      backgroundColor: [PALETTE.success, PALETTE.warning, PALETTE.info, PALETTE.danger, PALETTE.muted],
      borderWidth: 0,
    }],
  };
  const opts = { ...baseOptions, scales: undefined, cutout: '65%' };
  return <Doughnut data={data} options={opts} />;
}
