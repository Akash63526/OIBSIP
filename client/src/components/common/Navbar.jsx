import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Read actual cart quantity dynamically from the Redux store
  const { items } = useSelector((state) => state.cart);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const { isAuthenticated, user } = useSelector((state) => state.auth); 

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-[72px] items-center">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.jpg" alt="SliceSprint Logo" className="h-10 w-auto object-contain rounded-md" />
              <span className="text-[22px] font-black text-gray-900 tracking-tight leading-none">
                Slice<span className="text-[#FF6B00]">Sprint</span>
              </span>
            </Link>
          </div>
          
          {/* Centered Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`relative text-sm font-bold pb-1 ${currentPath === '/' ? 'text-[#FF6B00]' : 'text-gray-600 hover:text-[#FF6B00] transition-colors'}`}>
              Home
              {currentPath === '/' && <div className="absolute bottom-[-6px] left-0 right-0 h-[3px] bg-[#FF6B00] rounded-t-full"></div>}
            </Link>
            
            <Link to="/menu" className={`relative text-sm font-bold pb-1 ${currentPath === '/menu' ? 'text-[#FF6B00]' : 'text-gray-600 hover:text-[#FF6B00] transition-colors'}`}>
              Menu
              {currentPath === '/menu' && <div className="absolute bottom-[-6px] left-0 right-0 h-[3px] bg-[#FF6B00] rounded-t-full"></div>}
            </Link>
            
            <Link to="/offers" className="relative text-sm font-bold text-gray-600 hover:text-[#FF6B00] transition-colors flex items-center">
              Offers
              <span className="absolute -top-3.5 -right-6 bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider shadow-sm scale-90">New</span>
            </Link>
            
            <Link to="/about" className="text-sm font-bold text-gray-600 hover:text-[#FF6B00] transition-colors">
              About Us
            </Link>
            
            <Link to="/delivery" className="text-sm font-bold text-gray-600 hover:text-[#FF6B00] transition-colors">
              Delivery
            </Link>

            <Link to="/contact" className="text-sm font-bold text-gray-600 hover:text-[#FF6B00] transition-colors">
              Contact
            </Link>
          </div>
          
          {/* Right Section: Cart & User */}
          <div className="flex items-center space-x-6">
            
            <Link to="/cart" className="relative text-gray-700 hover:text-[#FF6B00] transition-colors">
              <ShoppingBagIcon className="h-6 w-6" strokeWidth={2} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 flex items-center justify-center h-[18px] w-[18px] text-[10px] font-black text-white bg-[#FF6B00] rounded-full ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated && user ? (
              <div className="flex items-center gap-4">
                {user.role === 'admin' && (
                  <Link 
                    to="/admin/settings" 
                    className="hidden sm:inline-block bg-orange-50 text-[#FF6B00] hover:bg-orange-100/80 px-4 py-2 rounded-xl text-xs font-black transition-colors"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <Link to="/profile" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                  <div className="h-8 w-8 rounded-full overflow-hidden border border-gray-200 bg-orange-100 flex items-center justify-center">
                    <img 
                      src={user.avatar || 'https://img.freepik.com/premium-vector/vector-3d-boy-icon-cute-3d-cartoon-boy-design_984027-313.jpg'} 
                      alt={user.name} 
                      className="h-full w-full object-cover" 
                      onError={(e) => {
                        e.target.src = "https://i.pravatar.cc/150?img=11";
                      }}
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-800 flex items-center gap-0.5">
                    Hi, {user.name.split(' ')[0]} <span className="text-xs text-gray-400 font-black">▼</span>
                  </span>
                </Link>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="bg-[#FF6B00] hover:bg-[#e66000] text-white px-5 py-2 rounded-full font-black text-sm transition-all"
              >
                Login
              </Link>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
