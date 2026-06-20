import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TaskForm = ({ initialValues, onSubmit, submitLabel = 'Submit', loading = false }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Pending',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialValues) {
      setFormData({
        title: initialValues.title || '',
        description: initialValues.description || '',
        status: initialValues.status || 'Pending',
      });
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error when user begins correcting it
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required.';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required.';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters long.';
    }

    if (!formData.status) {
      newErrors.status = 'Status is required.';
    } else if (!['Pending', 'In Progress', 'Completed'].includes(formData.status)) {
      newErrors.status = 'Status must be Pending, In Progress, or Completed.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Title */}
      <div className="mb-3">
        <label htmlFor="task-title" className="form-label fw-semibold">
          Task Title <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          id="task-title"
          name="title"
          className={`form-control ${errors.title ? 'is-invalid' : ''}`}
          placeholder="Enter a brief descriptive title"
          value={formData.title}
          onChange={handleChange}
          disabled={loading}
          required
        />
        {errors.title && <div className="invalid-feedback">{errors.title}</div>}
      </div>

      {/* Description */}
      <div className="mb-3">
        <label htmlFor="task-description" className="form-label fw-semibold">
          Description <span className="text-danger">*</span>
        </label>
        <textarea
          id="task-description"
          name="description"
          className={`form-control ${errors.description ? 'is-invalid' : ''}`}
          rows="5"
          placeholder="Provide a detailed description of the task requirements (min. 20 characters)..."
          value={formData.description}
          onChange={handleChange}
          disabled={loading}
          required
        />
        <div className="d-flex justify-content-between mt-1">
          {errors.description ? (
            <div className="text-danger small">{errors.description}</div>
          ) : (
            <div className="text-secondary small">
              Must be at least 20 characters.
            </div>
          )}
          <span className="text-secondary small">
            {formData.description.length} chars
          </span>
        </div>
      </div>

      {/* Status */}
      <div className="mb-4">
        <label htmlFor="task-status" className="form-label fw-semibold">
          Status <span className="text-danger">*</span>
        </label>
        <select
          id="task-status"
          name="status"
          className={`form-select ${errors.status ? 'is-invalid' : ''}`}
          value={formData.status}
          onChange={handleChange}
          disabled={loading}
          required
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        {errors.status && <div className="invalid-feedback">{errors.status}</div>}
      </div>

      {/* Action Buttons */}
      <div className="d-flex gap-2">
        <button
          type="submit"
          className="btn btn-primary px-4 py-2"
          disabled={loading}
        >
          {loading ? 'Processing...' : submitLabel}
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary px-4 py-2"
          onClick={() => navigate('/dashboard')}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
