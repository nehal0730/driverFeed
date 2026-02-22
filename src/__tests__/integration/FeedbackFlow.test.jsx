/**
 * Integration test: Feedback submission flow
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FeedbackForm } from '../../components/Organisms/FeedbackForm.jsx';
import { useFeatureFlagStore } from '../../store/featureFlagStore.js';
import { useFeedbackStore } from '../../store/feedbackStore.js';

// Mock the API
vi.mock('../../api/feedbackAPI.js', () => ({
  feedbackAPI: {
    submitFeedback: vi.fn().mockResolvedValue({
      id: '123',
      entityType: 'driver',
      entityId: '1',
      rating: 5,
      tags: ['polite'],
      sentiment: 'positive',
      timestamp: new Date().toISOString(),
      employeeId: 'emp1',
    }),
  },
}));

describe('Feedback Submission Flow', () => {
  beforeEach(() => {
    // Reset stores
    useFeatureFlagStore.setState({
      flags: {
        driverFeedback: true,
        tripFeedback: true,
        appFeedback: false,
        marshalFeedback: false,
        realTimeAlerts: true,
        advancedAnalytics: true,
      },
    });
    useFeedbackStore.setState({
      submissions: [],
      currentSubmission: null,
      hasSubmitted: false,
    });
  });

  it('should render form with enabled sections', () => {
    render(<FeedbackForm />);

    expect(screen.getByText('Driver Feedback')).toBeInTheDocument();
    expect(screen.getByText('Trip Experience')).toBeInTheDocument();
    expect(screen.queryByText('Mobile App Feedback')).not.toBeInTheDocument();
  });

  it('should show "no feedback options" when all flags disabled', () => {
    useFeatureFlagStore.setState({
      flags: {
        driverFeedback: false,
        tripFeedback: false,
        appFeedback: false,
        marshalFeedback: false,
        realTimeAlerts: true,
        advancedAnalytics: true,
      },
    });

    render(<FeedbackForm />);

    expect(screen.getByText('No feedback options available')).toBeInTheDocument();
  });

  it('should require at least one rating before submit', async () => {
    const user = userEvent.setup();
    render(<FeedbackForm />);

    const submitButton = screen.getByRole('button', { name: /submit feedback/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/provide at least one rating/i)).toBeInTheDocument();
    });
  });

  it('should update form state when rating is selected', async () => {
    const user = userEvent.setup();
    render(<FeedbackForm />);

    const starButtons = screen.getAllByRole('radio');
    await user.click(starButtons[4]);

    const submitButton = screen.getByRole('button', { name: /submit feedback/i });
    expect(submitButton).not.toBeDisabled();
  });
});
