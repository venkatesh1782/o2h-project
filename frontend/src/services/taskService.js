import api from './api';

const getTasks = async (params = {}) => {
  const { page = 1, limit = 5, status = 'All', search = '', sort = 'newest' } = params;
  
  // Construct query string
  const queryParams = new URLSearchParams();
  queryParams.append('page', page);
  queryParams.append('limit', limit);
  if (status && status !== 'All') {
    queryParams.append('status', status);
  }
  if (search) {
    queryParams.append('search', search);
  }
  queryParams.append('sort', sort);

  const response = await api.get(`/api/tasks?${queryParams.toString()}`);
  return response.data;
};

const createTask = async (taskData) => {
  const response = await api.post('/api/tasks', taskData);
  return response.data;
};

const updateTask = async (id, taskData) => {
  const response = await api.put(`/api/tasks/${id}`, taskData);
  return response.data;
};

const deleteTask = async (id) => {
  const response = await api.delete(`/api/tasks/${id}`);
  return response.data;
};

const completeTask = async (id) => {
  const response = await api.put(`/api/tasks/${id}/complete`);
  return response.data;
};

const getTaskById = async (id) => {
  const response = await api.get(`/api/tasks/${id}`);
  return response.data;
};

const taskService = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
};

export default taskService;
