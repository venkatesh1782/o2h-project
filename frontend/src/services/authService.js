import api from './api';

const register = async (name, email, password) => {
  const response = await api.post('/api/auth/register', {
    name,
    email,
    password,
  });
  return response.data;
};

const login = async (email, password) => {
  const response = await api.post('/api/auth/login', {
    email,
    password,
  });
  return response.data;
};

const authService = {
  register,
  login,
};

export default authService;
