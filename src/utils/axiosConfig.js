import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred';

    if (error.response) {
      message = error.response.data.message || message;
      if (error.response.status === 400 && error.response.data.errors) {
        message = Object.values(error.response.data.errors).join(', ');
      }
    } else if (error.request) {
      message = 'Network error. Please check your connection.';
    }

    // Optional: dispatch error to Redux if you want global error state
    // error.config?.store?.dispatch(setError({ message, status: error.response?.status }));

    return Promise.reject(error);
  }
);

export default instance;
