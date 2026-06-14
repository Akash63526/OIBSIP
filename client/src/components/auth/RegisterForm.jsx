import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  LockClosedIcon, 
  EyeIcon, 
  EyeSlashIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline';

const schema = yup.object().shape({
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().min(10, 'Invalid phone number').required('Phone number is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  agreeTerms: yup.boolean().oneOf([true], 'You must agree to the Terms & Conditions').required('You must agree to the Terms & Conditions'),
});

const RegisterForm = ({ onSubmit, isLoading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      agreeTerms: false
    }
  });

  return (
    <div className="space-y-6">
      {/* Header Titles */}
      <div className="space-y-2">
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-[1.1]">
          Create your <br />
          <span className="text-[#E33E23] italic font-serif font-black tracking-normal">account</span>
        </h1>
        <p className="text-gray-500 text-sm font-semibold tracking-wide flex flex-col items-start">
          Join us and enjoy the best pizzas in town!
          {/* Decorative Squiggly Underline SVG */}
          <svg className="w-24 h-2 text-[#E33E23] mt-1" viewBox="0 0 100 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 5C20 5 10 2 30 2C50 2 40 8 60 8C80 8 70 5 100 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="space-y-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Full Name"
                className={`block w-full pl-11 pr-4 py-3.5 border ${
                  errors.name ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:ring-red-500/10'
                } rounded-2xl bg-white text-gray-900 placeholder-gray-400 text-sm font-semibold focus:outline-none focus:ring-4 transition-all`}
                {...register('name')}
              />
            </div>
            {errors.name && <p className="text-xs font-bold text-red-600 pl-2 mt-1">{errors.name.message}</p>}
          </div>

          {/* Email Address */}
          <div className="space-y-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                className={`block w-full pl-11 pr-4 py-3.5 border ${
                  errors.email ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:ring-red-500/10'
                } rounded-2xl bg-white text-gray-900 placeholder-gray-400 text-sm font-semibold focus:outline-none focus:ring-4 transition-all`}
                {...register('email')}
              />
            </div>
            {errors.email && <p className="text-xs font-bold text-red-600 pl-2 mt-1">{errors.email.message}</p>}
          </div>
        </div>

        {/* Phone Number */}
        <div className="space-y-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <PhoneIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              placeholder="Phone Number"
              className={`block w-full pl-11 pr-4 py-3.5 border ${
                errors.phone ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:ring-red-500/10'
              } rounded-2xl bg-white text-gray-900 placeholder-gray-400 text-sm font-semibold focus:outline-none focus:ring-4 transition-all`}
              {...register('phone')}
            />
          </div>
          {errors.phone && <p className="text-xs font-bold text-red-600 pl-2 mt-1">{errors.phone.message}</p>}
        </div>

        {/* Password */}
        <div className="space-y-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <LockClosedIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className={`block w-full pl-11 pr-12 py-3.5 border ${
                errors.password ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:ring-red-500/10'
              } rounded-2xl bg-white text-gray-900 placeholder-gray-400 text-sm font-semibold focus:outline-none focus:ring-4 transition-all`}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && <p className="text-xs font-bold text-red-600 pl-2 mt-1">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <LockClosedIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              className={`block w-full pl-11 pr-12 py-3.5 border ${
                errors.confirmPassword ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:ring-red-500/10'
              } rounded-2xl bg-white text-gray-900 placeholder-gray-400 text-sm font-semibold focus:outline-none focus:ring-4 transition-all`}
              {...register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-xs font-bold text-red-600 pl-2 mt-1">{errors.confirmPassword.message}</p>}
        </div>

        {/* Terms & Conditions Checkbox */}
        <div className="space-y-1">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              className="h-5 w-5 rounded border-gray-300 text-[#E33E23] focus:ring-[#E33E23]/20 accent-[#E33E23]"
              {...register('agreeTerms')}
            />
            <span className="text-xs sm:text-sm font-semibold text-gray-500">
              I agree to the <a href="/terms" className="text-[#E33E23] hover:underline font-bold">Terms & Conditions</a>
            </span>
          </label>
          {errors.agreeTerms && <p className="text-xs font-bold text-red-600 pl-2 mt-1">{errors.agreeTerms.message}</p>}
        </div>

        {/* Sign Up Action Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#E33E23] hover:bg-[#c93219] disabled:bg-[#f07d6b] text-white py-3.5 px-6 rounded-2xl font-extrabold text-base flex items-center justify-between shadow-lg shadow-red-500/15 hover:shadow-red-500/25 active:scale-[0.98] transition-all duration-200"
        >
          <span>{isLoading ? 'Signing Up...' : 'Sign Up'}</span>
          <div className="bg-white rounded-full p-1.5 flex items-center justify-center shadow-md">
            <ArrowRightIcon className="h-4 w-4 text-[#E33E23] stroke-[3]" />
          </div>
        </button>
      </form>

      {/* Divider */}
      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200/80"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase font-extrabold">
          <span className="bg-[#FAF9F6] px-4 text-gray-400 border border-gray-100 shadow-sm py-1.5 rounded-full">OR</span>
        </div>
      </div>

      {/* Social Logins */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          className="flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-2xl bg-white hover:bg-gray-50 active:scale-[0.99] transition-all font-bold text-gray-700 text-sm shadow-sm"
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="h-5 w-5" />
          <span>Google</span>
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-2xl bg-white hover:bg-gray-50 active:scale-[0.99] transition-all font-bold text-gray-700 text-sm shadow-sm"
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" alt="Facebook" className="h-5 w-5" />
          <span>Facebook</span>
        </button>
      </div>

      {/* Login Navigation footer */}
      <div className="text-center text-sm font-semibold text-gray-500">
        Already have an account?{' '}
        <Link to="/login" className="text-[#E33E23] hover:underline font-bold">
          Login
        </Link>
      </div>
    </div>
  );
};

export default RegisterForm;
