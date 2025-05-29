import { toast } from 'react-toastify';

// Success Toast
export const showSuccessToast = (message, options = {}) =>
  toast.success(message, options);

// Error Toast
export const showErrorToast = (message, options = {}) =>
  toast.error(message, options);

// Info Toast
export const showInfoToast = (message, options = {}) =>
  toast.info(message, options);

// Promise Toast (for async actions)
export const showPromiseToast = (promise, messages, options = {}) =>
  toast.promise(promise, messages, options);
