import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 py-5 bg-light bg-opacity-25">
      <div className="container text-center" style={{ maxWidth: '480px' }}>
        <div className="custom-card p-5 shadow-sm">
          <div 
            className="bg-danger-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4"
            style={{ width: '90px', height: '90px', backgroundColor: 'rgba(239, 68, 68, 0.08)' }}
          >
            <FaExclamationTriangle className="fs-1 text-danger animate-pulse" />
          </div>
          
          <h1 className="display-4 fw-bold text-primary mb-2">404</h1>
          <h3 className="fw-bold mb-3">Page Not Found</h3>
          <p className="text-secondary mb-4">
            The page you are looking for does not exist, has been moved, or is temporarily unavailable.
          </p>
          
          <Link to="/dashboard" className="btn btn-primary px-4 py-2 shadow-sm">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
