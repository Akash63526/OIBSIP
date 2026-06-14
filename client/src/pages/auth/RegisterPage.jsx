import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../../components/auth/RegisterForm';
import { registerUser } from '../../features/auth/authSlice';
import Toast from '../../components/ui/Toast';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);
  const [toast, setToast] = React.useState(null);

  const handleSubmit = async (data) => {
    const resultAction = await dispatch(registerUser(data));
    if (registerUser.fulfilled.match(resultAction)) {
      navigate('/');
    } else {
      setToast(resultAction.payload || 'Registration failed');
    }
  };

  return (
    <>
      <RegisterForm onSubmit={handleSubmit} isLoading={isLoading} />
      {toast && <Toast message={toast} type="error" onClose={() => setToast(null)} />}
    </>
  );
};

export default RegisterPage;
