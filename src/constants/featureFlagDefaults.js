/**
 * Default feature flag configuration
 */

export const DEFAULT_FEATURE_FLAGS = {
  driverFeedback: true,
  tripFeedback: true,
  appFeedback: false,
  marshalFeedback: false,
  realTimeAlerts: true,
  advancedAnalytics: true,
};

export const FEATURE_FLAG_LABELS = {
  driverFeedback: 'Driver Feedback',
  tripFeedback: 'Trip Feedback',
  appFeedback: 'App Feedback',
  marshalFeedback: 'Marshal Feedback',
  realTimeAlerts: 'Real-time Alerts',
  advancedAnalytics: 'Advanced Analytics',
};

export const FEATURE_FLAG_DESCRIPTIONS = {
  driverFeedback: 'Allow employees to rate and provide feedback on drivers',
  tripFeedback: 'Allow employees to rate trip experience (punctuality, route accuracy, comfort)',
  appFeedback: 'Allow employees to rate the mobile app (UX, speed, reliability)',
  marshalFeedback: 'Allow employees to rate marshal assistance (safety, helpfulness, professionalism)',
  realTimeAlerts: 'Show real-time alerts when driver score drops below threshold',
  advancedAnalytics: 'Enable advanced analytics and trend analysis features',
};
