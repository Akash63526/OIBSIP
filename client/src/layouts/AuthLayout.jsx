import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AuthLayout = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();
  const isLogin = location.pathname === '/login';
  const isForgotPassword = location.pathname === '/forgot-password';
  const isResetPassword = location.pathname === '/reset-password';
  const isVerifyEmail = location.pathname === '/verify-email';

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Centered full-screen layout for Forgot/Reset/Verify Password
  if (isForgotPassword || isResetPassword || isVerifyEmail) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-center items-center relative overflow-hidden text-gray-900 py-10 px-4">
        <Outlet />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex ${isLogin ? 'bg-[#12161A] text-white' : 'bg-[#FAF9F6] text-gray-900'}`}>
      {/* Dynamic layout ordering based on Login vs Register */}
      {isLogin ? (
        <>
          {/* Left Column: Chalkboard & Pizza Art Section (Login) */}
          <div className="hidden lg:block lg:w-[45%] relative bg-[#12161A]">
            <img 
              src="/chalkboard_pizza.png" 
              alt="SliceSprint Pizza Chalkboard" 
              className="absolute inset-0 w-full h-full object-cover select-none scale-x-[-1]"
            />
            {/* Dark overlay to match chalkboard perfectly */}
            <div className="absolute inset-0 bg-[#12161A] opacity-10 pointer-events-none"></div>
          </div>

          {/* Right Column: Dark Form Section (Login) */}
          <div className="w-full lg:w-[55%] flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-20 py-8 overflow-y-auto bg-[#12161A]">
            <div className="max-w-xl w-full mx-auto">
              {/* Logo */}
              <div className="flex items-center gap-2 mb-6">
                <img src="/logo.jpg" alt="SliceSprint Logo" className="h-12 w-auto object-contain rounded-md" />
                <div className="flex flex-col">
                  <span className="text-xl font-black text-white tracking-tight leading-none">SliceSprint</span>
                  <span className="text-[10px] font-bold text-red-500 tracking-widest uppercase mt-0.5">Pizza Delivery</span>
                </div>
              </div>
              
              <Outlet />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Left Column: Light Form Section (Register) */}
          <div className="w-full lg:w-[55%] flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-20 py-8 overflow-y-auto bg-[#FAF9F6]">
            <div className="max-w-xl w-full mx-auto">
              {/* Logo */}
              <div className="flex items-center gap-2 mb-6">
                <img src="/logo.jpg" alt="SliceSprint Logo" className="h-12 w-auto object-contain rounded-md" />
                <div className="flex flex-col">
                  <span className="text-xl font-black text-gray-900 tracking-tight leading-none">SliceSprint</span>
                  <span className="text-[10px] font-bold text-red-600 tracking-widest uppercase mt-0.5">Pizza Delivery</span>
                </div>
              </div>
              
              <Outlet />
            </div>
          </div>

          {/* Right Column: Chalkboard & Pizza Art Section (Register) */}
          <div className="hidden lg:block lg:w-[45%] relative bg-[#12161A]">
            <img 
              src="/chalkboard_pizza.png" 
              alt="SliceSprint Pizza Chalkboard" 
              className="absolute inset-0 w-full h-full object-cover select-none"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#FAF9F6] via-transparent to-transparent opacity-10 pointer-events-none"></div>
          </div>
        </>
      )}
    </div>
  );
};

export default AuthLayout;
