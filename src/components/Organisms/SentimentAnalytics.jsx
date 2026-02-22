/**
 * Sentiment Analytics Component - Organism component
 * Displays sentiment distribution charts
 */

import React, { memo } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, Spinner } from '../Atoms/index.jsx';
import { useFetch } from '../../hooks/custom/useFetch.js';
import { dashboardAPI } from '../../api/dashboardAPI.js';

const COLORS = ['#10b981', '#8b5cf6', '#ef4444'];

export const SentimentAnalytics = ({ dateRange }) => {
  const { data: distribution, loading, error, refetch } = useFetch(
    () => dashboardAPI.getSentimentDistribution(dateRange),
    [dateRange.from, dateRange.to],
    { cacheKey: `sentiment-${JSON.stringify(dateRange)}` }
  );

  if (loading) {
    return (
      <Card className="h-96 flex items-center justify-center">
        <Spinner size="lg" message="Loading sentiment data..." />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <p className="text-red-600">Error loading sentiment data</p>
        <button
          type="button"
          onClick={() => refetch(true)}
          className="mt-3 text-sm text-blue-600 hover:text-blue-700"
        >
          Retry
        </button>
      </Card>
    );
  }

  const total = distribution?.total || 0;
  const percent = (value) => (total ? ((value / total) * 100).toFixed(1) : '0.0');

  const data = distribution
    ? [
        { name: 'Positive', value: distribution.positive, percentage: percent(distribution.positive) },
        { name: 'Neutral', value: distribution.neutral, percentage: percent(distribution.neutral) },
        { name: 'Negative', value: distribution.negative, percentage: percent(distribution.negative) },
      ]
    : [];

  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold text-slate-900 mb-4">Sentiment Distribution</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${name}: ${percentage}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {COLORS.map((color, index) => (
                <Cell key={`cell-${index}`} fill={color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-4">
        {data.map((item, index) => (
          <div key={item.name} className="text-center">
            <div
              className="h-3 w-full rounded-full mb-2"
              style={{ backgroundColor: COLORS[index] }}
            ></div>
            <p className="text-sm font-medium text-slate-900">{item.name}</p>
            <p className="text-lg font-bold text-slate-700">{item.value}</p>
            <p className="text-xs text-slate-500">{item.percentage}%</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default memo(SentimentAnalytics);
