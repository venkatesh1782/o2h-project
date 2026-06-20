import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import taskService from '../services/taskService';
import TaskForm from '../components/TaskForm';
import LoadingSpinner from '../components/LoadingSpinner';

const TaskFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const isEditMode = Boolean(id);
  const [task, setTask] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(isEditMode);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchTaskDetails = async () => {
        try {
          const taskData = await taskService.getTaskById(id);
          setTask(taskData);
        } catch (err) {
          console.error('Error fetching task:', err);
          showToast('Failed to load task details. Redirecting...', 'danger');
          navigate('/dashboard');
        } finally {
          setFetchLoading(false);
        }
      };

      fetchTaskDetails();
    }
  }, [id, isEditMode, navigate, showToast]);

  const handleSubmit = async (formData) => {
    setSubmitLoading(true);
    try {
      if (isEditMode) {
        await taskService.updateTask(id, formData);
        showToast('Task updated successfully!', 'success');
      } else {
        await taskService.createTask(formData);
        showToast('Task created successfully!', 'success');
      }
      navigate('/dashboard');
    } catch (err) {
      console.error('Error saving task:', err);
      const errMsg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to save task. Please try again.';
      showToast(errMsg, 'danger');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (fetchLoading) {
    return <LoadingSpinner size="lg" text="Retrieving task details..." />;
  }

  return (
    <div className="container" style={{ maxWidth: '650px' }}>
      <div className="custom-card p-4">
        <div className="mb-4">
          <h2 className="fw-bold mb-1">
            {isEditMode ? 'Edit Task' : 'Add New Task'}
          </h2>
          <p className="text-secondary small">
            {isEditMode 
              ? 'Update the fields below to modify your task parameters.' 
              : 'Create a new item in your project workflow.'}
          </p>
        </div>

        <TaskForm
          initialValues={task}
          onSubmit={handleSubmit}
          submitLabel={isEditMode ? 'Save Changes' : 'Create Task'}
          loading={submitLoading}
        />
      </div>
    </div>
  );
};

export default TaskFormPage;
