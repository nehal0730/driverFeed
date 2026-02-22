/**
 * Reports Page - Analytics and reporting dashboard
 */

import React, { useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Filter, Calendar } from 'lucide-react';
import { Card, Button, Badge } from '../components/Atoms/index.jsx';
import { useFetch } from '../hooks/custom/useFetch.js';
import { dashboardAPI } from '../api/dashboardAPI.js';

export const ReportsPage = () => {
  const [dateRange, setDateRange] = React.useState('30days');

  const { data: stats, loading: statsLoading } = useFetch(
    () => dashboardAPI.getStats(dateRange),
    [dateRange],
    { cacheKey: `stats-${dateRange}` }
  );

  // Prepare chart data
  const sentimentData = useMemo(() => {
    if (!stats?.sentiment) return [];
    return [
      { name: 'Positive', value: stats.sentiment.positive || 0, fill: '#10b981' },
      { name: 'Neutral', value: stats.sentiment.neutral || 0, fill: '#8b5cf6' },
      { name: 'Negative', value: stats.sentiment.negative || 0, fill: '#ef4444' },
    ];
  }, [stats?.sentiment]);

  const getTrendData = () => {
    // Mock trend data for the selected period
    const days = dateRange === 'today' ? 1 : dateRange === '7days' ? 7 : 30;
    const data = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        rating: (Math.random() * 2 + 3).toFixed(1),
        feedback: Math.floor(Math.random() * 50 + 10),
      });
    }
    return data;
  };

  const trendData = getTrendData();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Reports & Analytics</h1>
          <p className="text-slate-600 mt-2">
            Comprehensive analytics and performance reports
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="md" icon={<Download className="h-4 w-4" />}>
            Export PDF
          </Button>
          <Button variant="secondary" size="md" icon={<Filter className="h-4 w-4" />}>
            Filters
          </Button>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="flex gap-2">
        {[
          { label: 'Today', value: 'today' },
          { label: 'Last 7 Days', value: '7days' },
          { label: 'Last 30 Days', value: '30days' },
        ].map((option) => (
          <Button
            key={option.value}
            variant={dateRange === option.value ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setDateRange(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>

      {/* Key Metrics */}
      {statsLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 w-24 bg-slate-200 rounded mb-2" />
              <div className="h-8 w-20 bg-slate-200 rounded" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <p className="text-sm text-slate-600 font-medium">Total Feedback</p>
            <div className="mt-2">
              <p className="text-3xl font-bold text-slate-900">{stats?.totalFeedback || 0}</p>
              <p className="text-xs text-green-600 mt-1">+12% from last period</p>
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-sm text-slate-600 font-medium">Average Rating</p>
            <div className="mt-2">
              <p className="text-3xl font-bold text-slate-900">{(stats?.averageRating || 0).toFixed(2)}</p>
              <p className="text-xs text-slate-500 mt-1">out of 5.0</p>
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-sm text-slate-600 font-medium">Sentiment Score</p>
            <div className="mt-2">
              <p className="text-3xl font-bold text-slate-900">{(stats?.sentimentScore || 0).toFixed(1)}%</p>
              <p className="text-xs text-green-600 mt-1">+5% improvement</p>
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-sm text-slate-600 font-medium">Drivers Below Threshold</p>
            <div className="mt-2">
              <p className="text-3xl font-bold text-red-600">{stats?.driversBelow || 0}</p>
              <p className="text-xs text-slate-500 mt-1">rating &lt; 3.0</p>
            </div>
          </Card>
        </div>
      )}

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sentiment Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Sentiment Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sentimentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Trend Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Rating Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="rating"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Report Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Report Summary</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <p className="font-medium text-slate-900">Overall Performance</p>
              <p className="text-sm text-slate-600">Last {dateRange === 'today' ? '24 hours' : dateRange === '7days' ? '7 days' : '30 days'}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">Excellent</p>
              <Badge variant="success">+5%</Badge>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <p className="font-medium text-slate-900">Driver Satisfaction</p>
              <p className="text-sm text-slate-600">Based on feedback submissions</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-900">{(stats?.averageRating || 0).toFixed(1)}/5.0</p>
              <Badge variant="success">Positive Trend</Badge>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <p className="font-medium text-slate-900">Top Issues</p>
              <p className="text-sm text-slate-600">Most frequent feedback topics</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-slate-900">Communication</p>
              <p className="text-sm text-slate-600">42 mentions</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReportsPage;
