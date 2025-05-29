import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { ROUTES } from '../../constants';

const    = () => {
  const { activate, loading, error } = useAuth();
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const activateAccount = async () => {
      try {
        await activate(token).unwrap();
        setTimeout(() => navigate(ROUTES.LOGIN), 3000);
      } catch (err) {
        // Error handled by axios interceptor
      }
    };
    activateAccount();
  }, [activate, token, navigate]);

  return (
    <div className="form-container">
      <h2 className="text-2xl font-bold text-center mb-4">Account Activation</h2>
      {loading ? (
        <p className="text-center">Activating your account...</p>
      ) : error ? (
        <p className="error-text text-center">{error}</p>
      ) : (
        <p className="success-text text-center">
          Account activated! Redirecting to login...
        </p>
      )}
    </div>
  );
};

export default ActivateAccount;