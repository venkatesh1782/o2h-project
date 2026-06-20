import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheck, FaEdit, FaTrash } from 'react-icons/fa';
import { formatDate } from '../utils/formatDate';

const TaskCard = ({ task, onComplete, onDelete }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <span className="badge badge-completed">Completed</span>;
      case 'In Progress':
        return <span className="badge badge-progress">In Progress</span>;
      case 'Pending':
      default:
        return <span className="badge badge-pending">Pending</span>;
    }
  };

  const handleDeleteClick = () => {
    if (window.confirm(`Are you sure you want to delete the task "${task.title}"?`)) {
      onDelete(task._id);
    }
  };

  return (
    <div className="custom-card p-3 mb-3">
      <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
        <h5 className="fw-bold mb-0 text-truncate">{task.title}</h5>
        {getStatusBadge(task.status)}
      </div>
      
      <p className="text-secondary small mb-3" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {task.description}
      </p>
      
      <div className="d-flex justify-content-between align-items-center border-top pt-2 mt-2">
        <span className="text-light small fw-medium">
          Created: {formatDate(task.createdAt)}
        </span>
        
        <div className="d-flex gap-2">
          {task.status !== 'Completed' && (
            <button
              className="btn btn-sm btn-outline-success"
              onClick={() => onComplete(task._id)}
              title="Mark Completed"
            >
              <FaCheck />
            </button>
          )}
          <Link
            to={`/tasks/${task._id}/edit`}
            className="btn btn-sm btn-outline-primary"
            title="Edit Task"
          >
            <FaEdit />
          </Link>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={handleDeleteClick}
            title="Delete Task"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
