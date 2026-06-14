import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Toast from '../ui/Toast';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [toast, setToast] = useState(null);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setToast('Please enter a valid email address.');
      return;
    }
    setToast('Subscription successful! Enjoy exclusive SliceSprint deals.');
    setEmail('');
  };

  return (
    <footer className="bg-[#0B0F19] text-[#94A3B8] pt-16 pb-8 font-sans border-t border-gray-900 mt-16 text-left w-full select-none">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Row 1: 5 Columns Grid matching screenshot layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12 border-b border-gray-900 pb-12">
          
          {/* Column 1: Brand & Description (Colspan 3) */}
          <div className="lg:col-span-3 space-y-5 text-left">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-3xl">🍕</span>
              <span className="text-[22px] font-black text-white tracking-tight leading-none">
                Slice<span className="text-[#FF6B00]">Sprint</span>
              </span>
            </Link>
            
            <h5 className="text-[11px] font-black text-[#FF6B00] uppercase tracking-wider leading-none">
              FAST. FRESH. DELIVERED HOT.
            </h5>
            
            <p className="text-gray-400 text-[13.5px] leading-relaxed font-bold max-w-xs">
              Serving delicious pizzas, sides, desserts, drinks and fast doorstep delivery.
            </p>
            
            {/* Social Icons - Rounded Squares matching screenshot */}
            <div className="flex gap-2 pt-2">
              {/* Facebook */}
              <a href="#" className="w-10 h-10 border border-gray-800 bg-[#090C14] hover:border-[#FF6B00]/40 rounded-xl flex items-center justify-center transition-all group">
                <svg className="w-5 h-5 text-[#1877F2] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                </svg>
              </a>
              {/* Instagram */}
              <a href="#" className="w-10 h-10 border border-gray-800 bg-[#090C14] hover:border-[#FF6B00]/40 rounded-xl flex items-center justify-center transition-all group">
                <svg className="w-5 h-5 text-[#E1306C] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
              </a>
              {/* X / Twitter */}
              <a href="#" className="w-10 h-10 border border-gray-800 bg-[#090C14] hover:border-[#FF6B00]/40 rounded-xl flex items-center justify-center transition-all group">
                <svg className="w-4 h-4 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              {/* Pinterest */}
              <a href="#" className="w-10 h-10 border border-gray-800 bg-[#090C14] hover:border-[#FF6B00]/40 rounded-xl flex items-center justify-center transition-all group">
                <svg className="w-5 h-5 text-[#BD081C] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.966 1.406-5.966s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.493 0-2.873-2.064-4.882-5.005-4.882-3.409 0-5.41 2.556-5.41 5.202 0 1.03.397 2.133.893 2.734a.385.385 0 0 1 .09.373c-.098.408-.316 1.286-.359 1.465a.315.315 0 0 1-.299.21c-2.203-1.026-3.578-4.256-3.578-6.85 0-5.578 4.053-10.704 11.682-10.704 6.132 0 10.899 4.37 10.899 10.213 0 6.096-3.844 11.002-9.18 11.002-1.792 0-3.479-.931-4.056-2.03l-1.107 4.222c-.4 1.527-1.488 3.44-2.217 4.62C10.512 23.903 11.252 24 12.017 24 18.638 24 24 18.631 24 12.012 24 5.391 18.638 0 12.017 0z"/>
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="#" className="w-10 h-10 border border-gray-800 bg-[#090C14] hover:border-[#FF6B00]/40 rounded-xl flex items-center justify-center transition-all group">
                <svg className="w-5 h-5 text-[#0A66C2] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links (Colspan 2) */}
          <div className="lg:col-span-2 text-left">
            <h4 className="font-black text-white text-[13.5px] tracking-widest uppercase mb-6">
              QUICK LINKS
            </h4>
            <ul className="space-y-3.5 text-[13px] font-extrabold text-gray-400">
              <li><Link to="/" className="hover:text-[#FF6B00] transition-colors">Home</Link></li>
              <li><Link to="/menu" className="hover:text-[#FF6B00] transition-colors">Menu</Link></li>
              <li><Link to="/offers" className="hover:text-[#FF6B00] transition-colors">Offers</Link></li>
              <li><Link to="/orders" className="hover:text-[#FF6B00] transition-colors">Track Order</Link></li>
              <li><Link to="/about" className="hover:text-[#FF6B00] transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-[#FF6B00] transition-colors">Contact Us</Link></li>
              <li><Link to="/login" className="hover:text-[#FF6B00] transition-colors">Login / Register</Link></li>
              <li><Link to="/cart" className="hover:text-[#FF6B00] transition-colors">Cart</Link></li>
            </ul>
          </div>

          {/* Column 3: Explore Menu (Colspan 2) */}
          <div className="lg:col-span-2 text-left">
            <h4 className="font-black text-white text-[13.5px] tracking-widest uppercase mb-6">
              EXPLORE MENU
            </h4>
            <ul className="space-y-3.5 text-[13px] font-extrabold text-gray-400">
              <li><Link to="/menu" className="hover:text-[#FF6B00] transition-colors">Veg Pizza</Link></li>
              <li><Link to="/menu" className="hover:text-[#FF6B00] transition-colors">Non-Veg Pizza</Link></li>
              <li><Link to="/menu" className="hover:text-[#FF6B00] transition-colors">Garlic Bread</Link></li>
              <li><Link to="/menu" className="hover:text-[#FF6B00] transition-colors">Sides</Link></li>
              <li><Link to="/menu" className="hover:text-[#FF6B00] transition-colors">Pasta</Link></li>
              <li><Link to="/menu" className="hover:text-[#FF6B00] transition-colors">Desserts</Link></li>
              <li><Link to="/menu" className="hover:text-[#FF6B00] transition-colors">Beverages</Link></li>
              <li><Link to="/build-pizza" className="hover:text-[#FF6B00] transition-colors">Build Your Own Pizza</Link></li>
            </ul>
          </div>

          {/* Column 4: Customer Support (Colspan 2) */}
          <div className="lg:col-span-2 text-left">
            <h4 className="font-black text-white text-[13.5px] tracking-widest uppercase mb-6">
              CUSTOMER SUPPORT
            </h4>
            <ul className="space-y-3.5 text-[13px] font-extrabold text-gray-400">
              <li><Link to="/delivery" className="hover:text-[#FF6B00] transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-[#FF6B00] transition-colors">Help Center</Link></li>
              <li><Link to="/delivery" className="hover:text-[#FF6B00] transition-colors">Refund Policy</Link></li>
              <li><Link to="/delivery" className="hover:text-[#FF6B00] transition-colors">Cancellation Policy</Link></li>
              <li><Link to="/delivery" className="hover:text-[#FF6B00] transition-colors">Delivery Policy</Link></li>
              <li><Link to="/delivery" className="hover:text-[#FF6B00] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/delivery" className="hover:text-[#FF6B00] transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Column 5: Contact Info with custom rounded square containers (Colspan 3) */}
          <div className="lg:col-span-3 text-left space-y-4">
            <h4 className="font-black text-white text-[13.5px] tracking-widest uppercase mb-6">
              CONTACT US
            </h4>
            
            <div className="space-y-4 text-[13px] font-extrabold text-gray-400">
              {/* Phone */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl border border-gray-800 bg-[#090C14] flex items-center justify-center text-[#FF6B00] flex-shrink-0 shadow-inner">
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                </div>
                <div>
                  <span className="block text-gray-300 font-extrabold leading-none mb-1">+91 98765 43210</span>
                  <span className="block text-gray-300 font-extrabold leading-none">+91 98765 43211</span>
                </div>
              </div>
              
              {/* Email */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl border border-gray-800 bg-[#090C14] flex items-center justify-center text-[#FF6B00] flex-shrink-0 shadow-inner">
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div>
                  <span className="block text-gray-300 font-extrabold leading-none mb-1 truncate max-w-[170px] xl:max-w-none">support@slicesprint.com</span>
                  <span className="block text-gray-300 font-extrabold leading-none truncate max-w-[170px] xl:max-w-none">orders@slicesprint.com</span>
                </div>
              </div>
              
              {/* Address */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl border border-gray-800 bg-[#090C14] flex items-center justify-center text-[#FF6B00] flex-shrink-0 shadow-inner">
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
                <div>
                  <span className="block text-gray-300 font-extrabold leading-none mb-0.5">Surat, Gujarat</span>
                  <span className="block text-gray-300 font-extrabold leading-none">India</span>
                </div>
              </div>
              
              {/* Timings */}
              <div className="flex items-center gap-3 pt-1">
                <div className="w-10 h-10 rounded-xl border border-gray-800 bg-[#090C14] flex items-center justify-center text-[#FF6B00] flex-shrink-0 shadow-inner">
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <span className="text-gray-500 text-[10px] block uppercase leading-none font-black tracking-wider mb-1">Delivery Time</span>
                  <span className="text-white text-[12.5px] font-black leading-normal">10 AM - 11 PM</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Row 2: Newsletter + App Downloads + Cities matching screenshot exactly */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-gray-900 pb-12 mb-10 text-left">
          
          {/* Newsletter Box (Colspan 4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🍕</span>
              <div className="text-left">
                <h4 className="text-sm font-black text-white tracking-tight leading-none mb-1">Get Exclusive Pizza Offers</h4>
                <p className="text-xs text-gray-500 font-bold">Subscribe for amazing deals and latest updates</p>
              </div>
            </div>
            
            {/* Split Input & Button to match size and heights exactly */}
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm w-full">
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#090C14] border border-gray-800 rounded-xl px-4 py-3 text-xs font-extrabold text-white placeholder-gray-600 outline-none focus:border-orange-500/50 w-full"
              />
              <button 
                type="submit"
                className="bg-[#FF6B00] hover:bg-[#e66000] text-white px-5 py-3 rounded-xl font-black text-xs shadow-md hover:shadow-orange-500/15 active:scale-95 transition-all flex-shrink-0"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* App download badges (Colspan 4) */}
          <div className="lg:col-span-4 text-center lg:text-left space-y-3.5 pl-0 lg:pl-4">
            <h5 className="text-[11.5px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">DOWNLOAD SLICESPRINT APP</h5>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              {/* Google Play */}
              <a href="#" className="bg-[#090C14] border border-gray-800 hover:border-orange-500/30 rounded-xl px-4.5 py-2.5 flex items-center gap-2.5 hover:scale-[1.02] transition-all shadow-inner">
                <svg className="w-6 h-6 text-[#A4C639]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3.609 1.814L13.782 12 3.609 22.186A2.25 2.25 0 0 1 3 20.59V3.41c0-.655.281-1.246.609-1.596zm11.291 9.068l2.918-1.687L6.727 3.03l8.173 7.852zm3.896.592c.602-.348.602-.916 0-1.264l-2.457-1.421-2.613 2.51 2.613 2.51 2.457-1.421-.001-.014zm-3.896 1.844L6.727 20.97l11.091-6.165-2.918-1.687z"/>
                </svg>
                <div className="text-left">
                  <span className="text-[9px] font-black text-gray-500 block leading-none mb-0.5">GET IT ON</span>
                  <span className="text-xs font-black text-white leading-normal">Google Play</span>
                </div>
              </a>
              {/* App Store */}
              <a href="#" className="bg-[#090C14] border border-gray-800 hover:border-orange-500/30 rounded-xl px-4.5 py-2.5 flex items-center gap-2.5 hover:scale-[1.02] transition-all shadow-inner">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.26-.57 2.95-1.39z"/>
                </svg>
                <div className="text-left">
                  <span className="text-[9px] font-black text-gray-500 block leading-none mb-0.5">Download on the</span>
                  <span className="text-xs font-black text-white leading-normal">App Store</span>
                </div>
              </a>
            </div>
          </div>

          {/* We deliver in (Colspan 4) */}
          <div className="lg:col-span-4 text-center lg:text-left space-y-3 pl-0 lg:pl-10">
            <h5 className="text-[11.5px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">WE DELIVER IN</h5>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-[13.5px] font-black tracking-wide">
              <span className="text-white hover:text-[#FF6B00] cursor-pointer transition-colors">Surat</span>
              <span className="text-[#FF6B00]">•</span>
              <span className="text-white hover:text-[#FF6B00] cursor-pointer transition-colors">Ahmedabad</span>
              <span className="text-[#FF6B00]">•</span>
              <span className="text-white hover:text-[#FF6B00] cursor-pointer transition-colors">Vadodara</span>
              <span className="text-[#FF6B00]">•</span>
              <span className="text-white hover:text-[#FF6B00] cursor-pointer transition-colors">Rajkot</span>
            </div>
          </div>

        </div>

        {/* Row 3: 4 Visual Golden trust badges matching screenshot exactly */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 border-b border-gray-900 pb-12">
          
          {/* Badge 1: Secure Checkout */}
          <div className="bg-[#090C14] border border-gray-800/80 rounded-3xl p-5 flex items-center gap-4 shadow-inner">
            <div className="h-12 w-12 rounded-2xl bg-[#0B0F19] flex items-center justify-center text-xl flex-shrink-0 border border-gray-800">
              <svg className="w-6 h-6 text-[#FF6B00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <div>
              <span className="text-[13.5px] font-black text-white block leading-tight mb-0.5">Secure Checkout</span>
              <span className="text-[11.5px] font-bold text-gray-500">100% Safe Payments</span>
            </div>
          </div>

          {/* Badge 2: Fresh Ingredients */}
          <div className="bg-[#090C14] border border-gray-800/80 rounded-3xl p-5 flex items-center gap-4 shadow-inner">
            <div className="h-12 w-12 rounded-2xl bg-[#0B0F19] flex items-center justify-center text-xl flex-shrink-0 border border-gray-800">
              <svg className="w-6 h-6 text-[#FF6B00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.907a1 1 0 00.95-.69l1.519-4.674z"/>
              </svg>
            </div>
            <div>
              <span className="text-[13.5px] font-black text-white block leading-tight mb-0.5">Fresh Ingredients</span>
              <span className="text-[11.5px] font-bold text-gray-500">Premium Quality</span>
            </div>
          </div>

          {/* Badge 3: Fast Delivery */}
          <div className="bg-[#090C14] border border-gray-800/80 rounded-3xl p-5 flex items-center gap-4 shadow-inner">
            <div className="h-12 w-12 rounded-2xl bg-[#0B0F19] flex items-center justify-center text-xl flex-shrink-0 border border-gray-800">
              <svg className="w-6 h-6 text-[#FF6B00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.75a1.125 1.125 0 01-1.125-1.125V14.25m0 0h4.875c.621 0 1.125-.504 1.125-1.125V11.25c0-.621-.504-1.125-1.125-1.125H2.625M2.625 11.25V9a1.125 1.125 0 011.125-1.125h8.25M16.5 13.5v-3.75m0 3.75a1.5 1.5 0 01-3 0m3 0h3.008a1.125 1.125 0 001.123-1.012l.742-6.68A1.125 1.125 0 0017.25 4.5H16.5m-3 9V10.5m-9 3.75h1.125c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.75"/>
              </svg>
            </div>
            <div>
              <span className="text-[13.5px] font-black text-white block leading-tight mb-0.5">Fast Delivery</span>
              <span className="text-[11.5px] font-bold text-gray-500">On Time, Every Time</span>
            </div>
          </div>

          {/* Badge 4: Trusted Service */}
          <div className="bg-[#090C14] border border-gray-800/80 rounded-3xl p-5 flex items-center gap-4 shadow-inner">
            <div className="h-12 w-12 rounded-2xl bg-[#0B0F19] flex items-center justify-center text-xl flex-shrink-0 border border-gray-800">
              <svg className="w-6 h-6 text-[#FF6B00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </div>
            <div>
              <span className="text-[13.5px] font-black text-white block leading-tight mb-0.5">Trusted Service</span>
              <span className="text-[11.5px] font-bold text-gray-500">Loved by Thousands</span>
            </div>
          </div>

        </div>

        {/* Row 4: Copyright and bottom legal links matching bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left text-xs font-black text-gray-500">
          <p className="tracking-wide">
            &copy; 2026 SliceSprint. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/delivery" className="hover:text-[#FF6B00] transition-colors">Privacy Policy</Link>
            <span className="text-gray-800">|</span>
            <Link to="/delivery" className="hover:text-[#FF6B00] transition-colors">Terms & Conditions</Link>
          </div>
        </div>

      </div>
      {toast && <Toast message={toast} type="success" onClose={() => setToast(null)} />}
    </footer>
  );
};

export default Footer;
