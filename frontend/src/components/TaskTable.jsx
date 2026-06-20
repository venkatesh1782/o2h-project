import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheck, FaEdit, FaTrash } from 'react-icons/fa';
import { formatDate } from '../utils/formatDate';

const TaskTable = ({ tasks, onComplete, onDelete }) => {
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

  const handleDeleteClick = (id, title) => {
    if (window.confirm(`Are you sure you want to delete the task "${title}"?`)) {
      onDelete(id);
    }
  };

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead>
          <tr>
            <th style={{ width: '25%' }}>Title</th>
            <th style={{ width: '40%' }}>Description</th>
            <th style={{ width: '15%' }}>Status</th>
            <th style={{ width: '10%' }}>Created Date</th>
            <th style={{ width: '10%', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id}>
              <td className="fw-semibold text-truncate" style={{ maxWidth: '180px' }}>
                {task.title}
              </td>
              <td>
                <p className="mb-0 text-truncate text-secondary" style={{ maxWidth: '300px' }} title={task.description}>
                  {task.description}
                </p>
              </td>
              <td>{getStatusBadge(task.status)}</td>
              <td className="text-secondary small">{formatDate(task.createdAt)}</td>
              <td>
                <div className="d-flex justify-content-end gap-2">
                  {task.status !== 'Completed' && (
                    <button
                      className="btn btn-sm btn-outline-success"
                      onClick={() => onComplete(task._id)}
                      title="Mark as Completed"
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
                    onClick={() => handleDeleteClick(task._id, task.title)}
                    title="Delete Task"
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
