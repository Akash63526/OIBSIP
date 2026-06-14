import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { EnvelopeIcon, ArrowRightIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import Toast from '../../components/ui/Toast';
import { authApi } from '../../api/authApi';

const schema = yup.object().shape({
  email: yup.string().email('Please enter a valid email').required('Email is required'),
});

const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await authApi.forgotPassword(data.email);
      setStatus({ type: 'success', message: 'Password reset link sent to your email.' });
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.message || 'Failed to send reset link.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center relative z-10 w-full">
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
          Forgot <span className="text-[#E33E23]">Password?</span>
        </h1>
        <p className="text-gray-500 text-sm font-medium tracking-wide max-w-sm mx-auto leading-relaxed">
          No worries! Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      {/* 3D Envelope Illustration */}
      <div className="relative w-64 h-56 mb-8 z-10 flex justify-center items-center drop-shadow-xl hover:-translate-y-2 transition-transform duration-500">
        <img src="/envelope.png" alt="Reset Password Envelope" className="w-full h-full object-contain" />
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-[2rem] p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] w-full border border-gray-100 z-10">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Address */}
          <div className="space-y-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                placeholder="Enter your email address"
                className={`block w-full pl-11 pr-4 py-4 border ${errors.email ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:ring-red-500/10'
                  } rounded-2xl bg-white text-gray-900 placeholder-gray-400 text-sm font-semibold focus:outline-none focus:ring-4 transition-all`}
                {...register('email')}
              />
            </div>
            {errors.email && <p className="text-xs font-bold text-red-600 pl-2 mt-1">{errors.email.message}</p>}
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#E33E23] hover:bg-[#c93219] disabled:bg-[#f07d6b] text-white py-4 px-6 rounded-2xl font-extrabold text-base flex items-center justify-between shadow-lg shadow-red-500/15 hover:shadow-red-500/25 active:scale-[0.98] transition-all duration-200"
          >
            <span>{isLoading ? 'Sending...' : 'Send Reset Link'}</span>
            <div className="bg-white rounded-full p-1.5 flex items-center justify-center shadow-md">
              <ArrowRightIcon className="h-4 w-4 text-[#E33E23] stroke-[3]" />
            </div>
          </button>
        </form>

        {/* Spam Notice */}
        <div className="mt-6 bg-[#FFF8F0] border border-[#FFE4C4] rounded-2xl p-4 flex items-start gap-4">
          <div className="bg-[#FFE4C4] p-2 rounded-full mt-0.5">
            <LightBulbIcon className="h-5 w-5 text-[#E33E23]" />
          </div>
          <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
            Make sure to check your spam folder if you don't see the email in your inbox.
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

      {status && <Toast message={status.message} type={status.type} onClose={() => setStatus(null)} />}
    </div>
  );
};

export default ForgotPasswordPage;
