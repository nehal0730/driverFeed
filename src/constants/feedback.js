/**
 * Feedback-related constants and configurations
 */

export const FEEDBACK_TAGS = {
  driver: [
    { id: 'professional', label: 'Professional', color: '#3b82f6', sentiment: 'positive' },
    { id: 'friendly', label: 'Friendly', color: '#10b981', sentiment: 'positive' },
    { id: 'safe', label: 'Safe', color: '#8b5cf6', sentiment: 'positive' },
    { id: 'courteous', label: 'Courteous', color: '#f59e0b', sentiment: 'positive' },
    { id: 'on_time', label: 'On Time', color: '#ec4899', sentiment: 'positive' },
    { id: 'clean_vehicle', label: 'Clean Vehicle', color: '#06b6d4', sentiment: 'positive' },
    { id: 'rude', label: 'Rude', color: '#ef4444', sentiment: 'negative' },
    { id: 'unsafe', label: 'Unsafe', color: '#dc2626', sentiment: 'negative' },
  ],
  trip: [
    { id: 'comfortable', label: 'Comfortable', color: '#10b981', sentiment: 'positive' },
    { id: 'smooth_ride', label: 'Smooth Ride', color: '#3b82f6', sentiment: 'positive' },
    { id: 'scenic_route', label: 'Scenic Route', color: '#8b5cf6', sentiment: 'positive' },
    { id: 'music_good', label: 'Good Music', color: '#f59e0b', sentiment: 'positive' },
    { id: 'ac_good', label: 'Good A/C', color: '#06b6d4', sentiment: 'positive' },
    { id: 'bumpy', label: 'Bumpy', color: '#ef4444', sentiment: 'negative' },
    { id: 'long_route', label: 'Long Route', color: '#f97316', sentiment: 'negative' },
    { id: 'delayed', label: 'Delayed', color: '#dc2626', sentiment: 'negative' },
  ],
  app: [
    { id: 'easy_to_use', label: 'Easy to Use', color: '#10b981', sentiment: 'positive' },
    { id: 'fast', label: 'Fast', color: '#3b82f6', sentiment: 'positive' },
    { id: 'clear', label: 'Clear', color: '#8b5cf6', sentiment: 'positive' },
    { id: 'responsive', label: 'Responsive', color: '#f59e0b', sentiment: 'positive' },
    { id: 'intuitive', label: 'Intuitive', color: '#06b6d4', sentiment: 'positive' },
    { id: 'buggy', label: 'Buggy', color: '#ef4444', sentiment: 'negative' },
    { id: 'slow', label: 'Slow', color: '#dc2626', sentiment: 'negative' },
    { id: 'confusing', label: 'Confusing', color: '#f97316', sentiment: 'negative' },
  ],
  marshal: [
    { id: 'helpful', label: 'Helpful', color: '#10b981', sentiment: 'positive' },
    { id: 'knowledgeable', label: 'Knowledgeable', color: '#3b82f6', sentiment: 'positive' },
    { id: 'responsive', label: 'Responsive', color: '#8b5cf6', sentiment: 'positive' },
    { id: 'friendly', label: 'Friendly', color: '#f59e0b', sentiment: 'positive' },
    { id: 'professional', label: 'Professional', color: '#06b6d4', sentiment: 'positive' },
    { id: 'unhelpful', label: 'Unhelpful', color: '#ef4444', sentiment: 'negative' },
    { id: 'rude', label: 'Rude', color: '#dc2626', sentiment: 'negative' },
    { id: 'slow_response', label: 'Slow Response', color: '#f97316', sentiment: 'negative' },
  ],
};

export const SENTIMENT_STYLES = {
  positive: {
    color: '#10b981',
    bgColor: '#dcfce7',
    textColor: '#065f46',
    icon: 'fa-solid fa-face-smile',
  },
  neutral: {
    color: '#6b7280',
    bgColor: '#f3f4f6',
    textColor: '#374151',
    icon: 'fa-solid fa-face-meh',
  },
  negative: {
    color: '#ef4444',
    bgColor: '#fee2e2',
    textColor: '#7f1d1d',
    icon: 'fa-solid fa-face-frown',
  },
};

export const SENTIMENT_ICONS = {
  positive: 'fa-solid fa-arrow-trend-up',
  neutral: 'fa-solid fa-arrow-right',
  negative: 'fa-solid fa-arrow-trend-down',
};

export const RATING_CONFIG = {
  min: 1,
  max: 5,
  step: 1,
  labels: {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent',
  },
};

export const FEEDBACK_FORM_SECTIONS = {
  driver: {
    id: 'driver',
    title: 'Driver Feedback',
    description: 'Rate the driver and share any specific observations.',
    icon: 'fa-solid fa-car',
  },
  trip: {
    id: 'trip',
    title: 'Trip Experience',
    description: 'Tell us about punctuality, route accuracy, and comfort.',
    icon: 'fa-solid fa-road',
  },
  app: {
    id: 'app',
    title: 'Mobile App Feedback',
    description: 'Rate the app usability, speed, and reliability.',
    icon: 'fa-solid fa-mobile-screen-button',
  },
  marshal: {
    id: 'marshal',
    title: 'Marshal Feedback',
    description: 'Share feedback on marshal safety and professionalism.',
    icon: 'fa-solid fa-user-shield',
  },
};
