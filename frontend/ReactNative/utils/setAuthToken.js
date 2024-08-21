import axios from 'axios';
import {API_BASE_URL} from '@env';

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

export { api, setAuthToken };
