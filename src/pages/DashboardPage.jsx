/**
 * Admin Dashboard Page - Main analytics dashboard
 */

import React, { useEffect, useMemo } from 'react';
import { BarChart3, TrendingUp, AlertCircle, Download, Filter } from 'lucide-react';
import { Card, Button, Badge } from '../components/Atoms/index.jsx';
import {
  SentimentAnalytics,
  AlertBanner,
} from '../components/Organisms/index.jsx';
import { useFetch } from '../hooks/custom/useFetch.js';
import { dashboardAPI } from '../api/dashboardAPI.js';
import { useDashboardStore } from '../store/dashboardStore.js';

export const DashboardPage = () => {
  const dateRange = useDashboardStore((state) => state.dateRange);

  const { data: stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useFetch(
    () =>
      dashboardAPI.getStats({
        from: dateRange.startDate.toISOString(),
        to: dateRange.endDate.toISOString(),
      }),
    [dateRange.type, dateRange.startDate, dateRange.endDate],
    { cacheKey: `stats-${dateRange.type}` }
  );



  const rangeParams = useMemo(
    () => ({
      from: dateRange.startDate.toISOString(),
      to: dateRange.endDate.toISOString(),
    }),
    [dateRange.startDate, dateRange.endDate]
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      refetchStats(true);
    }, 60000);

    return () => clearInterval(intervalId);
  }, [refetchStats]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-2">
            Real-time driver sentiment analytics and feedback insights
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="md" icon={<Download className="h-4 w-4" />}>
            Export
          </Button>
          <Button variant="secondary" size="md" icon={<Filter className="h-4 w-4" />}>
            Filters
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="p-6 animate-pulse">
              <div className="h-4 w-24 bg-slate-200 rounded" />
              <div className="mt-3 h-8 w-20 bg-slate-200 rounded" />
            </Card>
          ))
        ) : statsError ? (
          <Card className="p-6 col-span-4 flex flex-col items-center">
            <p className="text-red-600 font-medium">Failed to load stats</p>
            <Button variant="secondary" size="sm" onClick={() => refetchStats(true)} className="mt-3">
              Retry
            </Button>
          </Card>
        ) : (
          <>
            {/* Total Feedback Card */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Feedback</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">
                    {stats?.totalFeedback || 0}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </Card>

            {/* Average Rating Card */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Avg Rating</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">
                    {stats?.averageRating?.toFixed(2) || '0.00'} <i className="fa-solid fa-star text-amber-500"></i>
                  </p>
                </div>
                <Badge variant="success">Positive</Badge>
              </div>
            </Card>

            {/* Sentiment Score Card */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Sentiment Score</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">
                    {((stats?.sentimentScore || 0) * 100).toFixed(0)}%
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </Card>

            {/* Drivers Below Threshold Card */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Drivers Below Threshold</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">
                    {stats?.driversBelowThreshold ?? stats?.alertCount ?? 0}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sentiment Analytics - Takes up 2 columns */}
        <div className="lg:col-span-2">
          <SentimentAnalytics dateRange={rangeParams} />
        </div>

        {/* Alerts */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Alerts</h2>
          <AlertBanner maxVisible={5} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
