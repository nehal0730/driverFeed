/**
 * Utility functions for form validation
 */

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phone.length >= 10 && phoneRegex.test(phone);
};

export const validateTextLength = (text, min, max) => {
  return text.length >= min && text.length <= max;
};

export const validateFeedbackForm = (data) => {
  const errors = {};

  // At least one rating required
  const hasRating =
    data.driverRating ||
    data.tripRating ||
    data.appRating ||
    data.marshalRating;

  if (!hasRating) {
    errors.general = 'Please provide at least one rating';
  }

  // Validate comments
  if (data.driverComment && !validateTextLength(data.driverComment, 0, 500)) {
    errors.driverComment = 'Driver comment must be 500 characters or less';
  }

  if (data.tripComment && !validateTextLength(data.tripComment, 0, 500)) {
    errors.tripComment = 'Trip comment must be 500 characters or less';
  }

  if (data.appComment && !validateTextLength(data.appComment, 0, 500)) {
    errors.appComment = 'App comment must be 500 characters or less';
  }

  if (data.marshalComment && !validateTextLength(data.marshalComment, 0, 500)) {
    errors.marshalComment = 'Marshal comment must be 500 characters or less';
  }

  return errors;
};

export const sanitizeText = (text) => {
  // Remove potentially harmful characters while keeping printable text
  return text
    .replace(/[<>\"]/g, '')
    .trim();
};

/**
 * Check if a number is within a valid range
 */
export const isInRange = (value, min, max) => {
  return value >= min && value <= max;
};
