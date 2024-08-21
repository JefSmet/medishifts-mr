import axios from 'axios';
import { API_BASE_URL } from '@env';
import { getToken, removeToken } from './tokenStorage';

const api = axios.create({
  baseURL: API_BASE_URL,
});

const setAuthToken = async () => {
  const token = await getToken();
  if (token) {
    api.defaults.headers.common['Authorization'] = token;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response && error.response.status === 401) {
      await removeToken();
    }
    return Promise.reject(error);
  },
);

export { api, setAuthToken };
