import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { LockClosedIcon, EyeIcon, EyeSlashIcon, ArrowRightIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import Toast from '../../components/ui/Toast';
import { authApi } from '../../api/authApi';

const schema = yup.object().shape({
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const passwordValue = watch('password', '');
  
  // Calculate password strength simple logic
  const getStrength = (pass) => {
    let score = 0;
    if (!pass) return { score: 0, label: '', color: 'bg-gray-200', text: '' };
    if (pass.length > 5) score += 1;
    if (pass.length > 7) score += 1;
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500', text: 'text-red-500' };
    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-yellow-500', text: 'text-yellow-500' };
    if (score === 3) return { score: 3, label: 'Strong', color: 'bg-[#E33E23]', text: 'text-[#16A34A]' }; // Matched to design color
    return { score: 4, label: 'Very Strong', color: 'bg-green-500', text: 'text-green-600' };
  };

  const strength = getStrength(passwordValue);

  const onSubmit = async (data) => {
    // If no token in URL, show error (or you could allow testing bypass if needed)
    if (!token) {
      setToast({ message: 'Invalid or missing reset token.', type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      await authApi.resetPassword(token, data.password);
      setToast({ message: 'Password reset successful! Redirecting to login...', type: 'success' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setToast({ message: error.response?.data?.message || 'Failed to reset password.', type: 'error' });
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center relative z-10 w-full">
      {/* Decorative Flying Elements (SVG) */}
      <div className="absolute inset-0 pointer-events-none overflow-visible flex justify-center items-center">
        <div className="absolute -left-12 top-40 w-16 h-16 bg-red-500 rounded-full blur-[2px] opacity-20 animate-pulse"></div>
        <div className="absolute -right-8 bottom-32 w-12 h-12 bg-green-500 rounded-full blur-[2px] opacity-20 animate-bounce"></div>
      </div>

      {/* Logo */}
      <div className="flex items-center gap-2 mb-8 z-10">
        <img src="/logo.jpg" alt="SliceSprint Logo" className="h-10 w-auto object-contain rounded-md" />
        <div className="flex flex-col">
          <span className="text-xl font-black text-gray-900 tracking-tight leading-none">SliceSprint</span>
          <span className="text-[10px] font-bold text-red-600 tracking-widest uppercase mt-0.5">Pizza Delivery</span>
        </div>
      </div>

      {/* Header Titles */}
      <div className="text-center space-y-3 mb-6 z-10">
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
          Reset <span className="text-[#E33E23]">Password</span>
        </h1>
        <p className="text-gray-500 text-sm font-medium tracking-wide max-w-sm mx-auto leading-relaxed">
          Create a new password for your account and make sure it's strong.
        </p>
      </div>

      {/* 3D Pizza Shield Illustration */}
      <div className="relative w-72 h-56 mb-6 z-10 flex justify-center items-center drop-shadow-xl hover:-translate-y-2 transition-transform duration-500">
        <img src="/pizza_shield.png" alt="Reset Password Secure Pizza" className="w-full h-full object-contain" />
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-[2rem] p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] w-full border border-gray-100 z-10">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* New Password */}
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="New Password"
                className={`block w-full pl-11 pr-12 py-4 border ${
                  errors.password ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:ring-red-500/10'
                } rounded-2xl bg-white text-gray-900 placeholder-gray-400 text-sm font-semibold focus:outline-none focus:ring-4 transition-all`}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="text-xs font-bold text-red-600 pl-2 -mt-2">{errors.password.message}</p>}

            {/* Password Strength Meter */}
            <div className="flex items-center gap-2 pl-1 pr-1">
              <div className="flex-1 flex gap-1.5 h-1.5">
                <div className={`flex-1 rounded-full ${strength.score >= 1 ? strength.color : 'bg-gray-200 transition-colors duration-300'}`}></div>
                <div className={`flex-1 rounded-full ${strength.score >= 2 ? strength.color : 'bg-gray-200 transition-colors duration-300'}`}></div>
                <div className={`flex-1 rounded-full ${strength.score >= 3 ? strength.color : 'bg-gray-200 transition-colors duration-300'}`}></div>
                <div className={`flex-1 rounded-full ${strength.score >= 4 ? strength.color : 'bg-gray-200 transition-colors duration-300'}`}></div>
              </div>
              <span className={`text-[11px] font-black uppercase tracking-wider w-16 text-right ${strength.score > 0 ? strength.text : 'text-gray-400'}`}>
                {strength.label || 'None'}
              </span>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="space-y-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm New Password"
                className={`block w-full pl-11 pr-12 py-4 border ${
                  errors.confirmPassword ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:ring-red-500/10'
                } rounded-2xl bg-white text-gray-900 placeholder-gray-400 text-sm font-semibold focus:outline-none focus:ring-4 transition-all`}
                {...register('confirmPassword')}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showConfirmPassword ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-xs font-bold text-red-600 pl-2 mt-1">{errors.confirmPassword.message}</p>}
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#E33E23] hover:bg-[#c93219] disabled:bg-[#f07d6b] text-white py-4 px-6 rounded-2xl font-extrabold text-base flex items-center justify-center gap-3 shadow-lg shadow-red-500/15 hover:shadow-red-500/25 active:scale-[0.98] transition-all duration-200 relative"
          >
            <span>{isLoading ? 'Resetting...' : 'Reset Password'}</span>
            <div className="absolute right-3 bg-white rounded-full p-1.5 flex items-center justify-center shadow-md">
              <ArrowRightIcon className="h-4 w-4 text-[#E33E23] stroke-[3]" />
            </div>
          </button>
        </form>

        {/* Security Rule Notice */}
        <div className="mt-6 bg-[#F0FDF4] border border-[#DCFCE7] rounded-2xl p-4 flex items-start gap-4">
          <div className="bg-white p-1.5 rounded-full mt-0.5 shadow-sm border border-green-100">
            <ShieldCheckIcon className="h-5 w-5 text-[#16A34A]" />
          </div>
          <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
            Use at least 8 characters with a mix of letters, numbers & symbols.
          </p>
        </div>

        {/* Navigation footer */}
        <div className="mt-8 text-center text-sm font-semibold text-gray-500">
          Remember your password?{' '}
          <Link to="/login" className="text-[#E33E23] hover:underline font-bold">
            Login
          </Link>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default ResetPasswordPage;
