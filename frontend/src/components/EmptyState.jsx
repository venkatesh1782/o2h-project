import React from 'react';
import { FaClipboardList } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const EmptyState = ({ title = 'No tasks found', message = 'Create a new task to get started!', showAddButton = true }) => {
  return (
    <div className="custom-card text-center p-5 my-4">
      <div 
        className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4"
        style={{ width: '80px', height: '80px', backgroundColor: 'var(--primary-light)' }}
      >
        <FaClipboardList className="fs-1 text-primary" />
      </div>
      <h3 className="fw-bold mb-2">{title}</h3>
      <p className="text-secondary mb-4 mx-auto" style={{ maxWidth: '350px' }}>
        {message}
      </p>
      {showAddButton && (
        <Link to="/tasks/new" className="btn btn-primary d-inline-flex align-items-center gap-2 px-4 py-2">
          Create First Task
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
