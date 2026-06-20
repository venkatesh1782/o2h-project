import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const getSpinnerClass = () => {
    switch (size) {
      case 'sm': return 'spinner-border-sm';
      case 'lg': return 'spinner-border-lg';
      case 'md':
      default:
        return '';
    }
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div 
        className={`spinner-border text-primary ${getSpinnerClass()}`} 
        role="status"
        style={size === 'lg' ? { width: '3rem', height: '3rem' } : {}}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      {text && <span className="mt-2 text-secondary fw-medium small">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;
