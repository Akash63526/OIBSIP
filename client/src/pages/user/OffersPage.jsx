import React, { useState } from 'react';
import Toast from '../../components/ui/Toast';

const ALL_COUPONS = [
  { 
    code: 'WELCOME20', 
    name: 'Welcome Offer', 
    discount: '20% OFF', 
    minOrder: '₹199', 
    validity: '31 Dec 2026', 
    description: 'Special discount on your first order.',
    categories: ['Top Offers', 'Limited Time'],
    bgClass: 'bg-emerald-50 border-emerald-100 text-emerald-950',
    btnClass: 'text-emerald-700 hover:bg-emerald-100',
    icon: '🌱',
    image: '/images/Coupons/welcome_offer.png'
  },
  { 
    code: 'FREEDELIVERY', 
    name: 'Free Delivery', 
    discount: 'Free Delivery', 
    minOrder: '₹299', 
    validity: '31 Dec 2026', 
    description: 'Enjoy free doorstep delivery on your orders.',
    categories: ['Delivery Offers', 'Top Offers'],
    bgClass: 'bg-amber-50 border-amber-100 text-amber-950',
    btnClass: 'text-amber-700 hover:bg-amber-100',
    icon: '🚚',
    image: '/images/Coupons/Free_delivery .png'
  },
  { 
    code: 'PIZZA30', 
    name: 'Pizza Discount', 
    discount: '30% OFF', 
    minOrder: '₹249', 
    validity: '31 Dec 2026', 
    description: 'Get a flat 30% discount on selected signature pizzas.',
    categories: ['Pizza Deals'],
    bgClass: 'bg-rose-50 border-rose-100 text-rose-950',
    btnClass: 'text-rose-700 hover:bg-rose-100',
    icon: '🍕',
    image: '/images/Signature_Veg_Pizzas/Margherita_Classic.jpg'
  },
  { 
    code: 'CHEESELOVER', 
    name: 'Cheese Lovers Deal', 
    discount: '25% OFF', 
    minOrder: '₹349', 
    validity: '31 Dec 2026', 
    description: 'Special 25% discount on all cheese burst pizzas.',
    categories: ['Pizza Deals', 'Top Offers'],
    bgClass: 'bg-orange-50 border-orange-100 text-orange-950',
    btnClass: 'text-orange-700 hover:bg-orange-100',
    icon: '🧀',
    image: '/images/Coupons/Cheese_lover.png'
  },
  { 
    code: 'COMBO499', 
    name: 'Super Combo Deal', 
    discount: '₹499 Combo', 
    minOrder: '₹499', 
    validity: '31 Dec 2026', 
    description: 'Pizza + Garlic Bread + Coke at a special price of ₹499.',
    categories: ['Combo Deals'],
    bgClass: 'bg-indigo-50 border-indigo-100 text-indigo-950',
    btnClass: 'text-indigo-700 hover:bg-indigo-100',
    icon: '🥤',
    image: '/images/Coupons/Combo_offer.png'
  },
  { 
    code: 'WEEKENDSALE', 
    name: 'Weekend Sale', 
    discount: '40% OFF', 
    minOrder: '₹400', 
    validity: 'Every Sat-Sun', 
    description: 'Mega weekend savings up to 40% OFF on all items.',
    categories: ['Limited Time', 'Top Offers'],
    bgClass: 'bg-red-50 border-red-100 text-red-950',
    btnClass: 'text-red-700 hover:bg-red-100',
    icon: '⚡',
    image: '/images/Coupons/Weekend_sale.png'
  },
  { 
    code: 'BUY1GET1', 
    name: 'Buy 1 Get 1 Free', 
    discount: 'BOGO Free', 
    minOrder: '2 Pizzas', 
    validity: '31 Dec 2026', 
    description: 'Buy one medium pizza and get the second free.',
    categories: ['Pizza Deals', 'Top Offers'],
    bgClass: 'bg-teal-50 border-teal-100 text-teal-950',
    btnClass: 'text-teal-700 hover:bg-teal-100',
    icon: '👯',
    image: '/images/Signature_Veg_Pizzas/Peppy_Paneer.jpg'
  },
  { 
    code: 'SUMMER20', 
    name: 'Summer Drinks Deal', 
    discount: '20% OFF', 
    minOrder: '₹199', 
    validity: '31 Aug 2026', 
    description: '20% OFF on all cold drinks and beverage combos.',
    categories: ['Seasonal Deals'],
    bgClass: 'bg-sky-50 border-sky-100 text-sky-950',
    btnClass: 'text-sky-700 hover:bg-sky-100',
    icon: '☀️',
    image: '/images/Beverages/Cold_Coffee.jpg'
  },
  { 
    code: 'MATCH20', 
    name: 'Match Day Special', 
    discount: '20% OFF', 
    minOrder: '₹199', 
    validity: 'Limited Time', 
    description: 'IPL and cricket match day discount code.',
    categories: ['Seasonal Deals', 'Limited Time'],
    bgClass: 'bg-violet-50 border-violet-100 text-violet-950',
    btnClass: 'text-violet-700 hover:bg-violet-100',
    icon: '🏏',
    image: '/images/Beverages/Pepsi.jpg'
  },
  { 
    code: 'NEWYEAR50', 
    name: 'New Year Offer', 
    discount: '₹50 OFF', 
    minOrder: '₹299', 
    validity: '31 Jan 2027', 
    description: 'Flat ₹50 OFF to celebrate the new year.',
    categories: ['Seasonal Deals', 'Festival Offers'],
    bgClass: 'bg-fuchsia-50 border-fuchsia-100 text-fuchsia-950',
    btnClass: 'text-fuchsia-700 hover:bg-fuchsia-100',
    icon: '🎉',
    image: '/images/Desserts/Choco_Lava_Cake.jpg'
  },
  { 
    code: 'LOVEPIZZA', 
    name: 'Valentine Special', 
    discount: '20% OFF', 
    minOrder: '₹199', 
    validity: '28 Feb 2027', 
    description: 'Couple heart-shaped pizza offer discount.',
    categories: ['Seasonal Deals', 'Limited Time'],
    bgClass: 'bg-pink-50 border-pink-100 text-pink-950',
    btnClass: 'text-pink-700 hover:bg-pink-100',
    icon: '💖',
    image: '/images/Signature_Veg_Pizzas/Cheese_n_Corn_Delight.jpg'
  },
  { 
    code: 'FESTIVE50', 
    name: 'Festival Special', 
    discount: '₹50 OFF', 
    minOrder: '₹299', 
    validity: '30 Nov 2026', 
    description: 'Flat ₹50 OFF to double your festive celebrations.',
    categories: ['Festival Offers'],
    bgClass: 'bg-yellow-50 border-yellow-100 text-yellow-950',
    btnClass: 'text-yellow-700 hover:bg-yellow-100',
    icon: '🪔',
    image: '/images/Signature_Veg_Pizzas/Farmhouse_Supreme.jpg'
  }
];

const FILTER_CATEGORIES = [
  'All Offers',
  'Pizza Deals',
  'Combo Deals',
  'Delivery Offers',
  'Seasonal Deals',
  'Festival Offers',
  'Limited Time',
  'Top Offers'
];

const OffersPage = () => {
  const [toast, setToast] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All Offers');
  const [redemptionCode, setRedemptionCode] = useState('');

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    localStorage.setItem('appliedCouponCode', code);
    setToast(`Coupon code "${code}" copied! It will be applied automatically in the Cart.`);
  };

  const handleApplyRedemption = (e) => {
    e.preventDefault();
    const cleanCode = redemptionCode.trim().toUpperCase();
    if (!cleanCode) {
      setToast('Please enter a coupon code.');
      return;
    }
    const found = ALL_COUPONS.find(c => c.code === cleanCode);
    if (found) {
      localStorage.setItem('appliedCouponCode', cleanCode);
      setToast(`Coupon "${cleanCode}" applied successfully! Go to Cart to see savings.`);
      setRedemptionCode('');
    } else {
      setToast(`Coupon code "${cleanCode}" not found. Try WELCOME20 or WEEKENDSALE.`);
    }
  };

  // Filter coupons dynamically
  const filteredCoupons = ALL_COUPONS.filter(coupon => {
    if (activeFilter === 'All Offers') return true;
    return coupon.categories.includes(activeFilter);
  });

  return (
    <div className="bg-white min-h-screen pb-20 font-sans w-full">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* 1. Page Hero Section matching screenshot visual specs */}
        <div className="relative bg-gradient-to-r from-[#FFF5F0] via-[#FFF9F6] to-[#FFF5F0] rounded-[2.5rem] p-8 sm:p-12 border border-orange-100/50 flex flex-col lg:flex-row items-center justify-between mb-8 shadow-[0_15px_40px_rgba(255,107,0,0.015)] overflow-hidden min-h-[360px]">
          
          {/* Hero Left Narrative */}
          <div className="w-full lg:w-[55%] text-left space-y-6 z-10">
            <h1 className="text-[34px] sm:text-[46px] font-black text-gray-900 leading-tight tracking-tight">
              Hot Deals, Fresh Slices, <br />
              <span className="text-[#FF6B00]">Bigger Savings!</span>
            </h1>
            
            <p className="text-gray-500 font-extrabold text-sm sm:text-base max-w-lg leading-relaxed">
              Grab exclusive SliceSprint pizza offers, combo deals, and seasonal discounts.
            </p>
            
            <div className="pt-2">
              <a 
                href="/menu"
                className="bg-[#FF6B00] hover:bg-[#e66000] text-white px-8 py-3.5 rounded-full font-black text-sm shadow-md shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-95 transition-all"
              >
                Order Now
              </a>
            </div>
          </div>
          
          {/* Hero Right Graphic */}
          <div className="w-full lg:w-[45%] flex items-center justify-center lg:justify-end relative mt-8 lg:mt-0 z-0">
            <div className="relative h-64 sm:h-72 w-full max-w-md overflow-visible flex items-center justify-end">
              <img 
                src="/images/Signature_Veg_Pizzas/Farmhouse_Supreme.jpg" 
                alt="SliceSprint Fresh Pizza and Toppings" 
                className="h-[95%] w-auto object-contain rounded-full shadow-2xl border-4 border-white rotate-6 animate-pulse"
              />
              <div className="absolute top-2 left-10 text-4xl select-none pointer-events-none">🍕</div>
              <div className="absolute bottom-6 right-2 text-3xl select-none pointer-events-none">✨</div>
              <div className="absolute top-1/2 left-2 text-2xl select-none pointer-events-none">🏷️</div>
            </div>
          </div>

        </div>

        {/* 2. Category Filter Strip */}
        <div className="w-full mb-10 border-t border-gray-100 pt-8 text-left">
          <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none">
            {FILTER_CATEGORIES.map((cat) => {
              const isActive = activeFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`whitespace-nowrap px-5 py-2 rounded-full text-[13px] font-black transition-all ${
                    isActive 
                      ? 'bg-[#FF6B00] text-white shadow-md shadow-orange-500/10' 
                      : 'bg-gray-100 hover:bg-gray-200/70 text-gray-600 font-bold'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Offers Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {filteredCoupons.map((coupon) => (
            <div 
              key={coupon.code}
              className={`border rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300 relative flex flex-col justify-between min-h-[360px] text-left group ${coupon.bgClass}`}
            >
              
              {/* Product visual crop */}
              <div className="h-32 w-full overflow-hidden relative bg-gray-50/20">
                <img 
                  src={coupon.image} 
                  alt={coupon.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-gray-900 font-black text-xs px-2.5 py-0.5 rounded-lg shadow-sm border border-gray-100/50">
                  {coupon.icon} {coupon.discount}
                </span>
              </div>

              {/* Text content details */}
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div className="space-y-1">
                  <h3 className="text-base font-black tracking-tight leading-snug">{coupon.name}</h3>
                  <p className="text-xs font-bold opacity-70 leading-normal">{coupon.description}</p>
                </div>

                <div className="space-y-3.5 pt-4">
                  
                  {/* Validity Info */}
                  <div className="flex justify-between items-center text-[11px] font-black opacity-60">
                    <span>Min. Order: {coupon.minOrder}</span>
                    <span>Valid: {coupon.validity}</span>
                  </div>

                  {/* Copy pill */}
                  <div className="flex items-center justify-between bg-white border border-gray-100/40 rounded-2xl p-2.5 shadow-sm">
                    <span className="text-[10px] font-black opacity-40 uppercase tracking-widest pl-1">Code:</span>
                    <span className="text-xs font-black select-all tracking-wide text-gray-900 uppercase pr-1">{coupon.code}</span>
                  </div>

                  {/* Copy Button */}
                  <button 
                    onClick={() => handleCopyCode(coupon.code)}
                    className="w-full bg-[#FF6B00] hover:bg-[#e66000] text-white py-3 rounded-2xl font-black text-xs active:scale-[0.98] transition-all shadow-sm hover:shadow-md"
                  >
                    Copy Coupon Code
                  </button>

                </div>
              </div>

            </div>
          ))}
        </div>

        {/* 4. Dual Section: Coupon Redemption + Loyalty Rewards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-100 pt-16 items-start">
          
          {/* Coupon redemption box */}
          <div className="bg-white border border-orange-100 rounded-3xl p-6 sm:p-8 text-left shadow-[0_15px_40px_rgba(255,107,0,0.015)]">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">🏷️</span>
              <div>
                <h4 className="text-base font-black text-gray-900 leading-tight">Have a Coupon Code?</h4>
                <p className="text-[12.5px] font-bold text-gray-400">Enter your custom coupon code below to activate savings</p>
              </div>
            </div>
            
            <form onSubmit={handleApplyRedemption} className="flex gap-2">
              <input 
                type="text" 
                placeholder="Enter coupon code (e.g. WEEKENDSALE)" 
                value={redemptionCode}
                onChange={(e) => setRedemptionCode(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-orange-100 outline-none text-gray-800 font-extrabold placeholder-gray-400 text-[13.5px]"
              />
              <button 
                type="submit"
                className="bg-[#FF6B00] hover:bg-[#e66000] text-white px-6 rounded-2xl font-black text-xs shadow-sm hover:shadow-orange-500/10 active:scale-95 transition-all flex-shrink-0"
              >
                Apply Coupon
              </button>
            </form>
          </div>

          {/* Loyalty Section */}
          <div className="bg-gradient-to-br from-[#0C1E36] to-[#091526] border border-[#0C1E36] rounded-3xl p-6 sm:p-8 text-left shadow-2xl relative overflow-hidden group min-h-[160px]">
            <div className="z-10 relative space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">👑</span>
                <span className="text-[11px] font-black text-blue-400 uppercase tracking-widest">Loyalty Club</span>
              </div>
              <h4 className="text-lg font-black text-white leading-tight">SliceSprint Rewards</h4>
              <p className="text-[12.5px] font-bold text-white/70 max-w-xs leading-normal">
                Earn 10 points on every ₹100 spent! Redeem points for completely free pizzas, sides, and sweet desserts.
              </p>
            </div>
            {/* Visual decoration */}
            <div className="absolute right-[-10%] bottom-[-10%] h-32 w-32 bg-blue-500/5 rounded-full z-0 group-hover:scale-110 transition-transform duration-500" />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[100px] opacity-5 select-none pointer-events-none z-0">🍕</span>
          </div>

        </div>

      </div>
      {toast && <Toast message={toast} type="success" onClose={() => setToast(null)} />}
    </div>
  );
};

export default OffersPage;
