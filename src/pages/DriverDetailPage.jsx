/**
 * Driver Detail Page - Individual driver analytics and feedback history
 */

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Button, Card, Badge, Spinner } from '../components/Atoms/index.jsx';
import { useFetch } from '../hooks/custom/useFetch.js';
import { driverAPI } from '../api/driverAPI.js';
import { feedbackAPI } from '../api/feedbackAPI.js';
import { ArrowLeft, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

export const DriverDetailPage = () => {
  const { driverId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('trend');

  const [feedbackPage, setFeedbackPage] = useState(1);
  const feedbackLimit = 10;

  const { data: driver, loading, error, refetch } = useFetch(
    () => driverAPI.getDriver(driverId),
    [driverId],
    { cacheKey: `driver-${driverId}` }
  );

  const {
    data: feedbackResult,
    loading: feedbackLoading,
    error: feedbackError,
    refetch: refetchFeedback,
  } = useFetch(
    () => feedbackAPI.getDriverFeedback(driverId, feedbackPage, feedbackLimit),
    [driverId, feedbackPage, feedbackLimit],
    { cacheKey: `driver-feedback-${driverId}-${feedbackPage}-${feedbackLimit}` }
  );

  if (!driverId) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 font-medium">Driver not found</p>
        <Button onClick={() => navigate('/')} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" message="Loading driver details..." />
      </div>
    );
  }

  if (error || !driver) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 font-medium">{error?.message || 'Failed to load driver'}</p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
          <Button variant="secondary" onClick={() => refetch(true)}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'trend', label: 'Trend Analysis', icon: <i className="fa-solid fa-arrow-trend-up"></i> },
    { id: 'tags', label: 'Feedback Tags', icon: <i className="fa-solid fa-tag"></i> },
    { id: 'feedback', label: 'History', icon: <i className="fa-solid fa-clipboard"></i> },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <Button
          variant="ghost"
          icon={<ArrowLeft className="h-4 w-4" />}
          onClick={() => navigate('/')}
        >
          Back
        </Button>
      </div>

      {/* Driver Info Card */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <img
            src={driver.avatar}
            alt={driver.name}
            className="h-24 w-24 rounded-full"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">{driver.name}</h1>
                <p className="text-slate-600 mt-1">{driver.email}</p>
                <p className="text-slate-600">{driver.phone}</p>
              </div>
              {driver.status === 'flagged' && (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-100 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-900">Flagged</span>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="mt-6 grid gap-4 sm:grid-cols-4">
              <div>
                <p className="text-sm text-slate-600">Avg Rating</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {driver.rating.toFixed(2)} <i className="fa-solid fa-star text-amber-500"></i>
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Trips</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {driver.totalTrips}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Trend</p>
                <div className="flex items-center gap-1 mt-1">
                  {driver.metrics.trend > 0 ? (
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  )}
                  <span className={`text-2xl font-bold ${driver.metrics.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(driver.metrics.trend).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-600">Status</p>
                <Badge
                  variant={driver.status === 'active' ? 'success' : 'warning'}
                  className="mt-1"
                >
                  {driver.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-4 border-b-2 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'trend' && driver.sentimentTrend && (
        <Card className="p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">30-Day Sentiment Trend</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={driver.sentimentTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#3b82f6"
                  name="Score"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {activeTab === 'tags' && driver.tagBreakdown && (
        <Card className="p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Feedback Tags Breakdown</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={driver.tagBreakdown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tag" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {activeTab === 'feedback' && (
        <Card className="p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Feedback History</h2>

          {feedbackLoading && (
            <div className="flex justify-center items-center py-8">
              <Spinner size="md" message="Loading feedback history..." />
            </div>
          )}

          {feedbackError && (
            <div className="text-center py-6">
              <p className="text-red-600 font-medium">{feedbackError.message}</p>
              <Button variant="secondary" size="sm" onClick={() => refetchFeedback(true)} className="mt-3">
                Retry
              </Button>
            </div>
          )}

          {!feedbackLoading && !feedbackError && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold text-slate-900">Entity</th>
                      <th className="px-4 py-2 text-left font-semibold text-slate-900">Rating</th>
                      <th className="px-4 py-2 text-left font-semibold text-slate-900">Sentiment</th>
                      <th className="px-4 py-2 text-left font-semibold text-slate-900">Date</th>
                      <th className="px-4 py-2 text-left font-semibold text-slate-900">Comment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(feedbackResult?.data || []).map((feedback) => (
                      <tr key={feedback.id} className="border-b border-slate-200">
                        <td className="px-4 py-3 text-slate-700 capitalize">{feedback.entityType}</td>
                        <td className="px-4 py-3 text-slate-700">{feedback.rating} <i className="fa-solid fa-star text-amber-500"></i></td>
                        <td className="px-4 py-3">
                          <Badge variant={feedback.sentiment}>{feedback.sentiment}</Badge>
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {new Date(feedback.timestamp).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {feedback.comment || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {(feedbackResult?.data || []).length === 0 && (
                <div className="text-center py-6 text-slate-500">No feedback history found.</div>
              )}

              {feedbackResult?.pagination && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-slate-600">
                    Page {feedbackResult.pagination.page} of{' '}
                    {Math.max(1, Math.ceil(feedbackResult.pagination.total / feedbackLimit))}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={feedbackPage <= 1}
                      onClick={() => setFeedbackPage((prev) => Math.max(1, prev - 1))}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={!feedbackResult.pagination.hasMore}
                      onClick={() => setFeedbackPage((prev) => prev + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>
      )}
    </div>
  );
};

export default DriverDetailPage;
