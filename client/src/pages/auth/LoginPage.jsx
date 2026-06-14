import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import { login } from '../../features/auth/authSlice';
import Toast from '../../components/ui/Toast';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);
  const [toast, setToast] = React.useState(null);

  const handleSubmit = async (data) => {
    const resultAction = await dispatch(login(data));
    if (login.fulfilled.match(resultAction)) {
      const user = resultAction.payload.data?.user || resultAction.payload.user;
      if (user?.role === 'admin') {
        navigate('/admin/settings');
      } else {
        navigate('/');
      }
    } else {
      setToast(resultAction.payload || 'Login failed');
    }
  };

  return (
    <>
      <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />
      {toast && <Toast message={toast} type="error" onClose={() => setToast(null)} />}
    </>
  );
};

export default LoginPage;
