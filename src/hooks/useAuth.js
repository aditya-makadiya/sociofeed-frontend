import { useDispatch, useSelector } from 'react-redux';
import {
  register,
  login,
  activate,
  forgotPassword,
  resetPassword,
  resendActivation,
  refreshToken,
  logout,
  clearError,
} from '../app/slices/authSlice';

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    register: (data) => dispatch(register(data)),
    login: (data) => dispatch(login(data)),
    activate: (token) => dispatch(activate(token)),
    forgotPassword: (data) => dispatch(forgotPassword(data)),
    resetPassword: (token, data) => dispatch(resetPassword({ token, data })),
    resendActivation: (data) => dispatch(resendActivation(data)),
    refreshToken: () => dispatch(refreshToken()),
    logout: () => dispatch(logout()),
    clearError: () => dispatch(clearError()),
  };
};


export default useAuth;