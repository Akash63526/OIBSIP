import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
import { 
  Bars3Icon, 
  MagnifyingGlassIcon, 
  BellIcon, 
  Cog6ToothIcon, 
  ChevronDownIcon 
} from '@heroicons/react/24/outline';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-6 sticky top-0 z-20">
      {/* Left side: Burger & Search */}
      <div className="flex items-center gap-4 flex-1">
        <button className="text-gray-500 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-50 transition-colors">
          <Bars3Icon className="h-6 w-6" />
        </button>
        
        {/* Search Bar */}
        <div className="relative w-full max-w-md">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
            <MagnifyingGlassIcon className="h-5 w-5" />
          </span>
          <input
            type="text"
            placeholder="Search ingredients, categories..."
            className="w-full bg-[#F8FAFC] text-sm text-gray-700 pl-10 pr-4 py-2 rounded-xl border border-gray-100 focus:outline-none focus:border-orange-500 focus:bg-white transition-all placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Right side: Bell, Cog, Profile */}
      <div className="flex items-center gap-5">
        {/* Notifications */}
        <button className="text-gray-500 hover:text-orange-500 relative p-1.5 rounded-lg hover:bg-gray-50 transition-all group">
          <BellIcon className="h-6 w-6" />
          <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-[#FF4C00] text-[10px] font-bold text-white rounded-full flex items-center justify-center animate-pulse">
            3
          </span>
        </button>

        {/* Settings Cog */}
        <button 
          onClick={() => navigate('/admin/settings')}
          className="text-gray-500 hover:text-orange-500 p-1.5 rounded-lg hover:bg-gray-50 transition-all hover:rotate-45"
        >
          <Cog6ToothIcon className="h-6 w-6" />
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-200"></div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1 rounded-full hover:bg-gray-50 transition-colors text-left focus:outline-none"
          >
            <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200 shadow-sm bg-orange-100 flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop" 
                alt="Admin Avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <div className="hidden md:flex items-center gap-1">
              <span className="text-sm font-semibold text-gray-800">Admin</span>
              <ChevronDownIcon className="h-3.5 w-3.5 text-gray-500" />
            </div>
          </button>

          {/* Profile Menu Dropdown Card */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-50 py-2 z-30 animate-in fade-in slide-in-from-top-3 duration-200">
              <div className="px-4 py-2 border-b border-gray-50">
                <p className="text-xs text-gray-400">Signed in as</p>
                <p className="text-sm font-semibold text-gray-800 truncate">{user?.email || 'admin@slicesprint.com'}</p>
              </div>
              <button 
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate('/admin/settings');
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
              >
                Account Settings
              </button>
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
