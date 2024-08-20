import axios from 'axios';

const api = axios.create({
  baseURL: 'http://your-api-url.com/api',
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
