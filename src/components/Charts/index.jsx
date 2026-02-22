import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
        <p className="text-sm font-medium text-slate-900">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const SentimentTrendChart = ({ data, loading = false, height = 300 }) => {
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data || []} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="date" stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line
          type="monotone"
          dataKey="positive"
          stroke="#22c55e"
          strokeWidth={2}
          dot={{ fill: '#22c55e', r: 5 }}
          activeDot={{ r: 7 }}
          name="Positive"
        />
        <Line
          type="monotone"
          dataKey="neutral"
          stroke="#64748b"
          strokeWidth={2}
          dot={{ fill: '#64748b', r: 5 }}
          activeDot={{ r: 7 }}
          name="Neutral"
        />
        <Line
          type="monotone"
          dataKey="negative"
          stroke="#ef4444"
          strokeWidth={2}
          dot={{ fill: '#ef4444', r: 5 }}
          activeDot={{ r: 7 }}
          name="Negative"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export const CategoryChart = ({
  data,
  loading = false,
  height = 300,
  colors = ['#0ea5e9', '#a855f7', '#ec4899', '#f59e0b', '#10b981'],
}) => {
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data || []} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" stroke="#94a3b8" angle={-45} textAnchor="end" height={100} />
        <YAxis stroke="#94a3b8" />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" name="Score" fill="#0ea5e9" radius={[8, 8, 0, 0]}>
          {(data || []).map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export const RatingDistributionChart = ({
  data,
  loading = false,
  height = 300,
  colors = ['#22c55e', '#10b981', '#06b6d4', '#0ea5e9', '#0284c7'],
}) => {
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data || []}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={(entry) => `${entry.name}: ${entry.value}`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {(data || []).map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const PerformanceRadarChart = ({ data, loading = false, height = 300 }) => {
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data || []} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <PolarGrid stroke="#e2e8f0" />
        <PolarAngleAxis dataKey="category" stroke="#64748b" />
        <PolarRadiusAxis angle={90} domain={[0, 5]} stroke="#94a3b8" />
        <Radar
          name="Performance Score"
          dataKey="value"
          stroke="#0ea5e9"
          fill="#0ea5e9"
          fillOpacity={0.3}
        />
        <Tooltip content={<CustomTooltip />} />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export const TimeSeriesChart = ({
  data,
  loading = false,
  height = 250,
  label = 'Values',
  color = '#0ea5e9',
}) => {
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data || []} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="time" stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={{ fill: color, r: 4 }}
          activeDot={{ r: 6 }}
          name={label}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
