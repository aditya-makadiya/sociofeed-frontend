import { setError } from '../app/slices/errorSlice';

const errorMessages = {
  400: 'Invalid request. Please check your input.',
  401: 'Authentication failed. Please log in again.',
  403: 'You do not have permission to perform this action.',
  404: 'Resource not found.',
  500: 'Server error. Please try again later.',
  default: 'An unexpected error occurred. Please try again.',
};

export const handleApiError = (error, dispatch) => {
  let message = errorMessages.default;
  if (error.response) {
    message = errorMessages[error.response.status] || error.response.data.message || message;
  } else if (error.request) {
    message = 'Network error. Please check your connection.';
  }

  console.error('API Error:', error);

  dispatch(setError({ message, status: error.response?.status }));
};

export const clearError = (dispatch) => {
  dispatch(setError(null));
};