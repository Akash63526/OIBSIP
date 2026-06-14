import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link, useLocation } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import Toast from '../../components/ui/Toast';
import { 
  EnvelopeIcon, 
  LinkIcon, 
  CheckCircleIcon,
  ClockIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('pending'); // pending, loading, success, error
  const [message, setMessage] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [toast, setToast] = useState(null);

  // We can get the user's email if passed via state from RegisterPage, otherwise fallback
  const userEmail = location.state?.email || 'john.doe@email.com';

  useEffect(() => {
    // If there is a token in the URL, the user clicked the link in their email
    if (token) {
      verifyToken(token);
    }
  }, [token]);

  const verifyToken = async (verificationToken) => {
    setStatus('loading');
    try {
      await authApi.verifyEmail(verificationToken);
      setStatus('success');
      setToast({ message: 'Email Verified Successfully!', type: 'success' });
      // Redirect to login after 3 seconds
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Email verification failed. The link may have expired.');
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      // Assuming you have a resend API endpoint, e.g. authApi.resendVerification(userEmail)
      // await authApi.resendVerification(userEmail);
      
      // Simulating network request for visual effect
      await new Promise(resolve => setTimeout(resolve, 1500));
      setToast({ message: 'A new verification link has been sent to your email.', type: 'success' });
    } catch (error) {
      setToast({ message: 'Failed to resend verification email.', type: 'error' });
    } finally {
      setIsResending(false);
    }
  };

  // If token is present and we are loading, or success, or error, show a simpler state
  // But for the exact design matching the image, it is the "Pending" state
  if (status === 'loading') {
    return (
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center relative z-10 min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E33E23]"></div>
        <p className="mt-6 text-gray-600 font-semibold text-lg animate-pulse">Verifying your email securely...</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="w-full max-w-md mx-auto flex flex-col items-center relative z-10 w-full text-center">
        <div className="bg-white rounded-[2rem] p-10 shadow-xl border border-gray-100 w-full flex flex-col items-center">
          <div className="bg-green-100 p-4 rounded-full mb-6">
            <CheckCircleIcon className="w-16 h-16 text-green-500" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Email Verified!</h2>
          <p className="text-gray-500 mb-8 font-medium leading-relaxed">Thank you for verifying your email address. Your account is now fully active.</p>
          <Link to="/login" className="w-full">
            <button className="w-full bg-[#E33E23] hover:bg-[#c93219] text-white py-4 px-6 rounded-2xl font-extrabold text-base shadow-lg transition-all duration-200">
              Continue to Login
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="w-full max-w-md mx-auto flex flex-col items-center relative z-10 w-full text-center">
        <div className="bg-white rounded-[2rem] p-10 shadow-xl border border-gray-100 w-full flex flex-col items-center">
          <div className="bg-red-50 p-4 rounded-full mb-6">
            <svg className="w-16 h-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Verification Failed</h2>
          <p className="text-gray-500 mb-8 font-medium leading-relaxed">{message}</p>
          <button onClick={() => setStatus('pending')} className="w-full bg-[#E33E23] hover:bg-[#c93219] text-white py-4 px-6 rounded-2xl font-extrabold text-base shadow-lg transition-all duration-200">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Pending State (Exact Match of User's Reference Image)
  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center relative z-10 w-full">
      {/* Decorative SVG elements */}
      <div className="absolute inset-0 pointer-events-none overflow-visible flex justify-center items-center">
        <div className="absolute -left-12 top-40 w-16 h-16 bg-red-500 rounded-full blur-[2px] opacity-10 animate-pulse"></div>
        <div className="absolute -right-8 bottom-32 w-12 h-12 bg-green-500 rounded-full blur-[2px] opacity-10 animate-bounce"></div>
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
          Verify Your <span className="text-[#E33E23]">Email</span>
        </h1>
        <p className="text-gray-600 text-[15px] font-medium tracking-wide mx-auto leading-relaxed">
          We've sent a verification link to <br/>
          <span className="text-[#E33E23] font-bold">{userEmail}</span>
        </p>
      </div>

      {/* 3D Envelope Illustration */}
      <div className="relative w-72 h-56 mb-8 z-10 flex justify-center items-center drop-shadow-xl hover:-translate-y-2 transition-transform duration-500">
        <img src="/verify_envelope.png" alt="Email Verification Envelope" className="w-full h-full object-contain" />
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] w-full border border-gray-100 z-10">
        
        {/* Stepper Process */}
        <div className="flex items-start justify-between w-full mb-8 relative">
          
          {/* Step 1 */}
          <div className="flex flex-col items-center w-1/3 relative z-10">
            <div className="w-14 h-14 rounded-full bg-orange-50 border-2 border-orange-100 flex items-center justify-center mb-3">
              <EnvelopeIcon className="w-6 h-6 text-[#E33E23]" />
            </div>
            <div className="w-5 h-5 rounded-full border border-[#E33E23] text-[#E33E23] text-[10px] font-bold flex items-center justify-center mb-2 bg-white">1</div>
            <p className="text-xs font-semibold text-gray-700 text-center leading-tight">Check<br/>your inbox</p>
          </div>

          {/* Connection Line 1 */}
          <div className="absolute top-7 left-[22%] w-[22%] border-t border-dashed border-gray-300 z-0"></div>
          {/* Small arrow head for line 1 */}
          <div className="absolute top-[25.5px] left-[42%] w-1.5 h-1.5 border-t border-r border-gray-300 transform rotate-45 z-0"></div>

          {/* Step 2 */}
          <div className="flex flex-col items-center w-1/3 relative z-10">
            <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mb-3">
              <LinkIcon className="w-6 h-6 text-gray-700" />
            </div>
            <div className="w-5 h-5 rounded-full border border-[#E33E23] text-[#E33E23] text-[10px] font-bold flex items-center justify-center mb-2 bg-white">2</div>
            <p className="text-xs font-semibold text-gray-700 text-center leading-tight">Click on the<br/>verification link</p>
          </div>

          {/* Connection Line 2 */}
          <div className="absolute top-7 right-[22%] w-[22%] border-t border-dashed border-gray-300 z-0"></div>
          {/* Small arrow head for line 2 */}
          <div className="absolute top-[25.5px] right-[22%] w-1.5 h-1.5 border-t border-r border-gray-300 transform rotate-45 z-0"></div>

          {/* Step 3 */}
          <div className="flex flex-col items-center w-1/3 relative z-10">
            <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center mb-3 shadow-md shadow-green-500/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="w-5 h-5 rounded-full border border-[#E33E23] text-[#E33E23] text-[10px] font-bold flex items-center justify-center mb-2 bg-white">3</div>
            <p className="text-xs font-semibold text-gray-700 text-center leading-tight">Verify and start<br/>exploring SliceSprint</p>
          </div>
        </div>

        {/* Expiry Notice */}
        <div className="bg-[#FFF8F0] border border-[#FFE4C4] rounded-2xl p-4 flex items-center gap-4 mb-6">
          <div className="bg-transparent rounded-full flex-shrink-0">
            <ClockIcon className="h-6 w-6 text-[#E33E23]" />
          </div>
          <p className="text-sm text-gray-700 font-medium leading-relaxed">
            The link will expire in 24 hours.<br/>
            <span className="text-gray-500">Didn't receive the email?</span>
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={handleResend}
          disabled={isResending}
          className="w-full bg-white border-2 border-[#E33E23] text-[#E33E23] hover:bg-orange-50 disabled:bg-gray-50 disabled:border-gray-200 disabled:text-gray-400 py-4 px-6 rounded-2xl font-extrabold text-base flex items-center justify-center gap-3 shadow-sm active:scale-[0.98] transition-all duration-200 mb-5"
        >
          <span>{isResending ? 'Resending...' : 'Resend Email'}</span>
          <ArrowPathIcon className={`h-5 w-5 stroke-[2.5] ${isResending ? 'animate-spin' : ''}`} />
        </button>

        {/* Navigation footer */}
        <div className="text-center">
          <Link to="/register" className="text-sm text-[#E33E23] hover:underline font-bold">
            Change Email Address
          </Link>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default VerifyEmailPage;
