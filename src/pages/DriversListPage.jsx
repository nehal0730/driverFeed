/**
 * Drivers List Page - View all drivers with detailed metrics
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, TrendingDown, Mail, Phone, Calendar } from 'lucide-react';
import { Card, Button, Badge, Input } from '../components/Atoms/index.jsx';
import { useFetch } from '../hooks/custom/useFetch.js';
import { driverAPI } from '../api/driverAPI.js';

export const DriversListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [page, setPage] = useState(1);

  const { data: response, loading, error, refetch } = useFetch(
    () =>
      driverAPI.getDrivers(page, 10, {
        search: searchTerm,
        sortBy,
      }),
    [page, searchTerm, sortBy],
    { cacheKey: `drivers-${page}-${searchTerm}-${sortBy}` }
  );

  const drivers = response?.data || [];
  const pagination = response?.pagination || {};

  const getStatusBadge = (rating) => {
    if (rating >= 4.0) {
      return <Badge variant="success">Excellent</Badge>;
    } else if (rating >= 2.5) {
      return <Badge variant="warning">At Risk</Badge>;
    } else {
      return <Badge variant="danger">Critical</Badge>;
    }
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) {
      return <TrendingUp className="h-5 w-5 text-green-600" />;
    } else if (trend < 0) {
      return <TrendingDown className="h-5 w-5 text-red-600" />;
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Drivers</h1>
          <p className="text-slate-600 mt-2">
            Manage and monitor all drivers in the system
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <Input
            placeholder="Search drivers by name or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            icon={<Search className="h-5 w-5" />}
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="rating">Sort by Rating</option>
          <option value="trips">Sort by Trips</option>
          <option value="trend">Sort by Trend</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>

      {/* Drivers Grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 w-32 bg-slate-200 rounded mb-4" />
              <div className="h-6 w-24 bg-slate-200 rounded mb-4" />
              <div className="h-4 w-40 bg-slate-200 rounded" />
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => refetch(true)}>Retry</Button>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {drivers.map((driver) => (
              <Card
                key={driver.id}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/driver/${driver.id}`)}
              >
                {/* Driver Avatar and Status */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={driver.avatar}
                      alt={driver.name}
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold text-slate-900">{driver.name}</h3>
                      <p className="text-xs text-slate-500">ID: {driver.id}</p>
                    </div>
                  </div>
                  {getStatusBadge(driver.rating)}
                </div>

                {/* Rating */}
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-slate-900">
                      {driver.rating.toFixed(1)}
                    </span>
                    <span className="text-sm text-slate-600">/5.0</span>
                    {getTrendIcon(driver.metrics?.trend)}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{driver.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="h-4 w-4" />
                    <span>{driver.phone}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-200">
                  <div>
                    <p className="text-xs text-slate-500">Total Trips</p>
                    <p className="text-lg font-semibold text-slate-900">{driver.totalTrips}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Feedback</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {driver.metrics?.totalFeedback || 0}
                    </p>
                  </div>
                </div>

                {/* Join Date */}
                <div className="flex items-center gap-2 mt-4 text-xs text-slate-500">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {new Date(driver.joinDate).toLocaleDateString()}</span>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {pagination.total > 0 && (
            <div className="flex items-center justify-between pt-6">
              <p className="text-sm text-slate-600">
                Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, pagination.total)} of{' '}
                {pagination.total} drivers
              </p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="px-4 py-2 text-slate-600">Page {page}</span>
                <Button
                  variant="secondary"
                  onClick={() => setPage(page + 1)}
                  disabled={!pagination.hasMore}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DriversListPage;
