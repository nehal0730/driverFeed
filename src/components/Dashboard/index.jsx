import React from 'react';
import {
  TrendingUp,
  MessageCircle,
  Users,
  Star,
  Filter,
  Download,
  ChevronRight,
} from 'lucide-react';
import { StatCard, FeatureCard } from '../Cards/StatCard.jsx';
import {
  SentimentTrendChart,
  CategoryChart,
  PerformanceRadarChart,
} from '../Charts/index.jsx';
import {
  useDashboardStats,
  useSentimentTrend,
  useDriverPerformance,
  useCategoryMetrics,
} from '../../hooks/index.js';
import { formatPercentage, formatNumber } from '../../utils/formatting.js';

export const Dashboard = () => {
  const { data: stats, loading: statsLoading } = useDashboardStats();
  const { data: sentimentData, loading: sentimentLoading } = useSentimentTrend();
  const { data: performanceData } = useDriverPerformance();
  const { data: categoryMetrics } = useCategoryMetrics();

  // Prepare data for charts
  const radarData = (categoryMetrics || []).map((metric) => ({
    category: metric.category,
    value: metric.score,
    fullMark: 5,
  }));

  const categoryChartData = (categoryMetrics || []).map((metric) => ({
    name: metric.category,
    value: metric.score,
  }));

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">
            Welcome back! Here's what's happening with your feedback today.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary gap-2 px-4 py-2">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filter</span>
          </button>
          <button className="btn btn-primary gap-2 px-4 py-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Feedback"
          value={stats?.totalFeedback ? formatNumber(stats.totalFeedback) : '-'}
          subtitle="This month"
          trend={stats?.monthlyGrowth}
          trendLabel="vs last month"
          icon={<MessageCircle className="h-6 w-6" />}
          color="primary"
          loading={statsLoading}
        />
        <StatCard
          title="Average Rating"
          value={stats?.averageRating?.toFixed(1) || '-'}
          subtitle="Out of 5.0"
          trend={2.3}
          trendLabel="improvement"
          icon={<Star className="h-6 w-6" />}
          color="success"
          loading={statsLoading}
        />
        <StatCard
          title="Active Drivers"
          value={stats?.activeDrivers || '-'}
          subtitle="Currently online"
          trend={5.2}
          trendLabel="growth"
          icon={<Users className="h-6 w-6" />}
          color="warning"
          loading={statsLoading}
        />
        <StatCard
          title="Sentiment Score"
          value={stats?.sentimentScore ? formatPercentage(stats.sentimentScore) : '-'}
          subtitle="Positive ratio"
          trend={3.1}
          trendLabel="increase"
          icon={<TrendingUp className="h-6 w-6" />}
          color="danger"
          loading={statsLoading}
        />
      </div>

      {/* Main Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sentiment Trend - Large */}
        <div className="card lg:col-span-2">
          <div className="border-b border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Sentiment Trend</h2>
                <p className="mt-1 text-sm text-slate-600">Last 7 days performance</p>
              </div>
              <button className="text-slate-600 hover:text-primary-600">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <SentimentTrendChart
              data={sentimentData || []}
              loading={sentimentLoading}
              height={320}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card flex flex-col gap-4 p-6">
          <h2 className="text-lg font-bold text-slate-900">Quick Actions</h2>
          <FeatureCard
            title="View Reports"
            description="Generate detailed sentiment analysis"
            icon={<i className="fa-solid fa-chart-column"></i>}
            badge="New"
          />
          <FeatureCard
            title="Driver Analytics"
            description="Check individual performance"
            icon={<i className="fa-solid fa-user"></i>}
          />
          <FeatureCard
            title="Export Data"
            description="Download feedback records"
            icon={<i className="fa-solid fa-download"></i>}
          />
        </div>
      </div>

      {/* Category Performance and Radar */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900">Category Scores</h2>
            <p className="mt-1 text-sm text-slate-600">Performance by feedback category</p>
          </div>
          <div className="p-6">
            <CategoryChart data={categoryChartData} height={280} />
          </div>
        </div>

        <div className="card">
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900">Performance Overview</h2>
            <p className="mt-1 text-sm text-slate-600">Multi-dimensional analysis</p>
          </div>
          <div className="p-6">
            <PerformanceRadarChart data={radarData} height={280} />
          </div>
        </div>
      </div>

      {/* Top Drivers */}
      <div className="card">
        <div className="border-b border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Top Performing Drivers</h2>
              <p className="mt-1 text-sm text-slate-600">Highest feedback ratings</p>
            </div>
            <button className="text-primary-600 hover:text-primary-700">View all</button>
          </div>
        </div>
        <div className="divide-y divide-slate-200">
          {(performanceData || []).slice(0, 3).map((driver, index) => (
            <div key={driver.driverId} className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 font-bold text-primary-600">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-slate-900">{driver.driverName}</p>
                  <p className="text-sm text-slate-600">
                    {driver.totalFeedback} feedback • {driver.averageRating.toFixed(1)} stars
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="font-bold text-slate-900">{driver.averageRating.toFixed(1)}</p>
                  <p className="text-xs text-slate-500">Rating</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
