/**
 * Feedback Timeline Component - Organism component
 * Chronological feed of recent feedback submissions
 */

import React, { memo, useEffect, useState } from 'react';
import { Calendar, MessageSquare, ChevronDown } from 'lucide-react';
import { Card, Badge, Spinner, Button } from '../Atoms/index.jsx';
import { useFetch } from '../../hooks/custom/useFetch.js';
import { feedbackAPI } from '../../api/feedbackAPI.js';
import { formatDistanceToNow } from 'date-fns';
import { useDashboardStore } from '../../store/dashboardStore.js';

const SENTIMENT_ICONS = {
  positive: 'fa-solid fa-face-smile',
  neutral: 'fa-solid fa-face-meh',
  negative: 'fa-solid fa-face-frown',
};

export const FeedbackTimeline = ({ limit = 10, onLoadMore }) => {
  const [page, setPage] = useState(1);
  const filters = useDashboardStore((state) => state.feedbackFilters);
  const setFilters = useDashboardStore((state) => state.setFeedbackFilters);
  const { data: result, loading, error, refetch } = useFetch(
    () => feedbackAPI.getFeedbackList(page, limit, filters),
    [page, limit, filters],
    { cacheKey: `feedback-list-${page}-${limit}-${JSON.stringify(filters)}` }
  );

  const feedbackList = result?.data || [];

  useEffect(() => {
    setPage(1);
  }, [filters.entityType, filters.sentiment, filters.dateFrom, filters.dateTo, filters.driverId]);

  return (
    <Card className="overflow-hidden">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Recent Feedback</h2>
            <p className="text-sm text-slate-600 mt-1">
              Latest submissions from employees
            </p>
          </div>
          <MessageSquare className="h-6 w-6 text-slate-400" />
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <select
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.entityType || ''}
            onChange={(e) => setFilters({ entityType: e.target.value || null })}
            aria-label="Filter by entity type"
          >
            <option value="">All entities</option>
            <option value="driver">Driver</option>
            <option value="trip">Trip</option>
            <option value="app">App</option>
            <option value="marshal">Marshal</option>
          </select>
          <select
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.sentiment || ''}
            onChange={(e) => setFilters({ sentiment: e.target.value || null })}
            aria-label="Filter by sentiment"
          >
            <option value="">All sentiments</option>
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
          </select>
          <input
            type="date"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.dateFrom || ''}
            onChange={(e) => setFilters({ dateFrom: e.target.value || null })}
            aria-label="Filter from date"
          />
          <input
            type="date"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.dateTo || ''}
            onChange={(e) => setFilters({ dateTo: e.target.value || null })}
            aria-label="Filter to date"
          />
          <input
            type="text"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:col-span-2"
            placeholder="Filter by driver ID"
            value={filters.driverId || ''}
            onChange={(e) => setFilters({ driverId: e.target.value || null })}
            aria-label="Filter by driver ID"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center p-12">
          <Spinner size="md" message="Loading feedback..." />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-6 text-center">
          <p className="text-red-600 font-medium">{error.message}</p>
          <Button variant="secondary" size="sm" onClick={() => refetch(true)} className="mt-3">
            Retry
          </Button>
        </div>
      )}

      {/* Timeline */}
      {!loading && feedbackList.length > 0 && (
        <div className="divide-y divide-slate-200">
          {feedbackList.map((feedback, index) => (
            <div key={feedback.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex gap-4">
                {/* Timeline dot */}
                <div className="flex flex-col items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-lg">
                    <i className={SENTIMENT_ICONS[feedback.sentiment] || 'fa-solid fa-message'}></i>
                  </div>
                  {index < feedbackList.length - 1 && (
                    <div className="h-12 w-0.5 bg-slate-200 mt-2" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="font-medium text-slate-900">
                        {feedback.entityType.charAt(0).toUpperCase() +
                          feedback.entityType.slice(1)}{' '}
                        Feedback
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        <Calendar className="inline h-3 w-3 mr-1" />
                        {formatDistanceToNow(new Date(feedback.timestamp), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    <Badge variant={feedback.sentiment}>
                      {feedback.sentiment}
                    </Badge>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold text-slate-900">
                      {feedback.rating}
                    </span>
                    <span className="text-sm text-amber-500">
                      {Array.from({ length: feedback.rating }).map((_, i) => (
                        <i key={i} className="fa-solid fa-star"></i>
                      ))}
                    </span>
                  </div>

                  {/* Tags */}
                  {Array.isArray(feedback.tags) && feedback.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {feedback.tags.map((tag) => (
                        <Badge key={tag} size="sm" variant="default">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Comment */}
                  {feedback.comment && (
                    <p className="text-sm text-slate-600 italic">
                      "{feedback.comment.substring(0, 100)}
                      {feedback.comment.length > 100 ? '...' : ''}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && feedbackList.length === 0 && (
        <div className="p-12 text-center">
          <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">No feedback yet</p>
          <p className="text-sm text-slate-500 mt-1">
            Feedback submissions will appear here
          </p>
        </div>
      )}

      {/* Load More */}
      {result?.pagination?.hasMore && (
        <div className="p-4 border-t border-slate-200 text-center">
          <Button
            variant="secondary"
            onClick={() => {
              setPage(page + 1);
              onLoadMore?.();
            }}
          >
            <ChevronDown className="h-4 w-4 mr-2" />
            Load More
          </Button>
        </div>
      )}
    </Card>
  );
};

export default memo(FeedbackTimeline);
