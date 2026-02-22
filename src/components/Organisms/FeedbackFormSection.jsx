/**
 * Feedback Form Section Component - Organism component
 * Represents a single feedback section (Driver, Trip, App, Marshal)
 */

import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button, Card } from '../Atoms/index.jsx';
import { StarRating, TagChip, TextArea } from '../Molecules/index.jsx';

import { FEEDBACK_TAGS, FEEDBACK_FORM_SECTIONS } from '../../constants/feedback.js';

export const FeedbackFormSection = ({
  entityType,
  rating,
  selectedTags,
  comment,
  onRatingChange,
  onRatingBlur,
  onTagToggle,
  onCommentChange,
  ratingError,
  isExpanded = true,
  onToggleExpand,
  isCollapsible = false,
}) => {
  const section = FEEDBACK_FORM_SECTIONS[entityType];
  const tags = FEEDBACK_TAGS[entityType];

  return (
    <Card className="p-6 border-l-4 border-l-blue-500" data-testid={`feedback-section-${entityType}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900">{section.title}</h3>
          <p className="text-sm text-slate-600 mt-1">{section.description}</p>
        </div>
        {isCollapsible && (
          <button
            onClick={() => onToggleExpand?.(!isExpanded)}
            className="text-slate-500 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
            aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${section.title}`}
          >
            {isExpanded ? <ChevronUp /> : <ChevronDown />}
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Rate your experience *
            </label>
            <StarRating
              value={rating}
              onChangeRating={onRatingChange}
              onBlur={onRatingBlur}
              size="lg"
              ariaLabel={`Rate ${section.title}`}
            />
            {ratingError && (
              <p className="text-sm text-red-600 mt-2">{ratingError}</p>
            )}
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Quick feedback (select one or more)
              </label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <TagChip
                    key={tag.id}
                    id={tag.id}
                    label={tag.label}
                    selected={selectedTags.includes(tag.id)}
                    onToggle={onTagToggle}
                    sentiment={tag.sentiment}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Comment */}
          <TextArea
            label="Additional comments (optional)"
            placeholder="Share your detailed feedback here..."
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
            maxLength={500}
            showCharCount={true}
            rows={3}
          />
        </div>
      )}
    </Card>
  );
};

export default FeedbackFormSection;
