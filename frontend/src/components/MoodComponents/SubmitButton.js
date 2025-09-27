
import React, { useState } from 'react';

const SubmitButton = ({ isDisabled, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClick = () => {
    if (isDisabled) return;
    
    setIsSubmitting(true);
    onSubmit();
    
    // Reset submitting state after a short delay
    setTimeout(() => setIsSubmitting(false), 1000);
  };

  return (
    <button
      className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
      disabled={isDisabled || isSubmitting}
      onClick={handleClick}
    >
      {isSubmitting ? 'Saving...' : 'Save Entry'}
    </button>
  );
};

export default SubmitButton;