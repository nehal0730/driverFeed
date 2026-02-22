

import React from 'react';
import FeedbackForm from '../components/Organisms/FeedbackForm.jsx';

/**
 * FeedbackPage component
 * @returns {JSX.Element}
 */
const FeedbackPage = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <FeedbackForm showSuccessMessage={true} />
    </div>
  );
};

export default FeedbackPage;
