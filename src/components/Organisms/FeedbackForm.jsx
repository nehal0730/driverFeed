/**
 * Configurable Feedback Form Component - Organism component
 * Main feedback form with feature flag support
 */

import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Button, Card } from '../Atoms/index.jsx';
import { FeedbackFormSection } from './FeedbackFormSection.jsx';
import { useFeatureFlagStore } from '../../store/featureFlagStore.js';
import { useFeedbackStore } from '../../store/feedbackStore.js';
import { useAlertStore } from '../../store/alertStore.js';
import { useForm } from '../../hooks/custom/useForm.js';
import { useMutation } from '../../hooks/custom/useFetch.js';
import { feedbackAPI } from '../../api/feedbackAPI.js';

export const FeedbackForm = ({
  showSuccessMessage = true,
  onSubmitSuccess,
}) => {
  const flags = useFeatureFlagStore((state) => state.flags);
  const flagsLoading = useFeatureFlagStore((state) => state.loading);
  const flagsError = useFeatureFlagStore((state) => state.error);
  const addFeedback = useFeedbackStore((state) => state.addSubmission);
  const addToast = useAlertStore((state) => state.addToast);

  const { formData, updateRating, toggleTag, updateField, reset, isValid } =
    useForm();

  const [expandedSections, setExpandedSections] = useState(() => ({
    driver: flags.driverFeedback,
    trip: flags.tripFeedback,
    app: flags.appFeedback,
    marshal: flags.marshalFeedback,
  }));

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [touched, setTouched] = useState({
    driver: false,
    trip: false,
    app: false,
    marshal: false,
  });
  const [showSuccess, setShowSuccess] = useState(false);

  // Track which sections are available
  useEffect(() => {
    setExpandedSections({
      driver: flags.driverFeedback,
      trip: flags.tripFeedback,
      app: flags.appFeedback,
      marshal: flags.marshalFeedback,
    });
  }, [flags]);

  const { mutate: submitFeedback, loading: isSubmitting } = useMutation(
    feedbackAPI.submitFeedback,
    {
      onSuccess: (data) => {
        addFeedback(data);
        setShowSuccess(true);
        setHasSubmitted(false);
        if (showSuccessMessage) {
          addToast({
            type: 'success',
            message: 'Feedback submitted successfully!',
            duration: 5000,
          });
        }
        reset();
        onSubmitSuccess?.();
        setTimeout(() => setShowSuccess(false), 3000);
      },
      onError: (error) => {
        setHasSubmitted(false);
        addToast({
          type: 'error',
          message: error.message || 'Failed to submit feedback',
          duration: 5000,
        });
      },
    }
  );

  const enabledSections = ['driver', 'trip', 'app', 'marshal'].filter(
    (section) => flags[`${section}Feedback`]
  );

  const completedSections = enabledSections.filter(
    (section) => formData[`${section}Rating`] > 0
  );

  const progressPercent = enabledSections.length
    ? Math.round((completedSections.length / enabledSections.length) * 100)
    : 0;

  const ratingErrorFor = (section) => {
    if (!touched[section]) return null;
    if (formData[`${section}Rating`] > 0) return null;
    return 'Select a rating or leave this section blank.';
  };

  if (flagsLoading) {
    return (
      <Card className="p-8 flex justify-center">
        <div className="text-slate-600">Loading feedback options...</div>
      </Card>
    );
  }

  if (flagsError) {
    return (
      <Card className="p-8 bg-red-50 border border-red-200">
        <div className="flex gap-3 items-start">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-red-900">Unable to load feedback options</h3>
            <p className="text-sm text-red-800 mt-1">
              {flagsError}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (enabledSections.length === 0) {
    return (
      <Card className="p-8 bg-amber-50 border border-amber-200">
        <div className="flex gap-3 items-start">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-amber-900">No feedback options available</h3>
            <p className="text-sm text-amber-800 mt-1">
              All feedback modules are currently disabled. Please contact administration.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Share Your Feedback</h1>
        <p className="text-slate-600 mt-2">
          Your feedback helps us improve the experience for our employees.
        </p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <Card className="p-4 bg-green-50 border border-green-200 flex gap-3 items-start">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-green-900">Feedback submitted successfully!</p>
            <p className="text-sm text-green-800 mt-1">
              Thank you for taking the time to share your feedback.
            </p>
          </div>
        </Card>
      )}

      {/* Form Sections */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!isValid()) {
            addToast({
              type: 'error',
              message: 'Please provide at least one rating',
              duration: 5000,
            });
            return;
          }
          if (!hasSubmitted) {
            setHasSubmitted(true);
            submitFeedback(formData);
          }
        }}
        className="space-y-6"
      >
        {enabledSections.length > 1 && (
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-slate-700">Progress</p>
              <p className="text-sm text-slate-600">
                {completedSections.length}/{enabledSections.length} sections completed
              </p>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-200">
              <div
                className="h-2 rounded-full bg-blue-600 transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </Card>
        )}

        {/* Driver Feedback */}
        {flags.driverFeedback && (
          <FeedbackFormSection
            entityType="driver"
            rating={formData.driverRating || 0}
            selectedTags={formData.driverTags || []}
            comment={formData.driverComment || ''}
            onRatingChange={(rating) => updateRating('driver', rating)}
            onRatingBlur={() => setTouched((prev) => ({ ...prev, driver: true }))}
            onTagToggle={(tag) => toggleTag('driver', tag)}
            onCommentChange={(comment) => updateField('driverComment', comment)}
            isExpanded={expandedSections.driver}
            onToggleExpand={(expanded) =>
              setExpandedSections((prev) => ({ ...prev, driver: expanded }))
            }
            isCollapsible={enabledSections.length > 1}
            ratingError={ratingErrorFor('driver')}
          />
        )}

        {/* Trip Feedback */}
        {flags.tripFeedback && (
          <FeedbackFormSection
            entityType="trip"
            rating={formData.tripRating || 0}
            selectedTags={formData.tripTags || []}
            comment={formData.tripComment || ''}
            onRatingChange={(rating) => updateRating('trip', rating)}
            onRatingBlur={() => setTouched((prev) => ({ ...prev, trip: true }))}
            onTagToggle={(tag) => toggleTag('trip', tag)}
            onCommentChange={(comment) => updateField('tripComment', comment)}
            isExpanded={expandedSections.trip}
            onToggleExpand={(expanded) =>
              setExpandedSections((prev) => ({ ...prev, trip: expanded }))
            }
            isCollapsible={enabledSections.length > 1}
            ratingError={ratingErrorFor('trip')}
          />
        )}

        {/* App Feedback */}
        {flags.appFeedback && (
          <FeedbackFormSection
            entityType="app"
            rating={formData.appRating || 0}
            selectedTags={formData.appTags || []}
            comment={formData.appComment || ''}
            onRatingChange={(rating) => updateRating('app', rating)}
            onRatingBlur={() => setTouched((prev) => ({ ...prev, app: true }))}
            onTagToggle={(tag) => toggleTag('app', tag)}
            onCommentChange={(comment) => updateField('appComment', comment)}
            isExpanded={expandedSections.app}
            onToggleExpand={(expanded) =>
              setExpandedSections((prev) => ({ ...prev, app: expanded }))
            }
            isCollapsible={enabledSections.length > 1}
            ratingError={ratingErrorFor('app')}
          />
        )}

        {/* Marshal Feedback */}
        {flags.marshalFeedback && (
          <FeedbackFormSection
            entityType="marshal"
            rating={formData.marshalRating || 0}
            selectedTags={formData.marshalTags || []}
            comment={formData.marshalComment || ''}
            onRatingChange={(rating) => updateRating('marshal', rating)}
            onRatingBlur={() => setTouched((prev) => ({ ...prev, marshal: true }))}
            onTagToggle={(tag) => toggleTag('marshal', tag)}
            onCommentChange={(comment) => updateField('marshalComment', comment)}
            isExpanded={expandedSections.marshal}
            onToggleExpand={(expanded) =>
              setExpandedSections((prev) => ({ ...prev, marshal: expanded }))
            }
            isCollapsible={enabledSections.length > 1}
            ratingError={ratingErrorFor('marshal')}
          />
        )}

        {/* Submit Button */}
        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            size="lg"
            fullWidth
            disabled={hasSubmitted || isSubmitting || !isValid()}
            isLoading={isSubmitting}
            data-testid="submit-feedback"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={() => {
              reset();
              setHasSubmitted(false);
              setShowSuccess(false);
              setTouched({ driver: false, trip: false, app: false, marshal: false });
            }}
          >
            Clear
          </Button>
        </div>
      </form>

      {/* Info */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <p className="text-sm text-blue-900">
          <strong>Note:</strong> Fields marked with * are required. Make sure to provide at least one
          rating.
        </p>
      </Card>
    </div>
  );
};

export default FeedbackForm;
