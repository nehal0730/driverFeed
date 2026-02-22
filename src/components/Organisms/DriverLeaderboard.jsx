/**
 * Driver Leaderboard Component - Organism component
 * Table showing driver metrics and performance
 */

import React, { memo, useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, Badge, Input, Spinner, Button } from '../Atoms/index.jsx';
import { useFetch } from '../../hooks/custom/useFetch.js';
import { driverAPI } from '../../api/driverAPI.js';
import { useDashboardStore } from '../../store/dashboardStore.js';
import { feedbackAPI } from '../../api/feedbackAPI.js';
import { Link } from 'react-router-dom';

export const DriverLeaderboard = ({ onDriverSelect }) => {
  const navigate = useNavigate();
  const filters = useDashboardStore((state) => state.driverFilters);
  const setFilters = useDashboardStore((state) => state.setDriverFilters);
  const { data: result, loading, error, refetch } = useFetch(
    () => driverAPI.getDrivers(1, 20, filters),
    [filters],
    { cacheKey: `drivers-${JSON.stringify(filters)}` }
  );

  const [expandedDriver, setExpandedDriver] = useState(null);
  const [recentFeedback, setRecentFeedback] = useState({});
  const [recentLoading, setRecentLoading] = useState(false);
  const [recentError, setRecentError] = useState(null);

  const drivers = result?.data || [];

  const headers = [
    { key: 'name', label: 'Driver', sortable: true },
    { key: 'totalTrips', label: 'Total Trips', sortable: true },
    { key: 'rating', label: 'Avg Rating', sortable: true },
    { key: 'trend', label: 'Trend', sortable: false },
    { key: 'status', label: 'Status', sortable: false },
    { key: 'actions', label: '', sortable: false },
  ];

  const getStatusColor = (status, rating) => {
    if (status === 'flagged') return 'danger';
    if (rating >= 4.0) return 'success';
    if (rating >= 2.5) return 'warning';
    return 'danger';
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return null;
  };

  const getRowClass = (rating) => {
    if (rating >= 4.0) return 'bg-green-50';
    if (rating >= 2.5) return 'bg-amber-50';
    return 'bg-red-50';
  };

  useEffect(() => {
    const loadRecentFeedback = async () => {
      if (!expandedDriver || recentFeedback[expandedDriver]) return;
      setRecentLoading(true);
      setRecentError(null);
      try {
        const response = await feedbackAPI.getDriverFeedback(expandedDriver, 1, 5);
        setRecentFeedback((prev) => ({ ...prev, [expandedDriver]: response.data || [] }));
      } catch (fetchError) {
        setRecentError(fetchError.message || 'Failed to load recent feedback');
      } finally {
        setRecentLoading(false);
      }
    };

    loadRecentFeedback();
  }, [expandedDriver, recentFeedback]);

  return (
    <Card className="overflow-hidden">
      <div className="p-6 border-b border-slate-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Driver Leaderboard</h2>
            <p className="text-sm text-slate-600 mt-1">
              {drivers.length} drivers • Sorted by {filters.sortBy || 'rating'}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            placeholder="Search drivers..."
            icon={<Search className="h-5 w-5" />}
            value={filters.search || ''}
            onChange={(e) =>
              setFilters({ search: e.target.value || undefined })
            }
          />
          <select
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.sortBy || 'rating'}
            onChange={(e) => setFilters({ sortBy: e.target.value })}
          >
            <option value="rating">Sort by Rating</option>
            <option value="trips">Sort by Trips</option>
            <option value="trend">Sort by Trend</option>
            <option value="name">Sort by Name</option>
          </select>
          <select
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.status || ''}
            onChange={(e) => setFilters({ status: e.target.value || null })}
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="flagged">Flagged</option>
          </select>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              className="w-1/2 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.scoreRange?.[0] ?? 0}
              onChange={(e) =>
                setFilters({ scoreRange: [Number(e.target.value), filters.scoreRange?.[1] ?? 5] })
              }
              aria-label="Minimum score"
            />
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              className="w-1/2 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.scoreRange?.[1] ?? 5}
              onChange={(e) =>
                setFilters({ scoreRange: [filters.scoreRange?.[0] ?? 0, Number(e.target.value)] })
              }
              aria-label="Maximum score"
            />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center p-12">
          <Spinner size="md" message="Loading drivers..." />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-6 text-center">
          <p className="text-red-600 font-medium">{error.message}</p>
          <p className="text-sm text-slate-600 mt-1">Failed to load driver data</p>
          <Button variant="secondary" size="sm" onClick={() => refetch(true)} className="mt-3">
            Retry
          </Button>
        </div>
      )}

      {/* Table */}
      {!loading && !error && drivers.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {headers.map((header) => (
                  <th
                    key={header.key}
                    className="text-left px-6 py-3 font-semibold text-slate-900"
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver) => (
                <React.Fragment key={driver.id}>
                  <tr
                    className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${getRowClass(driver.rating)}`}
                    onClick={() => {
                      if (onDriverSelect) {
                        onDriverSelect(driver);
                        return;
                      }
                      navigate(`/driver/${driver.id}`);
                    }}
                  >
                    <td className="px-6 py-4 font-medium text-slate-900 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <img
                          src={driver.avatar}
                          alt={driver.name}
                          className="h-8 w-8 rounded-full"
                        />
                        <Link
                          to={`/driver/${driver.id}`}
                          className="hover:text-blue-600"
                          onClick={() => onDriverSelect?.(driver)}
                        >
                          {driver.name}
                        </Link>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{driver.totalTrips}</td>
                    <td className="px-6 py-4">
                      <Badge
                        variant="default"
                        className="font-semibold"
                      >
                        {driver.rating.toFixed(2)} <i className="fa-solid fa-star"></i>
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {getTrendIcon(driver.metrics.trend)}
                        <span className={driver.metrics.trend > 0 ? 'text-green-600' : 'text-red-600'}>
                          {Math.abs(driver.metrics.trend).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getStatusColor(driver.status, driver.rating)}>
                        {driver.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                        onClick={() =>
                          setExpandedDriver((prev) => (prev === driver.id ? null : driver.id))
                        }
                        aria-label="Toggle recent feedback"
                      >
                        {expandedDriver === driver.id ? 'Hide' : 'Show'}
                        {expandedDriver === driver.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                  {expandedDriver === driver.id && (
                    <tr className="bg-slate-50">
                      <td colSpan={6} className="px-6 py-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium">{driver.name} - Recent Feedback</p>
                          <p className="text-xs text-slate-600">
                            Positive: {driver.metrics.sentiment.positive} •
                            Neutral: {driver.metrics.sentiment.neutral} •
                            Negative: {driver.metrics.sentiment.negative}
                          </p>
                          {recentLoading && (
                            <div className="text-sm text-slate-500">Loading recent feedback...</div>
                          )}
                          {recentError && (
                            <div className="text-sm text-red-600">{recentError}</div>
                          )}
                          {recentFeedback[driver.id] && recentFeedback[driver.id].length > 0 && (
                            <div className="space-y-2">
                              {recentFeedback[driver.id].map((feedback) => (
                                  <div key={feedback.id} className="rounded-lg border border-slate-200 bg-white p-3">
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm font-medium text-slate-900">
                                      {feedback.entityType} • {feedback.rating} <i className="fa-solid fa-star"></i>
                                    </div>
                                    <Badge variant={feedback.sentiment}>{feedback.sentiment}</Badge>
                                  </div>
                                  {feedback.comment && (
                                    <p className="text-xs text-slate-600 mt-1">
                                      {feedback.comment}
                                    </p>
                                  )}
                                </div>
                              ))}
                              <Link
                                to={`/driver/${driver.id}`}
                                className="text-sm text-blue-600 hover:text-blue-700"
                              >
                                View full driver details
                              </Link>
                            </div>
                          )}
                          {recentFeedback[driver.id] && recentFeedback[driver.id].length === 0 && !recentLoading && (
                            <div className="text-sm text-slate-500">No recent feedback</div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && drivers.length === 0 && (
        <div className="p-12 text-center">
          <p className="text-slate-600 font-medium">No drivers found</p>
          <p className="text-sm text-slate-500 mt-1">Try adjusting your filters</p>
        </div>
      )}
    </Card>
  );
};

export default memo(DriverLeaderboard);
